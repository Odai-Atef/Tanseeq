import { en } from './en';
import { ar } from './ar';

export const languages = {
  en,
  ar
};

export type Language = keyof typeof languages;
export type TranslationKeys = typeof en;

// Helper function to get nested object value by string path
export const getTranslation = (obj: any, path: string, params?: Record<string, string>): string => {
  const value = path.split('.').reduce((acc, part) => acc && acc[part], obj);
  if (typeof value !== 'string') return path;

  if (!params) return value;

  // Replace parameters in the string (e.g., {name} with actual value)
  return Object.entries(params).reduce(
    (str, [key, val]) => str.replace(new RegExp(`{${key}}`, 'g'), val),
    value
  );
};

// Helper to check if current locale is RTL
export const isRTL = (language: Language): boolean => {
  return language === 'ar';
};

// Get direction based on language
export const getDirection = (language: Language): 'rtl' | 'ltr' => {
  return isRTL(language) ? 'rtl' : 'ltr';
};

// Default language
export const defaultLanguage: Language = 'en';
