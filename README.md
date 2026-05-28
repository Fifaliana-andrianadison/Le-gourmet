Static multilingual restaurant website (FR / EN / MG) — vanilla HTML, CSS, JavaScript only. No frameworks, no npm dependencies.

## Key constraints

- **No frameworks, no build step** — open files directly in a browser or run `npx serve .`
- **30 HTML pages** total: 10 pages × 3 language directories (`fr/`, `en/`, `mg/`)
- **Shared assets** live in `css/`, `js/`, `locales/`, `img/` at the repo root
- **Mobile-first** responsive CSS; accessibility with semantic HTML and `alt`/`aria-label`

## i18n system

- Root `index.html` detects browser language, checks `localStorage.getItem('lang')`, and redirects to `/{lang}/index.html`. Falls back to `fr`.
- Each page uses `data-i18n="key"` attributes; `js/i18n.js` fetches `locales/{lang}.json` and populates them via dot-path lookup.
- `switchLang(newLang)` saves to localStorage and reloads the current page under the new language prefix.
- All three `locales/*.json` files must have **identical keys**.
- Language selector uses flag images from `flagcdn.com` (e.g. `https://flagcdn.com/w40/fr.png`).

## Creation order

1. `css/reset.css` + `css/style.css`
2. `locales/fr.json`, `en.json`, `mg.json`
3. `js/i18n.js` + `js/main.js`
4. Root `index.html` (language redirect)
5. `fr/index.html` (complete template)
6. Remaining 9 pages in `fr/`
7. Duplicate and adapt for `en/` and `mg/`

## Page list

`index`, `about`, `menu`, `gallery`, `blog`, `contact`, `faq`, `team`, `pricing`, `legal` — same filenames in each language directory.

## HTML page template

Every page includes: `<html lang="{lang}">`, charset + viewport meta, CSS links, hreflang `<link rel="alternate">` tags for all 3 languages, `<header>` with nav (6 items) + lang-switcher dropdown with flags, `<main>`, `<footer>` with 4 columns, then `<script>` tags for `i18n.js` and `main.js`.

## Hero backgrounds

Each page has a unique hero background image from Unsplash with `slowZoom` CSS animation. Hero classes: `hero-home`, `hero-about`, `hero-menu`, `hero-gallery`, `hero-blog`, `hero-contact`, `hero-faq`, `hero-team`, `hero-pricing`, `hero-legal`. Each has `.hero-bg` and `.hero-overlay` divs inside.

## External CDNs

- Font Awesome 6.5.1 (icons)
- Chart.js 4.4.1 (only on home pages)
- Leaflet 1.9.4 (only on contact pages)
- flagcdn.com (flag images in language selector)

## Theme system

- Light mode by default (`:root`); dark mode via `[data-theme="dark"]` on `<html>`
- All color variables (`--bg`, `--text`, `--border`, shadows, etc.) are overridden in the `[data-theme="dark"]` block in `css/style.css`
- Toggle button (`.theme-toggle`) with sun/moon icons in the header, between lang-selector and menu-toggle
- `js/main.js` `initThemeToggle()` handles click to toggle `data-theme` attribute + `localStorage` persistence
- Smooth `transition` on `body` for `background` and `color`
- Dark mode overrides also for `header` background (→ `rgba(13,13,13,0.85)`), `.logo span` color (→ `var(--gold-light)`), and `.hero-overlay` gradient

## Validation

- All 30 pages render without console errors
- Language redirect from root works; lang-switcher preserves current page path
- Contact form has JS validation
- CSS responsive at 375px, 768px, 1200px breakpoints
- Hreflang tags on every page; all images have `alt`
- Hero background images visible with slow zoom animation
