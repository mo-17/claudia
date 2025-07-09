import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LANGUAGES, type LanguageCode } from '@/lib/i18n';

export interface LanguageState {
  currentLanguage: LanguageCode;
  availableLanguages: typeof LANGUAGES;
  isLoading: boolean;
  error: string | null;
}

export interface LanguageActions {
  changeLanguage: (languageCode: LanguageCode) => Promise<void>;
  resetLanguage: () => Promise<void>;
  detectLanguage: () => LanguageCode;
}

export function useLanguage(): LanguageState & LanguageActions {
  const { i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const currentLanguage = (i18n.language as LanguageCode) || 'en';
  
  const changeLanguage = useCallback(async (languageCode: LanguageCode) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await i18n.changeLanguage(languageCode);
      
      // Store in localStorage for persistence
      localStorage.setItem('claudia-language', languageCode);
      
      // Update document language attribute
      document.documentElement.lang = languageCode;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to change language: ${errorMessage}`);
      console.error('Language change failed:', err);
    } finally {
      setIsLoading(false);
    }
  }, [i18n]);
  
  const resetLanguage = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Clear localStorage
      localStorage.removeItem('claudia-language');
      
      // Reset to default language
      await i18n.changeLanguage('en');
      
      // Update document language attribute
      document.documentElement.lang = 'en';
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to reset language: ${errorMessage}`);
      console.error('Language reset failed:', err);
    } finally {
      setIsLoading(false);
    }
  }, [i18n]);
  
  const detectLanguage = useCallback((): LanguageCode => {
    // Check localStorage first
    const storedLanguage = localStorage.getItem('claudia-language');
    if (storedLanguage && storedLanguage in LANGUAGES) {
      return storedLanguage as LanguageCode;
    }
    
    // Check browser language
    const browserLanguage = navigator.language.split('-')[0];
    if (browserLanguage in LANGUAGES) {
      return browserLanguage as LanguageCode;
    }
    
    // Default to English
    return 'en';
  }, []);
  
  // Initialize language on mount
  useEffect(() => {
    const detectedLanguage = detectLanguage();
    if (detectedLanguage !== currentLanguage) {
      changeLanguage(detectedLanguage);
    }
    
    // Set document language attribute
    document.documentElement.lang = currentLanguage;
  }, []);
  
  // Update document language when language changes
  useEffect(() => {
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);
  
  return {
    currentLanguage,
    availableLanguages: LANGUAGES,
    isLoading,
    error,
    changeLanguage,
    resetLanguage,
    detectLanguage,
  };
}