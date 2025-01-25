import Toast from 'react-native-toast-message';
import { useLanguage } from '../hooks/useLanguage';
import { createContext, useContext, useCallback } from 'react';

interface ShowToastProps {
  type: 'success' | 'error' | 'info';
  text1Key: string;
  text2Key: string;
}

// Create a context to hold the translation function
const ToastContext = createContext<((props: ShowToastProps) => void) | null>(null);

// Provider component that holds the translation logic
export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const { t } = useLanguage();

  const showToastWithTranslation = useCallback(({ type, text1Key, text2Key }: ShowToastProps) => {
    Toast.show({
      type,
      text1: t(text1Key),
      text2: t(text2Key),
      position: 'top',
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 70
    });
  }, [t]);

  return (
    <ToastContext.Provider value={showToastWithTranslation}>
      {children}
    </ToastContext.Provider>
  );
};

// Create a function that uses the context
const useToast = () => {
  const showToastWithTranslation = useContext(ToastContext);
  if (!showToastWithTranslation) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return showToastWithTranslation;
};

// Export the showToast function that will be used throughout the app
export const showToast = (props: ShowToastProps) => {
  // Get the toast function from context if we're in a React component
  try {
    const showToastWithTranslation = useToast();
    showToastWithTranslation(props);
  } catch {
    // If we're not in a React component or Provider is not available,
    // show toast without translation (fallback)
    Toast.show({
      type: props.type,
      text1: props.text1Key,
      text2: props.text2Key,
      position: 'top',
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 70
    });
  }
};
