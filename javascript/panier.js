(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const root = $("#cart-page");
  if (!root) return;

  const SHIP = 400;
  const listEl  = $("#cart-list");
  const emptyEl = $("#cart-empty");
  const sumEl   = $("#cart-summary");

  function render() {
    const items = window.EmpreinteCart.read();
    listEl.innerHTML = "";

    if (!items.length) {
      emptyEl.hidden = false; sumEl.hidden = true; listEl.hidden = true;
      $("#cart-count-label").textContent = "0 pièce";
      return;
    }
    emptyEl.hidden = true; sumEl.hidden = false; listEl.hidden = false;

    items.forEach(it => listEl.appendChild(row(it)));

    const sub = window.EmpreinteCart.total();
    const count = window.EmpreinteCart.count();
    $("#cart-count-label").textContent = count + (count > 1 ? " pièces" : " pièce");
    $("#sum-sub").textContent = dzd(sub);
    $("#sum-ship").textContent = dzd(SHIP);
    $("#sum-grand").textContent = dzd(sub + SHIP);
  }

  function row(it) {
    const r = document.createElement("article");
    r.className = "cart-row reveal in";

    const thumb = document.createElement("div");
    thumb.className = "cart-row__thumb";
    thumb.style.setProperty("--dot", it.color);
    const gm = window.renderGarment({
      cat: it.cat, color: it.color,
      text: it.custom?.text, textColor: it.custom?.textColor, font: it.custom?.font, logo: it.logo
    });
    thumb.appendChild(gm);

    const info = document.createElement("div");
    info.className = "cart-row__info";
    const customBadge = it.custom || it.logo ? '<span class="tagpill">Personnalisé</span>' : "";
    info.innerHTML =
      '<div class="cart-row__top"><h3>' + window.empEsc(it.name) + '</h3>' + customBadge + '</div>' +
      '<p class="cart-row__meta">Taille ' + window.empEsc(it.size || "M") +
        ' · <span class="cdot" style="background:' + window.empEsc(it.color) + '"></span> encre' +
        (it.custom?.text ? ' · « ' + window.empEsc(it.custom.text) + ' »' : '') + '</p>' +
      '<p class="cart-row__ref">' + window.empEsc(it.id) + '</p>';

    const ctrl = document.createElement("div");
    ctrl.className = "cart-row__ctrl";
    ctrl.innerHTML =
      '<div class="qty"><button aria-label="moins">−</button><span>' + it.qty + '</span><button aria-label="plus">+</button></div>' +
      '<div class="cart-row__price">' + dzd(it.price * it.qty) + '</div>' +
      '<button class="cart-row__rm" aria-label="Retirer">✕</button>';

    const [minus, , plus] = ctrl.querySelectorAll(".qty button, .qty span");
    minus.addEventListener("click", () => { window.EmpreinteCart.setQty(it.uid, it.qty - 1); render(); });
    plus.addEventListener("click", () => { window.EmpreinteCart.setQty(it.uid, it.qty + 1); render(); });
    ctrl.querySelector(".cart-row__rm").addEventListener("click", () => {
      r.classList.add("removing");
      setTimeout(() => { window.EmpreinteCart.remove(it.uid); render(); }, 280);
    });

    r.append(thumb, info, ctrl);
    return r;
  }

  $("#order-btn").addEventListener("click", () => {
    if (!window.EmpreinteCart.read().length) return;
    const ref = "EMP-" + Date.now().toString(36).toUpperCase().slice(-6);
    const total = dzd(window.EmpreinteCart.total() + SHIP);
    showConfirm(ref, total);
    window.EmpreinteCart.clear();
    render();
  });

  function showConfirm(ref, total) {
    const ov = $("#order-confirm");
    $("#confirm-ref").textContent = ref;
    $("#confirm-total").textContent = total;
    ov.classList.add("open");
  }
  $("#confirm-close").addEventListener("click", () => $("#order-confirm").classList.remove("open"));
  $("#order-confirm").addEventListener("click", e => { if (e.target.id === "order-confirm") e.currentTarget.classList.remove("open"); });

  document.addEventListener("cart:change", render);
  render();
})();
