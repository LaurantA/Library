// Library view — the markup of the Library module.
// Generated once from the original Claude Design template, then maintained by hand.
// `v` is the object returned by Library.renderVals(); every binding reads from it.
(function () {
  const { html, S, H, Fragment } = B.ui;
  B.library = B.library || {};
  B.library.view = function (v) {
    return html`
    <div data-theme=${v.theme} style=${S("min-height:100vh;background:var(--color-bg);color:var(--color-text);font-family:var(--font-body);padding-bottom:var(--space-9);")}>
      <div className="nav" style=${S("position: sticky; top: 0; z-index: 20; display: block; background-color: var(--color-bg)")}>
        <div style=${S("display:flex;flex-direction:column;gap:var(--space-3);width:100%;")}>
          <div style=${S("display:flex;align-items:baseline;justify-content:space-between;gap:var(--space-3);width:100%;")}>
            <div style=${S("display:flex;align-items:baseline;gap:var(--space-3);")}>
              ${v.brand}
              ${v.catalogueFromLabel ? html`
                <div style=${S("font-size:12px;color:var(--color-neutral-700);")}>${v.catalogueFromLabel}</div>
              ` : null}
            </div>
            <div style=${S("display:flex;align-items:center;gap:var(--space-2);flex-shrink:0;")}>
              <button onClick=${v.toggleTheme} title=${v.themeLabel} style=${S("width:52px;height:28px;border-radius:999px;border:1px solid var(--color-divider);background:var(--color-surface);position:relative;cursor:pointer;padding:0;flex-shrink:0;")}>
                <span style=${S(`position:absolute;top:2px;left:${v.themeKnobLeft ?? ""};width:22px;height:22px;border-radius:50%;background:${v.themeKnobColor ?? ""};transition:left 0.2s ease;`)}></span>
              </button>
              <div style=${S("position:relative;")}>
                <button className="btn btn-ghost" onClick=${v.toggleMenu} onBlur=${v.onMenuBlur} title="Catalogue tools" style=${S("font-size:18px;line-height:1;padding-left:10px;padding-right:10px;")}>⋮</button>
                ${v.menuOpen ? html`
                  <div style=${S("position:absolute;top:100%;right:0;z-index:40;min-width:230px;background:var(--color-bg);border:1px solid var(--color-divider);border-radius:var(--radius-sm);box-shadow:var(--shadow-md);padding:var(--space-2) 0;")}>
                    <div style=${S("padding:var(--space-1) var(--space-3);font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:var(--color-neutral-700);")}>Organise</div>
                    <div className=${H("hover", "background: var(--color-accent-100);")} style=${S("padding:var(--space-2) var(--space-3);cursor:pointer;font-size:14px;")} onClick=${v.openPeriodManager}>Manage periods</div>
                    <div className=${H("hover", "background: var(--color-accent-100);")} style=${S("padding:var(--space-2) var(--space-3);cursor:pointer;font-size:14px;")} onClick=${v.openThreadManager}>Manage threads</div>
                    <div className=${H("hover", "background: var(--color-accent-100);")} style=${S("padding:var(--space-2) var(--space-3);cursor:pointer;font-size:14px;")} onClick=${v.openShelfManager}>Manage shelves</div>
                    <div className=${H("hover", "background: var(--color-accent-100);")} style=${S("padding:var(--space-2) var(--space-3);cursor:pointer;font-size:14px;")} onClick=${v.openPlaceManager}>Manage locations</div>
                    <div className="hr" style=${S("margin:var(--space-2) 0;")}></div>
                    <div style=${S("padding:var(--space-1) var(--space-3);font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:var(--color-neutral-700);")}>Catalogue file</div>
                    <div className=${H("hover", "background: var(--color-accent-100);")} style=${S("padding:var(--space-2) var(--space-3);cursor:pointer;font-size:14px;")} onClick=${v.backupToFiles}>Backup to Files</div>
                    <div className=${H("hover", "background: var(--color-accent-100);")} style=${S("padding:var(--space-2) var(--space-3);cursor:pointer;font-size:14px;")} onClick=${v.restoreFromBackup}>Restore from backup</div>
                    <div className=${H("hover", "background: var(--color-accent-100);")} style=${S("padding:var(--space-2) var(--space-3);cursor:pointer;font-size:14px;")} onClick=${v.exportMarkdown}>Export .md</div>
                  </div>
                ` : null}
              </div>
            </div>
          </div>
          <div style=${S("display:flex;align-items:center;gap:var(--space-2);flex-wrap:wrap;")}>
            ${v.isShelves ? html`
              <button className="btn btn-ghost" onClick=${v.setView.shelves} style=${S("border-radius:0;border-bottom:2px solid var(--color-accent);color:var(--color-accent-700);")}>Shelves</button>
            ` : null}
            ${v.notShelves ? html`
              <button className="btn btn-ghost" onClick=${v.setView.shelves} style=${S("border-radius:0;border-bottom:2px solid transparent;")}>Shelves</button>
            ` : null}
            ${v.isMap ? html`
              <button className="btn btn-ghost" onClick=${v.setView.map} style=${S("border-radius:0;border-bottom:2px solid var(--color-accent);color:var(--color-accent-700);")}>Map</button>
            ` : null}
            ${v.notMap ? html`
              <button className="btn btn-ghost" onClick=${v.setView.map} style=${S("border-radius:0;border-bottom:2px solid transparent;")}>Map</button>
            ` : null}
            ${v.isQuotes ? html`
              <button className="btn btn-ghost" onClick=${v.setView.quotes} style=${S("border-radius:0;border-bottom:2px solid var(--color-accent);color:var(--color-accent-700);")}>Quotes</button>
            ` : null}
            ${v.notQuotes ? html`
              <button className="btn btn-ghost" onClick=${v.setView.quotes} style=${S("border-radius:0;border-bottom:2px solid transparent;")}>Quotes</button>
            ` : null}
            ${v.isWishlist ? html`
              <button className="btn btn-ghost" onClick=${v.setView.wishlist} style=${S("border-radius:0;border-bottom:2px solid var(--color-accent);color:var(--color-accent-700);")}>Wishlist</button>
            ` : null}
            ${v.notWishlist ? html`
              <button className="btn btn-ghost" onClick=${v.setView.wishlist} style=${S("border-radius:0;border-bottom:2px solid transparent;")}>Wishlist</button>
            ` : null}
            <div style=${S("display:flex;align-items:center;gap:var(--space-2);margin-left:auto;flex-wrap:wrap;")}>
              ${v.borrowedFilterOn ? html`
                <button className="btn btn-ghost" onClick=${v.toggleBorrowedFilter} title="Showing only what is out on loan" style=${S("border:1px solid var(--color-accent);color:var(--color-accent-700);white-space:nowrap;")}>↗${" "}<span>${v.borrowedCount}</span>${" "}out</button>
              ` : null}
              ${v.borrowedChipIdle ? html`
                <button className="btn btn-ghost" onClick=${v.toggleBorrowedFilter} title="Show only what is out on loan" style=${S("border:1px solid var(--color-divider);white-space:nowrap;")}>↗${" "}<span>${v.borrowedCount}</span>${" "}out</button>
              ` : null}
              <input className="input" type="text" placeholder="Search author, title, note…" value=${v.search ?? ""} onChange=${v.onSearch} style=${S("width:220px;")} />
              <div style=${S("position:relative;display:flex;")}>
                <button className="btn btn-primary" onClick=${v.openAddForm} style=${S("border-top-right-radius:0;border-bottom-right-radius:0;")}>+ Add book</button>
                ${" "}
                <button className="btn btn-primary" onClick=${v.toggleAddMenu} onBlur=${v.onAddMenuBlur} title="More ways to add" style=${S("border-top-left-radius:0;border-bottom-left-radius:0;margin-left:1px;padding-left:10px;padding-right:10px;")}>▾</button>
                ${v.addMenuOpen ? html`
                  <div style=${S("position:absolute;top:100%;right:0;z-index:40;min-width:180px;background:var(--color-bg);border:1px solid var(--color-divider);border-radius:var(--radius-sm);box-shadow:var(--shadow-md);padding:var(--space-2) 0;")}>
                    <div className=${H("hover", "background: var(--color-accent-100);")} style=${S("padding:var(--space-2) var(--space-3);cursor:pointer;font-size:14px;")} onClick=${v.openAddShelfForm}>Add shelf</div>
                    <div className=${H("hover", "background: var(--color-accent-100);")} style=${S("padding:var(--space-2) var(--space-3);cursor:pointer;font-size:14px;")} onClick=${v.openRemoveShelfForm}>Remove shelf</div>
                  </div>
                ` : null}
              </div>
            </div>
          </div>
        </div>
      </div>
      ${v.isShelves ? html`
        <${Fragment}>
          <div style=${S("display:flex;gap:var(--space-3);align-items:center;flex-wrap:wrap;padding:var(--space-4) var(--space-6);border-bottom:1px solid var(--color-divider);")}>
            <div style=${S("position:relative;width:170px;")}>
              <button className="btn btn-secondary" onClick=${v.toggleCityFilterOpen} onBlur=${v.onCityFilterBlur} style=${S("width:100%;justify-content:space-between;display:flex;")}>${v.cityFilterLabel}</button>
              ${v.cityFilterOpen ? html`
                <div style=${S("position:absolute;top:100%;left:0;right:0;z-index:10;background:var(--color-bg);border:1px solid var(--color-divider);border-radius:var(--radius-sm);box-shadow:var(--shadow-md);max-height:220px;overflow:auto;")}>
                  ${(v.cityOptions || []).map((opt, $index) => html`
                    <div key=${$index} className=${H("hover", "background: var(--color-accent-100);")} style=${S("padding:var(--space-2);cursor:pointer;")} onClick=${opt.select}>${opt.label}</div>
                  `)}
                </div>
              ` : null}
            </div>
            <div style=${S("position:relative;width:220px;")}>
              <button className="btn btn-secondary" onClick=${v.togglePeriodFilterOpen} onBlur=${v.onPeriodFilterBlur} style=${S("width:100%;justify-content:space-between;display:flex;")}>${v.periodFilterLabel}</button>
              ${v.periodFilterOpen ? html`
                <div style=${S("position:absolute;top:100%;left:0;right:0;z-index:10;background:var(--color-bg);border:1px solid var(--color-divider);border-radius:var(--radius-sm);box-shadow:var(--shadow-md);max-height:220px;overflow:auto;")}>
                  ${(v.periodOptions || []).map((opt, $index) => html`
                    <div key=${$index} className=${H("hover", "background: var(--color-accent-100);")} style=${S("padding:var(--space-2);cursor:pointer;")} onClick=${opt.select}>${opt.label}</div>
                  `)}
                </div>
              ` : null}
            </div>
            <div style=${S("position:relative;width:220px;")}>
              <button className="btn btn-secondary" onClick=${v.toggleThreadFilterOpen} onBlur=${v.onThreadFilterBlur} style=${S("width:100%;justify-content:space-between;display:flex;")}>${v.threadFilterLabel}</button>
              ${v.threadFilterOpen ? html`
                <div style=${S("position:absolute;top:100%;left:0;right:0;z-index:10;background:var(--color-bg);border:1px solid var(--color-divider);border-radius:var(--radius-sm);box-shadow:var(--shadow-md);max-height:220px;overflow:auto;")}>
                  ${(v.threadOptions || []).map((opt, $index) => html`
                    <div key=${$index} className=${H("hover", "background: var(--color-accent-100);")} style=${S("padding:var(--space-2);cursor:pointer;")} onClick=${opt.select}>${opt.label}</div>
                  `)}
                </div>
              ` : null}
            </div>
            <div style=${S("position:relative;width:190px;")}>
              <button className="btn btn-secondary" onClick=${v.togglePlaceFilterOpen} onBlur=${v.onPlaceFilterBlur} style=${S("width:100%;justify-content:space-between;display:flex;")}>${v.placeFilterLabel}</button>
              ${v.placeFilterOpen ? html`
                <div style=${S("position:absolute;top:100%;left:0;right:0;z-index:10;background:var(--color-bg);border:1px solid var(--color-divider);border-radius:var(--radius-sm);box-shadow:var(--shadow-md);max-height:220px;overflow:auto;")}>
                  ${(v.placeOptions || []).map((opt, $index) => html`
                    <div key=${$index} className=${H("hover", "background: var(--color-accent-100);")} style=${S("padding:var(--space-2);cursor:pointer;")} onClick=${opt.select}>${opt.label}</div>
                  `)}
                </div>
              ` : null}
            </div>
            ${v.hasActiveFilter ? html`
              <button className="btn btn-ghost" onClick=${v.clearFilters}>Clear filters</button>
            ` : null}
            <div style=${S("font-size:13px;color:var(--color-neutral-700);margin-left:auto;")}>${v.totalResults}${" "}of${" "}${v.totalBooks}${" "}entries ·${" "}${v.booksOwned}${" "}books owned</div>
          </div>
          ${(v.cityGroups || []).map((group, $index) => html`
            <${Fragment} key=${$index}>
              ${group.hasBooks ? html`
                <section style=${S("padding:var(--space-6);")}>
                  <h2 style=${S("font-family:var(--font-heading);font-weight:var(--font-heading-weight);font-size:32px;margin:0 0 var(--space-4) 0;")}>${group.city?.name}</h2>
                  <div style=${S("display:grid;grid-template-columns:repeat(auto-fill, minmax(260px, 1fr));gap:var(--space-4);")}>
                    ${(group.books || []).map((book, $index) => html`
                      <div key=${$index} className=${"card" + " " + H("hover", "box-shadow: var(--shadow-md);")} style=${S("cursor:pointer;position:relative;")} onClick=${book.open}>
                        ${book.showVolumes ? html`
                          <span style=${S("position:absolute;top:var(--space-2);right:var(--space-2);font-size:11px;color:var(--color-accent-700);")}>${book.volumesLabel}</span>
                        ` : null}
                        ${book.borrowed ? html`
                          <span title="Borrowed" style=${S("position:absolute;bottom:var(--space-2);right:var(--space-2);font-size:15px;color:var(--color-accent-700);")}>↗</span>
                        ` : null}
                        <div className="card-kicker" style=${S("padding-right:68px;")}>${book.periodLabel}</div>
                        <div className="card-title">${book.title}</div>
                        <div className="card-body">${book.author}</div>
                        <div style=${S("display:flex;gap:var(--space-1);flex-wrap:wrap;margin-top:var(--space-2);")}>
                          ${(book.threadTags || []).map((tg, $index) => html`
                            <span key=${$index} className="tag tag-outline">${tg}</span>
                          `)}
                        </div>
                      </div>
                    `)}
                  </div>
                </section>
              ` : null}
            <//>
          `)}
          ${v.showAlexandria ? html`
            <section style=${S("margin:var(--space-4) var(--space-6) 0 var(--space-6);padding:var(--space-5) var(--space-6);border:1px solid var(--color-divider);border-radius:var(--radius-md);background:var(--color-surface);")}>
              <div style=${S("display:flex;align-items:baseline;gap:var(--space-3);flex-wrap:wrap;")}>
                <h2 style=${S("font-family:var(--font-heading);font-weight:var(--font-heading-weight);font-size:26px;margin:0;")}>Alexandria</h2>
                <span style=${S("font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:var(--color-neutral-700);")}>Reference annex ·${" "}${v.alexandriaCount}</span>
                ${" "}
                <button className="btn btn-ghost" style=${S("margin-left:auto;")} onClick=${v.toggleAlexandria}>${v.alexandriaToggleLabel}</button>
              </div>
              <p style=${S("color:var(--color-neutral-700);margin:var(--space-1) 0 0 0;font-style:italic;max-width:70ch;")}>The gathered universal shelf — Penguin Little Black Classics. Not part of the authored library: held flat and unclassified.</p>
              ${v.alexandriaOpen ? html`
                <table className="table" style=${S("margin-top:var(--space-4);")}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Author</th>
                      <th>Title</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${(v.alexandriaList || []).map((it, $index) => html`
                      <tr key=${$index} className=${H("hover", "background: var(--color-accent-100);")} style=${S("cursor:pointer;")} onClick=${it.open}>
                        <td>${it.num}</td>
                        <td>${it.author}</td>
                        <td>
                          ${it.title}${" "}
                          ${it.borrowed ? html`
                            <span title="Borrowed">↗</span>
                          ` : null}
                        </td>
                      </tr>
                    `)}
                  </tbody>
                </table>
              ` : null}
            </section>
          ` : null}
          <div style=${S("display:flex;align-items:center;gap:var(--space-3);padding:var(--space-6) var(--space-6) 0 var(--space-6);")}>
            <h2 style=${S("font-family:var(--font-heading);font-weight:var(--font-heading-weight);font-size:26px;margin:0;")}>Collection overview</h2>
            <button className="btn btn-ghost" onClick=${v.toggleOverview}>${v.overviewToggleLabel}</button>
          </div>
          ${v.showOverview ? html`
            <div style=${S("padding:var(--space-6);display:grid;grid-template-columns:repeat(auto-fit, minmax(360px, 1fr));gap:var(--space-6);")}>
              <div>
                <h3 style=${S("font-family:var(--font-heading);font-size:22px;margin:0 0 var(--space-3) 0;")}>By city</h3>
                ${(v.statsByCity || []).map((row, $index) => html`
                  <div key=${$index} style=${S("margin-bottom:var(--space-2);")}>
                    <div style=${S("display:flex;justify-content:space-between;font-size:14px;")}>
                      <span>${row.label}</span>
                      <span>${row.count}</span>
                    </div>
                    <div style=${S("height:6px;background:var(--color-neutral-200);border-radius:var(--radius-sm);margin-top:2px;")}>
                      <div style=${S(`height:6px;width:${row.pct ?? ""};background:var(--color-accent);border-radius:var(--radius-sm);`)}></div>
                    </div>
                  </div>
                `)}
              </div>
              <div>
                <h3 style=${S("font-family:var(--font-heading);font-size:22px;margin:0 0 var(--space-3) 0;")}>By period</h3>
                ${(v.statsByPeriod || []).map((row, $index) => html`
                  <div key=${$index} style=${S("margin-bottom:var(--space-2);")}>
                    <div style=${S("display:flex;justify-content:space-between;font-size:14px;")}>
                      <span>${row.label}</span>
                      <span>${row.count}</span>
                    </div>
                    <div style=${S("height:6px;background:var(--color-neutral-200);border-radius:var(--radius-sm);margin-top:2px;")}>
                      <div style=${S(`height:6px;width:${row.pct ?? ""};background:var(--color-accent);border-radius:var(--radius-sm);`)}></div>
                    </div>
                  </div>
                `)}
              </div>
              <div>
                <h3 style=${S("font-family:var(--font-heading);font-size:22px;margin:0 0 var(--space-3) 0;")}>By thread</h3>
                ${(v.statsByThread || []).map((row, $index) => html`
                  <div key=${$index} style=${S("margin-bottom:var(--space-2);")}>
                    <div style=${S("display:flex;justify-content:space-between;font-size:14px;")}>
                      <span>${row.label}</span>
                      <span>${row.count}</span>
                    </div>
                    <div style=${S("height:6px;background:var(--color-neutral-200);border-radius:var(--radius-sm);margin-top:2px;")}>
                      <div style=${S(`height:6px;width:${row.pct ?? ""};background:var(--color-accent);border-radius:var(--radius-sm);`)}></div>
                    </div>
                  </div>
                `)}
              </div>
              ${v.hasStatsByBook ? html`
                <div>
                  <h3 style=${S("font-family:var(--font-heading);font-size:22px;margin:0 0 var(--space-3) 0;")}>Books with quotes</h3>
                  ${(v.statsByBook || []).map((row, $index) => html`
                    <div key=${$index} style=${S("margin-bottom:var(--space-2);")}>
                      <div style=${S("display:flex;justify-content:space-between;font-size:14px;")}>
                        <span>${row.label}</span>
                        <span>${row.count}</span>
                      </div>
                      <div style=${S("height:6px;background:var(--color-neutral-200);border-radius:var(--radius-sm);margin-top:2px;")}>
                        <div style=${S(`height:6px;width:${row.pct ?? ""};background:var(--color-accent);border-radius:var(--radius-sm);`)}></div>
                      </div>
                    </div>
                  `)}
                </div>
              ` : null}
              <div>
                <h3 style=${S("font-family:var(--font-heading);font-size:22px;margin:0 0 var(--space-3) 0;")}>By language</h3>
                ${(v.statsByLang || []).map((row, $index) => html`
                  <div key=${$index} style=${S("margin-bottom:var(--space-2);")}>
                    <div style=${S("display:flex;justify-content:space-between;font-size:14px;")}>
                      <span>${row.label}</span>
                      <span>${row.count}</span>
                    </div>
                    <div style=${S("height:6px;background:var(--color-neutral-200);border-radius:var(--radius-sm);margin-top:2px;")}>
                      <div style=${S(`height:6px;width:${row.pct ?? ""};background:var(--color-accent);border-radius:var(--radius-sm);`)}></div>
                    </div>
                  </div>
                `)}
              </div>
            </div>
          ` : null}
        <//>
      ` : null}
      ${v.isMap ? html`
        <div style=${S("padding:var(--space-6);")}>
          <div style=${S("display:flex;align-items:baseline;gap:var(--space-3);flex-wrap:wrap;margin-bottom:var(--space-3);")}>
            <h2 style=${S("font-family:var(--font-heading);font-weight:var(--font-heading-weight);font-size:32px;margin:0;")}>Map</h2>
            <span style=${S("font-size:13px;color:var(--color-neutral-700);")}>${v.placedLabel}</span>
            ${" "}
            <span style=${S("font-size:13px;color:var(--color-neutral-700);margin-left:auto;")}>${v.unplacedLabel}</span>
          </div>
          <div ref=${v.mapFrameRef} style=${S("position:relative;width:min(100%, calc((100vh - 260px) * 500 / 492));aspect-ratio:500 / 492;margin:0 auto;border:1px solid var(--color-divider);border-radius:18px;overflow:hidden;")}>
            ${" "}${v.mapLand}${" "}
            <svg viewBox=${v.mapViewBox} preserveAspectRatio="xMidYMid meet" style=${S("position:absolute;inset:0;width:100%;height:100%;")}>
              ${v.isMapZoomed ? html`
                <path id="ETH_ALB" data-name="Albanian lands" fill="none" stroke="var(--color-accent)" strokeWidth="2.4" strokeDasharray="7 4" strokeLinejoin="round" strokeLinecap="butt" vectorEffect="non-scaling-stroke" pointerEvents="none" opacity="0.95" d="M288.185,367.595l-.07-.54.05-.41.23-.19.38-.14v-.94s.16-.39.17-.45.1-.34.1-.4-.08-.35-.09-.54,0-.35-.03-.49-.05-.24-.13-.4-.26-.53-.3-.63-.09-.31-.09-.31l.25-.38.09-.13s.06-.24,0-.3-.09-.14-.16-.16-.05,0,0-.09.23-.29.26-.36.14-.31.16-.37-.02-.17.04-.26.21-.17.29-.21.59-.17.63-.23.44-.49.42-.6.11-.41.17-.48l.52-.65.15-.84v-.6s.02-.07.08-.2.34-.5.34-.5l.74-.34s.25-.68.09-.94-.44-1.23-.52-1.2-.08-.47-.12-.84,0-1.57.17-1.71.7-.85.74-.97.37-.37.37-.61.46-.79.46-.79l-.17-.6s-.28-.33-.5-.77-.69-1.06-.69-1.06c0,0,.18-.25-.06-.44s.15-.32.14-.77.36-1.12.36-1.12l.33-.7s-.17-.2.04-.26.58-.8.54-.96,0-.69,0-.69-.04-.52,0-.78.09-.65,0-1.14-.21-.76-.33-1.47-.25-1.25-.41-1.62-.25-1.33-.25-1.66.04-.82.12-1.15.3-.67.2-.89-.58-1.38-.74-1.84-.12-1.15.04-1.4.54-.82.54-.82l-1.36-1.67-.06-.47-1.26-.33-1.69-.11-.49-.28-.23-.41-.13-.35-.28-.24-.33-.39s.07.01-.2-.03-.53-.37-.53-.37c0,0-.38-.28-.36-.31s-.24-.21-.24-.21c0,0-.07-.28-.19-.38s.02-.4-.24-.5-.43-.22-.43-.22c0,0-.33-.28-.35-.26s-.17-.3-.45-.41-.38-.24-.38-.24h-1.02l-.15-.27h-.4v.26l-.51.31-.49.33.29.15s-.32.11-.11.34.31.5.31.5l-.29.45s-.05.32-.41.36-.47.2-.47.2-.41,0-.41,0l-.08.21s.06-.07-.18.24.15.19,0,.63-.19.79-.37,1.03-.34.33-.34.33l-.6-.44-1.06-.28-.25-.3-.68.14-.97.68s-.27.03-.4.55-.04.76-.17,1.01-.87,1.19-1.07,1.4-.41.26-.62.36-.66.2-1.2.34-.89.25-.89.25l-1.46.81s-.31.06-.38,1.22.04,1.23-.08,1.94l-.12.72"></path>
              ` : null}
              ${(v.mapGhosts || []).map((g, $index) => html`
                <circle key=${$index} cx=${g.x} cy=${g.y} r="1.4" fill="var(--color-neutral-800)" opacity="0.55">
                  <title>${g.name}</title>
                </circle>
              `)}
              ${(v.mapDots || []).map((d, $index) => html`
                <circle key=${$index} cx=${d.x} cy=${d.y} r=${d.r} fill="var(--color-accent)" opacity="0.85" style=${S("cursor:pointer;")} onClick=${d.select}>
                  <title>${d.label}</title>
                </circle>
              `)}
              ${" "}${v.mapLabelEls}${" "}
            </svg>
            <button className=${H("hover", "border-color: var(--color-accent);")} onClick=${v.toggleMapZoom} title=${v.zoomTitle} style=${S(`position:absolute;top:10px;right:10px;width:34px;height:34px;padding:5px;display:flex;align-items:center;justify-content:center;border:1px solid var(--color-divider);border-radius:var(--radius-sm);background:var(--color-surface);color:${v.zoomIconColor ?? ""};cursor:pointer;box-shadow:0 1px 3px rgba(0,0,0,0.18);`)}>
              <svg viewBox="185 88 330 322" style=${S("width:100%;height:100%;display:block;")} aria-hidden="true">
                <path fill="currentColor" d="m300.094,97.2043c-4.8618-0.082-12.9308,1.54998-12.75,5.2812-13.5419-2.32092-14.952,3.27267-14.1562,8.25003,1.28844-1.97532,2.85723-3.04776,4.06251-3.24999,1.80576-0.2997,3.6954,0.2835,5.625,1.46871,1.92969,1.1853,4.05558,3.09798,5.00004,4.28121-4.77945,1.14264-8.4717,0.405-12.2188-0.2502-1.84716-0.3231-4.43205-1.36224-5.96871-2.43747-1.53666-1.07541-2.0205-2.08755-4.43754-4.56246-2.84967-2.91798-5.88258-2.09637-4.93749,2.43747,2.18556,4.21092,5.83659,6.08859,10.4375,6.84378,2.214,0.3636,5.51196,1.15263,9.25,1.15623,3.73806,0.004,7.93521-0.54,10.2188-0.0625-1.37187,0.8613-2.92428,2.34621-6.00003,2.93751-3.12777,0.6012-7.88301-1.85994-10.7812-2.53125,0.3681,2.43855,3.44403,4.71816,9.49999,5.90625,9.95152,2.16693,18.2208,3.81375,23.6875,6.78123,5.46669,2.96748,8.91342,6.68268,11.375,9.59375,4.89861,5.79312,5.15628,10.2402,5.46876,11.2187,1.00782,9.2557-2.21958,14.4622-8.21871,16.0625-2.99961,0.8001-8.32788-0.7065-10.2812-2.99997-1.95345-2.29293-3.85407-6.23421-3.31254-12.4062,0.5265-2.42127,3.29526-8.72811,0.93753-10.0312-10.8616-6.00326-24.0512-12.0744-33.5938-15.6873-2.60815-0.98745-4.75675,2.55735-5.59375,3.9375-16.2111-1.97418-30.827-12.9443-37.4062-24.625-4.48101-7.95555-11.8665,0.0164-10.625,7.5312,2.0043,8.38764,8.39502,14.4519,16.0625,18.75,7.86951,4.33314,17.7059,8.59698,27.6562,8.37504,5.36067,1.01412,5.30775,7.94943-1.125,9.24999-12.5809,0.0796-22.6175-0.234-32.0938-9.375-7.18776-6.5628-11.2342,1.25694-9.15624,5.68746,3.52134,13.6583,23.0063,17.483,42.7187,13.0625,7.63344-1.26414,3.06252,6.91542,0.90621,7.00002-8.23662,5.90562-22.9827,11.6841-35.9688-0.0625-5.94243-4.55022-9.96016-0.7254-7.74999,5.84379,5.76216,17.1274,27.8037,13.5302,42.9375,5.09373,3.89529-2.17143,7.43049,2.88045,2.68749,6.71877-18.8201,13.1503-28.2298,13.2999-36.7187,8.24998-10.6275-4.1913-11.5623,7.59637-5.25,11.4688,7.01595,4.30398,24.8701,1.07703,37.9688-7.15626,5.61537-4.17483,5.86944,2.35305,2.31246,4.93749-15.5442,13.4334-21.671,16.971-37.875,14.7812-8.03511-0.6264-7.91442,9.2799-1.59372,13.1562,8.62983,5.29245,25.4827-3.49245,38.5625-14.3438,5.50521-2.94165,6.40935,1.88271,3.68748,7.59375-7.99209,10.0832-15.4932,16.0281-22.7187,18.7812-7.22556,2.75319-14.1755,2.31453-19.0938,0.6246-6.00021-2.06145-6.75261,4.17429-3.43746,9.84375,1.99836,3.41748,10.2797,4.51332,19.2187,1.34379,8.93907-3.16908,18.5358-10.6026,25.125-19.3125,5.73291-5.01894,5.01993,1.72368,2.40624,6.46875-13.1944,20.8587-25.262,28.5963-41.1562,27.2812-7.04754-1.19673-8.6481,4.28364-4.1562,9.34375,7.88742,6.54111,17.7493,6.336,26.375-0.1251,7.66818-7.39323,22.3379-23.3134,30.0312-31.8438,5.42133-4.32189,7.1532-0.0612,5.56254,8.71875-1.44666,5.02803-5.06826,10.3234-14.9375,14.1875-6.74226,3.84804-1.67904,9.15142,3.375,9.25,2.78136,0.0542,8.42922-3.19716,12.75-8.06247,5.68422-6.40053,6.02226-10.6976,9.15625-20.6562,2.96091-4.85442,8.24949-2.58858,8.25003,2.50002-2.53647,9.97519-4.71582,11.7638-9.84375,15.8438-4.90482,4.60494,3.41523,6.13962,6.21873,4.24998,8.11044-5.46678,11.0713-12.5383,13.7812-18.9688,1.95606-4.64166,7.63038-2.39148,5.00004,5.18751-6.28605,18.1128-16.6152,25.2447-34.6875,28.9062-1.83159,0.3258-2.94876,1.40661-2.31246,3.53124,2.42559,2.51811,4.85559,4.80303,7.28127,7.3125-11.1751,3.25377-20.2541,5.08171-31.4377,8.34421-5.48685-3.59721-9.9194-6.64909-15.4062-10.25-1.44684-3.38229-2.12149-8.54505-10.2188-4.90626-5.48685-2.53413-8.01783-1.60488-11.0625,0.93753,4.39542,0.1638,6.30783,1.34091,8.03124,3.34377,2.25009,5.92614,7.43877,6.49863,12.75,4.81248,3.45528,2.91078,5.29542,5.1435,8.74998,8.06247-6.44922-0.2205-10.9422-0.3348-17.375-0.531-6.1407-6.5934-11.042-6.23223-15.4375-1.06245-3.35007,0.5148-4.77018,0.5868-7.06248,4.65624,3.60513-1.4796,5.87322-1.92312,7.43751-0.3123,6.52869,3.78495,10.7938,2.94012,14.0313,0,6.29874,0.3852,11.9746,0.711,18.2812,1.125-2.3166,1.96911-5.49585,3.01365-7.81254,5.00004-9.4603-2.70648-14.3979,0.93663-16.0625,8.65629-1.26783,3.11571-1.86147,6.32349-1.31247,9.65626,0.91566-3.04839,2.38788-5.66937,5.09373-7.3125,8.43201,2.14182,11.6026-1.3005,12.0625-6.34374,4.06449-3.31632,10.1935-4.04766,14.25-7.40628,4.743,1.51839,7.03575,2.45889,11.8125,3.96873,1.6983,5.16078,5.5413,7.20423,11.7812,5.87502,7.42797,0.2331,6.11667,3.28095,6.71877,5.71878,1.97406-3.50109,1.91907-6.90588-2.65626-10-1.66464-4.52241-5.35275-6.57918-10.1875-3.96873-4.55094-1.29204-5.7474-3.1491-10.2812-4.43754,11.4681-3.65526,19.603-4.47777,31.0625-8.12502,2.86848,2.70585,5.14188,4.64841,8.03124,7.06248,1.5228,0.90891,2.98053,1.13787,3.87504,0,7.18083-10.3932,10.3879-19.5528,17.0625-26.4062,2.54997-2.83554,5.77161-6.66135,9.34375-7.59375,1.78605-0.4662,3.97638-0.1818,5.37498,1.34379,1.3986,1.52541,2.49723,4.33683,2.0313,8.53128-0.6687,6.02082-2.12337,7.9218-3.81249,11.5312-1.68912,3.60954-3.75336,5.82975-5.87502,8.59374-4.24341,5.52789-9.8424,8.74539-13.1562,10.9062-6.62769,4.3218-9.43073,2.43027-14.5625,2.15622-6.63273,0.7443-8.39754,3.97467-2.96874,8.4375,5.07492,2.64051,9.63652,2.96649,13.3438,2.28123,3.18312-0.5886,6.90831-4.6971,9.5625-6.90624,2.98764-3.4515,7.94097,0.6417,4.56246,4.65624-6.13935,7.29477-12.2738,12.1044-19.8438,12-7.95465,1.07055-6.46668,5.54004-1.18746,7.71876,9.50117,3.92121,18.0796-3.42351,22.4375-8.25003,3.36222-3.67839,5.75028-3.82185,5.15628,1.87497-3.33783,10.3136-7.89912,14.2977-15.3438,14.8125-6.03855-0.5607-6.1038,4.10058-1.6875,7.25004,10.0603,6.96321,17.3459-4.89474,20.75-12.0625,2.42568-6.46569,6.14619-3.39093,6.5313,1.93752,0.0502,7.11936-3.16674,12.9321-11.7812,20.2187,6.59115,10.5015,14.2752,21.1829,20.8749,31.7188l20.005-222.806-20-35.202c-2.08305-1.92312-9.12777-10.223-10.9686-11.375-0.6714-0.7173-1.07973-1.22409-0.0936-1.59372,0.95364-0.3573,3.18591-0.7578,4.68747-1.03122-4.2417-4.2489-7.87662-5.61159-15.9065-7.93728,1.95687-0.8334,3.86037-0.3483,9.625-0.6246-2.2886-3.24868-7.40028-8.22482-14-10.6254,4.35852-3.09852,5.20785-3.30617,9.53126-6.93749-7.48656-0.531-13.8798-1.95712-20.3125-3.90625-4.06692-1.90161-9.71539-3.51615-12.4687-3.56251zm0.7191,8.71875c3.95622,0,6.40629,1.35612,6.40629,2.99997,0,1.67238-2.45007,3.03129-6.40629,3.03129-3.93975,0-6.43752-1.48293-6.43752-3.15621,0.00071-1.64385,2.49777-2.87505,6.43752-2.87505z"></path>
                <path fill="currentColor" transform="matrix(-1,0,0,1,700,0)" d="m300.094,97.2043c-4.8618-0.082-12.9308,1.54998-12.75,5.2812-13.5419-2.32092-14.952,3.27267-14.1562,8.25003,1.28844-1.97532,2.85723-3.04776,4.06251-3.24999,1.80576-0.2997,3.6954,0.2835,5.625,1.46871,1.92969,1.1853,4.05558,3.09798,5.00004,4.28121-4.77945,1.14264-8.4717,0.405-12.2188-0.2502-1.84716-0.3231-4.43205-1.36224-5.96871-2.43747-1.53666-1.07541-2.0205-2.08755-4.43754-4.56246-2.84967-2.91798-5.88258-2.09637-4.93749,2.43747,2.18556,4.21092,5.83659,6.08859,10.4375,6.84378,2.214,0.3636,5.51196,1.15263,9.25,1.15623,3.73806,0.004,7.93521-0.54,10.2188-0.0625-1.37187,0.8613-2.92428,2.34621-6.00003,2.93751-3.12777,0.6012-7.88301-1.85994-10.7812-2.53125,0.3681,2.43855,3.44403,4.71816,9.49999,5.90625,9.95152,2.16693,18.2208,3.81375,23.6875,6.78123,5.46669,2.96748,8.91342,6.68268,11.375,9.59375,4.89861,5.79312,5.15628,10.2402,5.46876,11.2187,1.00782,9.2557-2.21958,14.4622-8.21871,16.0625-2.99961,0.8001-8.32788-0.7065-10.2812-2.99997-1.95345-2.29293-3.85407-6.23421-3.31254-12.4062,0.5265-2.42127,3.29526-8.72811,0.93753-10.0312-10.8616-6.00326-24.0512-12.0744-33.5938-15.6873-2.60815-0.98745-4.75675,2.55735-5.59375,3.9375-16.2111-1.97418-30.827-12.9443-37.4062-24.625-4.48101-7.95555-11.8665,0.0164-10.625,7.5312,2.0043,8.38764,8.39502,14.4519,16.0625,18.75,7.86951,4.33314,17.7059,8.59698,27.6562,8.37504,5.36067,1.01412,5.30775,7.94943-1.125,9.24999-12.5809,0.0796-22.6175-0.234-32.0938-9.375-7.18776-6.5628-11.2342,1.25694-9.15624,5.68746,3.52134,13.6583,23.0063,17.483,42.7187,13.0625,7.63344-1.26414,3.06252,6.91542,0.90621,7.00002-8.23662,5.90562-22.9827,11.6841-35.9688-0.0625-5.94243-4.55022-9.96016-0.7254-7.74999,5.84379,5.76216,17.1274,27.8037,13.5302,42.9375,5.09373,3.89529-2.17143,7.43049,2.88045,2.68749,6.71877-18.8201,13.1503-28.2298,13.2999-36.7187,8.24998-10.6275-4.1913-11.5623,7.59637-5.25,11.4688,7.01595,4.30398,24.8701,1.07703,37.9688-7.15626,5.61537-4.17483,5.86944,2.35305,2.31246,4.93749-15.5442,13.4334-21.671,16.971-37.875,14.7812-8.03511-0.6264-7.91442,9.2799-1.59372,13.1562,8.62983,5.29245,25.4827-3.49245,38.5625-14.3438,5.50521-2.94165,6.40935,1.88271,3.68748,7.59375-7.99209,10.0832-15.4932,16.0281-22.7187,18.7812-7.22556,2.75319-14.1755,2.31453-19.0938,0.6246-6.00021-2.06145-6.75261,4.17429-3.43746,9.84375,1.99836,3.41748,10.2797,4.51332,19.2187,1.34379,8.93907-3.16908,18.5358-10.6026,25.125-19.3125,5.73291-5.01894,5.01993,1.72368,2.40624,6.46875-13.1944,20.8587-25.262,28.5963-41.1562,27.2812-7.04754-1.19673-8.6481,4.28364-4.1562,9.34375,7.88742,6.54111,17.7493,6.336,26.375-0.1251,7.66818-7.39323,22.3379-23.3134,30.0312-31.8438,5.42133-4.32189,7.1532-0.0612,5.56254,8.71875-1.44666,5.02803-5.06826,10.3234-14.9375,14.1875-6.74226,3.84804-1.67904,9.15142,3.375,9.25,2.78136,0.0542,8.42922-3.19716,12.75-8.06247,5.68422-6.40053,6.02226-10.6976,9.15625-20.6562,2.96091-4.85442,8.24949-2.58858,8.25003,2.50002-2.53647,9.97519-4.71582,11.7638-9.84375,15.8438-4.90482,4.60494,3.41523,6.13962,6.21873,4.24998,8.11044-5.46678,11.0713-12.5383,13.7812-18.9688,1.95606-4.64166,7.63038-2.39148,5.00004,5.18751-6.28605,18.1128-16.6152,25.2447-34.6875,28.9062-1.83159,0.3258-2.94876,1.40661-2.31246,3.53124,2.42559,2.51811,4.85559,4.80303,7.28127,7.3125-11.1751,3.25377-20.2541,5.08171-31.4377,8.34421-5.48685-3.59721-9.9194-6.64909-15.4062-10.25-1.44684-3.38229-2.12149-8.54505-10.2188-4.90626-5.48685-2.53413-8.01783-1.60488-11.0625,0.93753,4.39542,0.1638,6.30783,1.34091,8.03124,3.34377,2.25009,5.92614,7.43877,6.49863,12.75,4.81248,3.45528,2.91078,5.29542,5.1435,8.74998,8.06247-6.44922-0.2205-10.9422-0.3348-17.375-0.531-6.1407-6.5934-11.042-6.23223-15.4375-1.06245-3.35007,0.5148-4.77018,0.5868-7.06248,4.65624,3.60513-1.4796,5.87322-1.92312,7.43751-0.3123,6.52869,3.78495,10.7938,2.94012,14.0313,0,6.29874,0.3852,11.9746,0.711,18.2812,1.125-2.3166,1.96911-5.49585,3.01365-7.81254,5.00004-9.4603-2.70648-14.3979,0.93663-16.0625,8.65629-1.26783,3.11571-1.86147,6.32349-1.31247,9.65626,0.91566-3.04839,2.38788-5.66937,5.09373-7.3125,8.43201,2.14182,11.6026-1.3005,12.0625-6.34374,4.06449-3.31632,10.1935-4.04766,14.25-7.40628,4.743,1.51839,7.03575,2.45889,11.8125,3.96873,1.6983,5.16078,5.5413,7.20423,11.7812,5.87502,7.42797,0.2331,6.11667,3.28095,6.71877,5.71878,1.97406-3.50109,1.91907-6.90588-2.65626-10-1.66464-4.52241-5.35275-6.57918-10.1875-3.96873-4.55094-1.29204-5.7474-3.1491-10.2812-4.43754,11.4681-3.65526,19.603-4.47777,31.0625-8.12502,2.86848,2.70585,5.14188,4.64841,8.03124,7.06248,1.5228,0.90891,2.98053,1.13787,3.87504,0,7.18083-10.3932,10.3879-19.5528,17.0625-26.4062,2.54997-2.83554,5.77161-6.66135,9.34375-7.59375,1.78605-0.4662,3.97638-0.1818,5.37498,1.34379,1.3986,1.52541,2.49723,4.33683,2.0313,8.53128-0.6687,6.02082-2.12337,7.9218-3.81249,11.5312-1.68912,3.60954-3.75336,5.82975-5.87502,8.59374-4.24341,5.52789-9.8424,8.74539-13.1562,10.9062-6.62769,4.3218-9.43073,2.43027-14.5625,2.15622-6.63273,0.7443-8.39754,3.97467-2.96874,8.4375,5.07492,2.64051,9.63652,2.96649,13.3438,2.28123,3.18312-0.5886,6.90831-4.6971,9.5625-6.90624,2.98764-3.4515,7.94097,0.6417,4.56246,4.65624-6.13935,7.29477-12.2738,12.1044-19.8438,12-7.95465,1.07055-6.46668,5.54004-1.18746,7.71876,9.50117,3.92121,18.0796-3.42351,22.4375-8.25003,3.36222-3.67839,5.75028-3.82185,5.15628,1.87497-3.33783,10.3136-7.89912,14.2977-15.3438,14.8125-6.03855-0.5607-6.1038,4.10058-1.6875,7.25004,10.0603,6.96321,17.3459-4.89474,20.75-12.0625,2.42568-6.46569,6.14619-3.39093,6.5313,1.93752,0.0502,7.11936-3.16674,12.9321-11.7812,20.2187,6.59115,10.5015,14.2752,21.1829,20.8749,31.7188l20.005-222.806-20-35.202c-2.08305-1.92312-9.12777-10.223-10.9686-11.375-0.6714-0.7173-1.07973-1.22409-0.0936-1.59372,0.95364-0.3573,3.18591-0.7578,4.68747-1.03122-4.2417-4.2489-7.87662-5.61159-15.9065-7.93728,1.95687-0.8334,3.86037-0.3483,9.625-0.6246-2.2886-3.24868-7.40028-8.22482-14-10.6254,4.35852-3.09852,5.20785-3.30617,9.53126-6.93749-7.48656-0.531-13.8798-1.95712-20.3125-3.90625-4.06692-1.90161-9.71539-3.51615-12.4687-3.56251zm0.7191,8.71875c3.95622,0,6.40629,1.35612,6.40629,2.99997,0,1.67238-2.45007,3.03129-6.40629,3.03129-3.93975,0-6.43752-1.48293-6.43752-3.15621,0.00071-1.64385,2.49777-2.87505,6.43752-2.87505z"></path>
              </svg>
            </button>
          </div>
          ${v.noMapDots ? html`
            <p style=${S("color:var(--color-neutral-700);font-style:italic;max-width:70ch;margin:var(--space-3) auto 0 auto;text-align:center;")}>Nothing placed yet — the map fills in as books are given a location.</p>
          ` : null}
        </div>
      ` : null}
      ${v.isWishlist ? html`
        <div style=${S("padding:var(--space-6);max-width:70ch;")}>
          <h2 style=${S("font-family:var(--font-heading);font-weight:var(--font-heading-weight);font-size:32px;margin:0;")}>Wishlist / standing intentions</h2>
          <div className="hr" style=${S("margin:var(--space-3) 0;")}></div>
          ${(v.wishlist || []).map((w, $index) => html`
            <div key=${$index} style=${S("display:flex;align-items:flex-start;gap:var(--space-2);margin-bottom:var(--space-2);")}>
              <input type="checkbox" checked=${w.done ?? false} onChange=${w.toggle} style=${S("margin-top:6px;")} />
              <p style=${S(`margin:0;flex:1;${w.textStyle ?? ""}`)}>${w.text}</p>
              <button className="btn btn-ghost btn-icon" onClick=${w.remove} title="Remove">×</button>
            </div>
          `)}
          <div style=${S("display:flex;gap:var(--space-2);margin-top:var(--space-4);")}>
            <input className="input" placeholder="Add a new wishlist item…" value=${v.newWishlistText ?? ""} onChange=${v.onNewWishlistText} style=${S("flex:1;")} />
            ${" "}
            <button className="btn btn-primary" onClick=${v.addWishlistItem}>Add</button>
          </div>
        </div>
      ` : null}
      ${v.isQuotes ? html`
        <div style=${S("padding:var(--space-6);")}>
          <div style=${S("display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-4);flex-wrap:wrap;")}>
            <h2 style=${S("font-family:var(--font-heading);font-weight:var(--font-heading-weight);font-size:32px;margin:0;")}>Quotes & Citations</h2>
            <button className="btn btn-ghost" style=${S("white-space:nowrap;flex-shrink:0;")} onClick=${v.toggleThemeManager}>Manage themes</button>
            <div style=${S("position:relative;margin-left:auto;width:160px;flex-shrink:0;")}>
              <button className="btn btn-secondary btn-block" onClick=${v.toggleThemeFilterOpen} onBlur=${v.onThemeFilterBlur} style=${S("width:100%;justify-content:space-between;display:flex;")}>${v.quoteThemeFilterLabel}</button>
              ${v.themeFilterOpen ? html`
                <div style=${S("position:absolute;top:100%;left:0;right:0;z-index:10;background:var(--color-bg);border:1px solid var(--color-divider);border-radius:var(--radius-sm);box-shadow:var(--shadow-md);max-height:220px;overflow:auto;")}>
                  ${(v.quoteThemeFilterOptions || []).map((opt, $index) => html`
                    <div key=${$index} className=${H("hover", "background: var(--color-accent-100);")} style=${S("padding:var(--space-2);cursor:pointer;")} onClick=${opt.select}>${opt.label}</div>
                  `)}
                </div>
              ` : null}
            </div>
            <button className="btn btn-primary" style=${S("white-space:nowrap;flex-shrink:0;")} onClick=${v.openQuoteFormNew}>+ Add quote</button>
          </div>
          ${v.showThemeManager ? html`
            <div style=${S("border:1px solid var(--color-divider);border-radius:var(--radius-md);padding:var(--space-3);margin-bottom:var(--space-4);max-width:80ch;")}>
              ${v.hasThemeManageRows ? html`
                <${Fragment}>
                  ${(v.themeManageRows || []).map((row, $index) => html`
                    <div key=${$index} style=${S("display:flex;gap:var(--space-2);align-items:center;margin-bottom:var(--space-2);")}>
                      <input className="input" value=${row.draft ?? ""} onChange=${row.onDraftChange} style=${S("flex:1;")} />
                      ${" "}
                      <span style=${S("font-size:12px;color:var(--color-neutral-700);min-width:24px;")}>${row.count}</span>
                      ${" "}
                      <button className="btn btn-ghost" onClick=${row.save}>Save</button>
                      ${" "}
                      <button className="btn btn-ghost" disabled=${row.count} onClick=${row.remove} style=${S("color:var(--color-accent-700);")}>Remove</button>
                    </div>
                  `)}
                <//>
              ` : null}
              ${v.hasThemeManageRows ? html`
                <${Fragment}>

                <//>
              ` : null}
              <p style=${S("font-size:12px;color:var(--color-neutral-700);margin:0;")}>Themes are created from the quote form; rename or remove unused ones here.</p>
            </div>
          ` : null}
          ${v.hasQuotes ? html`
            <div style=${S("display:flex;flex-direction:column;gap:var(--space-4);max-width:80ch;")}>
              ${(v.quotesList || []).map((q, $index) => html`
                <div key=${$index} className=${"card" + " " + H("hover", "box-shadow: var(--shadow-md);")} style=${S("cursor:pointer;")} onClick=${q.edit}>
                  <div className="card-kicker">${q.bookTitle}${" "}—${" "}${q.bookAuthor}</div>
                  <p style=${S("font-family:var(--font-heading);font-size:20px;font-style:italic;margin:var(--space-2) 0;")}>"${q.quote}"</p>
                  <div className="card-meta">p.${" "}<span>${q.page}</span></div>
                  <div style=${S("display:flex;gap:var(--space-1);flex-wrap:wrap;margin-top:var(--space-2);")}>
                    ${(q.themeTags || []).map((tg, $index) => html`
                      <span key=${$index} className="tag tag-outline">${tg}</span>
                    `)}
                  </div>
                  ${q.note ? html`
                    <p style=${S("color:var(--color-neutral-700);margin-top:var(--space-2);")}>${q.note}</p>
                  ` : null}
                </div>
              `)}
            </div>
          ` : null}
        </div>
      ` : null}
      ${v.showThreadAssign ? html`
        <div className="dialog-backdrop" onClick=${v.cancelThreadAssign} style=${S("z-index:1000;")}>
          <div className="dialog" onClick=${v.stopClick} style=${S("max-width:480px;width:92vw;max-height:80vh;overflow:auto;")}>
            <div className="dialog-title">Assign "${v.threadAssignFor}"</div>
            <div className="dialog-body" style=${S("opacity:1;")}>
              <input className="input" placeholder="Search author, title…" value=${v.threadAssignQuery ?? ""} onChange=${v.onThreadAssignQuery} style=${S("margin-bottom:var(--space-3);")} />
              <div style=${S("display:flex;flex-direction:column;gap:var(--space-2);")}>
                ${(v.threadAssignRows || []).map((row, $index) => html`
                  <label key=${$index} style=${S("display:flex;align-items:center;gap:var(--space-2);cursor:pointer;")}>
                    <input type="checkbox" checked=${row.checked ?? false} onChange=${row.toggle} />
                    ${" "}
                    <span>${row.label}</span>
                  </label>
                `)}
              </div>
            </div>
            <div className="dialog-actions">
              <button className="btn btn-ghost" onClick=${v.cancelThreadAssign}>Cancel</button>
              ${" "}
              <button className="btn btn-primary" onClick=${v.saveThreadAssign}>Save</button>
            </div>
          </div>
        </div>
      ` : null}
      ${v.showQuoteForm ? html`
        <div className="dialog-backdrop" onClick=${v.cancelQuoteForm} style=${S("z-index:1000;")}>
          <div className="dialog" onClick=${v.stopClick} style=${S("max-width:560px;width:92vw;max-height:86vh;overflow:auto;")}>
            <div className="dialog-title">Quote</div>
            <div className="dialog-body" style=${S("opacity:1;")}>
              <div className="field" style=${S("position:relative;")}>
                <label>Book</label>
                ${" "}
                <input className="input" placeholder="Search title or author…" value=${v.quoteBookQuery ?? ""} onChange=${v.onQuoteBookQuery} onFocus=${v.onQuoteBookFocus} onBlur=${v.onQuoteBookBlur} autoComplete="off" />
                ${v.hasQuoteBookMatches ? html`
                  <div style=${S("position:absolute;top:100%;left:0;right:0;z-index:10;background:var(--color-bg);border:1px solid var(--color-divider);border-radius:var(--radius-sm);box-shadow:var(--shadow-md);max-height:200px;overflow:auto;")}>
                    ${(v.quoteBookMatches || []).map((m, $index) => html`
                      <div key=${$index} className=${H("hover", "background: var(--color-accent-100);")} style=${S("padding:var(--space-2);cursor:pointer;")} onClick=${m.select}>${m.label}</div>
                    `)}
                  </div>
                ` : null}
              </div>
              <div className="field">
                <label>Quote</label>
                <textarea className="input" rows="4" value=${v.quoteDraft.quote ?? ""} onChange=${v.onQuoteQuote}></textarea>
              </div>
              <div className="field" style=${S("max-width:140px;")}>
                <label>Page</label>
                <input className="input" value=${v.quoteDraft.page ?? ""} onChange=${v.onQuotePage} />
              </div>
              <div className="field">
                <label>Themes</label>
                <div style=${S("display:flex;gap:var(--space-1);flex-wrap:wrap;")}>
                  ${(v.quoteThemeChoices || []).map((ch, $index) => html`
                    <span key=${$index} className=${`tag ${ch.cls ?? ""}`} style=${S("cursor:pointer;")} onClick=${ch.toggle}>${ch.label}</span>
                  `)}
                </div>
                <div style=${S("display:flex;gap:var(--space-2);margin-top:var(--space-2);")}>
                  <input className="input" placeholder="New theme…" value=${v.quoteThemeInput ?? ""} onChange=${v.onQuoteThemeInput} style=${S("flex:1;")} />
                  ${" "}
                  <button className="btn btn-secondary" onClick=${v.addQuoteTheme}>Add theme</button>
                </div>
              </div>
              <div className="field">
                <label>Note</label>
                <textarea className="input" rows="2" value=${v.quoteDraft.note ?? ""} onChange=${v.onQuoteNote}></textarea>
              </div>
              ${v.quoteError ? html`
                <p style=${S("color:var(--color-accent-700);font-size:14px;")}>${v.quoteError}</p>
              ` : null}
            </div>
            <div className="dialog-actions">
              ${v.quoteIsEdit ? html`
                <button className="btn btn-ghost" style=${S("margin-right:auto;color:var(--color-accent-700);")} onClick=${v.deleteQuote}>Delete quote</button>
              ` : null}
              <button className="btn btn-ghost" onClick=${v.cancelQuoteForm}>Cancel</button>
              ${" "}
              <button className="btn btn-primary" onClick=${v.saveQuote}>Save</button>
            </div>
          </div>
        </div>
      ` : null}
      ${v.selectedBook ? html`
        <div className="dialog-backdrop" onClick=${v.closeDialog} style=${S("z-index:1000;")}>
          <div className="dialog" onClick=${v.stopClick} style=${S("max-width:640px;width:92vw;max-height:86vh;overflow:auto;")}>
            ${v.editMode ? html`
              <${Fragment}>
                <div className="dialog-title">Edit entry</div>
                <div className="dialog-body" style=${S("opacity:1;")}>
                  <div style=${S("display:grid;grid-template-columns:1fr 1fr;gap:var(--space-3);")}>
                    <div className="field" style=${S("position:relative;")}>
                      <label>Author</label>
                      ${" "}
                      <input className="input" value=${v.editDraft.author ?? ""} onChange=${v.editHandlers.author} onFocus=${v.onEditAuthorFocus} onBlur=${v.onEditAuthorBlur} autoComplete="off" />
                      ${v.hasEditAuthorMatches ? html`
                        <div style=${S("position:absolute;top:100%;left:0;right:0;z-index:10;background:var(--color-bg);border:1px solid var(--color-divider);border-radius:var(--radius-sm);box-shadow:var(--shadow-md);max-height:180px;overflow:auto;")}>
                          ${(v.editAuthorMatches || []).map((m, $index) => html`
                            <div key=${$index} className=${H("hover", "background: var(--color-accent-100);")} style=${S("padding:var(--space-2);cursor:pointer;")} onClick=${m.select}>${m.name}</div>
                          `)}
                        </div>
                      ` : null}
                    </div>
                    <div className="field">
                      <label>Title</label>
                      <input className="input" value=${v.editDraft.title ?? ""} onChange=${v.editHandlers.title} />
                    </div>
                    <div className="field">
                      <label>Series / Ref</label>
                      <input className="input" value=${v.editDraft.series ?? ""} onChange=${v.editHandlers.series} />
                    </div>
                    <div className="field">
                      <label>Translator</label>
                      <input className="input" value=${v.editDraft.translator ?? ""} onChange=${v.editHandlers.translator} />
                    </div>
                    <div className="field">
                      <label>Language</label>
                      <select className="input" value=${v.editDraft.lang ?? ""} onChange=${v.editHandlers.lang}>
                        ${(v.langChoiceOptions || []).map((opt, $index) => html`
                          <option key=${$index} value=${opt.value ?? ""}>${opt.label}</option>
                        `)}
                      </select>
                      <div style=${S("display:flex;gap:var(--space-2);margin-top:var(--space-2);")}>
                        <input className="input" placeholder="New language…" value=${v.editLangInput ?? ""} onChange=${v.onEditLangInput} style=${S("flex:1;")} />
                        ${" "}
                        <button className="btn btn-secondary" onClick=${v.addEditLang}>Add</button>
                      </div>
                    </div>
                    <div className="field">
                      <label>City (shelf)</label>
                      <select className="input" value=${v.editDraft.city ?? ""} onChange=${v.editHandlers.city}>
                        ${(v.cityChoiceOptions || []).map((opt, $index) => html`
                          <option key=${$index} value=${opt.value ?? ""}>${opt.label}</option>
                        `)}
                      </select>
                    </div>
                    <div className="field">
                      <label>Period</label>
                      <select className="input" value=${v.editDraft.period ?? ""} onChange=${v.editHandlers.period}>
                        ${(v.periodChoiceOptions || []).map((opt, $index) => html`
                          <option key=${$index} value=${opt.value ?? ""}>${opt.label}</option>
                        `)}
                      </select>
                    </div>
                    <div className="field">
                      <label>Binding</label>
                      <select className="input" value=${v.editDraft.binding ?? ""} onChange=${v.editHandlers.binding}>
                        ${(v.bindingOptions || []).map((opt, $index) => html`
                          <option key=${$index} value=${opt.value ?? ""}>${opt.label}</option>
                        `)}
                      </select>
                    </div>
                    <div className="field">
                      <label>Volumes (if more than 1)</label>
                      <input className="input" type="number" min="1" placeholder="1" value=${v.editDraft.bookCount ?? ""} onChange=${v.editHandlers.bookCount} />
                    </div>
                    <div className="field">
                      <label>Location (map)</label>
                      <select className="select" value=${v.editDraft.place ?? ""} onChange=${v.editHandlers.place}>
                        ${(v.placeChoiceOptions || []).map((opt, $index) => html`
                          <option key=${$index} value=${opt.value ?? ""}>${opt.label}</option>
                        `)}
                      </select>
                    </div>
                  </div>
                  <div className="field">
                    <label>Threads</label>
                    <div style=${S("display:flex;gap:var(--space-1);flex-wrap:wrap;")}>
                      ${(v.editThreadChoices || []).map((ch, $index) => html`
                        <span key=${$index} className=${`tag ${ch.cls ?? ""}`} style=${S("cursor:pointer;")} onClick=${ch.toggle}>${ch.label}</span>
                      `)}
                    </div>
                    <div style=${S("display:flex;gap:var(--space-2);margin-top:var(--space-2);")}>
                      <input className="input" placeholder="New thread…" value=${v.editThreadInput ?? ""} onChange=${v.onEditThreadInput} style=${S("flex:1;")} />
                      ${" "}
                      <button className="btn btn-secondary" onClick=${v.addEditThread}>Add thread</button>
                    </div>
                  </div>
                  <div className="field">
                    <label>Mode</label>
                    <div style=${S("display:flex;gap:var(--space-1);flex-wrap:wrap;")}>
                      ${(v.editModeChoices || []).map((ch, $index) => html`
                        <span key=${$index} className=${`tag ${ch.cls ?? ""}`} style=${S("cursor:pointer;")} onClick=${ch.toggle}>${ch.label}</span>
                      `)}
                    </div>
                  </div>
                  <div className="field">
                    <label>Note</label>
                    <textarea className="input" rows="3" value=${v.editDraft.note ?? ""} onChange=${v.editHandlers.note}></textarea>
                  </div>
                </div>
                <div className="dialog-actions">
                  <button className="btn btn-ghost" style=${S("margin-right:auto;color:var(--color-accent-700);")} onClick=${v.deleteBook}>Delete book</button>
                  ${" "}
                  <button className="btn btn-ghost" onClick=${v.cancelEdit}>Cancel</button>
                  ${" "}
                  <button className="btn btn-primary" onClick=${v.saveEdit}>Save</button>
                </div>
              <//>
            ` : null}
            ${v.notEditMode ? html`
              <${Fragment}>
                <div className="dialog-title">${v.selectedBook.title}</div>
                <div className="dialog-body">
                  <p style=${S("margin:0 0 var(--space-3) 0;color:var(--color-neutral-700);")}>${v.selectedBook.author}${" "}·${" "}${v.selectedBook.cityName}</p>
                  ${v.selectedBook.notAlexandria ? html`
                    <${Fragment}>
                      <table className="table">
                        <tbody>
                          <tr>
                            <td>Period</td>
                            <td>${v.selectedBook.periodLabel}</td>
                          </tr>
                          <tr>
                            <td>Series / Ref</td>
                            <td>${v.selectedBook.seriesLabel}</td>
                          </tr>
                          <tr>
                            <td>Translator</td>
                            <td>${v.selectedBook.translatorLabel}</td>
                          </tr>
                          <tr>
                            <td>Language</td>
                            <td>${v.selectedBook.langLabel}</td>
                          </tr>
                          <tr>
                            <td>Binding</td>
                            <td>${v.selectedBook.bindingLabel}</td>
                          </tr>
                          <tr>
                            <td>Location</td>
                            <td>${v.selectedBook.placeLabel}</td>
                          </tr>
                          ${v.selectedBook.showVolumes ? html`
                            <tr>
                              <td>Volumes</td>
                              <td>${v.selectedBook.bookCount}</td>
                            </tr>
                          ` : null}
                        </tbody>
                      </table>
                      <div style=${S("display:flex;gap:var(--space-1);flex-wrap:wrap;margin:var(--space-3) 0;")}>
                        ${(v.selectedBook.threadTags || []).map((tg, $index) => html`
                          <span key=${$index} className="tag tag-accent">${tg}</span>
                        `)}
                        ${(v.selectedBook.modeTags || []).map((tg, $index) => html`
                          <span key=${$index} className="tag tag-neutral">${tg}</span>
                        `)}
                      </div>
                      ${v.selectedBook.note ? html`
                        <p style=${S("font-style:italic;color:var(--color-neutral-700);")}>${v.selectedBook.note}</p>
                      ` : null}
                      ${v.hasCrossRefs ? html`
                        <${Fragment}>
                          <div className="hr" style=${S("margin:var(--space-3) 0;")}></div>
                          <div style=${S("font-size:13px;text-transform:uppercase;letter-spacing:0.05em;color:var(--color-neutral-700);margin-bottom:var(--space-2);")}>Shares a thread with</div>
                          ${(v.crossRefs || []).map((cr, $index) => html`
                            <div key=${$index} style=${S("cursor:pointer;padding:var(--space-1) 0;")} onClick=${cr.open}>
                              <a href="#">${cr.title}</a>
                              ${" "}—${" "}${cr.author}${" "}
                              <span style=${S("color:var(--color-neutral-700);")}>(${cr.cityName})</span>
                            </div>
                          `)}
                        <//>
                      ` : null}
                    <//>
                  ` : null}
                  <div className="hr" style=${S("margin:var(--space-3) 0;")}></div>
                  ${v.selectedBook.borrowed ? html`
                    <${Fragment}>
                      <p style=${S("margin:0 0 var(--space-2) 0;font-size:14px;")}>
                        ↗ Borrowed to${" "}
                        <strong>${v.selectedBook.borrowed?.to}</strong>
                        ${" "}since${" "}${v.selectedBook.borrowed?.date}.
                      </p>
                      <div style=${S("display:flex;gap:var(--space-2);")}>
                        <button className="btn btn-ghost" onClick=${v.markSelectedReturned}>Mark returned</button>
                        ${" "}
                        <button className="btn btn-ghost" onClick=${v.openBorrowForm}>Edit loan</button>
                      </div>
                    <//>
                  ` : null}
                  ${v.showBorrowForm ? html`
                    <div style=${S("display:flex;gap:var(--space-2);align-items:flex-end;flex-wrap:wrap;")}>
                      <div className="field" style=${S("flex:1;min-width:140px;margin:0;")}>
                        <label>To</label>
                        <input className="input" value=${v.borrowDraft.to ?? ""} onChange=${v.onBorrowTo} />
                      </div>
                      <div className="field" style=${S("flex:1;min-width:140px;margin:0;")}>
                        <label>Date</label>
                        <input className="input" type="date" value=${v.borrowDraft.date ?? ""} onChange=${v.onBorrowDate} />
                      </div>
                      <button className="btn btn-primary" onClick=${v.saveBorrow}>Save</button>
                      ${" "}
                      <button className="btn btn-ghost" onClick=${v.cancelBorrowForm}>Cancel</button>
                    </div>
                  ` : null}
                  ${v.showAddBorrowButton ? html`
                    <button className="btn btn-ghost" onClick=${v.openBorrowForm}>Mark as borrowed</button>
                  ` : null}
                </div>
                ${v.selectedBook.journalLine ? html`<div style=${S("font-size:13px;margin-top:var(--space-2);")}><a href=${v.selectedBook.journalHref}>${v.selectedBook.journalLine} →</a></div>` : null}
                <div className="dialog-actions">
                  <div style=${S("display:flex;align-items:center;gap:var(--space-2);margin-right:auto;")}>
                    <button className="btn btn-ghost" onClick=${v.openQuoteFromBook}>+ Add quote</button>
                    ${" "}
                    <span style=${S("font-size:13px;color:var(--color-neutral-700);")}>${v.selectedBook.quoteCount}${" "}quote(s)</span>
                  </div>
                  <button className="btn btn-ghost" onClick=${v.closeDialog}>Close</button>
                  ${v.selectedBook.notAlexandria ? html`
                    <button className="btn btn-primary" onClick=${v.startEdit}>Edit</button>
                  ` : null}
                </div>
              <//>
            ` : null}
          </div>
        </div>
      ` : null}
      ${v.showRemoveShelfForm ? html`
        <div className="dialog-backdrop" onClick=${v.cancelRemoveShelf} style=${S("z-index:1000;")}>
          <div className="dialog" onClick=${v.stopClick} style=${S("max-width:480px;width:92vw;")}>
            <div className="dialog-title">Remove a shelf</div>
            <div className="dialog-body" style=${S("opacity:1;")}>
              <div className="field">
                <label>Shelf</label>
                <select className="input" value=${v.removeShelfId ?? ""} onChange=${v.onRemoveShelfId}>
                  ${(v.removeShelfOptions || []).map((opt, $index) => html`
                    <option key=${$index} value=${opt.value ?? ""}>${opt.label}</option>
                  `)}
                </select>
              </div>
              ${v.showRemoveShelfWarning ? html`
                <p style=${S("color:var(--color-accent-700);font-size:14px;")}>This shelf still holds${" "}${v.removeShelfCount}${" "}book(s). Reassign them to another shelf (edit each book's City) before removing it.</p>
              ` : null}
            </div>
            <div className="dialog-actions">
              <button className="btn btn-ghost" onClick=${v.cancelRemoveShelf}>Cancel</button>
              ${" "}
              <button className="btn btn-primary" onClick=${v.removeShelf} disabled=${v.removeShelfDisabled}>Remove shelf</button>
            </div>
          </div>
        </div>
      ` : null}
      ${v.showAddShelfForm ? html`
        <div className="dialog-backdrop" onClick=${v.cancelAddShelf} style=${S("z-index:1000;")}>
          <div className="dialog" onClick=${v.stopClick} style=${S("max-width:480px;width:92vw;")}>
            <div className="dialog-title">Add a shelf</div>
            <div className="dialog-body" style=${S("opacity:1;")}>
              <div className="field">
                <label>Name</label>
                <input className="input" placeholder="e.g. Amsterdam" value=${v.addShelfName ?? ""} onChange=${v.onAddShelfName} />
              </div>
              <div className="field">
                <label>Blurb (optional)</label>
                <input className="input" placeholder="Location — …" value=${v.addShelfBlurb ?? ""} onChange=${v.onAddShelfBlurb} />
              </div>
            </div>
            <div className="dialog-actions">
              <button className="btn btn-ghost" onClick=${v.cancelAddShelf}>Cancel</button>
              ${" "}
              <button className="btn btn-primary" onClick=${v.saveAddShelf}>Add shelf</button>
            </div>
          </div>
        </div>
      ` : null}
      ${v.showRestoreConfirm ? html`
        <div className="dialog-backdrop" onClick=${v.cancelRestore} style=${S("z-index:1000;")}>
          <div className="dialog" onClick=${v.stopClick} style=${S("max-width:480px;width:92vw;")}>
            <div className="dialog-title">Restore from backup</div>
            <div className="dialog-body" style=${S("opacity:1;")}>
              <p style=${S("margin:0;")}>
                Replace the current catalogue with the backup from${" "}
                <strong>${v.restoreExportedAtLabel}</strong>
                ? This will overwrite what's currently loaded.
              </p>
              ${v.restoreContentsLabel ? html`<p style=${S("margin:var(--space-2) 0 0 0;font-size:13px;color:var(--color-neutral-700);")}>${v.restoreContentsLabel}</p>` : null}
            </div>
            <div className="dialog-actions">
              <button className="btn btn-ghost" onClick=${v.cancelRestore}>Cancel</button>
              ${" "}
              <button className="btn btn-primary" onClick=${v.confirmRestore}>Replace catalogue</button>
            </div>
          </div>
        </div>
      ` : null}
      ${v.showPeriodManager ? html`
        <div className="dialog-backdrop" onClick=${v.closePeriodManager} style=${S("z-index:900;")}>
          <div className="dialog" onClick=${v.stopClick} style=${S("max-width:560px;width:92vw;max-height:86vh;display:flex;flex-direction:column;")}>
            <div className="dialog-title">Manage periods</div>
            <div className="dialog-body" style=${S("opacity:1;max-height:60vh;overflow-y:auto;")}>
              ${(v.periodManageRows || []).map((row, $index) => html`
                <div key=${$index} style=${S("display:flex;gap:var(--space-2);align-items:center;margin-bottom:var(--space-2);")}>
                  <input className="input" value=${row.draft ?? ""} onChange=${row.onDraftChange} style=${S("flex:1;")} />
                  ${" "}
                  <span style=${S("font-size:12px;color:var(--color-neutral-700);min-width:24px;")}>${row.count}</span>
                  ${" "}
                  <button className="btn btn-ghost" onClick=${row.save}>Save</button>
                  ${" "}
                  <button className="btn btn-ghost" disabled=${row.count} onClick=${row.remove} style=${S("color:var(--color-accent-700);")}>Remove</button>
                </div>
              `)}
              <div style=${S("display:flex;gap:var(--space-2);margin-top:var(--space-4);")}>
                <input className="input" placeholder="New period…" value=${v.newPeriodText ?? ""} onChange=${v.onNewPeriodText} style=${S("flex:1;")} />
                ${" "}
                <button className="btn btn-primary" onClick=${v.addPeriod}>Add period</button>
              </div>
            </div>
            <div className="dialog-actions">
              <button className="btn btn-ghost" onClick=${v.closePeriodManager}>Done</button>
            </div>
          </div>
        </div>
      ` : null}
      ${v.showThreadManager ? html`
        <div className="dialog-backdrop" onClick=${v.closeThreadManager} style=${S("z-index:900;")}>
          <div className="dialog" onClick=${v.stopClick} style=${S("max-width:620px;width:92vw;max-height:86vh;display:flex;flex-direction:column;")}>
            <div className="dialog-title">Manage threads</div>
            <div className="dialog-body" style=${S("opacity:1;max-height:60vh;overflow-y:auto;")}>
              ${v.hasThreadManageRows ? html`
                <${Fragment}>
                  ${(v.threadManageRows || []).map((row, $index) => html`
                    <div key=${$index} style=${S("display:flex;gap:var(--space-2);align-items:center;margin-bottom:var(--space-2);")}>
                      <button title="Assign to books…" onClick=${row.openAssign} style=${S("width:14px;height:14px;border-radius:50%;background:var(--color-accent);border:none;cursor:pointer;padding:0;flex-shrink:0;")}></button>
                      ${" "}
                      <input className="input" value=${row.draft ?? ""} onChange=${row.onDraftChange} style=${S("flex:1;")} />
                      ${" "}
                      <span style=${S("font-size:12px;color:var(--color-neutral-700);min-width:24px;")}>${row.count}</span>
                      ${" "}
                      <button className="btn btn-ghost" onClick=${row.save}>Save</button>
                      ${" "}
                      <button className="btn btn-ghost" disabled=${row.count} onClick=${row.remove} style=${S("color:var(--color-accent-700);")}>Remove</button>
                    </div>
                  `)}
                <//>
              ` : null}
              <p style=${S("font-size:12px;color:var(--color-neutral-700);margin:var(--space-1) 0 0 0;")}>The dot opens bulk assignment to books.</p>
              <div style=${S("display:flex;gap:var(--space-2);margin-top:var(--space-4);")}>
                <input className="input" placeholder="New thread…" value=${v.newThreadText ?? ""} onChange=${v.onNewThreadText} style=${S("flex:1;")} />
                ${" "}
                <button className="btn btn-primary" onClick=${v.addThread}>Add thread</button>
              </div>
            </div>
            <div className="dialog-actions">
              <button className="btn btn-ghost" onClick=${v.closeThreadManager}>Done</button>
            </div>
          </div>
        </div>
      ` : null}
      ${v.showShelfManager ? html`
        <div className="dialog-backdrop" onClick=${v.closeShelfManager} style=${S("z-index:900;")}>
          <div className="dialog" onClick=${v.stopClick} style=${S("max-width:620px;width:92vw;max-height:86vh;display:flex;flex-direction:column;")}>
            <div className="dialog-title">Manage shelves</div>
            <div className="dialog-body" style=${S("opacity:1;max-height:60vh;overflow-y:auto;")}>
              ${(v.shelfManageRows || []).map((row, $index) => html`
                <div key=${$index} style=${S("display:flex;gap:var(--space-2);align-items:center;margin-bottom:var(--space-2);")}>
                  <button title="Move books to this shelf…" onClick=${row.openMove} style=${S("width:14px;height:14px;border-radius:50%;background:var(--color-accent);border:none;cursor:pointer;padding:0;flex-shrink:0;")}></button>
                  ${" "}
                  <input className="input" value=${row.draft ?? ""} onChange=${row.onDraftChange} style=${S("flex:1;")} />
                  ${" "}
                  <span style=${S("font-size:12px;color:var(--color-neutral-700);min-width:24px;")}>${row.count}</span>
                  ${" "}
                  <button className="btn btn-ghost" onClick=${row.save}>Save</button>
                  ${" "}
                  <button className="btn btn-ghost" disabled=${row.count} onClick=${row.remove} style=${S("color:var(--color-accent-700);")}>Remove</button>
                </div>
              `)}
              <p style=${S("font-size:12px;color:var(--color-neutral-700);margin:var(--space-1) 0 0 0;")}>The dot opens bulk moving — pick books from any shelf and send them here. A shelf can only be removed once it is empty.</p>
              <div style=${S("display:flex;gap:var(--space-2);margin-top:var(--space-4);")}>
                <input className="input" placeholder="New shelf…" value=${v.newShelfText ?? ""} onChange=${v.onNewShelfText} style=${S("flex:1;")} />
                ${" "}
                <button className="btn btn-primary" onClick=${v.addShelfQuick}>Add shelf</button>
              </div>
            </div>
            <div className="dialog-actions">
              <button className="btn btn-ghost" onClick=${v.closeShelfManager}>Done</button>
            </div>
          </div>
        </div>
      ` : null}
      ${v.showShelfMove ? html`
        <div className="dialog-backdrop" onClick=${v.cancelShelfMove} style=${S("z-index:1000;")}>
          <div className="dialog" onClick=${v.stopClick} style=${S("max-width:560px;width:92vw;max-height:86vh;display:flex;flex-direction:column;")}>
            <div className="dialog-title">Move books to${" "}${v.shelfMoveToName}</div>
            <div className="dialog-body" style=${S("opacity:1;max-height:58vh;overflow-y:auto;")}>
              <div style=${S("display:flex;gap:var(--space-2);margin-bottom:var(--space-3);flex-wrap:wrap;")}>
                <select className="select" value=${v.shelfMoveFrom ?? ""} onChange=${v.onShelfMoveFrom} style=${S("width:180px;")}>
                  ${(v.shelfMoveFromOptions || []).map((opt, $index) => html`
                    <option key=${$index} value=${opt.value ?? ""}>${opt.label}</option>
                  `)}
                </select>
                <input className="input" placeholder="Search author, title…" value=${v.shelfMoveQuery ?? ""} onChange=${v.onShelfMoveQuery} style=${S("flex:1;min-width:180px;")} />
              </div>
              ${v.hasShelfMoveRows ? html`
                <div style=${S("display:flex;flex-direction:column;gap:var(--space-2);")}>
                  ${(v.shelfMoveRows || []).map((row, $index) => html`
                    <label key=${$index} style=${S("display:flex;align-items:center;gap:var(--space-2);cursor:pointer;")}>
                      <input type="checkbox" checked=${row.checked ?? false} onChange=${row.toggle} />
                      ${" "}
                      <span style=${S("font-size:14px;")}>${row.label}</span>
                      ${" "}
                      <span style=${S("font-size:12px;color:var(--color-neutral-700);margin-left:auto;white-space:nowrap;")}>${row.from}</span>
                    </label>
                  `)}
                </div>
              ` : null}
              ${v.noShelfMoveRows ? html`
                <p style=${S("color:var(--color-neutral-700);font-style:italic;margin:0;")}>No other books match.</p>
              ` : null}
            </div>
            <div className="dialog-actions">
              <span style=${S("font-size:13px;color:var(--color-neutral-700);margin-right:auto;")}>${v.shelfMoveSelectedLabel}</span>
              ${" "}
              <button className="btn btn-ghost" onClick=${v.cancelShelfMove}>Cancel</button>
              ${" "}
              <button className="btn btn-primary" onClick=${v.saveShelfMove}>Move</button>
            </div>
          </div>
        </div>
      ` : null}
      ${v.showPlaceManager ? html`
        <div className="dialog-backdrop" onClick=${v.closePlaceManager} style=${S("z-index:900;")}>
          <div className="dialog" onClick=${v.stopClick} style=${S("max-width:640px;width:92vw;max-height:86vh;display:flex;flex-direction:column;")}>
            <div className="dialog-title">Manage locations</div>
            <div className="dialog-body" style=${S("opacity:1;max-height:56vh;overflow-y:auto;")}>
              ${(v.placeManageRows || []).map((row, $index) => html`
                <div key=${$index} style=${S("display:flex;gap:var(--space-2);align-items:center;margin-bottom:var(--space-2);")}>
                  <button title="Place books here…" onClick=${row.openAssign} style=${S("width:14px;height:14px;border-radius:50%;background:var(--color-accent);border:none;cursor:pointer;padding:0;flex-shrink:0;")}></button>
                  ${" "}
                  <input className="input" value=${row.draft ?? ""} onChange=${row.onDraftChange} style=${S("flex:1;")} />
                  ${" "}
                  <span style=${S("font-size:11px;color:var(--color-neutral-700);min-width:96px;text-align:right;font-variant-numeric:tabular-nums;")}>${row.coords}</span>
                  ${" "}
                  <span style=${S("font-size:12px;color:var(--color-neutral-700);min-width:24px;text-align:right;")}>${row.count}</span>
                  ${" "}
                  <button className="btn btn-ghost" onClick=${row.save}>Save</button>
                  ${" "}
                  <button className="btn btn-ghost" disabled=${row.count} onClick=${row.remove} style=${S("color:var(--color-accent-700);")}>Remove</button>
                </div>
              `)}
              <p style=${S("font-size:12px;color:var(--color-neutral-700);margin:var(--space-1) 0 0 0;")}>The dot opens bulk placing. Coordinates are latitude, longitude — a location can only be removed once no book sits there.</p>
              <div className="hr" style=${S("margin:var(--space-4) 0 var(--space-3) 0;")}></div>
              <div style=${S("display:flex;gap:var(--space-2);align-items:flex-end;flex-wrap:wrap;")}>
                <div className="field" style=${S("flex:2;min-width:160px;margin:0;")}>
                  <label>New location</label>
                  <input className="input" placeholder="Ragusa" value=${v.newPlaceName ?? ""} onChange=${v.onNewPlaceName} />
                </div>
                <div className="field" style=${S("flex:1;min-width:96px;margin:0;")}>
                  <label>Latitude</label>
                  <input className="input" placeholder="42.65" value=${v.newPlaceLat ?? ""} onChange=${v.onNewPlaceLat} />
                </div>
                <div className="field" style=${S("flex:1;min-width:96px;margin:0;")}>
                  <label>Longitude</label>
                  <input className="input" placeholder="18.09" value=${v.newPlaceLon ?? ""} onChange=${v.onNewPlaceLon} />
                </div>
                <button className="btn btn-primary" onClick=${v.addPlace}>Add</button>
              </div>
              <p style=${S("font-size:12px;color:var(--color-neutral-700);margin:var(--space-2) 0 0 0;")}>North and east are positive, south and west negative — Lisbon is 38.72, −9.14.</p>
              ${v.placeError ? html`
                <p style=${S("font-size:13px;color:var(--color-accent-700);margin:var(--space-2) 0 0 0;")}>${v.placeError}</p>
              ` : null}
            </div>
            <div className="dialog-actions">
              <button className="btn btn-ghost" onClick=${v.closePlaceManager}>Done</button>
            </div>
          </div>
        </div>
      ` : null}
      ${v.showPlaceAssign ? html`
        <div className="dialog-backdrop" onClick=${v.cancelPlaceAssign} style=${S("z-index:1000;")}>
          <div className="dialog" onClick=${v.stopClick} style=${S("max-width:560px;width:92vw;max-height:86vh;display:flex;flex-direction:column;")}>
            <div className="dialog-title">Place books at${" "}${v.placeAssignToName}</div>
            <div className="dialog-body" style=${S("opacity:1;max-height:58vh;overflow-y:auto;")}>
              <div style=${S("display:flex;gap:var(--space-2);margin-bottom:var(--space-3);flex-wrap:wrap;")}>
                <select className="select" value=${v.placeAssignFrom ?? ""} onChange=${v.onPlaceAssignFrom} style=${S("width:180px;")}>
                  ${(v.placeAssignFromOptions || []).map((opt, $index) => html`
                    <option key=${$index} value=${opt.value ?? ""}>${opt.label}</option>
                  `)}
                </select>
                <input className="input" placeholder="Search author, title…" value=${v.placeAssignQuery ?? ""} onChange=${v.onPlaceAssignQuery} style=${S("flex:1;min-width:180px;")} />
              </div>
              ${v.hasPlaceAssignRows ? html`
                <div style=${S("display:flex;flex-direction:column;gap:var(--space-2);")}>
                  ${(v.placeAssignRows || []).map((row, $index) => html`
                    <label key=${$index} style=${S("display:flex;align-items:center;gap:var(--space-2);cursor:pointer;")}>
                      <input type="checkbox" checked=${row.checked ?? false} onChange=${row.toggle} />
                      ${" "}
                      <span style=${S("font-size:14px;")}>${row.label}</span>
                      ${" "}
                      <span style=${S("font-size:12px;color:var(--color-neutral-700);margin-left:auto;white-space:nowrap;")}>${row.from}</span>
                    </label>
                  `)}
                </div>
              ` : null}
              ${v.noPlaceAssignRows ? html`
                <p style=${S("color:var(--color-neutral-700);font-style:italic;margin:0;")}>No other books match.</p>
              ` : null}
            </div>
            <div className="dialog-actions">
              <span style=${S("font-size:13px;color:var(--color-neutral-700);margin-right:auto;")}>${v.placeAssignSelectedLabel}</span>
              ${" "}
              <button className="btn btn-ghost" onClick=${v.cancelPlaceAssign}>Cancel</button>
              ${" "}
              <button className="btn btn-primary" onClick=${v.savePlaceAssign}>Place</button>
            </div>
          </div>
        </div>
      ` : null}
      ${v.backupToast ? html`
        <div style=${S("position:fixed;bottom:var(--space-5);right:var(--space-5);z-index:2000;background:var(--color-neutral-900);color:var(--color-bg);padding:var(--space-2) var(--space-4);border-radius:var(--radius-sm);box-shadow:var(--shadow-md);font-size:14px;")}>${v.backupToast}</div>
      ` : null}
      ${v.showAddForm ? html`
        <div className="dialog-backdrop" onClick=${v.cancelAdd} style=${S("z-index:1000;")}>
          <div className="dialog" onClick=${v.stopClick} style=${S("max-width:640px;width:92vw;max-height:86vh;overflow:auto;")}>
            <div className="dialog-title">Add a book</div>
            <div className="dialog-body" style=${S("opacity:1;")}>
              <div style=${S("display:grid;grid-template-columns:1fr 1fr;gap:var(--space-3);")}>
                <div className="field" style=${S("position:relative;")}>
                  <label>Author</label>
                  ${" "}
                  <input className="input" value=${v.addDraft.author ?? ""} onChange=${v.addHandlers.author} onFocus=${v.onAddAuthorFocus} onBlur=${v.onAddAuthorBlur} autoComplete="off" />
                  ${v.hasAddAuthorMatches ? html`
                    <div style=${S("position:absolute;top:100%;left:0;right:0;z-index:10;background:var(--color-bg);border:1px solid var(--color-divider);border-radius:var(--radius-sm);box-shadow:var(--shadow-md);max-height:180px;overflow:auto;")}>
                      ${(v.addAuthorMatches || []).map((m, $index) => html`
                        <div key=${$index} className=${H("hover", "background: var(--color-accent-100);")} style=${S("padding:var(--space-2);cursor:pointer;")} onClick=${m.select}>${m.name}</div>
                      `)}
                    </div>
                  ` : null}
                </div>
                <div className="field">
                  <label>Title</label>
                  <input className="input" value=${v.addDraft.title ?? ""} onChange=${v.addHandlers.title} />
                </div>
                <div className="field">
                  <label>Series / Ref</label>
                  <input className="input" value=${v.addDraft.series ?? ""} onChange=${v.addHandlers.series} />
                </div>
                <div className="field">
                  <label>Translator</label>
                  <input className="input" value=${v.addDraft.translator ?? ""} onChange=${v.addHandlers.translator} />
                </div>
                <div className="field">
                  <label>Language</label>
                  <select className="input" value=${v.addDraft.lang ?? ""} onChange=${v.addHandlers.lang}>
                    ${(v.langChoiceOptions || []).map((opt, $index) => html`
                      <option key=${$index} value=${opt.value ?? ""}>${opt.label}</option>
                    `)}
                  </select>
                  <div style=${S("display:flex;gap:var(--space-2);margin-top:var(--space-2);")}>
                    <input className="input" placeholder="New language…" value=${v.addLangInput ?? ""} onChange=${v.onAddLangInput} style=${S("flex:1;")} />
                    ${" "}
                    <button className="btn btn-secondary" onClick=${v.addNewLang}>Add</button>
                  </div>
                </div>
                <div className="field">
                  <label>City (shelf)</label>
                  <select className="input" value=${v.addDraft.city ?? ""} onChange=${v.addHandlers.city}>
                    ${(v.cityChoiceOptions || []).map((opt, $index) => html`
                      <option key=${$index} value=${opt.value ?? ""}>${opt.label}</option>
                    `)}
                  </select>
                </div>
                <div className="field">
                  <label>Period</label>
                  <select className="input" value=${v.addDraft.period ?? ""} onChange=${v.addHandlers.period}>
                    ${(v.periodChoiceOptions || []).map((opt, $index) => html`
                      <option key=${$index} value=${opt.value ?? ""}>${opt.label}</option>
                    `)}
                  </select>
                </div>
                <div className="field">
                  <label>Binding</label>
                  <select className="input" value=${v.addDraft.binding ?? ""} onChange=${v.addHandlers.binding}>
                    ${(v.bindingOptions || []).map((opt, $index) => html`
                      <option key=${$index} value=${opt.value ?? ""}>${opt.label}</option>
                    `)}
                  </select>
                </div>
                <div className="field">
                  <label>Volumes (if more than 1)</label>
                  <input className="input" type="number" min="1" placeholder="1" value=${v.addDraft.bookCount ?? ""} onChange=${v.addHandlers.bookCount} />
                </div>
                <div className="field">
                  <label>Location (map)</label>
                  <select className="select" value=${v.addDraft.place ?? ""} onChange=${v.addHandlers.place}>
                    ${(v.placeChoiceOptions || []).map((opt, $index) => html`
                      <option key=${$index} value=${opt.value ?? ""}>${opt.label}</option>
                    `)}
                  </select>
                </div>
              </div>
              <div className="field">
                <label>Threads</label>
                <div style=${S("display:flex;gap:var(--space-1);flex-wrap:wrap;")}>
                  ${(v.addThreadChoices || []).map((ch, $index) => html`
                    <span key=${$index} className=${`tag ${ch.cls ?? ""}`} style=${S("cursor:pointer;")} onClick=${ch.toggle}>${ch.label}</span>
                  `)}
                </div>
                <div style=${S("display:flex;gap:var(--space-2);margin-top:var(--space-2);")}>
                  <input className="input" placeholder="New thread…" value=${v.addThreadInput ?? ""} onChange=${v.onAddThreadInput} style=${S("flex:1;")} />
                  ${" "}
                  <button className="btn btn-secondary" onClick=${v.addNewThread}>Add thread</button>
                </div>
              </div>
              <div className="field">
                <label>Mode</label>
                <div style=${S("display:flex;gap:var(--space-1);flex-wrap:wrap;")}>
                  ${(v.addModeChoices || []).map((ch, $index) => html`
                    <span key=${$index} className=${`tag ${ch.cls ?? ""}`} style=${S("cursor:pointer;")} onClick=${ch.toggle}>${ch.label}</span>
                  `)}
                </div>
              </div>
              <div className="field">
                <label>Note</label>
                <textarea className="input" rows="3" value=${v.addDraft.note ?? ""} onChange=${v.addHandlers.note}></textarea>
              </div>
            </div>
            <div className="dialog-actions">
              <button className="btn btn-ghost" onClick=${v.cancelAdd}>Cancel</button>
              ${" "}
              <button className="btn btn-primary" onClick=${v.saveAdd}>Add book</button>
            </div>
          </div>
        </div>
      ` : null}
    </div>
    `;
  };
})();
