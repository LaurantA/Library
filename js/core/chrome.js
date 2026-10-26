// Shared header pieces used by every module: the brand / module switcher and the theme toggle.
window.B = window.B || {};
(function () {
  const { React, html, S, H } = B.ui;
  const { useState, useEffect } = React;

  // "Library — Laurant Ajvazi"; with more than one module it becomes a menu to switch modules.
  function Brand({ title, modules, active, go }) {
    const [open, setOpen] = useState(false);
    const label = title + " — Laurant Ajvazi";
    if (!modules || modules.length < 2) return html`<div className="nav-brand" style=${S("font-size:22px;")}>${label}</div>`;
    return html`
      <div style=${S("position:relative;")}>
        <button className="nav-brand" onClick=${() => setOpen(!open)} onBlur=${() => setTimeout(() => setOpen(false), 180)} title="Switch module"
          style=${S("font-size:22px;background:none;border:0;padding:0;cursor:pointer;color:inherit;display:flex;align-items:baseline;gap:8px;text-align:left;line-height:inherit;letter-spacing:inherit;")}>
          ${label}<span style=${S("font-size:12px;color:var(--color-accent);")}>▾</span>
        </button>
        ${open ? html`
          <div style=${S("position:absolute;top:100%;left:0;z-index:60;min-width:260px;margin-top:6px;background:var(--color-bg);border:1px solid var(--color-divider);border-radius:var(--radius-sm);box-shadow:var(--shadow-md);padding:var(--space-2) 0;")}>
            ${modules.map((m) => html`
              <div key=${m.id} className=${H("hover", "background: var(--color-accent-100);")} onMouseDown=${(e) => { e.preventDefault(); setOpen(false); go(m.id); }}
                style=${S("padding:var(--space-2) var(--space-3);cursor:pointer;" + (m.id === active ? "color:var(--color-accent-700);" : ""))}>
                <div style=${S("font-family:var(--font-heading);font-weight:var(--font-heading-weight);font-size:18px;")}>${m.name}</div>
                ${m.blurb ? html`<div style=${S("font-size:12px;color:var(--color-neutral-700);")}>${m.blurb}</div>` : null}
              </div>`)}
          </div>` : null}
      </div>`;
  }

  // The theme is shared by all modules (same key the Library always used).
  const THEME_KEY = "library-theme";
  const readTheme = () => { try { return localStorage.getItem(THEME_KEY) || "light"; } catch (e) { return "light"; } };
  function useTheme() {
    const [theme, setTheme] = useState(readTheme);
    const toggle = () => { const next = theme === "dark" ? "light" : "dark"; try { localStorage.setItem(THEME_KEY, next); } catch (e) {} setTheme(next); };
    return [theme, toggle];
  }
  function ThemeToggle({ theme, onToggle }) {
    const dark = theme === "dark";
    return html`
      <button onClick=${onToggle} title=${dark ? "Light mode" : "Dark mode"} style=${S("width:52px;height:28px;border-radius:999px;border:1px solid var(--color-divider);background:var(--color-surface);position:relative;cursor:pointer;padding:0;flex-shrink:0;")}>
        <span style=${S("position:absolute;top:2px;left:" + (dark ? "26px" : "2px") + ";width:22px;height:22px;border-radius:50%;background:" + (dark ? "#e3d9c6" : "#262524") + ";transition:left 0.2s ease;")}></span>
      </button>`;
  }

  // Loads an image from the media store and returns an object URL ("" while loading).
  function useMediaUrl(id, size) {
    const [url, setUrl] = useState("");
    useEffect(() => {
      let alive = true; setUrl("");
      if (id) B.media.url(id, size).then((u) => { if (alive) setUrl(u); });
      return () => { alive = false; };
    }, [id, size]);
    return url;
  }

  // Plain text with blank lines → paragraphs, single line breaks kept.
  function Prose({ text, style }) {
    if (!text || !text.trim()) return null;
    // "## Heading" on its own paragraph becomes a small heading.
    return html`<div style=${style}>${text.trim().split(/\n\s*\n/).map((p, i) => /^##\s/.test(p)
      ? html`<h3 key=${i} style=${S("font-size:22px;margin:var(--space-6) 0 var(--space-2) 0;")}>${p.replace(/^##\s*/, "")}</h3>`
      : html`<p key=${i} style=${S("margin:0 0 var(--space-3) 0;line-height:1.65;")}>${p.split("\n").map((l, j) => j ? [html`<br key=${"b" + j} />`, l] : l)}</p>`)}</div>`;
  }

  function Thumb({ id, size = "thumb", alt }) {
    const url = useMediaUrl(id, size);
    return url ? html`<img src=${url} alt=${alt || ""} loading="lazy" />` : null;
  }

  function Lightbox({ ids, index, caption, onClose }) {
    const [i, setI] = useState(index);
    const [zoom, setZoom] = useState(false);
    const url = useMediaUrl(ids[i], "full");
    useEffect(() => {
      const key = (e) => {
        if (e.key === "Escape") onClose();
        if (e.key === "ArrowRight" && ids.length > 1) { setZoom(false); setI((x) => (x + 1) % ids.length); }
        if (e.key === "ArrowLeft" && ids.length > 1) { setZoom(false); setI((x) => (x - 1 + ids.length) % ids.length); }
      };
      window.addEventListener("keydown", key); return () => window.removeEventListener("keydown", key);
    }, [ids.length]);
    return html`
      <div className="cab-lightbox">
        <div className=${"frame" + (zoom ? " zoomed" : "")} onClick=${() => setZoom(!zoom)}>${url ? html`<img src=${url} />` : null}</div>
        <button className="ctl" style=${S("top:4px;right:8px;")} onClick=${onClose} title="Close (Esc)">×</button>
        ${ids.length > 1 ? html`
          <button className="ctl" style=${S("left:4px;top:50%;transform:translateY(-50%);")} onClick=${() => { setZoom(false); setI((i - 1 + ids.length) % ids.length); }}>‹</button>
          <button className="ctl" style=${S("right:4px;top:50%;transform:translateY(-50%);")} onClick=${() => { setZoom(false); setI((i + 1) % ids.length); }}>›</button>` : null}
        <div className="cap">${caption}${ids.length > 1 ? " — " + (i + 1) + " / " + ids.length : ""} · click to ${zoom ? "fit" : "view at full size"}</div>
      </div>`;
  }

  Object.assign(B.ui, { Brand, ThemeToggle, useTheme, useMediaUrl, Prose, Thumb, Lightbox });

  // Catalogue data for other modules (read-only), straight from the Library's storage.
  B.libraryData = function () {
    try { return JSON.parse(localStorage.getItem("library-catalogue-v1")) || { books: [] }; } catch (e) { return { books: [] }; }
  };

  // Backup of everything, callable from any module (same file the Library's menu writes).
  B.backup.backupAll = async function () {
    const d = B.libraryData();
    const catalogue = {
      format: "bibliotheca-export", version: 1, exportedAt: new Date().toISOString(),
      volumes: d.books || [], alexandria: d.alexandria || [], wishlist: d.wishlist || [], quotes: d.quotes || [], themes: d.themes || [],
      customThreads: d.customThreads || [], customCities: d.customCities || [], hiddenCities: d.hiddenCities || [], customPlaces: d.customPlaces || [], hiddenPlaces: d.hiddenPlaces || [], customLangs: d.customLangs || [],
      periods: d.periods || [], meta: d.meta || {}
    };
    const built = await B.backup.build(catalogue);
    const saved = await B.backup.save(built.blob, built.filename);
    if (saved) { try { localStorage.setItem("library-catalogue-last-backup", catalogue.exportedAt); } catch (e) {} }
    return saved;
  };
})();
