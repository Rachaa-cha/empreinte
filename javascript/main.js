(function () {
  "use strict";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    buildCurtain();
    buildToastWrap();
    wireNav();
    wireReveal();
    wireTicker();
    wireMagnetic();
    wireDrawer();
    refreshCartBadge();
    setYear();

    const curtain = $(".curtain");
    if (curtain && !reduce) curtain.classList.add("lift");
    else if (curtain) curtain.style.display = "none";
  }

  function buildCurtain() {
    if ($(".curtain")) return;
    const c = el("div", "curtain");
    c.innerHTML = '<span class="curtain__logo">EMPREINTE</span>';
    document.body.appendChild(c);

    document.addEventListener("click", e => {
      const a = e.target.closest("a");
      if (!a || reduce) return;
      const href = a.getAttribute("href");
      if (!href || a.target === "_blank" || href.startsWith("#") ||
          href.startsWith("http") || href.startsWith("mailto") || a.hasAttribute("data-no-curtain")) return;
      e.preventDefault();
      c.classList.remove("lift");
      c.classList.add("drop");
      setTimeout(() => { location.href = href; }, 520);
    });
  }

  function wireNav() {
    const nav = $(".nav");
    if (nav) {
      const onScroll = () => nav.classList.toggle("scrolled", scrollY > 20);
      onScroll(); addEventListener("scroll", onScroll, { passive: true });
    }
    const burger = $(".nav__burger"), menu = $(".mobile-menu");
    if (burger && menu) {
      burger.addEventListener("click", () => {
        const open = menu.classList.toggle("open");
        document.body.classList.toggle("menu-open", open);
        burger.setAttribute("aria-expanded", open);
      });
      $$(".mobile-menu a").forEach(a => a.addEventListener("click", () => {
        menu.classList.remove("open"); document.body.classList.remove("menu-open");
      }));
    }
  }

  let revealIO = null;
  function wireReveal() {
    if (reduce) { $$(".reveal, .reveal-clip").forEach(i => i.classList.add("in")); return; }
    revealIO = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); revealIO.unobserve(en.target); } });
    }, { threshold: .12, rootMargin: "0px 0px -6% 0px" });
    revealScan();
  }

  function revealScan() {
    if (reduce || !revealIO) { $$(".reveal:not(.in), .reveal-clip:not(.in)").forEach(i => i.classList.add("in")); return; }
    $$(".reveal:not(.in), .reveal-clip:not(.in)").forEach(i => revealIO.observe(i));
  }
  window.empRevealScan = revealScan;

  function wireTicker() {
    $$(".ticker__track").forEach(t => {
      if (t.dataset.cloned) return;
      t.innerHTML += t.innerHTML; t.dataset.cloned = "1";
    });
  }

  function wireMagnetic() {
    if (innerWidth < 860 || reduce) return;
    $$(".magnetic").forEach(m => {
      m.addEventListener("mousemove", e => {
        const r = m.getBoundingClientRect();
        const mx = e.clientX - r.left - r.width / 2;
        const my = e.clientY - r.top - r.height / 2;
        m.style.transform = `translate(${mx * .25}px, ${my * .35}px)`;
      });
      m.addEventListener("mouseleave", () => m.style.transform = "");
    });
  }

  const KEY = "empreinte_cart";
  const Cart = {
    read() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } },
    write(c) { localStorage.setItem(KEY, JSON.stringify(c)); document.dispatchEvent(new CustomEvent("cart:change")); },
    add(item) {
      const c = this.read();
      item.uid = "u" + Date.now() + Math.floor(Math.random() * 999);
      item.qty = item.qty || 1;
      c.push(item); this.write(c);
    },
    setQty(uid, qty) {
      const c = this.read(); const it = c.find(i => i.uid === uid);
      if (it) { it.qty = Math.max(1, qty); this.write(c); }
    },
    remove(uid) { this.write(this.read().filter(i => i.uid !== uid)); },
    clear() { this.write([]); },
    count() { return this.read().reduce((n, i) => n + i.qty, 0); },
    total() { return this.read().reduce((n, i) => n + i.qty * i.price, 0); }
  };
  window.EmpreinteCart = Cart;

  function refreshCartBadge() {
    const n = Cart.count();
    $$(".cart-count").forEach(b => {
      const had = +b.textContent || 0;
      b.textContent = n;
      b.style.display = n ? "grid" : "none";
      if (n !== had) { b.classList.remove("pop"); void b.offsetWidth; b.classList.add("pop"); }
    });
  }
  document.addEventListener("cart:change", () => { refreshCartBadge(); renderDrawer(); });

  function renderGarment(cfg) {
    const cat = GARMENTS[cfg.cat] ? cfg.cat : "tshirt";
    const g = GARMENTS[cat];
    const view = cfg.view === "back" ? "back" : "front";
    const color = cfg.color || "#16130f";
    const wrap = el("div", "garment");
    wrap.innerHTML = (typeof window.empGarmentSVG === "function") ? window.empGarmentSVG(cat, view) : "";
    const svg = wrap.querySelector(".gm-svg");
    if (svg) {
      svg.style.color = color;
      svg.querySelectorAll(".gm-color").forEach(p => {
        if (p.getAttribute("fill") !== "none") p.setAttribute("fill", color);
      });
    }

    const cm = cfg.custom || {};
    const z = g.zone;

    function makeArt(opts) {
      const art = el("div", "gm-art");
      Object.assign(art.style, { top: z.top + "%", left: z.left + "%", width: z.w + "%", height: z.h + "%" });
      const pos = opts.pos || { x: 0, y: 0 };
      art.style.transform =
        "translate(" + (pos.x * 0.5) + "%," + (pos.y * 0.5) + "%) rotate(" + (opts.angle || 0) + "deg) scale(" + (opts.scale || 1) + ")";
      if (opts.src) {
        const im = document.createElement("img");
        im.src = opts.src; im.alt = ""; im.style.maxWidth = "100%"; im.style.maxHeight = "100%";
        art.appendChild(im);
      }
      if (opts.text) {
        const t = document.createElement("span");
        t.textContent = opts.text;
        Object.assign(t.style, { fontFamily: opts.font || "'Anton',sans-serif", color: opts.color || "#fff",
          fontSize: "clamp(8px,2.6vw,18px)", lineHeight: "1.05", textTransform: "uppercase", wordBreak: "break-word" });
        art.appendChild(t);
      }
      wrap.appendChild(art);
    }

    if (Array.isArray(cm.layers) && cm.layers.length) {

      cm.layers.forEach(l => makeArt({
        src: l.type === "logo" ? l.src : null,
        text: l.type === "text" ? l.text : null,
        font: l.font, color: l.color, pos: { x: l.x, y: l.y }, scale: l.scale, angle: l.angle
      }));
    } else {

      const txt = cfg.text || cm.text;
      if (cfg.logo || txt) makeArt({
        src: cfg.logo || null, text: txt, font: cfg.font || cm.font, color: cfg.textColor || cm.textColor,
        pos: cm.pos, scale: cm.scale, angle: cm.angle
      });
    }
    return wrap;
  }
  window.renderGarment = renderGarment;

  function hexLuminance(hex) {
    let h = String(hex || "").replace("#", "");
    if (h.length === 3) h = h.split("").map(c => c + c).join("");
    if (h.length < 6) return 1;
    const r = parseInt(h.slice(0, 2), 16) / 255;
    const g = parseInt(h.slice(2, 4), 16) / 255;
    const b = parseInt(h.slice(4, 6), 16) / 255;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  window.empHexLuminance = hexLuminance;

  const MOCK_CATS = { tshirt: 1, polo: 1, hoodie: 1, cap: 1 };
  function makeGarmentCanvas(opts) {
    const cv = document.createElement("canvas");
    cv.className = "gm-canvas" + (opts.cls ? " " + opts.cls : "");
    const ctx = cv.getContext("2d");
    const L = {}; let curColor = opts.color || "#e7dfcd";
    let need = 1 + 1 + (opts.shade ? 1 : 0), got = 0, ready = false;

    const inkBuf = document.createElement("canvas");
    const inkCtx = inkBuf.getContext("2d");

    function tintedInk(tint) {
      const w = cv.width, h = cv.height;
      inkBuf.width = w; inkBuf.height = h;
      inkCtx.clearRect(0, 0, w, h);
      inkCtx.globalCompositeOperation = "source-over";
      inkCtx.drawImage(L.ink, 0, 0, w, h);
      inkCtx.globalCompositeOperation = "source-in";
      inkCtx.fillStyle = tint;
      inkCtx.fillRect(0, 0, w, h);
      inkCtx.globalCompositeOperation = "source-over";
      return inkBuf;
    }
    function paint() {
      const w = cv.width, h = cv.height; if (!w) return;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over"; ctx.drawImage(L.fill, 0, 0, w, h);
      ctx.globalCompositeOperation = "source-in"; ctx.fillStyle = curColor; ctx.fillRect(0, 0, w, h);
      if (L.shade) { ctx.globalCompositeOperation = "multiply"; ctx.drawImage(L.shade, 0, 0, w, h); }
      else if (opts.softShade) {

        ctx.globalCompositeOperation = "source-atop";
        const hi = ctx.createRadialGradient(w * 0.42, h * 0.30, w * 0.04, w * 0.5, h * 0.5, w * 0.62);
        hi.addColorStop(0, "rgba(255,255,255,0.28)");
        hi.addColorStop(0.5, "rgba(255,255,255,0.04)");
        hi.addColorStop(1, "rgba(0,0,0,0.16)");
        ctx.fillStyle = hi; ctx.fillRect(0, 0, w, h);
        const sh = ctx.createLinearGradient(0, h * 0.45, 0, h);
        sh.addColorStop(0, "rgba(0,0,0,0)");
        sh.addColorStop(1, "rgba(0,0,0,0.18)");
        ctx.fillStyle = sh; ctx.fillRect(0, 0, w, h);
      }
      ctx.globalCompositeOperation = "source-over";
      const lum = hexLuminance(curColor);
      if (lum < 0.42) {

        const tint = "rgba(240,234,222," + (lum < 0.18 ? 0.72 : 0.6) + ")";
        ctx.drawImage(tintedInk(tint), 0, 0, w, h);
      } else {
        ctx.drawImage(L.ink, 0, 0, w, h);
      }
    }
    function done() {
      if (++got < need) return;
      cv.width = L.fill.naturalWidth || 500; cv.height = L.fill.naturalHeight || 500;
      ready = true; paint();
    }
    function load(key, src) { const im = new Image(); im.onload = () => { L[key] = im; done(); }; im.onerror = done; im.src = src; }
    load("fill", opts.fill); load("ink", opts.ink); if (opts.shade) load("shade", opts.shade);
    cv._setColor = (c) => { curColor = c; if (ready) paint(); };
    return cv;
  }

  function renderFlat(cfg) {
    const cat = (typeof STUDIO_FLATS !== "undefined" && STUDIO_FLATS[cfg.cat]) ? cfg.cat : null;
    if (!cat) return renderGarment(cfg);
    const f = STUDIO_FLATS[cat];
    const wrap = el("div", "flat");
    wrap.appendChild(makeGarmentCanvas({ fill: asset(f.fill), ink: asset(f.ink), color: cfg.color || "#e7dfcd", softShade: true }));
    return wrap;
  }
  window.renderFlat = renderFlat;

  function productPhoto(cfg) {
    const cat = MOCK_CATS[cfg.cat] ? cfg.cat : null;
    const wrap = el("div", "photo-wrap");

    function mockup() {
      if (!cat) return renderGarment({ cat: cfg.cat, color: cfg.color || "#16130f" });
      return makeGarmentCanvas({
        cls: "product-photo",
        fill: asset("mockups/" + cat + "_fill.png"),
        ink:  asset("mockups/" + cat + "_ink.png"),
        shade: asset("mockups/" + cat + "_shade.png"),
        color: cfg.color || "#16130f"
      });
    }
    wrap.appendChild(mockup());

    const candidates = [];
    if (cfg.img) candidates.push(asset(cfg.img));
    if (cat) { candidates.push(asset("photos/" + cat + ".jpg")); candidates.push(asset("photos/" + cat + ".png")); }
    let i = 0;
    (function tryNext() {
      if (i >= candidates.length) return;
      const real = new Image();
      real.onload = () => { wrap.innerHTML = ""; real.className = "product-photo"; real.alt = cfg.name || cat || ""; wrap.appendChild(real); };
      real.onerror = () => { i++; tryNext(); };
      real.src = candidates[i];
    })();
    return wrap;
  }
  window.productPhoto = productPhoto;

  function wireDrawer() {

    if (!$(".drawer")) {
      const scrim = el("div", "drawer-scrim");
      const drawer = el("aside", "drawer");
      drawer.setAttribute("aria-label", "Panier");
      drawer.innerHTML = `
        <div class="drawer__head">
          <h3>Ton Panier</h3>
          <button class="drawer__close" type="button">Fermer ✕</button>
        </div>
        <div class="drawer__body"></div>
        <div class="drawer__foot">
          <div class="drawer__total"><span>Sous-total</span><span class="drawer__totval">0 DA</span></div>
          <a class="btn btn-red btn-block magnetic drawer__checkout" href="${link("panier.html")}">Voir le panier <span class="arrow">→</span></a>
        </div>`;
      document.body.append(scrim, drawer);
      scrim.addEventListener("click", closeDrawer);
      drawer.querySelector(".drawer__close").addEventListener("click", closeDrawer);
    }
    $$('[data-cart-open]').forEach(b => b.addEventListener("click", e => { e.preventDefault(); openDrawer(); }));
    renderDrawer();
  }
  function openDrawer() { $(".drawer-scrim").classList.add("open"); $(".drawer").classList.add("open"); renderDrawer(); }
  function closeDrawer() { $(".drawer-scrim").classList.remove("open"); $(".drawer").classList.remove("open"); }
  window.EmpreinteOpenDrawer = openDrawer;

  function renderDrawer() {
    const body = $(".drawer__body"); if (!body) return;
    const items = Cart.read();
    if (!items.length) { body.innerHTML = '<p class="cart-empty">Ton panier attend ta première empreinte.</p>'; }
    else {
      body.innerHTML = "";
      items.forEach(it => {
        const line = el("div", "cart-line");
        const thumb = el("div", "cart-line__thumb");
        const gm = renderGarment(it); gm.classList.add("gm"); thumb.appendChild(gm);
        const info = el("div", "cart-line__info");
        const meta = [GARMENTS[it.cat]?.label, it.size, it.custom ? "Personnalisé" : null].filter(Boolean).join(" · ");
        info.innerHTML = `<h4>${esc(it.name)}</h4><div class="cart-line__meta">${meta}</div>`;
        const row = el("div", "cart-line__row");
        const qty = el("div", "qty");
        qty.innerHTML = `<button aria-label="moins">−</button><span>${it.qty}</span><button aria-label="plus">+</button>`;
        qty.children[0].onclick = () => Cart.setQty(it.uid, it.qty - 1);
        qty.children[2].onclick = () => Cart.setQty(it.uid, it.qty + 1);
        const price = el("div", "cart-line__price"); price.textContent = dzd(it.qty * it.price);
        row.append(qty, price);
        const rm = el("button", "cart-line__rm"); rm.textContent = "Retirer"; rm.onclick = () => Cart.remove(it.uid);
        info.append(row, rm);
        line.append(thumb, info);
        body.appendChild(line);
      });
    }
    const tv = $(".drawer__totval"); if (tv) tv.textContent = dzd(Cart.total());
  }

  function buildToastWrap() { if (!$(".toast-wrap")) document.body.appendChild(el("div", "toast-wrap")); }
  function toast(msg, type) {
    const t = el("div", "toast" + (type === "err" ? " err" : ""));
    t.innerHTML = msg;
    $(".toast-wrap").appendChild(t);
    setTimeout(() => { t.style.opacity = "0"; t.style.transition = "opacity .4s"; setTimeout(() => t.remove(), 400); }, 2600);
  }
  window.empToast = toast;

  window.flyToCart = function (sourceEl, color) {
    const target = $(".cart-count") || $('[data-cart-open]');
    if (!sourceEl || !target || reduce) { return; }
    const s = sourceEl.getBoundingClientRect(), t = target.getBoundingClientRect();
    const f = el("div");
    Object.assign(f.style, { position: "fixed", left: s.left + s.width / 2 + "px", top: s.top + s.height / 2 + "px",
      width: "26px", height: "26px", borderRadius: "50%", background: color || "var(--red)", zIndex: 10001,
      transform: "translate(-50%,-50%)", transition: "all .8s cubic-bezier(.16,1,.3,1)", pointerEvents: "none" });
    document.body.appendChild(f);
    requestAnimationFrame(() => {
      f.style.left = t.left + t.width / 2 + "px"; f.style.top = t.top + t.height / 2 + "px";
      f.style.width = "8px"; f.style.height = "8px"; f.style.opacity = ".4";
    });
    setTimeout(() => f.remove(), 850);
  };

  function setYear() { $$("[data-year]").forEach(e => e.textContent = new Date().getFullYear()); }
  function el(tag, cls) { const e = document.createElement(tag); if (cls) e.className = cls; return e; }
  function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }
  window.empEsc = esc;
})();
