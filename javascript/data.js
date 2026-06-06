const EMPREINTE_BASE = location.pathname.includes("/content/") ? "../" : "";
function asset(file){ return EMPREINTE_BASE + "images/" + file; }
function link(file){ return EMPREINTE_BASE + (file === "index.html" ? "index.html" : "content/" + file); }

const GARMENTS = {
  tshirt: { label: "T-Shirt", mask: "tshirt_mask.png", lines: "tshirt_lines.png", zone: { top: 26, left: 30, w: 40, h: 40 } },
  polo:   { label: "Polo",    mask: "polo_mask.png",   lines: "polo_lines.png",   zone: { top: 30, left: 33, w: 34, h: 34 } },
  hoodie: { label: "Hoodie",  mask: "hoodie_mask.png", lines: "hoodie_lines.png", zone: { top: 34, left: 33, w: 34, h: 30 } },
  cap:    { label: "Casquette", mask: "cap_mask.png",  lines: "cap_lines.png",    zone: { top: 30, left: 30, w: 40, h: 22 } },
  bag:    { label: "Tote Bag", mask: "bag_mask.png",   lines: "bag_lines.png",    zone: { top: 42, left: 30, w: 40, h: 34 } }
};

const EMPREINTE_PRODUCTS = [
  { id: "TS-01", name: "Tee Empreinte Classic",  cat: "tshirt", price: 1900, color: "#16130f", img: "photos/tshirt.jpg",       tag: "Le best-seller", desc: "Coton peigné 180g/m². La toile parfaite pour ton empreinte." },
  { id: "TS-02", name: "Tee Oversize Atelier",   cat: "tshirt", price: 2300, color: "#ff4a1c", img: "photos/tshirt-orange.jpg", tag: "Coupe ample", desc: "Coupe oversize unisexe, épaules tombantes, coton lourd 220g." },
  { id: "TS-03", name: "Tee Bone Raw",           cat: "tshirt", price: 2100, color: "#e7dfcd", img: "photos/tshirt-ecru.jpg",   tag: "Édition naturelle", desc: "Teinte écrue non blanchie. Idéale pour les encres foncées." },
  { id: "PO-01", name: "Polo Piqué Signature",   cat: "polo",   price: 3200, color: "#1f2ee6", img: "photos/polo.jpg",         tag: "Chic & sport", desc: "Maille piquée respirante, col côtelé, finitions nettes." },
  { id: "PO-02", name: "Polo Noir d'Encre",      cat: "polo",   price: 3400, color: "#16130f", img: "photos/polo-black.jpg",   tag: "Minimal", desc: "Un noir profond pour une broderie discrète sur le cœur." },
  { id: "HO-01", name: "Hoodie Heavyweight",     cat: "hoodie", price: 4900, color: "#16130f", img: "photos/hoodie.jpg",       tag: "400 g/m²", desc: "Molleton brossé épais, capuche doublée, poche kangourou." },
  { id: "HO-02", name: "Hoodie Crème Studio",    cat: "hoodie", price: 5100, color: "#e7dfcd", img: "photos/hoodie-cream.jpg", tag: "Coupe boxy", desc: "Coupe boxy, intérieur gratté ultra-doux, parfait street." },
  { id: "HO-03", name: "Hoodie Vermillon",       cat: "hoodie", price: 5100, color: "#ff4a1c", img: "photos/hoodie-red.jpg",   tag: "Statement", desc: "La pièce qui parle. Encre crème ou noire en contraste." },
  { id: "CA-01", name: "Casquette 6-Panel",      cat: "cap",    price: 1600, color: "#16130f", img: "photos/cap.jpg",          tag: "Réglable", desc: "Visière structurée, fermeture arrière réglable, 6 panneaux." },
  { id: "CA-02", name: "Casquette Cobalt",       cat: "cap",    price: 1700, color: "#1f2ee6", img: "photos/cap-cobalt.jpg",   tag: "Couleur pop", desc: "Broderie frontale incluse, sangle métallique." },
  { id: "BG-01", name: "Tote Toile Épaisse",     cat: "bag",    price: 1400, color: "#e7dfcd", img: "photos/bag.jpg",          tag: "Canvas 12oz", desc: "Toile coton 12oz, anses renforcées, sérigraphie large format." },
  { id: "BG-02", name: "Tote Encre Noire",       cat: "bag",    price: 1500, color: "#16130f", img: "photos/bag-black.jpg",    tag: "Daily carry", desc: "Tote noir profond, format A4, pour les encres claires." }
];

const EMPREINTE_CATEGORIES = [
  { key: "all",    label: "Tout" },
  { key: "tshirt", label: "T-Shirts" },
  { key: "polo",   label: "Polos" },
  { key: "hoodie", label: "Hoodies" },
  { key: "cap",    label: "Casquettes" },
  { key: "bag",    label: "Tote bags" }
];

