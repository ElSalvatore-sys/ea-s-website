import { useTranslation as useI18nTranslation } from 'react-i18next';

// Re-export the useTranslation hook with performance optimizations
export const useTranslation = () => {
  const { t, i18n } = useI18nTranslation();
  
  return {
    t,
    language: i18n.language,
    changeLanguage: i18n.changeLanguage.bind(i18n),
    ready: i18n.isInitialized,
  };
};

export default useTranslation;