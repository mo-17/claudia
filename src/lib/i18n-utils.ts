import { TFunction } from 'i18next';
import { LANGUAGES, type LanguageCode } from './i18n';

/**
 * Utility functions for i18n operations
 */

/**
 * Get the display name for a language code
 */
export function getLanguageDisplayName(code: LanguageCode): string {
  return LANGUAGES[code] || LANGUAGES.en;
}

/**
 * Get all available language codes
 */
export function getAvailableLanguages(): LanguageCode[] {
  return Object.keys(LANGUAGES) as LanguageCode[];
}

/**
 * Check if a language code is valid
 */
export function isValidLanguageCode(code: string): code is LanguageCode {
  return code in LANGUAGES;
}

/**
 * Get the browser's preferred language that we support
 */
export function getBrowserLanguage(): LanguageCode {
  const browserLang = navigator.language.split('-')[0];
  return isValidLanguageCode(browserLang) ? browserLang : 'en';
}

/**
 * Format a translation key for easier access
 */
export function formatTranslationKey(namespace: string, key: string): string {
  return `${namespace}:${key}`;
}

/**
 * Safe translation function that provides fallback
 */
export function safeTranslate(t: TFunction, key: string, fallback?: string): string {
  try {
    const result = t(key);
    return result !== key ? result : fallback || key;
  } catch (error) {
    console.warn(`Translation error for key: ${key}`, error);
    return fallback || key;
  }
}

/**
 * Format a date according to the current locale
 */
export function formatDate(date: Date, locale: string = 'en'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Format a number according to the current locale
 */
export function formatNumber(num: number, locale: string = 'en'): string {
  return new Intl.NumberFormat(locale).format(num);
}

/**
 * Format currency according to the current locale
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Get direction (LTR/RTL) for a language
 */
export function getLanguageDirection(code: LanguageCode): 'ltr' | 'rtl' {
  // For now, all supported languages are LTR
  // Add RTL languages here if needed in the future
  const rtlLanguages: LanguageCode[] = [];
  return rtlLanguages.includes(code) ? 'rtl' : 'ltr';
}

/**
 * Storage keys for i18n persistence
 */
export const I18N_STORAGE_KEYS = {
  LANGUAGE: 'claudia-language',
  LOCALE_DATA: 'claudia-locale-data',
} as const;