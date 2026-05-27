# 🌐 Site Web Multilingue — HTML / CSS / JavaScript

## 📋 Description du projet

Créer un site web statique complet avec **10 pages**, **3 langues** (Français, Anglais, Malagasy), sans framework, uniquement en HTML, CSS et JavaScript vanilla.

---

## 🗂️ Structure des dossiers à créer

```
mon-site/
├── index.html                  ← Racine : détecte la langue et redirige
│
├── fr/                         ← Version Française
│   ├── index.html              ← Accueil
│   ├── about.html              ← À propos
│   ├── services.html           ← Services
│   ├── portfolio.html          ← Portfolio
│   ├── blog.html               ← Blog
│   ├── faq.html                ← FAQ
│   ├── team.html               ← Équipe
│   ├── pricing.html            ← Tarifs
│   ├── contact.html            ← Contact
│   └── legal.html              ← Mentions légales
│
├── en/                         ← Version Anglaise (même structure que /fr/)
│   ├── index.html
│   ├── about.html
│   ├── services.html
│   ├── portfolio.html
│   ├── blog.html
│   ├── faq.html
│   ├── team.html
│   ├── pricing.html
│   ├── contact.html
│   └── legal.html
│
├── mg/                         ← Version Malagasy (même structure que /fr/)
│   ├── index.html
│   ├── about.html
│   ├── services.html
│   ├── portfolio.html
│   ├── blog.html
│   ├── faq.html
│   ├── team.html
│   ├── pricing.html
│   ├── contact.html
│   └── legal.html
│
├── css/
│   ├── reset.css               ← Reset CSS (box-sizing, marges, etc.)
│   └── style.css               ← Styles globaux du site
│
├── js/
│   ├── i18n.js                 ← Système de traduction (charge le bon .json)
│   └── main.js                 ← Scripts généraux (menu, animations, etc.)
│
├── locales/
│   ├── fr.json                 ← Toutes les chaînes de texte en Français
│   ├── en.json                 ← Toutes les chaînes de texte en Anglais
│   └── mg.json                 ← Toutes les chaînes de texte en Malagasy
│
└── img/
    ├── logo.svg
    └── ...                     ← Illustrations, photos, icônes
```

**Total : 30 pages HTML** (10 pages × 3 langues) + fichiers partagés.

---

## 📄 Liste des 10 pages

| # | Nom | Fichier | Description |
|---|-----|---------|-------------|
| 1 | Accueil | `index.html` | Hero, présentation rapide, CTA principal |
| 2 | À propos | `about.html` | Histoire, valeurs, mission de l'entreprise |
| 3 | Services | `services.html` | Liste et description des services proposés |
| 4 | Portfolio | `portfolio.html` | Galerie de projets réalisés |
| 5 | Blog | `blog.html` | Liste d'articles, avec liens vers chaque article |
| 6 | FAQ | `faq.html` | Questions fréquentes en accordéon |
| 7 | Équipe | `team.html` | Présentation des membres de l'équipe |
| 8 | Tarifs | `pricing.html` | Plans et grille tarifaire |
| 9 | Contact | `contact.html` | Formulaire de contact + infos |
| 10 | Mentions légales | `legal.html` | Mentions légales, CGU, politique de confidentialité |

---

## 🌍 Gestion des 3 langues

### Langues supportées

| Code | Langue | Dossier |
|------|--------|---------|
| `fr` | Français | `/fr/` |
| `en` | English | `/en/` |
| `mg` | Malagasy | `/mg/` |

### Fonctionnement de la détection

