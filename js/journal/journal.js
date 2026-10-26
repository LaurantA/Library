// Journal — reading history and dated reading notes, with quotes kept in the moment they were met.
//
// Stored in B.store "journal":
//   { readings: [ { id, bookId, started, finished, status: "reading"|"finished"|"set-aside" } ],
//     entries:  [ { id, date, bookId, pages, text, quoteIds: [quoteId], tags: [], created, updated } ] }
// Quotes themselves stay in the Library (Library → Quotes); a quote written in the journal carries
// { entryId, date } so it remembers when it was met. bookId uses the Library's ids ("alex:<n>" for Alexandria).
(function () {
  const { React, html, S, H, Brand, ThemeToggle, useTheme, Prose } = B.ui;
  const { useState, useEffect, useMemo } = React;
  const EMPTY = { readings: [], entries: [] };
  const today = () => new Date().toISOString().slice(0, 10);
  const uid = (p) => p + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 6);
  const fmt = (d, opts) => { if (!d) return ""; try { return new Date(d + "T12:00:00").toLocaleDateString(undefined, opts || { day: "numeric", month: "short", year: "numeric" }); } catch (e) { return d; } };
  const days = (a, b) => Math.max(0, Math.round((new Date((b || today()) + "T12:00:00") - new Date(a + "T12:00:00")) / 864e5));

  // ---------- Library bridge ----------
  const LIB_KEY = "library-catalogue-v1";
  function lib() { return B.libraryData(); }
  function writeLib(mut) {
    const d = lib(); mut(d);
    try { localStorage.setItem(LIB_KEY, JSON.stringify(d)); } catch (e) { alert("The Library could not be saved: " + e.message); }
    B.bus.emit("library", d);
  }
  function allBooks() {
    const d = lib();
    return (d.books || []).map((b) => ({ id: b.id, title: b.title || "", author: b.author || "", lang: b.lang || "" }))
      .concat((d.alexandria || []).map((a) => ({ id: "alex:" + a.num, title: a.title || "", author: a.author || "", lang: "", alex: true })));
  }
  const bookOf = (id, books) => (books || allBooks()).find((b) => b.id === id) || { id, title: "(book not in the Library)", author: "" };

  // ---------- small pieces ----------
  function BookPicker({ value, onChange, books, autoFocus }) {
    const [q, setQ] = useState("");
    const b = value ? bookOf(value, books) : null;
    const k = q.trim().toLowerCase();
    const m = k.length < 2 ? [] : books.filter((x) => (x.title + " " + x.author).toLowerCase().indexOf(k) !== -1).slice(0, 10);
    return html`<div style=${S("position:relative;")}>
      ${b ? html`<div style=${S("display:flex;align-items:center;gap:var(--space-2);")}><span style=${S("flex:1;")}><i>${b.title}</i> — ${b.author}${b.alex ? " · Alexandria" : ""}</span><button className="btn btn-ghost" onClick=${() => onChange("")}>Change</button></div>`
        : html`<input className="input" autoFocus=${!!autoFocus} value=${q} placeholder="Search the Library: title or author…" onChange=${(e) => setQ(e.target.value)} />`}
      ${!b && m.length ? html`<div style=${S("position:absolute;top:100%;left:0;right:0;z-index:20;background:var(--color-bg);border:1px solid var(--color-divider);border-radius:var(--radius-sm);box-shadow:var(--shadow-md);max-height:240px;overflow:auto;")}>
        ${m.map((x) => html`<div key=${x.id} className=${H("hover", "background: var(--color-accent-100);")} style=${S("padding:var(--space-2);cursor:pointer;font-size:14px;")} onClick=${() => { onChange(x.id); setQ(""); }}><i>${x.title}</i> — ${x.author}${x.alex ? " · Alexandria" : ""}</div>`)}</div>` : null}
    </div>`;
  }

  function QuoteBlock({ q }) {
    return html`<blockquote className="jr-quote">
      <div>“${q.quote}”</div>
      <div className="jr-qmeta">${q.page ? "p. " + q.page : ""}${q.page && (q.themes || []).length ? " · " : ""}${(q.themes || []).join(" · ")}</div>
      ${q.note ? html`<div className="jr-qnote">${q.note}</div>` : null}
    </blockquote>`;
  }

  function EntryView({ e, books, quotes, onEdit, showBook }) {
    const b = bookOf(e.bookId, books);
    const qs = (e.quoteIds || []).map((id) => quotes.find((q) => q.id === id)).filter(Boolean);
    return html`<article className="jr-entry">
      <div className="jr-date">${fmt(e.date, { weekday: "short", day: "numeric", month: "long", year: "numeric" })}</div>
      <div className="jr-body">
        ${showBook ? html`<div className="jr-book"><a href=${"#journal/book/" + encodeURIComponent(e.bookId)}><i>${b.title}</i></a> — ${b.author}${e.pages ? html`<span className="jr-pages"> · pp. ${e.pages}</span>` : null}</div>`
          : e.pages ? html`<div className="jr-book"><span className="jr-pages">pp. ${e.pages}</span></div>` : null}
        <${Prose} text=${e.text} style=${S("font-size:15px;")} />
        ${qs.map((q) => html`<${QuoteBlock} key=${q.id} q=${q} />`)}
        <div style=${S("display:flex;gap:var(--space-2);align-items:center;flex-wrap:wrap;")}>
          ${(e.tags || []).map((t) => html`<span key=${t} className="tag tag-outline">${t}</span>`)}
          <button className="btn btn-ghost" style=${S("margin-left:auto;font-size:13px;")} onClick=${() => onEdit(e)}>Edit</button>
        </div>
      </div>
    </article>`;
  }

  // ---------- entry form ----------
  function EntryForm({ initial, books, readings, onSave, onCancel, onDelete }) {
    const d0 = lib();
    const [d, setD] = useState(() => ({ id: null, date: today(), bookId: "", pages: "", text: "", tags: [], quoteIds: [], ...initial }));
    const existing = (d0.quotes || []).filter((q) => (d.quoteIds || []).indexOf(q.id) !== -1);
    const [qs, setQs] = useState(() => existing.map((q) => ({ ...q, themes: [...(q.themes || [])] })));
    const [themeIn, setThemeIn] = useState({});
    const [tagIn, setTagIn] = useState("");
    const [err, setErr] = useState("");
    const themes = d0.themes || [];
    const current = readings.filter((r) => r.status === "reading").map((r) => bookOf(r.bookId, books));
    const addQ = () => setQs([...qs, { id: null, quote: "", page: "", note: "", themes: [] }]);
    const setQ = (i, patch) => setQs(qs.map((q, k) => k === i ? { ...q, ...patch } : q));
    const toggleTheme = (i, t) => { const q = qs[i]; setQ(i, { themes: q.themes.indexOf(t) === -1 ? [...q.themes, t] : q.themes.filter((x) => x !== t) }); };
    const save = () => {
      if (!d.bookId) { setErr("Choose the book."); return; }
      const kept = qs.filter((q) => q.quote.trim());
      if (!d.text.trim() && !kept.length) { setErr("Write a note or add a quote."); return; }
      onSave(d, kept, existing.filter((q) => !kept.some((k) => k.id === q.id)));
    };
    return html`
      <div className="dialog-backdrop" style=${S("z-index:1000;")}>
        <div className="dialog" onClick=${(e) => e.stopPropagation()} style=${S("max-width:760px;width:94vw;max-height:90vh;overflow:auto;")}>
          <div className="dialog-title">${initial.id ? "Journal entry" : "New entry"}</div>
          <div className="dialog-body" style=${S("opacity:1;")}>
            <div className="cab-form">
              <div className="field"><label>Date</label><input className="input" type="date" value=${d.date} onChange=${(e) => setD({ ...d, date: e.target.value })} /></div>
              <div className="field"><label>Pages read</label><input className="input" value=${d.pages} placeholder="e.g. 34–78" onChange=${(e) => setD({ ...d, pages: e.target.value })} /></div>
              <div className="field full"><label>Book</label>
                ${!d.bookId && current.length ? html`<div style=${S("display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px;")}>${current.map((b) => html`<button key=${b.id} className="btn btn-secondary" style=${S("font-size:13px;")} onClick=${() => setD({ ...d, bookId: b.id })}>${b.title}</button>`)}</div>` : null}
                <${BookPicker} value=${d.bookId} books=${books} onChange=${(id) => setD({ ...d, bookId: id })} /></div>
              <div className="field full"><label>Notes</label>
                <textarea className="input" style=${S("min-height:200px;font-family:var(--font-body);line-height:1.6;")} value=${d.text} placeholder="What you read, what struck you, what it connects to. Blank lines start new paragraphs." onChange=${(e) => setD({ ...d, text: e.target.value })}></textarea></div>

              <div className="cab-form-section">Quotes — saved to Library → Quotes as well</div>
              ${qs.map((q, i) => html`
                <div key=${i} className="full jr-qform">
                  <textarea className="input" style=${S("min-height:80px;font-family:var(--font-heading);font-size:17px;")} value=${q.quote} placeholder="The passage, word for word" onChange=${(e) => setQ(i, { quote: e.target.value })}></textarea>
                  <div style=${S("display:grid;grid-template-columns:110px 1fr;gap:var(--space-2);margin-top:6px;")}>
                    <input className="input" value=${q.page} placeholder="Page" onChange=${(e) => setQ(i, { page: e.target.value })} />
                    <input className="input" value=${q.note} placeholder="Note on the quote (optional)" onChange=${(e) => setQ(i, { note: e.target.value })} />
                  </div>
                  <div style=${S("display:flex;gap:5px;flex-wrap:wrap;margin-top:6px;align-items:center;")}>
                    ${Array.from(new Set(themes.concat(q.themes))).map((t) => html`<span key=${t} className=${"tag " + (q.themes.indexOf(t) !== -1 ? "tag-accent" : "tag-outline")} style=${S("cursor:pointer;")} onClick=${() => toggleTheme(i, t)}>${t}</span>`)}
                    <input className="input" style=${S("width:140px;padding:2px 8px;font-size:13px;")} value=${themeIn[i] || ""} placeholder="+ theme"
                      onChange=${(e) => setThemeIn({ ...themeIn, [i]: e.target.value })}
                      onKeyDown=${(e) => { const v = (themeIn[i] || "").trim(); if (e.key === "Enter" && v) { e.preventDefault(); if (q.themes.indexOf(v) === -1) setQ(i, { themes: [...q.themes, v] }); setThemeIn({ ...themeIn, [i]: "" }); } }} />
                    <button className="btn btn-ghost" style=${S("margin-left:auto;font-size:13px;color:#a33;")} onClick=${() => setQs(qs.filter((_, k) => k !== i))}>Remove</button>
                  </div>
                </div>`)}
              <div className="full"><button className="btn btn-secondary" onClick=${addQ}>+ Add a quote</button></div>

              <div className="field full"><label>Tags</label>
                <div style=${S("display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px;")}>${(d.tags || []).map((t) => html`<span key=${t} className="tag tag-outline" style=${S("cursor:pointer;")} onClick=${() => setD({ ...d, tags: d.tags.filter((x) => x !== t) })}>${t} ×</span>`)}</div>
                <input className="input" value=${tagIn} placeholder="Add a tag, press Enter" onChange=${(e) => setTagIn(e.target.value)} onKeyDown=${(e) => { if (e.key === "Enter" && tagIn.trim()) { e.preventDefault(); if ((d.tags || []).indexOf(tagIn.trim()) === -1) setD({ ...d, tags: [...(d.tags || []), tagIn.trim()] }); setTagIn(""); } }} /></div>
            </div>
            ${err ? html`<div style=${S("color:#a33;font-size:13px;margin-top:var(--space-2);")}>${err}</div>` : null}
          </div>
          <div className="dialog-actions cab-actions">
            ${initial.id ? html`<button className="btn btn-ghost" style=${S("margin-right:auto;color:#a33;")} onClick=${() => { if (confirm("Delete this entry? Its quotes stay in the Library.")) onDelete(d); }}>Delete entry</button>` : null}
            <button className="btn btn-ghost" onClick=${onCancel}>Cancel</button>
            <button className="btn btn-primary" onClick=${save}>Save</button>
          </div>
        </div>
      </div>`;
  }

  // ---------- views ----------
  function NowReading({ doc, books, quotes, onStart, onEntry, onFinish, onSetAside, onEdit }) {
    const cur = doc.readings.filter((r) => r.status === "reading").sort((a, b) => b.started.localeCompare(a.started));
    const year = today().slice(0, 4);
    const doneYear = doc.readings.filter((r) => r.status === "finished" && (r.finished || "").slice(0, 4) === year).sort((a, b) => b.finished.localeCompare(a.finished));
    const recent = doc.entries.slice().sort((a, b) => b.date.localeCompare(a.date) || (b.created || "").localeCompare(a.created || "")).slice(0, 5);
    const month = today().slice(0, 7);
    return html`<div className="jr-page">
      <div className="jr-head">
        <h2 className="cab-h2">Now reading</h2>
        <span className="jr-stat">${cur.length} open · ${doneYear.length} finished in ${year} · ${((n) => n + (n === 1 ? " entry" : " entries"))(doc.entries.filter((e) => e.date.slice(0, 7) === month).length)} this month</span>
        <button className="btn btn-secondary" style=${S("margin-left:auto;")} onClick=${onStart}>+ Start a book</button>
      </div>
      ${cur.length ? html`<div className="jr-grid">${cur.map((r) => { const b = bookOf(r.bookId, books); const es = doc.entries.filter((e) => e.bookId === r.bookId && e.date >= r.started); const last = es.slice().sort((a, b) => b.date.localeCompare(a.date))[0];
        return html`<div key=${r.id} className="card jr-card">
          <div className="card-kicker">Since ${fmt(r.started)} · ${days(r.started)} days</div>
          <div className="card-title"><a href=${"#journal/book/" + encodeURIComponent(r.bookId)} style=${S("color:inherit;text-decoration:none;")}>${b.title}</a></div>
          <div className="card-body">${b.author}</div>
          <div className="card-meta">${es.length} ${es.length === 1 ? "entry" : "entries"}${last && last.pages ? " · last pp. " + last.pages : ""}${quotes.filter((q) => q.bookId === r.bookId).length ? " · " + quotes.filter((q) => q.bookId === r.bookId).length + " quotes" : ""}</div>
          <div style=${S("display:flex;gap:var(--space-2);margin-top:var(--space-2);flex-wrap:wrap;")}>
            <button className="btn btn-primary" onClick=${() => onEntry(r.bookId)}>+ Entry</button>
            <button className="btn btn-ghost" onClick=${() => onFinish(r)}>Finished</button>
            <button className="btn btn-ghost" onClick=${() => onSetAside(r)}>Set aside</button>
          </div>
        </div>`; })}</div>`
        : html`<p className="cab-sub">Nothing open. Start a book from your Library — or write an entry directly, and the book is opened for you.</p>`}
      ${recent.length ? html`<h3 className="jr-h3">Latest entries</h3>${recent.map((e) => html`<${EntryView} key=${e.id} e=${e} books=${books} quotes=${quotes} onEdit=${onEdit} showBook=${true} />`)}` : null}
      ${doneYear.length ? html`<h3 className="jr-h3">Finished in ${year}</h3>
        <div>${doneYear.map((r) => { const b = bookOf(r.bookId, books); return html`<div key=${r.id} className="jr-line"><span className="jr-ld">${fmt(r.finished, { day: "numeric", month: "short" })}</span><a href=${"#journal/book/" + encodeURIComponent(r.bookId)}><i>${b.title}</i></a> — ${b.author} <span className="jr-pages">· ${days(r.started, r.finished)} days</span></div>`; })}</div>` : null}
    </div>`;
  }

  function Entries({ doc, books, quotes, onEdit }) {
    const [q, setQ] = useState("");
    const k = q.trim().toLowerCase();
    const list = doc.entries.filter((e) => { if (!k) return true; const b = bookOf(e.bookId, books); const qs = (e.quoteIds || []).map((id) => quotes.find((x) => x.id === id)).filter(Boolean).map((x) => x.quote).join(" ");
      return (e.text + " " + b.title + " " + b.author + " " + (e.tags || []).join(" ") + " " + qs).toLowerCase().indexOf(k) !== -1; })
      .sort((a, b) => b.date.localeCompare(a.date) || (b.created || "").localeCompare(a.created || ""));
    const months = []; list.forEach((e) => { const m = e.date.slice(0, 7); if (!months.length || months[months.length - 1][0] !== m) months.push([m, []]); months[months.length - 1][1].push(e); });
    return html`<div className="jr-page">
      <div className="jr-head"><h2 className="cab-h2">Entries</h2><span className="jr-stat">${doc.entries.length} in all</span>
        <input className="input" style=${S("margin-left:auto;width:260px;")} value=${q} placeholder="Search notes, quotes, books, tags…" onChange=${(e) => setQ(e.target.value)} /></div>
      ${months.map(([m, es]) => html`<section key=${m}><h3 className="jr-h3">${fmt(m + "-15", { month: "long", year: "numeric" })}</h3>${es.map((e) => html`<${EntryView} key=${e.id} e=${e} books=${books} quotes=${quotes} onEdit=${onEdit} showBook=${true} />`)}</section>`)}
      ${!doc.entries.length ? html`<p className="cab-sub">No entries yet.</p>` : !list.length ? html`<p className="cab-sub">Nothing matches.</p>` : null}
    </div>`;
  }

  function Books({ doc, books, quotes, onEdit, onEntry, onStart, onPatchReading, onDeleteReading }) {
    const ids = Array.from(new Set(doc.readings.map((r) => r.bookId).concat(doc.entries.map((e) => e.bookId))));
    const rows = ids.map((id) => { const rs = doc.readings.filter((r) => r.bookId === id); const last = rs.slice().sort((a, b) => b.started.localeCompare(a.started))[0]; return { id, b: bookOf(id, books), last, n: doc.entries.filter((e) => e.bookId === id).length }; })
      .sort((a, b) => ((b.last && (b.last.finished || b.last.started)) || "").localeCompare((a.last && (a.last.finished || a.last.started)) || ""));
    const label = (r) => !r ? "notes only" : r.status === "reading" ? "reading since " + fmt(r.started) : r.status === "finished" ? "finished " + fmt(r.finished) : "set aside " + fmt(r.finished || r.started);
    return html`<div className="jr-page">
      <div className="jr-head"><h2 className="cab-h2">Books</h2><span className="jr-stat">${ids.length} with a journal</span>
        <button className="btn btn-secondary" style=${S("margin-left:auto;")} onClick=${onStart}>+ Start a book</button></div>
      ${rows.map((x) => html`<div key=${x.id} className="jr-line"><a href=${"#journal/book/" + encodeURIComponent(x.id)}><i>${x.b.title}</i></a> — ${x.b.author}<span className="jr-pages"> · ${label(x.last)} · ${x.n} ${x.n === 1 ? "entry" : "entries"}</span></div>`)}
      ${!rows.length ? html`<p className="cab-sub">No books in the journal yet.</p>` : null}
    </div>`;
  }

  function BookPage({ id, doc, books, quotes, onEdit, onEntry, onStart, onPatchReading, onDeleteReading }) {
    const b = bookOf(id, books);
    const rs = doc.readings.filter((r) => r.bookId === id).sort((a, b) => b.started.localeCompare(a.started));
    const es = doc.entries.filter((e) => e.bookId === id).sort((a, b) => b.date.localeCompare(a.date));
    const loose = quotes.filter((q) => q.bookId === id && !es.some((e) => (e.quoteIds || []).indexOf(q.id) !== -1));
    const open = rs.find((r) => r.status === "reading");
    return html`<div className="jr-page">
      <div style=${S("margin-bottom:var(--space-2);")}><a href="#journal/books">← Books</a></div>
      <div className="cab-kicker">${b.alex ? "Alexandria" : "Library"}</div>
      <h1 style=${S("font-size:36px;margin:2px 0;")}>${b.title}</h1>
      <div style=${S("font-size:16px;color:var(--color-neutral-700);")}>${b.author}</div>
      <div style=${S("display:flex;gap:var(--space-2);margin:var(--space-4) 0;flex-wrap:wrap;")}>
        <button className="btn btn-primary" onClick=${() => onEntry(id)}>+ Entry</button>
        ${!open ? html`<button className="btn btn-secondary" onClick=${() => onStart(id)}>${rs.length ? "Start a re-reading" : "Start reading"}</button>` : null}
      </div>
      ${rs.length ? html`<h3 className="jr-h3">Readings</h3>${rs.map((r) => html`<div key=${r.id} className="jr-reading">
        <select className="input" value=${r.status} onChange=${(e) => onPatchReading(r, { status: e.target.value, finished: e.target.value === "reading" ? "" : (r.finished || today()) })}>
          <option value="reading">Reading</option><option value="finished">Finished</option><option value="set-aside">Set aside</option></select>
        <label>from <input className="input" type="date" value=${r.started} onChange=${(e) => onPatchReading(r, { started: e.target.value })} /></label>
        ${r.status !== "reading" ? html`<label>to <input className="input" type="date" value=${r.finished || ""} onChange=${(e) => onPatchReading(r, { finished: e.target.value })} /></label>` : null}
        <span className="jr-pages">${days(r.started, r.finished)} days</span>
        <button className="btn btn-ghost" style=${S("margin-left:auto;color:#a33;")} onClick=${() => { if (confirm("Remove this reading? Entries stay.")) onDeleteReading(r); }}>×</button>
      </div>`)}` : null}
      <h3 className="jr-h3">Entries · ${es.length}</h3>
      ${es.map((e) => html`<${EntryView} key=${e.id} e=${e} books=${books} quotes=${quotes} onEdit=${onEdit} showBook=${false} />`)}
      ${!es.length ? html`<p className="cab-sub">No entries yet.</p>` : null}
      ${loose.length ? html`<h3 className="jr-h3">Other quotes from this book (Library)</h3>${loose.map((q) => html`<${QuoteBlock} key=${q.id} q=${q} />`)}` : null}
    </div>`;
  }

  function StartDialog({ books, preset, onStart, onCancel }) {
    const [id, setId] = useState(preset || "");
    const [date, setDate] = useState(today());
    return html`<div className="dialog-backdrop" style=${S("z-index:1000;")}>
      <div className="dialog" onClick=${(e) => e.stopPropagation()} style=${S("max-width:560px;width:94vw;overflow:visible;")}>
        <div className="dialog-title">Start a book</div>
        <div className="dialog-body" style=${S("opacity:1;display:grid;gap:var(--space-3);")}>
          <div className="field"><label>Book</label><${BookPicker} value=${id} books=${books} onChange=${setId} autoFocus=${true} /></div>
          <div className="field"><label>Started</label><input className="input" type="date" value=${date} onChange=${(e) => setDate(e.target.value)} /></div>
        </div>
        <div className="dialog-actions"><button className="btn btn-ghost" onClick=${onCancel}>Cancel</button><button className="btn btn-primary" disabled=${!id} onClick=${() => onStart(id, date)}>Start</button></div>
      </div></div>`;
  }

  // ---------- module ----------
  function readRoute() { const p = (location.hash || "").replace(/^#\/?/, "").split("/"); return { tab: ["entries", "books", "book"].indexOf(p[1]) !== -1 ? p[1] : "now", id: p[2] ? decodeURIComponent(p[2]) : null }; }

  function Journal({ modules, active, go }) {
    const [doc, setDocState] = useState(() => ({ ...EMPTY, ...B.store.get("journal", {}) }));
    const [theme, toggleTheme] = useTheme();
    const [route, setRoute] = useState(readRoute);
    const [form, setForm] = useState(null);
    const [start, setStart] = useState(null);
    const [menu, setMenu] = useState(false);
    const [toast, setToast] = useState("");
    const [libTick, setLibTick] = useState(0);
    const books = useMemo(allBooks, [libTick]);
    const quotes = useMemo(() => lib().quotes || [], [libTick]);
    useEffect(() => B.bus.on("store:journal", (d) => setDocState({ ...EMPTY, ...d })), []);
    useEffect(() => B.bus.on("library", () => setLibTick((t) => t + 1)), []);
    useEffect(() => { const f = () => setRoute(readRoute()); window.addEventListener("hashchange", f); return () => window.removeEventListener("hashchange", f); }, []);
    const commit = (next) => { setDocState(next); B.store.set("journal", next); };
    const say = (m) => { setToast(m); setTimeout(() => setToast((t) => t === m ? "" : t), 2500); };
    const goTab = (t) => { location.hash = t === "now" ? "#journal" : "#journal/" + t; };

    const startReading = (bookId, date, base) => {
      const d = base || doc;
      if (d.readings.some((r) => r.bookId === bookId && r.status === "reading")) return d;
      return { ...d, readings: [...d.readings, { id: uid("rd"), bookId, started: date || today(), finished: "", status: "reading" }] };
    };
    const saveEntry = (d, kept, dropped) => {
      const now = new Date().toISOString();
      const entryId = d.id || uid("en");
      // quotes → Library
      const ids = [];
      writeLib((L) => {
        L.quotes = L.quotes || []; L.themes = L.themes || [];
        kept.forEach((q) => {
          (q.themes || []).forEach((t) => { if (!L.themes.some((x) => x.toLowerCase() === t.toLowerCase())) L.themes.push(t); });
          if (q.id && L.quotes.some((x) => x.id === q.id)) { L.quotes = L.quotes.map((x) => x.id === q.id ? { ...x, quote: q.quote, page: q.page, note: q.note, themes: q.themes, bookId: d.bookId, entryId, date: d.date } : x); ids.push(q.id); }
          else { const id = "quote-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5); L.quotes.push({ id, bookId: d.bookId, quote: q.quote, page: q.page, note: q.note, themes: q.themes, entryId, date: d.date }); ids.push(id); }
        });
        // quotes removed from the entry are kept in the Library, just unlinked
        dropped.forEach((q) => { L.quotes = L.quotes.map((x) => x.id === q.id ? { ...x, entryId: undefined } : x); });
      });
      setLibTick((t) => t + 1);
      const e = { ...d, id: entryId, quoteIds: ids, created: d.created || now, updated: now };
      let next = { ...doc, entries: doc.entries.some((x) => x.id === entryId) ? doc.entries.map((x) => x.id === entryId ? e : x) : [...doc.entries, e] };
      // writing about a book that isn't open opens it (unless it was finished after this date)
      if (!next.readings.some((r) => r.bookId === d.bookId && (r.status === "reading" || (r.finished && r.finished >= d.date && r.started <= d.date)))) next = startReading(d.bookId, d.date, next);
      commit(next); setForm(null); say(kept.length ? "Entry saved · " + kept.length + (kept.length === 1 ? " quote" : " quotes") + " added to the Library" : "Entry saved");
    };
    const deleteEntry = (d) => { commit({ ...doc, entries: doc.entries.filter((x) => x.id !== d.id) }); setForm(null); say("Entry deleted"); };
    const patchReading = (r, patch) => commit({ ...doc, readings: doc.readings.map((x) => x.id === r.id ? { ...x, ...patch } : x) });
    const finish = (r) => { patchReading(r, { status: "finished", finished: today() }); say("Finished — well read"); };
    const setAside = (r) => patchReading(r, { status: "set-aside", finished: today() });
    const backup = async () => { setMenu(false); try { if (await B.backup.backupAll()) say("Backup saved"); } catch (e) { say("Backup failed: " + e.message); } };
    const onEntry = (bookId) => setForm({ bookId: bookId || "" });

    const common = { doc, books, quotes, onEdit: (e) => setForm(e), onEntry, onStart: (id) => setStart({ preset: typeof id === "string" ? id : "" }), onPatchReading: patchReading, onDeleteReading: (r) => commit({ ...doc, readings: doc.readings.filter((x) => x.id !== r.id) }) };
    let body;
    if (route.tab === "book" && route.id) body = html`<${BookPage} id=${route.id} ...${common} />`;
    else if (route.tab === "entries") body = html`<${Entries} ...${common} />`;
    else if (route.tab === "books") body = html`<${Books} ...${common} />`;
    else body = html`<${NowReading} ...${common} onFinish=${finish} onSetAside=${setAside} />`;
    const tabKey = route.tab === "book" ? "books" : route.tab;
    const tabBtn = (id, label) => html`<button className="btn btn-ghost" onClick=${() => goTab(id)} style=${S("border-radius:0;border-bottom:2px solid " + (tabKey === id ? "var(--color-accent);color:var(--color-accent-700);" : "transparent;"))}>${label}</button>`;

    return html`
      <div className="cab-page" data-theme=${theme}>
        <div className="nav" style=${S("position:sticky;top:0;z-index:20;display:block;background-color:var(--color-bg);")}>
          <div style=${S("display:flex;flex-direction:column;gap:var(--space-3);width:100%;")}>
            <div style=${S("display:flex;align-items:baseline;justify-content:space-between;gap:var(--space-3);width:100%;")}>
              <${Brand} title="Journal" modules=${modules} active=${active} go=${go} />
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
            <div style=${S("display:flex;align-items:center;gap:var(--space-2);flex-wrap:wrap;")}>
              ${tabBtn("now", "Now reading")}${tabBtn("entries", "Entries")}${tabBtn("books", "Books")}
              <button className="btn btn-primary" style=${S("margin-left:auto;")} onClick=${() => onEntry(route.tab === "book" ? route.id : "")}>+ New entry</button>
            </div>
          </div>
        </div>
        ${body}
        ${form ? html`<${EntryForm} initial=${form} books=${books} readings=${doc.readings} onSave=${saveEntry} onCancel=${() => setForm(null)} onDelete=${deleteEntry} />` : null}
        ${start ? html`<${StartDialog} books=${books} preset=${start.preset} onCancel=${() => setStart(null)} onStart=${(id, date) => { const next = startReading(id, date); commit(next); setStart(null); say("Started"); }} />` : null}
        ${toast ? html`<div style=${S("position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--color-text);color:var(--color-bg);padding:8px 16px;border-radius:var(--radius-md);font-size:14px;z-index:3000;")}>${toast}</div>` : null}
      </div>`;
  }

  // One line for the Library's book dialog.
  B.journal = {
    Component: Journal,
    summaryFor(bookId) {
      const d = B.store.get("journal", EMPTY);
      const rs = (d.readings || []).filter((r) => r.bookId === bookId).sort((a, b) => b.started.localeCompare(a.started));
      const n = (d.entries || []).filter((e) => e.bookId === bookId).length;
      if (!rs.length && !n) return "";
      const r = rs[0];
      const st = !r ? "" : r.status === "reading" ? "Reading since " + fmt(r.started) : r.status === "finished" ? "Finished " + fmt(r.finished) : "Set aside " + fmt(r.finished || r.started);
      return "Journal: " + [st, n ? n + (n === 1 ? " entry" : " entries") : ""].filter(Boolean).join(" · ");
    }
  };
  B.registerModule({ id: "journal", name: "Journal", blurb: "What you are reading, dated notes, quotes in context", order: 15, Component: Journal });
})();
