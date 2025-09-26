import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

const isProduction = typeof process !== 'undefined' && process.env?.NODE_ENV === 'production';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: 'en', // Default language
    fallbackLng: 'en', // Fallback to English if loading fails
    debug: true, // Enable debug to see loading errors

    // Performance optimization: namespace support
    defaultNS: 'translation',
    ns: ['translation'],

    // Interpolation settings
    interpolation: {
      escapeValue: false, // React already escapes
    },

    // Language detection settings
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'ea-language',
      checkWhitelist: true,
    },

    // Backend configuration for lazy loading
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
      // Cache translations in localStorage for 7 days
      requestOptions: {
        cache: 'default',
      },
    },

    // Supported languages
    supportedLngs: ['en', 'de', 'fr', 'it'],
    
    // React-specific settings
    react: {
      useSuspense: false, // Disable suspense to prevent hanging on load failure
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'em'],
    },

    // Performance optimizations
    load: 'languageOnly', // Load only 'en' not 'en-US'
    preload: ['en'], // Preload default language

    // Resource caching
    saveMissing: false,
    missingKeyHandler: (lng, ns, key) => {
      if (!isProduction) {
        console.warn(`Missing translation key: ${key} in ${lng}/${ns}`);
      }
    },

    // Return empty string when translation is missing to avoid showing keys
    parseMissingKeyHandler: (key) => '',
    fallbackValue: '',

    // Advanced settings for performance
    initImmediate: true, // Initialize immediately, don't wait for resources
    cleanCode: true,
    
    // Memory management
    returnObjects: false,
    returnEmptyString: false,
    returnNull: false,
  });

// Preload critical languages for faster switching
if (typeof window !== 'undefined') {
  // Ensure DOM is ready before manipulating it
  const initI18nExtras = () => {
    // Preload German and Italian for EU audience
    setTimeout(() => {
      i18n.loadLanguages(['de', 'it']).catch(err => {
        console.warn('[i18n] Failed to preload languages:', err);
      });
    }, 2000);

    // Track language switching for analytics
    i18n.on('languageChanged', (lng) => {
      document.documentElement.lang = lng;

      // Performance tracking
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'language_change', {
          event_category: 'user_preference',
          event_label: lng,
        });
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initI18nExtras);
  } else {
    // DOM is already ready
    initI18nExtras();
  }
}

export default i18n;