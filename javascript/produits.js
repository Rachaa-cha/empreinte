(function () {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);

  document.addEventListener("DOMContentLoaded", () => {
    heroTeaser();
    categoryTiles();
    popularGrid();
    catalogue();

    if (typeof window.empRevealScan === "function") window.empRevealScan();
  });

  function card(p) {
    const c = document.createElement("article");
    c.className = "prod-card reveal";
    c.dataset.cat = p.cat;
    c.tabIndex = 0;
    c.setAttribute("role", "button");
    c.setAttribute("aria-label", p.name + " — voir le détail");
    const stage = document.createElement("div");
    stage.className = "prod-card__stage";
    stage.appendChild(productPhoto({ cat: p.cat, color: p.color, name: p.name, img: p.img }));
    stage.insertAdjacentHTML("beforeend", `<span class="prod-card__view">Voir →</span>`);
    const body = document.createElement("div");
    body.className = "prod-card__body";
    body.innerHTML = `
      <h3>${empEsc(p.name)}</h3>
      <p>${empEsc(p.desc)}</p>
      <div class="prod-card__foot">
        <span class="prod-card__price">${dzd(p.price)}</span>
        <div class="prod-card__actions">
          <button class="prod-card__mini" data-add="${p.id}">+ Panier</button>
          <a class="prod-card__mini red" href="${link("studio.html")}?product=${p.id}">Personnaliser</a>
        </div>
      </div>`;
    c.innerHTML = `<span class="prod-card__id">${p.id}</span><span class="prod-card__tag">${empEsc(p.tag)}</span>`;
    c.append(stage, body);
    body.querySelector("[data-add]").addEventListener("click", (e) => {
      e.stopPropagation();
      EmpreinteCart.add({ id: p.id, name: p.name, cat: p.cat, color: p.color, price: p.price, size: "M", custom: null, logo: null });
      flyToCart(e.currentTarget, p.color);
      empToast(`<b>+1</b> ${empEsc(p.name)} ajouté`);
    });

    body.querySelector("a.red").addEventListener("click", (e) => e.stopPropagation());

    const open = () => openQuickView(p);
    c.addEventListener("click", open);
    c.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
    return c;
  }

  let qvBuilt = false;
  function buildQuickView() {
    if (qvBuilt) return;
    const scrim = document.createElement("div");
    scrim.className = "qv-scrim"; scrim.id = "qv-scrim";
    scrim.innerHTML = `
      <div class="qv" role="dialog" aria-modal="true" aria-labelledby="qv-name">
        <button class="qv__close" aria-label="Fermer">Fermer ✕</button>
        <div class="qv__stage">
          <span class="qv__id" id="qv-id"></span>
          <div class="qv__art" id="qv-art"></div>
          <div class="qv__swatches" id="qv-sw"></div>
        </div>
        <div class="qv__info">
          <span class="qv__tag" id="qv-tag"></span>
          <h3 id="qv-name"></h3>
          <p id="qv-desc"></p>
          <div class="qv__sizes" id="qv-sizes"></div>
          <div class="qv__price" id="qv-price"></div>
          <div class="qv__actions">
            <button class="btn btn-outline" id="qv-add">Ajouter au panier</button>
            <a class="btn btn-red" id="qv-perso">Personnaliser au studio <span class="arrow">→</span></a>
          </div>
        </div>
      </div>`;
    document.body.appendChild(scrim);
    scrim.addEventListener("click", (e) => { if (e.target === scrim) closeQuickView(); });
    scrim.querySelector(".qv__close").addEventListener("click", closeQuickView);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeQuickView(); });
    qvBuilt = true;
  }
  function closeQuickView() {
    const s = $("#qv-scrim"); if (s) s.classList.remove("open");
    document.body.style.overflow = "";
  }
  function openQuickView(p) {
    buildQuickView();
    const scrim = $("#qv-scrim");
    const state = { color: p.color, size: "M" };
    const art = $("#qv-art");

    let touched = false;
    const draw = () => {
      art.innerHTML = "";
      if (!touched && p.img) art.appendChild(productPhoto({ cat: p.cat, color: state.color, name: p.name, img: p.img }));
      else art.appendChild(renderGarment({ cat: p.cat, color: state.color }));
    };
    draw();
    $("#qv-id").textContent = p.id;
    $("#qv-tag").textContent = p.tag;
    $("#qv-name").textContent = p.name;
    $("#qv-desc").textContent = p.desc;
    $("#qv-price").textContent = dzd(p.price);

    const sw = $("#qv-sw"); sw.innerHTML = "";
    (typeof INK_COLORS !== "undefined" ? INK_COLORS : []).slice(0, 8).forEach(col => {
      const b = document.createElement("button");
      b.className = "qv__sw" + (col.hex === state.color ? " active" : "");
      b.style.background = col.hex; b.title = col.name; b.setAttribute("aria-label", col.name);
      b.addEventListener("click", () => {
        state.color = col.hex;
        touched = true;
        sw.querySelectorAll(".qv__sw").forEach(x => x.classList.toggle("active", x === b));
        draw(); syncLinks();
      });
      sw.appendChild(b);
    });

    const sizes = $("#qv-sizes"); sizes.innerHTML = "";
    (typeof SIZES !== "undefined" ? SIZES : ["S","M","L","XL"]).forEach(sz => {
      const b = document.createElement("button");
      b.className = "qv__size" + (sz === state.size ? " active" : "");
      b.textContent = sz;
      b.addEventListener("click", () => {
        state.size = sz;
        sizes.querySelectorAll(".qv__size").forEach(x => x.classList.toggle("active", x === b));
      });
      sizes.appendChild(b);
    });

    function syncLinks() {
      $("#qv-perso").href = `${link("studio.html")}?product=${p.id}&color=${encodeURIComponent(state.color)}`;
    }
    syncLinks();

    const addBtn = $("#qv-add");
    addBtn.onclick = (e) => {
      EmpreinteCart.add({ id: p.id, name: p.name, cat: p.cat, color: state.color, price: p.price, size: state.size, custom: null, logo: null });
      flyToCart(e.currentTarget, state.color);
      empToast(`<b>+1</b> ${empEsc(p.name)} ajouté`);
      closeQuickView();
    };

    scrim.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function heroTeaser() {
    const stage = $("#hero-garment");
    if (!stage) return;
    stage.innerHTML = "";

    const wrap = document.createElement("div");
    wrap.className = "photo-wrap";
    const mock = productPhoto({ cat: "tshirt", color: "#ff4a1c", name: "T-shirt EMPREINTE" });
    wrap.appendChild(mock);
    const real = new Image();
    real.onload = () => { wrap.innerHTML = ""; real.className = "product-photo"; real.alt = "Pièces personnalisées EMPREINTE"; wrap.appendChild(real); };
    real.src = (typeof asset === "function") ? asset("photos/hero-tshirt.jpg") : "images/photos/hero-tshirt.jpg";
    stage.appendChild(wrap);
  }

  function categoryTiles() {
    const grid = $("#cats-grid"); if (!grid) return;
    const cats = [
      { key: "tshirt", n: "01", name: "T-Shirts",  color: "#16130f", img: "photos/tshirt.jpg" },
      { key: "polo",   n: "02", name: "Polos",      color: "#1f2ee6", img: "photos/polo.jpg" },
      { key: "hoodie", n: "03", name: "Hoodies",    color: "#ff4a1c", img: "photos/hoodie.jpg" },
      { key: "cap",    n: "04", name: "Casquettes", color: "#1f6b3f", img: "photos/cap.jpg" },
      { key: "bag",    n: "05", name: "Tote bags",  color: "#6e1422", img: "photos/bag.jpg" }
    ];
    cats.forEach(c => {
      const a = document.createElement("a");
      a.className = "cat-tile reveal"; a.href = link("produits.html") + "?cat=" + c.key;
      const art = document.createElement("div"); art.className = "cat-tile__art";
      art.appendChild(productPhoto({ cat: c.key, color: c.color, img: c.img }));
      a.appendChild(art);
      a.insertAdjacentHTML("beforeend",
        `<span class="cat-tile__n">${c.n}</span><span class="cat-tile__name">${c.name}</span><span class="cat-tile__go">Explorer →</span>`);
      grid.appendChild(a);
    });
  }

  function popularGrid() {
    const grid = $("#popular-grid"); if (!grid) return;
    ["TS-02", "HO-03", "PO-01", "CA-02", "TS-01", "HO-02"].forEach(id => {
      const p = EMPREINTE_PRODUCTS.find(x => x.id === id); if (p) grid.appendChild(card(p));
    });
  }

  function catalogue() {
    const grid = $("#product-grid"); if (!grid) return;
    const filterBar = $("#filter-bar"), search = $("#prod-search"), countEl = $("#prod-count");
    let active = new URLSearchParams(location.search).get("cat") || "all";
    let query = "";

    EMPREINTE_CATEGORIES.forEach(c => {
      const b = document.createElement("button");
      b.className = "filter-pill" + (c.key === active ? " active" : "");
      b.textContent = c.label; b.dataset.key = c.key;
      b.addEventListener("click", () => {
        active = c.key;
        filterBar.querySelectorAll(".filter-pill").forEach(x => x.classList.toggle("active", x.dataset.key === active));
        apply();
      });
      filterBar.appendChild(b);
    });

    if (search) search.addEventListener("input", () => { query = search.value.trim().toLowerCase(); apply(); });

    function apply() {
      const list = EMPREINTE_PRODUCTS.filter(p =>
        (active === "all" || p.cat === active) &&
        (!query || (p.name + " " + p.desc + " " + p.tag).toLowerCase().includes(query)));
      grid.innerHTML = "";
      if (!list.length) {
        grid.innerHTML = `<p class="prod-none">Aucune pièce ne correspond. <button class="link-reset">Réinitialiser</button></p>`;
        grid.querySelector(".link-reset").addEventListener("click", () => {
          active = "all"; query = ""; if (search) search.value = "";
          filterBar.querySelectorAll(".filter-pill").forEach(x => x.classList.toggle("active", x.dataset.key === "all"));
          apply();
        });
      } else {
        list.forEach((p, i) => { const c = card(p); c.dataset.delay = (i % 4) + 1; grid.appendChild(c); });
      }
      if (countEl) countEl.textContent = String(list.length).padStart(2, "0");

      grid.querySelectorAll(".reveal").forEach(r => r.classList.add("in"));
    }
    apply();
  }
})();
