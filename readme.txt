
  EMPREINTE — atelier d'impression textile sur mesure
  Projet web  ·  Module : Développement d'Applications Web
  Université Mouloud Mammeri de Tizi-Ouzou  ·  Année 2025/2026


C'EST QUOI ?

EMPREINTE, c'est un petit site e-commerce qu'on a imagine autour d'une seule
idee : et si tu pouvais dessiner ton vêtement toi-même avant de le commander ?

Tout se passe cote navigateur, il n'y a pas de serveur derriere. On vend (pour
de faux) des t-shirts, polos, hoodies, casquettes et tote bags, et chacun peut
être personnalise dans un petit "studio" maison.

La piece maitresse, c'est justement ce STUDIO. Tu choisis un vêtement, tu
changes sa couleur en direct, tu poses du texte (avec la police et la couleur
d'encre que tu veux) ou un logo, tu le déplaces / agrandis / fais pivoter ou tu
veux, puis tu "tamponnes" ton empreinte et tu l'ajoutes au panier. Chaque texte
et chaque logo est un CALQUE indépendant : on peut le sélectionner, le passer
devant ou derriere, ou le supprimer.

Le tout est fait en HTML, CSS et JavaScript "vanilla" (pas de framework). On a
surtout voulu s'amuser avec le DOM et l'interactivité :
  - recoloration des vêtements en temps reel (on dessine la piece sur un
    <canvas> et on la reteinte a la volée) ;
  - sur un textile fonce, les traits de detail (col, coutures...) passent en
    clair tout seuls pour que la piece reste lisible ;
  - glisser / redimensionner / pivoter les calques, animation de "tampon" ;
  - panier qui survit au rechargement (local Storage) + tiroir lateral ;
  - connexion / inscription simulée (les comptes vivent dans le navigateur) ;
  - formulaires verifies avec des expressions régulières (RegEx) ;
  - petites animations a l'apparition et transitions entre les pages.


COMMENT LANCER LE SITE ?

Le plus simple : double-cliquer sur "index.html". Ca marche dans n'importe quel
navigateur recent (Chrome, Firefox, Edge), sans rien installer.


Les pages (le menu est partout) :
  - Accueil ........ index.html
  - Produits ....... content/produits.html   (filtres par famille + recherche)
  - Studio ......... content/studio.html      (la personnalisation)
  - Panier ......... content/panier.html      (le recap + la commande)
  - Connexion ...... content/connexion.html
  - Inscription .... content/inscription.html

Un compte de demo est déjà prêt si tu ne veux pas en créer :
      e-mail        : demo@empreinte.studio
      mot de passe  : demo123

Pour personnaliser : va dans Studio, choisis la piece a gauche, joue avec la
couleur / la taille / le texte / la police / le logo, ajoute tes calques, place
les sur le vêtement, "Tamponne", puis "Ajouter" au panier.

Pour commander : page Panier, ajuste les quantités et clique "Commander". Une
reference de commande est générée (c'est une commande simulée, sans backend).


COMMENT C'EST RANGE ?

EMPREINTE/
|-- index.html                 (l'accueil)
|-- content/                   (les autres pages .html)
|   |-- produits.html
|   |-- studio.html
|   |-- panier.html
|   |-- connexion.html
|   |-- inscription.html
|-- style/                     (les .ccs)
|   |-- style.css              (le système de design commun)
|   |-- accueil.css
|   |-- produits.css
|   |-- personnalisation.css
|   |-- formulaire.ccs
|   |-- panier.ccs
|-- javascript/                (les .js)
|   |-- data.js                (le catalogue + les options : la "base de données")
|   |-- main.js                (panier, animations, dessin des vêtements)
|   |-- produits.js            (filtres et recherche)
|   |-- personnalisation.js    (tout le studio)
|   |-- validation.js          (les Reg Ex des formulaires)
|   |-- auth.js                (la connexion simulée)
|   |-- panier.js              (la page panier + la commande)
|-- images/                    (les calques re colorables + les photos produit)
|-- readme.txt                 (ce fichier)

Deux ou trois choses a savoir :
  - Il n'y a PAS une page HTML par catégorie. Les produits viennent tous d'un
    tableau dans data.js, et les filtres se font entièrement en JavaScript.
  - HTML sémantique + responsive, pense pour passer le validateur W3C.
  - Les photos produit sont dans images/photos/ (une par piece et par coloris).
    Si une photo manque, le site retombe tout seul sur le dessin vectoriel
    recolorable, donc rien ne casse. Tu peux remplacer ces images par les
    tiennes en gardant les memes noms.


Réalisé par :

  - AMEZIANE RACHA
  - DEMMOUCHE MASSILIA


  Merci d'avoir jeter un oeil. Bonne impression !

