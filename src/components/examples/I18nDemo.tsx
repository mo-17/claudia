import { useTranslation } from 'react-i18next';
import { useLanguageContext } from '@/lib/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

/**
 * Demo component to showcase i18n features
 * This component demonstrates all the key i18n features implemented
 */
export function I18nDemo() {
  const { t } = useTranslation('common');
  const { currentLanguage, changeLanguage, isLoading } = useLanguageContext();

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">{t('app.welcome')}</h1>
        <p className="text-muted-foreground">
          Multi-language support demonstration for Claudia
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Language Switcher Card */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Language Switcher</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <LanguageSwitcher variant="outline" showLabel={true} />
              <span className="text-sm text-muted-foreground">
                {t('language.currentLanguage')}: {currentLanguage}
              </span>
            </div>
            
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => changeLanguage('en')}
                disabled={isLoading}
              >
                English
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => changeLanguage('zh')}
                disabled={isLoading}
              >
                中文
              </Button>
            </div>
          </div>
        </Card>

        {/* Navigation Examples */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Navigation</h2>
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start">
              {t('navigation.ccAgents')}
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              {t('navigation.ccProjects')}
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              {t('navigation.usageDashboard')}
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              {t('navigation.mcpManager')}
            </Button>
          </div>
        </Card>

        {/* App Actions */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Common Actions</h2>
          <div className="flex flex-wrap gap-2">
            <Button size="sm">{t('app.save')}</Button>
            <Button size="sm" variant="outline">{t('app.cancel')}</Button>
            <Button size="sm" variant="outline">{t('app.edit')}</Button>
            <Button size="sm" variant="outline">{t('app.delete')}</Button>
            <Button size="sm" variant="outline">{t('app.back')}</Button>
          </div>
        </Card>

        {/* Project Examples */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">{t('projects.title')}</h2>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {t('projects.subtitle')}
            </p>
            <Button className="w-full">
              {t('projects.newSession')}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              {t('projects.noProjects')}
            </p>
          </div>
        </Card>
      </div>

      {/* Messages Examples */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Messages</h2>
        <div className="space-y-2">
          <div className="p-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded text-sm">
            {t('messages.savedSuccessfully')}
          </div>
          <div className="p-2 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 rounded text-sm">
            {t('messages.networkError')}
          </div>
          <div className="p-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded text-sm">
            {t('app.loading')}
          </div>
        </div>
      </Card>

      {/* Technical Info */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Technical Information</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Current Language:</span>
            <span className="font-mono">{currentLanguage}</span>
          </div>
          <div className="flex justify-between">
            <span>Loading State:</span>
            <span className="font-mono">{isLoading ? 'true' : 'false'}</span>
          </div>
          <div className="flex justify-between">
            <span>Storage Key:</span>
            <span className="font-mono">claudia-language</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default I18nDemo;