Le fichier `index.html` racine doit :
1. Lire `navigator.language` pour détecter la langue du navigateur
2. Vérifier si un cookie `lang` est déjà défini (choix précédent de l'utilisateur)
3. Vérifier si l'URL contient déjà un préfixe de langue (`/fr/`, `/en/`, `/mg/`)
4. Rediriger automatiquement vers la bonne version (ex : `/fr/index.html`)
5. Si la langue n'est pas supportée, rediriger vers `/fr/` par défaut

### Exemple de logique dans `index.html`

```html
<script>
  const supported = ['fr', 'en', 'mg'];
  const saved = localStorage.getItem('lang');
  const browser = (navigator.language || 'fr').slice(0, 2);
  const lang = supported.includes(saved) ? saved : supported.includes(browser) ? browser : 'fr';
  window.location.href = `/${lang}/index.html`;
</script>
```

### Fichiers de traduction (`locales/*.json`)

Chaque page utilise des clés de traduction. Exemple de structure `fr.json` :

```json
{
  "nav": {
    "home": "Accueil",
    "about": "À propos",
    "services": "Services",
    "portfolio": "Portfolio",
    "blog": "Blog",
    "faq": "FAQ",
    "team": "Équipe",
    "pricing": "Tarifs",
    "contact": "Contact",
    "legal": "Mentions légales"
  },
  "home": {
    "hero_title": "Bienvenue sur notre site",
    "hero_subtitle": "Nous créons des expériences digitales exceptionnelles",
    "cta": "Découvrir nos services"
  },
  "contact": {
    "title": "Contactez-nous",
    "name_label": "Votre nom",
    "email_label": "Votre email",
    "message_label": "Votre message",
    "submit": "Envoyer"
  },
  "footer": {
    "rights": "Tous droits réservés"
  }
}
```

Les fichiers `en.json` et `mg.json` ont les **mêmes clés**, avec les valeurs traduites.

### Fichier `js/i18n.js`

```javascript
async function loadTranslations(lang) {
  const response = await fetch(`/locales/${lang}.json`);
  const translations = await response.json();
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const value = key.split('.').reduce((obj, k) => obj?.[k], translations);
    if (value) el.textContent = value;
  });
}

const lang = localStorage.getItem('lang') || 'fr';
loadTranslations(lang);

function switchLang(newLang) {
  localStorage.setItem('lang', newLang);
  const currentPage = window.location.pathname.replace(/^\/(fr|en|mg)\//, '/');
  window.location.href = `/${newLang}${currentPage}`;
}
```

Dans le HTML, les éléments traduisibles utilisent l'attribut `data-i18n` :

```html
<h1 data-i18n="home.hero_title">Bienvenue</h1>
<p data-i18n="home.hero_subtitle">Sous-titre ici</p>
```

---

## 🧱 Structure HTML commune à toutes les pages

Chaque page HTML doit respecter ce gabarit :

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title data-i18n="page.title">Titre de la page</title>
  <link rel="stylesheet" href="/css/reset.css" />
  <link rel="stylesheet" href="/css/style.css" />
  <!-- Hreflang SEO -->
  <link rel="alternate" hreflang="fr" href="https://monsite.com/fr/PAGE.html" />
  <link rel="alternate" hreflang="en" href="https://monsite.com/en/PAGE.html" />
  <link rel="alternate" hreflang="mg" href="https://monsite.com/mg/PAGE.html" />
</head>
<body>

  <!-- HEADER / NAVIGATION -->
  <header>
    <nav>
      <a href="/fr/index.html"><img src="/img/logo.svg" alt="Logo" /></a>
      <ul>
        <li><a href="/fr/index.html"     data-i18n="nav.home">Accueil</a></li>
        <li><a href="/fr/about.html"     data-i18n="nav.about">À propos</a></li>
        <li><a href="/fr/services.html"  data-i18n="nav.services">Services</a></li>
        <li><a href="/fr/portfolio.html" data-i18n="nav.portfolio">Portfolio</a></li>
        <li><a href="/fr/blog.html"      data-i18n="nav.blog">Blog</a></li>
        <li><a href="/fr/contact.html"   data-i18n="nav.contact">Contact</a></li>
      </ul>
      <!-- Sélecteur de langue -->
      <div class="lang-switcher">
        <button onclick="switchLang('fr')">FR</button>
        <button onclick="switchLang('en')">EN</button>
        <button onclick="switchLang('mg')">MG</button>
      </div>
      <!-- Bouton menu mobile -->
      <button class="menu-toggle" aria-label="Ouvrir le menu">☰</button>
    </nav>
  </header>

  <!-- CONTENU PRINCIPAL -->
  <main>
    <!-- Contenu spécifique à chaque page -->
  </main>

  <!-- FOOTER -->
  <footer>
    <p>&copy; 2025 Mon Site. <span data-i18n="footer.rights">Tous droits réservés</span></p>
    <a href="/fr/legal.html" data-i18n="nav.legal">Mentions légales</a>
  </footer>

  <script src="/js/i18n.js"></script>
  <script src="/js/main.js"></script>
</body>
</html>
```

---

## 🎨 CSS — Conventions

### `css/reset.css`
- Reset universel (`*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }`)
- Typographie de base, `scroll-behavior: smooth`

### `css/style.css`
- Variables CSS (couleurs, polices, espacements)
- Styles du header/nav/footer
- Styles communs (boutons, formulaires, cartes)
- Classes utilitaires
- Media queries (mobile-first)

Exemple de variables CSS :

```css
:root {
  --color-primary:    #2563eb;
  --color-secondary:  #64748b;
  --color-bg:         #ffffff;
  --color-text:       #1e293b;
  --font-main:        'Inter', sans-serif;
  --spacing-sm:       0.5rem;
  --spacing-md:       1rem;
  --spacing-lg:       2rem;
  --border-radius:    8px;
  --max-width:        1200px;
}
```

---

## ⚙️ Instructions pour OpenCode

### Ce qu'il faut générer

1. **Créer tous les dossiers** : `fr/`, `en/`, `mg/`, `css/`, `js/`, `locales/`, `img/`
2. **Créer `index.html`** à la racine avec la logique de redirection de langue
3. **Créer les 30 pages HTML** (10 par langue) avec le gabarit commun et le contenu approprié
4. **Créer `css/reset.css`** et **`css/style.css`** avec un design moderne et responsive
5. **Créer `js/i18n.js`** avec le système de traduction
6. **Créer `js/main.js`** avec menu mobile (hamburger), animations au scroll, etc.
7. **Créer `locales/fr.json`**, **`locales/en.json`**, **`locales/mg.json`** avec toutes les clés

### Contraintes techniques

- **Aucun framework** : uniquement HTML, CSS, JavaScript vanilla
- **Aucune dépendance npm** : tout fonctionne en ouvrant les fichiers dans un navigateur ou via `npx serve .`
- **Mobile-first** : le CSS doit être responsive dès le départ
- **Accessibilité** : balises sémantiques (`<header>`, `<main>`, `<footer>`, `<nav>`, `<section>`, `<article>`), attributs `alt`, `aria-label`
- **Performance** : CSS minimaliste, pas de bibliothèques inutiles
- **SEO** : balises `<title>`, `<meta name="description">`, balises Open Graph sur chaque page
- **Hreflang** : chaque page doit déclarer les liens alternatifs dans le `<head>`

### Ordre de création recommandé

1. `css/reset.css` et `css/style.css`
2. `locales/fr.json`, `en.json`, `mg.json`
3. `js/i18n.js` et `js/main.js`
4. `index.html` (racine — redirection langue)
5. `fr/index.html` (page d'accueil modèle complète)
6. Les 9 autres pages dans `fr/`
7. Dupliquer et adapter pour `en/` et `mg/`

---

## ✅ Checklist de validation

- [ ] Les 30 pages HTML existent et s'affichent correctement
- [ ] La redirection de langue fonctionne depuis `index.html` racine
- [ ] Le sélecteur de langue change la langue et redirige vers la page équivalente
- [ ] Tous les textes utilisent `data-i18n` et sont chargés depuis les fichiers `.json`
- [ ] Le menu de navigation est fonctionnel sur mobile (hamburger toggle)
- [ ] Le formulaire de contact est présent sur `contact.html` (avec validation JS)
- [ ] Le CSS est responsive (mobile 375px, tablette 768px, desktop 1200px)
- [ ] Les balises `hreflang` sont présentes sur toutes les pages
- [ ] Toutes les images ont des attributs `alt`
- [ ] Le site fonctionne sans erreur dans la console du navigateur
- [ ] Le site est testable avec `npx serve .` depuis le dossier racine
