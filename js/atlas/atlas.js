// Atlas — Rome on Nolli's 1748 plan, and the Albanian lands.
//
// Stored in B.store "atlas":
//   { sites: [ { id, map: "rome"|"albania", name, lat, lon, nolli, layer, notes, tags: [], cabinet: [pieceId] } ],
//     prefs: { rome: {...}, albania: {...} } }
// Reference data (public, not yours): assets/nolli-points.js (loaded on first use), assets/gazetteer.js.
// Cabinet pieces appear on a site when one of their tags matches the site's name or aliases,
// or when linked to one of your own sites by hand.
(function () {
  const { React, html, S, H, Brand, ThemeToggle, useTheme, Thumb } = B.ui;
  const { useState, useEffect, useRef, useMemo } = React;

  const TILES = {
    nolli: { url: "https://stacks.stanford.edu/file/nn217br6628/{z}/{x}/{y}.png", bounds: [[41.8619, 12.4408], [41.9203, 12.5275]], maxNativeZoom: 18,
      attribution: "Nolli, <i>La Pianta Grande di Roma</i> (1748): University of Oregon / Stanford CESTA, CC BY-NC-SA 4.0" },
    light: { url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", maxNativeZoom: 20, attribution: "&copy; OpenStreetMap contributors &copy; CARTO" },
    relief: { url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", maxNativeZoom: 17, attribution: "&copy; OpenStreetMap contributors, SRTM | &copy; OpenTopoMap (CC-BY-SA)" }
  };
  const MAPS = {
    rome: { name: "Rome", center: [41.8975, 12.4800], zoom: 15, minZoom: 12, maxZoom: 20 },
    albania: { name: "Albanian lands", center: [41.75, 20.35], zoom: 8, minZoom: 6, maxZoom: 17 }
  };
  const LAYERS = {
    ancient: ["Antiquity", "#9b3d26"], "early-christian": ["Early Christian", "#6b4a8a"], medieval: ["Medieval", "#46784a"],
    renaissance: ["Renaissance", "#2f6690"], baroque: ["Baroque", "#b8862b"], modern: ["Modern", "#6f6f6f"],
    "illyrian-ancient": ["Illyrian & ancient", "#9b3d26"], "byzantine-medieval": ["Byzantine & medieval", "#6b4a8a"], skanderbeg: ["Skanderbeg", "#a8221c"],
    ottoman: ["Ottoman", "#2f7a6f"], "national-awakening": ["National awakening", "#b8862b"]
  };
  const ROME_LAYERS = ["ancient", "early-christian", "medieval", "renaissance", "baroque", "modern"];
  const ALB_LAYERS = ["illyrian-ancient", "byzantine-medieval", "skanderbeg", "ottoman", "national-awakening", "modern"];
  // Nolli's index grouped for filtering and colour.
  const NGROUPS = [
    ["church", "Churches, chapels, oratories", "#6b4a8a", /church|chapel|oratory|monastery|convent|basilica/i],
    ["palace", "Palaces and houses", "#8a6a45", /palace|residence|house|villa|college/i],
    ["ruin", "Ruins and antiquities", "#9b3d26", /ruin|arch|tomb|column|obelisk|theater|amphi|bath/i],
    ["piazza", "Piazzas and fountains", "#2f6690", /piazza|fountain/i],
    ["other", "Hospitals, gates, other", "#6f6f6f", /./],
    ["street", "Streets", "#a59a88", /^street/i]
  ];
  const ngroup = (types) => { const t = types || ""; if (/^street/i.test(t)) return "street"; for (const g of NGROUPS) if (g[0] !== "street" && g[3].test(t)) return g[0]; return "other"; };
  const DEFAULT_PREFS = {
    rome: { nolli: 85, base: "light", showNolli: true, ngroups: { church: true, palace: true, ruin: true, piazza: true, other: true, street: false }, monuments: true, obelisks: true, mine: true, cabinet: true },
    albania: { base: "relief", sites: true, places: true, mine: true, cabinet: true }
  };
  const norm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[’‘`´]/g, "'").replace(/\s+/g, " ").trim();
  const uid = () => "site-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 6);

  // ---------- data ----------
  const scripts = {};
  function loadScript(src) {
    if (scripts[src]) return scripts[src];
    scripts[src] = new Promise((res, rej) => { const s = document.createElement("script"); s.src = src; s.onload = res; s.onerror = () => rej(new Error("Could not load " + src)); document.head.appendChild(s); });
    return scripts[src];
  }
  const NOLLI_KEYS = ["n", "rione", "nolliName", "unravelled", "modern", "types", "categories", "architects", "chronology", "extant", "patrons", "lat", "lon"];
  let NOLLI = null;
  function nolliRows() {
    if (NOLLI || !B.data || !B.data.nolli) return NOLLI;
    NOLLI = B.data.nolli.map((r) => { const o = {}; NOLLI_KEYS.forEach((k, i) => { o[k] = r[i]; }); o.group = ngroup(o.types); o.title = o.modern || o.unravelled || o.nolliName; return o; });
    return NOLLI;
  }
  const gaz = () => (B.data && B.data.gazetteer) || { rome: [], obelisks: [], albania: [] };

  function cabinetPieces() { const c = B.store.get("cabinet", { objects: [] }); return c.objects || []; }
  function piecesFor(names, manual) {
    const keys = new Set(names.filter(Boolean).map(norm));
    return cabinetPieces().filter((o) => (manual || []).indexOf(o.id) !== -1 || (o.tags || []).some((t) => keys.has(norm(t))));
  }
  // A site's names for matching: name, local names, aliases, tags, and the name without a bracketed qualifier.
  const siteNames = (s) => { const n = [s.name, s.it, s.sq].concat(s.aliases || [], s.tags || []).filter(Boolean); return n.concat(n.map((x) => String(x).replace(/\s*\([^)]*\)\s*/g, " ").trim())); };

  // ---------- map (imperative Leaflet inside a React component) ----------
  function MapView({ mapId, prefs, features, onSelect, adding, onAddAt, focus, highlight }) {
    const el = useRef(null), map = useRef(null), base = useRef({}), groups = useRef({}), hl = useRef(null);
    useEffect(() => {
      const cfg = MAPS[mapId];
      const m = L.map(el.current, { center: cfg.center, zoom: cfg.zoom, minZoom: cfg.minZoom, maxZoom: cfg.maxZoom, preferCanvas: true, zoomControl: true });
      map.current = m;
      base.current.light = L.tileLayer(TILES.light.url, { maxNativeZoom: TILES.light.maxNativeZoom, maxZoom: cfg.maxZoom, attribution: TILES.light.attribution, subdomains: "abcd", detectRetina: true });
      base.current.relief = L.tileLayer(TILES.relief.url, { maxNativeZoom: TILES.relief.maxNativeZoom, maxZoom: cfg.maxZoom, attribution: TILES.relief.attribution, subdomains: "abc" });
      if (mapId === "rome") base.current.nolli = L.tileLayer(TILES.nolli.url, { bounds: TILES.nolli.bounds, maxNativeZoom: TILES.nolli.maxNativeZoom, maxZoom: cfg.maxZoom, attribution: TILES.nolli.attribution });
      L.control.scale({ imperial: false }).addTo(m);
      return () => { m.remove(); map.current = null; };
    }, [mapId]);

    // base layers
    useEffect(() => {
      const m = map.current; if (!m) return;
      Object.values(base.current).forEach((l) => m.hasLayer(l) && m.removeLayer(l));
      base.current[prefs.base === "relief" ? "relief" : "light"].addTo(m);
      if (base.current.nolli && prefs.showNolli) { base.current.nolli.setOpacity(prefs.nolli / 100); base.current.nolli.addTo(m); }
    }, [prefs.base, prefs.showNolli, prefs.nolli]);

    // overlays: rebuilt when the feature lists change
    useEffect(() => {
      const m = map.current; if (!m) return;
      Object.values(groups.current).forEach((g) => m.removeLayer(g)); groups.current = {};
      const tip = (t) => ({ className: "at-tip", direction: "top", offset: [0, -4] });
      for (const f of features) {
        const g = L.layerGroup();
        for (const it of f.items) {
          let mk;
          if (f.style === "dot") mk = L.circleMarker([it.lat, it.lon], { radius: it.r || 4, color: "#fff8e8", weight: 1, fillColor: it.color, fillOpacity: 0.9 });
          else if (f.style === "ring") mk = L.circleMarker([it.lat, it.lon], { radius: it.r || 7, color: it.color, weight: 2.5, fillColor: "#fff8e8", fillOpacity: 0.85 });
          else mk = L.marker([it.lat, it.lon], { icon: L.divIcon({ className: "at-icon", html: it.icon, iconSize: it.iconSize || [14, 14], iconAnchor: it.iconAnchor || [7, 7] }), riseOnHover: true, zIndexOffset: f.z || 0 });
          mk.bindTooltip(it.label, tip());
          mk.on("click", () => onSelect(it.sel));
          mk.addTo(g);
        }
        g.addTo(m); groups.current[f.id] = g;
      }
    }, [features]);

    useEffect(() => {
      const m = map.current; if (!m) return;
      const h = (e) => { if (adding) onAddAt(e.latlng); };
      m.on("click", h); return () => m.off("click", h);
    }, [adding, onAddAt]);
    useEffect(() => {
      const m = map.current; if (!m) return;
      if (hl.current) { m.removeLayer(hl.current); hl.current = null; }
      if (highlight) hl.current = L.circleMarker([highlight.lat, highlight.lon], { radius: 14, color: "#b8862b", weight: 3, fill: false, interactive: false }).addTo(m);
    }, [highlight && highlight.lat, highlight && highlight.lon]);
    useEffect(() => { if (focus && map.current) map.current.flyTo([focus.lat, focus.lon], focus.zoom || map.current.getZoom(), { duration: 0.8 }); }, [focus]);
    return html`<div className=${"at-map" + (adding ? " adding" : "")}><div ref=${el} style=${S("position:absolute;inset:0;")}></div></div>`;
  }

  // ---------- detail cards ----------
  function Pieces({ pieces }) {
    if (!pieces.length) return null;
    return html`<div><div className="at-kicker" style=${S("margin:var(--space-3) 0 var(--space-2) 0;")}>In your Cabinet · ${pieces.length}</div>
      <div className="at-pieces">${pieces.map((o) => html`<div key=${o.id} className="at-piece" onClick=${() => { location.hash = "#cabinet/piece/" + o.id; }}>
        <div className="pic">${o.images && o.images[0] ? html`<${Thumb} id=${o.images[0]} />` : null}</div>${o.title}</div>`)}</div></div>`;
  }
  function Chronology({ text }) {
    const rows = String(text || "").split(";").map((s) => s.trim()).filter(Boolean).map((s) => { const m = s.match(/^([\dc.\-–\s?/]+(?:BC|AD)?)\s+(.*)$/); return m ? [m[1].trim(), m[2]] : ["", s]; });
    if (!rows.length) return null;
    return html`<ul className="at-chron">${rows.map(([d, t], i) => html`<li key=${i}><b>${d}</b><span>${t}</span></li>`)}</ul>`;
  }
  function NolliCard({ n, onAdd, extraNames, nested }) {
    const pieces = nested ? [] : piecesFor([n.modern, n.unravelled].concat(extraNames || []));
    return html`<div>
      <div className="at-kicker">Nolli no. ${n.n} · Rione ${String(n.rione).replace(/^\d+\s*/, "")}</div>
      <div className="at-title">${n.title}</div>
      <div className="at-sub">${n.nolliName}</div>
      <dl className="cab-facts" style=${S("margin:var(--space-3) 0;font-size:13px;")}>
        ${n.types ? html`<dt>Type</dt><dd>${n.types}</dd>` : null}
        ${n.architects ? html`<dt>Architects</dt><dd>${n.architects}</dd>` : null}
        ${n.patrons ? html`<dt>Patrons</dt><dd>${n.patrons}</dd>` : null}
        ${n.extant ? html`<dt>Extant</dt><dd>${n.extant}</dd>` : null}
      </dl>
      <${Chronology} text=${n.chronology} />
      <${Pieces} pieces=${pieces} />
      ${onAdd ? html`<button className="btn btn-secondary" style=${S("margin-top:var(--space-3);")} onClick=${onAdd}>+ Add to my sites</button>` : null}
    </div>`;
  }
  function SiteCard({ s, kind, onAdd }) {
    const n = s.nolli && nolliRows() ? nolliRows().find((x) => x.n === s.nolli) : null;
    const pieces = piecesFor(siteNames(s));
    const L_ = LAYERS[s.layer];
    return html`<div>
      <div className="at-kicker">${kind === "obelisk" ? "Obelisk" : L_ ? L_[0] : ""}${s.built || s.date ? " · " + (s.built || s.date) : ""}${s.nolli ? " · Nolli no. " + s.nolli : ""}</div>
      <div className="at-title">${s.name}</div>
      ${s.it || s.sq ? html`<div className="at-sub">${s.it || s.sq}</div>` : null}
      ${kind === "obelisk" ? html`<dl className="cab-facts" style=${S("margin:var(--space-3) 0;font-size:13px;")}>
        ${s.origin ? html`<dt>Origin</dt><dd>${s.origin}</dd>` : null}
        ${s.materialHeight ? html`<dt>Stone, height</dt><dd>${s.materialHeight}</dd>` : null}
        ${s.ancientSite ? html`<dt>In antiquity</dt><dd>${s.ancientSite}</dd>` : null}
        ${s.reerected && s.reerected.year ? html`<dt>Re-erected</dt><dd>${[s.reerected.year, s.reerected.pope, s.reerected.architect].filter(Boolean).join(" · ")}</dd>` : null}
        ${s.status && s.status !== "standing" ? html`<dt>Status</dt><dd>${s.status}</dd>` : null}
      </dl>` : null}
      ${s.note ? html`<p style=${S("font-size:14px;line-height:1.6;margin:var(--space-2) 0;")}>${s.note}</p>` : null}
      ${s.source ? html`<div style=${S("font-size:12px;")}><a href=${s.source} target="_blank" rel="noopener">Source</a>${s.confidence === "low" ? " · to be checked" : ""}</div>` : null}
      <${Pieces} pieces=${pieces} />
      ${n ? html`<div className="at-box" style=${S("margin-top:var(--space-3);")}><${NolliCard} n=${n} nested=${true} /></div>` : null}
      ${onAdd ? html`<button className="btn btn-secondary" style=${S("margin-top:var(--space-3);")} onClick=${onAdd}>+ Add to my sites</button>` : null}
    </div>`;
  }
  function MySiteCard({ s, layers, onChange, onDelete }) {
    const [tagIn, setTagIn] = useState("");
    const [pq, setPq] = useState("");
    const pieces = piecesFor(siteNames(s), s.cabinet);
    const all = cabinetPieces();
    const pm = pq.trim().length < 2 ? [] : all.filter((o) => (s.cabinet || []).indexOf(o.id) === -1 && norm(o.title).indexOf(norm(pq)) !== -1).slice(0, 6);
    const set = (k) => (e) => onChange({ ...s, [k]: e.target.value });
    return html`<div style=${S("display:grid;gap:var(--space-2);")}>
      <div className="at-kicker">My site${s.nolli ? " · Nolli no. " + s.nolli : ""}</div>
      <input className="input" style=${S("font-family:var(--font-heading);font-size:22px;")} value=${s.name} onChange=${set("name")} />
      <div className="field"><label>Layer</label><select className="input" value=${s.layer || ""} onChange=${set("layer")}>
        <option value="">—</option>${layers.map((k) => html`<option key=${k} value=${k}>${LAYERS[k][0]}</option>`)}</select></div>
      <div className="field"><label>Notes</label><textarea className="input" style=${S("min-height:140px;font-family:var(--font-body);line-height:1.5;")} value=${s.notes || ""} placeholder="What you know of the place, what to see, what to read…" onChange=${set("notes")}></textarea></div>
      <div className="field"><label>Tags — Cabinet pieces with the same tag appear here</label>
        <div style=${S("display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px;")}>${(s.tags || []).map((t) => html`<span key=${t} className="tag tag-outline" style=${S("cursor:pointer;")} onClick=${() => onChange({ ...s, tags: s.tags.filter((x) => x !== t) })}>${t} ×</span>`)}</div>
        <input className="input" value=${tagIn} placeholder="Add a tag, press Enter" onChange=${(e) => setTagIn(e.target.value)} onKeyDown=${(e) => { if (e.key === "Enter" && tagIn.trim()) { onChange({ ...s, tags: [...(s.tags || []), tagIn.trim()] }); setTagIn(""); } }} /></div>
      <div className="field"><label>Link a Cabinet piece by hand</label>
        <input className="input" value=${pq} placeholder="Search the Cabinet…" onChange=${(e) => setPq(e.target.value)} />
        ${pm.length ? html`<div className="at-res">${pm.map((o) => html`<div key=${o.id} onClick=${() => { onChange({ ...s, cabinet: [...(s.cabinet || []), o.id] }); setPq(""); }}>${o.title}</div>`)}</div>` : null}</div>
      <${Pieces} pieces=${pieces} />
      <div style=${S("font-size:12px;color:var(--color-neutral-700);")}>${s.lat.toFixed(5)}, ${s.lon.toFixed(5)}</div>
      <button className="btn btn-ghost" style=${S("color:#a33;justify-self:start;")} onClick=${() => { if (confirm("Delete this site?")) onDelete(s); }}>Delete site</button>
    </div>`;
  }

  // ---------- module ----------
  function readTab() { const [, t] = (location.hash || "").replace(/^#\/?/, "").split("/"); return t === "albania" ? "albania" : "rome"; }
  // #atlas/<map>/<kind>/<id> opens the map on that site (used by the Cabinet's "On the map" links).
  function readSel() { const [, , k, id] = (location.hash || "").replace(/^#\/?/, "").split("/"); return k && id ? { kind: k, id: k === "nolli" ? +id : decodeURIComponent(id) } : null; }
  // Sites (gazetteer or your own) whose names match a piece's tags.
  B.atlas = B.atlas || {};
  B.atlas.sitesForTags = function (tags) {
    const keys = new Set((tags || []).map(norm)); const G = gaz(); const out = [];
    const test = (s) => siteNames(s).some((n) => keys.has(norm(n)));
    G.rome.forEach((s) => test(s) && out.push({ name: s.name, href: "#atlas/rome/monument/" + s.id }));
    G.obelisks.forEach((s) => test(s) && out.push({ name: "Obelisk · " + s.name, href: "#atlas/rome/obelisk/" + s.id }));
    G.albania.forEach((s) => test(s) && out.push({ name: s.name, href: "#atlas/albania/albsite/" + s.id }));
    (B.store.get("atlas", { sites: [] }).sites || []).forEach((s) => test(s) && out.push({ name: s.name, href: "#atlas/" + s.map + "/mine/" + s.id }));
    return out;
  };

  function Atlas({ modules, active, go }) {
    const [doc, setDocState] = useState(() => { const d = B.store.get("atlas", {}); return { sites: d.sites || [], prefs: { rome: { ...DEFAULT_PREFS.rome, ...((d.prefs || {}).rome || {}) }, albania: { ...DEFAULT_PREFS.albania, ...((d.prefs || {}).albania || {}) } } }; });
    const [theme, toggleTheme] = useTheme();
    const [tab, setTab] = useState(readTab);
    const [sel, setSel] = useState(readSel);
    const [q, setQ] = useState("");
    const [adding, setAdding] = useState(false);
    const [focus, setFocus] = useState(null);
    const [ready, setReady] = useState(!!(B.data && B.data.nolli));
    const [menu, setMenu] = useState(false);
    const [err, setErr] = useState("");
    useEffect(() => { if (!ready) loadScript("assets/nolli-points.js").then(() => setReady(true)).catch((e) => setErr(e.message)); }, []);
    useEffect(() => { const f = () => { setTab(readTab()); setSel(readSel()); setFocus(null); }; window.addEventListener("hashchange", f); return () => window.removeEventListener("hashchange", f); }, []);
    const commit = (next) => { setDocState(next); B.store.set("atlas", next); };
    const prefs = doc.prefs[tab];
    const setPref = (patch) => commit({ ...doc, prefs: { ...doc.prefs, [tab]: { ...prefs, ...patch } } });
    const mine = doc.sites.filter((s) => s.map === tab);
    const G = gaz();
    const nolli = ready ? nolliRows() : [];

    // features for the map
    const features = useMemo(() => {
      const f = [];
      const cab = [];
      if (tab === "rome") {
        if (prefs.showNolli && nolli.length) {
          const groupsOn = prefs.ngroups;
          f.push({ id: "nolli", style: "dot", items: nolli.filter((n) => groupsOn[n.group]).map((n) => ({ lat: n.lat, lon: n.lon, r: 3.6, color: (NGROUPS.find((g) => g[0] === n.group) || [])[2], label: n.n + " · " + n.title, sel: { kind: "nolli", id: n.n } })) });
        }
        if (prefs.monuments) f.push({ id: "mon", style: "ring", items: G.rome.map((s) => ({ lat: s.lat, lon: s.lon, color: (LAYERS[s.layer] || [, "#555"])[1], label: s.name, sel: { kind: "monument", id: s.id } })) });
        if (prefs.obelisks) f.push({ id: "ob", style: "icon", z: 500, items: G.obelisks.map((s) => ({ lat: s.lat, lon: s.lon, icon: '<div class="at-ob"></div>', iconSize: [10, 18], iconAnchor: [5, 18], label: "Obelisk · " + s.name, sel: { kind: "obelisk", id: s.id } })) });
        if (prefs.cabinet) G.rome.concat(G.obelisks).forEach((s) => { const n = piecesFor(siteNames(s)).length; if (n) cab.push({ lat: s.lat, lon: s.lon, icon: '<div class="at-cab">' + n + "</div>", iconSize: [22, 18], iconAnchor: [-6, 22], label: n + " in your Cabinet · " + s.name, sel: { kind: G.obelisks.indexOf(s) !== -1 ? "obelisk" : "monument", id: s.id } }); });
      } else {
        if (prefs.sites) f.push({ id: "alb", style: "ring", items: G.albania.map((s) => ({ lat: s.lat, lon: s.lon, color: (LAYERS[s.layer] || [, "#555"])[1], label: s.name, sel: { kind: "albsite", id: s.id } })) });
        if (prefs.places) {
          const d = B.libraryData(); const counts = {}; (d.books || []).forEach((b) => { if (b.place) counts[b.place] = (counts[b.place] || 0) + 1; });
          const places = (B.library.places || []).filter((p) => (d.hiddenPlaces || []).indexOf(p.id) === -1).concat(d.customPlaces || []).filter((p) => p.lat > 38.5 && p.lat < 43.6 && p.lon > 18.2 && p.lon < 23.6);
          f.push({ id: "lib", style: "dot", items: places.map((p) => ({ lat: p.lat, lon: p.lon, r: counts[p.id] ? Math.min(13, 4 + Math.sqrt(counts[p.id]) * 2) : 3.5, color: counts[p.id] ? "#3b2f22" : "#a59a88", label: p.name + (counts[p.id] ? " — " + counts[p.id] + (counts[p.id] === 1 ? " book" : " books") : ""), sel: { kind: "place", id: p.id } })) });
        }
        if (prefs.cabinet) G.albania.forEach((s) => { const n = piecesFor(siteNames(s)).length; if (n) cab.push({ lat: s.lat, lon: s.lon, icon: '<div class="at-cab">' + n + "</div>", iconSize: [22, 18], iconAnchor: [-6, 22], label: n + " in your Cabinet · " + s.name, sel: { kind: "albsite", id: s.id } }); });
      }
      if (prefs.mine) f.push({ id: "mine", style: "icon", z: 800, items: mine.map((s) => ({ lat: s.lat, lon: s.lon, icon: '<div class="at-mine"></div>', iconSize: [14, 14], iconAnchor: [7, 7], label: s.name, sel: { kind: "mine", id: s.id } })) });
      if (prefs.cabinet) { mine.forEach((s) => { const n = piecesFor(siteNames(s), s.cabinet).length; if (n) cab.push({ lat: s.lat, lon: s.lon, icon: '<div class="at-cab">' + n + "</div>", iconSize: [22, 18], iconAnchor: [-6, 22], label: n + " in your Cabinet · " + s.name, sel: { kind: "mine", id: s.id } }); }); f.push({ id: "cab", style: "icon", z: 1000, items: cab }); }
      return f;
    }, [tab, ready, prefs, doc.sites]);

    // search
    const results = useMemo(() => {
      const k = norm(q); if (k.length < 2) return [];
      const out = [];
      mine.forEach((s) => { if (norm(s.name).indexOf(k) !== -1) out.push({ label: s.name, sub: "My site", sel: { kind: "mine", id: s.id }, lat: s.lat, lon: s.lon }); });
      const src = tab === "rome" ? G.rome.map((s) => [s, "monument"]).concat(G.obelisks.map((s) => [s, "obelisk"])) : G.albania.map((s) => [s, "albsite"]);
      src.forEach(([s, kind]) => { if (siteNames(s).some((n) => norm(n).indexOf(k) !== -1)) out.push({ label: s.name, sub: kind === "obelisk" ? "Obelisk" : (LAYERS[s.layer] || [""])[0], sel: { kind, id: s.id }, lat: s.lat, lon: s.lon }); });
      if (tab === "rome") nolli.forEach((n) => { if (out.length < 60 && (norm(n.title).indexOf(k) !== -1 || norm(n.nolliName).indexOf(k) !== -1 || norm(n.unravelled).indexOf(k) !== -1 || String(n.n) === k)) out.push({ label: n.title, sub: "Nolli " + n.n + " · " + n.nolliName, sel: { kind: "nolli", id: n.n }, lat: n.lat, lon: n.lon }); });
      return out.slice(0, 60);
    }, [q, tab, ready, doc.sites]);

    const pick = (r) => { setSel(r.sel); setFocus({ lat: r.lat, lon: r.lon, zoom: tab === "rome" ? 17 : 11, t: Date.now() }); setQ(""); };
    const addSite = (s) => { const site = { id: uid(), map: tab, name: s.name || "New site", lat: s.lat, lon: s.lon, nolli: s.nolli || null, layer: s.layer || "", notes: "", tags: s.tags || [], cabinet: [] }; commit({ ...doc, sites: [...doc.sites, site] }); setSel({ kind: "mine", id: site.id }); };
    const onAddAt = (ll) => { setAdding(false); addSite({ lat: ll.lat, lon: ll.lng }); };
    const backup = async () => { setMenu(false); try { await B.backup.backupAll(); } catch (e) { setErr("Backup failed: " + e.message); } };

    // selected detail
    let detail = null;
    if (sel) {
      if (sel.kind === "nolli") { const n = nolli.find((x) => x.n === sel.id); if (n) detail = html`<${NolliCard} n=${n} onAdd=${() => addSite({ name: n.title, lat: n.lat, lon: n.lon, nolli: n.n })} />`; }
      if (sel.kind === "monument" || sel.kind === "obelisk" || sel.kind === "albsite") {
        const list = sel.kind === "monument" ? G.rome : sel.kind === "obelisk" ? G.obelisks : G.albania;
        const s = list.find((x) => x.id === sel.id);
        if (s) detail = html`<${SiteCard} s=${s} kind=${sel.kind} onAdd=${() => addSite({ name: s.name, lat: s.lat, lon: s.lon, nolli: s.nolli, layer: s.layer, tags: [s.name] })} />`;
      }
      if (sel.kind === "place") {
        const d = B.libraryData(); const p = (B.library.places || []).concat(d.customPlaces || []).find((x) => x.id === sel.id);
        const books = (d.books || []).filter((b) => b.place === sel.id);
        if (p) detail = html`<div><div className="at-kicker">Library place</div><div className="at-title">${p.name}</div>
          ${books.length ? html`<div style=${S("margin-top:var(--space-2);")}>${books.map((b) => html`<div key=${b.id} style=${S("font-size:14px;padding:3px 0;border-bottom:1px dotted var(--color-divider);")}><i>${b.title}</i> — ${b.author}</div>`)}</div>` : html`<p className="at-sub">No books placed here yet.</p>`}
          <button className="btn btn-secondary" style=${S("margin-top:var(--space-3);")} onClick=${() => addSite({ name: p.name, lat: p.lat, lon: p.lon })}>+ Add to my sites</button></div>`;
      }
      if (sel.kind === "mine") {
        const s = doc.sites.find((x) => x.id === sel.id);
        if (s) detail = html`<${MySiteCard} key=${s.id} s=${s} layers=${tab === "rome" ? ROME_LAYERS : ALB_LAYERS}
          onChange=${(n) => commit({ ...doc, sites: doc.sites.map((x) => x.id === n.id ? n : x) })}
          onDelete=${(n) => { commit({ ...doc, sites: doc.sites.filter((x) => x.id !== n.id) }); setSel(null); }} />`;
      }
    }

    const selCoords = (() => {
      if (!sel) return null;
      const find = (list, id) => list.find((x) => x.id === id);
      const o = sel.kind === "nolli" ? nolli.find((x) => x.n === sel.id) : sel.kind === "monument" ? find(G.rome, sel.id) : sel.kind === "obelisk" ? find(G.obelisks, sel.id)
        : sel.kind === "albsite" ? find(G.albania, sel.id) : sel.kind === "mine" ? find(doc.sites, sel.id) : sel.kind === "place" ? find((B.library.places || []).concat(B.libraryData().customPlaces || []), sel.id) : null;
      return o ? { lat: o.lat, lon: o.lon } : null;
    })();
    const lastFocus = useRef(null);
    useEffect(() => { if (selCoords && readSel() && lastFocus.current !== location.hash) { lastFocus.current = location.hash; setFocus({ ...selCoords, zoom: tab === "rome" ? 17 : 11, t: Date.now() }); } }, [selCoords && selCoords.lat, ready]);
    const chk = (label, key, dot) => html`<label className="at-row"><input type="checkbox" checked=${!!prefs[key]} onChange=${(e) => setPref({ [key]: e.target.checked })} />${dot ? html`<span className="at-dot" style=${S("background:" + dot)}></span>` : null}${label}</label>`;
    const tabBtn = (id, label) => html`<button className="btn btn-ghost" onClick=${() => { location.hash = id === "rome" ? "#atlas" : "#atlas/" + id; }} style=${S("border-radius:0;border-bottom:2px solid " + (tab === id ? "var(--color-accent);color:var(--color-accent-700);" : "transparent;"))}>${label}</button>`;
    const layerKeys = tab === "rome" ? ROME_LAYERS : ALB_LAYERS;

    return html`
      <div className="cab-page" data-theme=${theme} style=${S("padding-bottom:0;")}>
        <div className="nav" style=${S("position:sticky;top:0;z-index:1000;display:block;background-color:var(--color-bg);")}>
          <div style=${S("display:flex;flex-direction:column;gap:var(--space-3);width:100%;")}>
            <div style=${S("display:flex;align-items:baseline;justify-content:space-between;gap:var(--space-3);width:100%;")}>
              <${Brand} title="Atlas" modules=${modules} active=${active} go=${go} />
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
              ${tabBtn("rome", "Rome")}${tabBtn("albania", "Albanian lands")}
              <button className=${"btn " + (adding ? "btn-primary" : "btn-secondary")} style=${S("margin-left:auto;")} onClick=${() => setAdding(!adding)}>${adding ? "Click the map to place it…" : "+ Add a site"}</button>
            </div>
          </div>
        </div>
        <div className="at-body">
          <${MapView} key=${tab} mapId=${tab} prefs=${prefs} features=${features} onSelect=${(s) => setSel(s)} adding=${adding} onAddAt=${onAddAt} focus=${focus} highlight=${selCoords} />
          <div className="at-panel">
            <div>
              <input className="input" style=${S("width:100%;box-sizing:border-box;")} value=${q} onChange=${(e) => setQ(e.target.value)}
                placeholder=${tab === "rome" ? "Search a monument, church, palace, Nolli number…" : "Search a place…"} />
              ${results.length ? html`<div className="at-res">${results.map((r, i) => html`<div key=${i} onClick=${() => pick(r)}>${r.label}<br /><small>${r.sub}</small></div>`)}</div>` : null}
            </div>
            ${err ? html`<div style=${S("color:#a33;font-size:13px;")}>${err}</div>` : null}
            ${detail ? html`<div className="at-box" style=${S("position:relative;")}>
                <button className="btn btn-ghost" style=${S("position:absolute;top:4px;right:4px;font-size:18px;")} onClick=${() => setSel(null)} title="Close">×</button>${detail}</div>` : null}
            <div className="at-box">
              <h4>Layers</h4>
              ${tab === "rome" ? html`
                <label className="at-row"><input type="checkbox" checked=${prefs.showNolli} onChange=${(e) => setPref({ showNolli: e.target.checked })} />Nolli's plan, 1748</label>
                ${prefs.showNolli ? html`<div className="at-row"><span style=${S("font-size:12px;color:var(--color-neutral-700);width:70px;")}>Today</span><input className="at-slider" type="range" min="0" max="100" value=${prefs.nolli} onChange=${(e) => setPref({ nolli: +e.target.value })} /><span style=${S("font-size:12px;color:var(--color-neutral-700);width:40px;text-align:right;")}>1748</span></div>` : null}
                <div className="at-kicker" style=${S("margin:var(--space-3) 0 var(--space-1);")}>Nolli's index ${ready ? "· " + nolli.length : "· loading…"}</div>
                ${NGROUPS.map(([k, label, color]) => html`<label key=${k} className="at-row"><input type="checkbox" checked=${!!prefs.ngroups[k]} onChange=${(e) => setPref({ ngroups: { ...prefs.ngroups, [k]: e.target.checked } })} /><span className="at-dot" style=${S("background:" + color)}></span>${label}</label>`)}
                <div className="at-kicker" style=${S("margin:var(--space-3) 0 var(--space-1);")}>Overlays</div>
                ${chk("Monuments · " + G.rome.length, "monuments")}
                ${chk("Obelisks · " + G.obelisks.length, "obelisks")}`
              : html`
                <div className="at-row"><span style=${S("font-size:14px;")}>Base</span>
                  <select className="input" style=${S("margin-left:auto;")} value=${prefs.base} onChange=${(e) => setPref({ base: e.target.value })}><option value="relief">Relief</option><option value="light">Plain</option></select></div>
                ${chk("Historical sites · " + G.albania.length, "sites")}
                ${chk("Places from your Library", "places", "#3b2f22")}`}
              ${chk("Your Cabinet (count of pieces)", "cabinet")}
              ${chk("My sites · " + mine.length, "mine")}
              ${tab === "rome" ? html`<div className="at-row" style=${S("margin-top:var(--space-2);")}><span className="at-dot" style=${S("background:#fff;border:2px solid #9b3d26;")}></span><span style=${S("font-size:12px;color:var(--color-neutral-700);")}>Rings: monuments, coloured by layer below</span></div>` : null}
              <div style=${S("display:flex;flex-wrap:wrap;gap:4px 12px;margin-top:var(--space-2);")}>${layerKeys.map((k) => html`<span key=${k} style=${S("font-size:12px;display:inline-flex;align-items:center;gap:5px;")}><span className="at-dot" style=${S("background:" + LAYERS[k][1])}></span>${LAYERS[k][0]}</span>`)}</div>
            </div>
            ${mine.length ? html`<div className="at-box"><h4>My sites</h4>${mine.slice().sort((a, b) => a.name.localeCompare(b.name)).map((s) => html`<div key=${s.id} className=${H("hover", "color: var(--color-accent-700);")} style=${S("font-size:14px;padding:3px 0;cursor:pointer;")} onClick=${() => pick({ sel: { kind: "mine", id: s.id }, lat: s.lat, lon: s.lon })}>◆ ${s.name}</div>`)}</div>` : null}
            <div style=${S("font-size:11.5px;color:var(--color-neutral-700);line-height:1.5;")}>
              ${tab === "rome" ? "Nolli's plan and index: Interactive Nolli Map Website, Stanford University; tiles CC BY-NC-SA 4.0. Map tiles need an internet connection." : "Relief: OpenTopoMap. Map tiles need an internet connection."}
            </div>
          </div>
        </div>
      </div>`;
  }

  B.atlas.Component = Atlas;
  B.registerModule({ id: "atlas", name: "Atlas", blurb: "Rome on Nolli's plan, and the Albanian lands", order: 25, Component: Atlas });
})();
