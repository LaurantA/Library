// Storage for everything beyond the Library catalogue.
//
//   B.db      — a tiny promise wrapper around one IndexedDB database ("bibliotheca").
//   B.store   — module documents (journal, cabinet, atlas …): one JSON document per module,
//               held in memory, saved to IndexedDB on every change.
//   B.media   — images (and later any file): stored as Blobs in IndexedDB, never in localStorage.
//   B.bus     — a minimal event bus so modules can react to each other's changes.
//
// The Library catalogue itself stays where it always was (localStorage "library-catalogue-v1"),
// so the page keeps reading every existing backup and browser state unchanged.
window.B = window.B || {};
(function () {
  // ---------- event bus ----------
  const listeners = {};
  B.bus = {
    on(evt, fn) { (listeners[evt] = listeners[evt] || new Set()).add(fn); return () => listeners[evt].delete(fn); },
    emit(evt, data) { (listeners[evt] || []).forEach((fn) => { try { fn(data); } catch (e) { console.error(e); } }); }
  };

  // ---------- IndexedDB ----------
  const DB_NAME = "bibliotheca", DB_VERSION = 1;
  let dbPromise = null;
  function open() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      if (!window.indexedDB) return reject(new Error("This browser has no IndexedDB."));
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains("docs")) db.createObjectStore("docs");
        if (!db.objectStoreNames.contains("media")) db.createObjectStore("media", { keyPath: "id" });
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    return dbPromise;
  }
  function tx(storeName, mode, fn) {
    return open().then((db) => new Promise((resolve, reject) => {
      const t = db.transaction(storeName, mode);
      const st = t.objectStore(storeName);
      let result;
      Promise.resolve(fn(st)).then((r) => { result = r; });
      t.oncomplete = () => resolve(result);
      t.onerror = () => reject(t.error);
      t.onabort = () => reject(t.error);
    }));
  }
  const req2p = (req) => new Promise((res, rej) => { req.onsuccess = () => res(req.result); req.onerror = () => rej(req.error); });
  B.db = {
    get: (store, key) => tx(store, "readonly", (st) => req2p(st.get(key))),
    put: (store, value, key) => tx(store, "readwrite", (st) => { key === undefined ? st.put(value) : st.put(value, key); }),
    del: (store, key) => tx(store, "readwrite", (st) => { st.delete(key); }),
    all: (store) => tx(store, "readonly", (st) => req2p(st.getAll())),
    keys: (store) => tx(store, "readonly", (st) => req2p(st.getAllKeys())),
    clear: (store) => tx(store, "readwrite", (st) => { st.clear(); })
  };

  // ---------- module documents ----------
  const docs = {};
  B.store = {
    ready: false,
    async load() {
      try {
        const keys = await B.db.keys("docs");
        for (const k of keys) docs[k] = await B.db.get("docs", k);
      } catch (e) { console.warn("Module storage unavailable:", e); }
      this.ready = true;
    },
    get(module, fallback) { return docs[module] !== undefined ? docs[module] : fallback; },
    set(module, data) {
      docs[module] = data;
      B.bus.emit("store:" + module, data);
      return B.db.put("docs", data, module).catch((e) => { console.error(e); B.bus.emit("toast", "Couldn't save — browser storage refused."); });
    },
    update(module, fn, fallback) { return this.set(module, fn(this.get(module, fallback))); },
    exportAll() { return JSON.parse(JSON.stringify(docs)); },
    async replaceAll(next) {
      await B.db.clear("docs");
      Object.keys(docs).forEach((k) => delete docs[k]);
      for (const k of Object.keys(next || {})) { docs[k] = next[k]; await B.db.put("docs", next[k], k); B.bus.emit("store:" + k, next[k]); }
    }
  };

  // ---------- media ----------
  // Record: { id, name, type, blob, thumb (Blob), w, h, bytes, added }
  const urlCache = new Map();
  const MAX_EDGE = 4000, THUMB_EDGE = 480, QUALITY = 0.88;

  function loadImage(blob) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Not a readable image.")); };
      img.src = url;
    });
  }
  function scale(img, edge, type, quality) {
    const k = Math.min(1, edge / Math.max(img.naturalWidth, img.naturalHeight));
    const w = Math.round(img.naturalWidth * k), h = Math.round(img.naturalHeight * k);
    const c = document.createElement("canvas"); c.width = w; c.height = h;
    const g = c.getContext("2d"); g.imageSmoothingQuality = "high"; g.drawImage(img, 0, 0, w, h);
    return new Promise((res) => c.toBlob((b) => res({ blob: b, w, h }), type, quality));
  }
  const newId = () => "img-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7);

  B.media = {
    // Takes a File/Blob from an <input type=file>, stores a working copy (long edge ≤ 4000 px) and a thumbnail.
    async add(file) {
      const img = await loadImage(file);
      const big = Math.max(img.naturalWidth, img.naturalHeight) > MAX_EDGE || file.size > 6e6;
      const main = big ? await scale(img, MAX_EDGE, "image/jpeg", QUALITY) : { blob: file, w: img.naturalWidth, h: img.naturalHeight };
      const thumb = await scale(img, THUMB_EDGE, "image/jpeg", 0.82);
      const rec = { id: newId(), name: file.name || "image", type: main.blob.type || file.type, blob: main.blob, thumb: thumb.blob, w: main.w, h: main.h, bytes: main.blob.size, added: new Date().toISOString() };
      await B.db.put("media", rec);
      B.bus.emit("media", rec.id);
      return rec.id;
    },
    get: (id) => B.db.get("media", id),
    async remove(id) {
      ["full", "thumb"].forEach((k) => { const u = urlCache.get(id + k); if (u) { URL.revokeObjectURL(u); urlCache.delete(id + k); } });
      await B.db.del("media", id);
      B.bus.emit("media", id);
    },
    // Object URL for an <img src>; size "thumb" or "full".
    async url(id, size = "thumb") {
      const k = id + size;
      if (urlCache.has(k)) return urlCache.get(k);
      const rec = await B.db.get("media", id);
      if (!rec) return "";
      const u = URL.createObjectURL(size === "thumb" && rec.thumb ? rec.thumb : rec.blob);
      urlCache.set(k, u);
      return u;
    },
    all: () => B.db.all("media"),
    async replaceAll(records) {
      urlCache.forEach((u) => URL.revokeObjectURL(u)); urlCache.clear();
      await B.db.clear("media");
      for (const r of records) await B.db.put("media", r);
      B.bus.emit("media", null);
    },
    async usage() {
      const recs = await B.db.all("media");
      return { count: recs.length, bytes: recs.reduce((s, r) => s + (r.bytes || 0) + (r.thumb ? r.thumb.size : 0), 0) };
    }
  };

  // Ask the browser not to evict our data under storage pressure (Safari / Chrome honour this differently).
  B.requestPersistence = async function () {
    try {
      if (navigator.storage && navigator.storage.persist) {
        const already = await navigator.storage.persisted();
        return already || await navigator.storage.persist();
      }
    } catch (e) {}
    return false;
  };
})();
