import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { languages, Language, defaultLanguage, getTranslation } from '../constants/languages';
import { I18nManager } from 'react-native';

const LANGUAGE_KEY = 'app_language';

export const useLanguage = () => {
  const [language, setLanguage] = useState<Language>(defaultLanguage);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
        setLanguage(savedLanguage);
        await applyLanguage(savedLanguage);
      }
    } catch (error) {
      console.error('Error loading language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyLanguage = async (lang: Language) => {
    const isRTL = lang === 'ar';
    if (I18nManager.isRTL !== isRTL) {
      await AsyncStorage.setItem(LANGUAGE_KEY, lang);
      I18nManager.allowRTL(isRTL);
      I18nManager.forceRTL(isRTL);
    }
  };

  const changeLanguage = async (lang: Language) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, lang);
      await applyLanguage(lang);
      setLanguage(lang);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  const t = useCallback((key: string, params?: Record<string, string>): string => {
    return getTranslation(languages[language], key, params);
  }, [language]);

  return {
    language,
    isLoading,
    changeLanguage,
    t,
    isRTL: language === 'ar'
  };
};
