// The shell: knows which modules exist, which one is open (from the URL hash, e.g. #library),
// and mounts it. Each module registers itself:
//
//   B.registerModule({ id: "journal", name: "Journal", order: 20, Component: JournalComponent });
//
// Every module component receives the props { modules, active, go } so it can draw the module
// switcher in its own header. While only the Library exists, the page looks exactly as before.
window.B = window.B || {};
(function () {
  const { React, html } = B.ui;
  const registry = [];
  B.registerModule = (m) => { registry.push(m); registry.sort((a, b) => (a.order || 0) - (b.order || 0)); };

  const current = () => {
    const id = (location.hash || "").replace(/^#\/?/, "").split("/")[0];
    return registry.find((m) => m.id === id) || registry[0];
  };

  class Shell extends React.Component {
    constructor(props) {
      super(props);
      this.state = { active: current().id };
      this.onHash = () => this.setState({ active: current().id });
      this.go = (id) => { location.hash = "#" + id; };
    }
    componentDidMount() { window.addEventListener("hashchange", this.onHash); }
    componentWillUnmount() { window.removeEventListener("hashchange", this.onHash); }
    render() {
      const mod = registry.find((m) => m.id === this.state.active) || registry[0];
      return html`<div className="host"><${mod.Component} key=${mod.id} modules=${registry} active=${mod.id} go=${this.go} /></div>`;
    }
  }

  B.start = async function () {
    await B.store.load();
    B.requestPersistence();
    ReactDOM.createRoot(document.getElementById("app")).render(html`<${Shell} />`);
  };
})();