const INK_COLORS = [
  { name: "Noir d'encre", hex: "#16130f" },
  { name: "Anthracite",   hex: "#34302a" },
  { name: "Gris béton",   hex: "#8d877c" },
  { name: "Blanc",        hex: "#f7f3ea" },
  { name: "Bone",         hex: "#e7dfcd" },
  { name: "Sable",        hex: "#c9a66b" },
  { name: "Camel",        hex: "#a9743f" },
  { name: "Vermillon",    hex: "#ff4a1c" },
  { name: "Rouge sang",   hex: "#c01616" },
  { name: "Bordeaux",     hex: "#6e1422" },
  { name: "Rose poudré",  hex: "#e7a6b0" },
  { name: "Magenta",      hex: "#c8246d" },
  { name: "Orange vif",   hex: "#ff8a1e" },
  { name: "Moutarde",     hex: "#e0a91e" },
  { name: "Acid",         hex: "#c8ff3d" },
  { name: "Vert pomme",   hex: "#4caf3a" },
  { name: "Forêt",        hex: "#1f6b3f" },
  { name: "Sapin",        hex: "#123a2c" },
  { name: "Émeraude",     hex: "#0b8f86" },
  { name: "Ciel",         hex: "#6fb7d6" },
  { name: "Cobalt",       hex: "#1f2ee6" },
  { name: "Marine",       hex: "#16235a" },
  { name: "Lavande",      hex: "#9b8cef" },
  { name: "Violet",       hex: "#6a2bb0" }
];
const PRINT_FONTS = [

  { name: "Anton",            css: "'Anton', sans-serif",              group: "Display" },
  { name: "Bebas Neue",       css: "'Bebas Neue', sans-serif",         group: "Display" },
  { name: "Oswald",           css: "'Oswald', sans-serif",             group: "Display" },
  { name: "Archivo Black",    css: "'Archivo Black', sans-serif",      group: "Display" },
  { name: "Bungee",           css: "'Bungee', sans-serif",             group: "Display" },
  { name: "Syne",             css: "'Syne', sans-serif",               group: "Display" },
  { name: "Unbounded",        css: "'Unbounded', sans-serif",          group: "Display" },
  { name: "Teko",             css: "'Teko', sans-serif",               group: "Display" },
  { name: "Fjalla One",       css: "'Fjalla One', sans-serif",         group: "Display" },
  { name: "Russo One",        css: "'Russo One', sans-serif",          group: "Display" },
  { name: "Titan One",        css: "'Titan One', sans-serif",          group: "Display" },

  { name: "Abril Fatface",    css: "'Abril Fatface', serif",           group: "Serif" },
  { name: "Playfair Display", css: "'Playfair Display', serif",        group: "Serif" },
  { name: "Bricolage",        css: "'Bricolage Grotesque', serif",     group: "Serif" },
  { name: "DM Serif Display", css: "'DM Serif Display', serif",        group: "Serif" },
  { name: "Yeseva One",       css: "'Yeseva One', serif",              group: "Serif" },

  { name: "Space Mono",       css: "'Space Mono', monospace",          group: "Mono" },
  { name: "Rubik Mono",       css: "'Rubik Mono One', monospace",      group: "Mono" },
  { name: "Monoton",          css: "'Monoton', monospace",             group: "Mono" },
  { name: "Major Mono",       css: "'Major Mono Display', monospace",  group: "Mono" },

  { name: "Permanent Marker", css: "'Permanent Marker', cursive",      group: "Hand" },
  { name: "Caveat",           css: "'Caveat', cursive",                group: "Hand" },
  { name: "Pacifico",         css: "'Pacifico', cursive",              group: "Hand" },
  { name: "Shrikhand",        css: "'Shrikhand', cursive",             group: "Hand" },
  { name: "Lobster",          css: "'Lobster', cursive",               group: "Hand" }
];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

function dzd(n){ return n.toLocaleString("fr-FR") + " DA"; }

