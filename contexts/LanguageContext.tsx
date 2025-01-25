import React, { createContext, useContext, ReactNode } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { Language } from '../constants/languages';
import { TextStyle, ViewStyle } from 'react-native';

interface LanguageContextType {
  language: Language;
  isLoading: boolean;
  changeLanguage: (lang: Language) => Promise<void>;
  t: (key: string, params?: Record<string, string>) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const languageUtils = useLanguage();

  return (
    <LanguageContext.Provider value={languageUtils}>
      {!languageUtils.isLoading && children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};

// Hook to get current text direction with proper TypeScript types
export const useTextDirection = () => {
  const { isRTL } = useTranslation();
  return {
    direction: isRTL ? 'rtl' : 'ltr' as const,
    textAlign: (isRTL ? 'right' : 'left') as TextStyle['textAlign'],
    flexDirection: (isRTL ? 'row-reverse' : 'row') as ViewStyle['flexDirection']
  };
};
