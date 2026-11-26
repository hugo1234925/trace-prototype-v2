/* Trace · prototype cliquable
   Basé sur la page Figma « Trace · Maquette haute fidélité v2 ».
   Aucune dépendance : HTML + CSS + JavaScript, prêt pour GitHub Pages. */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* Données                                                             */
  /* ------------------------------------------------------------------ */
  const IMG = {
    jean: 'img/jean-droit.jpg',
    chino: 'img/chino-beige.jpg',
    marine: 'img/chandail-marine.jpg',
    surchemise: 'img/surchemise-grise.jpg',
    demizip: 'img/demi-zip-creme.jpg',
    tshirt: 'img/tshirt-creme.jpg',
    piece: 'img/piece-magasin.jpg',
  };

  // Tracés exportés de Figma (coordonnées en px de la carte « tracé superposé »)
  const PATH = {
    jean: 'M13.5 0 L103.56 0 L117.07 208.21 L72.04 208.21 L58.53 62.46 L45.03 208.21 L0 208.21 Z',
    chino: 'M12.61 0 L93.66 0 L106.26 212.37 L67.54 212.37 L53.13 62.46 L38.72 212.37 L0 212.37 Z',
    noir: 'M6.03 0 L63.91 0 L69.94 133.04 L45.82 133.04 L34.97 40.43 L24.12 133.04 L0 133.04 Z',
    cargo: 'M12.06 0 L79.58 0 L91.64 133.04 L57.88 133.04 L45.82 39.13 L33.76 133.04 L0 133.04 Z',
    jogging: 'M6.03 0 L66.32 0 L68.73 121.3 L72.35 133.04 L45.82 133.04 L36.17 40.43 L26.53 133.04 L0 133.04 L3.62 121.3 Z',
    guide: 'M20 0 L140 0 L160 186.67 L100 186.67 L80 60 L60 186.67 L0 186.67 Z',
  };
  const K = 117.07 / 78.38; // échelle carte → grand tracé

  // Silhouettes simples (viewBox 64) pour les catégories
  const SHAPE = {
    tshirt: 'M24 8c2 4 5 6 8 6s6-2 8-6l14 7-5 11-7-3v33H22V23l-7 3-5-11z',
    chandail: 'M24 6c2 4 5 6 8 6s6-2 8-6l12 6 6 26-8 2-5-18v36H19V22l-5 18-8-2 6-26z',
    pantalon: 'M18 6h28l4 52H37l-5-32-5 32H14z M18 13h28',
    veste: 'M24 4c2 3 5 4 8 4s6-1 8-4l11 6 5 30-7 2-3-16v34H18V26l-3 16-7-2 5-30z M32 9v49',
    jupe: 'M20 8h24l10 50H10z M20 14h24',
    short: 'M16 10h32l5 34H36l-4-16-4 16H11z M16 16h32',
  };
  const CATS = [
    { id: 'tshirt', label: 'T-shirt', noun: 'ton t-shirt', item: 'T-shirt préféré', plural: 'les t-shirts' },
    { id: 'chandail', label: 'Chandail', noun: 'ton chandail', item: 'Chandail préféré', plural: 'les chandails' },
    { id: 'pantalon', label: 'Pantalon', noun: 'ton pantalon', item: 'Jean droit', plural: 'les pantalons' },
    { id: 'veste', label: 'Veste', noun: 'ta veste', item: 'Veste préférée', plural: 'les vestes', fem: true },
    { id: 'jupe', label: 'Jupe ou robe', noun: 'ta jupe ou robe', item: 'Jupe préférée', plural: 'les jupes et robes', fem: true },
    { id: 'short', label: 'Short', noun: 'ton short', item: 'Short préféré', plural: 'les shorts' },
  ];

  // Pantalons de la garde-robe utilisés pour la comparaison (valeurs fictives)
  const REFS = [
    { id: 'jean', name: 'Jean droit', img: IMG.jean, path: PATH.jean, x: 19, y: 15, w: 117.07, h: 208.21, verdict: 'take',
      zones: [['Taille', 'ok', '= 0 cm'], ['Hanches', 'ok', '+1 cm · dans ta marge'], ['Entrejambe', 'ok', '= 0 cm'], ['Jambe', 'minor', '+2 cm · c’est la coupe'], ['Longueur', 'minor', '+2 cm · ourlet possible']] },
    { id: 'chino', name: 'Chino beige', img: IMG.chino, path: PATH.chino, x: 25, y: 15, w: 106.26, h: 212.37, verdict: 'try',
      zones: [['Taille', 'ok', '= 0 cm'], ['Hanches', 'warn', '−2 cm · plus serré'], ['Entrejambe', 'ok', '= 0 cm'], ['Jambe', 'ok', '= 0 cm'], ['Longueur', 'warn', '−4 cm · plus court']] },
    { id: 'noir', name: 'Jean noir', img: IMG.jean, dark: true, path: PATH.noir, w: 69.94 * K, h: 133.04 * K, verdict: 'pass',
      zones: [['Taille', 'bad', '−3 cm · trop serré'], ['Hanches', 'warn', '−2 cm · plus serré'], ['Entrejambe', 'ok', '= 0 cm'], ['Jambe', 'warn', '−3 cm · plus étroit'], ['Longueur', 'minor', '−2 cm']] },
    { id: 'cargo', name: 'Cargo', img: IMG.chino, dark: true, path: PATH.cargo, w: 91.64 * K, h: 133.04 * K, verdict: 'pass',
      zones: [['Taille', 'bad', '+4 cm · trop large'], ['Hanches', 'bad', '+6 cm · trop ample'], ['Entrejambe', 'ok', '= 0 cm'], ['Jambe', 'bad', '+8 cm · bien plus large'], ['Longueur', 'ok', '= 0 cm']] },
    { id: 'jogging', name: 'Jogging', img: IMG.jean, light: true, path: PATH.jogging, w: 72.35 * K, h: 133.04 * K, verdict: 'pass',
      zones: [['Taille', 'warn', 'élastique · difficile à comparer'], ['Hanches', 'warn', '+3 cm'], ['Entrejambe', 'bad', '−4 cm · plus court'], ['Jambe', 'bad', 'resserré au bas'], ['Longueur', 'bad', '−6 cm · trop court']] },
  ];
  // Scénario 09b : aucune correspondance
  const NO_MATCH = {
    jean: [['Taille', 'bad', '−4 cm · trop serré'], ['Hanches', 'bad', '−3 cm · trop serré'], ['Entrejambe', 'ok', '= 0 cm'], ['Jambe', 'minor', '−1 cm'], ['Longueur', 'ok', '= 0 cm']],
    chino: [['Taille', 'bad', '−3 cm · trop serré'], ['Hanches', 'warn', '−2 cm · plus serré'], ['Entrejambe', 'ok', '= 0 cm'], ['Jambe', 'ok', '= 0 cm'], ['Longueur', 'warn', '−4 cm · plus court']],
  };
  const curCat = () => CATS.find(c => c.id === state.cat) || CATS[2];
  const VERDICT = { take: 'Prends-le', try: 'Essaie-le', pass: 'Passe' };

  const WARDROBE = [
    { name: 'Jean droit', meta: 'Bas · coton · peu extensible', img: IMG.jean, cat: 'Bas', link: 'fiche' },
    { name: 'T-shirt noir', meta: 'Haut · coton · extensible', img: IMG.tshirt, cat: 'Hauts' },
    { name: 'Chandail gris', meta: 'Haut · laine · extensible', img: IMG.marine, cat: 'Hauts' },
    { name: 'Chino beige', meta: 'Bas · coton · solide', img: IMG.chino, cat: 'Bas' },
    { name: 'Chemise', meta: 'Haut · lin · solide', img: IMG.demizip, cat: 'Hauts' },
    { name: 'Veste en jean', meta: 'Veste · denim · solide', img: IMG.surchemise, cat: 'Vestes' },
  ];

  /* ------------------------------------------------------------------ */
  /* État (gardé dans le navigateur de la personne qui teste)           */
  /* ------------------------------------------------------------------ */
  const DEFAULT_STATE = {
    hasWardrobe: true,
    traces: 6,
    compares: 7,
    gardes: 3,
    laisses: 4,
    cat: 'pantalon',
    filter: 'Tout',
    toggles: [true, false, true],
    likes: { 'La taille': true, 'La longueur': true, 'Les hanches': true, 'Ajusté aux cuisses': false, 'Bouger à l’aise': true },
    cabine: [
      { name: 'Pantalon gris · friperie', img: IMG.chino, verdict: 'Prends-le · vs ton jean droit', when: 'Aujourd’hui' },
      { name: 'Veste en jean', img: IMG.surchemise, verdict: 'Essaie-le · vs ta veste', when: 'Il y a 3 jours' },
      { name: 'Chandail vert', img: IMG.marine, verdict: 'Passe · vs ton chandail', when: 'Il y a 1 semaine' },
    ],
  };
  const KEY = 'trace-proto-v2';
  let state = load();
  function load() {
    try { const s = JSON.parse(localStorage.getItem(KEY)); if (s) return Object.assign(clone(DEFAULT_STATE), s); } catch (e) { /* stockage indisponible */ }
    return clone(DEFAULT_STATE);
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignore */ } }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  /* ------------------------------------------------------------------ */
  /* Petits utilitaires d’affichage                                     */
  /* ------------------------------------------------------------------ */
  const ICONS = {
    back: '<path d="M15 5l-7 7 7 7"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    menu: '<path d="M5 9h14M5 15h14"/>',
    home: '<path d="M4 11l8-6 8 6v8a1 1 0 0 1-1 1h-4v-5h-6v5H5a1 1 0 0 1-1-1z"/>',
    scan: '<path d="M4 9V5h4M16 5h4v4M20 15v4h-4M8 19H4v-4"/><path d="M9 12h6"/>',
    plus: '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
    plain_plus: '<path d="M12 5v14M5 12h14"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
    chev: '<path d="M9 5l7 7-7 7"/>',
    search: '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>',
    camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
  };
  function icon(name, size = 22, color = 'currentColor', sw = 1.8) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`;
  }
  function shape(id, size, color = '#265CF2', dashed = true) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="${SHAPE[id]}" stroke="${color}" stroke-width="2.4" ${dashed ? 'stroke-dasharray="4 3"' : ''} stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }
  function badge(kind) {
    const c = kind === 'ok' || kind === 'bad' ? '#fff' : '#3A2E00';
    const g = {
      ok: '<path d="M5.4 9.4l2.4 2.4 4.8-5.2"/>',
      minor: '<path d="M5.2 9.8c1.1-1.5 2.4-1.5 3.8 0s2.7 1.5 3.8 0"/>',
      warn: `<path d="M9 5.2v4.6"/><circle cx="9" cy="12.6" r="1" fill="${c}" stroke="none"/>`,
      bad: `<path d="M9 5.2v4.6"/><circle cx="9" cy="12.6" r="1" fill="${c}" stroke="none"/>`,
    }[kind];
    const label = { ok: 'conforme', minor: 'petit écart', warn: 'écart', bad: 'trop différent' }[kind];
    return `<span class="badge ${kind}" role="img" aria-label="${label}"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="${c}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${g}</svg></span>`;
  }
  function back(to, kind = 'back') {
    return `<a class="round-btn" href="#/${to}" aria-label="${kind === 'close' ? 'Fermer' : 'Retour'}">${icon(kind, 20)}</a>`;
  }
  function topbar(to, title, extra = '', kind = 'back') {
    return `<header class="topbar">${back(to, kind)}<h1 class="title">${title}</h1>${extra}</header>`;
  }
  function stepbar(to, n, kind = 'back') {
    return `<header class="topbar">${back(to, kind)}<span class="step-label">Étape ${n} sur 3</span></header>
            <div class="progress" role="progressbar" aria-valuemin="1" aria-valuemax="3" aria-valuenow="${n}"><span style="width:${n * 100 / 3}%"></span></div>`;
  }
  function nav(active) {
    const home = state.hasWardrobe ? 'accueil' : 'vide';
    return `<nav class="nav" aria-label="Navigation principale">
      <a href="#/${home}" ${active === 'home' ? 'aria-current="page"' : ''}>${icon('home', 22)}<span>Accueil</span></a>
      <a href="#/scan" class="compare ${state.hasWardrobe ? '' : 'disabled'}" ${active === 'compare' ? 'aria-current="page"' : ''} aria-label="Comparer">
        <span class="orb">${icon('scan', 30, '#fff', 2)}</span><span>Comparer</span></a>
      <a href="#/cat" ${active === 'add' ? 'aria-current="page"' : ''}>${icon('plus', 22)}<span>Ajouter</span></a>
    </nav>`;
  }
  function photo(src, opts = {}) {
    const f = opts.dark ? 'filter:brightness(.55) saturate(.6)' : opts.light ? 'filter:grayscale(1) brightness(1.5)' : '';
    return `<img src="${src}" alt="${opts.alt || ''}" style="${f}" loading="lazy">`;
  }
  function traceSvg(ref, x, y) {
    const isCard = ref.w > 0 && !ref.x;
    const left = isCard ? 77.5 - ref.w / 2 : x;
    const vbw = isCard ? ref.w / K : ref.w, vbh = isCard ? ref.h / K : ref.h;
    return `<svg style="left:${left}px;top:${y}px;overflow:visible" width="${ref.w}" height="${ref.h}" viewBox="0 0 ${vbw} ${vbh}" preserveAspectRatio="none" aria-hidden="true">
      <path d="${ref.path}" fill="none" stroke="#fff" stroke-width="5" stroke-linejoin="round" vector-effect="non-scaling-stroke" opacity=".95"/>
      <path d="${ref.path}" fill="none" stroke="#265CF2" stroke-width="2.5" stroke-dasharray="7 5" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></svg>`;
  }
  function screen(cls, inner, navActive) {
    return `<section class="screen ${cls || ''} ${navActive !== undefined ? 'has-nav' : ''}">${inner}</section>${navActive !== undefined ? nav(navActive) : ''}`;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

  /* ------------------------------------------------------------------ */
  /* Écrans                                                              */
  /* ------------------------------------------------------------------ */
  const SCREENS = {};

  /* --- Premier lancement --- */
  SCREENS.o1 = () => screen('', `
    <div class="spacer"></div>
    <div class="stack gap-24" style="align-items:center">
      <div style="width:184px;height:184px;border-radius:44px;background:linear-gradient(135deg,#14336B,#5C82C4);box-shadow:0 24px 50px rgba(20,51,107,.3);display:flex;align-items:center;justify-content:center">
        <img src="img/logo-trace.svg" alt="Trace" width="136" height="48">
      </div>
      <p class="body" style="font-size:16px">Porte ce que tu aimes déjà.</p>
    </div>
    <div class="spacer"></div>
    <div class="actions">
      <a class="btn" href="#/o2">Commencer</a>
      <a class="link" href="#/accueil" data-action="already">J’ai déjà mes traces</a>
    </div>`);

  SCREENS.o2 = () => screen('', `
    <header class="row" style="justify-content:space-between;margin:20px 0 26px">
      <h1 class="title-xl">Comment ça marche</h1><a href="#/o3" style="font-size:14px;font-weight:600">Passer</a></header>
    <div class="stack gap-16">
      ${[['1', 'Ajoute un vêtement que tu aimes', 'Une photo à plat, chez toi. Il devient ton guide de tailles.'],
         ['2', 'Compare en magasin', 'Prends la pièce en photo : Trace la compare à tes vêtements du même type.'],
         ['3', 'Décide en un mot', 'Prends-le, essaie-le ou passe : Trace te dit pourquoi.']].map(([n, t, d]) => `
        <div class="card pad row gap-16" style="align-items:flex-start;padding:20px 16px">
          <span class="tint" style="width:56px;height:56px;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;flex-shrink:0">${n}</span>
          <div class="stack gap-8"><b style="font-size:16px">${t}</b><span class="small">${d}</span></div></div>`).join('')}
    </div>
    <div class="spacer"></div>
    <div class="row gap-8" style="justify-content:center;margin:24px 0 0" aria-hidden="true"><i style="width:10px;height:8px;border-radius:4px;background:#D5D8DF"></i><i style="width:28px;height:8px;border-radius:4px;background:#14336B"></i><i style="width:10px;height:8px;border-radius:4px;background:#D5D8DF"></i></div>
    <div class="actions"><a class="btn" href="#/o3">Suivant</a></div>`);

  SCREENS.o3 = () => screen('', `
    <div class="spacer"></div>
    <div style="width:160px;height:160px;border-radius:50%;background:#fff;box-shadow:var(--shadow);display:flex;align-items:center;justify-content:center;margin:0 auto 40px">
      <span class="tint" style="width:64px;height:64px;display:flex;align-items:center;justify-content:center">${icon('camera', 30, '#14336B')}</span></div>
    <h1 class="title-l" style="margin-bottom:16px">Trace a besoin de la caméra</h1>
    <p class="body">Pour photographier tes vêtements et les pièces en magasin. La caméra ne sert qu’au moment où tu l’ouvres.</p>
    <div class="spacer"></div>
    <div class="actions"><button class="btn" data-action="askcam">Autoriser la caméra</button><a class="link" href="#/o4">Plus tard</a></div>`);

  SCREENS.o4 = () => screen('', `
    <h1 class="title-xl" style="margin:20px 0 12px">Tes données, ton choix</h1>
    <p class="body" style="margin-bottom:28px">Trace enregistre les contours et les mesures de tes vêtements. Jamais ton corps.</p>
    <div class="stack gap-12">
      ${['Photos effacées après la mesure : seule la trace est gardée', 'Améliorer Trace avec des données anonymes', 'Recevoir des conseils d’entretien'].map((t, i) => `
        <div class="card row gap-16" style="padding:16px;justify-content:space-between">
          <span id="tg${i}" style="font-size:14px;font-weight:500;line-height:1.35">${t}</span>
          <button class="switch" role="switch" aria-labelledby="tg${i}" aria-checked="${state.toggles[i]}" data-action="toggle" data-i="${i}"></button></div>`).join('')}
    </div>
    <p class="small" style="margin-top:20px">Tu peux changer ces réglages à tout moment dans Paramètres › Confidentialité.</p>
    <div class="spacer"></div>
    <div class="actions"><a class="btn" href="#/vide" data-action="onboarded">J’accepte et je continue</a>
      <button class="link" data-action="toast" data-msg="Politique de confidentialité : texte juridique à rédiger et valider.">Lire la politique de confidentialité</button></div>`);

  /* --- Accueil --- */
  SCREENS.vide = () => screen('', `
    <header style="margin:20px 0 28px"><h1 class="title-xl">Salut Alex,</h1><p class="small" style="font-size:14px;margin-top:6px">Bienvenue dans ta garde-robe Trace.</p></header>
    <div class="card" style="padding:20px">
      <div class="tint frame-dashed" style="width:180px;height:180px;margin:20px auto 32px;border-color:#2A4DA0;border-width:1.5px"></div>
      <h2 style="font-size:20px;margin-bottom:10px">Ta garde-robe est vide</h2>
      <p class="small" style="font-size:14px;margin-bottom:20px">Commence par ton vêtement préféré : celui qui te va parfaitement. Il deviendra ton guide de tailles.</p>
      <a class="btn" href="#/cat">+ Ajouter mon premier préféré</a>
    </div>
    <p class="small" style="margin-top:20px">Comparer sera disponible après ton premier ajout.</p>`, 'home');

  function itemCard(it) {
    const inner = `<div class="ph">${photo(it.img, it)}</div><b>${it.name}</b><span>6 points</span>`;
    return it.link ? `<a class="card item" href="#/${it.link}">${inner}</a>` : `<div class="card item">${inner}</div>`;
  }
  function addCard() { return `<a class="card item add" href="#/cat">${icon('plain_plus', 28)}Ajouter</a>`; }
  SCREENS.accueil = () => screen('', `
    <header class="row gap-12" style="margin:12px 0 18px">
      <span class="avatar" aria-hidden="true">A</span>
      <div style="flex:1"><h1 style="font-size:22px">Salut Alex,</h1><p class="small">Ravi de te revoir dans ta garde-robe.</p></div>
      <a class="round-btn" href="#/param" aria-label="Paramètres">${icon('menu', 20)}</a>
    </header>
    <section class="bilan" aria-label="Mon bilan">
      <div class="head"><b>Mon bilan</b><a class="btn-glass" href="#/garderobe">Visualiser</a></div>
      <div class="row gap-8">
        <div class="glass"><strong>${state.traces}</strong><span>traces</span></div>
        <div class="glass"><strong>2</strong><span>retours évités</span></div>
        <div class="glass"><strong>${state.compares}</strong><span>comparés</span></div>
      </div>
    </section>
    <div class="row gap-10" style="margin-top:14px">
      <a class="card shortcut" href="#/bilan"><span class="dot"></span><span><b>Bilan détaillé</b><span>${state.laisses} laissés · ${state.gardes} gardés</span></span></a>
      <a class="card shortcut" href="#/cabine"><span class="dot"></span><span><b>Ma cabine</b><span>${state.cabine.length} pièces à essayer</span></span></a>
    </div>
    <div class="section-head"><h2 class="h-section">Hauts</h2><span class="small">3 traces</span><a class="chip" href="#/garderobe" data-filter="Hauts">Voir tout</a></div>
    <div class="hscroll">${[{ name: 'T-shirt blanc', img: IMG.tshirt }, { name: 'Chemise ciel', img: IMG.demizip }, { name: 'Chandail crème', img: IMG.marine }].map(itemCard).join('')}${addCard()}</div>
    <div class="section-head"><h2 class="h-section">Bas</h2><span class="small">3 traces</span><a class="chip" href="#/garderobe" data-filter="Bas">Voir tout</a></div>
    <div class="hscroll">${[{ name: 'Jean droit', img: IMG.jean, link: 'fiche' }, { name: 'Chino beige', img: IMG.chino }, { name: 'Jean noir', img: IMG.jean, dark: true }].map(itemCard).join('')}${addCard()}</div>
    <div class="section-head"><h2 class="h-section">Vestes</h2><span class="small">3 traces</span><a class="chip" href="#/garderobe" data-filter="Vestes">Voir tout</a></div>
    <div class="hscroll">${[{ name: 'Veste en jean', img: IMG.surchemise }, { name: 'Bomber', img: IMG.surchemise, dark: true }, { name: 'Coupe-vent', img: IMG.surchemise, light: true }].map(itemCard).join('')}${addCard()}</div>`, 'home');

  /* --- Garde-robe & fiche --- */
  SCREENS.garderobe = () => {
    const list = WARDROBE.filter(w => state.filter === 'Tout' || w.cat === state.filter);
    return screen('', `
      <header class="topbar" style="align-items:flex-start">${back('accueil')}<div><h1 class="title-xl">Ma garde-robe</h1><p class="small">6 préférés</p></div></header>
      <label class="search">${icon('search', 18, '#6B6F7A')}<input type="search" placeholder="Rechercher un vêtement" aria-label="Rechercher un vêtement"></label>
      <div class="row gap-8" style="margin:16px 0" role="group" aria-label="Filtrer">
        ${['Tout', 'Hauts', 'Bas', 'Vestes'].map(f => `<button class="chip ${state.filter === f ? 'dark' : ''}" aria-pressed="${state.filter === f}" data-action="filter" data-f="${f}">${f}</button>`).join('')}
      </div>
      <div class="grid-2">${list.map(w => {
        const inner = `<div class="ph">${photo(w.img)}</div><b>${w.name}</b><span>${w.meta}</span>`;
        return w.link ? `<a class="card wcard" href="#/${w.link}">${inner}</a>` : `<div class="card wcard">${inner}</div>`;
      }).join('')}</div>`, 'home');
  };

  SCREENS.fiche = () => screen('', `
    ${topbar('garderobe', 'Jean droit')}
    <div class="card row gap-16" style="padding:14px">
      <div style="width:150px;height:170px;display:flex;align-items:center;justify-content:center">${photo(IMG.jean, { alt: 'Jean droit' })}</div>
      <dl class="measures" style="flex:1;margin:0">
        ${[['Taille', '39 cm'], ['Hanches', '51 cm'], ['Cuisse', '31 cm'], ['Entrejambe', '78 cm'], ['Bas', '17 cm']].map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}
      </dl>
    </div>
    <p class="tiny" style="margin:10px 0 18px">Mesures à plat · ± 1 cm</p>
    <h2 style="font-size:14px;margin-bottom:10px">Composition</h2>
    <div class="row gap-8"><span class="chip sm">98 % coton</span><span class="chip sm">2 % élasthanne</span></div>
    <div class="card" style="padding:12px 14px;margin-top:14px">
      <p class="tiny" style="font-weight:700;letter-spacing:.06em;margin-bottom:10px">ÉLASTICITÉ</p>
      <div class="elastic">${['Rigide', 'Un peu', 'Moyen', 'Très'].map((l, i) => `<div><i class="${i <= 1 ? 'on' : ''}"></i><span class="${i === 1 ? 'on' : ''}">${l}</span></div>`).join('')}</div>
    </div>
    <h2 style="font-size:14px;margin:18px 0 10px">Ce que tu aimes de ce fit</h2>
    <div class="row gap-8" style="flex-wrap:wrap">
      ${Object.keys(state.likes).map(k => `<button class="chip sm ${state.likes[k] ? 'dark' : ''}" aria-pressed="${state.likes[k]}" data-action="like" data-k="${esc(k)}">${state.likes[k] ? '✓ ' : ''}${k}</button>`).join('')}
    </div>
    <p class="small" style="margin:14px 0">Trace compare d’abord ces zones. Porté depuis 2023 : s’il s’use, sa trace reste.</p>
    <div class="card" style="padding:14px;font-size:12px;font-weight:500">Entretien : à l’envers, eau froide, séchage à l’air.</div>
    <div class="actions"><a class="btn soft" href="#/verif">Modifier</a></div>`, 'home');

  /* --- Ajouter un vêtement --- */
  SCREENS.cat = () => screen('', `
    ${stepbar(state.hasWardrobe ? 'accueil' : 'vide', 1, 'close')}
    <h1 class="title-l">Quel type de vêtement ?</h1>
    <p class="small" style="font-size:14px;margin:8px 0 24px">Choisis un vêtement qui te va parfaitement. Les repères de mesure changent selon le type.</p>
    <div class="grid-2" role="group" aria-label="Type de vêtement">
      ${CATS.map(c => `<button class="cat-tile" aria-pressed="${state.cat === c.id}" data-action="cat" data-c="${c.id}">
        <span class="ic">${shape(c.id, 36, state.cat === c.id ? '#fff' : '#2A4DA0')}</span>${c.label}</button>`).join('')}
    </div>
    <div class="spacer"></div>
    <div class="actions"><a class="btn" href="#/photo">Continuer</a></div>`);

  function guideShape(catId, w = 200, h = 210) {
    const pants = catId === 'pantalon';
    const d = pants ? PATH.guide : SHAPE[catId];
    const vb = pants ? '-20 -10 200 207' : '4 2 56 60';
    const k = pants ? 1 : 0.3; // épaisseur relative au viewBox
    return `<svg width="${w}" height="${h}" viewBox="${vb}" aria-hidden="true">
      <path d="${d}" fill="none" stroke="#fff" stroke-opacity=".9" stroke-width="${6 * k}" stroke-linejoin="round"/>
      <path d="${d}" fill="none" stroke="#265CF2" stroke-width="${3 * k}" stroke-dasharray="${10 * k} ${7 * k}" stroke-linejoin="round"/></svg>`;
  }
  // Viseur caméra : vidéo en direct + repère par-dessus
  function camView(overlay, h) {
    return `<div class="cam" style="height:${h}px">
      <video data-cam playsinline muted autoplay></video>
      <div class="cam-overlay">${overlay}</div>
      <p class="cam-status" role="status">Activation de la caméra…</p></div>`;
  }
  SCREENS.photo = () => {
    const c = CATS.find(x => x.id === state.cat) || CATS[2];
    return screen('white', `
      ${stepbar('cat', 2)}
      <h1 class="title-m">Pose ${c.noun} à plat · 0 / 6 points</h1>
      ${camView(guideShape(c.id, 190, 200), 330)}
      <div class="spacer"></div>
      <ul class="checks" style="padding:0;margin:0 0 14px"><li>○ &nbsp;Bon éclairage</li><li>○ &nbsp;Fond contrasté (plancher, drap)</li><li>○ &nbsp;Le vêtement en entier dans le cadre</li></ul>
      <div class="seg"><a aria-current="true" href="#/photo">Vêtement</a><a href="#/ad1">Étiquette</a></div>
      <button class="shutter" aria-label="Prendre la photo" data-action="shoot" data-shot="add" data-to="verif" data-msg="Mesure en cours…"></button>`);
  };

  SCREENS.verif = () => screen('', `
    ${stepbar('photo', 3)}
    <h1 class="title-l" style="margin-bottom:18px">Vérifie tes mesures</h1>
    <div class="row gap-16" style="align-items:flex-start;margin-bottom:24px">
      <div class="card" style="width:104px;height:120px;padding:6px;flex-shrink:0;display:flex;justify-content:center;overflow:hidden">${photo(SHOTS.add || IMG.jean, { alt: 'Ton vêtement' })}</div>
      <div class="stack gap-10"><span class="chip sm" style="align-self:flex-start;font-weight:600">Confiance : bonne</span>
        <p class="small">Mesures calculées par ton téléphone, sans objet de référence. Corrige si besoin.</p></div>
    </div>
    <div class="stack gap-8">
      ${[['Taille', 82], ['Cuisse', 30], ['Entrejambe', 78], ['Longueur', 104]].map(([k, v], i) => `
        <div class="mrow"><label for="m${i}">${k}</label><span><input id="m${i}" inputmode="decimal" value="${v}"> cm</span></div>`).join('')}
    </div>
    <div class="stack gap-8" style="margin-top:16px">
      <div class="mrow" style="box-shadow:none;border:1px solid var(--line);background:transparent"><label for="nom">Nom :</label><input id="nom" value="${curCat().item}" style="width:200px;text-align:left"></div>
      <div class="row gap-8"><div class="mrow" style="flex:1;box-shadow:none;border:1px solid var(--line);background:transparent;font-size:13px">Matière : coton</div>
        <div class="mrow" style="flex:1;box-shadow:none;border:1px solid var(--line);background:transparent;font-size:13px">Extensible : peu</div></div>
    </div>
    <div class="spacer"></div>
    <div class="actions"><a class="btn" href="#/ad4" data-action="added">Ajouter à ma garde-robe</a></div>`);

  SCREENS.ad1 = () => screen('white', `
    <header class="topbar">${back('photo')}</header>
    <h1 class="title-m">Vise l’étiquette</h1>
    ${camView('<div style="width:200px;height:200px;border-radius:28px;border:3px dashed #fff;box-shadow:0 0 0 2px rgba(38,92,242,.9), inset 0 0 0 2px rgba(38,92,242,.9)"></div>', 330)}
    <p class="small" style="padding:0 12px">Étiquette du fabricant : composition et taille</p>
    <div class="spacer"></div>
    <div class="seg" style="margin-top:20px"><a href="#/photo">Vêtement</a><a aria-current="true" href="#/ad1">Étiquette</a></div>
    <button class="shutter" aria-label="Lire l’étiquette" data-action="shoot" data-shot="tag" data-to="ad2" data-msg="Lecture de l’étiquette…"></button>`);

  SCREENS.ad2 = () => screen('', `
    ${topbar('ad1', 'Étiquette lue')}
    <div class="card row gap-16" style="padding:16px">
      ${SHOTS.tag ? `<img src="${SHOTS.tag}" alt="Étiquette photographiée" style="width:96px;height:96px;object-fit:cover;border-radius:14px;flex-shrink:0">` : '<span class="tint" style="width:96px;height:96px;flex-shrink:0"></span>'}
      <div class="stack gap-4"><b style="font-size:15px">Pantalon · Taille 32/32</b><span class="small">Coton 98 %, élasthanne 2 %</span><span class="small">Lavage 30 °C</span></div>
    </div>
    <p class="small" style="margin-top:16px;padding:16px;border:1.5px dashed #2A4DA0;border-radius:16px">Les tailles d’étiquette varient selon les marques. Pour un guide fiable, ajoute aussi une photo à plat.</p>
    <div class="spacer"></div>
    <div class="actions"><a class="btn" href="#/photo">Ajouter une photo à plat</a><a class="btn ghost" href="#/verif">Continuer sans photo</a></div>`);

  SCREENS.ad3 = () => screen('white', `
    <header class="topbar">${back('photo')}</header>
    <div class="frame-dashed" style="width:200px;height:260px;margin:24px auto 40px;border-radius:24px;overflow:hidden;position:relative">
      <img src="${IMG.jean}" alt="" style="position:absolute;width:190px;left:5px;top:70px;filter:blur(2px)"></div>
    <div class="card err-card"><h2>Vêtement coupé</h2><p class="small">Recule pour que le vêtement soit en entier dans le cadre, bien à plat, puis reprends la photo.</p></div>
    <div class="spacer"></div>
    <div class="actions"><a class="btn ghost" href="#/photo">Reprendre la photo</a></div>`);

  SCREENS.ad4 = () => screen('', `
    <div class="big-icon dark">${icon('check', 44, '#fff', 2.4)}</div>
    <h1 class="title-xl center">${curCat().item} ajouté${curCat().fem ? 'e' : ''}</h1>
    <p class="body center" style="margin-top:12px">${curCat().fem ? 'Elle' : 'Il'} sert maintenant de repère pour comparer ${curCat().plural.replace('les ', 'tous les ').replace('tous les vestes', 'toutes les vestes').replace('tous les jupes', 'toutes les jupes')}.</p>
    <div class="spacer"></div>
    <div class="actions"><a class="btn" href="#/garderobe">Voir ma garde-robe</a><a class="btn ghost" href="#/cat">Ajouter un autre vêtement</a></div>`);

  /* --- Comparer en magasin --- */
  SCREENS.scan = () => screen('white', `
    <header class="topbar">${back(state.hasWardrobe ? 'accueil' : 'vide', 'close')}</header>
    ${camView(guideShape('pantalon', 210, 220), 400)}
    <div class="spacer"></div>
    <p style="font-size:14px;font-weight:500;line-height:1.45;margin:0 0 16px">Prends la pièce en photo, tenue devant toi, ou scanne son code produit. Trace la compare à tous tes vêtements du même type.</p>
    <div class="seg"><a aria-current="true" href="#/scan">Vêtement</a><button data-action="shoot" data-to="resultat" data-msg="Recherche du produit…">Code produit</button></div>
    <button class="shutter" aria-label="Comparer" data-action="shoot" data-shot="store" data-to="resultat" data-msg="Comparaison avec tes pantalons…"></button>`);

  function result(noMatch, params) {
    const i = Math.max(0, REFS.findIndex(r => r.id === params.get('ref')));
    const ref = REFS[i];
    const verdict = noMatch ? 'pass' : ref.verdict;
    const zones = (noMatch && NO_MATCH[ref.id]) || ref.zones;
    const route = noMatch ? 'aucun' : 'resultat';
    const p = noMatch ? { x: 27.5, y: 17, w: 100, h: 206 } : { x: 19, y: 15, w: 117.07, h: 208.21 };
    const buttons = verdict === 'pass'
      ? `<button class="btn" data-action="decide" data-d="pass">Je passe</button><button class="btn ghost" data-action="decide" data-d="take">L’essayer</button>`
      : `<button class="btn" data-action="decide" data-d="take">Je le prends</button><button class="btn ghost" data-action="decide" data-d="pass">Je passe</button>`;
    return screen('', `
      ${topbar('scan', 'Résultat', '<span class="chip sm" style="font-weight:500">Confiance moyenne · ± 1 cm</span>')}
      <div class="bubble">${noMatch ? 'Aucun de tes 5 pantalons ne correspond' : 'Proche de 2 de tes 5 pantalons'}</div>
      <div class="card trace-card">
        <div class="legend" aria-hidden="true"><span><i class="photo"></i>Pièce en magasin (photo)</span><span><i class="trace"></i>Ton ${ref.name.toLowerCase()} (tracé)</span></div>
        <div class="trace-stage">
          <img src="${SHOTS.store || IMG.piece}" alt="Pièce photographiée en magasin" style="left:${p.x}px;top:${p.y}px;width:${p.w}px;height:${p.h}px;object-fit:${SHOTS.store ? 'cover' : 'fill'};border-radius:${SHOTS.store ? '8px' : '0'}">
          ${traceSvg(ref, ref.x, ref.y || 15)}
        </div>
      </div>
      <div class="verdict ${verdict}" role="status"><small>Notre avis, comparé à ton ${ref.name.toLowerCase()}</small><strong>${VERDICT[verdict]}</strong></div>
      <p style="font-size:13px;font-weight:600;margin:18px 0 10px">Comparé à tous tes pantalons · fais défiler</p>
      <div class="refs" role="group" aria-label="Choisir le pantalon de référence">
        ${REFS.map((r, j) => `<a class="card ref" href="#/${route}?ref=${r.id}" aria-pressed="${j === i}" data-keep-scroll><div class="ph">${photo(r.img, r)}</div><b>${r.name}</b></a>`).join('')}
      </div>
      <h2 style="font-size:15px;margin:22px 0 12px">Comparé avec ton ${ref.name.toLowerCase()}</h2>
      <div class="zones">${zones.map(([k, kind, t]) => `<div class="zone"><b>${k}</b>${badge(kind)}<span>${t}</span></div>`).join('')}</div>
      <div class="actions row-2">${buttons}</div>
      <button class="btn soft" style="margin-top:12px" data-action="cabine" data-ref="${ref.id}" data-v="${verdict}">Ajouter à ma cabine</button>`);
  }
  SCREENS.resultat = p => result(false, p);
  SCREENS.aucun = p => result(true, p);

  SCREENS.cp2 = () => screen('', `
    <header class="topbar">${back('scan')}</header>
    <div class="card" style="width:200px;height:200px;margin:10px auto 26px;display:flex;align-items:center;justify-content:center">
      <div class="frame-dashed" style="width:120px;height:140px;border-width:1.5px;border-radius:18px;display:flex;justify-content:center;padding:10px">${photo(IMG.jean)}</div></div>
    <h1 class="title-m center">Tu n’as pas encore de pantalon préféré</h1>
    <p class="body center" style="margin-top:14px">Trace compare une pièce à tes vêtements du même type. Ajoute un pantalon qui te va bien, puis reviens.</p>
    <div class="spacer"></div>
    <div class="actions"><a class="btn" href="#/cat" data-action="setcat" data-c="pantalon">Ajouter un pantalon</a><a class="btn ghost" href="#/accueil">Voir la fiche sans comparer</a></div>`);

  SCREENS.cp3 = () => screen('white', `
    <header class="topbar">${back('scan')}</header>
    <div class="frame-dashed" style="width:200px;height:260px;margin:24px auto 40px;border-radius:24px;display:flex;align-items:center;justify-content:center;overflow:hidden">
      <img src="${IMG.piece}" alt="" style="width:110px;transform:rotate(-16deg);filter:blur(1.5px)"></div>
    <div class="card err-card"><h2>La pièce est trop inclinée</h2><p class="small">Tiens-la bien droite, à bout de bras, entièrement dans le cadre. Évite les reflets.</p></div>
    <div class="spacer"></div>
    <div class="actions"><a class="btn ghost" href="#/scan">Reprendre la photo</a></div>`);

  SCREENS.cp4 = () => screen('', `
    <div class="big-icon dark">${icon('check', 44, '#fff', 2.4)}</div>
    <h1 class="title-xl center">Bon choix</h1>
    <p class="body center" style="margin-top:12px">Une fois acheté, ajoute-le à ta garde-robe : il deviendra un nouveau repère.</p>
    <div class="card" style="padding:16px;margin-top:28px"><b style="font-size:14px">Conseil d’entretien</b><p class="small" style="margin-top:6px">Coton rigide : lave-le à l’envers, à froid, pour garder la coupe.</p></div>
    <div class="spacer"></div>
    <div class="actions"><a class="btn" href="#/cat" data-action="setcat" data-c="pantalon">L’ajouter à ma garde-robe</a><a class="btn soft" href="#/accueil">Plus tard</a></div>`);

  SCREENS.cp5 = () => screen('', `
    <div class="big-icon light">+1</div>
    <h1 class="title-xl center">C’est noté</h1>
    <p class="body center" style="margin-top:12px">Pas ton fit : tu passes. Ton bilan est mis à jour.</p>
    <div class="card" style="padding:18px 16px;margin-top:28px;font-size:15px;font-weight:600">${state.laisses} vêtements laissés : pas ton fit</div>
    <div class="spacer"></div>
    <div class="actions"><a class="btn" href="#/accueil">Retour à l’accueil</a><a class="btn ghost" href="#/scan">Comparer une autre pièce</a></div>`);

  SCREENS.cabine = () => screen('', `
    ${topbar('accueil', 'Ma cabine')}
    <p class="small" style="font-size:14px;margin:-6px 0 22px">Les pièces à essayer, avec leur verdict.</p>
    <div class="stack gap-12">
      ${state.cabine.map(c => `<a class="card row gap-16" style="padding:12px 14px" href="#/resultat${c.ref ? '?ref=' + c.ref : ''}">
        <span style="width:84px;height:84px;display:flex;align-items:center;justify-content:center;flex-shrink:0">${photo(c.img)}</span>
        <span class="stack gap-4" style="flex:1"><b style="font-size:15px">${c.name}</b><span class="small" style="font-size:12px">${c.verdict}</span><span class="tiny">${c.when}</span></span>
        ${icon('chev', 20)}</a>`).join('')}
    </div>`);

  SCREENS.bilan = () => screen('', `
    ${topbar('accueil', 'Bilan détaillé')}
    <div class="card row gap-16" style="background:var(--ink);color:#fff;height:110px;padding:0 20px">
      <strong style="font-size:56px;line-height:1">2</strong>
      <span class="stack gap-4"><b style="font-size:17px">retours évités</b><span style="font-size:12px;color:#B9BCC4">2 colis en moins sur la route</span></span></div>
    <div class="card" style="padding:16px;margin-top:16px">
      <b style="font-size:14px">${state.compares} vêtements comparés avant de payer</b>
      <div style="margin:14px 0;display:grid;gap:6px;grid-template-columns:repeat(${Math.min(state.compares, 8)},minmax(0,1fr))">${Array.from({ length: state.compares }, (_, k) => `<i style="height:46px;border-radius:10px;display:block;${k < state.gardes ? 'background:var(--ink)' : 'border:1px solid var(--line)'}"></i>`).join('')}</div>
      <p class="small" style="font-size:12px">■ ${state.gardes} achetés, gardés &nbsp;&nbsp;&nbsp; □ ${state.laisses} laissés : pas ton fit</p>
    </div>
    <h2 style="font-size:16px;margin:22px 0 12px">Fil de vie</h2>
    <div class="stack gap-10">
      ${[[IMG.jean, 'Mon jean préféré', 'porté depuis 2023 · trace gardée'], [IMG.jean, 'Jean droit brut · 30', 'acheté en ligne · gardé, aucun retour'], [IMG.tshirt, 'T-shirt du dimanche', 'usé · remplacé à l’identique']].map(([img, t, d]) => `
        <div class="card row gap-12" style="padding:8px 12px 8px 10px;height:68px"><span style="width:52px;height:52px;display:flex;justify-content:center">${photo(img)}</span><span class="stack gap-4"><b style="font-size:14px">${t}</b><span class="small" style="font-size:12px">${d}</span></span></div>`).join('')}
    </div>`);

  SCREENS.param = () => screen('', `
    ${topbar('accueil', 'Paramètres')}
    <div class="card row gap-16" style="padding:18px 16px;margin-bottom:20px"><span class="avatar" style="width:56px;height:56px" aria-hidden="true">A</span><span class="stack gap-4"><b style="font-size:16px">Alex</b><span class="small" style="font-size:12px">${state.traces} traces enregistrées</span></span></div>
    <div class="stack gap-10">
      ${[['Langue · Français'], ['Accessibilité'], ['Confidentialité et données', 'o4'], ['Notifications'], ['Aide et nous joindre'], ['À propos de Trace']].map(([t, to]) => to
        ? `<a class="list-row" href="#/${to}">${t}${icon('chev', 20)}</a>`
        : `<button class="list-row" data-action="toast" data-msg="« ${t} » n’est pas encore prototypé.">${t}${icon('chev', 20)}</button>`).join('')}
    </div>
    <p class="small" style="font-size:12px;margin-top:20px">Accessibilité : taille du texte et contraste élevé.</p>`);

  /* ------------------------------------------------------------------ */
  /* Caméra (vraie caméra du téléphone ou de l’ordinateur)              */
  /* ------------------------------------------------------------------ */
  const SHOTS = {}; // photos prises pendant la séance (gardées en mémoire seulement)
  let stream = null;
  const camOK = () => !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) && window.isSecureContext;
  async function openStream() {
    if (stream && stream.getVideoTracks().some(t => t.readyState === 'live')) return stream;
    stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } } });
    return stream;
  }
  function stopCamera() { if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; } }
  async function startCamera(video) {
    const box = video.closest('.cam'), status = box.querySelector('.cam-status');
    if (!camOK()) { box.classList.add('off'); status.textContent = 'Caméra indisponible ici : la photo est simulée.'; return; }
    try {
      const s = await openStream();
      if (!document.body.contains(video)) return;
      video.srcObject = s; await video.play();
      box.classList.add('live'); status.hidden = true;
    } catch (e) {
      box.classList.add('off');
      status.textContent = e && e.name === 'NotAllowedError'
        ? 'Caméra refusée : autorise-la dans les réglages du navigateur. En attendant, la photo est simulée.'
        : 'Caméra indisponible : la photo est simulée.';
    }
  }
  function capture() {
    const v = app.querySelector('video[data-cam]');
    if (!v || !v.videoWidth) return null;
    const max = 1000, r = Math.min(1, max / Math.max(v.videoWidth, v.videoHeight));
    const c = document.createElement('canvas'); c.width = Math.round(v.videoWidth * r); c.height = Math.round(v.videoHeight * r);
    c.getContext('2d').drawImage(v, 0, 0, c.width, c.height);
    const box = v.closest('.cam'); box.classList.add('flash'); setTimeout(() => box.classList.remove('flash'), 250);
    return c.toDataURL('image/jpeg', 0.85);
  }
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopCamera(); else { const v = app.querySelector('video[data-cam]'); if (v) startCamera(v); } });

  /* ------------------------------------------------------------------ */
  /* Routeur et interactions                                            */
  /* ------------------------------------------------------------------ */
  const app = document.getElementById('app');
  let lastRoute = '';

  function render() {
    const raw = (location.hash || '#/o1').slice(2);
    const [name, query] = raw.split('?');
    const key = SCREENS[name] ? name : 'o1';
    const params = new URLSearchParams(query || '');
    const prev = app.querySelector('.screen');
    const keep = lastRoute.split('?')[0] === key && prev ? prev.scrollTop : 0;
    const refsScroll = prev && prev.querySelector('.refs') ? prev.querySelector('.refs').scrollLeft : 0;
    app.innerHTML = SCREENS[key](params);
    const scr = app.querySelector('.screen');
    if (keep) { scr.scrollTop = keep; scr.style.animation = 'none'; const r = scr.querySelector('.refs'); if (r) r.scrollLeft = refsScroll; }
    lastRoute = raw;
    document.title = 'Trace · ' + (scr.querySelector('h1') ? scr.querySelector('h1').textContent : 'Prototype');
    markScenario(key);
    const v = app.querySelector('video[data-cam]');
    if (v) startCamera(v); else stopCamera();
  }

  function go(route) { location.hash = '#/' + route; }
  function toast(msg) {
    const t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = msg;
    app.appendChild(t); setTimeout(() => t.remove(), 2600);
  }
  function analyse(msg, to) {
    const o = document.createElement('div'); o.className = 'analyse'; o.innerHTML = `<div class="spinner" aria-hidden="true"></div><span>${msg}</span>`;
    app.appendChild(o); setTimeout(() => go(to), 900);
  }

  app.addEventListener('click', e => {
    const el = e.target.closest('[data-action]');
    if (!el) {
      const f = e.target.closest('[data-filter]');
      if (f) { state.filter = f.dataset.filter; save(); }
      return;
    }
    const a = el.dataset.action;
    if (a === 'already') { state.hasWardrobe = true; save(); }
    if (a === 'onboarded') { state.hasWardrobe = false; save(); }
    if (a === 'added') { state.hasWardrobe = true; state.traces += 1; save(); }
    if (a === 'setcat') { state.cat = el.dataset.c; save(); }
    if (a === 'toggle') { const i = +el.dataset.i; state.toggles[i] = !state.toggles[i]; el.setAttribute('aria-checked', state.toggles[i]); save(); }
    if (a === 'filter') { state.filter = el.dataset.f; save(); render(); }
    if (a === 'like') { const k = el.dataset.k; state.likes[k] = !state.likes[k]; save(); render(); }
    if (a === 'cat') { state.cat = el.dataset.c; save(); render(); }
    if (a === 'toast') { toast(el.dataset.msg); }
    if (a === 'shoot') {
      if (el.dataset.shot) { const img = capture(); if (img) SHOTS[el.dataset.shot] = img; }
      analyse(el.dataset.msg, el.dataset.to);
    }
    if (a === 'askcam') {
      if (!camOK()) { toast('Caméra indisponible sur ce navigateur : les photos seront simulées.'); go('o4'); return; }
      openStream().then(() => { stopCamera(); go('o4'); })
        .catch(() => { toast('Caméra refusée : tu pourras l’autoriser plus tard.'); setTimeout(() => go('o4'), 1200); });
    }
    if (a === 'decide') {
      state.compares += 1;
      if (el.dataset.d === 'pass') { state.laisses += 1; save(); go('cp5'); } else { state.gardes += 1; save(); go('cp4'); }
    }
    if (a === 'cabine') {
      const ref = REFS.find(r => r.id === el.dataset.ref);
      state.cabine.unshift({ name: SHOTS.store ? 'Pièce photographiée' : 'Pantalon kaki à pinces', img: SHOTS.store || IMG.piece, verdict: `${VERDICT[el.dataset.v]} · vs ton ${ref.name.toLowerCase()}`, when: 'À l’instant', ref: ref.id });
      save(); go('cabine');
    }
  });

  /* Panneau de scénarios (bureau) */
  const SCENARIOS = [
    ['o1', 'Premier lancement', 'Bienvenue → données'],
    ['accueil', 'Accueil', 'garde-robe remplie'],
    ['vide', 'Accueil vide', 'après l’onboarding'],
    ['cat', 'Ajouter un vêtement', '3 étapes'],
    ['ad1', 'Ajouter par l’étiquette', ''],
    ['scan', 'Comparer en magasin', 'résultat jean droit'],
    ['aucun', 'Aucune correspondance', 'verdict Passe'],
    ['cp2', 'Aucun vêtement de ce type', ''],
    ['ad3', 'Photo à reprendre', 'ajout'],
    ['cp3', 'Photo à reprendre', 'en magasin'],
    ['cabine', 'Ma cabine', ''],
    ['param', 'Paramètres', ''],
  ];
  const list = document.getElementById('scenarios');
  list.innerHTML = SCENARIOS.map(([r, t, d], i) => `<li><a href="#/${r}" data-r="${r}"><b>${i + 1}.</b><span>${t}${d ? ` <small>· ${d}</small>` : ''}</span></a></li>`).join('');
  function markScenario(key) { list.querySelectorAll('a').forEach(a => a.toggleAttribute('aria-current', a.dataset.r === key)); }
  document.getElementById('reset').addEventListener('click', () => { state = clone(DEFAULT_STATE); save(); render(); toast('Données de test réinitialisées.'); });

  window.addEventListener('hashchange', render);
  render();
})();
