import { useState } from 'react';
import { router } from 'expo-router';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { showToast } from '../../components/Toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS } from '../../constants/api';

export const useJoinHome = () => {
  const [homeId, setHomeId] = useState('');
  const [homePassword, setHomePassword] = useState('');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requestCameraPermission = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === 'granted');
    if (status === 'granted') {
      setShowScanner(true);
    } else {
      showToast({
        type: 'error',
        text1Key: 'common.error.permission',
        text2Key: 'home.join.cameraRequired'
      });
    }
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setShowScanner(false);
    const [scannedHomeId, scannedPassword] = data.split(',');
    if (scannedHomeId && scannedPassword) {
      setHomeId(scannedHomeId);
      setHomePassword(scannedPassword);
    } else {
      showToast({
        type: 'error',
        text1Key: 'common.error.validation.invalid',
        text2Key: 'home.join.invalidQR'
      });
    }
  };

  const validateInputs = (): boolean => {
    if (!homeId || !homePassword) {
      showToast({
        type: 'error',
        text1Key: 'common.error.validation.error',
        text2Key: 'home.join.enterBoth'
      });
      return false;
    }

    if (homeId.length !== 6 || homePassword.length !== 6) {
      showToast({
        type: 'error',
        text1Key: 'common.error.validation.error',
        text2Key: 'home.join.sixDigits'
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
        showToast({
          type: 'error',
          text1Key: 'common.toast.auth.required',
          text2Key: 'common.toast.auth.signInRequired'
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
        showToast({
          type: 'error',
          text1Key: 'common.toast.auth.failed',
          text2Key: 'home.join.invalidCredentials'
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
          showToast({
            type: 'info',
            text1Key: 'common.toast.join.alreadyJoined',
            text2Key: 'common.toast.join.alreadyJoinedDesc'
          });
          router.replace('/dashboard');
          return;
        }
        throw new Error('Failed to join home');
      }

      showToast({
        type: 'success',
        text1Key: 'common.toast.success',
        text2Key: 'common.toast.join.success'
      });

      router.replace('/dashboard');
    } catch (error) {
      showToast({
        type: 'error',
        text1Key: 'common.toast.error',
        text2Key: 'common.toast.join.error'
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
    requestCameraPermission,
    handleBarCodeScanned,
    handleSubmit
  };
};
