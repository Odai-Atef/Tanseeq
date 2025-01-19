import Toast from 'react-native-toast-message';
import { useLanguage } from '../hooks/useLanguage';

interface ShowToastProps {
  type: 'success' | 'error' | 'info';
  text1Key: string;
  text2Key: string;
}

export const showToast = ({ type, text1Key, text2Key }: ShowToastProps) => {
  const { t } = useLanguage();
  
  Toast.show({
    type,
    text1: t(text1Key),
    text2: t(text2Key),
    position: 'top',
    visibilityTime: 3000,
    autoHide: true,
    topOffset: 30
  });
};
