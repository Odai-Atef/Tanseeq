import { useState } from 'react';
import { router } from 'expo-router';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS } from '../../constants/api';
import Toast from 'react-native-toast-message';
import { useLanguage } from '../useLanguage';
export const useJoinHome = () => {
  const { t } = useLanguage();

  const [homeId, setHomeId] = useState('');
  const [homePassword, setHomePassword] = useState('');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


 
  const validateInputs = (): boolean => {
    if (!homeId || !homePassword) {
      Toast.show({
    type: 'error',
    text1: t('common.error.validation.error'),
    text2: t('home.join.enterBoth'),
    position: 'top',
    visibilityTime: 3000,
    autoHide: true,
    topOffset: 70
});
      return false;
    }

    if (homeId.length !== 6 || homePassword.length !== 6) {
      Toast.show({
    type: 'error',
    text1: t('common.error.validation.error'),
    text2: t('home.join.sixDigits'),
    position: 'top',
    visibilityTime: 3000,
    autoHide: true,
    topOffset: 70
});
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateInputs()) return;

    setIsSubmitting(true);
    try {
      var user;
      const token = await AsyncStorage.getItem('access_token');
      const userInfoStr = await AsyncStorage.getItem('userInfo');
      if (userInfoStr) {
         user =JSON.parse(userInfoStr);
      }
      const userId=user.id;
      if (!token || !userId) {
        Toast.show({
    type: 'error',
    text1: t('common.toast.auth.required'),
    text2: t('common.toast.auth.signInRequired'),
    position: 'top',
    visibilityTime: 3000,
    autoHide: true,
    topOffset: 70
});
        return;
      }

      // First get the home by auth credentials
      const getHomeResponse = await fetch(`${API_ENDPOINTS.HOME}?filter[auth_id][_eq]=${homeId}&filter[auth_token][_eq]=${homePassword}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const homeData = await getHomeResponse.json();
      
      if (!getHomeResponse.ok || !homeData.data?.[0]?.id) {
        Toast.show({
    type: 'error',
    text1: t('common.toast.auth.failed'),
    text2: t('home.join.invalidCredentials'),
    position: 'top',
    visibilityTime: 3000,
    autoHide: true,
    topOffset: 70
});
        return;
      }

      const propertyId = homeData.data[0].id;

      // Set is_default=false for all other homes of this user
      await fetch(`${API_ENDPOINTS.PROPERTY_USERS}?filter[directus_users_id][_eq]=${userId}&filter[properties_id][_neq]=${propertyId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_default: false
        })
      });

      // Create property_users entry for the new home
      const joinResponse = await fetch(API_ENDPOINTS.PROPERTY_USERS, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          directus_users_id: userId,
          properties_id: propertyId,
          is_default:1
        })
      });

      if (!joinResponse.ok) {
        const errorData = await joinResponse.json();
        if (errorData.errors?.[0]?.extensions?.code === 'RECORD_NOT_UNIQUE') {
          Toast.show({
    type: 'info',
    text1: t('common.toast.join.alreadyJoined'),
    text2: t('common.toast.join.alreadyJoinedDesc'),
    position: 'top',
    visibilityTime: 3000,
    autoHide: true,
    topOffset: 70
});
          router.replace('/dashboard');
          return;
        }
        throw new Error('Failed to join home');
      }

      Toast.show({
    type: 'success',
    text1: t('common.toast.success'),
    text2: t('common.toast.join.success'),
    position: 'top',
    visibilityTime: 3000,
    autoHide: true,
    topOffset: 70
});

      router.replace('/dashboard');
    } catch (error) {
      Toast.show({
    type: 'error',
    text1: t('common.toast.error'),
    text2: t('common.toast.join.error'),
    position: 'top',
    visibilityTime: 3000,
    autoHide: true,
    topOffset: 70
});
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    homeId,
    homePassword,
    setHomeId,
    setHomePassword,
    hasPermission,
    showScanner,
    isSubmitting,
    handleSubmit
  };
};
