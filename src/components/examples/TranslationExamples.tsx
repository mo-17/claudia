import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguageContext } from '@/lib/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

/**
 * Example component demonstrating how to use translations in your components
 */
export function TranslationExamples() {
  const { t, i18n } = useTranslation('common');
  const { currentLanguage, changeLanguage, isLoading } = useLanguageContext();

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Translation Examples</h2>
        
        {/* Basic Translation Usage */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{t('app.welcome')}</h3>
          
          <div className="grid gap-4">
            <Button onClick={() => console.log('clicked')}>
              {t('app.save')}
            </Button>
            
            <Button variant="outline" onClick={() => console.log('cancelled')}>
              {t('app.cancel')}
            </Button>
          </div>
          
          {/* Navigation translations */}
          <div className="space-y-2">
            <h4 className="font-medium">{t('navigation.ccProjects')}</h4>
            <p className="text-sm text-muted-foreground">
              {t('projects.subtitle')}
            </p>
          </div>
          
          {/* Error/Loading states */}
          {isLoading && (
            <div className="text-sm text-muted-foreground">
              {t('app.loading')}
            </div>
          )}
          
          {/* Conditional translations */}
          <div className="space-y-2">
            <p className="text-sm">
              {t('language.currentLanguage')}: {currentLanguage}
            </p>
            <p className="text-sm">
              {t('messages.savedSuccessfully')}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Language Switcher Examples</h3>
        
        <div className="grid gap-4">
          {/* Different variants of the language switcher */}
          <div className="space-y-2">
            <h4 className="font-medium">With Label</h4>
            <LanguageSwitcher variant="outline" showLabel={true} />
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Without Label</h4>
            <LanguageSwitcher variant="ghost" showLabel={false} />
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Icon Only</h4>
            <LanguageSwitcher variant="outline" size="icon" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Programmatic Language Change</h3>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => changeLanguage('en')}
              disabled={isLoading}
            >
              Switch to English
            </Button>
            <Button 
              variant="outline" 
              onClick={() => changeLanguage('zh')}
              disabled={isLoading}
            >
              切换到中文
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>Current language: {currentLanguage}</p>
            <p>Available languages: {Object.keys(i18n.options.resources || {}).join(', ')}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Translation with Interpolation</h3>
        
        <div className="space-y-2">
          {/* Examples of interpolation if needed */}
          <p className="text-sm">
            {t('app.welcome')} - {t('app.name')}
          </p>
          
          {/* You can extend this for more complex interpolation */}
          <p className="text-sm text-muted-foreground">
            Note: For interpolation, you would use {'{key}'} in your translation files
            and pass variables as the second parameter to t()
          </p>
        </div>
      </Card>
    </div>
  );
}

/**
 * Hook for using translations in components
 * This is a convenience hook that wraps useTranslation with the common namespace
 */
export function useCommonTranslation() {
  return useTranslation('common');
}

/**
 * Higher-order component for adding translation support to components
 */
export function withTranslation<T extends object>(Component: React.ComponentType<T>) {
  return function TranslatedComponent(props: T) {
    const { t } = useTranslation('common');
    
    return <Component {...props} t={t} />;
  };
}

export default TranslationExamples;