const GARMENT_MASKS = {
  tshirt: "data:image/png;base64,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",
  polo: "data:image/png;base64,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",
  hoodie: "data:image/png;base64,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",
  cap: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEFCAYAAAAMvznVAAASxklEQVR4nO3dTY8l113H8W93u2fGJkhJGMczdjxYQlkgBVBmIqLskFhGSCxYsEJCxIkIC5SVbeJxbM/46Q0kiDhCrJHIKm8BCyu2ASFYAUPbHnscY4IEzEPPvc3i1MmtW30fq86ph1vfjzS6M/14p7v+v/M/p07V3Ts5OUHSOO13/QQkdccAkEbMAJBGzACQRswAkEbMAJBGzACQRswAkEbMAJBGzACQRuyBrp+AWrUP7G3wcSfANPNzUQ8YALsvFv0hcJHwO18VAifAfeAD4BjDYKcZALupWvRni8erxeOqqd+UUPzXise7xeM9DIKds+fVgDtlHzjD4qKP/z7c4OscM1/814Aj4H0Mgp1iAOyOc8BjwCUWF/0e2y36Tgnt/zGh8I+YD4I7qZ64umMA7IazwGXgJUIAPEa9ol9mShj5YxBcBd7CEBg8A2D4Dgij/CvA7wCfKt6WwxS4DbwBPAm8C0wyfS+1wH0AwzcBPgZeLx5z8njZMf5C+22fMJqv+z0dA+8R2vM75Fukuw28A7wAfIij/+A5BeiX8kad8nn7eF5+0Zw7fs5Z4EuEhbqU6wBxMfAu8DbwneLxNvX3COzX/DwlZgB0a1nBx3n9VeAR4Fbx93cIhciCz7kPfFJ8/OOlz93m9F9VPB0YH68DNwkj/5T5DUPRulA4CzwM/JSwsLi35uOVkQHQrk0K/mLx7weYFe5dQvFfJRTctPha1ZC4XjzuE4rsE+A88CzzG4BOij9le8zvEIwbgl4tvf0EeAq4UPy7vGEodgrVUCgHQuxSvgV8H/hn4BeZDwMwEFpjAOS3aCvuuoKH0637HUJh3ScU1V7lc45L758wC4SPgc8RNghBKLQPmR+1Kb7GheLj9orvMSkeny59n/JzLH/PWOjlUJgwC4RJ8fVfAn4L+Fvgr4HfBb5HCIPPFl93WYAoMQMgj3VbcTcp+EXiKBtVP6f8/nJxlkfW2MrHUTs+34uc7hRgFlbL1hOqz6kaROVAgBAC3wB+BPwe8FVCGPwN8M3ia73E6QDxuoQMDIB01hV9dS6eapPOKtXihNOjdnwu1UCi9L5tn+eiILpL6DxeK773x8CnmYXB7wO/TehAPmRxgHhdQmIGQHOb7r9vo+A3tSgYcj6/8rbiOJrfZBYGPwO+SOhMLjCbgoDXJWRlANQXCz/l/vsxqIZBXGc4AzzK4rMV665LcHpQkwGwnXKbXy78HPvvx6DciWz6c6tel+D0oAEDYDPL2vxY+Gew6NsWg2DZ9MCuYAMGwHLLRvtyCFj43Vs2PbAr2IABcNq60d42v7/WdQUGQYUBMG/VTTUc7YfDm5lsyAAI9gnFn+NiGnVr0c1M3iHvVZODYQDMj/rXCCFwDot+10wJRR+vqXBawLgDYNmof67LJ6Xs7uC04OfGGgCO+uPmtKAwtgBw1FfZsmnBaLqBMQWAo76WKU8LRtUNjCEAHPW1iVF2A7seAI762taouoFdDoAHCS+W4aivbY2mG9jFAIgt/2XCi2VcxlFf9VS7gZ17NaRdC4Bqy3+Z0AlIdcVXQ3qT8GpIR5y+n+Jg7dLLg9vyK4fYUV4CfoWwNfw9dqQT2JUO4EHgCrb8yuce4bUQ43QgvjjKoO1CAJSL/wq2/MonLg6+DTxTPA76DMHQA8DiVxduE4p/8GcIhhwAFr+6VD1DMMgpwVADwOJXH1SnBG8xsBAY4kKZxa++2AceYsDH49ACwOJXH1WPy8Gcfh7SFMDiV9/9H/B3hA1DNwgvetJrQ+kALH4NwVnChqFLxd97bwgBcA6LX8NwQNiB+iID2Ybe9ynAAfAE8APgK4QFF6nvbhPOCPT+zEDfO4DBtVQSA1oU7HMAxIt7XiS0VQfdPh1pK4M4fvsaANV5f28TVFqh3MEuetnzzvUxAAa3kCItEY/lq/S0C+hjADjv1y45pMfHc98CIN7Kq9fzJmkLve5o+3Qa0FN+2mXlU4M/oSeXD/epA7D11y7r5VmBvgSArb/GoHeDXB8CoDpH8pSfdlXvjvU+BECvV0mlxHrV7XYdAL0/Typl0JsNQl0HQHn07+VOKSmD3gx8XQZAb34IUgd6Mfh1GQC9aYOkDvRiAOwqAHq1ECJ1pPMuoIsA6N2pEKkjnXcBXQSAp/2kmU67gLYD4AC4iAt/UtRpF9BFB3CWEAIu/ElBZ11x2wEQi9/WX5rpbF2szQAor/xfxPZfKuukPtoKgDj3d+VfWq71DrnNDsD2X1qv1TWytgLgEItfWqf1s2RtBED5NIdzf2m1VvcFtBEAnW93lAak1QEzdwC48UfaXmtT5jY6ADf+SNtrpW5yB4CLf9L2yp1z1mlAzgBo7T8h7aBWBs/cHYDtv1Rf9vrJGQC2/1J9rXTQuQLA9l9qLg6ig+wAbP+l5vbJWKe5vrDtv5RG1i4gRwDY/ktpZK+lXB2A7b+URtZuOkcA2P5LaWUbUFMHgO2/lFbWmsrZAdj+S2lkq6lcawBdv+iotGuynA7MUagWv5Reli4gdbHa/kvpZVsHSBkALgBK+dgBSCOXfB3ANQBpOJIPsKmL1eKX8sgyxU5ZsLb/Ul697QBcAJTa0ds1ADsAqR3J6jZlAGS9cYEkIPFAm6pgHf2l/JJPtVMEgPN/qT12ANLI9XYNQFI7ktSbRSsNT7KOO1UAGCRSO5KuuaUoXOf/Urt60wF4BkDqRm/WAOwApIFyDUAaMQtXGq7G9WsASP03XfC2JFPvFAFgiEj5HAMfFI9RssX3psXrAqCUzwS4CVwvHiel93XeAXgKUMpvUQcQdb4GYAcg5bdoDSAJ1wCkEbN4pWFrVMMGgDRcjafgBoA0TEkW4ZsGgAEidafTDsAzAFJ7lp0J6GQNwD0AUntW7QVoxA5A6rcpofivF4+T1R++HdcApP67Tw87AEn5xU77gRxf3ACQ+iuutT1bPCavVwNA6resa20GgNR/2erUAJCGr3YdGwDSsDWaIhgA0nA13pDXJAAMD6l7nXQA7gKU2pf8eoA6n+h1AFL7slwPYAcg9V+8HuAl4EMSXg/gGoA0Yln2F0tKah+4ADwNPELCabejuDRiBoDUf1PC3L9XawDLTMn4QgbSSGW5J0DqALgHHAHvkuHmBdJIZbsnQMoAiC9k+KeE2xd9ROLbF0kjlPWeAKk7gPvFnz8Afgk3CUkpZNt3k2MN4IBwqsJNQlI6WRbsc50F8OyCNAAWqjRiBoA0YgaANGIGgDRiBoC0G2rVsgEgDV/tfQIGgDRsje7QZQBIw2cHII2cawDSCCS91N4AkIbjGLhFwkvtDQBpGKbAx8DrxWOSS+0NAGkY9oHzwNeLxySX2o/lrsBT4KTytj0MQAVDOT4OSXyp/a4GQPkXGl9R5T7hlxodAo/ifQvG7phwJ6vyvPqEUBvlU2t9CYRlz6HW4uAuBUAs+nLBnxR/v06YN30OOEP4IV4EniPxfdY1KBPgp8ArhONkSriv5UeENrt8G6644aarQFhV4LVfNmzIAbBolI+P5YKn+Pt54M+Y/UIPgYex+MfsgHAMPEM4duJLcMXj52XCgDEhHGtPE46fPeY7hNxhsGr1f1I852vF41aLg00CoO1bfy9r6+Mo/yrhFzHhdMFXf2HQn5ZO3ToEHmd2bF0C/oLZlDGGwqvAa4Tjq9ohVHfipTy24vEcV/8X1V3rHUD8hk+QdwSttvWT4m3vE1L6E8IoH5/DU1jw2l75uDgAfpn5RcFLwPc43WG+XHz8CeHYe5TT04Wmx90Bs9X/l5d8rdqvxVEnAMotxw9IHwLVoo+P5RH+XcIrpPwas1E+ZwprXKrHTTkUyh1CeY3p28wGo/J0oXxc1j0ml63+T4E7nF7E3FiTDuCo+HMReKj0hOqoFv1dQoG/xvzK/VOEALhG+EE+D3wZOIcFr7zisVXtED4PvEAIhT8s3hanCzDfHTQZpKofd48wEB4RFrO3nv9D/QCYENrw5wgrqF8q3r7NPGTZSH+dkGgnhB9avMwx/vAmhNdI+yGh+ziHC3lqV7kYHwKuEI7b88XbqtOFbxfve4DmC4mx3X8X+Bbwb8B7hE5ga00WAe8AbxH+Q88Xb7sG/IzQHpVVN1qUR/pbzLf3t4rPPwS+w+IR/gohhV3FVx+cZTb/h1mHELuDPwe+BvwlpxcS4xT2LKu7g3iK8ibhuD8C/rV4rH1twN7JSXUD1NbOEZ44hOK9QFix/M3ifdWNONVTLdVknBZf568Io/8lFhf5FFt+9d9dwl6DTxeP5c4gtu17wGPMzipUu4M7wJvAnxBeceubwPeBt6k58kcpAgBmhTgFHiSM2tcISXWL+RX7M5zebPF5wg8gpt8x8J/F559J8QSlDsXBqjztfZ8wej8P/BNhke/x4uM/Aj5LqI1HCMFxFfhJ8fnni7fdbfrEUgVA2TnC3PwiYYT/X+C/gF8ntENxI055u2XcnVfmCK9dFlfw/54wmn+dUOy3gO8C/wh8BvgFQsF/ANwgFH3spBtLHQDnCPPzFwhP8kVCuv0qYbHwMmGu8/Pvj0WucYtThPOEDvguobV/BvgX4IuExfYTQjC8RcO2vyxlABwQ5uuvA18p3vYPhHT7Y8KZggdTfTNph1S73dvAO8xq5zeKt78JPEnoBJLcDyB1AHwB+FHxeMAs3R5mfuSXtFq1diaEwn8SeINEXUDK9juepy8Xejw9YvFL26nWzgFhobzW7b+XSRUAq+5N7hxfqqdaO7Vv/73pN2gi+ZOTdErSATX16OxoLw2IBSsNT7K6TRkAhomUX9Kpdqqidf4v5dfohUAXSREAyZ+UpKXsAKSRcw1AUnMWrTRiBoA0TElqN1UAGCRSe5KtuaUoXBcApfYkPevWNAA8BSi1zw5AGjnXACQ1Y+FKw9W4fg0AaZiSTL0NAGl4ki2+pwgAQ0RqXy86AM8ASN3pdA3APQDSwNkBSCPmGoA0bI3qr2nxWvxSdxp34E0K+JDwaqa2/1L7kqzB1Q2AA8KrmX6jeHQBUGpfZx3ABPhv4MfFY5JXKpW0tU7WAOwApB3gGoA0Yp4FkIavdh1awNKwNVoIbBIAhofUrcanAusWsVuApX5ovQPwIiCpX1pfA7ADkHaAawDSiFnE0m6oVcsGgDR8tafkBsDwTQnXYnTxZ9rC/0+rNVqUf6DmNzU42jEFTla8/xj4ALi/5uNy2CMcP5uMPHt4zORUuwOoEwCeAUijaXFPi/dfKx7bHo33mR95lhX4JkFhQDRX6+e3bQC4B2A7y4o8RXGfFJ//QfH1unAD+CPCcbS35GPWBcW6gDAcMrIDSKda7MuKPGVxnyz5/LZMgP9gefFHN1geFKsCYlk4GAqJuAZQz7piX1XkQynuTW3yHNcFxQ0WB8SicDAUEqobAGMUi36TYl9X5EMp7pRW/X9XBcQN5sNhk1AwDDZkAKxWLfq7bF7sYyzyJpb9rBaFww1Wh8JZ5jsEA2GJugGwywf2uqKP/7bY21P92a4KhVj85YXq2B2cwSCYUycAYmE8wW6dBZgC91hf9BZ7P6wKhRvMOoTymatLwGPs5jSh1jG5d3Ky9f6Rc8BXgR8SfqBDDoHyaP8+cIRFvyvi2gCEgn+McLxWpwm70BXcAd4ghN4RW9ylu0kH0NW55xSWjfZHhCCw6Iev/LubAP9O+N1WpwlD7womzHerW92iv8kawNCKY5PR/h7D+39pM1PCSFmeJjzJbnQFtQflugEwlHWAVQt6jvbjFH/Pu9QV1B6Q66wBQP/XATZZ0HO0VxTXC4a4VlB7/g/NO4C7NT8/l1j4LuhpG9t0BX0Kggnhudaa/0OzjUCxqC4BDzX4OiksKnxbfNWxbq2gT0FwTDjOj6i5KF93CgBhGvBl4BXgCvBg3S9U07JFvVj4tvhKZZ9Q8OXpQdfrBBNm4fQGIbS21iQAIBT9FdoNgXWn8Cx85bIoCLpYJ5gCt4E3CQFwg5qv0N00AGA+BC4TfhirEnHRNfKbfryn8NQHMQjKxZ+7K1jU8V4F3qLm6A9pAgBCCFwmFOWiizGiuHhYTatD4NHSxy+68q684cH5vfpgk7MH24TBuhvILOp4axc/pAsACGsC1UQs3+BhCnwIvEb4gRwUj3vFxz0HPMys0Kun7ybMrrpztFffLOsKNg2DY+Am4dhedQOZpB1vygCA+US8yPIbPHyX+XA4AM4Dt4B3WX7lnaO9+q5aA5uEwYQwOD5LaOnLIVC93DxpDaQOgLLyxRjx3xeAl4GvAZ8q3h7nNO9he6/dsk0Y/A/wY+AZFt9FKksd5AyARc4S1gquE+b84Cq+xmFVGDzCrAN4mxY32LUdADBbK4ibkJzXa2wWTZVjHTRa1NtWFwEA89MD23yNWayFTuqgqwCQ1ANd72WW1CEDQBoxA0AaMQNAGjEDQBoxA0AaMQNAGjEDQBoxA0AaMQNAGrH/B2jWArf9OvhIAAAAAElFTkSuQmCC",
  bag: "data:image/png;base64,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",
};

