// Studia — the classical-education curriculum and the Latin corner.
// Personal content (your position, notes, your own extra readings) lives only in your data, never in this code.
//
// The plan itself is static (js/studia/curriculum.js). What is yours is stored in B.store "studia":
//   { position: stageId, positionNote, extraItems: [ { stage, id, work, lang, warrant, addition, shelf } ],
//     items: { [itemId]: { status, books, started, finished, notes } },
//     log: [ { id, date, kind, itemId, title, text, correction, images: [mediaId], created, updated } ] }
// status: "" (to read) | "reading" | "read". books: Library book ids chosen by hand (overrides shelf matching).
(function () {
  const { React, html, S, H, Brand, ThemeToggle, useTheme, Thumb, Lightbox, Prose } = B.ui;
  const { useState, useEffect, useMemo, useRef } = React;
  const C = B.studiaCurriculum;
  const DEFAULT = {
    position: "grammatica",
    positionNote: "",
    extraItems: [], items: {}, log: []
  };
  const STATUS_NEXT = { "": "reading", reading: "read", read: "" };
  const STATUS_LABEL = { "": "To read", reading: "Reading", read: "Read" };
  const today = () => new Date().toISOString().slice(0, 10);
  const uid = (p) => p + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 6);
  // The plan in code plus your own readings from the data (marked as additions).
  let STAGES = C.stages;
  const mergeStages = (data) => C.stages.map((st) => ({ ...st, items: st.items.concat((data.extraItems || []).filter((x) => x.stage === st.id).map((x) => ({ addition: true, ...x }))) }));
  const allItems = () => STAGES.flatMap((st) => st.items.map((it) => ({ ...it, stage: st.id, stageName: st.name })));
  const fmtDate = (d) => { try { return new Date(d + "T12:00:00").toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }); } catch (e) { return d; } };

  // Library books (and Alexandria) as one searchable list.
  function shelfBooks() {
    const d = B.libraryData();
    const books = (d.books || []).map((b) => ({ id: b.id, author: b.author || "", title: b.title || "", lang: b.lang || "", where: b.city || "" }));
    const alex = (d.alexandria || []).map((a) => ({ id: "alex:" + a.num, author: a.author || "", title: a.title || "", lang: "", where: "Alexandria" }));
    return books.concat(alex);
  }
  function matchShelf(item, books) {
    const pats = (item.shelf || []).map(([a, t]) => [a ? new RegExp(a, "i") : null, t ? new RegExp(t, "i") : null]);
    if (!pats.length) return [];
    return books.filter((b) => pats.some(([a, t]) => (!a || a.test(b.author)) && (!t || t.test(b.title))));
  }

  // ---------- curriculum ----------
  function ItemRow({ it, st, books, matched, open, onToggleOpen, onStatus, onPatch, entries, onNewEntry, onOpenEntry }) {
    const [q, setQ] = useState("");
    const linked = (st.books && st.books.length) ? st.books.map((id) => books.find((b) => b.id === id)).filter(Boolean) : matched;
    const qm = q.trim().length < 2 ? [] : books.filter((b) => (b.author + " " + b.title).toLowerCase().indexOf(q.trim().toLowerCase()) !== -1).slice(0, 8);
    const status = st.status || "";
    return html`
      <div className="st-item">
        <button className=${"st-status " + status} title=${STATUS_LABEL[status] + " — click to change"} onClick=${onStatus}></button>
        <div>
          <div className="st-work" onClick=${onToggleOpen}>${it.work}</div>
          <div className="st-meta"><span className="st-lang">${it.lang}</span>${it.warrant}${it.addition ? html`<span className="st-add">your addition</span>` : null}</div>
          ${it.decision ? html`<div className="st-decision">${it.decision}</div>` : null}
          ${it.note ? html`<div className="st-meta">${it.note}</div>` : null}
          ${st.started || st.finished || entries.length ? html`<div className="st-meta">
            ${st.started ? "Started " + fmtDate(st.started) : ""}${st.started && st.finished ? " · " : ""}${st.finished ? "Finished " + fmtDate(st.finished) : ""}${entries.length ? ((st.started || st.finished) ? " · " : "") + entries.length + (entries.length === 1 ? " exercise" : " exercises") : ""}
          </div>` : null}
        </div>
        <div className="st-shelf shelf">
          ${linked.length ? html`<div className="lbl">On your shelves</div>${linked.slice(0, 4).map((b) => html`<div key=${b.id} className="bk"><i>${b.title}</i>${b.lang ? " (" + b.lang + ")" : ""}${b.where === "Alexandria" ? " · Alexandria" : ""}</div>`)}${linked.length > 4 ? html`<div className="bk">+ ${linked.length - 4} more</div>` : null}`
            : html`<div className="lbl" style=${S("opacity:0.6;")}>Not on your shelves</div>`}
        </div>
        ${open ? html`
          <div className="st-detail">
            <div style=${S("display:flex;gap:var(--space-3);flex-wrap:wrap;align-items:end;")}>
              <div className="field"><label>Status</label>
                <select className="input" value=${status} onChange=${(e) => onPatch({ status: e.target.value, ...(e.target.value === "reading" && !st.started ? { started: today() } : {}), ...(e.target.value === "read" && !st.finished ? { finished: today() } : {}) })}>
                  <option value="">To read</option><option value="reading">Reading</option><option value="read">Read</option>
                </select></div>
              <div className="field"><label>Started</label><input className="input" type="date" value=${st.started || ""} onChange=${(e) => onPatch({ started: e.target.value })} /></div>
              <div className="field"><label>Finished</label><input className="input" type="date" value=${st.finished || ""} onChange=${(e) => onPatch({ finished: e.target.value })} /></div>
              <button className="btn btn-secondary" style=${S("margin-left:auto;")} onClick=${onNewEntry}>+ Exercise on this</button>
            </div>
            <div className="field"><label>Notes</label>
              <textarea className="input" value=${st.notes || ""} placeholder="Edition used, what to read next, impressions…" onChange=${(e) => onPatch({ notes: e.target.value })}></textarea></div>
            <div className="field"><label>Copy on your shelves ${st.books && st.books.length ? "(chosen by hand)" : "(found automatically)"}</label>
              <div style=${S("display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px;")}>
                ${(st.books || []).map((id) => { const b = books.find((x) => x.id === id); return html`<span key=${id} className="tag tag-outline" style=${S("cursor:pointer;")} title="Remove" onClick=${() => onPatch({ books: st.books.filter((x) => x !== id) })}>${b ? b.title : id} ×</span>`; })}
              </div>
              <div style=${S("position:relative;")}>
                <input className="input" value=${q} placeholder="Choose a book by hand: search title or author…" onChange=${(e) => setQ(e.target.value)} />
                ${qm.length ? html`<div style=${S("position:absolute;top:100%;left:0;right:0;z-index:10;background:var(--color-bg);border:1px solid var(--color-divider);border-radius:var(--radius-sm);box-shadow:var(--shadow-md);max-height:200px;overflow:auto;")}>
                  ${qm.map((b) => html`<div key=${b.id} className=${H("hover", "background: var(--color-accent-100);")} style=${S("padding:var(--space-2);cursor:pointer;font-size:14px;")} onClick=${() => { onPatch({ books: [...(st.books || []), b.id] }); setQ(""); }}><i>${b.title}</i> — ${b.author}</div>`)}
                </div>` : null}
              </div>
            </div>
            ${entries.length ? html`<div className="field"><label>Exercises</label>
              ${entries.map((e) => html`<div key=${e.id} style=${S("font-size:14px;cursor:pointer;padding:2px 0;")} onClick=${() => onOpenEntry(e)}>${fmtDate(e.date)} · ${e.title || kindName(e.kind)}</div>`)}</div>` : null}
          </div>` : null}
      </div>`;
  }

  function Curriculum({ data, patchItem, setData, onNewEntry, onOpenEntry }) {
    const [sel, setSel] = useState(data.position || "grammatica");
    const [open, setOpen] = useState(null);
    const books = useMemo(shelfBooks, []);
    const matches = useMemo(() => { const m = {}; allItems().forEach((it) => { m[it.id] = matchShelf(it, books); }); return m; }, [books, data.extraItems]);
    const stage = STAGES.find((s) => s.id === sel) || STAGES[0];
    const statusOf = (id) => (data.items[id] || {}).status || "";
    const progress = (st) => { const n = st.items.length, r = st.items.filter((i) => statusOf(i.id) === "read").length, g = st.items.filter((i) => statusOf(i.id) === "reading").length; return { n, r, g }; };
    const all = allItems();
    const totals = { n: all.length, r: all.filter((i) => statusOf(i.id) === "read").length, g: all.filter((i) => statusOf(i.id) === "reading").length, owned: all.filter((i) => matches[i.id].length || ((data.items[i.id] || {}).books || []).length).length };
    const p = progress(stage);
    const isHere = data.position === stage.id;
    return html`
      <div>
        <div className="st-strip">
          ${STAGES.map((st) => { const pr = progress(st); return html`
            <button key=${st.id} className=${"st-stage" + (st.id === sel ? " is-on" : "") + (st.strand ? " is-strand" : "")} onClick=${() => { setSel(st.id); setOpen(null); }}>
              ${data.position === st.id ? html`<span className="here">you are here</span>` : null}
              <div className="nm">${st.strand ? "" : ["I", "II", "III", "IV", "V"][STAGES.indexOf(st)] + ". "}${st.name}</div>
              <div className="sb">${pr.r} of ${pr.n} read${pr.g ? " · " + pr.g + " reading" : ""}</div>
              <div className="bar"><i style=${S("width:" + Math.round(100 * pr.r / pr.n) + "%")}></i></div>
            </button>`; })}
        </div>
        <div className="st-panel">
          <div style=${S("display:flex;align-items:baseline;gap:var(--space-3);flex-wrap:wrap;")}>
            <h2 style=${S("font-size:32px;margin:0;")}>${stage.name}</h2>
            <span style=${S("color:var(--color-neutral-700);font-style:italic;")}>${stage.sub}</span>
            <span style=${S("margin-left:auto;font-size:13px;color:var(--color-neutral-700);")}>${p.r} read · ${p.g} reading · ${p.n - p.r - p.g} to read</span>
          </div>
          <p className="st-aim">${stage.aim}</p>
          <p className="st-ex"><b style=${S("font-weight:600;")}>Exercise of the stage.</b> ${stage.exercise}</p>
          ${!stage.strand ? html`
            <div style=${S("display:flex;gap:var(--space-2);align-items:center;flex-wrap:wrap;margin:var(--space-3) 0;")}>
              ${isHere ? html`
                <span className="tag tag-accent">You are here</span>
                <input className="input" style=${S("flex:1;min-width:240px;")} value=${data.positionNote || ""} placeholder="Where exactly — class, book, chapter…" onChange=${(e) => setData({ ...data, positionNote: e.target.value })} />`
              : html`<button className="btn btn-ghost" onClick=${() => setData({ ...data, position: stage.id })}>Mark this as your current stage</button>`}
            </div>` : null}
          <div style=${S("margin-top:var(--space-4);")}>
            ${stage.items.map((it) => html`
              <${ItemRow} key=${it.id} it=${it} st=${data.items[it.id] || {}} books=${books} matched=${matches[it.id]}
                open=${open === it.id} onToggleOpen=${() => setOpen(open === it.id ? null : it.id)}
                onStatus=${() => { const cur = statusOf(it.id); const next = STATUS_NEXT[cur]; const st = data.items[it.id] || {};
                  patchItem(it.id, { status: next, ...(next === "reading" && !st.started ? { started: today() } : {}), ...(next === "read" && !st.finished ? { finished: today() } : {}) }); }}
                onPatch=${(patch) => patchItem(it.id, patch)}
                entries=${data.log.filter((e) => e.itemId === it.id).sort((a, b) => b.date.localeCompare(a.date))}
                onNewEntry=${() => onNewEntry(it.id)} onOpenEntry=${onOpenEntry} />`)}
          </div>
          <p style=${S("font-size:13px;color:var(--color-neutral-700);margin-top:var(--space-6);")}>
            Whole plan: ${totals.r} of ${totals.n} read, ${totals.g} reading · ${totals.owned} already on your shelves in some edition.
            Shelf matches are found by author and title; open an item to choose the copy by hand.
          </p>
        </div>
      </div>`;
  }

  // ---------- exercises (the Latin corner) ----------
  const kindName = (k) => (C.exerciseKinds.find((x) => x.id === k) || { name: k || "Note" }).name;

  function EntryCard({ e, onOpen }) {
    const it = allItems().find((x) => x.id === e.itemId);
    return html`
      <div className="card st-entry" onClick=${onOpen}>
        <div className="card-kicker">${fmtDate(e.date)} · ${kindName(e.kind)}</div>
        <div className="card-title">${e.title || (it ? it.work : kindName(e.kind))}</div>
        ${it && e.title ? html`<div className="card-meta" style=${S("display:block;")}>${it.work}</div>` : null}
        ${e.text ? html`<div className="latin">${e.text}</div>` : null}
        ${e.images && e.images.length ? html`<div className="st-thumbs">${e.images.slice(0, 5).map((id) => html`<div key=${id}><${Thumb} id=${id} /></div>`)}</div>` : null}
        ${e.correction ? html`<div className="card-meta">✎ corrected</div>` : null}
      </div>`;
  }

  function EntryForm({ initial, onSave, onCancel, onDelete }) {
    const [d, setD] = useState(() => ({ id: null, date: today(), kind: "translation", itemId: "", title: "", text: "", correction: "", images: [], ...initial, images: [...(initial.images || [])] }));
    const added = useRef([]);
    const [busy, setBusy] = useState(false);
    const [err, setErr] = useState("");
    const [light, setLight] = useState(null);
    const set = (k) => (e) => setD({ ...d, [k]: e.target.value });
    const addImages = async (ev) => {
      const files = [...(ev.target.files || [])]; ev.target.value = "";
      if (!files.length) return;
      setBusy(true); setErr(""); const ids = [];
      for (const f of files) { try { const id = await B.media.add(f); ids.push(id); added.current.push(id); } catch (x) { setErr((f.name || "A file") + ": " + (x.message || x)); } }
      setD((cur) => ({ ...cur, images: [...cur.images, ...ids] })); setBusy(false);
    };
    const cancel = async () => { for (const id of added.current) await B.media.remove(id); onCancel(); };
    const save = async () => {
      if (!d.text.trim() && !d.images.length && !d.title.trim()) { setErr("Add a photo, some text or a title."); return; }
      for (const id of (initial.images || []).filter((x) => d.images.indexOf(x) === -1)) await B.media.remove(id);
      onSave(d);
    };
    return html`
      <div className="dialog-backdrop" style=${S("z-index:1000;")}>
        <div className="dialog" onClick=${(e) => e.stopPropagation()} style=${S("max-width:760px;width:94vw;max-height:90vh;overflow:auto;")}>
          <div className="dialog-title">${initial.id ? "Exercise" : "New exercise"}</div>
          <div className="dialog-body" style=${S("opacity:1;")}>
            <div className="cab-form">
              <div className="field"><label>Date</label><input className="input" type="date" value=${d.date} onChange=${set("date")} /></div>
              <div className="field"><label>Kind</label><select className="input" value=${d.kind} onChange=${set("kind")}>${C.exerciseKinds.map((k) => html`<option key=${k.id} value=${k.id}>${k.name}</option>`)}</select></div>
              <div className="field full"><label>On which reading (optional)</label>
                <select className="input" value=${d.itemId} onChange=${set("itemId")}>
                  <option value="">— none</option>
                  ${STAGES.map((st) => html`<optgroup key=${st.id} label=${st.name}>${st.items.map((it) => html`<option key=${it.id} value=${it.id}>${it.work.length > 90 ? it.work.slice(0, 88) + "…" : it.work}</option>`)}</optgroup>`)}
                </select></div>
              <div className="field full"><label>Title / passage</label><input className="input" value=${d.title} placeholder="e.g. Ad fam. XIV.4, to Terentia" onChange=${set("title")} /></div>
              <div className="cab-form-section">Your work</div>
              <div className="full">
                <div className="cab-img-edit">
                  ${d.images.map((id, i) => html`
                    <div key=${id} className="cab-img-tile">
                      <div className="pic" style=${S("cursor:zoom-in;")} onClick=${() => setLight(i)}><${Thumb} id=${id} /></div>
                      <div className="row"><span style=${S("color:var(--color-neutral-700);padding-top:3px;")}>${i + 1}</span><button onClick=${() => setD({ ...d, images: d.images.filter((_, k) => k !== i) })} title="Remove">×</button></div>
                    </div>`)}
                  <label className="cab-img-tile" style=${S("display:flex;align-items:center;justify-content:center;height:108px;cursor:pointer;color:var(--color-accent-700);text-align:center;")}>
                    ${busy ? "Storing…" : "+ Photos of the page"}
                    <input type="file" accept="image/*" multiple style=${S("display:none;")} onChange=${addImages} />
                  </label>
                </div>
              </div>
              <div className="field full"><label>Text — your Latin, or your translation</label>
                <textarea className="input" style=${S("min-height:160px;font-family:var(--font-heading);font-size:17px;")} value=${d.text} onChange=${set("text")}></textarea></div>
              <div className="field full"><label>Correction and notes</label>
                <textarea className="input" value=${d.correction} placeholder="Mistakes found, the corrected sentence, vocabulary to keep…" onChange=${set("correction")}></textarea></div>
            </div>
            ${err ? html`<div style=${S("color:#a33;font-size:13px;margin-top:var(--space-2);")}>${err}</div>` : null}
          </div>
          <div className="dialog-actions cab-actions">
            ${initial.id ? html`<button className="btn btn-ghost" style=${S("margin-right:auto;color:#a33;")} onClick=${() => { if (confirm("Delete this exercise and its photos?")) onDelete(d); }}>Delete</button>` : null}
            <button className="btn btn-ghost" onClick=${cancel}>Cancel</button>
            <button className="btn btn-primary" disabled=${busy} onClick=${save}>Save</button>
          </div>
          ${light !== null ? html`<${Lightbox} ids=${d.images} index=${light} caption=${d.title || kindName(d.kind)} onClose=${() => setLight(null)} />` : null}
        </div>
      </div>`;
  }

  function Exercises({ data, onNew, onOpen }) {
    const [kind, setKind] = useState("");
    const list = data.log.filter((e) => !kind || e.kind === kind).slice().sort((a, b) => b.date.localeCompare(a.date) || (b.created || "").localeCompare(a.created || ""));
    const count = (k) => data.log.filter((e) => e.kind === k).length;
    const last30 = data.log.filter((e) => (Date.now() - new Date(e.date + "T12:00:00")) / 864e5 <= 30).length;
    return html`
      <div className="st-panel" style=${S("max-width:none;")}>
        <div style=${S("display:flex;align-items:center;gap:var(--space-3);flex-wrap:wrap;margin-bottom:var(--space-4);")}>
          <h2 style=${S("font-size:32px;margin:0;")}>Exercitia</h2>
          <span style=${S("color:var(--color-neutral-700);font-style:italic;")}>Translations, compositions, prelections — with photos of the page</span>
        </div>
        ${data.log.length ? html`
          <div style=${S("display:flex;gap:var(--space-3);align-items:center;flex-wrap:wrap;margin-bottom:var(--space-4);")}>
            <div className="seg">
              <label className="seg-opt"><input type="radio" checked=${!kind} onChange=${() => setKind("")} />All</label>
              ${C.exerciseKinds.filter((k) => count(k.id)).map((k) => html`<label key=${k.id} className="seg-opt"><input type="radio" checked=${kind === k.id} onChange=${() => setKind(k.id)} />${k.name} (${count(k.id)})</label>`)}
            </div>
            <span style=${S("margin-left:auto;font-size:13px;color:var(--color-neutral-700);")}>${data.log.length} in all · ${last30} in the last 30 days</span>
          </div>
          <div className="st-log">${list.map((e) => html`<${EntryCard} key=${e.id} e=${e} onOpen=${() => onOpen(e)} />`)}</div>`
        : html`<div style=${S("max-width:68ch;")}>
            <p>This is the Latin corner: every translation, theme, letter or prelection, dated, with photos of your handwritten page and the correction beside it. Link an exercise to a reading in the curriculum, and it appears there too.</p>
            <p style=${S("color:var(--color-neutral-700);")}>Erasmus: “optimum dicendi magistrum esse stilum” — the pen is the best teacher of speaking (DRS p. 12).</p>
          </div>`}
      </div>`;
  }

  // ---------- method ----------
  function Method({ data, onNew }) {
    const here = STAGES.find((st) => st.id === data.position);
    const count = (k) => data.log.filter((e) => e.kind === k).length;
    const decisions = [
      ["Greek", "In, a stage behind the Latin."],
      ["Terence", "Read, on Erasmus's warrant; the Ratio bars him (Provincial rule 11)."],
      ["Expurgation", "Whole texts, read in Erasmus's manner."],
      ["Theology", "The Fathers first, then Thomas."],
      ["Additions", "Accepted, and marked as yours."],
      ["Starting point", (here ? here.name : "—") + (data.positionNote ? " — " + data.positionNote : "")]
    ];
    return html`
      <div className="st-panel" style=${S("max-width:none;")}>
        <h2 style=${S("font-size:32px;margin:0 0 var(--space-1) 0;")}>Methodus</h2>
        <p className="st-aim" style=${S("color:var(--color-neutral-700);")}>Seven practices, each named by at least one of the treatises.</p>
        <div className="st-method">
          ${C.method.map((m) => html`
            <div key=${m.name} className="card">
              <div className="card-title">${m.name}</div>
              <div className="card-body" style=${S("line-height:1.55;")}>${m.what}</div>
              <div className="card-meta" style=${S("display:block;")}>${m.warrant}</div>
              ${m.kind ? html`<div style=${S("display:flex;align-items:center;gap:var(--space-2);margin-top:var(--space-2);")}>
                <span style=${S("font-size:13px;color:var(--color-neutral-700);")}>${count(m.kind)} logged</span>
                <button className="btn btn-ghost" style=${S("margin-left:auto;")} onClick=${() => onNew("", m.kind)}>Log one</button></div>` : null}
              ${m.where ? html`<div style=${S("font-size:13px;color:var(--color-accent-700);margin-top:var(--space-2);")}>→ ${m.where}</div>` : null}
            </div>`)}
        </div>
        <h3 style=${S("font-size:22px;margin:var(--space-8) 0 var(--space-2) 0;")}>Decisions taken (26 October 2026)</h3>
        <dl className="cab-facts">${decisions.map(([k, v]) => html`<${React.Fragment} key=${k}><dt>${k}</dt><dd>${v}</dd><//>`)}</dl>
        <p style=${S("font-size:13px;color:var(--color-neutral-700);max-width:78ch;")}>Warrants cite English translations (Woodward 1897, Farrell 1970) and the 1520 printing of Erasmus; the Latin critical editions were not reached. Vives's reading lists are still missing.</p>
      </div>`;
  }

  // ---------- module ----------
  function readTab() { const [, t] = (location.hash || "").replace(/^#\/?/, "").split("/"); return ["exercitia", "methodus"].indexOf(t) !== -1 ? t : "cursus"; }

  function Studia({ modules, active, go }) {
    const [data, setDataState] = useState(() => ({ ...DEFAULT, ...B.store.get("studia", {}) }));
    const [theme, toggleTheme] = useTheme();
    const [tab, setTab] = useState(readTab);
    const [form, setForm] = useState(null);
    const [menu, setMenu] = useState(false);
    const [toast, setToast] = useState("");
    useEffect(() => B.bus.on("store:studia", (d) => setDataState({ ...DEFAULT, ...d })), []);
    useEffect(() => { const f = () => setTab(readTab()); window.addEventListener("hashchange", f); return () => window.removeEventListener("hashchange", f); }, []);
    const goTab = (t) => { location.hash = t === "cursus" ? "#studia" : "#studia/" + t; };
    const setData = (next) => { setDataState(next); B.store.set("studia", next); };
    const patchItem = (id, patch) => setData({ ...data, items: { ...data.items, [id]: { ...(data.items[id] || {}), ...patch } } });
    const say = (m) => { setToast(m); setTimeout(() => setToast((t) => t === m ? "" : t), 2500); };
    const saveEntry = (d) => {
      const now = new Date().toISOString();
      const e = { ...d, id: d.id || uid("ex"), created: d.created || now, updated: now };
      const exists = data.log.some((x) => x.id === e.id);
      setData({ ...data, log: exists ? data.log.map((x) => x.id === e.id ? e : x) : [...data.log, e] });
      setForm(null); say(exists ? "Saved" : "Exercise logged");
    };
    const deleteEntry = async (d) => { for (const id of d.images || []) await B.media.remove(id); setData({ ...data, log: data.log.filter((x) => x.id !== d.id) }); setForm(null); say("Deleted"); };
    const backup = async () => { setMenu(false); try { if (await B.backup.backupAll()) say("Backup saved"); } catch (e) { say("Backup failed: " + e.message); } };
    const newEntry = (itemId, kind) => setForm({ itemId: itemId || "", kind: kind || "translation" });
    STAGES = mergeStages(data);

    const tabBtn = (id, label) => html`<button className="btn btn-ghost" onClick=${() => goTab(id)} style=${S("border-radius:0;border-bottom:2px solid " + (tab === id ? "var(--color-accent);color:var(--color-accent-700);" : "transparent;"))}>${label}</button>`;
    return html`
      <div className="cab-page" data-theme=${theme}>
        <div className="nav" style=${S("position:sticky;top:0;z-index:20;display:block;background-color:var(--color-bg);")}>
          <div style=${S("display:flex;flex-direction:column;gap:var(--space-3);width:100%;")}>
            <div style=${S("display:flex;align-items:baseline;justify-content:space-between;gap:var(--space-3);width:100%;")}>
              <${Brand} title="Studia" modules=${modules} active=${active} go=${go} />
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
              ${tabBtn("cursus", "Curriculum")}${tabBtn("exercitia", "Exercitia")}${tabBtn("methodus", "Methodus")}
              <button className="btn btn-primary" style=${S("margin-left:auto;")} onClick=${() => newEntry("")}>+ New exercise</button>
            </div>
          </div>
        </div>
        ${tab === "cursus" ? html`<${Curriculum} data=${data} setData=${setData} patchItem=${patchItem} onNewEntry=${newEntry} onOpenEntry=${(e) => setForm(e)} />` : null}
        ${tab === "exercitia" ? html`<${Exercises} data=${data} onNew=${newEntry} onOpen=${(e) => setForm(e)} />` : null}
        ${tab === "methodus" ? html`<${Method} data=${data} onNew=${newEntry} />` : null}
        ${form ? html`<${EntryForm} initial=${form} onSave=${saveEntry} onCancel=${() => setForm(null)} onDelete=${deleteEntry} />` : null}
        ${toast ? html`<div style=${S("position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--color-text);color:var(--color-bg);padding:8px 16px;border-radius:var(--radius-md);font-size:14px;z-index:3000;")}>${toast}</div>` : null}
      </div>`;
  }

  B.studia = { Component: Studia };
  B.registerModule({ id: "studia", name: "Studia", blurb: "The humanist curriculum and the Latin corner", order: 30, Component: Studia });
})();
