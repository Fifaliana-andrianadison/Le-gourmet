(function () {
  let currentLang = 'fr';
  let translations = {};

  function detectLanguage() {
    const stored = localStorage.getItem('lang');
    if (stored && ['fr', 'en', 'mg'].includes(stored)) {
      return stored;
    }
    const browserLang = navigator.language.slice(0, 2);
    return ['fr', 'en', 'mg'].includes(browserLang) ? browserLang : 'fr';
  }

  async function loadTranslations(lang) {
    try {
      const response = await fetch(`../locales/${lang}.json`);
      if (!response.ok) throw new Error('Failed to load translations');
      translations = await response.json();
      currentLang = lang;
      localStorage.setItem('lang', lang);
      applyTranslations();
    } catch (error) {
      console.error('Error loading translations:', error);
    }
  }

  function getTranslation(key) {
    const keys = key.split('.');
    let value = translations;
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }
    return typeof value === 'string' ? value : key;
  }

  function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach((element) => {
      const key = element.getAttribute('data-i18n');
      const translation = getTranslation(key);
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        if (element.hasAttribute('placeholder')) {
          element.setAttribute('placeholder', translation);
        }
      } else {
        element.textContent = translation;
      }
    });
  }

  function switchLang(newLang) {
    if (newLang === currentLang) return;
    const path = window.location.pathname;
    const pathParts = path.split('/').filter(Boolean);
    if (pathParts.length > 0 && ['fr', 'en', 'mg'].includes(pathParts[0])) {
      pathParts[0] = newLang;
    } else {
      pathParts.unshift(newLang);
    }
    localStorage.setItem('lang', newLang);
    window.location.href = '/' + pathParts.join('/');
  }

  function toggleLangDropdown() {
    const langSelector = document.querySelector('.lang-selector');
    if (langSelector) {
      langSelector.classList.toggle('open');
    }
  }

  function closeLangDropdown(e) {
    const langSelector = document.querySelector('.lang-selector');
    if (langSelector && !langSelector.contains(e.target)) {
      langSelector.classList.remove('open');
    }
  }

  function initLangSwitcher() {
    document.addEventListener('click', closeLangDropdown);
    document.querySelectorAll('.lang-dropdown button').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const lang = btn.getAttribute('data-lang');
        switchLang(lang);
      });
    });
  }

  function updateActiveNav() {
    const path = window.location.pathname;
    const currentPage = path.split('/').pop().replace('.html', '') || 'index';
    document.querySelectorAll('nav ul li a').forEach((link) => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href && href.includes(currentPage + '.html')) {
        link.classList.add('active');
      }
    });
  }

  function init() {
    currentLang = detectLanguage();
    initLangSwitcher();
    updateActiveNav();
    loadTranslations(currentLang);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.switchLang = switchLang;
  window.getTranslation = getTranslation;
  window.currentLang = () => currentLang;
  window.toggleLangDropdown = toggleLangDropdown;
})();
