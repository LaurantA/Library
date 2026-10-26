// Backup format.
//
// Version 1 (the original): one JSON file, { format: "bibliotheca-export", version: 1, volumes, alexandria, … }.
// Version 2 (this app):     the same JSON, plus
//     modules: { <module>: <document>, … }    — journal, cabinet, atlas …
//     media:   [ { id, name, type, w, h, bytes, added, file, thumb } ]  — index of stored images
//   saved as a plain .json when there are no images, or as a .zip when there are:
//     bibliotheca.json            the JSON above
//     media/<id>.<ext>            each image (working copy)
//     media/<id>.thumb.jpg        its thumbnail
//
// Restoring accepts v1 .json, v2 .json and v2 .zip. A v1 file replaces only the catalogue and
// leaves module data and images untouched (it knows nothing about them).
window.B = window.B || {};
(function () {
  const ext = (type) => ({ "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif", "image/heic": "heic" }[type] || "bin");
  const stamp = () => new Date().toISOString().slice(0, 10);

  async function build(catalogue) {
    const media = await B.media.all().catch(() => []);
    const index = media.map((r) => ({ id: r.id, name: r.name, type: r.type, w: r.w, h: r.h, bytes: r.bytes, added: r.added,
      file: "media/" + r.id + "." + ext(r.type), thumb: r.thumb ? "media/" + r.id + ".thumb.jpg" : null }));
    const payload = { ...catalogue, version: 2, modules: B.store.exportAll(), media: index };
    const json = JSON.stringify(payload, null, 2);
    if (!media.length) {
      return { payload, filename: "bibliotheca-" + stamp() + ".json", blob: new Blob([json], { type: "application/json" }) };
    }
    const files = { "bibliotheca.json": [fflate.strToU8(json), { level: 6 }] };
    for (let i = 0; i < media.length; i++) {
      files[index[i].file] = [new Uint8Array(await media[i].blob.arrayBuffer()), { level: 0 }];
      if (media[i].thumb) files[index[i].thumb] = [new Uint8Array(await media[i].thumb.arrayBuffer()), { level: 0 }];
    }
    const zipped = fflate.zipSync(files);
    return { payload, filename: "bibliotheca-" + stamp() + ".zip", blob: new Blob([zipped], { type: "application/zip" }) };
  }

  // Returns { data, media: [records with blobs] | null }. Throws with a readable message.
  async function read(file) {
    const head = new Uint8Array(await file.slice(0, 4).arrayBuffer());
    const isZip = head[0] === 0x50 && head[1] === 0x4b;
    let data, media = null;
    if (isZip) {
      let entries;
      try { entries = fflate.unzipSync(new Uint8Array(await file.arrayBuffer())); }
      catch (e) { throw new Error("That zip file couldn't be opened."); }
      if (!entries["bibliotheca.json"]) throw new Error("This zip doesn't contain a library backup.");
      data = JSON.parse(fflate.strFromU8(entries["bibliotheca.json"]));
      media = (data.media || []).map((m) => {
        const bytes = entries[m.file];
        if (!bytes) return null;
        const rec = { id: m.id, name: m.name, type: m.type, w: m.w, h: m.h, bytes: m.bytes, added: m.added, blob: new Blob([bytes], { type: m.type }) };
        if (m.thumb && entries[m.thumb]) rec.thumb = new Blob([entries[m.thumb]], { type: "image/jpeg" });
        return rec;
      }).filter(Boolean);
    } else {
      try { data = JSON.parse(await file.text()); }
      catch (e) { throw new Error("That file isn't readable JSON."); }
    }
    if (data.format !== "bibliotheca-export" || typeof data.version !== "number") throw new Error("This doesn't look like a library backup file.");
    if (!Array.isArray(data.volumes)) throw new Error("The backup is missing its catalogue data.");
    if (!isZip && data.media && data.media.length) throw new Error("This backup lists images but is only the .json — choose the .zip instead.");
    return { data, media };
  }

  // Applies the non-catalogue part of a restored backup.
  async function applyExtras(parsed) {
    const { data, media } = parsed;
    if (data.version < 2) return;
    await B.store.replaceAll(data.modules || {});
    await B.media.replaceAll(media || []);
  }

  function describe(parsed) {
    const d = parsed.data;
    const parts = [d.volumes.length + " books", (d.alexandria || []).length + " Alexandria", (d.quotes || []).length + " quotes"];
    const mods = Object.keys(d.modules || {});
    if (mods.length) parts.push(mods.length + (mods.length === 1 ? " module" : " modules"));
    if (parsed.media && parsed.media.length) parts.push(parsed.media.length + (parsed.media.length === 1 ? " image" : " images"));
    return parts.join(" · ") + (d.version < 2 ? " — an older backup: other modules and images are kept as they are." : "");
  }

  async function save(blob, filename) {
    try {
      const file = new File([blob], filename, { type: blob.type });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try { await navigator.share({ files: [file], title: filename }); return true; }
        catch (err) { if (err && err.name === "AbortError") return false; }
      }
    } catch (e) {}
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    return true;
  }

  B.backup = { build, read, applyExtras, describe, save };
})();
