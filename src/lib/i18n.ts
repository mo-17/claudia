import i18n, { InitOptions } from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enCommon from '../locales/en/common.json';
import zhCommon from '../locales/zh/common.json';

// Define available languages
export const LANGUAGES = {
  en: 'English',
  zh: '中文',
} as const;

export type LanguageCode = keyof typeof LANGUAGES;

// Translation resources
const resources = {
  en: {
    common: enCommon,
  },
  zh: {
    common: zhCommon,
  },
};

// Initialize i18next
const initOptions: InitOptions = {
  resources,
  fallbackLng: 'en',
  defaultNS: 'common',
  ns: ['common'],
  
  detection: {
    order: ['localStorage', 'navigator', 'htmlTag'],
    caches: ['localStorage'],
    lookupLocalStorage: 'claudia-language',
  },
  
  interpolation: {
    escapeValue: false,
  },
  
  react: {
    useSuspense: false,
  },
  
  debug: process.env.NODE_ENV === 'development',
};

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init(initOptions);

export default i18n;