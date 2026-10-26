// Biblia — progress tracker for the quadlingual Bible (texts are never stored here).
//
// Stored in B.store "biblia":
//   { editions: { [lang]: { name, source, notes } }, principles: "",
//     books: { [bookId]: { langs: { [lang]: 0|1|2 }, layout: 0|1|2|3, chaptersSet, notes, issues: [{ id, text, done }] } },
//     proofs: [ { id, date, passage, notes, images: [mediaId] } ] }
// langs: 0 = not yet, 1 = text sourced, 2 = aligned to the Vulgate's order and chapters.
// layout: 0 = not started, 1 = being laid out (chaptersSet counts), 2 = set, 3 = proofed.
(function () {
  const { React, html, S, H, Brand, ThemeToggle, useTheme, Thumb, Lightbox, Prose } = B.ui;
  const { useState, useEffect, useRef } = React;
  const C = B.data.canon;
  const LANGS = [["sq", "Shqip"], ["la", "Latina"], ["de", "Deutsch"], ["en", "English"]];
  const LSTATE = ["—", "Sourced", "Aligned"];
  const LAYOUT = ["Not started", "In layout", "Set", "Proofed"];
  const EMPTY = { editions: {}, principles: "", books: {}, proofs: [] };
  const TOTAL = C.books.reduce((s, b) => s + b[3], 0);
  const today = () => new Date().toISOString().slice(0, 10);
  const uid = (p) => p + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 6);
  const fmt = (d) => { try { return new Date(d + "T12:00:00").toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }); } catch (e) { return d; } };
  const rec = (doc, id) => ({ langs: {}, layout: 0, chaptersSet: 0, notes: "", issues: [], ...(doc.books[id] || {}) });
  const setCount = (r, ch) => r.layout >= 2 ? ch : Math.min(ch, Math.max(0, +r.chaptersSet || 0));

  function Bar({ value, total, label, note }) {
    const pct = total ? Math.round(100 * value / total) : 0;
    return html`<div className="bb-bar"><div className="bb-bl"><span>${label}</span><span>${note || value + " / " + total} · ${pct}%</span></div><div className="bb-track"><i style=${S("width:" + pct + "%")}></i></div></div>`;
  }

  function Tile({ b, r, onOpen }) {
    const [id, la, en, ch] = b;
    const set = setCount(r, ch);
    return html`<div className=${"bb-tile bb-l" + r.layout} onClick=${onOpen} title=${en + " — " + LAYOUT[r.layout]}>
      <div className="bb-tn">${la}</div>
      <div className="bb-te">${en} · ${ch}</div>
      <div className="bb-dots">${LANGS.map(([k]) => html`<span key=${k} className=${"bb-dot s" + ((r.langs || {})[k] || 0)} title=${k.toUpperCase() + ": " + LSTATE[(r.langs || {})[k] || 0]}>${k}</span>`)}</div>
      <div className="bb-mini"><i style=${S("width:" + Math.round(100 * set / ch) + "%")}></i></div>
      ${(r.issues || []).some((x) => !x.done) ? html`<span className="bb-flag" title="Open issues">!</span>` : null}
    </div>`;
  }

  function BookDialog({ b, r0, onSave, onCancel }) {
    const [id, la, en, ch] = b;
    const [r, setR] = useState(() => ({ ...r0, langs: { ...r0.langs }, issues: [...(r0.issues || [])] }));
    const [issue, setIssue] = useState("");
    const setLang = (k, v) => setR({ ...r, langs: { ...r.langs, [k]: v } });
    return html`<div className="dialog-backdrop" style=${S("z-index:1000;")}>
      <div className="dialog" onClick=${(e) => e.stopPropagation()} style=${S("max-width:640px;width:94vw;max-height:90vh;overflow:auto;")}>
        <div className="dialog-title">${la} <span style=${S("font-size:15px;color:var(--color-neutral-700);")}>· ${en} · ${ch} ${ch === 1 ? "chapter" : "chapters"}</span></div>
        <div className="dialog-body" style=${S("opacity:1;display:grid;gap:var(--space-4);")}>
          <div>
            <div className="cab-form-section" style=${S("margin-top:0;")}>Texts</div>
            ${LANGS.map(([k, name]) => html`<div key=${k} className="bb-lrow"><span className="bb-ln">${name}</span>
              <div className="seg">${LSTATE.map((lbl, v) => html`<label key=${v} className="seg-opt"><input type="radio" checked=${(r.langs[k] || 0) === v} onChange=${() => setLang(k, v)} />${lbl}</label>`)}</div></div>`)}
            <button className="btn btn-ghost" style=${S("font-size:13px;")} onClick=${() => setR({ ...r, langs: { sq: 2, la: 2, de: 2, en: 2 } })}>All four aligned</button>
          </div>
          <div>
            <div className="cab-form-section" style=${S("margin-top:0;")}>Layout</div>
            <div className="seg">${LAYOUT.map((lbl, v) => html`<label key=${v} className="seg-opt"><input type="radio" checked=${r.layout === v} onChange=${() => setR({ ...r, layout: v, chaptersSet: v >= 2 ? ch : r.chaptersSet })} />${lbl}</label>`)}</div>
            ${r.layout === 1 ? html`<div className="bb-lrow" style=${S("margin-top:var(--space-2);")}><span className="bb-ln">Chapters set</span>
              <input className="at-slider" type="range" min="0" max=${ch} value=${r.chaptersSet || 0} onChange=${(e) => setR({ ...r, chaptersSet: +e.target.value })} />
              <input className="input" type="number" min="0" max=${ch} style=${S("width:72px;")} value=${r.chaptersSet || 0} onChange=${(e) => setR({ ...r, chaptersSet: Math.max(0, Math.min(ch, +e.target.value || 0)) })} /><span className="bb-te">/ ${ch}</span></div>` : null}
          </div>
          <div className="field"><label>Notes</label><textarea className="input" style=${S("min-height:100px;font-family:var(--font-body);line-height:1.5;")} value=${r.notes || ""} placeholder="Versification differences, additions, decisions for this book…" onChange=${(e) => setR({ ...r, notes: e.target.value })}></textarea></div>
          <div className="field"><label>Open questions</label>
            ${r.issues.map((x) => html`<div key=${x.id} className="bb-issue"><input type="checkbox" checked=${!!x.done} onChange=${(e) => setR({ ...r, issues: r.issues.map((y) => y.id === x.id ? { ...y, done: e.target.checked } : y) })} />
              <span style=${S(x.done ? "text-decoration:line-through;opacity:0.6;" : "")}>${x.text}</span>
              <button className="btn btn-ghost" style=${S("margin-left:auto;font-size:13px;")} onClick=${() => setR({ ...r, issues: r.issues.filter((y) => y.id !== x.id) })}>×</button></div>`)}
            <input className="input" value=${issue} placeholder="e.g. Where to place the Greek additions — press Enter" onChange=${(e) => setIssue(e.target.value)}
              onKeyDown=${(e) => { if (e.key === "Enter" && issue.trim()) { setR({ ...r, issues: [...r.issues, { id: uid("is"), text: issue.trim(), done: false }] }); setIssue(""); } }} /></div>
        </div>
        <div className="dialog-actions cab-actions"><button className="btn btn-ghost" onClick=${onCancel}>Cancel</button><button className="btn btn-primary" onClick=${() => onSave(id, r)}>Save</button></div>
      </div></div>`;
  }

  function Overview({ doc, onOpen }) {
    const recs = C.books.map((b) => [b, rec(doc, b[0])]);
    const aligned = (k) => recs.reduce((s, [b, r]) => s + ((r.langs || {})[k] === 2 ? b[3] : 0), 0);
    const sourced = (k) => recs.reduce((s, [b, r]) => s + ((r.langs || {})[k] >= 1 ? b[3] : 0), 0);
    const setCh = recs.reduce((s, [b, r]) => s + setCount(r, b[3]), 0);
    const proofed = recs.filter(([b, r]) => r.layout === 3).length;
    const open = recs.reduce((s, [, r]) => s + (r.issues || []).filter((x) => !x.done).length, 0);
    return html`<div className="bb-page">
      <div className="bb-sum">
        <div>
          <div className="at-kicker" style=${S("margin-bottom:var(--space-2);")}>Texts aligned to the Vulgate, by chapters</div>
          ${LANGS.map(([k, n]) => html`<${Bar} key=${k} label=${n + (doc.editions[k] && doc.editions[k].name ? " — " + doc.editions[k].name : "")} value=${aligned(k)} total=${TOTAL} note=${aligned(k) + " aligned · " + sourced(k) + " sourced / " + TOTAL} />`)}
        </div>
        <div>
          <div className="at-kicker" style=${S("margin-bottom:var(--space-2);")}>Layout</div>
          <${Bar} label="Chapters set" value=${setCh} total=${TOTAL} />
          <${Bar} label="Books proofed" value=${proofed} total=${C.books.length} />
          <div className="bb-te" style=${S("margin-top:var(--space-2);")}>${open} open ${open === 1 ? "question" : "questions"} · chapters counted in the Nova Vulgata's division</div>
        </div>
      </div>
      <div className="bb-legend">
        ${LAYOUT.map((l, i) => html`<span key=${i}><i className=${"bb-sw bb-l" + i}></i>${l}</span>`)}
        <span><span className="bb-dot s0">la</span> not yet</span><span><span className="bb-dot s1">la</span> sourced</span><span><span className="bb-dot s2">la</span> aligned</span>
      </div>
      ${C.sections.map(([sid, lat, eng]) => html`<section key=${sid}>
        <h3 className="jr-h3">${lat} <span style=${S("font-size:15px;color:var(--color-neutral-700);font-family:var(--font-body);")}>· ${eng}</span></h3>
        <div className="bb-grid">${recs.filter(([b]) => b[4] === sid).map(([b, r]) => html`<${Tile} key=${b[0]} b=${b} r=${r} onOpen=${() => onOpen(b)} />`)}</div>
      </section>`)}
    </div>`;
  }

  function Editions({ doc, commit }) {
    const ed = (k) => doc.editions[k] || {};
    const setEd = (k, patch) => commit({ ...doc, editions: { ...doc.editions, [k]: { ...ed(k), ...patch } } });
    return html`<div className="bb-page" style=${S("max-width:900px;")}>
      <h2 className="cab-h2" style=${S("margin-bottom:var(--space-3);")}>Editions</h2>
      ${LANGS.map(([k, n]) => html`<div key=${k} className="at-box" style=${S("margin-bottom:var(--space-3);")}>
        <h4>${n}</h4>
        <div className="cab-form">
          <div className="field"><label>Edition</label><input className="input" value=${ed(k).name || ""} placeholder="Translation and year" onChange=${(e) => setEd(k, { name: e.target.value })} /></div>
          <div className="field"><label>Source of the text</label><input className="input" value=${ed(k).source || ""} placeholder="Where the text comes from" onChange=${(e) => setEd(k, { source: e.target.value })} /></div>
          <div className="field full"><label>Notes — versification, order, rights</label><textarea className="input" style=${S("min-height:70px;font-family:var(--font-body);")} value=${ed(k).notes || ""} onChange=${(e) => setEd(k, { notes: e.target.value })}></textarea></div>
        </div></div>`)}
      <h2 className="cab-h2" style=${S("margin:var(--space-6) 0 var(--space-3);")}>Layout principles</h2>
      <textarea className="input" style=${S("width:100%;box-sizing:border-box;min-height:180px;font-family:var(--font-body);line-height:1.6;")} value=${doc.principles || ""}
        placeholder="The rules of the page: column order, what must line up, type sizes, how chapters and verse numbers are handled…" onChange=${(e) => commit({ ...doc, principles: e.target.value })}></textarea>
      <p className="bb-te" style=${S("margin-top:var(--space-2);")}>The texts themselves are never stored here — only progress, decisions and proofs. Several of these translations are under copyright.</p>
    </div>`;
  }

  function ProofForm({ initial, onSave, onCancel, onDelete }) {
    const [d, setD] = useState(() => ({ id: null, date: today(), passage: "", notes: "", images: [], ...initial, images: [...(initial.images || [])] }));
    const added = useRef([]); const [busy, setBusy] = useState(false);
    const addImages = async (ev) => { const files = [...(ev.target.files || [])]; ev.target.value = ""; setBusy(true); const ids = []; for (const f of files) { try { const id = await B.media.add(f); ids.push(id); added.current.push(id); } catch (x) {} } setD((c) => ({ ...c, images: [...c.images, ...ids] })); setBusy(false); };
    const cancel = async () => { for (const id of added.current) await B.media.remove(id); onCancel(); };
    const save = async () => { for (const id of (initial.images || []).filter((x) => d.images.indexOf(x) === -1)) await B.media.remove(id); onSave(d); };
    return html`<div className="dialog-backdrop" style=${S("z-index:1000;")}>
      <div className="dialog" onClick=${(e) => e.stopPropagation()} style=${S("max-width:700px;width:94vw;max-height:90vh;overflow:auto;")}>
        <div className="dialog-title">${initial.id ? "Layout test" : "New layout test"}</div>
        <div className="dialog-body" style=${S("opacity:1;")}><div className="cab-form">
          <div className="field"><label>Date</label><input className="input" type="date" value=${d.date} onChange=${(e) => setD({ ...d, date: e.target.value })} /></div>
          <div className="field"><label>Passage</label><input className="input" value=${d.passage} placeholder="e.g. Ioannes 1–2" onChange=${(e) => setD({ ...d, passage: e.target.value })} /></div>
          <div className="full"><div className="cab-img-edit">
            ${d.images.map((id, i) => html`<div key=${id} className="cab-img-tile"><div className="pic"><${Thumb} id=${id} /></div><div className="row"><span>${i + 1}</span><button onClick=${() => setD({ ...d, images: d.images.filter((_, k) => k !== i) })}>×</button></div></div>`)}
            <label className="cab-img-tile" style=${S("display:flex;align-items:center;justify-content:center;height:108px;cursor:pointer;color:var(--color-accent-700);text-align:center;")}>${busy ? "Storing…" : "+ Spreads (images)"}<input type="file" accept="image/*" multiple style=${S("display:none;")} onChange=${addImages} /></label>
          </div></div>
          <div className="field full"><label>What was tested, what was learnt</label><textarea className="input" style=${S("min-height:150px;font-family:var(--font-body);line-height:1.5;")} value=${d.notes} onChange=${(e) => setD({ ...d, notes: e.target.value })}></textarea></div>
        </div></div>
        <div className="dialog-actions cab-actions">
          ${initial.id ? html`<button className="btn btn-ghost" style=${S("margin-right:auto;color:#a33;")} onClick=${() => { if (confirm("Delete this layout test and its images?")) onDelete(d); }}>Delete</button>` : null}
          <button className="btn btn-ghost" onClick=${cancel}>Cancel</button><button className="btn btn-primary" disabled=${busy} onClick=${save}>Save</button></div>
      </div></div>`;
  }

  function Proofs({ doc, onNew, onOpen }) {
    const [light, setLight] = useState(null);
    const list = doc.proofs.slice().sort((a, b) => b.date.localeCompare(a.date));
    return html`<div className="bb-page">
      <div className="jr-head"><h2 className="cab-h2">Layout tests</h2><span className="jr-stat">${list.length} in all</span><button className="btn btn-secondary" style=${S("margin-left:auto;")} onClick=${onNew}>+ New layout test</button></div>
      ${list.map((p) => html`<article key=${p.id} className="jr-entry">
        <div className="jr-date">${fmt(p.date)}</div>
        <div><div className="cab-title" style=${S("font-size:22px;")}>${p.passage || "Untitled test"}</div>
          ${p.images.length ? html`<div className="cab-strip">${p.images.map((id, i) => html`<div key=${id} className="cab-strip-item" style=${S("width:120px;height:90px;")} onClick=${() => setLight({ ids: p.images, i, cap: p.passage })}><${Thumb} id=${id} /></div>`)}</div>` : null}
          <${Prose} text=${p.notes} style=${S("font-size:15px;margin-top:var(--space-2);")} />
          <button className="btn btn-ghost" style=${S("font-size:13px;")} onClick=${() => onOpen(p)}>Edit</button></div>
      </article>`)}
      ${!list.length ? html`<p className="cab-sub">Record each test spread here: the passage, images of the pages, and what it taught about the layout.</p>` : null}
      ${light ? html`<${Lightbox} ids=${light.ids} index=${light.i} caption=${light.cap} onClose=${() => setLight(null)} />` : null}
    </div>`;
  }

  function readTab() { const [, t] = (location.hash || "").replace(/^#\/?/, "").split("/"); return ["editiones", "probationes"].indexOf(t) !== -1 ? t : "conspectus"; }

  function Biblia({ modules, active, go }) {
    const [doc, setDocState] = useState(() => ({ ...EMPTY, ...B.store.get("biblia", {}) }));
    const [theme, toggleTheme] = useTheme();
    const [tab, setTab] = useState(readTab);
    const [book, setBook] = useState(null);
    const [proof, setProof] = useState(null);
    const [menu, setMenu] = useState(false);
    const [toast, setToast] = useState("");
    useEffect(() => B.bus.on("store:biblia", (d) => setDocState({ ...EMPTY, ...d })), []);
    useEffect(() => { const f = () => setTab(readTab()); window.addEventListener("hashchange", f); return () => window.removeEventListener("hashchange", f); }, []);
    const commit = (next) => { setDocState(next); B.store.set("biblia", next); };
    const say = (m) => { setToast(m); setTimeout(() => setToast((t) => t === m ? "" : t), 2500); };
    const backup = async () => { setMenu(false); try { if (await B.backup.backupAll()) say("Backup saved"); } catch (e) { say("Backup failed: " + e.message); } };
    const goTab = (t) => { location.hash = t === "conspectus" ? "#biblia" : "#biblia/" + t; };
    const tabBtn = (id, label) => html`<button className="btn btn-ghost" onClick=${() => goTab(id)} style=${S("border-radius:0;border-bottom:2px solid " + (tab === id ? "var(--color-accent);color:var(--color-accent-700);" : "transparent;"))}>${label}</button>`;
    const saveProof = (d) => { const p = { ...d, id: d.id || uid("pf") }; commit({ ...doc, proofs: doc.proofs.some((x) => x.id === p.id) ? doc.proofs.map((x) => x.id === p.id ? p : x) : [...doc.proofs, p] }); setProof(null); say("Saved"); };
    const deleteProof = async (d) => { for (const id of d.images || []) await B.media.remove(id); commit({ ...doc, proofs: doc.proofs.filter((x) => x.id !== d.id) }); setProof(null); };
    return html`
      <div className="cab-page" data-theme=${theme}>
        <div className="nav" style=${S("position:sticky;top:0;z-index:20;display:block;background-color:var(--color-bg);")}>
          <div style=${S("display:flex;flex-direction:column;gap:var(--space-3);width:100%;")}>
            <div style=${S("display:flex;align-items:baseline;justify-content:space-between;gap:var(--space-3);width:100%;")}>
              <${Brand} title="Biblia" modules=${modules} active=${active} go=${go} />
              <div style=${S("display:flex;align-items:center;gap:var(--space-2);flex-shrink:0;")}>
                <${ThemeToggle} theme=${theme} onToggle=${toggleTheme} />
                <div style=${S("position:relative;")}>
                  <button className="btn btn-ghost" onClick=${() => setMenu(!menu)} onBlur=${() => setTimeout(() => setMenu(false), 180)} title="Tools" style=${S("font-size:18px;line-height:1;padding-left:10px;padding-right:10px;")}>⋮</button>
                  ${menu ? html`<div style=${S("position:absolute;top:100%;right:0;z-index:40;min-width:230px;background:var(--color-bg);border:1px solid var(--color-divider);border-radius:var(--radius-sm);box-shadow:var(--shadow-md);padding:var(--space-2) 0;")}>
                    <div className=${H("hover", "background: var(--color-accent-100);")} style=${S("padding:var(--space-2) var(--space-3);cursor:pointer;font-size:14px;")} onMouseDown=${(e) => { e.preventDefault(); backup(); }}>Backup to Files</div>
                    <div style=${S("padding:var(--space-1) var(--space-3) var(--space-2);font-size:12px;color:var(--color-neutral-700);")}>Restore lives in the Library menu.</div></div>` : null}
                </div>
              </div>
            </div>
            <div style=${S("display:flex;align-items:center;gap:var(--space-2);flex-wrap:wrap;")}>${tabBtn("conspectus", "Books")}${tabBtn("editiones", "Editions & principles")}${tabBtn("probationes", "Layout tests")}</div>
          </div>
        </div>
        ${tab === "conspectus" ? html`<${Overview} doc=${doc} onOpen=${(b) => setBook(b)} />` : null}
        ${tab === "editiones" ? html`<${Editions} doc=${doc} commit=${commit} />` : null}
        ${tab === "probationes" ? html`<${Proofs} doc=${doc} onNew=${() => setProof({})} onOpen=${(p) => setProof(p)} />` : null}
        ${book ? html`<${BookDialog} b=${book} r0=${rec(doc, book[0])} onCancel=${() => setBook(null)} onSave=${(id, r) => { commit({ ...doc, books: { ...doc.books, [id]: r } }); setBook(null); }} />` : null}
        ${proof ? html`<${ProofForm} initial=${proof} onSave=${saveProof} onCancel=${() => setProof(null)} onDelete=${deleteProof} />` : null}
        ${toast ? html`<div style=${S("position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--color-text);color:var(--color-bg);padding:8px 16px;border-radius:var(--radius-md);font-size:14px;z-index:3000;")}>${toast}</div>` : null}
      </div>`;
  }

  B.registerModule({ id: "biblia", name: "Biblia", blurb: "The quadlingual Bible: progress, editions, layout tests", order: 40, Component: Biblia });
})();
