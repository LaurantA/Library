# Bibliotheca

Laurant's personal library, and over time the other tools around it.
It is a static site served by GitHub Pages, and it also works when `index.html` is opened directly from disk.

## Where the data lives

None of the data is in this repository. It lives in the browser and in the backups you keep yourself.

| What | Where in the browser |
|---|---|
| Library catalogue (books, Alexandria, quotes, wishlist…) | `localStorage` → `library-catalogue-v1` |
| Journal, Cabinet, Studia, Atlas, Biblia | IndexedDB `bibliotheca` → `docs` |
| Images | IndexedDB `bibliotheca` → `media` |

**Backup to Files** writes everything to one file:
- a `.json` file when there are no images;
- a `.zip` file (containing `bibliotheca.json` plus a `media/` folder) once there are images.

**Restore from backup** accepts:
- old v1 `.json` files: these replace only the catalogue;
- new `.json` and `.zip` files: these replace everything.

Do not commit backups to this public repository. `.gitignore` blocks them as a safeguard.

## Layout

```
index.html              loads everything in order
css/classical.css       design system (tokens, components, fonts)
css/library.css         parchment palette and dark theme
css/cabinet.css         Cabinet layout (also the shared image viewer)
css/studia.css          Studia layout
css/atlas.css           Atlas layout
css/journal.css         Journal layout
css/biblia.css          Biblia layout
fonts/                  Cormorant Garamond and Lora
vendor/                 React 18.3.1, htm, fflate, Leaflet 1.9.4 (local copies)
assets/europe-map.*     map outline
assets/nolli-points.js  Nolli's 1748 index, 1,334 sites (loaded when the Atlas opens)
assets/gazetteer.js     monuments of Rome, obelisks, sites of the Albanian lands (with sources)
js/core/ui.js           html`` templates, style helpers
js/core/storage.js      IndexedDB, module documents, images
js/core/backup.js       backup format v2 (json/zip), restore
js/core/shell.js        module registry and navigation (#library, #journal, #cabinet, #atlas, #studia, #biblia)
js/core/chrome.js       shared header: module switcher, theme toggle, image hook
js/library/library.js       Library logic
js/library/library-view.js  Library markup
js/journal/journal.js       Journal: readings, dated entries, quotes (saved to the Library's Quotes)
js/cabinet/cabinet.js       Cabinet: pieces, ensembles, images
js/studia/curriculum.js     the agreed curriculum: stages, works, warrants (edit here)
js/studia/studia.js         Studia: progress, shelf links, exercises (Latin corner), method
js/atlas/atlas.js           Atlas: Rome on Nolli's plan, the Albanian lands, your sites
js/biblia/canon.js          the 73 books in Nova Vulgata order and chapters
js/biblia/biblia.js         Biblia: progress per book and language, editions, layout tests (no texts)
```

## Updating

Upload the changed files to the same paths in the repository. Keep the folder structure as it is.

## Credits

- Nolli's plan (tiles) and index: *La Pianta Grande di Roma* (1748), University of Oregon / Stanford CESTA, Interactive Nolli Map Website. Licence CC BY-NC-SA 4.0, for non-commercial use with attribution.
- Base maps: © OpenStreetMap contributors, © CARTO, © OpenTopoMap (CC-BY-SA). Map tiles need an internet connection.
