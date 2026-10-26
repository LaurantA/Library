// Shared UI helpers for every module.
//   html`...`  JSX-like templates (htm) bound to React — no build step needed.
//   S("css")   turns an inline CSS string into a React style object (cached).
//   H("hover", "css")  returns a class name that applies `css` on :hover (or any pseudo-class).
window.B = window.B || {};
(function () {
  const React = window.React;
  const html = window.htm.bind(React.createElement);

  const styleCache = new Map();
  function S(css) {
    if (css == null) return undefined;
    let o = styleCache.get(css);
    if (o) return o;
    o = {};
    for (const decl of css.split(";")) {
      const i = decl.indexOf(":");
      if (i < 0) continue;
      const prop = decl.slice(0, i).trim();
      o[prop.startsWith("--") ? prop : prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = decl.slice(i + 1).trim();
    }
    if (styleCache.size > 5000) styleCache.clear();
    styleCache.set(css, o);
    return o;
  }

  let sheet = null, n = 0;
  const pseudoCache = new Map();
  function H(pseudo, css) {
    const k = pseudo + "|" + css;
    let cls = pseudoCache.get(k);
    if (cls) return cls;
    if (!sheet) { const el = document.createElement("style"); el.id = "pseudo-styles"; document.head.appendChild(el); sheet = el.sheet; }
    cls = "ps" + (n++).toString(36);
    const body = css.split(";").map((d) => d.trim()).filter(Boolean)
      .map((d) => /!\s*important$/i.test(d) ? d : d + " !important").join(";");
    sheet.insertRule("." + cls + ":" + pseudo + "{" + body + "}", sheet.cssRules.length);
    pseudoCache.set(k, cls);
    return cls;
  }

  B.ui = { React, html, S, H, Fragment: React.Fragment };
})();
