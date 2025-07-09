import { createContext, useContext, ReactNode } from 'react';
import { useLanguage, type LanguageState, type LanguageActions } from '@/lib/hooks/useLanguage';

type LanguageContextValue = LanguageState & LanguageActions;

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const languageState = useLanguage();
  
  return (
    <LanguageContext.Provider value={languageState}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguageContext(): LanguageContextValue {
  const context = useContext(LanguageContext);
  
  if (context === undefined) {
    throw new Error('useLanguageContext must be used within a LanguageProvider');
  }
  
  return context;
}

export default LanguageProvider;