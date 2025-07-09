import { useTranslation } from 'react-i18next';
import { Languages, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LANGUAGES, type LanguageCode } from '@/lib/i18n';

interface LanguageSwitcherProps {
  variant?: 'default' | 'ghost' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showLabel?: boolean;
  className?: string;
}

export function LanguageSwitcher({
  variant = 'ghost',
  size = 'default',
  showLabel = true,
  className,
}: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation('common');
  
  const currentLanguage = i18n.language as LanguageCode;
  const currentLanguageName = LANGUAGES[currentLanguage] || LANGUAGES.en;
  
  const handleLanguageChange = (languageCode: LanguageCode) => {
    i18n.changeLanguage(languageCode);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={className}
          aria-label={t('language.switchLanguage')}
        >
          <Languages className="h-4 w-4" />
          {showLabel && size !== 'icon' && (
            <span className="ml-2 hidden sm:inline">
              {currentLanguageName}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {Object.entries(LANGUAGES).map(([code, name]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => handleLanguageChange(code as LanguageCode)}
            className="cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <span>{name}</span>
              {currentLanguage === code && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LanguageSwitcher;