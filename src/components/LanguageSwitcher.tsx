import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check, ChevronDown, Coffee, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { localeConfigs, detectBrowserLanguage, saveLanguagePreference, type SupportedLocale } from '../utils/localization';
import { trackLanguage } from '../lib/gdpr-analytics';

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isChanging, setIsChanging] = useState(false);

  // Initialize language on mount
  useEffect(() => {
    const detectedLocale = detectBrowserLanguage();
    const savedLocale = localStorage.getItem('ea-language') as SupportedLocale;
    const initialLocale = savedLocale || detectedLocale;

    if (i18n.language !== initialLocale) {
      i18n.changeLanguage(initialLocale);
      trackLanguage.selectLanguage(initialLocale as 'de' | 'en' | 'fr' | 'it', savedLocale ? 'manual' : 'auto');
    }
  }, [i18n]);

  const handleLanguageChange = async (locale: SupportedLocale) => {
    if (locale === i18n.language) {
      setIsOpen(false);
      return;
    }

    setIsChanging(true);

    try {
      // Track language change
      trackLanguage.selectLanguage(locale as 'de' | 'en' | 'fr' | 'it', 'manual');

      // Save preference
      saveLanguagePreference(locale);

      // Change language with smooth transition
      await i18n.changeLanguage(locale);

      // Close dropdown after successful change
      setIsOpen(false);

      // Show success toast (optional)
      showSuccessToast(locale);
    } catch (error) {
      console.error('Failed to change language:', error);
    } finally {
      setIsChanging(false);
    }
  };

  const showSuccessToast = (locale: SupportedLocale) => {
    const messages = {
      de: 'Sprache geändert zu Deutsch',
      fr: 'Langue changée en français',
      en: 'Language changed to English',
      it: 'Lingua cambiata in italiano'
    };

    // Create a simple toast notification
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2';
    toast.innerHTML = `
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      <span>${messages[locale]}</span>
    `;
    document.body.appendChild(toast);

    // Animate in
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'transform 0.3s ease-out';
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
    }, 10);

    // Remove after 3 seconds
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  };

  const currentLocale = i18n.language as SupportedLocale;
  const currentConfig = localeConfigs[currentLocale] || localeConfigs.en;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isChanging}
        className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-200 disabled:opacity-50"
        aria-label="Language selector"
        aria-expanded={isOpen}
      >
        <Globe className="w-4 h-4" />
        <span className="flex items-center gap-1">
          <span className="text-lg">{currentConfig.flag}</span>
          <span className="hidden sm:inline">{currentConfig.name}</span>
          <span className="sm:hidden">{currentConfig.code.toUpperCase()}</span>
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-48 bg-gray-900 backdrop-blur-xl border border-white/10 rounded-lg shadow-xl overflow-hidden z-50"
          >
            {Object.entries(localeConfigs).map(([locale, config]) => {
              const isActive = locale === currentLocale;
              return (
                <button
                  key={locale}
                  onClick={() => handleLanguageChange(locale as SupportedLocale)}
                  disabled={isChanging}
                  className={`
                    w-full px-4 py-3 flex items-center gap-3 transition-all duration-200
                    ${isActive
                      ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white'
                      : 'hover:bg-white/5 text-gray-300 hover:text-white'
                    }
                    disabled:opacity-50
                  `}
                >
                  <span className="text-lg">{config.flag}</span>
                  <span className="flex-1 text-left">{config.name}</span>
                  {isActive && <Check className="w-4 h-4 text-green-400" />}
                </button>
              );
            })}

            <div className="border-t border-white/10 p-3">
              <div className="text-xs text-gray-400">
                {currentLocale === 'de' && (
                  <>
                    <div className="flex items-center gap-1 mb-1">
                      <Coffee className="w-3 h-3" />
                      <span>Mittagspause: 12:00-13:00</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-3 h-3" />
                      <span>Mo-Fr Geschäftszeiten</span>
                    </div>
                  </>
                )}
                {currentLocale === 'fr' && (
                  <>
                    <div className="flex items-center gap-1 mb-1">
                      <Coffee className="w-3 h-3" />
                      <span>Pause déjeuner: 12h-14h</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-3 h-3" />
                      <span>Lun-Ven heures d'ouverture</span>
                    </div>
                  </>
                )}
                {currentLocale === 'en' && (
                  <>
                    <div className="flex items-center gap-1 mb-1">
                      <Coffee className="w-3 h-3" />
                      <span>Lunch break: 12:00-1:00 PM</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-3 h-3" />
                      <span>Mon-Fri business hours</span>
                    </div>
                  </>
                )}
                {currentLocale === 'it' && (
                  <>
                    <div className="flex items-center gap-1 mb-1">
                      <Coffee className="w-3 h-3" />
                      <span>Pausa pranzo: 13:00-15:00</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-3 h-3" />
                      <span>Lun-Ven orari di apertura</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;