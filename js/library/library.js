// Library module — catalogue logic (state, persistence, managers, map maths).
// Ported from the original Claude Design export; behaviour unchanged.
(function () {
  const STORAGE_KEY = "library-catalogue-v1";
  const LAST_BACKUP_KEY = "library-catalogue-last-backup";
  const CITY_LIST = [
    { id: "rome", name: "Rome", blurb: "Location — antiquity." },
    { id: "constantinople", name: "Constantinople", blurb: "Location — Byzantium and the medieval world." },
    { id: "paris", name: "Paris", blurb: "Location — early-modern Europe and the age of revolutions." },
    { id: "berlin", name: "Berlin", blurb: "Location — modern times (frame awaiting the WW1 / interwar / WW2 expansion)." },
    { id: "empyrean", name: "Empyrean", blurb: "Location — a new shelf." },
    { id: "camelot", name: "Camelot", blurb: "Location — literature, the realm out of time." }
  ];
  const CITY_NAME = {};
  CITY_LIST.forEach(c => CITY_NAME[c.id] = c.name);
  const PLACE_LIST = [
    { id: "rome", name: "Rome", lat: 41.90, lon: 12.50 },
    { id: "athens", name: "Athens", lat: 37.98, lon: 23.73 },
    { id: "sparta", name: "Sparta", lat: 37.07, lon: 22.43 },
    { id: "delphi", name: "Delphi", lat: 38.48, lon: 22.50 },
    { id: "olympia", name: "Olympia", lat: 37.64, lon: 21.63 },
    { id: "corinth", name: "Corinth", lat: 37.94, lon: 22.93 },
    { id: "thebes-greece", name: "Thebes (Boeotia)", lat: 38.32, lon: 23.32 },
    { id: "knossos", name: "Knossos", lat: 35.30, lon: 25.16 },
    { id: "troy", name: "Troy", lat: 39.96, lon: 26.24 },
    { id: "ephesus", name: "Ephesus", lat: 37.94, lon: 27.34 },
    { id: "pergamon", name: "Pergamon", lat: 39.13, lon: 27.18 },
    { id: "miletus", name: "Miletus", lat: 37.53, lon: 27.28 },
    { id: "syracuse", name: "Syracuse", lat: 37.08, lon: 15.28 },
    { id: "carthage", name: "Carthage", lat: 36.85, lon: 10.32 },
    { id: "cyrene", name: "Cyrene", lat: 32.82, lon: 21.86 },
    { id: "alexandria-egypt", name: "Alexandria", lat: 31.20, lon: 29.92 },
    { id: "memphis", name: "Memphis", lat: 29.85, lon: 31.25 },
    { id: "luxor", name: "Thebes (Egypt)", lat: 25.70, lon: 32.64 },
    { id: "jerusalem", name: "Jerusalem", lat: 31.78, lon: 35.22 },
    { id: "petra", name: "Petra", lat: 30.33, lon: 35.44 },
    { id: "tyre", name: "Tyre", lat: 33.27, lon: 35.20 },
    { id: "damascus", name: "Damascus", lat: 33.51, lon: 36.29 },
    { id: "palmyra", name: "Palmyra", lat: 34.55, lon: 38.27 },
    { id: "antioch", name: "Antioch", lat: 36.20, lon: 36.16 },
    { id: "nineveh", name: "Nineveh", lat: 36.36, lon: 43.15 },
    { id: "babylon", name: "Babylon", lat: 32.54, lon: 44.42 },
    { id: "ctesiphon", name: "Ctesiphon", lat: 33.09, lon: 44.58 },
    { id: "baghdad", name: "Baghdad", lat: 33.32, lon: 44.36 },
    { id: "persepolis", name: "Persepolis", lat: 29.94, lon: 52.89 },
    { id: "pompeii", name: "Pompeii", lat: 40.75, lon: 14.49 },
    { id: "naples", name: "Naples", lat: 40.85, lon: 14.27 },
    { id: "ravenna", name: "Ravenna", lat: 44.42, lon: 12.20 },
    { id: "milan", name: "Milan", lat: 45.46, lon: 9.19 },
    { id: "trier", name: "Trier", lat: 49.76, lon: 6.64 },
    { id: "marseille", name: "Marseille", lat: 43.30, lon: 5.37 },
    { id: "cadiz", name: "Cádiz", lat: 36.53, lon: -6.29 },
    { id: "constantinople", name: "Constantinople", lat: 41.01, lon: 28.98 },
    { id: "nicaea", name: "Nicaea", lat: 40.43, lon: 29.72 },
    { id: "thessalonica", name: "Thessalonica", lat: 40.64, lon: 22.94 },
    { id: "mount-athos", name: "Mount Athos", lat: 40.16, lon: 24.33 },
    { id: "mistra", name: "Mistra", lat: 37.07, lon: 22.37 },
    { id: "trebizond", name: "Trebizond", lat: 41.00, lon: 39.72 },
    { id: "kyiv", name: "Kyiv", lat: 50.45, lon: 30.52 },
    { id: "novgorod", name: "Novgorod", lat: 58.52, lon: 31.27 },
    { id: "moscow", name: "Moscow", lat: 55.75, lon: 37.62 },
    { id: "aachen", name: "Aachen", lat: 50.78, lon: 6.08 },
    { id: "paris", name: "Paris", lat: 48.86, lon: 2.35 },
    { id: "reims", name: "Reims", lat: 49.26, lon: 4.03 },
    { id: "cluny", name: "Cluny", lat: 46.43, lon: 4.66 },
    { id: "avignon", name: "Avignon", lat: 43.95, lon: 4.81 },
    { id: "canterbury", name: "Canterbury", lat: 51.28, lon: 1.08 },
    { id: "oxford", name: "Oxford", lat: 51.75, lon: -1.26 },
    { id: "cambridge", name: "Cambridge", lat: 52.21, lon: 0.12 },
    { id: "bologna", name: "Bologna", lat: 44.49, lon: 11.34 },
    { id: "salerno", name: "Salerno", lat: 40.68, lon: 14.76 },
    { id: "santiago", name: "Santiago de Compostela", lat: 42.88, lon: -8.54 },
    { id: "toledo", name: "Toledo", lat: 39.86, lon: -4.03 },
    { id: "cordoba", name: "Córdoba", lat: 37.89, lon: -4.78 },
    { id: "granada", name: "Granada", lat: 37.18, lon: -3.60 },
    { id: "palermo", name: "Palermo", lat: 38.12, lon: 13.36 },
    { id: "venice", name: "Venice", lat: 45.44, lon: 12.32 },
    { id: "genoa", name: "Genoa", lat: 44.41, lon: 8.93 },
    { id: "pisa", name: "Pisa", lat: 43.72, lon: 10.40 },
    { id: "florence", name: "Florence", lat: 43.77, lon: 11.26 },
    { id: "siena", name: "Siena", lat: 43.32, lon: 11.33 },
    { id: "urbino", name: "Urbino", lat: 43.73, lon: 12.64 },
    { id: "mantua", name: "Mantua", lat: 45.16, lon: 10.79 },
    { id: "ferrara", name: "Ferrara", lat: 44.84, lon: 11.62 },
    { id: "turin", name: "Turin", lat: 45.07, lon: 7.69 },
    { id: "trieste", name: "Trieste", lat: 45.65, lon: 13.78 },
    { id: "cologne", name: "Cologne", lat: 50.94, lon: 6.96 },
    { id: "luebeck", name: "Lübeck", lat: 53.87, lon: 10.69 },
    { id: "bruges", name: "Bruges", lat: 51.21, lon: 3.22 },
    { id: "ghent", name: "Ghent", lat: 51.05, lon: 3.72 },
    { id: "antwerp", name: "Antwerp", lat: 51.22, lon: 4.40 },
    { id: "brussels", name: "Brussels", lat: 50.85, lon: 4.35 },
    { id: "the-hague", name: "The Hague", lat: 52.08, lon: 4.31 },
    { id: "amsterdam", name: "Amsterdam", lat: 52.37, lon: 4.90 },
    { id: "leiden", name: "Leiden", lat: 52.16, lon: 4.49 },
    { id: "prague", name: "Prague", lat: 50.08, lon: 14.44 },
    { id: "krakow", name: "Kraków", lat: 50.06, lon: 19.94 },
    { id: "vienna", name: "Vienna", lat: 48.21, lon: 16.37 },
    { id: "budapest", name: "Buda", lat: 47.50, lon: 19.04 },
    { id: "wittenberg", name: "Wittenberg", lat: 51.87, lon: 12.65 },
    { id: "geneva", name: "Geneva", lat: 46.20, lon: 6.14 },
    { id: "zurich", name: "Zurich", lat: 47.37, lon: 8.54 },
    { id: "basel", name: "Basel", lat: 47.56, lon: 7.59 },
    { id: "augsburg", name: "Augsburg", lat: 48.37, lon: 10.90 },
    { id: "nuremberg", name: "Nuremberg", lat: 49.45, lon: 11.08 },
    { id: "madrid", name: "Madrid", lat: 40.42, lon: -3.70 },
    { id: "lisbon", name: "Lisbon", lat: 38.72, lon: -9.14 },
    { id: "seville", name: "Seville", lat: 37.39, lon: -5.98 },
    { id: "london", name: "London", lat: 51.51, lon: -0.13 },
    { id: "edinburgh", name: "Edinburgh", lat: 55.95, lon: -3.19 },
    { id: "dublin", name: "Dublin", lat: 53.35, lon: -6.26 },
    { id: "berlin", name: "Berlin", lat: 52.52, lon: 13.40 },
    { id: "weimar", name: "Weimar", lat: 50.98, lon: 11.33 },
    { id: "munich", name: "Munich", lat: 48.14, lon: 11.58 },
    { id: "frankfurt", name: "Frankfurt", lat: 50.11, lon: 8.68 },
    { id: "koenigsberg", name: "Königsberg", lat: 54.71, lon: 20.51 },
    { id: "warsaw", name: "Warsaw", lat: 52.23, lon: 21.01 },
    { id: "st-petersburg", name: "St Petersburg", lat: 59.93, lon: 30.34 },
    { id: "stockholm", name: "Stockholm", lat: 59.33, lon: 18.07 },
    { id: "copenhagen", name: "Copenhagen", lat: 55.68, lon: 12.57 },
    { id: "oslo", name: "Oslo", lat: 59.91, lon: 10.75 },
    { id: "helsinki", name: "Helsinki", lat: 60.17, lon: 24.94 },
    { id: "riga", name: "Riga", lat: 56.95, lon: 24.11 },
    { id: "vilnius", name: "Vilnius", lat: 54.69, lon: 25.28 },
    { id: "tallinn", name: "Tallinn", lat: 59.44, lon: 24.75 },
    { id: "minsk", name: "Minsk", lat: 53.90, lon: 27.57 },
    { id: "lviv", name: "Lviv", lat: 49.84, lon: 24.03 },
    { id: "odesa", name: "Odesa", lat: 46.48, lon: 30.73 },
    { id: "belgrade", name: "Belgrade", lat: 44.79, lon: 20.45 },
    { id: "zagreb", name: "Zagreb", lat: 45.81, lon: 15.98 },
    { id: "ljubljana", name: "Ljubljana", lat: 46.06, lon: 14.51 },
    { id: "sarajevo", name: "Sarajevo", lat: 43.86, lon: 18.41 },
    { id: "sofia", name: "Sofia", lat: 42.70, lon: 23.32 },
    { id: "bucharest", name: "Bucharest", lat: 44.43, lon: 26.10 },
    { id: "tirana", name: "Tirana", lat: 41.33, lon: 19.82 },
    { id: "shkoder", name: "Shkodër", lat: 42.07, lon: 19.51 },
    { id: "prizren", name: "Prizren", lat: 42.21, lon: 20.74 },
    { id: "pristina", name: "Pristina", lat: 42.66, lon: 21.17 },
    { id: "ferizaj", name: "Ferizaj", lat: 42.37, lon: 21.15 },
    { id: "skopje", name: "Skopje", lat: 41.99, lon: 21.43 },
    { id: "ankara", name: "Ankara", lat: 39.93, lon: 32.86 },
    { id: "gallipoli", name: "Gallipoli", lat: 40.41, lon: 26.67 },
    { id: "versailles", name: "Versailles", lat: 48.80, lon: 2.13 },
    { id: "waterloo", name: "Waterloo", lat: 50.68, lon: 4.40 },
    { id: "verdun", name: "Verdun", lat: 49.16, lon: 5.38 },
    { id: "oswiecim", name: "Oświęcim", lat: 50.03, lon: 19.21 },
    { id: "volgograd", name: "Stalingrad", lat: 48.71, lon: 44.51 },
    { id: "yalta", name: "Yalta", lat: 44.50, lon: 34.17 }
  ];
  const MAP_VIEWBOX = { w: 500, h: 492, x0: 194.93, y0: 230.0 };
  const DEG = Math.PI / 180;
  const projectPlace = (lat, lon) => {
    const p1 = 52 * DEG, l0 = 10 * DEG, p = lat * DEG, dl = lon * DEG - l0;
    const cosC = Math.sin(p1) * Math.sin(p) + Math.cos(p1) * Math.cos(p) * Math.cos(dl);
    const k = Math.sqrt(2 / (1 + cosC));
    const R = 6371;
    const x = R * k * Math.cos(p) * Math.sin(dl);
    const y = R * k * (Math.cos(p1) * Math.sin(p) - Math.sin(p1) * Math.cos(p) * Math.cos(dl));
    return { x: MAP_VIEWBOX.x0 + x / 10, y: MAP_VIEWBOX.y0 - y / 10 };
  };
  // Ethnic Albania / western Balkans: Montenegro coast down to Epirus, Adriatic to Skopje.
  const BALKAN_REGION = { lat0: 38.6, lat1: 43.2, lon0: 18.0, lon1: 23.2 };
  let _balkanView = null;
  const balkanView = () => {
    if (_balkanView) return _balkanView;
    const r = BALKAN_REGION;
    let xs = [], ys = [];
    for (let la = r.lat0; la <= r.lat1 + 0.001; la += 0.4) {
      for (let lo = r.lon0; lo <= r.lon1 + 0.001; lo += 0.4) {
        const p = projectPlace(la, lo); xs.push(p.x); ys.push(p.y);
      }
    }
    let x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const aspect = MAP_VIEWBOX.w / MAP_VIEWBOX.h;
    let w = x1 - x0, h = y1 - y0;
    if (w / h > aspect) h = w / aspect; else w = h * aspect;
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    _balkanView = { x: cx - w / 2, y: cy - h / 2, w, h };
    return _balkanView;
  };
  const PERIODS = [
    "Hellenistic & Greek World", "Roman Republic", "Roman Empire", "Late Antiquity & Patristics",
    "Byzantium", "Medieval West", "Crusades & Holy War", "Fall of Byzantium & the Ottoman Advance",
    "Renaissance & Italian States", "Reformation & Confessional Europe", "Absolutism & the Old Regime",
    "Revolutionary & Napoleonic", "The Long 19th Century", "The World Wars & Totalitarianism", "Post-War"
  ];
  const THREADS = ["Albanian & Balkan", "Catholic & Church History", "Political & Moral Philosophy",
    "Statecraft & Biography of Power", "Ottoman Threat", "Christian Heroism", "War", "Trade"];
  const MODES = ["Primary Source", "Rare & Fine", "World Literature"];
  const BASE_LANGS = ["EN", "DE", "FR", "SQ", "EN/GR", "EN/LA", "DE/LA"];
  const BINDINGS = [
    { value: "", label: "—" }, { value: "personal", label: "Personal" },
    { value: "paperback", label: "Paperback" }, { value: "hardcover", label: "Hardcover" }
  ];
  const BINDING_LABEL = {}; BINDINGS.forEach(x => BINDING_LABEL[x.value] = x.label);
  const REMAP_BINDING = { own: "personal", "rebound-a": "hardcover", "rebound-b": "hardcover", "rebound-c": "hardcover" };
  const EMPTY_DRAFT = () => ({ city: "rome", author: "", title: "", series: "", translator: "", lang: "", period: "", threads: [], mode: [], note: "", binding: "", bookCount: "", place: "" });
  const mergeThreads = (list) => {
    const seen = new Set(); const out = [];
    THREADS.concat(list || []).forEach(t => { const k = t.toLowerCase(); if (!seen.has(k)) { seen.add(k); out.push(t); } });
    return out;
  };

  class Library extends React.Component {
    state = {
      theme: (typeof localStorage !== "undefined" && localStorage.getItem("library-theme")) || "light",
      loaded: false, books: [], alexandria: [], wishlist: [], meta: { version: "1.0", date: "29 June 2026" },
      customThreads: [], editThreadInput: "", addThreadInput: "",
      customLangs: [], editLangInput: "", addLangInput: "",
      periods: [], showPeriodManager: false, periodDrafts: {}, newPeriodText: "",
      showThreadManager: false, threadDrafts: {}, newThreadText: "",
      showShelfManager: false, shelfDrafts: {}, newShelfText: "",
      shelfMoveTo: null, shelfMoveChecked: {}, shelfMoveQuery: "", shelfMoveFrom: "",
      threadAssignFor: null, threadAssignChecked: {}, threadAssignQuery: "",
      showThemeManager: false, themeDrafts: {},
      addAuthorOpen: false, editAuthorOpen: false,
      quotes: [], showQuoteForm: false, quoteDraft: null, quoteBookQuery: "", quoteBookOpen: false, quoteThemeInput: "", quoteError: "",
      themes: [], quoteThemeFilter: "", themeFilterOpen: false,
      cityFilterOpen: false, periodFilterOpen: false, threadFilterOpen: false,
      customCities: [], hiddenCities: [], showAddShelfForm: false, addShelfName: "", addShelfBlurb: "", newWishlistText: "",
      customPlaces: [], hiddenPlaces: [], placeDrafts: {}, placeFilter: "", placeFilterOpen: false,
      showPlaceManager: false, newPlaceName: "", newPlaceLat: "", newPlaceLon: "", placeError: "",
      placeAssignTo: null, placeAssignChecked: {}, placeAssignQuery: "", placeAssignFrom: "", mapSvg: "",
      showRemoveShelfForm: false, removeShelfId: "",
      view: "shelves", search: "", periodFilter: "", threadFilter: "", cityFilter: "", statusFilter: "",
      menuOpen: false, addMenuOpen: false, showOverview: false, alexandriaOpen: false,
      selectedId: null, editMode: false, editDraft: null, showAddForm: false, addDraft: null,
      backupToast: "", showRestoreConfirm: false, restoreData: null, lastBackupAt: null
    };

    componentDidMount() {
      const remap = (books) => books.map(b => REMAP_BINDING[b.binding] ? { ...b, binding: REMAP_BINDING[b.binding] } : b);
      const migrateWishlist = (list) => {
        if (list && list.length === 2 && list.some(i => i.id === "wish-1") && list.some(i => i.id === "wish-2")) {
          return [
            { id: "wish-1a", text: "H. P. Lovecraft — At the Mountains of Madness (English original)", done: false },
            { id: "wish-1b", text: "H. P. Lovecraft — The Call of Cthulhu (English original)", done: false },
            { id: "wish-1c", text: "H. P. Lovecraft — The Shadow over Innsmouth (English original)", done: false },
            { id: "wish-2a", text: "Further work by Tefik Ajvazi-Mjaku (grandfather), to be brought to the apartment (1 of 3)", done: false },
            { id: "wish-2b", text: "Further work by Tefik Ajvazi-Mjaku (grandfather), to be brought to the apartment (2 of 3)", done: false },
            { id: "wish-2c", text: "Further work by Tefik Ajvazi-Mjaku (grandfather), to be brought to the apartment (3 of 3)", done: false }
          ];
        }
        return (list || []).map(w => ({ done: false, ...w }));
      };
      const dedupeIds = (books) => {
        const seen = {}; let changed = false;
        const result = books.map(b => {
          if (seen[b.id]) {
            changed = true;
            return { ...b, id: "book-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7) };
          }
          seen[b.id] = true; return b;
        });
        return changed ? result : books;
      };
      try { const lb = localStorage.getItem(LAST_BACKUP_KEY); if (lb) this.setState({ lastBackupAt: lb }); } catch (e) {}
      this.setState({ mapSvg: B.assets.europeCountries || "" });
      let stored = null;
      try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) stored = JSON.parse(raw); } catch (e) {}
      if (stored && stored.books) {
        const migratedQuotes = (stored.quotes || []).map(q => ({ ...q, themes: q.themes || q.threads || [] }));   // keeps extra fields (e.g. the Journal entry a quote was written in)
        const themes = stored.themes && stored.themes.length ? stored.themes : Array.from(new Set(migratedQuotes.flatMap(q => q.themes)));
        this.setState({ books: dedupeIds(remap(stored.books)), alexandria: stored.alexandria || [], wishlist: migrateWishlist(stored.wishlist), meta: stored.meta || this.state.meta, customThreads: mergeThreads(stored.customThreads), customCities: stored.customCities || [], hiddenCities: stored.hiddenCities || [], customPlaces: stored.customPlaces || [], hiddenPlaces: stored.hiddenPlaces || [], customLangs: stored.customLangs || [], periods: stored.periods || PERIODS.slice(), quotes: migratedQuotes, themes, loaded: true }, () => this.persist());
      } else {
        this.setState({ books: [], alexandria: [], wishlist: [], meta: { version: "0.0", date: "" }, periods: PERIODS.slice(), customThreads: mergeThreads([]), loaded: true }, () => this.persist());
      }
    }

    persist() {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ books: this.state.books, alexandria: this.state.alexandria, wishlist: this.state.wishlist, meta: this.state.meta, customThreads: this.state.customThreads, customCities: this.state.customCities, hiddenCities: this.state.hiddenCities, customPlaces: this.state.customPlaces, hiddenPlaces: this.state.hiddenPlaces, customLangs: this.state.customLangs, periods: this.state.periods, quotes: this.state.quotes, themes: this.state.themes })); } catch (e) {}
      B.bus.emit("library", this.state);
    }

    bookLabel(book) { return book ? book.title + " — " + book.author + (book.isAlexandria ? " (Alexandria)" : "") : ""; }
    resolveBookRef(id) {
      if (!id) return null;
      if (String(id).indexOf("alex:") === 0) {
        const num = String(id).slice(5);
        const a = this.state.alexandria.find(x => String(x.num) === num);
        return a ? { id, title: a.title, author: a.author, isAlexandria: true, cityName: "Alexandria" } : null;
      }
      const b = this.state.books.find(x => x.id === id);
      return b ? { ...b, isAlexandria: false } : null;
    }

    showToast(msg) {
      this.setState({ backupToast: msg });
      setTimeout(() => this.setState(s => s.backupToast === msg ? { backupToast: "" } : {}), 2500);
    }

    async exportBackup() {
      const s = this.state;
      const catalogue = {
        format: "bibliotheca-export", version: 1, exportedAt: new Date().toISOString(),
        volumes: s.books, alexandria: s.alexandria, wishlist: s.wishlist, quotes: s.quotes, themes: s.themes,
        customThreads: s.customThreads, customCities: s.customCities, hiddenCities: s.hiddenCities, customPlaces: s.customPlaces, hiddenPlaces: s.hiddenPlaces, customLangs: s.customLangs,
        periods: s.periods, meta: s.meta
      };
      let built;
      try { built = await B.backup.build(catalogue); }
      catch (err) { this.showToast("Backup failed: " + ((err && err.message) || err)); return; }
      const saved = await B.backup.save(built.blob, built.filename);
      if (!saved) return;
      try { localStorage.setItem(LAST_BACKUP_KEY, catalogue.exportedAt); } catch (e) {}
      this.setState({ lastBackupAt: catalogue.exportedAt });
      this.showToast("Backup saved");
    }

    triggerRestore() {
      const input = document.createElement("input");
      input.type = "file"; input.accept = ".json,.zip,application/json,application/zip";
      input.onchange = async () => {
        const file = input.files && input.files[0];
        if (!file) return;
        try {
          const parsed = await B.backup.read(file);
          this.setState({ showRestoreConfirm: true, restoreData: parsed.data, restoreParsed: parsed });
        } catch (err) {
          this.showToast((err && err.message) || "Couldn't read that file.");
        }
      };
      input.click();
    }

    cancelRestore() { this.setState({ showRestoreConfirm: false, restoreData: null, restoreParsed: null }); }

    async confirmRestore() {
      const data = this.state.restoreData, parsed = this.state.restoreParsed;
      if (!data) return;
      try { if (parsed) await B.backup.applyExtras(parsed); }
      catch (err) { this.showToast("Restoring modules/images failed: " + ((err && err.message) || err)); return; }
      this.setState({
        books: data.volumes, alexandria: data.alexandria || [], wishlist: data.wishlist || [],
        quotes: data.quotes || [], themes: data.themes || [], customThreads: mergeThreads(data.customThreads),
        customCities: data.customCities || [], hiddenCities: data.hiddenCities || [], customPlaces: data.customPlaces || [], hiddenPlaces: data.hiddenPlaces || [], customLangs: data.customLangs || [],
        periods: (data.periods && data.periods.length) ? data.periods : PERIODS.slice(), meta: data.meta || this.state.meta,
        showRestoreConfirm: false, restoreData: null, restoreParsed: null, view: "shelves", selectedId: null,
        lastBackupAt: data.exportedAt || this.state.lastBackupAt
      }, () => {
        try { if (data.exportedAt) localStorage.setItem(LAST_BACKUP_KEY, data.exportedAt); } catch (e) {}
        this.persist(); this.showToast("Catalogue restored");
      });
    }

    openQuoteForm(book) {
      this.setState({
        showQuoteForm: true, quoteError: "", quoteThemeInput: "", quoteBookOpen: false,
        quoteBookQuery: book ? this.bookLabel(book) : "",
        quoteDraft: { id: null, bookId: book ? book.id : "", quote: "", page: "", themes: [], note: "" }
      });
    }
    openEditQuote(q) {
      const book = this.resolveBookRef(q.bookId);
      this.setState({
        showQuoteForm: true, quoteError: "", quoteThemeInput: "", quoteBookOpen: false,
        quoteBookQuery: book ? this.bookLabel(book) : "",
        quoteDraft: { ...q, themes: [...q.themes] }
      });
    }
    cancelQuoteForm() { this.setState({ showQuoteForm: false, quoteDraft: null }); }
    updateQuoteField(key, val) { this.setState(s => ({ quoteDraft: { ...s.quoteDraft, [key]: val } })); }
    onQuoteBookQuery(val) { this.setState({ quoteBookQuery: val, quoteBookOpen: true, quoteDraft: { ...this.state.quoteDraft, bookId: "" } }); }
    selectQuoteBook(book) {
      this.setState(s => ({ quoteBookQuery: this.bookLabel(book), quoteBookOpen: false, quoteDraft: { ...s.quoteDraft, bookId: book.id } }));
    }
    toggleQuoteTheme(val) {
      this.setState(s => {
        const arr = s.quoteDraft.themes; const has = arr.indexOf(val) !== -1;
        return { quoteDraft: { ...s.quoteDraft, themes: has ? arr.filter(x => x !== val) : [...arr, val] } };
      });
    }
    addQuoteTheme() {
      const val = this.state.quoteThemeInput.trim();
      if (!val) return;
      const exists = this.state.themes.some(t => t.toLowerCase() === val.toLowerCase());
      const canonical = exists ? this.state.themes.find(t => t.toLowerCase() === val.toLowerCase()) : val;
      this.setState(s => ({
        themes: exists ? s.themes : [...s.themes, val],
        quoteDraft: { ...s.quoteDraft, themes: s.quoteDraft.themes.indexOf(canonical) === -1 ? [...s.quoteDraft.themes, canonical] : s.quoteDraft.themes },
        quoteThemeInput: ""
      }), () => this.persist());
    }
    saveQuote() {
      const d = this.state.quoteDraft;
      if (!d.bookId) { this.setState({ quoteError: "Pick a book from the suggestions first." }); return; }
      if (!d.quote.trim()) { this.setState({ quoteError: "The quote can't be empty." }); return; }
      if (d.id) {
        this.setState(s => ({ quotes: s.quotes.map(q => q.id === d.id ? { ...d } : q), showQuoteForm: false, quoteDraft: null }), () => this.persist());
      } else {
        const q = { ...d, id: "quote-" + Date.now() };
        this.setState(s => ({ quotes: [...s.quotes, q], showQuoteForm: false, quoteDraft: null }), () => this.persist());
      }
    }
    deleteQuote() {
      const id = this.state.quoteDraft && this.state.quoteDraft.id;
      if (!id) return;
      this.setState(s => ({ quotes: s.quotes.filter(q => q.id !== id), showQuoteForm: false, quoteDraft: null }), () => this.persist());
    }

    togglePeriodManager() { this.setState(s => ({ showPeriodManager: !s.showPeriodManager })); }
    setPeriodDraft(p, val) { this.setState(s => ({ periodDrafts: { ...s.periodDrafts, [p]: val } })); }
    renamePeriod(p) {
      const draft = (this.state.periodDrafts[p] ?? p).trim();
      if (!draft || draft === p) { this.setState(s => { const d = { ...s.periodDrafts }; delete d[p]; return { periodDrafts: d }; }); return; }
      this.setState(s => {
        const periods = s.periods.map(x => x === p ? draft : x);
        const books = s.books.map(b => b.period === p ? { ...b, period: draft } : b);
        const d = { ...s.periodDrafts }; delete d[p];
        return { periods, books, periodDrafts: d };
      }, () => this.persist());
    }
    removePeriod(p) {
      if (this.state.books.some(b => b.period === p)) return;
      this.setState(s => ({ periods: s.periods.filter(x => x !== p) }), () => this.persist());
    }
    addPeriod() {
      const val = this.state.newPeriodText.trim();
      if (!val || this.state.periods.some(p => p.toLowerCase() === val.toLowerCase())) { this.setState({ newPeriodText: "" }); return; }
      this.setState(s => ({ periods: [...s.periods, val], newPeriodText: "" }), () => this.persist());
    }

    toggleThreadManager() { this.setState(s => ({ showThreadManager: !s.showThreadManager })); }
    setThreadDraft(t, val) { this.setState(s => ({ threadDrafts: { ...s.threadDrafts, [t]: val } })); }
    renameThread(t) {
      const draft = (this.state.threadDrafts[t] ?? t).trim();
      if (!draft || draft === t) { this.setState(s => { const d = { ...s.threadDrafts }; delete d[t]; return { threadDrafts: d }; }); return; }
      this.setState(s => {
        const customThreads = s.customThreads.map(x => x === t ? draft : x);
        const books = s.books.map(b => b.threads.indexOf(t) !== -1 ? { ...b, threads: b.threads.map(x => x === t ? draft : x) } : b);
        const d = { ...s.threadDrafts }; delete d[t];
        return { customThreads, books, threadDrafts: d, threadFilter: s.threadFilter === t ? draft : s.threadFilter };
      }, () => this.persist());
    }
    removeThread(t) {
      if (this.state.books.some(b => b.threads.indexOf(t) !== -1)) return;
      this.setState(s => ({ customThreads: s.customThreads.filter(x => x !== t) }), () => this.persist());
    }
    addThread() {
      const val = this.state.newThreadText.trim();
      const all = this.state.customThreads;
      if (!val || all.some(t => t.toLowerCase() === val.toLowerCase())) { this.setState({ newThreadText: "" }); return; }
      this.setState(s => ({ customThreads: [...s.customThreads, val], newThreadText: "" }), () => this.persist());
    }
    openThreadAssign(t) {
      const checked = {};
      this.state.books.forEach(b => { checked[b.id] = b.threads.indexOf(t) !== -1; });
      this.setState({ threadAssignFor: t, threadAssignChecked: checked, threadAssignQuery: "" });
    }
    cancelThreadAssign() { this.setState({ threadAssignFor: null }); }
    toggleThreadAssignBook(id) { this.setState(s => ({ threadAssignChecked: { ...s.threadAssignChecked, [id]: !s.threadAssignChecked[id] } })); }
    saveThreadAssign() {
      const t = this.state.threadAssignFor, checked = this.state.threadAssignChecked;
      this.setState(s => ({
        books: s.books.map(b => {
          const should = !!checked[b.id], has = b.threads.indexOf(t) !== -1;
          if (should === has) return b;
          return { ...b, threads: should ? [...b.threads, t] : b.threads.filter(x => x !== t) };
        }),
        threadAssignFor: null
      }), () => this.persist());
    }

    toggleThemeManager() { this.setState(s => ({ showThemeManager: !s.showThemeManager })); }
    setThemeDraft(t, val) { this.setState(s => ({ themeDrafts: { ...s.themeDrafts, [t]: val } })); }
    renameTheme(t) {
      const draft = (this.state.themeDrafts[t] ?? t).trim();
      if (!draft || draft === t) { this.setState(s => { const d = { ...s.themeDrafts }; delete d[t]; return { themeDrafts: d }; }); return; }
      this.setState(s => {
        const themes = s.themes.map(x => x === t ? draft : x);
        const quotes = s.quotes.map(q => q.themes.indexOf(t) !== -1 ? { ...q, themes: q.themes.map(x => x === t ? draft : x) } : q);
        const d = { ...s.themeDrafts }; delete d[t];
        return { themes, quotes, themeDrafts: d, quoteThemeFilter: s.quoteThemeFilter === t ? draft : s.quoteThemeFilter };
      }, () => this.persist());
    }
    removeTheme(t) {
      if (this.state.quotes.some(q => q.themes.indexOf(t) !== -1)) return;
      this.setState(s => ({ themes: s.themes.filter(x => x !== t) }), () => this.persist());
    }

    selectAuthor(which, name) {
      const draftKey = which === "edit" ? "editDraft" : "addDraft";
      const openKey = which === "edit" ? "editAuthorOpen" : "addAuthorOpen";
      this.setState(s => ({ [draftKey]: { ...s[draftKey], author: name }, [openKey]: false }));
    }
    setAuthorOpen(which, open) {
      this.setState({ [which === "edit" ? "editAuthorOpen" : "addAuthorOpen"]: open });
    }

    addCustomLang(which) {
      const key = which === "edit" ? "editLangInput" : "addLangInput";
      const draftKey = which === "edit" ? "editDraft" : "addDraft";
      const val = (this.state[key] || "").trim();
      if (!val) return;
      const all = BASE_LANGS.concat(this.state.customLangs);
      const exists = all.some(l => l.toLowerCase() === val.toLowerCase());
      const canonical = exists ? all.find(l => l.toLowerCase() === val.toLowerCase()) : val;
      this.setState(s => ({
        customLangs: exists ? s.customLangs : [...s.customLangs, val],
        [draftKey]: { ...s[draftKey], lang: canonical },
        [key]: ""
      }), () => this.persist());
    }

    deleteBook(id) {
      this.setState(s => ({ books: s.books.filter(b => b.id !== id), selectedId: null, editMode: false, editDraft: null }), () => this.persist());
    }

    openRemoveShelfForm() { this.setState({ showRemoveShelfForm: true, removeShelfId: "" }); }
    cancelRemoveShelf() { this.setState({ showRemoveShelfForm: false }); }
    removeShelf() {
      const id = this.state.removeShelfId;
      if (!id) return;
      const count = this.state.books.filter(b => b.city === id).length;
      if (count > 0) return;
      this.setState(s => ({
        customCities: s.customCities.filter(c => c.id !== id),
        hiddenCities: CITY_LIST.some(c => c.id === id) ? [...s.hiddenCities, id] : s.hiddenCities,
        showRemoveShelfForm: false, removeShelfId: ""
      }), () => this.persist());
    }

    setShelfDraft(id, val) { this.setState(s => ({ shelfDrafts: { ...s.shelfDrafts, [id]: val } })); }
    renameShelf(id, current) {
      const draft = (this.state.shelfDrafts[id] ?? current).trim();
      if (!draft || draft === current) {
        this.setState(s => { const d = { ...s.shelfDrafts }; delete d[id]; return { shelfDrafts: d }; });
        return;
      }
      this.setState(s => {
        const d = { ...s.shelfDrafts }; delete d[id];
        const isCustom = s.customCities.some(c => c.id === id);
        if (isCustom) {
          return { customCities: s.customCities.map(c => c.id === id ? { ...c, name: draft } : c), shelfDrafts: d };
        }
        const base = CITY_LIST.find(c => c.id === id) || { id, blurb: "" };
        return {
          hiddenCities: s.hiddenCities.indexOf(id) === -1 ? [...s.hiddenCities, id] : s.hiddenCities,
          customCities: [...s.customCities, { id, name: draft, blurb: base.blurb }],
          shelfDrafts: d
        };
      }, () => this.persist());
    }
    addShelfQuick() {
      const name = this.state.newShelfText.trim();
      if (!name) return;
      let id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const all = CITY_LIST.concat(this.state.customCities);
      if (all.some(c => c.id === id)) id = id + "-2";
      this.setState(s => ({
        customCities: [...s.customCities, { id, name, blurb: "Location — a new shelf." }],
        newShelfText: ""
      }), () => this.persist());
    }
    openShelfMove(id) { this.setState({ shelfMoveTo: id, shelfMoveChecked: {}, shelfMoveQuery: "", shelfMoveFrom: "" }); }
    cancelShelfMove() { this.setState({ shelfMoveTo: null, shelfMoveChecked: {} }); }
    toggleShelfMoveBook(id) { this.setState(s => ({ shelfMoveChecked: { ...s.shelfMoveChecked, [id]: !s.shelfMoveChecked[id] } })); }
    saveShelfMove() {
      const target = this.state.shelfMoveTo, checked = this.state.shelfMoveChecked;
      if (!target) return;
      const ids = Object.keys(checked).filter(k => checked[k]);
      if (!ids.length) { this.setState({ shelfMoveTo: null, shelfMoveChecked: {} }); return; }
      this.setState(s => {
        let next = Math.max(0, ...s.books.filter(b => b.city === target).map(b => Number(b.num) || 0));
        const books = s.books.map(b => {
          if (ids.indexOf(b.id) === -1) return b;
          next += 1;
          return { ...b, city: target, num: next };
        });
        return { books, shelfMoveTo: null, shelfMoveChecked: {} };
      }, () => { this.persist(); this.showToast(ids.length + (ids.length === 1 ? " book moved" : " books moved")); });
    }

    setPlaceDraft(id, val) { this.setState(s => ({ placeDrafts: { ...s.placeDrafts, [id]: val } })); }
    renamePlace(id, current) {
      const draft = (this.state.placeDrafts[id] ?? current).trim();
      if (!draft || draft === current) {
        this.setState(s => { const d = { ...s.placeDrafts }; delete d[id]; return { placeDrafts: d }; });
        return;
      }
      this.setState(s => {
        const d = { ...s.placeDrafts }; delete d[id];
        const isCustom = s.customPlaces.some(p => p.id === id);
        if (isCustom) return { customPlaces: s.customPlaces.map(p => p.id === id ? { ...p, name: draft } : p), placeDrafts: d };
        const base = PLACE_LIST.find(p => p.id === id);
        if (!base) return { placeDrafts: d };
        return {
          hiddenPlaces: s.hiddenPlaces.indexOf(id) === -1 ? [...s.hiddenPlaces, id] : s.hiddenPlaces,
          customPlaces: [...s.customPlaces, { id, name: draft, lat: base.lat, lon: base.lon }],
          placeDrafts: d
        };
      }, () => this.persist());
    }
    removePlace(id) {
      if (this.state.books.some(b => b.place === id)) return;
      this.setState(s => ({
        customPlaces: s.customPlaces.filter(p => p.id !== id),
        hiddenPlaces: PLACE_LIST.some(p => p.id === id) && s.hiddenPlaces.indexOf(id) === -1 ? [...s.hiddenPlaces, id] : s.hiddenPlaces
      }), () => this.persist());
    }
    addPlace() {
      const name = this.state.newPlaceName.trim();
      const lat = parseFloat(this.state.newPlaceLat);
      const lon = parseFloat(this.state.newPlaceLon);
      if (!name) { this.setState({ placeError: "Give the place a name." }); return; }
      if (!isFinite(lat) || lat < -90 || lat > 90) { this.setState({ placeError: "Latitude must be a number between −90 and 90." }); return; }
      if (!isFinite(lon) || lon < -180 || lon > 180) { this.setState({ placeError: "Longitude must be a number between −180 and 180." }); return; }
      let id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "place";
      const all = PLACE_LIST.concat(this.state.customPlaces);
      if (all.some(p => p.id === id)) id = id + "-2";
      this.setState(s => ({
        customPlaces: [...s.customPlaces, { id, name, lat, lon }],
        newPlaceName: "", newPlaceLat: "", newPlaceLon: "", placeError: ""
      }), () => this.persist());
    }
    openPlaceAssign(id) { this.setState({ placeAssignTo: id, placeAssignChecked: {}, placeAssignQuery: "", placeAssignFrom: "" }); }
    cancelPlaceAssign() { this.setState({ placeAssignTo: null, placeAssignChecked: {} }); }
    togglePlaceAssignBook(id) { this.setState(s => ({ placeAssignChecked: { ...s.placeAssignChecked, [id]: !s.placeAssignChecked[id] } })); }
    savePlaceAssign() {
      const target = this.state.placeAssignTo, checked = this.state.placeAssignChecked;
      if (!target) return;
      const ids = Object.keys(checked).filter(k => checked[k]);
      if (!ids.length) { this.setState({ placeAssignTo: null, placeAssignChecked: {} }); return; }
      this.setState(s => ({
        books: s.books.map(b => ids.indexOf(b.id) === -1 ? b : { ...b, place: target }),
        placeAssignTo: null, placeAssignChecked: {}
      }), () => { this.persist(); this.showToast(ids.length + (ids.length === 1 ? " book placed" : " books placed")); });
    }

    toggleWishlistDone(id) {
      this.setState(s => ({ wishlist: s.wishlist.map(w => w.id === id ? { ...w, done: !w.done } : w) }), () => this.persist());
    }
    removeWishlistItem(id) {
      this.setState(s => ({ wishlist: s.wishlist.filter(w => w.id !== id) }), () => this.persist());
    }
    addWishlistItem() {
      const text = this.state.newWishlistText.trim();
      if (!text) return;
      const id = "wish-" + Date.now();
      this.setState(s => ({ wishlist: [...s.wishlist, { id, text, done: false }], newWishlistText: "" }), () => this.persist());
    }

    openAddShelfForm() { this.setState({ showAddShelfForm: true, addShelfName: "", addShelfBlurb: "" }); }
    cancelAddShelf() { this.setState({ showAddShelfForm: false }); }
    saveAddShelf() {
      const name = this.state.addShelfName.trim();
      if (!name) { this.setState({ showAddShelfForm: false }); return; }
      let id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const all = CITY_LIST.concat(this.state.customCities);
      if (all.some(c => c.id === id)) id = id + "-2";
      const blurb = this.state.addShelfBlurb.trim() || "Location — a new shelf.";
      this.setState(s => ({ customCities: [...s.customCities, { id, name, blurb }], showAddShelfForm: false }), () => this.persist());
    }

    addCustomThread(which) {
      const key = which === "edit" ? "editThreadInput" : "addThreadInput";
      const draftKey = which === "edit" ? "editDraft" : "addDraft";
      const val = (this.state[key] || "").trim();
      if (!val) return;
      const all = this.state.customThreads;
      const exists = all.some(t => t.toLowerCase() === val.toLowerCase());
      const canonical = exists ? all.find(t => t.toLowerCase() === val.toLowerCase()) : val;
      this.setState(s => {
        const draft = s[draftKey];
        const nextThreads = draft.threads.indexOf(canonical) === -1 ? [...draft.threads, canonical] : draft.threads;
        return {
          customThreads: exists ? s.customThreads : [...s.customThreads, val],
          [draftKey]: { ...draft, threads: nextThreads },
          [key]: ""
        };
      }, () => this.persist());
    }

    setView(v) { this.setState({ view: v }); }
    openDetail(id) { this.setState({ selectedId: id, editMode: false, editDraft: null, showBorrowForm: false }); }
    closeDialog() { this.setState({ selectedId: null, editMode: false, editDraft: null, showBorrowForm: false }); }
    openBorrowForm() {
      const cur = this.resolveBookRef(this.state.selectedId);
      const b = (cur && cur.borrowed) || { to: "", date: "" };
      this.setState({ showBorrowForm: true, borrowDraft: { to: b.to || "", date: b.date || "" } });
    }
    cancelBorrowForm() { this.setState({ showBorrowForm: false }); }
    updateBorrowDraft(key, val) { this.setState(s => ({ borrowDraft: { ...s.borrowDraft, [key]: val } })); }
    saveBorrow() {
      const id = this.state.selectedId; const draft = this.state.borrowDraft;
      if (!id) return;
      if (String(id).indexOf("alex:") === 0) {
        const num = String(id).slice(5);
        this.setState(s => ({ alexandria: s.alexandria.map(a => String(a.num) === num ? { ...a, borrowed: { to: draft.to, date: draft.date } } : a), showBorrowForm: false }), () => this.persist());
      } else {
        this.setState(s => ({ books: s.books.map(b => b.id === id ? { ...b, borrowed: { to: draft.to, date: draft.date } } : b), showBorrowForm: false }), () => this.persist());
      }
    }
    updateBorrowedRecord(id, key, val) {
      if (String(id).indexOf("alex:") === 0) {
        const num = String(id).slice(5);
        this.setState(s => ({ alexandria: s.alexandria.map(a => String(a.num) === num ? { ...a, borrowed: { ...a.borrowed, [key]: val } } : a) }), () => this.persist());
      } else {
        this.setState(s => ({ books: s.books.map(b => b.id === id ? { ...b, borrowed: { ...b.borrowed, [key]: val } } : b) }), () => this.persist());
      }
    }
    markReturned(id) {
      if (String(id).indexOf("alex:") === 0) {
        const num = String(id).slice(5);
        this.setState(s => ({ alexandria: s.alexandria.map(a => String(a.num) === num ? { ...a, borrowed: null } : a) }), () => this.persist());
      } else {
        this.setState(s => ({ books: s.books.map(b => b.id === id ? { ...b, borrowed: null } : b) }), () => this.persist());
      }
    }
    startEdit() {
      const book = this.state.books.find(b => b.id === this.state.selectedId);
      this.setState({ editMode: true, editDraft: { ...book, threads: [...book.threads], mode: [...book.mode] } });
    }
    cancelEdit() { this.setState({ editMode: false, editDraft: null }); }
    saveEdit() {
      const draft = this.state.editDraft;
      const books = this.state.books.map(b => b.id === draft.id ? { ...draft } : b);
      this.setState({ books, editMode: false, editDraft: null }, () => this.persist());
    }
    updateEditField(key, val) { this.setState(s => ({ editDraft: { ...s.editDraft, [key]: val } })); }
    toggleEditArr(field, val) {
      this.setState(s => {
        const arr = s.editDraft[field]; const has = arr.includes(val);
        return { editDraft: { ...s.editDraft, [field]: has ? arr.filter(x => x !== val) : [...arr, val] } };
      });
    }

    openAddForm() { this.setState({ showAddForm: true, addDraft: EMPTY_DRAFT() }); }
    cancelAdd() { this.setState({ showAddForm: false, addDraft: null }); }
    updateAddField(key, val) { this.setState(s => ({ addDraft: { ...s.addDraft, [key]: val } })); }
    toggleAddArr(field, val) {
      this.setState(s => {
        const arr = s.addDraft[field]; const has = arr.includes(val);
        return { addDraft: { ...s.addDraft, [field]: has ? arr.filter(x => x !== val) : [...arr, val] } };
      });
    }
    saveAdd() {
      const d = this.state.addDraft;
      if (!d.author.trim() && !d.title.trim()) { this.setState({ showAddForm: false, addDraft: null }); return; }
      const inCity = this.state.books.filter(b => b.city === d.city);
      const nextNum = inCity.length ? Math.max(...inCity.map(b => b.num)) + 1 : 1;
      const uid = "book-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7);
      const book = { ...d, id: uid, num: nextNum };
      this.setState({ books: [...this.state.books, book], showAddForm: false, addDraft: null }, () => this.persist());
    }

    matches(book, s) {
      if (s.placeFilter === "__unplaced" && book.place) return false;
      if (s.placeFilter && s.placeFilter !== "__unplaced" && book.place !== s.placeFilter) return false;
      if (s.cityFilter === "alexandria") return false;
      if (s.statusFilter === "borrowed" && !book.borrowed) return false;
      if (s.cityFilter && book.city !== s.cityFilter) return false;
      if (s.periodFilter && book.period !== s.periodFilter) return false;
      if (s.threadFilter && book.threads.indexOf(s.threadFilter) === -1) return false;
      if (s.search) {
        const q = s.search.toLowerCase();
        const hay = [book.author, book.title, book.note, book.series, book.translator].join(" ").toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    }

    exportMarkdown() {
      const s = this.state;
      const ALL_CITIES = CITY_LIST.filter(c => s.hiddenCities.indexOf(c.id) === -1).concat(s.customCities);
      const ALL_THREADS = s.customThreads;
      const bindingPrefix = (code) => code && code !== "personal" ? "**" + BINDING_LABEL[code] + "** " : "";
      const row = (b, i) => "| " + (i + 1) + " | " + b.author + " | " + b.title + " | " + (b.series || "") + " | " + (b.translator || "") + " | " + (b.lang || "") + " | " + (b.period || "—") + " | " + b.threads.join(" · ") + " | " + b.mode.join(" · ") + " | " + (bindingPrefix(b.binding) + (b.note || "")).trim() + " |";
      let out = "# Personal Library — Catalogue\n\n";
      out += "**Version " + s.meta.version + " — " + s.meta.date + ".** *When editing, increment this (1.1, 1.2, …) and update the date. Always replace the project-knowledge copy **entire** with the newest version so two versions never coexist.*\n\n";
      out += "*A lean catalogue, built to be thought with. Fields are captured only when a spine offers them freely; an empty field is a deliberate silence, not a gap to be filled. **Edit this file as one whole document and re-upload it entire — never patch it blindly**, so duplication and drift cannot creep in.*\n\n";
      out += "## How this catalogue is organised\n\n";
      out += "Two things are kept deliberately separate: **where a book physically sits**, and **what a book means**.\n\n";
      out += "**Location (cities).** Books are grouped by physical shelf, each shelf named for a *city* — a private geography in which each city is the capital of an age or a spirit. A location carries no intellectual claim; it is only where the volume happens to rest, partly a record of available space. New cities may be founded as the collection grows.\n\n";
      ALL_CITIES.forEach(c => out += "- **" + c.name + "** — " + c.blurb.replace("Location — ", "") + "\n");
      out += "\n**Meaning (three classification axes), independent of location:**\n\n";
      out += "- **Period** — *exactly one* per book. The age it belongs to; the primary identity and sort.\n";
      out += "- **Threads** — *zero or more, unranked (flat)*. Thematic throughlines that deliberately cross periods and cities; this is what gathers what the shelves scatter.\n";
      out += "- **Mode** — *zero or more*. What *kind* of object or utterance the book is, regardless of its subject.\n\n";
      out += "Because meaning is detached from location, reshelving a book (more space, a new city) changes only its location, never its classification.\n\n";
      out += "## Controlled vocabulary\n\n";
      out += "**Period** *(choose one):* " + s.periods.join(" · ") + "\n\n";
      out += "**Threads** *(zero or more):* " + ALL_THREADS.join(" · ") + "\n\n";
      out += "**Mode** *(zero or more):* " + MODES.join(" · ") + "\n\n";
      out += "**Binding** *(noted inline):* `own` = as acquired · `rebound` by Laurant — (a) cloth with printed wraparound cover [earliest] · (b) cloth, spine not yet decorated · (c) cloth, gold-stamped spine [latest].\n\n---\n\n";
      ALL_CITIES.forEach(c => {
        const books = s.books.filter(b => b.city === c.id).sort((a, b) => a.num - b.num);
        out += "## " + c.name + "\n*" + c.blurb.replace("Location — ", "") + "*\n\n";
        out += "| # | Author | Title | Series / Ref | Translator | Lang | Period | Threads | Mode | Note |\n|---|---|---|---|---|---|---|---|---|---|\n";
        books.forEach((b, i) => out += row(b, i) + "\n");
        out += "\n*Total: " + books.length + " entries.*\n\n---\n\n";
      });
      out += "## Alexandria\n*The gathered universal shelf — reference annex, unclassified.*\n\n| # | Author | Title |\n|---|---|---|\n";
      s.alexandria.forEach(a => out += "| " + a.num + " | " + a.author + " | " + a.title + " |\n");
      out += "\n*Total: " + s.alexandria.length + " entries (reference annex).*\n\n---\n\n";
      if (s.quotes.length) {
        out += "### Quotes & citations\n\n";
        s.quotes.forEach(q => {
          const book = this.resolveBookRef(q.bookId);
          const label = book ? (book.author + " — *" + book.title + "*" + (book.isAlexandria ? " (Alexandria)" : "")) : "Unlinked";
          out += "> " + q.quote + "\n>\n> — " + label + (q.page ? ", p. " + q.page : "") + (q.themes && q.themes.length ? "  \n> **Themes:** " + q.themes.join(" · ") : "") + (q.note ? "  \n> *" + q.note + "*" : "") + "\n\n";
        });
        out += "---\n\n";
      }
      out += "### Wishlist / standing intentions\n";
      s.wishlist.forEach(w => out += "- " + (w.done ? "~~" + w.text + "~~" : w.text) + "\n");
      const total = s.books.length;
      const cityBreakdown = ALL_CITIES.map(c => c.name + " — " + s.books.filter(b => b.city === c.id).length).join(" · ");
      out += "\n### Summary\n- Authored library: " + cityBreakdown + " → **" + total + " entries**, " + ALL_CITIES.length + " cities.\n";
      out += "- Reference annex: Alexandria — " + s.alexandria.length + " (gathered, not authored; held apart).\n";
      if (s.quotes.length) out += "- Quotes & citations recorded: " + s.quotes.length + ".\n";
      const blob = new Blob([out], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = "Library Catalogue.md"; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    }

    renderVals() {
      const s = this.state;
      const toggleTheme = () => {
        const next = s.theme === "dark" ? "light" : "dark";
        if (typeof localStorage !== "undefined") localStorage.setItem("library-theme", next);
        this.setState({ theme: next });
      };
      const ALL_THREADS = s.customThreads;
      const ALL_CITIES = CITY_LIST.filter(c => s.hiddenCities.indexOf(c.id) === -1).concat(s.customCities);
      const ALL_LANGS = BASE_LANGS.concat(s.customLangs);
      const ALL_PLACES = PLACE_LIST.filter(p => s.hiddenPlaces.indexOf(p.id) === -1).concat(s.customPlaces)
        .slice().sort((a, b) => a.name.localeCompare(b.name));
      const PLACE_NAME = {}; ALL_PLACES.forEach(p => PLACE_NAME[p.id] = p.name);
      const langChoiceOptions = [{ value: "", label: "—" }, ...ALL_LANGS.map(l => ({ value: l, label: l }))];
      const CITY_NAME_ALL = {}; ALL_CITIES.forEach(c => CITY_NAME_ALL[c.id] = c.name);
      const books = s.books.map(b => ({
        ...b,
        periodLabel: b.period || "— (trans-period)",
        cityName: CITY_NAME_ALL[b.city] || b.city,
        seriesLabel: b.series || "—",
        translatorLabel: b.translator || "—",
        langLabel: b.lang || "—",
        bindingLabel: BINDING_LABEL[b.binding] || "Personal",
        threadTags: b.threads, modeTags: b.mode,
        showVolumes: (Number(b.bookCount) || 1) > 1, volumesLabel: "Volumes: " + (Number(b.bookCount) || 1),
        open: () => this.openDetail(b.id)
      }));

      const filtered = books.filter(b => this.matches(b, s));
      const cityGroups = ALL_CITIES.map(c => {
        const gb = filtered.filter(b => b.city === c.id).sort((a, b) => a.num - b.num);
        return { city: c, books: gb, hasBooks: gb.length > 0 };
      });

      const periodOptions = [{ value: "", label: "All periods" }, ...s.periods.map(p => ({ value: p, label: p }))]
        .map(o => ({ ...o, select: () => this.setState({ periodFilter: o.value, periodFilterOpen: false }) }));
      const threadOptions = [{ value: "", label: "All threads" }, ...ALL_THREADS.map(t => ({ value: t, label: t }))]
        .map(o => ({ ...o, select: () => this.setState({ threadFilter: o.value, threadFilterOpen: false }) }));
      const cityOptions = [{ value: "", label: "All cities" }, ...ALL_CITIES.map(c => ({ value: c.id, label: c.name })), { value: "alexandria", label: "Alexandria (annex)" }]
        .map(o => ({ ...o, select: () => this.setState({ cityFilter: o.value, cityFilterOpen: false }) }));
      const cityFilterLabel = s.cityFilter === "alexandria" ? "Alexandria (annex)" : ((ALL_CITIES.find(c => c.id === s.cityFilter) || {}).name || "All cities");
      const periodFilterLabel = s.periodFilter || "All periods";
      const threadFilterLabel = s.threadFilter || "All threads";
      const periodChoiceOptions = [{ value: "", label: "— (trans-period)" }, ...s.periods.map(p => ({ value: p, label: p }))];
      const cityChoiceOptions = ALL_CITIES.map(c => ({ value: c.id, label: c.name }));

      const bar = (rows) => {
        const max = Math.max(1, ...rows.map(r => r.count));
        return rows.map(r => ({ ...r, pct: Math.round((r.count / max) * 100) + "%" }));
      };
      const statsByCity = bar(ALL_CITIES.map(c => ({ label: c.name, count: s.books.filter(b => b.city === c.id).length })));
      const statsByPeriod = bar(s.periods.map(p => ({ label: p, count: s.books.filter(b => b.period === p).length })).filter(r => r.count > 0).sort((a, b) => b.count - a.count));
      const periodManageRows = s.periods.map(p => {
        const count = s.books.filter(b => b.period === p).length;
        return {
          value: p, count, draft: s.periodDrafts[p] ?? p,
          onDraftChange: (e) => this.setPeriodDraft(p, e.target.value),
          save: () => this.renamePeriod(p), remove: () => this.removePeriod(p), canRemove: count === 0
        };
      });
      const statsByThread = bar(ALL_THREADS.map(t => ({ label: t, count: s.books.filter(b => b.threads.indexOf(t) !== -1).length })).filter(r => r.count > 0).sort((a, b) => b.count - a.count));
      const threadManageRows = s.customThreads.map(t => {
        const count = s.books.filter(b => b.threads.indexOf(t) !== -1).length;
        return {
          value: t, count, draft: s.threadDrafts[t] ?? t,
          onDraftChange: (e) => this.setThreadDraft(t, e.target.value),
          save: () => this.renameThread(t), remove: () => this.removeThread(t), canRemove: count === 0,
          openAssign: () => this.openThreadAssign(t)
        };
      });
      const themeManageRows = s.themes.map(t => {
        const count = s.quotes.filter(q => q.themes.indexOf(t) !== -1).length;
        return {
          value: t, count, draft: s.themeDrafts[t] ?? t,
          onDraftChange: (e) => this.setThemeDraft(t, e.target.value),
          save: () => this.renameTheme(t), remove: () => this.removeTheme(t), canRemove: count === 0
        };
      });
      const threadAssignQ = s.threadAssignQuery.trim().toLowerCase();
      const threadAssignRows = s.threadAssignFor ? s.books.filter(b => !threadAssignQ || b.title.toLowerCase().indexOf(threadAssignQ) !== -1 || b.author.toLowerCase().indexOf(threadAssignQ) !== -1)
        .map(b => ({ id: b.id, label: b.title + " — " + b.author, checked: !!s.threadAssignChecked[b.id], toggle: () => this.toggleThreadAssignBook(b.id) })) : [];
      const shelfManageRows = ALL_CITIES.map(c => {
        const count = s.books.filter(b => b.city === c.id).length;
        return {
          id: c.id, count,
          draft: s.shelfDrafts[c.id] ?? c.name,
          onDraftChange: (e) => this.setShelfDraft(c.id, e.target.value),
          save: () => this.renameShelf(c.id, c.name),
          remove: () => this.setState({ removeShelfId: c.id }, () => this.removeShelf()),
          openMove: () => this.openShelfMove(c.id)
        };
      });
      const shelfMoveQ = s.shelfMoveQuery.trim().toLowerCase();
      const shelfMoveRows = s.shelfMoveTo ? s.books
        .filter(b => b.city !== s.shelfMoveTo)
        .filter(b => !s.shelfMoveFrom || b.city === s.shelfMoveFrom)
        .filter(b => !shelfMoveQ || b.title.toLowerCase().indexOf(shelfMoveQ) !== -1 || b.author.toLowerCase().indexOf(shelfMoveQ) !== -1)
        .map(b => ({
          id: b.id, label: b.title + " — " + b.author,
          from: CITY_NAME_ALL[b.city] || b.city,
          checked: !!s.shelfMoveChecked[b.id],
          toggle: () => this.toggleShelfMoveBook(b.id)
        })) : [];
      const shelfMoveSelected = Object.keys(s.shelfMoveChecked).filter(k => s.shelfMoveChecked[k]).length;

      const ALL_PLACES_UNUSED = null;
      const placeCounts = {};
      s.books.forEach(b => { if (b.place) placeCounts[b.place] = (placeCounts[b.place] || 0) + 1; });
      const unplacedCount = s.books.filter(b => !b.place).length;
      const placeChoiceOptions = [{ value: "", label: "— unplaced" }, ...ALL_PLACES.map(p => ({ value: p.id, label: p.name }))];
      const placeOptions = [
        { value: "", label: "All locations" },
        { value: "__unplaced", label: "Unplaced (" + unplacedCount + ")" },
        ...ALL_PLACES.filter(p => placeCounts[p.id]).map(p => ({ value: p.id, label: p.name + " (" + placeCounts[p.id] + ")" }))
      ].map(o => ({ ...o, select: () => this.setState({ placeFilter: o.value, placeFilterOpen: false }) }));
      const placeFilterLabel = s.placeFilter === "__unplaced" ? "Unplaced" : (PLACE_NAME[s.placeFilter] || "All locations");
      const mapGhosts = [];
      const zoomView = () => {
        const r = BALKAN_REGION;
        // Always hold Chameria in frame: Janina and the southern Epirote coast.
        const pts = ALL_PLACES.filter(p => placeCounts[p.id] && p.lat >= r.lat0 && p.lat <= r.lat1 && p.lon >= r.lon0 && p.lon <= r.lon1)
          .map(p => projectPlace(p.lat, p.lon))
          .concat([projectPlace(39.665, 20.853), projectPlace(39.15, 20.40)]);
        if (pts.length < 2) return balkanView();
        const xs = pts.map(p => p.x), ys = pts.map(p => p.y);
        let x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
        const pad = Math.max(3, 0.14 * Math.max(x1 - x0, y1 - y0));
        x0 -= pad; x1 += pad; y0 -= pad; y1 += pad;
        const aspect = MAP_VIEWBOX.w / MAP_VIEWBOX.h;
        let w = Math.max(x1 - x0, 14), h = Math.max(y1 - y0, 14);
        if (w / h > aspect) h = w / aspect; else w = h * aspect;
        const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
        return { x: cx - w / 2, y: cy - h / 2, w, h };
      };
      const mapView = s.mapZoom ? zoomView() : { x: 0, y: 0, w: MAP_VIEWBOX.w, h: MAP_VIEWBOX.h };
      const mapViewBox = mapView.x.toFixed(2) + " " + mapView.y.toFixed(2) + " " + mapView.w.toFixed(2) + " " + mapView.h.toFixed(2);
      const zk = mapView.w / MAP_VIEWBOX.w;
      const mapDots = ALL_PLACES.filter(p => placeCounts[p.id]).map(p => {
        const pt = projectPlace(p.lat, p.lon);
        const n = placeCounts[p.id];
        return {
          id: p.id, x: pt.x, y: pt.y, r: Math.min(14, 3 + Math.sqrt(n) * 1.7) * zk, count: n,
          label: p.name + " — " + n + (n === 1 ? " book" : " books"),
          select: () => this.setState({ placeFilter: p.id, view: "shelves" })
        };
      });
      const framePx = s.framePx || 560;
      const labelSize = 11.5 * mapView.w / framePx;
      const placedLabels = [];
      if (s.mapZoom) {
        const boxes = [];
        const gap = labelSize * 0.4;
        const inView = mapDots.filter(d => d.x > mapView.x && d.x < mapView.x + mapView.w && d.y > mapView.y && d.y < mapView.y + mapView.h)
          .slice().sort((a, b) => b.count - a.count || a.y - b.y);
        const hits = (b) => boxes.some(o => !(b.x1 <= o.x0 || b.x0 >= o.x1 || b.y1 <= o.y0 || b.y0 >= o.y1));
        inView.forEach(d => {
          const name = PLACE_NAME[d.id] || "";
          const w = name.length * labelSize * 0.68 + labelSize * 0.5, h = labelSize * 1.35;
          const cands = [
            { x: d.x + d.r + gap, y: d.y + labelSize * 0.36, anchor: "start" },
            { x: d.x - d.r - gap, y: d.y + labelSize * 0.36, anchor: "end" },
            { x: d.x, y: d.y - d.r - gap, anchor: "middle" },
            { x: d.x, y: d.y + d.r + gap + labelSize * 0.8, anchor: "middle" }
          ];
          for (const c of cands) {
            const x0 = c.anchor === "start" ? c.x : c.anchor === "end" ? c.x - w : c.x - w / 2;
            const box = { x0, x1: x0 + w, y0: c.y - h * 0.8, y1: c.y + h * 0.25 };
            const m = labelSize * 0.3;
            if (box.x0 < mapView.x + m || box.x1 > mapView.x + mapView.w - m ||
                box.y0 < mapView.y + m || box.y1 > mapView.y + mapView.h - m) continue;
            if (hits(box)) continue;
            boxes.push(box);
            placedLabels.push({ id: d.id, name, x: c.x, y: c.y, anchor: c.anchor });
            return;
          }
        });
      }
      const mapLabelEls = s.mapZoom ? React.createElement("g", null, placedLabels.map(l => React.createElement("text", {
        key: l.id, x: l.x, y: l.y, textAnchor: l.anchor,
        fontSize: labelSize, fill: "var(--color-neutral-900)",
        stroke: "var(--color-surface)", strokeWidth: labelSize * 0.28, strokeLinejoin: "round",
        style: { paintOrder: "stroke", fontFamily: "var(--font-body)" }
      }, l.name))) : null;
      const mapLand = s.mapSvg ? React.createElement("svg", {
        viewBox: mapViewBox,
        preserveAspectRatio: "xMidYMid meet",
        style: { position: "absolute", inset: 0, width: "100%", height: "100%", fill: "var(--color-neutral-400)", stroke: "var(--color-neutral-400)", strokeWidth: 0.5, strokeLinejoin: "round" },
        dangerouslySetInnerHTML: { __html: s.mapSvg }
      }) : null;
      const placeManageRows = ALL_PLACES.map(p => {
        const count = placeCounts[p.id] || 0;
        return {
          id: p.id, count,
          coords: p.lat.toFixed(2) + ", " + p.lon.toFixed(2),
          draft: s.placeDrafts[p.id] ?? p.name,
          onDraftChange: (e) => this.setPlaceDraft(p.id, e.target.value),
          save: () => this.renamePlace(p.id, p.name),
          remove: () => this.removePlace(p.id),
          openAssign: () => this.openPlaceAssign(p.id)
        };
      });
      const placeAssignQ = s.placeAssignQuery.trim().toLowerCase();
      const placeAssignRows = s.placeAssignTo ? s.books
        .filter(b => b.place !== s.placeAssignTo)
        .filter(b => !s.placeAssignFrom || (s.placeAssignFrom === "__unplaced" ? !b.place : b.place === s.placeAssignFrom))
        .filter(b => !placeAssignQ || b.title.toLowerCase().indexOf(placeAssignQ) !== -1 || b.author.toLowerCase().indexOf(placeAssignQ) !== -1)
        .map(b => ({
          id: b.id, label: b.title + " — " + b.author,
          from: b.place ? (PLACE_NAME[b.place] || b.place) : "unplaced",
          checked: !!s.placeAssignChecked[b.id],
          toggle: () => this.togglePlaceAssignBook(b.id)
        })) : [];
      const placeAssignSelected = Object.keys(s.placeAssignChecked).filter(k => s.placeAssignChecked[k]).length;

      const langCounts = {};
      s.books.forEach(b => { const l = b.lang || "—"; langCounts[l] = (langCounts[l] || 0) + 1; });
      const statsByLang = bar(Object.keys(langCounts).map(l => ({ label: l, count: langCounts[l] })).sort((a, b) => b.count - a.count));
      const quoteCountByBook = {};
      s.quotes.forEach(q => { quoteCountByBook[q.bookId] = (quoteCountByBook[q.bookId] || 0) + 1; });
      const statsByBook = bar(Object.keys(quoteCountByBook).map(id => {
        const bk = this.resolveBookRef(id);
        return { label: bk ? bk.title + " — " + bk.author : "(book removed)", count: quoteCountByBook[id] };
      }).sort((a, b) => b.count - a.count));

      let selectedBookRaw = null;
      if (s.selectedId) {
        if (String(s.selectedId).indexOf("alex:") === 0) {
          const num = String(s.selectedId).slice(5);
          const a = s.alexandria.find(x => String(x.num) === num);
          if (a) selectedBookRaw = { id: s.selectedId, title: a.title, author: a.author, isAlexandria: true, city: null, period: "", series: "", translator: "", lang: "", binding: "", threads: [], mode: [], note: "", borrowed: a.borrowed || null };
        } else {
          const b = s.books.find(x => x.id === s.selectedId);
          if (b) selectedBookRaw = { ...b, isAlexandria: false };
        }
      }
      const selectedBook = selectedBookRaw ? {
        ...selectedBookRaw, periodLabel: selectedBookRaw.period || "— (trans-period)",
        cityName: selectedBookRaw.isAlexandria ? "Alexandria" : CITY_NAME_ALL[selectedBookRaw.city], seriesLabel: selectedBookRaw.series || "—",
        translatorLabel: selectedBookRaw.translator || "—", langLabel: selectedBookRaw.lang || "—",
        bindingLabel: BINDING_LABEL[selectedBookRaw.binding] || "Personal",
        placeLabel: PLACE_NAME[selectedBookRaw.place] || "—",
        threadTags: selectedBookRaw.threads, modeTags: selectedBookRaw.mode,
        showVolumes: (Number(selectedBookRaw.bookCount) || 1) > 1,
        notAlexandria: !selectedBookRaw.isAlexandria,
        quoteCount: s.quotes.filter(q => q.bookId === selectedBookRaw.id).length,
        journalLine: B.journal && B.journal.summaryFor ? B.journal.summaryFor(selectedBookRaw.id) : "",
        journalHref: "#journal/book/" + encodeURIComponent(selectedBookRaw.id)
      } : null;
      const crossRefs = selectedBookRaw ? s.books.filter(b => b.id !== selectedBookRaw.id && b.threads.some(t => selectedBookRaw.threads.indexOf(t) !== -1))
        .slice(0, 10).map(b => ({ id: b.id, title: b.title, author: b.author, cityName: CITY_NAME_ALL[b.city], open: () => this.openDetail(b.id) })) : [];

      const mkChoices = (list, draft, field, toggle) => draft ? list.map(v => ({ label: v, cls: draft[field].indexOf(v) !== -1 ? "tag-accent" : "tag-outline", toggle: () => toggle(field, v) })) : [];

      const alexAsBooks = s.alexandria.map(a => ({ id: "alex:" + a.num, title: a.title, author: a.author, isAlexandria: true }));
      const quoteSearchPool = books.concat(alexAsBooks);
      const quoteBookMatches = (s.quoteBookOpen && s.quoteBookQuery.trim()) ? quoteSearchPool.filter(bk => {
        const q = s.quoteBookQuery.trim().toLowerCase();
        return (bk.title.toLowerCase().indexOf(q) !== -1 || bk.author.toLowerCase().indexOf(q) !== -1) && this.bookLabel(bk) !== s.quoteBookQuery;
      }).slice(0, 6).map(bk => ({ label: this.bookLabel(bk), select: () => this.selectQuoteBook(bk) })) : [];
      const quoteThemeChoices = s.quoteDraft ? s.themes.map(v => ({ label: v, cls: s.quoteDraft.themes.indexOf(v) !== -1 ? "tag-accent" : "tag-outline", toggle: () => this.toggleQuoteTheme(v) })) : [];
      const quoteThemeFilterOptions = [{ value: "", label: "All themes" }, ...s.themes.map(t => ({ value: t, label: t }))]
        .map(opt => ({ ...opt, select: () => this.setState({ quoteThemeFilter: opt.value, themeFilterOpen: false }) }));
      const quoteThemeFilterLabel = s.quoteThemeFilter || "All themes";
      const quotesList = s.quotes.filter(q => !s.quoteThemeFilter || q.themes.indexOf(s.quoteThemeFilter) !== -1).map(q => {
        const book = this.resolveBookRef(q.bookId);
        return {
          ...q, bookTitle: book ? book.title : "(book removed)", bookAuthor: book ? book.author : "",
          cityName: book ? (book.isAlexandria ? "Alexandria" : CITY_NAME_ALL[book.city]) : "", themeTags: q.themes, edit: () => this.openEditQuote(q)
        };
      }).sort((a, b) => a.bookTitle.localeCompare(b.bookTitle) || (Number(a.page) || 0) - (Number(b.page) || 0));
      const editHandlers = {}; ["author", "title", "series", "translator", "lang", "period", "city", "note", "binding", "bookCount", "place"].forEach(k => {
        editHandlers[k] = (e) => this.updateEditField(k, e.target.value);
      });
      editHandlers.author = (e) => { this.updateEditField("author", e.target.value); this.setState({ editAuthorOpen: true }); };
      const addHandlers = {}; ["author", "title", "series", "translator", "lang", "period", "city", "note", "binding", "bookCount", "place"].forEach(k => {
        addHandlers[k] = (e) => this.updateAddField(k, e.target.value);
      });
      addHandlers.author = (e) => { this.updateAddField("author", e.target.value); this.setState({ addAuthorOpen: true }); };

      const uniqueAuthors = Array.from(new Set(s.books.map(bk => bk.author))).sort();
      const authorMatches = (draft, open) => {
        if (!open || !draft || !draft.author) return [];
        const q = draft.author.trim().toLowerCase();
        if (!q) return [];
        return uniqueAuthors.filter(a => a.toLowerCase() !== q && a.toLowerCase().indexOf(q) !== -1).slice(0, 6);
      };
      const addAuthorMatches = authorMatches(s.addDraft, s.addAuthorOpen);
      const editAuthorMatches = authorMatches(s.editDraft, s.editAuthorOpen);

      const alexMatch = (a) => {
        if (s.statusFilter === "borrowed" && !a.borrowed) return false;
        if (s.search) {
          const q = s.search.toLowerCase();
          if ((a.author + " " + a.title).toLowerCase().indexOf(q) === -1) return false;
        }
        return true;
      };
      const alexandriaFiltered = s.alexandria.filter(alexMatch);
      const borrowedTotal = s.books.filter(b => b.borrowed).length + s.alexandria.filter(a => a.borrowed).length;

      return {
        theme: s.theme, toggleTheme, themeLabel: s.theme === "dark" ? "Light mode" : "Dark mode",
        themeKnobLeft: s.theme === "dark" ? "26px" : "2px", themeKnobColor: s.theme === "dark" ? "#e3d9c6" : "#262524",
        loaded: s.loaded, meta: s.meta, view: s.view,
        isShelves: s.view === "shelves", isWishlist: s.view === "wishlist", isQuotes: s.view === "quotes", isMap: s.view === "map",
        notShelves: s.view !== "shelves", notWishlist: s.view !== "wishlist", notQuotes: s.view !== "quotes", notMap: s.view !== "map",
        setView: { shelves: () => this.setView("shelves"), wishlist: () => this.setView("wishlist"), quotes: () => this.setView("quotes"), map: () => this.setView("map") },
        menuOpen: s.menuOpen,
        toggleMenu: () => this.setState(p => ({ menuOpen: !p.menuOpen })),
        onMenuBlur: () => setTimeout(() => this.setState({ menuOpen: false }), 160),
        addMenuOpen: s.addMenuOpen,
        toggleAddMenu: () => this.setState(p => ({ addMenuOpen: !p.addMenuOpen })),
        onAddMenuBlur: () => setTimeout(() => this.setState({ addMenuOpen: false }), 160),
        openPeriodManager: () => this.setState({ showPeriodManager: true, menuOpen: false }),
        closePeriodManager: () => this.setState({ showPeriodManager: false }),
        openThreadManager: () => this.setState({ showThreadManager: true, menuOpen: false }),
        closeThreadManager: () => this.setState({ showThreadManager: false }),
        hasBorrowed: borrowedTotal > 0, borrowedCount: borrowedTotal,
        toggleBorrowedFilter: () => this.setState(p => ({ statusFilter: p.statusFilter === "borrowed" ? "" : "borrowed", view: "shelves" })),
        borrowedFilterOn: borrowedTotal > 0 && s.statusFilter === "borrowed",
        borrowedChipIdle: borrowedTotal > 0 && s.statusFilter !== "borrowed",
        showOverview: s.showOverview, overviewToggleLabel: s.showOverview ? "Hide" : "Show",
        toggleOverview: () => this.setState(p => ({ showOverview: !p.showOverview })),
        alexandriaOpen: s.alexandriaOpen || s.cityFilter === "alexandria" || !!s.search || s.statusFilter === "borrowed",
        alexandriaToggleLabel: s.alexandriaOpen ? "Hide" : "Show",
        toggleAlexandria: () => this.setState(p => ({ alexandriaOpen: !p.alexandriaOpen })),
        alexandriaCount: alexandriaFiltered.length + " entries",
        showAlexandria: !s.periodFilter && !s.threadFilter && (!s.cityFilter || s.cityFilter === "alexandria") && alexandriaFiltered.length > 0,
        search: s.search, onSearch: (e) => this.setState({ search: e.target.value }),
        periodFilter: s.periodFilter, threadFilter: s.threadFilter, cityFilter: s.cityFilter,
        cityFilterLabel, periodFilterLabel, threadFilterLabel,
        cityFilterOpen: s.cityFilterOpen, periodFilterOpen: s.periodFilterOpen, threadFilterOpen: s.threadFilterOpen,
        toggleCityFilterOpen: () => this.setState(st => ({ cityFilterOpen: !st.cityFilterOpen })),
        togglePeriodFilterOpen: () => this.setState(st => ({ periodFilterOpen: !st.periodFilterOpen })),
        toggleThreadFilterOpen: () => this.setState(st => ({ threadFilterOpen: !st.threadFilterOpen })),
        onCityFilterBlur: () => setTimeout(() => this.setState({ cityFilterOpen: false }), 150),
        onPeriodFilterBlur: () => setTimeout(() => this.setState({ periodFilterOpen: false }), 150),
        onThreadFilterBlur: () => setTimeout(() => this.setState({ threadFilterOpen: false }), 150),
        hasActiveFilter: !!(s.search || s.periodFilter || s.threadFilter || s.cityFilter || s.statusFilter || s.placeFilter),
        clearFilters: () => this.setState({ search: "", periodFilter: "", threadFilter: "", cityFilter: "", statusFilter: "", placeFilter: "" }),
        periodOptions, threadOptions, cityOptions, periodChoiceOptions, cityChoiceOptions, bindingOptions: BINDINGS, langChoiceOptions,
        cityGroups, totalResults: filtered.length, totalBooks: s.books.length,
        booksOwned: s.books.reduce((sum, b) => sum + (Number(b.bookCount) || 1), 0) + s.alexandria.length,
        statsByCity, statsByPeriod, statsByThread, statsByLang, statsByBook, hasStatsByBook: statsByBook.length > 0,
        showThreadManager: s.showThreadManager, toggleThreadManager: () => this.toggleThreadManager(),
        threadManageRows, hasThreadManageRows: threadManageRows.length > 0,
        newThreadText: s.newThreadText, onNewThreadText: (e) => this.setState({ newThreadText: e.target.value }), addThread: () => this.addThread(),
        showThreadAssign: !!s.threadAssignFor, threadAssignFor: s.threadAssignFor,
        threadAssignQuery: s.threadAssignQuery, onThreadAssignQuery: (e) => this.setState({ threadAssignQuery: e.target.value }),
        threadAssignRows, cancelThreadAssign: () => this.cancelThreadAssign(), saveThreadAssign: () => this.saveThreadAssign(),
        showShelfManager: s.showShelfManager,
        openShelfManager: () => this.setState({ showShelfManager: true, menuOpen: false }),
        openPlaceManager: () => this.setState({ showPlaceManager: true, menuOpen: false, placeError: "" }),
        closePlaceManager: () => this.setState({ showPlaceManager: false }),
        showPlaceManager: s.showPlaceManager, placeManageRows,
        newPlaceName: s.newPlaceName, onNewPlaceName: (e) => this.setState({ newPlaceName: e.target.value }),
        newPlaceLat: s.newPlaceLat, onNewPlaceLat: (e) => this.setState({ newPlaceLat: e.target.value }),
        newPlaceLon: s.newPlaceLon, onNewPlaceLon: (e) => this.setState({ newPlaceLon: e.target.value }),
        addPlace: () => this.addPlace(), placeError: s.placeError,
        showPlaceAssign: !!s.placeAssignTo, placeAssignToName: PLACE_NAME[s.placeAssignTo] || "",
        placeAssignQuery: s.placeAssignQuery, onPlaceAssignQuery: (e) => this.setState({ placeAssignQuery: e.target.value }),
        placeAssignFrom: s.placeAssignFrom, onPlaceAssignFrom: (e) => this.setState({ placeAssignFrom: e.target.value }),
        placeAssignFromOptions: [{ value: "", label: "Everywhere" }, { value: "__unplaced", label: "Unplaced only" }, ...ALL_PLACES.filter(p => p.id !== s.placeAssignTo && placeCounts[p.id]).map(p => ({ value: p.id, label: p.name }))],
        placeAssignRows, hasPlaceAssignRows: placeAssignRows.length > 0, noPlaceAssignRows: placeAssignRows.length === 0,
        placeAssignSelectedLabel: placeAssignSelected + " selected",
        cancelPlaceAssign: () => this.cancelPlaceAssign(), savePlaceAssign: () => this.savePlaceAssign(),
        placeOptions, placeFilterLabel, placeFilter: s.placeFilter, placeFilterOpen: s.placeFilterOpen,
        togglePlaceFilterOpen: () => this.setState(p => ({ placeFilterOpen: !p.placeFilterOpen })),
        onPlaceFilterBlur: () => setTimeout(() => this.setState({ placeFilterOpen: false }), 150),
        placeChoiceOptions, mapDots, mapGhosts, mapLand,
        hasMapDots: mapDots.length > 0, noMapDots: mapDots.length === 0,
        mapViewBox, mapLabelEls, isMapZoomed: !!s.mapZoom,
        mapFrameRef: (el) => {
          if (!el || this._mapFrameEl === el) return;
          this._mapFrameEl = el;
          const read = () => { const w = el.clientWidth; if (w && w !== this.state.framePx) this.setState({ framePx: w }); };
          if (this._mapFrameRO) this._mapFrameRO.disconnect();
          this._mapFrameRO = new ResizeObserver(read);
          this._mapFrameRO.observe(el);
          read();
        },
        toggleMapZoom: () => this.setState({ mapZoom: !s.mapZoom }),
        zoomTitle: s.mapZoom ? "Zoom out to Europe" : "Zoom to the Albanian lands",
        zoomIconColor: s.mapZoom ? "var(--color-accent)" : "var(--color-neutral-700)",
        unplacedLabel: unplacedCount + (unplacedCount === 1 ? " book not yet placed" : " books not yet placed"),
        placedLabel: (s.books.length - unplacedCount) + " of " + s.books.length + " placed across " + mapDots.length + (mapDots.length === 1 ? " location" : " locations"),
        closeShelfManager: () => this.setState({ showShelfManager: false }),
        shelfManageRows,
        newShelfText: s.newShelfText, onNewShelfText: (e) => this.setState({ newShelfText: e.target.value }),
        addShelfQuick: () => this.addShelfQuick(),
        showShelfMove: !!s.shelfMoveTo,
        shelfMoveToName: CITY_NAME_ALL[s.shelfMoveTo] || "",
        shelfMoveQuery: s.shelfMoveQuery, onShelfMoveQuery: (e) => this.setState({ shelfMoveQuery: e.target.value }),
        shelfMoveFrom: s.shelfMoveFrom, onShelfMoveFrom: (e) => this.setState({ shelfMoveFrom: e.target.value }),
        shelfMoveFromOptions: [{ value: "", label: "All shelves" }, ...ALL_CITIES.filter(c => c.id !== s.shelfMoveTo).map(c => ({ value: c.id, label: c.name }))],
        shelfMoveRows, hasShelfMoveRows: shelfMoveRows.length > 0, noShelfMoveRows: shelfMoveRows.length === 0,
        shelfMoveSelectedLabel: shelfMoveSelected === 1 ? "1 selected" : shelfMoveSelected + " selected",
        cancelShelfMove: () => this.cancelShelfMove(), saveShelfMove: () => this.saveShelfMove(),
        showThemeManager: s.showThemeManager, toggleThemeManager: () => this.toggleThemeManager(),
        themeManageRows, hasThemeManageRows: themeManageRows.length > 0,
        alexandriaList: alexandriaFiltered.map(a => ({ ...a, open: () => this.openDetail("alex:" + a.num) })),
        showBorrowForm: s.showBorrowForm, borrowDraft: s.borrowDraft || { to: "", date: "" },
        onBorrowTo: (e) => this.updateBorrowDraft("to", e.target.value), onBorrowDate: (e) => this.updateBorrowDraft("date", e.target.value),
        openBorrowForm: () => this.openBorrowForm(), cancelBorrowForm: () => this.cancelBorrowForm(), saveBorrow: () => this.saveBorrow(),
        showAddBorrowButton: !!(selectedBook && !selectedBook.borrowed && !s.showBorrowForm),
        markSelectedReturned: () => this.markReturned(s.selectedId),
        borrowedList: (() => {
          const fromBooks = s.books.filter(b => b.borrowed).map(b => ({
            id: b.id, title: b.title, author: b.author, cityName: CITY_NAME_ALL[b.city] || b.city,
            to: b.borrowed.to, date: b.borrowed.date,
            onTo: (e) => this.updateBorrowedRecord(b.id, "to", e.target.value), onDate: (e) => this.updateBorrowedRecord(b.id, "date", e.target.value),
            remove: () => this.markReturned(b.id), open: () => this.openDetail(b.id)
          }));
          const fromAlex = s.alexandria.filter(a => a.borrowed).map(a => ({
            id: "alex:" + a.num, title: a.title, author: a.author, cityName: "Alexandria",
            to: a.borrowed.to, date: a.borrowed.date,
            onTo: (e) => this.updateBorrowedRecord("alex:" + a.num, "to", e.target.value), onDate: (e) => this.updateBorrowedRecord("alex:" + a.num, "date", e.target.value),
            remove: () => this.markReturned("alex:" + a.num), open: () => this.openDetail("alex:" + a.num)
          }));
          return fromBooks.concat(fromAlex);
        })(),
        hasBorrowedItems: s.books.some(b => b.borrowed) || s.alexandria.some(a => a.borrowed),
        noBorrowedItems: !(s.books.some(b => b.borrowed) || s.alexandria.some(a => a.borrowed)),
        wishlist: s.wishlist.map(w => ({ ...w, toggle: () => this.toggleWishlistDone(w.id), remove: () => this.removeWishlistItem(w.id), textStyle: w.done ? "text-decoration: line-through; color: var(--color-neutral-700);" : "" })),
        newWishlistText: s.newWishlistText, onNewWishlistText: (e) => this.setState({ newWishlistText: e.target.value }),
        addWishlistItem: () => this.addWishlistItem(),
        selectedBook, hasCrossRefs: crossRefs.length > 0, crossRefs,
        closeDialog: () => this.closeDialog(), stopClick: (e) => e.stopPropagation(),
        editMode: s.editMode, notEditMode: !s.editMode, editDraft: s.editDraft, editHandlers,
        editThreadChoices: mkChoices(ALL_THREADS, s.editDraft, "threads", (f, v) => this.toggleEditArr(f, v)),
        editModeChoices: mkChoices(MODES, s.editDraft, "mode", (f, v) => this.toggleEditArr(f, v)),
        addAuthorMatches: addAuthorMatches.map(a => ({ name: a, select: () => this.selectAuthor("add", a) })),
        hasAddAuthorMatches: addAuthorMatches.length > 0,
        editAuthorMatches: editAuthorMatches.map(a => ({ name: a, select: () => this.selectAuthor("edit", a) })),
        hasEditAuthorMatches: editAuthorMatches.length > 0,
        onAddAuthorFocus: () => this.setAuthorOpen("add", true),
        onAddAuthorBlur: () => setTimeout(() => this.setAuthorOpen("add", false), 150),
        onEditAuthorFocus: () => this.setAuthorOpen("edit", true),
        onEditAuthorBlur: () => setTimeout(() => this.setAuthorOpen("edit", false), 150),
        editThreadInput: s.editThreadInput, onEditThreadInput: (e) => this.setState({ editThreadInput: e.target.value }),
        addEditThread: () => this.addCustomThread("edit"),
        editLangInput: s.editLangInput, onEditLangInput: (e) => this.setState({ editLangInput: e.target.value }),
        addEditLang: () => this.addCustomLang("edit"),
        startEdit: () => this.startEdit(), cancelEdit: () => this.cancelEdit(), saveEdit: () => this.saveEdit(),
        showAddForm: s.showAddForm, addDraft: s.addDraft, addHandlers,
        addThreadChoices: mkChoices(ALL_THREADS, s.addDraft, "threads", (f, v) => this.toggleAddArr(f, v)),
        addModeChoices: mkChoices(MODES, s.addDraft, "mode", (f, v) => this.toggleAddArr(f, v)),
        addThreadInput: s.addThreadInput, onAddThreadInput: (e) => this.setState({ addThreadInput: e.target.value }),
        addNewThread: () => this.addCustomThread("add"),
        addLangInput: s.addLangInput, onAddLangInput: (e) => this.setState({ addLangInput: e.target.value }),
        addNewLang: () => this.addCustomLang("add"),
        openAddForm: () => this.openAddForm(), cancelAdd: () => this.cancelAdd(), saveAdd: () => this.saveAdd(),
        exportMarkdown: () => this.exportMarkdown(),
        backupToFiles: () => this.exportBackup(), restoreFromBackup: () => this.triggerRestore(),
        backupToast: s.backupToast, catalogueFromLabel: s.lastBackupAt ? "Catalogue from " + new Date(s.lastBackupAt).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" }) : "",
        showRestoreConfirm: s.showRestoreConfirm, restoreExportedAtLabel: s.restoreData ? new Date(s.restoreData.exportedAt).toLocaleString() : "",
        restoreContentsLabel: s.restoreParsed ? B.backup.describe(s.restoreParsed) : "",
        cancelRestore: () => this.cancelRestore(), confirmRestore: () => this.confirmRestore(),
        showAddShelfForm: s.showAddShelfForm, addShelfName: s.addShelfName, addShelfBlurb: s.addShelfBlurb,
        onAddShelfName: (e) => this.setState({ addShelfName: e.target.value }),
        onAddShelfBlurb: (e) => this.setState({ addShelfBlurb: e.target.value }),
        openAddShelfForm: () => this.openAddShelfForm(), cancelAddShelf: () => this.cancelAddShelf(), saveAddShelf: () => this.saveAddShelf(),
        deleteBook: () => selectedBookRaw && this.deleteBook(selectedBookRaw.id),
        quotesList, hasQuotes: quotesList.length > 0,
        openQuoteFormNew: () => this.openQuoteForm(),
        openQuoteFromBook: () => selectedBookRaw && this.openQuoteForm(selectedBookRaw),
        showQuoteForm: s.showQuoteForm, quoteDraft: s.quoteDraft, quoteIsEdit: !!(s.quoteDraft && s.quoteDraft.id),
        quoteBookQuery: s.quoteBookQuery, onQuoteBookQuery: (e) => this.onQuoteBookQuery(e.target.value),
        onQuoteBookFocus: () => this.setState({ quoteBookOpen: true }),
        onQuoteBookBlur: () => setTimeout(() => this.setState({ quoteBookOpen: false }), 150),
        quoteBookMatches, hasQuoteBookMatches: quoteBookMatches.length > 0,
        onQuoteQuote: (e) => this.updateQuoteField("quote", e.target.value),
        onQuotePage: (e) => this.updateQuoteField("page", e.target.value),
        onQuoteNote: (e) => this.updateQuoteField("note", e.target.value),
        quoteThemeChoices, quoteThemeInput: s.quoteThemeInput,
        onQuoteThemeInput: (e) => this.setState({ quoteThemeInput: e.target.value }),
        addQuoteTheme: () => this.addQuoteTheme(),
        quoteThemeFilter: s.quoteThemeFilter, quoteThemeFilterOptions, quoteThemeFilterLabel,
        themeFilterOpen: s.themeFilterOpen,
        toggleThemeFilterOpen: () => this.setState(st => ({ themeFilterOpen: !st.themeFilterOpen })),
        onThemeFilterBlur: () => setTimeout(() => this.setState({ themeFilterOpen: false }), 150),
        cancelQuoteForm: () => this.cancelQuoteForm(), saveQuote: () => this.saveQuote(), deleteQuote: () => this.deleteQuote(),
        quoteError: s.quoteError,
        showPeriodManager: s.showPeriodManager, togglePeriodManager: () => this.togglePeriodManager(),
        periodManageRows, newPeriodText: s.newPeriodText,
        onNewPeriodText: (e) => this.setState({ newPeriodText: e.target.value }), addPeriod: () => this.addPeriod(),
        showRemoveShelfForm: s.showRemoveShelfForm,
        openRemoveShelfForm: () => this.openRemoveShelfForm(), cancelRemoveShelf: () => this.cancelRemoveShelf(), removeShelf: () => this.removeShelf(),
        removeShelfId: s.removeShelfId, onRemoveShelfId: (e) => this.setState({ removeShelfId: e.target.value }),
        removeShelfOptions: [{ value: "", label: "Choose a shelf…" }, ...ALL_CITIES.map(c => ({ value: c.id, label: c.name + " (" + s.books.filter(b => b.city === c.id).length + ")" }))],
        removeShelfCount: s.removeShelfId ? s.books.filter(b => b.city === s.removeShelfId).length : 0,
        removeShelfSelected: !!s.removeShelfId,
        canRemoveShelf: !!s.removeShelfId && s.books.filter(b => b.city === s.removeShelfId).length === 0,
        removeShelfDisabled: !(!!s.removeShelfId && s.books.filter(b => b.city === s.removeShelfId).length === 0),
        showRemoveShelfWarning: !!s.removeShelfId && s.books.filter(b => b.city === s.removeShelfId).length > 0
      };
    }

    render() {
      const brand = B.ui.html`<${B.ui.Brand} title="Library" modules=${this.props.modules} active=${this.props.active} go=${this.props.go} />`;
      return B.library.view({ ...this.renderVals(), brand });
    }
  }

  B.library = B.library || {};
  B.library.Component = Library;
  B.library.places = PLACE_LIST;   // built-in historical places (the atlas reuses them)
  B.registerModule({ id: "library", name: "Library", blurb: "Shelves, map, quotes, wishlist", order: 10, Component: Library });
})();
