# Internationalization (i18n) Guide

This directory contains translation files for the Claudia application. The i18n implementation uses react-i18next for internationalization support.

## Directory Structure

```
src/locales/
├── en/
│   └── common.json       # English translations
├── zh/
│   └── common.json       # Chinese translations
└── README.md            # This file
```

## Adding New Languages

1. Create a new directory for the language code (e.g., `fr/` for French)
2. Copy the `en/common.json` file to the new directory
3. Translate all values in the JSON file
4. Update `src/lib/i18n.ts` to include the new language:
   - Import the translation file
   - Add it to the `LANGUAGES` object
   - Add it to the `resources` object

Example for French:
```typescript
// In src/lib/i18n.ts
import frCommon from '../locales/fr/common.json';

export const LANGUAGES = {
  en: 'English',
  zh: '中文',
  fr: 'Français',
} as const;

const resources = {
  en: { common: enCommon },
  zh: { common: zhCommon },
  fr: { common: frCommon },
};
```

## Translation Keys Structure

The translation keys are organized hierarchically:

- `app.*` - General application strings
- `navigation.*` - Navigation and menu items
- `projects.*` - Project-related strings
- `agents.*` - Agent-related strings
- `settings.*` - Settings page strings
- `session.*` - Session-related strings
- `usage.*` - Usage dashboard strings
- `mcp.*` - MCP manager strings
- `language.*` - Language switcher strings
- `messages.*` - Success/error messages

## Guidelines for Translations

1. **Keep it concise**: UI translations should be brief and clear
2. **Maintain consistency**: Use the same terminology throughout
3. **Context matters**: Consider where the text will appear in the UI
4. **Handle plurals**: Use i18next plural forms when needed
5. **Test thoroughly**: Check translations in different UI states

## Using Translations in Components

### Basic Usage
```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation('common');
  
  return <h1>{t('app.welcome')}</h1>;
}
```

### With Interpolation
```typescript
// In translation file
{
  "welcome": "Welcome, {{name}}!"
}

// In component
const { t } = useTranslation('common');
return <h1>{t('welcome', { name: 'John' })}</h1>;
```

### With Plurals
```typescript
// In translation file
{
  "items": {
    "one": "{{count}} item",
    "other": "{{count}} items"
  }
}

// In component
const { t } = useTranslation('common');
return <p>{t('items', { count: itemCount })}</p>;
```

## Language Switcher

The `LanguageSwitcher` component provides a dropdown to change languages:

```typescript
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

<LanguageSwitcher 
  variant="outline" 
  showLabel={true} 
/>
```

## Programmatic Language Change

```typescript
import { useLanguageContext } from '@/lib/contexts/LanguageContext';

function MyComponent() {
  const { changeLanguage, currentLanguage } = useLanguageContext();
  
  const handleLanguageChange = (lang: LanguageCode) => {
    changeLanguage(lang);
  };
  
  // ...
}
```

## Type Safety

The implementation includes TypeScript definitions for translation keys:

```typescript
import { CommonTranslationKeys } from '@/types/i18n';

// This will provide autocomplete and type checking
const key: CommonTranslationKeys = 'app.welcome';
```

## Testing Translations

1. Switch between languages to verify all text changes
2. Check for text overflow in different languages
3. Verify that date/number formatting works correctly
4. Test RTL languages if supported

## Best Practices

1. **Namespace properly**: Use the hierarchical key structure
2. **Avoid hardcoded strings**: Always use translation keys
3. **Handle loading states**: Some translations may load asynchronously
4. **Fallback gracefully**: Always provide fallback text
5. **Context awareness**: Consider different contexts for the same word

## Maintenance

- Regularly review and update translations
- Keep translation files synchronized across languages
- Monitor for missing translations in development
- Consider using translation management tools for larger projects