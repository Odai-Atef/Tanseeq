import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import { useLanguage } from '../../hooks/useLanguage';

interface UserInfo {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

export const useProfileView = () => {
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    Toast.show({
      type,
      text1: t(`common.toast.${type}`),
      text2: message,
      position: 'top',
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 30
    });
  };

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const userInfoStr = await AsyncStorage.getItem('userInfo');
        if (userInfoStr) {
          setUserInfo(JSON.parse(userInfoStr));
        }
      } catch (error) {
        console.error('Error loading user info:', error);
        showToast('error', t('common.toast.fetch.userInfo'));
      } finally {
        setLoading(false);
      }
    };

    loadUserInfo();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'userInfo']);
      showToast('success', t('auth.signOutSuccess'));
      router.push('/(auth)/signin');
    } catch (error) {
      console.error('Error during logout:', error);
      showToast('error', t('common.error.general'));
      setShowLogoutModal(false);
    }
  };

  const handleFeatureNotAvailable = () => {
    showToast('info', t('profile.featureNotAvailable'));
  };

  const getDisplayName = () => {
    return userInfo ? 
      [userInfo.first_name, userInfo.last_name].filter(Boolean).join(' ') || t('profile.defaultUser')
      : t('profile.defaultUser');
  };

  return {
    loading,
    userInfo,
    showLogoutModal,
    setShowLogoutModal,
    handleLogout,
    handleFeatureNotAvailable,
    getDisplayName
  };
};
