# Internationalization (i18n) Implementation Guide

This document describes the complete multi-language support implementation for Claudia using react-i18next.

## Overview

The i18n system provides:
- **Language Detection**: Automatic browser language detection with localStorage persistence
- **Language Switching**: UI component for easy language switching
- **Type Safety**: Full TypeScript support with translation key validation
- **Performance**: Efficient loading and caching of translations
- **Extensibility**: Easy addition of new languages and translation keys

## Architecture

### Core Components

#### 1. i18n Configuration (`src/lib/i18n.ts`)
- Initializes i18next with react-i18next and language detector
- Configures supported languages and fallback behavior
- Sets up localStorage persistence

#### 2. Language Context (`src/lib/contexts/LanguageContext.tsx`)
- Provides React context for language state management
- Handles language changes and persistence
- Manages loading states and error handling

#### 3. Language Hook (`src/lib/hooks/useLanguage.ts`)
- Custom hook for language operations
- Provides language detection and switching functions
- Handles localStorage operations

#### 4. Language Switcher (`src/components/LanguageSwitcher.tsx`)
- UI component for language selection
- Integrates with shadcn/ui components
- Supports different variants and sizes

#### 5. Utilities (`src/lib/i18n-utils.ts`)
- Helper functions for i18n operations
- Locale formatting utilities
- Type guards and validation

## File Structure

```
src/
├── lib/
│   ├── i18n.ts                    # Core i18n configuration
│   ├── i18n-utils.ts              # Utility functions
│   ├── contexts/
│   │   └── LanguageContext.tsx    # React context provider
│   └── hooks/
│       └── useLanguage.ts         # Custom language hook
├── components/
│   ├── LanguageSwitcher.tsx       # Language switcher UI
│   └── examples/
│       ├── I18nDemo.tsx           # Demo component
│       └── TranslationExamples.tsx # Usage examples
├── locales/
│   ├── en/
│   │   └── common.json           # English translations
│   ├── zh/
│   │   └── common.json           # Chinese translations
│   └── README.md                 # Translation guide
├── types/
│   └── i18n.ts                   # TypeScript definitions
└── main.tsx                      # App entry point with providers
```

## Implementation Details

### Dependencies Added

```json
{
  "i18next": "^25.3.2",
  "react-i18next": "^15.6.0",
  "i18next-browser-languagedetector": "^8.2.0"
}
```

### TypeScript Support

The implementation includes full TypeScript support with:
- Type-safe translation keys
- Autocomplete for translation functions
- Compile-time validation of translation usage

### Language Detection

The system automatically detects the user's language preference from:
1. localStorage (persisted selection)
2. Browser language settings
3. HTML lang attribute
4. Falls back to English

### Storage Persistence

Language selection is persisted using localStorage with the key `claudia-language`.

## Usage Examples

### Basic Translation

```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation('common');
  
  return (
    <div>
      <h1>{t('app.welcome')}</h1>
      <button>{t('app.save')}</button>
    </div>
  );
}
```

### Language Switching

```typescript
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

function Header() {
  return (
    <header>
      <LanguageSwitcher variant="outline" showLabel={true} />
    </header>
  );
}
```

### Programmatic Language Change

```typescript
import { useLanguageContext } from '@/lib/contexts/LanguageContext';

function SettingsPage() {
  const { changeLanguage, currentLanguage } = useLanguageContext();
  
  const handleLanguageChange = (lang: 'en' | 'zh') => {
    changeLanguage(lang);
  };
  
  return (
    <div>
      <p>Current: {currentLanguage}</p>
      <button onClick={() => handleLanguageChange('en')}>English</button>
      <button onClick={() => handleLanguageChange('zh')}>中文</button>
    </div>
  );
}
```

## Translation Keys Structure

The translation keys are organized hierarchically:

```json
{
  "app": {
    "name": "Claudia",
    "welcome": "Welcome to Claudia",
    "loading": "Loading...",
    "save": "Save",
    "cancel": "Cancel"
  },
  "navigation": {
    "ccAgents": "CC Agents",
    "ccProjects": "CC Projects"
  },
  "projects": {
    "title": "CC Projects",
    "subtitle": "Browse your Claude Code sessions",
    "newSession": "New Claude Code session"
  }
}
```

## Adding New Languages

1. **Create translation files**:
   ```bash
   mkdir src/locales/fr
   cp src/locales/en/common.json src/locales/fr/common.json
   ```

2. **Update i18n configuration**:
   ```typescript
   // src/lib/i18n.ts
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

3. **Translate the content**:
   Update the French translation file with appropriate translations.

## Integration with Existing Components

The i18n system has been integrated into key components:

### App.tsx
- Welcome message
- Navigation labels
- Project-related strings
- Error messages

### Topbar.tsx
- Language switcher component added to the header

### Main.tsx
- LanguageProvider wraps the entire application
- i18n configuration is imported and initialized

## Performance Considerations

- **Lazy Loading**: Translations are loaded on demand
- **Caching**: i18next caches translations for performance
- **Bundle Size**: Only used translations are included in the final bundle
- **Memory Usage**: Efficient memory management with proper cleanup

## Testing

### Manual Testing Checklist

- [ ] Language switcher appears in the header
- [ ] Language selection persists across page reloads
- [ ] All translated strings update when language changes
- [ ] Browser language detection works correctly
- [ ] localStorage persistence works correctly
- [ ] Error handling works for missing translations
- [ ] TypeScript compilation passes without errors

### Browser Compatibility

The implementation works with:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Best Practices

1. **Always use translation keys**: Never hardcode strings
2. **Organize keys hierarchically**: Use nested structures for better organization
3. **Provide meaningful keys**: Use descriptive key names
4. **Handle loading states**: Show loading indicators during language changes
5. **Test thoroughly**: Verify all translations work correctly
6. **Keep translations short**: UI space is limited
7. **Use consistent terminology**: Maintain consistency across translations

## Troubleshooting

### Common Issues

1. **Translation not updating**: Check if the key exists in all language files
2. **TypeScript errors**: Verify translation key types are correct
3. **Performance issues**: Check if translations are being loaded efficiently
4. **Storage issues**: Verify localStorage is available and working

### Debug Mode

Enable debug mode for development:
```typescript
// src/lib/i18n.ts
debug: process.env.NODE_ENV === 'development',
```

This will log i18n operations to the console for debugging.

## Future Enhancements

Potential improvements for the i18n system:

1. **Namespace Management**: Add support for multiple translation namespaces
2. **Pluralization**: Implement plural forms for different languages
3. **Interpolation**: Add support for variable interpolation in translations
4. **RTL Support**: Add right-to-left language support
5. **Translation Management**: Integrate with translation management services
6. **Performance Monitoring**: Add metrics for translation loading performance

## Conclusion

This i18n implementation provides a robust foundation for multi-language support in Claudia. It includes all necessary components for language switching, persistence, and type safety while maintaining good performance and user experience.

The system is designed to be extensible and maintainable, making it easy to add new languages and translation keys as the application grows.