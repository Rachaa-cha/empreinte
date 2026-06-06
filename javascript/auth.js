(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);

  const USERS_KEY = "empreinte_users";
  const SESS_KEY  = "empreinte_user";

  function seed() {
    if (!localStorage.getItem(USERS_KEY)) {
      const demo = [{ nom: "Demo", prenom: "Empreinte", email: "demo@empreinte.studio", pass: "demo123" }];
      localStorage.setItem(USERS_KEY, JSON.stringify(demo));
    }
  }
  const readUsers  = () => { try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; } catch { return []; } };
  const writeUsers = u => localStorage.setItem(USERS_KEY, JSON.stringify(u));
  const setSession = u => localStorage.setItem(SESS_KEY, JSON.stringify({ nom: u.nom, prenom: u.prenom, email: u.email }));
  const getSession = () => { try { return JSON.parse(localStorage.getItem(SESS_KEY)); } catch { return null; } };
  window.empSession = getSession;
  window.empLogout = function () { localStorage.removeItem(SESS_KEY); location.reload(); };

  seed();

  function paintNav() {
    const sess = getSession();
    document.querySelectorAll(".icon-btn[href$='connexion.html']").forEach(a => {
      if (sess) a.setAttribute("title", sess.prenom + " · connecté");
    });
  }
  paintNav();

  const loginForm = $("#login-form");
  if (loginForm) {
    const email = $("#login-email"), pass = $("#login-pass"), out = $("#login-out");
    const vEmail = empWireField(email, "email");
    const vPass  = empWireField(pass, "pass");

    const sess = getSession();
    if (sess) showLoggedIn(sess);

    loginForm.addEventListener("submit", e => {
      e.preventDefault();
      const okE = vEmail(), okP = vPass();
      if (!okE || !okP) { banner(out, "Corrige les champs en rouge.", false); return; }
      const u = readUsers().find(x => x.email.toLowerCase() === email.value.trim().toLowerCase() && x.pass === pass.value);
      if (!u) { banner(out, "E-mail ou mot de passe incorrect.", false); shake(loginForm); return; }
      setSession(u);
      banner(out, "Connexion réussie ✦ Redirection…", true);
      setTimeout(() => location.href = "../index.html", 900);
    });

    function showLoggedIn(s) {
      banner(out, "Déjà connecté en tant que " + s.prenom + ".", true);
      const card = $(".auth__card");
      if (card) {
        const box = document.createElement("div");
        box.className = "logged-box";
        box.innerHTML = '<p>Session active : <b>' + window.empEsc(s.prenom + " " + s.nom) + '</b><br><span>' + window.empEsc(s.email) + '</span></p>';
        const btn = document.createElement("button");
        btn.className = "btn btn-outline btn-block"; btn.type = "button"; btn.textContent = "Se déconnecter";
        btn.addEventListener("click", window.empLogout);
        box.appendChild(btn);
        card.appendChild(box);
      }
    }
  }

  const regForm = $("#register-form");
  if (regForm) {
    const nom = $("#reg-nom"), prenom = $("#reg-prenom"),
          email = $("#reg-email"), pass = $("#reg-pass"), conf = $("#reg-conf"), out = $("#reg-out");

    const vNom    = empWireField(nom, "name");
    const vPrenom = empWireField(prenom, "name");
    const vEmail  = empWireField(email, "email");
    const vPass   = empWireField(pass, "pass");
    const vConf   = empWireField(conf, "match", { compare: () => pass.value });
    pass.addEventListener("input", () => { if (conf.value) conf.dispatchEvent(new Event("input")); });

    const counter = $("#pass-count");
    pass.addEventListener("input", () => {
      const n = pass.value.length;
      if (counter) {
        counter.textContent = n + " / 6+";
        counter.parentElement.querySelector("b").textContent = n >= 6 ? "OK" : (6 - n) + " restants";
      }
    });

    regForm.addEventListener("submit", e => {
      e.preventDefault();
      const ok = [vNom(), vPrenom(), vEmail(), vPass(), vConf()].every(Boolean);
      if (!ok) { banner(out, "Vérifie les champs en rouge.", false); shake(regForm); return; }
      const users = readUsers();
      if (users.some(u => u.email.toLowerCase() === email.value.trim().toLowerCase())) {
        banner(out, "Cet e-mail est déjà inscrit.", false); return;
      }
      const user = { nom: nom.value.trim(), prenom: prenom.value.trim(), email: email.value.trim(), pass: pass.value };
      users.push(user); writeUsers(users);
      setSession(user);
      banner(out, "Compte créé ✦ Bienvenue " + user.prenom + " !", true);
      setTimeout(() => location.href = "../index.html", 1100);
    });
  }

  function banner(node, msg, ok) {
    if (!node) return;
    node.textContent = msg;
    node.className = "auth__banner show " + (ok ? "ok" : "err");
  }
  function shake(form) { form.classList.remove("shake"); void form.offsetWidth; form.classList.add("shake"); }
})();
