import 'react-i18next';

// Import translation resources
import common from '../locales/en/common.json';

// Define translation resources interface
interface Resources {
  common: typeof common;
}

// Module augmentation to provide type safety for react-i18next
declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: Resources;
  }
}

// Export types for use in components
export type TranslationKey = keyof typeof common;
export type DeepKeys<T> = T extends object
  ? {
      [K in keyof T]: T[K] extends object
        ? `${K & string}.${DeepKeys<T[K]> & string}`
        : K & string;
    }[keyof T]
  : never;

export type CommonTranslationKeys = DeepKeys<typeof common>;
export type LanguageResources = Resources;