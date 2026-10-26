// Cabinet — rare pieces: prints, drawings, maps, manuscripts, objects.
//
// Stored as one document in B.store under "cabinet":
//   { objects: [Object], groups: [Group] }
//   Object: { id, kind, title, maker, after, publisher, series, number, date, technique, dimensions,
//             paper, condition, provenance, acqDate, acqSource, acqNote, catalogueText, catalogueLang,
//             essay, groupId, books: [bookId], tags: [string], images: [mediaId], created, updated }
//   Group (an ensemble, e.g. "Vestigi delle antichità di Roma — twelve plates"):
//           { id, title, subtitle, essay, order: [objectId] }
// Images live in the media store (B.media); the objects only hold their ids.
(function () {
  const { React, html, S, H, Brand, ThemeToggle, useTheme, useMediaUrl, Prose, Thumb, Lightbox } = B.ui;
  const { useState, useEffect, useMemo, useRef } = React;

  const KINDS = ["Print", "Drawing", "Map", "Photograph", "Manuscript", "Book", "Coin / Medal", "Object"];
  const EMPTY = { objects: [], groups: [] };
  const uid = (p) => p + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 6);
  const blankObject = () => ({ id: null, kind: "Print", title: "", maker: "", after: "", publisher: "", series: "", number: "", date: "", technique: "", dimensions: "", paper: "", condition: "", provenance: "", acqDate: "", acqSource: "", acqNote: "", catalogueText: "", catalogueLang: "", essay: "", groupId: "", books: [], tags: [], images: [] });
  const makerLine = (o) => [o.maker, o.after ? "after " + o.after : ""].filter(Boolean).join(" ");
  const kickerLine = (o) => [o.kind, o.date].filter(Boolean).join(" · ");
  const numberLabel = (o) => o.number ? (o.kind === "Print" ? "Pl. " : "No. ") + o.number : "";
  const numSort = (a, b) => (parseFloat(a.number) || 1e9) - (parseFloat(b.number) || 1e9) || a.title.localeCompare(b.title);

  // Objects of a group, in the group's own order, then any not yet ordered (by number).
  function groupObjects(doc, g) {
    const members = doc.objects.filter((o) => o.groupId === g.id);
    const ordered = (g.order || []).map((id) => members.find((o) => o.id === id)).filter(Boolean);
    return ordered.concat(members.filter((o) => ordered.indexOf(o) === -1).sort(numSort));
  }

  // ---------- small pieces ----------
  function ObjectCard({ o, onOpen }) {
    return html`
      <div className="card cab-card" onClick=${onOpen}>
        <div className="cab-thumb">${o.images[0] ? html`<${Thumb} id=${o.images[0]} alt=${o.title} />` : html`<span className="cab-thumb-empty">${o.kind}</span>`}</div>
        <div className="cab-card-text">
          <div className="cab-kicker">${kickerLine(o) || " "}</div>
          <div className="cab-title">${o.title || "Untitled"}</div>
          ${makerLine(o) ? html`<div className="cab-maker">${makerLine(o)}</div>` : null}
          ${numberLabel(o) ? html`<div className="card-meta">${numberLabel(o)}${o.series ? " · " + o.series : ""}</div>` : null}
        </div>
      </div>`;
  }

  // ---------- object page ----------
  function ObjectPage({ doc, o, books, onBack, onEdit, onOpen, onOpenGroup }) {
    const [img, setImg] = useState(0);
    const [light, setLight] = useState(null);
    useEffect(() => { setImg(0); window.scrollTo(0, 0); }, [o.id]);
    const group = doc.groups.find((g) => g.id === o.groupId);
    const siblings = group ? groupObjects(doc, group) : [];
    const pos = siblings.findIndex((x) => x.id === o.id);
    const linked = (o.books || []).map((id) => books.find((b) => b.id === id)).filter(Boolean);
    const acquisition = [o.acqDate, o.acqSource, o.acqNote].filter(Boolean).join(" · ");
    const facts = [["Series", o.series], [o.kind === "Print" ? "Plate" : "Number", o.number], ["Date", o.date], ["Maker", o.maker], ["After", o.after], ["Publisher", o.publisher],
      ["Technique", o.technique], ["Dimensions", o.dimensions], ["Paper & marks", o.paper], ["Condition", o.condition], ["Provenance", o.provenance], ["Acquired", acquisition]].filter((f) => f[1]);
    return html`
      <div>
        <div style=${S("display:flex;align-items:center;gap:var(--space-3);flex-wrap:wrap;padding:var(--space-4) var(--space-6) 0 var(--space-6);font-size:14px;")}>
          <button className="btn btn-ghost" onClick=${onBack}>← Cabinet</button>
          ${group ? html`<span style=${S("color:var(--color-neutral-600);")}>/</span><button className="btn btn-ghost" onClick=${() => onOpenGroup(group.id)}>${group.title}</button>` : null}
          <div style=${S("margin-left:auto;display:flex;gap:var(--space-2);align-items:center;")}>
            ${group && siblings.length > 1 ? html`
              <button className="btn btn-ghost" disabled=${pos <= 0} onClick=${() => onOpen(siblings[pos - 1].id)}>‹ Previous</button>
              <span style=${S("color:var(--color-neutral-700);font-size:13px;")}>${pos + 1} / ${siblings.length}</span>
              <button className="btn btn-ghost" disabled=${pos >= siblings.length - 1} onClick=${() => onOpen(siblings[pos + 1].id)}>Next ›</button>` : null}
            <button className="btn btn-secondary" onClick=${onEdit}>Edit</button>
          </div>
        </div>
        <div className="cab-object">
          <div>
            <div className="cab-stage" onClick=${() => o.images.length && setLight(img)}>
              ${o.images.length ? html`<${Thumb} id=${o.images[img]} size="full" alt=${o.title} />` : html`<span className="cab-thumb-empty" style=${S("padding:80px 0;")}>No image yet</span>`}
            </div>
            ${o.images.length > 1 ? html`
              <div className="cab-strip">${o.images.map((id, i) => html`
                <div key=${id} className=${"cab-strip-item" + (i === img ? " is-on" : "")} onClick=${() => setImg(i)}><${Thumb} id=${id} /></div>`)}
              </div>` : null}
          </div>
          <div>
            <div className="cab-kicker">${kickerLine(o)}</div>
            <h1 style=${S("font-size:34px;margin:var(--space-1) 0 var(--space-2) 0;")}>${o.title || "Untitled"}</h1>
            ${makerLine(o) ? html`<div style=${S("font-size:16px;color:var(--color-neutral-700);")}>${makerLine(o)}</div>` : null}
            ${facts.length ? html`<dl className="cab-facts">${facts.map(([k, val]) => html`<${React.Fragment} key=${k}><dt>${k}</dt><dd>${val}</dd><//>`)}</dl>` : null}
            ${linked.length ? html`
              <div className="cab-block-label">On the shelves</div>
              ${linked.map((b) => html`<div key=${b.id} style=${S("font-size:14px;margin-bottom:4px;")}><i>${b.title}</i> — ${b.author}</div>`)}` : null}
            ${B.atlas && B.atlas.sitesForTags(o.tags).length ? html`
              <div className="cab-block-label">On the map</div>
              ${B.atlas.sitesForTags(o.tags).map((x) => html`<div key=${x.href} style=${S("font-size:14px;margin-bottom:3px;")}><a href=${x.href}>${x.name} →</a></div>`)}` : null}
            ${(o.tags || []).length ? html`
              <div style=${S("display:flex;gap:var(--space-1);flex-wrap:wrap;margin-top:var(--space-4);")}>${o.tags.map((t) => html`<span key=${t} className="tag tag-outline">${t}</span>`)}</div>` : null}
          </div>
        </div>
        ${o.essay || o.catalogueText ? html`
          <div className="cab-section" style=${S("padding-top:0;")}>
            ${o.essay ? html`<div className="cab-block-label">Commentary</div><${Prose} text=${o.essay} style=${S("max-width:72ch;font-size:15px;")} />` : null}
            ${o.catalogueText ? html`
              <div className="cab-block-label">Catalogue description${o.catalogueLang ? " (" + o.catalogueLang + ")" : ""}</div>
              <div className="cab-verbatim" style=${S("max-width:72ch;")}>${o.catalogueText}</div>` : null}
          </div>` : null}
        ${light !== null ? html`<${Lightbox} ids=${o.images} index=${light} caption=${o.title} onClose=${() => setLight(null)} />` : null}
      </div>`;
  }

  // ---------- ensemble page ----------
  function GroupPage({ doc, g, onBack, onOpen, onEditGroup }) {
    useEffect(() => { window.scrollTo(0, 0); }, [g.id]);
    const items = groupObjects(doc, g);
    return html`
      <div>
        <div style=${S("display:flex;align-items:center;gap:var(--space-3);padding:var(--space-4) var(--space-6) 0 var(--space-6);")}>
          <button className="btn btn-ghost" onClick=${onBack}>← Cabinet</button>
          <button className="btn btn-secondary" style=${S("margin-left:auto;")} onClick=${onEditGroup}>Edit ensemble</button>
        </div>
        <div className="cab-section">
          <div className="cab-kicker">Ensemble · ${items.length} ${items.length === 1 ? "piece" : "pieces"}</div>
          <h1 style=${S("font-size:38px;margin:var(--space-1) 0 var(--space-1) 0;")}>${g.title}</h1>
          ${g.subtitle ? html`<div className="cab-sub" style=${S("font-size:17px;")}>${g.subtitle}</div>` : null}
          <${Prose} text=${g.essay} style=${S("max-width:72ch;font-size:15px;margin-top:var(--space-4);")} />
          ${g.catalogueText ? html`
            <div className="cab-block-label">Catalogue description${g.catalogueLang ? " (" + g.catalogueLang + ")" : ""}</div>
            <div className="cab-verbatim" style=${S("max-width:72ch;")}>${g.catalogueText}</div>` : null}
          <div style=${S("margin-top:var(--space-6);")}>
            ${items.map((o) => html`
              <div key=${o.id} className="cab-plate" onClick=${() => onOpen(o.id)}>
                <div className="cab-thumb" style=${S("border:1px solid var(--color-divider);border-radius:var(--radius-sm);")}>${o.images[0] ? html`<${Thumb} id=${o.images[0]} />` : html`<span className="cab-thumb-empty">${o.kind}</span>`}</div>
                <div>
                  <div className="cab-kicker">${[numberLabel(o), o.date].filter(Boolean).join(" · ")}</div>
                  <div className="cab-title" style=${S("font-size:22px;margin:2px 0 4px 0;")}>${o.title || "Untitled"}</div>
                  ${makerLine(o) ? html`<div className="cab-maker">${makerLine(o)}</div>` : null}
                  ${o.essay ? html`<p style=${S("font-size:14px;line-height:1.6;margin:var(--space-2) 0 0 0;max-width:70ch;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;")}>${o.essay}</p>` : null}
                </div>
              </div>`)}
            ${!items.length ? html`<p className="cab-sub">No pieces yet — choose this ensemble in a piece's form to add it here.</p>` : null}
          </div>
        </div>
      </div>`;
  }

  // ---------- forms ----------
  function Field({ label, children, full }) {
    return html`<div className=${"field" + (full ? " full" : "")}><label>${label}</label>${children}</div>`;
  }

  function ObjectForm({ initial, doc, books, onSave, onCancel, onDelete }) {
    const [d, setD] = useState(() => ({ ...blankObject(), ...initial, books: [...(initial.books || [])], tags: [...(initial.tags || [])], images: [...(initial.images || [])] }));
    const added = useRef([]);           // images uploaded during this edit (deleted again on cancel)
    const [busy, setBusy] = useState(false);
    const [bookQ, setBookQ] = useState("");
    const [tagIn, setTagIn] = useState("");
    const [err, setErr] = useState("");
    const set = (k) => (e) => setD({ ...d, [k]: e.target.value });
    const inp = (k, ph) => html`<input className="input" value=${d[k] || ""} placeholder=${ph || ""} onChange=${set(k)} />`;

    const addImages = async (e) => {
      const files = [...(e.target.files || [])]; e.target.value = "";
      if (!files.length) return;
      setBusy(true); setErr("");
      const ids = [];
      for (const f of files) {
        try { const id = await B.media.add(f); ids.push(id); added.current.push(id); }
        catch (x) { setErr((f.name || "A file") + ": " + (x.message || x)); }
      }
      setD((cur) => ({ ...cur, images: [...cur.images, ...ids] }));
      setBusy(false);
    };
    const moveImg = (i, dir) => { const a = [...d.images]; const j = i + dir; [a[i], a[j]] = [a[j], a[i]]; setD({ ...d, images: a }); };
    const dropImg = (i) => setD({ ...d, images: d.images.filter((_, k) => k !== i) });
    const bookMatches = bookQ.trim().length < 2 ? [] : books.filter((b) => d.books.indexOf(b.id) === -1 && (b.title + " " + b.author).toLowerCase().indexOf(bookQ.trim().toLowerCase()) !== -1).slice(0, 8);
    const addTag = () => { const t = tagIn.trim(); if (t && d.tags.indexOf(t) === -1) setD({ ...d, tags: [...d.tags, t] }); setTagIn(""); };
    const cancel = async () => { for (const id of added.current) await B.media.remove(id); onCancel(); };
    const save = async () => {
      if (!d.title.trim()) { setErr("Give the piece a title."); return; }
      const removed = (initial.images || []).filter((id) => d.images.indexOf(id) === -1);
      for (const id of removed) await B.media.remove(id);
      onSave(d);
    };

    return html`
      <div className="dialog-backdrop" style=${S("z-index:1000;")}>
        <div className="dialog" onClick=${(e) => e.stopPropagation()} style=${S("max-width:820px;width:94vw;max-height:90vh;overflow:auto;")}>
          <div className="dialog-title">${initial.id ? "Edit piece" : "Add a piece"}</div>
          <div className="dialog-body" style=${S("opacity:1;")}>
            <div className="cab-form">
              <div className="cab-form-section">Images</div>
              <div className="full">
                <div className="cab-img-edit">
                  ${d.images.map((id, i) => html`
                    <div key=${id} className="cab-img-tile">
                      <div className="pic"><${Thumb} id=${id} /></div>
                      <div className="row">
                        <button disabled=${i === 0} onClick=${() => moveImg(i, -1)} title="Move left">‹</button>
                        <span style=${S("color:var(--color-neutral-700);padding-top:3px;")}>${i === 0 ? "cover" : i + 1}</span>
                        <button disabled=${i === d.images.length - 1} onClick=${() => moveImg(i, 1)} title="Move right">›</button>
                        <button onClick=${() => dropImg(i)} title="Remove">×</button>
                      </div>
                    </div>`)}
                  <label className="cab-img-tile" style=${S("display:flex;align-items:center;justify-content:center;height:108px;cursor:pointer;color:var(--color-accent-700);text-align:center;")}>
                    ${busy ? "Storing…" : "+ Add images"}
                    <input type="file" accept="image/*" multiple style=${S("display:none;")} onChange=${addImages} />
                  </label>
                </div>
                <div style=${S("font-size:12px;color:var(--color-neutral-700);margin-top:6px;")}>Front, back, details, watermark. The first image is the cover. Large photos are stored at up to 4000 px.</div>
              </div>

              <div className="cab-form-section">Identification</div>
              <${Field} label="Title" full>${inp("title", "e.g. The Mausoleum of Augustus with the Soderini garden")}<//>
              <${Field} label="Kind"><select className="input" value=${d.kind} onChange=${set("kind")}>${KINDS.map((k) => html`<option key=${k} value=${k}>${k}</option>`)}</select><//>
              <${Field} label="Date">${inp("date", "e.g. c. 1680 / 1606")}<//>
              <${Field} label="Maker (artist, engraver)">${inp("maker", "e.g. Aegidius Sadeler II")}<//>
              <${Field} label="After (inventor, designer)">${inp("after", "e.g. Étienne Dupérac")}<//>
              <${Field} label="Publisher (excudit)">${inp("publisher", "e.g. Marco Sadeler; G. G. de Rossi")}<//>
              <${Field} label="Series / work">${inp("series", "e.g. Vestigi delle antichità di Roma")}<//>
              <${Field} label="Plate / number">${inp("number", "e.g. 34")}<//>
              <${Field} label="Ensemble">
                <select className="input" value=${d.groupId} onChange=${set("groupId")}>
                  <option value="">— none</option>
                  ${doc.groups.map((g) => html`<option key=${g.id} value=${g.id}>${g.title}</option>`)}
                </select>
              <//>

              <div className="cab-form-section">The object</div>
              <${Field} label="Technique">${inp("technique", "e.g. etching and engraving")}<//>
              <${Field} label="Dimensions">${inp("dimensions", "e.g. sheet 22.8 × 39 cm; plate …")}<//>
              <${Field} label="Paper, watermark, marks">${inp("paper", "e.g. laid paper, watermark")}<//>
              <${Field} label="Condition">${inp("condition", "e.g. foxing, trimmed to the platemark")}<//>

              <div className="cab-form-section">History</div>
              <${Field} label="Provenance" full>${inp("provenance", "e.g. Collection Heinz Peter Barandun")}<//>
              <${Field} label="Acquired (date)">${inp("acqDate", "e.g. October 2026")}<//>
              <${Field} label="Acquired from">${inp("acqSource", "e.g. auction house, lot")}<//>
              <${Field} label="Acquisition note (private)" full>${inp("acqNote", "price, circumstances…")}<//>

              <div className="cab-form-section">Texts</div>
              <${Field} label="Commentary — your own text" full>
                <textarea className="input" style=${S("min-height:180px;")} value=${d.essay} onChange=${set("essay")} placeholder="Blank lines start new paragraphs."></textarea>
              <//>
              <${Field} label="Catalogue description — verbatim" full>
                <textarea className="input" value=${d.catalogueText} onChange=${set("catalogueText")} placeholder="The dealer's or auction catalogue's wording, unchanged."></textarea>
              <//>
              <${Field} label="Language of the description">${inp("catalogueLang", "e.g. German")}<//>

              <div className="cab-form-section">Connections</div>
              <${Field} label="Books on your shelves" full>
                <div style=${S("display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px;")}>
                  ${d.books.map((id) => { const b = books.find((x) => x.id === id); return html`<span key=${id} className="tag tag-outline" style=${S("cursor:pointer;")} title="Remove" onClick=${() => setD({ ...d, books: d.books.filter((x) => x !== id) })}>${b ? b.title : id} ×</span>`; })}
                </div>
                <div style=${S("position:relative;")}>
                  <input className="input" value=${bookQ} placeholder="Search title or author…" onChange=${(e) => setBookQ(e.target.value)} />
                  ${bookMatches.length ? html`
                    <div style=${S("position:absolute;top:100%;left:0;right:0;z-index:10;background:var(--color-bg);border:1px solid var(--color-divider);border-radius:var(--radius-sm);box-shadow:var(--shadow-md);max-height:200px;overflow:auto;")}>
                      ${bookMatches.map((b) => html`<div key=${b.id} className=${H("hover", "background: var(--color-accent-100);")} style=${S("padding:var(--space-2);cursor:pointer;font-size:14px;")} onClick=${() => { setD({ ...d, books: [...d.books, b.id] }); setBookQ(""); }}><i>${b.title}</i> — ${b.author}</div>`)}
                    </div>` : null}
                </div>
              <//>
              <${Field} label="Tags" full>
                <div style=${S("display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px;")}>
                  ${d.tags.map((t) => html`<span key=${t} className="tag tag-outline" style=${S("cursor:pointer;")} title="Remove" onClick=${() => setD({ ...d, tags: d.tags.filter((x) => x !== t) })}>${t} ×</span>`)}
                </div>
                <div style=${S("display:flex;gap:var(--space-2);")}>
                  <input className="input" value=${tagIn} placeholder="e.g. Sixtus V, obelisks, Baths" onChange=${(e) => setTagIn(e.target.value)} onKeyDown=${(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }} />
                  <button className="btn btn-secondary" onClick=${addTag}>Add</button>
                </div>
              <//>
            </div>
            ${err ? html`<div style=${S("color:#a33;font-size:13px;margin-top:var(--space-2);")}>${err}</div>` : null}
          </div>
          <div className="dialog-actions cab-actions">
            ${initial.id ? html`<button className="btn btn-ghost" style=${S("margin-right:auto;color:#a33;")} onClick=${() => { if (confirm("Delete this piece and its images?")) onDelete(d); }}>Delete piece</button>` : null}
            <button className="btn btn-ghost" onClick=${cancel}>Cancel</button>
            <button className="btn btn-primary" disabled=${busy} onClick=${save}>Save</button>
          </div>
        </div>
      </div>`;
  }

  function GroupForm({ initial, doc, onSave, onCancel, onDelete }) {
    const [d, setD] = useState(() => ({ title: "", subtitle: "", essay: "", order: [], ...initial }));
    const members = initial.id ? groupObjects(doc, initial) : [];
    const [order, setOrder] = useState(members.map((o) => o.id));
    const byId = (id) => doc.objects.find((o) => o.id === id);
    const move = (i, dir) => { const a = [...order]; const j = i + dir; [a[i], a[j]] = [a[j], a[i]]; setOrder(a); };
    const sortByNumber = () => setOrder([...order].sort((a, b) => numSort(byId(a), byId(b))));
    return html`
      <div className="dialog-backdrop" style=${S("z-index:1000;")}>
        <div className="dialog" onClick=${(e) => e.stopPropagation()} style=${S("max-width:760px;width:94vw;max-height:90vh;overflow:auto;")}>
          <div className="dialog-title">${initial.id ? "Edit ensemble" : "New ensemble"}</div>
          <div className="dialog-body" style=${S("opacity:1;")}>
            <div className="cab-form">
              <${Field} label="Title" full><input className="input" value=${d.title} placeholder="e.g. The Peretti and Their Rome" onChange=${(e) => setD({ ...d, title: e.target.value })} /><//>
              <${Field} label="Subtitle" full><input className="input" value=${d.subtitle} placeholder="e.g. A family in six prints" onChange=${(e) => setD({ ...d, subtitle: e.target.value })} /><//>
              <${Field} label="Essay" full><textarea className="input" style=${S("min-height:220px;")} value=${d.essay} placeholder="The story the pieces tell together. Blank lines start new paragraphs; a line starting with ## becomes a heading." onChange=${(e) => setD({ ...d, essay: e.target.value })}></textarea><//>
              <${Field} label="Catalogue description for the whole lot — verbatim" full><textarea className="input" value=${d.catalogueText || ""} placeholder="The auction wording when it describes the ensemble as one lot." onChange=${(e) => setD({ ...d, catalogueText: e.target.value })}></textarea><//>
              <${Field} label="Language of the description"><input className="input" value=${d.catalogueLang || ""} placeholder="e.g. German" onChange=${(e) => setD({ ...d, catalogueLang: e.target.value })} /><//>
              ${order.length ? html`
                <div className="field full">
                  <label style=${S("display:flex;align-items:center;")}>Order of pieces<button className="btn btn-ghost" style=${S("margin-left:auto;font-size:13px;")} onClick=${sortByNumber}>Sort by plate number</button></label>
                  ${order.map((id, i) => html`
                    <div key=${id} style=${S("display:flex;align-items:center;gap:var(--space-2);padding:4px 0;border-bottom:1px solid var(--color-divider);font-size:14px;")}>
                      <span style=${S("width:28px;color:var(--color-neutral-700);")}>${i + 1}.</span>
                      <span style=${S("flex:1;")}>${numberLabel(byId(id)) ? numberLabel(byId(id)) + " — " : ""}${byId(id).title}</span>
                      <button className="btn btn-ghost" disabled=${i === 0} onClick=${() => move(i, -1)}>↑</button>
                      <button className="btn btn-ghost" disabled=${i === order.length - 1} onClick=${() => move(i, 1)}>↓</button>
                    </div>`)}
                </div>` : null}
            </div>
          </div>
          <div className="dialog-actions cab-actions">
            ${initial.id ? html`<button className="btn btn-ghost" style=${S("margin-right:auto;color:#a33;")} onClick=${() => { if (confirm("Delete this ensemble? Its pieces stay in the Cabinet.")) onDelete(initial); }}>Delete ensemble</button>` : null}
            <button className="btn btn-ghost" onClick=${onCancel}>Cancel</button>
            <button className="btn btn-primary" onClick=${() => d.title.trim() && onSave({ ...d, order })}>Save</button>
          </div>
        </div>
      </div>`;
  }

  // ---------- module ----------
  function readRoute() {
    const [, sub, id] = (location.hash || "").replace(/^#\/?/, "").split("/");
    return sub === "piece" || sub === "ensemble" ? { mode: sub, id } : { mode: "index" };
  }

  function Cabinet({ modules, active, go }) {
    const [doc, setDoc] = useState(() => B.store.get("cabinet", EMPTY));
    const [theme, toggleTheme] = useTheme();
    const [route, setRoute] = useState(readRoute);
    const [q, setQ] = useState("");
    const [kind, setKind] = useState("");
    const [form, setForm] = useState(null);       // { type: "object" | "group", initial }
    const [menu, setMenu] = useState(false);
    const [toast, setToast] = useState("");
    const books = useMemo(() => (B.libraryData().books || []).slice().sort((a, b) => a.title.localeCompare(b.title)), []);

    useEffect(() => B.bus.on("store:cabinet", (d) => setDoc(d)), []);
    useEffect(() => { const f = () => setRoute(readRoute()); window.addEventListener("hashchange", f); return () => window.removeEventListener("hashchange", f); }, []);
    const nav = (mode, id) => { location.hash = mode === "index" ? "#cabinet" : "#cabinet/" + mode + "/" + id; };
    const commit = (next) => { setDoc(next); B.store.set("cabinet", next); };
    const say = (m) => { setToast(m); setTimeout(() => setToast((t) => t === m ? "" : t), 2500); };

    const saveObject = (d) => {
      const now = new Date().toISOString();
      const isNew = !d.id;
      const obj = { ...d, id: d.id || uid("obj"), updated: now, created: d.created || now };
      const objects = isNew ? [...doc.objects, obj] : doc.objects.map((o) => o.id === obj.id ? obj : o);
      // keep the ensemble's explicit order in step with membership
      const groups = doc.groups.map((g) => {
        const order = (g.order || []).filter((id) => id !== obj.id || obj.groupId === g.id);
        if (obj.groupId === g.id && order.indexOf(obj.id) === -1 && (g.order || []).length) order.push(obj.id);
        return { ...g, order };
      });
      commit({ ...doc, objects, groups });
      setForm(null);
      if (isNew) nav("piece", obj.id);
      say(isNew ? "Piece added" : "Saved");
    };
    const deleteObject = async (d) => {
      for (const id of d.images || []) await B.media.remove(id);
      commit({ ...doc, objects: doc.objects.filter((o) => o.id !== d.id), groups: doc.groups.map((g) => ({ ...g, order: (g.order || []).filter((id) => id !== d.id) })) });
      setForm(null); nav("index"); say("Piece deleted");
    };
    const saveGroup = (d) => {
      const isNew = !d.id;
      const g = { ...d, id: d.id || uid("ens") };
      commit({ ...doc, groups: isNew ? [...doc.groups, g] : doc.groups.map((x) => x.id === g.id ? g : x) });
      setForm(null);
      if (isNew) nav("ensemble", g.id);
    };
    const deleteGroup = (g) => {
      commit({ objects: doc.objects.map((o) => o.groupId === g.id ? { ...o, groupId: "" } : o), groups: doc.groups.filter((x) => x.id !== g.id) });
      setForm(null); nav("index");
    };
    const backup = async () => { setMenu(false); try { if (await B.backup.backupAll()) say("Backup saved"); } catch (e) { say("Backup failed: " + e.message); } };

    // filtering
    const ql = q.trim().toLowerCase();
    const hay = (o) => [o.title, o.maker, o.after, o.publisher, o.series, o.number, o.date, o.essay, o.catalogueText, o.provenance, (o.tags || []).join(" ")].join(" ").toLowerCase();
    const visible = doc.objects.filter((o) => (!kind || o.kind === kind) && (!ql || hay(o).indexOf(ql) !== -1));
    const kindsPresent = KINDS.filter((k) => doc.objects.some((o) => o.kind === k));
    const sections = doc.groups.map((g) => ({ g, items: groupObjects(doc, g).filter((o) => visible.indexOf(o) !== -1) }));
    const loose = visible.filter((o) => !o.groupId || !doc.groups.some((g) => g.id === o.groupId)).sort((a, b) => a.title.localeCompare(b.title));
    const imageCount = doc.objects.reduce((n, o) => n + o.images.length, 0);

    const current = route.mode === "piece" ? doc.objects.find((o) => o.id === route.id) : null;
    const currentGroup = route.mode === "ensemble" ? doc.groups.find((g) => g.id === route.id) : null;

    let body;
    if (current) {
      body = html`<${ObjectPage} doc=${doc} o=${current} books=${books} onBack=${() => nav("index")} onEdit=${() => setForm({ type: "object", initial: current })} onOpen=${(id) => nav("piece", id)} onOpenGroup=${(id) => nav("ensemble", id)} />`;
    } else if (currentGroup) {
      body = html`<${GroupPage} doc=${doc} g=${currentGroup} onBack=${() => nav("index")} onOpen=${(id) => nav("piece", id)} onEditGroup=${() => setForm({ type: "group", initial: currentGroup })} />`;
    } else {
      body = html`
        <div>
          ${doc.objects.length ? html`
            <div style=${S("display:flex;gap:var(--space-3);align-items:center;flex-wrap:wrap;padding:var(--space-4) var(--space-6);border-bottom:1px solid var(--color-divider);")}>
              <div className="seg">
                <label className="seg-opt"><input type="radio" checked=${!kind} onChange=${() => setKind("")} />All</label>
                ${kindsPresent.map((k) => html`<label key=${k} className="seg-opt"><input type="radio" checked=${kind === k} onChange=${() => setKind(k)} />${k}</label>`)}
              </div>
              <div style=${S("font-size:13px;color:var(--color-neutral-700);margin-left:auto;")}>${visible.length} of ${doc.objects.length} pieces · ${doc.groups.length} ${doc.groups.length === 1 ? "ensemble" : "ensembles"} · ${imageCount} images</div>
            </div>` : null}
          ${sections.filter((s) => s.items.length || (!ql && !kind)).map(({ g, items }) => html`
            <section key=${g.id} className="cab-section">
              <h2 className="cab-h2" style=${S("cursor:pointer;")} onClick=${() => nav("ensemble", g.id)}>${g.title}</h2>
              <div className="cab-sub">${g.subtitle ? g.subtitle + " · " : ""}<a href=${"#cabinet/ensemble/" + g.id}>read the ensemble</a></div>
              ${items.length ? html`<div className="cab-grid">${items.map((o) => html`<${ObjectCard} key=${o.id} o=${o} onOpen=${() => nav("piece", o.id)} />`)}</div>`
                : html`<p className="cab-sub">No pieces in this ensemble yet.</p>`}
            </section>`)}
          ${loose.length ? html`
            <section className="cab-section">
              <h2 className="cab-h2">${doc.groups.length ? "Single pieces" : "Pieces"}</h2>
              <div className="cab-sub"></div>
              <div className="cab-grid">${loose.map((o) => html`<${ObjectCard} key=${o.id} o=${o} onOpen=${() => nav("piece", o.id)} />`)}</div>
            </section>` : null}
          ${!doc.objects.length ? html`
            <section className="cab-section" style=${S("max-width:68ch;")}>
              <h2 className="cab-h2" style=${S("margin-bottom:var(--space-3);")}>The Cabinet</h2>
              <p>A place for the rare pieces: prints, drawings, maps, manuscripts, objects. Each piece holds its images (front, back, details), the dealer's or auction description word for word, your own commentary, its provenance, and links to books on your shelves.</p>
              <p>Pieces that belong together, such as the twelve Sadeler plates or the six Peretti prints, form an <i>ensemble</i> with its own essay and order.</p>
              <div style=${S("display:flex;gap:var(--space-2);margin-top:var(--space-4);")}>
                <button className="btn btn-primary" onClick=${() => setForm({ type: "object", initial: blankObject() })}>+ Add the first piece</button>
                <button className="btn btn-secondary" onClick=${() => setForm({ type: "group", initial: {} })}>New ensemble</button>
              </div>
            </section>` : null}
          ${doc.objects.length && !visible.length ? html`<p className="cab-sub" style=${S("padding:var(--space-6);")}>Nothing matches.</p>` : null}
        </div>`;
    }

    return html`
      <div className="cab-page" data-theme=${theme}>
        <div className="nav" style=${S("position:sticky;top:0;z-index:20;display:block;background-color:var(--color-bg);")}>
          <div style=${S("display:flex;flex-direction:column;gap:var(--space-3);width:100%;")}>
            <div style=${S("display:flex;align-items:baseline;justify-content:space-between;gap:var(--space-3);width:100%;")}>
              <${Brand} title="Cabinet" modules=${modules} active=${active} go=${go} />
              <div style=${S("display:flex;align-items:center;gap:var(--space-2);flex-shrink:0;")}>
                <${ThemeToggle} theme=${theme} onToggle=${toggleTheme} />
                <div style=${S("position:relative;")}>
                  <button className="btn btn-ghost" onClick=${() => setMenu(!menu)} onBlur=${() => setTimeout(() => setMenu(false), 180)} title="Tools" style=${S("font-size:18px;line-height:1;padding-left:10px;padding-right:10px;")}>⋮</button>
                  ${menu ? html`
                    <div style=${S("position:absolute;top:100%;right:0;z-index:40;min-width:230px;background:var(--color-bg);border:1px solid var(--color-divider);border-radius:var(--radius-sm);box-shadow:var(--shadow-md);padding:var(--space-2) 0;")}>
                      <div style=${S("padding:var(--space-1) var(--space-3);font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:var(--color-neutral-700);")}>All data</div>
                      <div className=${H("hover", "background: var(--color-accent-100);")} style=${S("padding:var(--space-2) var(--space-3);cursor:pointer;font-size:14px;")} onMouseDown=${(e) => { e.preventDefault(); backup(); }}>Backup to Files</div>
                      <div style=${S("padding:var(--space-1) var(--space-3) var(--space-2);font-size:12px;color:var(--color-neutral-700);")}>Restore lives in the Library menu.</div>
                    </div>` : null}
                </div>
              </div>
            </div>
            <div style=${S("display:flex;align-items:center;gap:var(--space-2);flex-wrap:wrap;")}>
              <button className="btn btn-ghost" onClick=${() => nav("index")} style=${S("border-radius:0;border-bottom:2px solid " + (route.mode === "index" || (!current && !currentGroup) ? "var(--color-accent);color:var(--color-accent-700);" : "transparent;"))}>Pieces</button>
              <div style=${S("display:flex;align-items:center;gap:var(--space-2);margin-left:auto;flex-wrap:wrap;")}>
                <input className="input" type="text" placeholder="Search title, maker, text…" value=${q} onChange=${(e) => { setQ(e.target.value); if (route.mode !== "index") nav("index"); }} style=${S("width:220px;")} />
                <button className="btn btn-primary" onClick=${() => setForm({ type: "object", initial: blankObject() })}>+ Add piece</button>
                <button className="btn btn-secondary" onClick=${() => setForm({ type: "group", initial: {} })}>New ensemble</button>
              </div>
            </div>
          </div>
        </div>
        ${body}
        ${form && form.type === "object" ? html`<${ObjectForm} initial=${form.initial} doc=${doc} books=${books} onSave=${saveObject} onCancel=${() => setForm(null)} onDelete=${deleteObject} />` : null}
        ${form && form.type === "group" ? html`<${GroupForm} initial=${form.initial} doc=${doc} onSave=${saveGroup} onCancel=${() => setForm(null)} onDelete=${deleteGroup} />` : null}
        ${toast ? html`<div style=${S("position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--color-text);color:var(--color-bg);padding:8px 16px;border-radius:var(--radius-md);font-size:14px;z-index:3000;")}>${toast}</div>` : null}
      </div>`;
  }

  B.cabinet = { Component: Cabinet, KINDS };
  B.registerModule({ id: "cabinet", name: "Cabinet", blurb: "Prints, drawings and rare pieces", order: 20, Component: Cabinet });
})();