(function () {
  "use strict";

  const S = '#000', H = '#fff';
  const seam = 'fill="none" stroke="#000" stroke-opacity=".22" stroke-width="2.4" stroke-linecap="round" vector-effect="non-scaling-stroke"';
  const seamLite = 'fill="none" stroke="#fff" stroke-opacity=".18" stroke-width="1.6" stroke-linecap="round" vector-effect="non-scaling-stroke"';

  const tshirtFront = `
    <path class="gm-color" d="M93 55 C99 71 141 71 147 55 C160 52 171 54 181 61 L217 96 C222 102 220 112 214 124 L195 117 C191 124 190 130 190 137 L192 250 C192 257 188 261 181 261 L59 261 C52 261 48 257 48 250 L50 137 C50 130 49 124 45 117 L26 124 C20 112 18 102 23 96 L59 61 C69 54 80 52 93 55 Z"/>
    <path fill="${S}" opacity=".12" d="M48 118 C58 130 60 156 56 200 L48 200 Z"/>
    <path fill="${S}" opacity=".12" d="M192 118 C182 130 180 156 184 200 L192 200 Z"/>
    <path fill="${S}" opacity=".07" d="M120 86 C129 150 128 214 120 258 C112 214 111 150 120 86 Z"/>
    <path fill="${H}" opacity=".10" d="M74 78 C66 140 68 206 78 258 L90 256 C82 206 80 140 86 84 C82 80 78 78 74 78 Z"/>
    <path fill="${H}" opacity=".07" d="M150 88 C156 150 156 210 150 256 L160 252 C166 200 164 140 160 92 Z"/>
    <path ${seam} d="M93 55 C99 71 141 71 147 55"/>
    <path ${seamLite} d="M96 60 C101 72 139 72 144 60"/>
    <path ${seam} d="M93 56 L86 70 M147 56 L154 70"/>
    <path ${seam} d="M31 116 L48 121 M209 116 L192 121"/>
    <path ${seam} d="M54 254 L186 254"/>`;

  const tshirtBack = `
    <path class="gm-color" d="M95 56 C108 64 132 64 145 56 C160 52 171 54 181 61 L217 96 C222 102 220 112 214 124 L195 117 C191 124 190 130 190 137 L192 250 C192 257 188 261 181 261 L59 261 C52 261 48 257 48 250 L50 137 C50 130 49 124 45 117 L26 124 C20 112 18 102 23 96 L59 61 C69 54 80 52 95 56 Z"/>
    <path fill="${S}" opacity=".12" d="M48 118 C58 130 60 156 56 200 L48 200 Z"/>
    <path fill="${S}" opacity=".12" d="M192 118 C182 130 180 156 184 200 L192 200 Z"/>
    <path fill="${S}" opacity=".10" d="M95 56 C108 64 132 64 145 56 C140 66 100 66 95 56 Z"/>
    <path fill="${H}" opacity=".08" d="M78 80 C70 150 72 210 80 258 L90 256 C84 206 82 140 88 84 Z"/>
    <path ${seam} d="M95 57 C112 65 128 65 145 57"/>
    <path ${seam} d="M31 116 L48 121 M209 116 L192 121"/>
    <path ${seam} d="M54 254 L186 254"/>`;

  const poloFront = `
    <path class="gm-color" d="M92 58 C92 76 102 86 120 86 C138 86 148 76 148 58 C160 54 171 56 181 63 L217 98 C222 104 220 114 214 126 L195 119 C191 126 190 132 190 139 L192 250 C192 257 188 261 181 261 L59 261 C52 261 48 257 48 250 L50 139 C50 132 49 126 45 119 L26 126 C20 114 18 104 23 98 L59 63 C69 56 80 54 92 58 Z"/>
    <path fill="${S}" opacity=".12" d="M48 120 C58 132 60 158 56 200 L48 200 Z"/>
    <path fill="${S}" opacity=".12" d="M192 120 C182 132 180 158 184 200 L192 200 Z"/>
    <path fill="${S}" opacity=".07" d="M120 100 C128 160 128 214 120 258 C112 214 112 160 120 100 Z"/>
    <path fill="${H}" opacity=".09" d="M74 80 C66 142 68 206 78 258 L88 256 C80 206 80 142 86 86 Z"/>
    <!-- collar -->
    <path class="gm-color" d="M92 58 C96 50 104 46 112 46 L120 64 L92 70 Z"/>
    <path class="gm-color" d="M148 58 C144 50 136 46 128 46 L120 64 L148 70 Z"/>
    <path ${seam} d="M92 58 C96 50 104 46 112 46 L120 64 L92 70 Z"/>
    <path ${seam} d="M148 58 C144 50 136 46 128 46 L120 64 L148 70 Z"/>
    <!-- placket + buttons -->
    <path ${seam} d="M114 64 L114 104 M126 64 L126 104"/>
    <circle cx="120" cy="76" r="2.4" fill="${S}" opacity=".4"/>
    <circle cx="120" cy="94" r="2.4" fill="${S}" opacity=".4"/>
    <path ${seam} d="M31 118 L48 123 M209 118 L192 123"/>
    <path ${seam} d="M54 254 L186 254"/>`;

  const poloBack = `
    <path class="gm-color" d="M96 56 C108 66 132 66 144 56 C160 54 171 56 181 63 L217 98 C222 104 220 114 214 126 L195 119 C191 126 190 132 190 139 L192 250 C192 257 188 261 181 261 L59 261 C52 261 48 257 48 250 L50 139 C50 132 49 126 45 119 L26 126 C20 114 18 104 23 98 L59 63 C69 56 80 54 96 56 Z"/>
    <path fill="${S}" opacity=".12" d="M48 120 C58 132 60 158 56 200 L48 200 Z"/>
    <path fill="${S}" opacity=".12" d="M192 120 C182 132 180 158 184 200 L192 200 Z"/>
    <path fill="${S}" opacity=".10" d="M96 56 C108 66 132 66 144 56 C138 68 102 68 96 56 Z"/>
    <path ${seam} d="M96 57 C110 67 130 67 144 57"/>
    <path ${seam} d="M31 118 L48 123 M209 118 L192 123"/>
    <path ${seam} d="M54 254 L186 254"/>`;

  const hoodieFront = `
    <!-- body (boxy, ribbed hem) -->
    <path class="gm-color" d="M78 78 C70 74 60 76 52 84 L20 120 C14 128 16 138 24 146 L46 132 C44 140 43 148 43 156 L44 240 L196 240 L197 156 C197 148 196 140 194 132 L216 146 C224 138 226 128 220 120 L188 84 C180 76 170 74 162 78 C158 96 142 108 120 108 C98 108 82 96 78 78 Z"/>
    <!-- ribbed hem -->
    <path class="gm-color" d="M44 240 L196 240 L196 262 C196 266 193 268 189 268 L51 268 C47 268 44 266 44 262 Z"/>
    <path ${seam} d="M52 240 L52 266 M68 240 L68 266 M84 240 L84 266 M100 240 L100 266 M120 240 L120 266 M140 240 L140 266 M156 240 L156 266 M172 240 L172 266 M188 240 L188 266"/>
    <path ${seam} d="M44 240 L196 240"/>
    <!-- hood -->
    <path class="gm-color" d="M78 78 C82 56 98 44 120 44 C142 44 158 56 162 78 C158 96 142 108 120 108 C98 108 82 96 78 78 Z"/>
    <path fill="${S}" opacity=".22" d="M88 74 C92 60 104 52 120 52 C136 52 148 60 152 74 C146 90 134 98 120 98 C106 98 94 90 88 74 Z"/>
    <path ${seam} d="M78 78 C82 56 98 44 120 44 C142 44 158 56 162 78"/>
    <!-- drawstrings -->
    <path ${seam} d="M112 100 L110 134 M128 100 L130 134"/>
    <circle cx="110" cy="136" r="3" fill="${S}" opacity=".4"/>
    <circle cx="130" cy="136" r="3" fill="${S}" opacity=".4"/>
    <!-- kangaroo pocket -->
    <path ${seam} d="M74 176 L166 176 C168 196 168 214 166 226 L74 226 C72 214 72 196 74 176 Z"/>
    <path fill="${S}" opacity=".08" d="M74 176 L166 176 C168 196 168 214 166 226 L74 226 C72 214 72 196 74 176 Z"/>
    <!-- ribbed cuffs -->
    <path class="gm-color" d="M22 138 L46 124 L50 146 L26 158 Z"/>
    <path class="gm-color" d="M218 138 L194 124 L190 146 L214 158 Z"/>
    <path ${seam} d="M26 142 L46 130 M28 150 L48 138 M214 142 L194 130 M212 150 L192 138"/>
    <!-- shading -->
    <path fill="${S}" opacity=".10" d="M52 130 C58 150 58 190 56 232 L46 232 C44 190 46 150 52 130 Z"/>
    <path fill="${S}" opacity=".10" d="M188 130 C182 150 182 190 184 232 L194 232 C196 190 194 150 188 130 Z"/>
    <path fill="${H}" opacity=".08" d="M84 120 C78 160 78 200 82 236 L92 236 C86 200 86 160 92 122 Z"/>`;

  const hoodieBack = `
    <path class="gm-color" d="M78 78 C70 74 60 76 52 84 L20 120 C14 128 16 138 24 146 L46 132 C44 140 43 148 43 156 L44 262 C44 266 47 268 51 268 L189 268 C193 268 196 266 196 262 L197 156 C197 148 196 140 194 132 L216 146 C224 138 226 128 220 120 L188 84 C180 76 170 74 162 78 C158 92 142 100 120 100 C98 100 82 92 78 78 Z"/>
    <!-- hood lying flat on the back -->
    <path class="gm-color" d="M84 70 C90 52 104 44 120 44 C136 44 150 52 156 70 C150 88 136 98 120 98 C104 98 90 88 84 70 Z"/>
    <path fill="${S}" opacity=".10" d="M84 70 C90 52 104 44 120 44 C136 44 150 52 156 70 C150 88 136 96 120 96 C104 96 90 88 84 70 Z"/>
    <path ${seam} d="M84 70 C90 52 104 44 120 44 C136 44 150 52 156 70"/>
    <path ${seam} d="M44 248 L196 248"/>
    <path ${seam} d="M26 142 L46 130 M214 142 L194 130"/>
    <path fill="${H}" opacity=".07" d="M84 110 C78 160 78 210 82 250 L92 250 C86 210 86 160 92 112 Z"/>`;

  const capFront = `
    <!-- crown -->
    <path class="gm-color" d="M44 168 C42 110 78 78 120 78 C162 78 198 110 196 168 C196 174 192 178 186 178 L54 178 C48 178 44 174 44 168 Z"/>
    <!-- brim -->
    <path class="gm-color" d="M186 176 C214 178 236 190 240 206 C241 214 232 216 214 210 C188 200 168 192 150 188 C160 182 174 178 186 176 Z"/>
    <!-- panel seams -->
    <path ${seam} d="M120 80 L120 178 M84 84 C80 120 80 150 86 178 M156 84 C160 120 160 150 154 178"/>
    <!-- button + closure -->
    <circle cx="120" cy="84" r="4" fill="${S}" opacity=".35"/>
    <!-- shading -->
    <path fill="${S}" opacity=".12" d="M44 150 C44 162 48 172 56 178 L120 178 C90 176 60 168 50 150 Z"/>
    <path fill="${S}" opacity=".12" d="M150 188 C168 192 188 200 214 210 C232 216 241 214 240 206 C236 196 220 188 200 186 C184 184 166 184 150 188 Z"/>
    <path fill="${H}" opacity=".12" d="M70 96 C90 82 150 82 170 96 C150 90 90 90 70 96 Z"/>
    <path ${seam} d="M186 176 C214 178 236 190 240 206"/>`;

  const bagFront = `
    <!-- body -->
    <path class="gm-color" d="M52 96 L188 96 L196 256 C196 262 192 266 186 266 L54 266 C48 266 44 262 44 256 Z"/>
    <!-- handles -->
    <path class="gm-color" fill="none" stroke="currentColor" stroke-width="9" d="M78 100 C78 60 92 44 100 44 C108 44 122 60 122 100"/>
    <path class="gm-color" fill="none" stroke="currentColor" stroke-width="9" d="M118 100 C118 60 132 44 140 44 C148 44 162 60 162 100"/>
    <path ${seam} d="M78 100 C78 60 92 44 100 44 C108 44 122 60 122 100"/>
    <path ${seam} d="M118 100 C118 60 132 44 140 44 C148 44 162 60 162 100"/>
    <!-- top seam -->
    <path ${seam} d="M52 100 L188 100"/>
    <!-- shading -->
    <path fill="${S}" opacity=".10" d="M52 96 L66 96 L62 266 L54 266 C48 266 44 262 44 256 Z"/>
    <path fill="${H}" opacity=".08" d="M174 96 L188 96 L196 256 C196 262 192 266 186 266 L180 266 Z"/>
    <path fill="${S}" opacity=".05" d="M52 100 L188 100 L189 118 L52 118 Z"/>`;

  const VIEWS = {
    tshirt: { front: tshirtFront, back: tshirtBack },
    polo:   { front: poloFront,   back: poloBack },
    hoodie: { front: hoodieFront, back: hoodieBack },
    cap:    { front: capFront,    back: capFront },
    bag:    { front: bagFront,    back: bagFront }
  };

  function empGarmentSVG(cat, view) {
    const set = VIEWS[cat] || VIEWS.tshirt;
    const inner = set[view] || set.front;
    return `<svg class="gm-svg" viewBox="0 0 240 280" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" role="img" aria-hidden="true">${inner}</svg>`;
  }

  window.EMP_GARMENT_VIEWS = VIEWS;
  window.empGarmentSVG = empGarmentSVG;
})();

const STUDIO_FLATS = {
  tshirt: { fill: "studio/tshirt_fill.png", ink: "studio/tshirt_ink.png",
            center: { x: 27, y: 42 }, zone: { w: 20, h: 26 } },
  polo:   { fill: "studio/polo_fill.png",   ink: "studio/polo_ink.png",
            center: { x: 27, y: 47 }, zone: { w: 17, h: 24 } },
  hoodie: { fill: "studio/hoodie_fill.png", ink: "studio/hoodie_ink.png",
            center: { x: 26, y: 50 }, zone: { w: 19, h: 22 } },
  cap:    { fill: "studio/cap_fill.png",    ink: "studio/cap_ink.png",
            center: { x: 27, y: 47 }, zone: { w: 20, h: 14 } },
  bag:    { fill: "studio/bag_fill.png",    ink: "studio/bag_ink.png",
            center: { x: 30, y: 58 }, zone: { w: 18, h: 26 } },
};
