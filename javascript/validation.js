const EMP_RX = {
  name:  /^[A-Za-zÀ-ÖØ-öø-ÿ]['’\- ]?[A-Za-zÀ-ÖØ-öø-ÿ\s'’\-]{1,38}$/,
  email: /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/,

  pass:  /^(?=.*[A-Za-z])(?=.*\d).{6,}$/
};

function empValidate(kind, value) {
  const v = (value || "").trim();
  switch (kind) {
    case "name":
      if (!v) return { ok: false, msg: "Champ requis." };
      if (!EMP_RX.name.test(v)) return { ok: false, msg: "Lettres uniquement (2 caractères min)." };
      return { ok: true, msg: "✓" };
    case "email":
      if (!v) return { ok: false, msg: "Champ requis." };
      if (!EMP_RX.email.test(v)) return { ok: false, msg: "Format e-mail invalide." };
      return { ok: true, msg: "✓ adresse valide" };
    case "pass":
      if (!v) return { ok: false, msg: "Champ requis." };
      if (v.length < 6) return { ok: false, msg: "6 caractères minimum." };
      if (!EMP_RX.pass.test(v)) return { ok: false, msg: "Doit contenir lettres + chiffres." };
      return { ok: true, msg: "✓ mot de passe solide" };
    case "match":
      return value === v ? { ok: true, msg: "✓" } : { ok: false, msg: "Les mots de passe diffèrent." };
    default:
      return { ok: !!v, msg: v ? "✓" : "Champ requis." };
  }
}

function empWireField(input, kind, opts = {}) {
  const msg = input.closest(".fieldset")?.querySelector(".field-msg");
  function run() {
    let res;
    if (kind === "match") {
      const a = input.value, b = opts.compare ? opts.compare() : "";
      res = (a.length > 0 && a === b) ? { ok: true, msg: "✓ identique" } : { ok: false, msg: "Les mots de passe diffèrent." };
    } else {
      res = empValidate(kind, input.value);
    }
    const filled = input.value.length > 0;
    input.classList.toggle("bad", filled && !res.ok);
    if (msg) {
      msg.textContent = filled ? res.msg : "";
      msg.classList.toggle("ok", res.ok && filled);
    }
    return res.ok;
  }
  input.addEventListener("input", run);
  input.addEventListener("blur", run);
  return run;
}
