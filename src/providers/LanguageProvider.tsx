import React from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from '../i18n/config';

export interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
};

// Export a hook for backward compatibility with existing code
export const useLanguage = () => {
  const { t, i18n: i18nInstance, ready } = useTranslation();

  return {
    language: i18nInstance.language || 'en',
    t: (key: string) => t(key),
    setLanguage: (lang: string) => i18nInstance.changeLanguage(lang),
    languages: [
      { code: 'en', name: 'English', flag: '🇬🇧' },
      { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
      { code: 'fr', name: 'Français', flag: '🇫🇷' },
      { code: 'it', name: 'Italiano', flag: '🇮🇹' }
    ],
    isLoading: !ready,
  };
};

export default LanguageProvider;