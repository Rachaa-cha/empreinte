(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!$(".studio")) return;

  const BASE = { tshirt: 1900, polo: 3200, hoodie: 4900, cap: 1600, bag: 1400 };
  const ADD_TEXT = 300, ADD_LOGO = 500;

  const state = {
    cat: "tshirt",
    color: "#e7dfcd",
    size: "M",

    font: PRINT_FONTS[0].css,
    textColor: "#16130f",
    qty: 1,
    layers: [],
    selectedId: null,
    productId: null,
    productName: null
  };
  let uid = 0;
  const nextId = () => "L" + (++uid);

  const params = new URLSearchParams(location.search);
  const pid = params.get("product");
  if (pid) {
    const p = EMPREINTE_PRODUCTS.find(x => x.id === pid);
    if (p) { state.cat = p.cat; state.color = p.color; state.productId = p.id; state.productName = p.name; }
  }
  const preColor = params.get("color");
  if (preColor && /^#?[0-9a-fA-F]{3,8}$/.test(preColor)) {
    state.color = preColor.startsWith("#") ? preColor : "#" + preColor;
  }

  const stage    = $("#stage");
  const garment  = $("#studio-garment");
  const layersEl = $("#layers-stage");
  const ripple   = $("#ripple");

  function buildRail() {
    const rail = $("#garment-rail");
    Object.keys(STUDIO_FLATS).forEach(key => {
      const b = document.createElement("button");
      b.className = "rail__btn" + (key === state.cat ? " active" : "");
      b.dataset.cat = key;
      b.dataset.label = GARMENTS[key].label;
      b.dataset.price = dzd(BASE[key] || 0);
      b.setAttribute("aria-label", GARMENTS[key].label);
      b.appendChild(window.renderFlat({ cat: key, color: "#d8cfba" }));
      b.addEventListener("click", () => {
        if (state.cat === key) return;
        state.cat = key;
        $$(".rail__btn").forEach(x => x.classList.toggle("active", x === b));
        renderGarment(); syncPanelTitle(); price();
        swapAnim();
      });
      rail.appendChild(b);
    });
  }

  function renderGarment() {
    garment.innerHTML = "";
    garment.appendChild(window.renderFlat({ cat: state.cat, color: state.color }));
    $("#stage-code").textContent = "EMP—" + state.cat.slice(0, 2).toUpperCase();
  }
  function repaint() {
    const cv = garment.querySelector(".gm-canvas");
    if (cv && cv._setColor) cv._setColor(state.color);
    else renderGarment();
  }

  function frontGeo() {
    const f = (typeof STUDIO_FLATS !== "undefined" && STUDIO_FLATS[state.cat]) || null;
    return f ? f.center : { x: 26, y: 46 };
  }
  function swapAnim() {
    if (reduce) return;
    garment.classList.remove("swap-in"); void garment.offsetWidth; garment.classList.add("swap-in");
  }
  function syncPanelTitle() {
    $("#panel-title").textContent = state.productName || GARMENTS[state.cat].label;
  }

  function buildColors() {
    const grid = $("#color-grid");
    INK_COLORS.forEach(c => {
      const s = document.createElement("button");
      s.className = "swatch" + (c.hex === state.color ? " active" : "");
      s.style.background = c.hex; s.title = c.name; s.setAttribute("aria-label", c.name);
      s.addEventListener("click", () => {
        state.color = c.hex;
        $$("#color-grid .swatch").forEach(x => x.classList.toggle("active", x === s));
        $("#color-custom").value = c.hex.length === 7 ? c.hex : "#16130f";
        repaint();
      });
      grid.appendChild(s);
    });
    $("#color-custom").addEventListener("input", e => {
      state.color = e.target.value;
      $$("#color-grid .swatch").forEach(x => x.classList.remove("active"));
      repaint();
    });
  }

  function buildSizes() {
    const grid = $("#size-grid");
    SIZES.forEach(sz => {
      const b = document.createElement("button");
      b.className = "size-btn" + (sz === state.size ? " active" : "");
      b.textContent = sz;
      b.addEventListener("click", () => {
        state.size = sz;
        $$(".size-btn").forEach(x => x.classList.toggle("active", x === b));
        summaryName();
      });
      grid.appendChild(b);
    });
  }

  function selectedLayer() { return state.layers.find(l => l.id === state.selectedId) || null; }

  function buildText() {
    const input = $("#txt-input");
    const preview = $("#font-preview");

    input.addEventListener("input", () => {
      const sel = selectedLayer();
      if (preview) preview.textContent = input.value.trim() || "Empreinte";
      if (sel && sel.type === "text") { sel.text = input.value.trim(); drawLayer(sel); }
    });

    input.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); addTextLayer(); } });

    const sel = $("#font-select");
    const groups = {};
    PRINT_FONTS.forEach(f => { (groups[f.group || "Polices"] ||= []).push(f); });
    Object.keys(groups).forEach(gName => {
      const og = document.createElement("optgroup");
      og.label = gName.toUpperCase();
      groups[gName].forEach(f => {
        const o = document.createElement("option");
        o.value = f.css; o.textContent = f.name; o.style.fontFamily = f.css;
        og.appendChild(o);
      });
      sel.appendChild(og);
    });
    sel.value = state.font;
    if (preview) preview.style.fontFamily = state.font;

    sel.addEventListener("change", () => {
      state.font = sel.value;
      if (preview) {
        preview.style.fontFamily = state.font;
        preview.classList.remove("flip"); void preview.offsetWidth; preview.classList.add("flip");
      }
      const l = selectedLayer();
      if (l && l.type === "text") { l.font = state.font; drawLayer(l); }
    });

    const tc = $("#txt-color");
    INK_COLORS.forEach(c => {
      const s = document.createElement("button");
      s.className = "swatch" + (c.hex === state.textColor ? " active" : "");
      s.style.background = c.hex; s.title = c.name; s.setAttribute("aria-label", "Encre " + c.name);
      s.addEventListener("click", () => {
        state.textColor = c.hex;
        $$("#txt-color .swatch").forEach(x => x.classList.toggle("active", x === s));
        const l = selectedLayer();
        if (l && l.type === "text") { l.color = c.hex; drawLayer(l); }
      });
      tc.appendChild(s);
    });

    $("#txt-add").addEventListener("click", addTextLayer);
  }

  function buildLogo() {
    const input = $("#logo-input");
    const label = $("#upload-label");
    function readFile(file) {
      if (!file || !file.type.startsWith("image/")) { window.empToast("Fichier image uniquement", "bad"); return; }
      const fr = new FileReader();
      fr.onload = () => { addLogoLayer(fr.result); window.empToast("Logo ajouté ✦"); };
      fr.readAsDataURL(file);
    }
    input.addEventListener("change", e => { readFile(e.target.files[0]); input.value = ""; });
    ["dragover", "dragenter"].forEach(ev => label.addEventListener(ev, e => { e.preventDefault(); label.classList.add("drag"); }));
    ["dragleave", "drop"].forEach(ev => label.addEventListener(ev, e => { e.preventDefault(); label.classList.remove("drag"); }));
    label.addEventListener("drop", e => { if (e.dataTransfer.files[0]) readFile(e.dataTransfer.files[0]); });
  }

  function spawnOffset() {
    const n = state.layers.length;
    return { x: (n % 4) * 3 - 4, y: (n % 4) * 3 - 4 };
  }

  function addTextLayer() {
    const txt = $("#txt-input").value.trim();
    if (!txt) { window.empToast("Tape un texte d'abord", "bad"); $("#txt-input").focus(); return; }
    const o = spawnOffset();
    const layer = { id: nextId(), type: "text", text: txt, font: state.font, color: state.textColor,
                    x: o.x, y: o.y, scale: 1, angle: 0 };
    state.layers.push(layer);
    mountLayer(layer);
    selectLayer(layer.id);
    $("#txt-input").value = "";
    renderLayersList(); price();
    window.empToast("Calque texte ajouté ✦");
  }

  function addLogoLayer(src) {
    const o = spawnOffset();
    const layer = { id: nextId(), type: "logo", src, x: o.x, y: o.y, scale: 1, angle: 0 };
    state.layers.push(layer);
    mountLayer(layer);
    selectLayer(layer.id);
    renderLayersList(); price();
  }

  function mountLayer(layer) {
    const el = document.createElement("div");
    el.className = "layer";
    el.dataset.id = layer.id;
    el.innerHTML =
      '<div class="layer__content"></div>' +
      '<span class="layer__frame" aria-hidden="true"></span>' +
      '<span class="layer__h tl" data-handle="tl"></span>' +
      '<span class="layer__h tr" data-handle="tr"></span>' +
      '<span class="layer__h bl" data-handle="bl"></span>' +
      '<span class="layer__h br" data-handle="br"></span>' +
      '<span class="layer__rot" data-handle="rot">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 4v5h-5"/></svg>' +
      '</span>' +
      '<button class="layer__del" data-handle="del" title="Supprimer" aria-label="Supprimer le calque">✕</button>';
    layersEl.appendChild(el);
    layer._el = el;
    wireLayer(layer);
    drawLayer(layer);
  }

  function drawLayer(layer) {
    const el = layer._el; if (!el) return;
    const content = el.querySelector(".layer__content");
    if (layer.type === "text") {
      content.innerHTML = "";
      content.textContent = layer.text || "";
      content.style.fontFamily = layer.font;
      content.style.color = layer.color;
      content.classList.add("is-text"); content.classList.remove("is-logo");
    } else {
      content.classList.add("is-logo"); content.classList.remove("is-text");
      content.style.cssText = "";
      content.innerHTML = "";
      const im = document.createElement("img");
      im.src = layer.src; im.alt = ""; im.draggable = false;
      content.appendChild(im);
    }
    placeLayer(layer);
  }

  function placeLayer(layer) {
    const c = frontGeo();
    const el = layer._el; if (!el) return;
    el.style.left = (c.x + layer.x) + "%";
    el.style.top = (c.y + layer.y) + "%";
    el.style.transform =
      "translate(-50%,-50%) rotate(" + layer.angle.toFixed(1) + "deg) scale(" + layer.scale.toFixed(3) + ")";
  }

  function selectLayer(id) {
    state.selectedId = id;
    $$(".layer", layersEl).forEach(n => n.classList.toggle("selected", n.dataset.id === id));
    $$("#layers-list .lyr").forEach(n => n.classList.toggle("active", n.dataset.id === id));

    const l = selectedLayer();
    if (l && l.type === "text") {
      $("#txt-input").value = l.text;
      $("#font-select").value = l.font;
      const fp = $("#font-preview"); if (fp) { fp.textContent = l.text || "Empreinte"; fp.style.fontFamily = l.font; }
      state.font = l.font; state.textColor = l.color;
      $$("#txt-color .swatch").forEach(s => s.classList.toggle("active", s.style.background === l.color || rgbToHex(s.style.background) === l.color));
    }
  }
  function deselect() {
    state.selectedId = null;
    $$(".layer", layersEl).forEach(n => n.classList.remove("selected"));
    $$("#layers-list .lyr").forEach(n => n.classList.remove("active"));
  }

  function deleteLayer(id) {
    const i = state.layers.findIndex(l => l.id === id);
    if (i < 0) return;
    const [removed] = state.layers.splice(i, 1);
    if (removed._el) removed._el.remove();
    if (state.selectedId === id) deselect();
    renderLayersList(); price();
    window.empToast("Calque supprimé");
  }

  function reorder(id, dir) {
    const i = state.layers.findIndex(l => l.id === id);
    if (i < 0) return;
    const j = dir === "front" ? state.layers.length - 1 : 0;
    if (i === j) return;
    const [l] = state.layers.splice(i, 1);
    if (dir === "front") state.layers.push(l); else state.layers.unshift(l);

    state.layers.forEach(layer => layersEl.appendChild(layer._el));
    renderLayersList();
  }

  function renderLayersList() {
    const list = $("#layers-list");
    const empty = $("#layers-empty");
    list.innerHTML = "";
    empty.hidden = state.layers.length > 0;

    [...state.layers].reverse().forEach(l => {
      const li = document.createElement("li");
      li.className = "lyr" + (l.id === state.selectedId ? " active" : "");
      li.dataset.id = l.id;
      const label = l.type === "text" ? (l.text || "Texte") : "Logo";
      const icon = l.type === "text" ? "T" : "▦";
      li.innerHTML =
        '<button class="lyr__pick" type="button"><span class="lyr__icon">' + icon + '</span>' +
        '<span class="lyr__name">' + window.empEsc(label) + '</span></button>' +
        '<span class="lyr__tools">' +
          '<button class="lyr__btn" data-act="front" title="Premier plan" aria-label="Mettre au premier plan">⤒</button>' +
          '<button class="lyr__btn" data-act="back" title="Arrière-plan" aria-label="Mettre en arrière-plan">⤓</button>' +
          '<button class="lyr__btn del" data-act="del" title="Supprimer" aria-label="Supprimer">✕</button>' +
        '</span>';
      li.querySelector(".lyr__pick").addEventListener("click", () => selectLayer(l.id));
      li.querySelector('[data-act="front"]').addEventListener("click", () => reorder(l.id, "front"));
      li.querySelector('[data-act="back"]').addEventListener("click", () => reorder(l.id, "back"));
      li.querySelector('[data-act="del"]').addEventListener("click", () => deleteLayer(l.id));
      list.appendChild(li);
    });
  }

  function wireLayer(layer) {
    const el = layer._el;
    let mode = null, sx = 0, sy = 0, ox = 0, oy = 0, startScale = 1, startAngle = 0;
    let cxPx = 0, cyPx = 0, startDist = 1, startPointerAng = 0;

    function centre() { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }
    function start(e, m) {
      mode = m;
      el.setPointerCapture(e.pointerId);
      sx = e.clientX; sy = e.clientY; ox = layer.x; oy = layer.y;
      startScale = layer.scale; startAngle = layer.angle;
      const c = centre(); cxPx = c.x; cyPx = c.y;
      startDist = Math.hypot(e.clientX - cxPx, e.clientY - cyPx) || 1;
      startPointerAng = Math.atan2(e.clientY - cyPx, e.clientX - cxPx);
      e.preventDefault(); e.stopPropagation();
    }

    el.addEventListener("pointerdown", e => {
      selectLayer(layer.id);
      const h = e.target.dataset && e.target.dataset.handle;
      if (h === "del") { deleteLayer(layer.id); return; }
      if (h) start(e, h === "rot" ? "rot" : "resize");
      else start(e, "move");
    });

    el.addEventListener("pointermove", e => {
      if (!mode) return;
      if (mode === "move") {
        const r = stage.getBoundingClientRect();
        layer.x = Math.max(-48, Math.min(48, ox + ((e.clientX - sx) / r.width) * 100));
        layer.y = Math.max(-48, Math.min(48, oy + ((e.clientY - sy) / r.height) * 100));
      } else if (mode === "resize") {
        const dist = Math.hypot(e.clientX - cxPx, e.clientY - cyPx) || 1;
        layer.scale = Math.max(0.2, Math.min(5, startScale * (dist / startDist)));
      } else if (mode === "rot") {
        const ang = Math.atan2(e.clientY - cyPx, e.clientX - cxPx);
        let deg = startAngle + (ang - startPointerAng) * 180 / Math.PI;
        const snap = Math.round(deg / 45) * 45;
        if (Math.abs(deg - snap) < 5) deg = snap;
        layer.angle = deg;
      }
      placeLayer(layer);
      updateAxis(layer);
    });

    function end(e) { if (!mode) return; mode = null; try { el.releasePointerCapture(e.pointerId); } catch (_) {} }
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
  }

  function updateAxis(layer) {
    const axis = $(".stage-axis"); if (!axis) return;
    axis.textContent = "x:" + layer.x.toFixed(1) + " / y:" + layer.y.toFixed(1) +
      " · " + Math.round(layer.scale * 100) + "% · " + Math.round(layer.angle) + "°";
  }

  function buildStageInput() {
    stage.addEventListener("pointerdown", e => {
      if (!e.target.closest(".layer")) deselect();
    });
    document.addEventListener("keydown", e => {
      const l = selectedLayer(); if (!l) return;
      const tag = (document.activeElement && document.activeElement.tagName) || "";
      if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;
      if (e.key === "Delete" || e.key === "Backspace") { deleteLayer(l.id); e.preventDefault(); return; }
      const step = e.shiftKey ? 4 : 1;
      if (e.key === "ArrowLeft")  { l.x -= step; placeLayer(l); updateAxis(l); e.preventDefault(); }
      else if (e.key === "ArrowRight") { l.x += step; placeLayer(l); updateAxis(l); e.preventDefault(); }
      else if (e.key === "ArrowUp")    { l.y -= step; placeLayer(l); updateAxis(l); e.preventDefault(); }
      else if (e.key === "ArrowDown")  { l.y += step; placeLayer(l); updateAxis(l); e.preventDefault(); }
    });
  }

  function buildQty() {
    $("#qty-minus").addEventListener("click", () => { state.qty = Math.max(1, state.qty - 1); $("#qty-val").textContent = state.qty; price(); });
    $("#qty-plus").addEventListener("click", () => { state.qty = Math.min(99, state.qty + 1); $("#qty-val").textContent = state.qty; price(); });
  }

  function unitPrice() {
    let base = state.productId
      ? (EMPREINTE_PRODUCTS.find(p => p.id === state.productId)?.price || BASE[state.cat])
      : BASE[state.cat];
    state.layers.forEach(l => base += (l.type === "text" ? ADD_TEXT : ADD_LOGO));
    return base;
  }
  function price() {
    $("#sum-unit").textContent = dzd(unitPrice());
    tweenTotal(unitPrice() * state.qty);
    summaryName();
  }
  function summaryName() {
    $("#sum-name").textContent = (state.productName || GARMENTS[state.cat].label) + " · " + state.size;
  }
  let shown = 0;
  function tweenTotal(target) {
    const node = $("#sum-total");
    node.classList.remove("bump"); void node.offsetWidth; node.classList.add("bump");
    if (reduce) { node.textContent = dzd(target); shown = target; return; }
    const from = shown, t0 = performance.now(), dur = 420;
    (function step(t) {
      const k = Math.min(1, (t - t0) / dur);
      const v = Math.round(from + (target - from) * (1 - Math.pow(1 - k, 3)));
      node.textContent = dzd(v);
      if (k < 1) requestAnimationFrame(step); else shown = target;
    })(performance.now());
  }

  function buildStamp() {
    $("#stamp-btn").addEventListener("click", () => {
      if (!state.layers.length) { window.empToast("Ajoute un calque d'abord", "bad"); return; }
      const c = frontGeo();
      const l = selectedLayer();
      ripple.style.left = (c.x + (l ? l.x : 0)) + "%";
      ripple.style.top = (c.y + (l ? l.y : 0)) + "%";
      ripple.classList.remove("go"); void ripple.offsetWidth; ripple.classList.add("go");
      stage.classList.remove("pressed"); void stage.offsetWidth; stage.classList.add("pressed");
      window.empToast("Empreinte tamponnée ✦");
    });
  }

  function buildAdd() {
    $("#add-btn").addEventListener("click", e => {

      const first = state.layers[0] || null;
      const custom = state.layers.length ? {
        text: first && first.type === "text" ? first.text : "",
        textColor: first && first.type === "text" ? first.color : "#16130f",
        font: first && first.type === "text" ? first.font : state.font,
        pos: first ? { x: first.x, y: first.y } : { x: 0, y: 0 },
        scale: first ? first.scale : 1,
        angle: first ? first.angle : 0,
        layers: state.layers.map(l => ({
          type: l.type, text: l.text, src: l.src, font: l.font, color: l.color,
          x: l.x, y: l.y, scale: l.scale, angle: l.angle
        }))
      } : null;
      const item = {
        id: state.productId || ("STU-" + state.cat.toUpperCase()),
        name: state.productName || ("Custom " + GARMENTS[state.cat].label),
        cat: state.cat, color: state.color, price: unitPrice(), qty: state.qty, size: state.size,
        custom,
        logo: (first && first.type === "logo") ? first.src : null
      };
      window.EmpreinteCart.add(item);
      window.flyToCart(e.currentTarget, state.color);
      window.empToast("Ajouté au panier ✦");
    });
  }

  function rgbToHex(rgb) {
    const m = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/.exec(rgb);
    if (!m) return rgb;
    return "#" + [1, 2, 3].map(i => (+m[i]).toString(16).padStart(2, "0")).join("");
  }

  buildRail(); buildColors(); buildSizes(); buildText(); buildLogo();
  buildStageInput(); buildQty(); buildStamp(); buildAdd();
  renderGarment(); syncPanelTitle(); renderLayersList(); price();
})();
