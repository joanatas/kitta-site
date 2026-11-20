(function () {
    function getInitialLanguage() {
        // 1. parametro query url ?lang=...
        const urlParams = new URLSearchParams(window.location.search);
        const langParam = urlParams.get('lang');
        if (langParam && typeof TRANSLATIONS !== 'undefined' && TRANSLATIONS[langParam]) {
            return langParam;
        }

        // 2. localstorage
        try {
            const stored = localStorage.getItem('kitta_lang');
            if (stored && typeof TRANSLATIONS !== 'undefined' && TRANSLATIONS[stored]) {
                return stored;
            }
        } catch (e) { }

        // 3. idioma do navegador
        const browserLangs = navigator.languages || [navigator.language || ''];
        for (const bl of browserLangs) {
            if (!bl) continue;
            const normalized = bl.toLowerCase();
            if (normalized === 'pt-pt') return 'pt-PT';
            if (normalized.startsWith('pt')) return 'pt-BR';
            if (normalized === 'en-gb') return 'en-GB';
            if (normalized.startsWith('en')) return 'en-US';
            if (normalized === 'es-es') return 'es-ES';
            if (normalized.startsWith('es')) return 'es';
            if (normalized.startsWith('fr')) return 'fr';
            if (normalized.startsWith('de')) return 'de';
            if (normalized.startsWith('it')) return 'it';
            if (normalized.startsWith('nl')) return 'nl';
            if (normalized.startsWith('pl')) return 'pl';
        }

        return 'pt-BR';
    }

    function applyLanguage(lang) {
        if (lang === 'en') lang = 'en-US';
        if (typeof TRANSLATIONS === 'undefined' || !TRANSLATIONS[lang]) {
            lang = 'pt-BR';
        }
        const t = TRANSLATIONS[lang];
        if (!t) return;

        document.documentElement.lang = lang;
        updateLanguageDisplay(lang);

        if (t.meta_title) document.title = t.meta_title;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && t.meta_desc) {
            metaDesc.setAttribute('content', t.meta_desc);
        }

        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            const key = el.getAttribute('data-i18n');
            if (t[key] !== undefined) {
                el.textContent = t[key];
            }
        });

        document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
            const key = el.getAttribute('data-i18n-html');
            if (t[key] !== undefined) {
                el.innerHTML = t[key];
            }
        });

        const select = document.getElementById('lang-select');
        if (select && select.value !== lang) {
            select.value = lang;
        }

        try {
            localStorage.setItem('kitta_lang', lang);
        } catch (e) { }
    }

    const LANG_SHORT_NAMES = {
        'pt-BR': 'PT-BR',
        'pt-PT': 'PT-PT',
        'en-US': 'EN-US',
        'en-GB': 'EN-UK',
        'en': 'EN-US',
        'es-ES': 'ES-ES',
        'es': 'ES',
        'fr': 'FR',
        'de': 'DE',
        'it': 'IT',
        'nl': 'NL',
        'pl': 'PL'
    };

    const LANG_FULL_NAMES = {
        'pt-BR': 'Português (BR)',
        'pt-PT': 'Português (PT)',
        'en-US': 'English (US)',
        'en-GB': 'English (UK)',
        'en': 'English (US)',
        'es': 'Español (LA)',
        'es-ES': 'Español (ES)',
        'fr': 'Français',
        'de': 'Deutsch',
        'it': 'Italiano',
        'nl': 'Nederlands',
        'pl': 'Polski'
    };

    function updateLanguageDisplay(lang) {
        if (!lang || typeof lang !== 'string') {
            const sel = document.getElementById('lang-select');
            lang = (sel && sel.value) ? sel.value : 'pt-BR';
        }
        const full = document.getElementById('lang-text-full');
        const short = document.getElementById('lang-text-short');
        if (full) {
            full.textContent = LANG_FULL_NAMES[lang] || 'Português (BR)';
        }
        if (short) {
            short.textContent = LANG_SHORT_NAMES[lang] || 'PT-BR';
        }
    }

    function init() {
        // redirecionamento retrocompativel para links com hash (#privacidade ou #privacy)
        if (window.location.hash === '#privacidade' || window.location.hash === '#privacy') {
            window.location.replace('/privacy/');
            return;
        }

        const currentLang = getInitialLanguage();
        applyLanguage(currentLang);
        updateLanguageDisplay(currentLang);

        const select = document.getElementById('lang-select');
        if (select && !select.dataset.listenerBound) {
            select.dataset.listenerBound = 'true';
            select.addEventListener('change', function (e) {
                applyLanguage(e.target.value);
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
