import { useState } from 'react';
import { router } from 'expo-router';
import { BarCodeScanner } from 'expo-barcode-scanner';
import Toast from 'react-native-toast-message';
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
      Toast.show({
        type: 'error',
        text1: 'Camera Permission',
        text2: 'Camera permission is required to scan QR codes',
        position: 'top',
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 30
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
      Toast.show({
        type: 'error',
        text1: 'Invalid QR Code',
        text2: 'The QR code does not contain valid home information',
        position: 'top',
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 30
      });
    }
  };

  const validateInputs = (): boolean => {
    if (!homeId || !homePassword) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please enter both Home ID and Password',
        position: 'top',
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 30
      });
      return false;
    }

    if (homeId.length !== 6 || homePassword.length !== 6) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Home ID and Password must be 6 digits',
        position: 'top',
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 30
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
          text1: 'Authentication Required',
          text2: 'Please sign in to join a home',
          position: 'top',
          visibilityTime: 3000,
          autoHide: true,
          topOffset: 30
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
          text1: 'Authentication Failed',
          text2: 'Invalid home ID or password',
          position: 'top',
          visibilityTime: 3000,
          autoHide: true,
          topOffset: 30
        });
        return;
      }

      const propertyId = homeData.data[0].id;

      // Create property_users entry
      const joinResponse = await fetch(API_ENDPOINTS.PROPERTY_USERS, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: userId,
          property: propertyId
        })
      });

      if (!joinResponse.ok) {
        const errorData = await joinResponse.json();
        if (errorData.errors?.[0]?.extensions?.code === 'RECORD_NOT_UNIQUE') {
          Toast.show({
            type: 'info',
            text1: 'Already Joined',
            text2: 'You are already part of this home',
            position: 'top',
            visibilityTime: 3000,
            autoHide: true,
            topOffset: 30
          });
          router.replace('/dashboard');
          return;
        }
        throw new Error('Failed to join home');
      }

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Successfully joined the home',
        position: 'top',
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 30
      });

      router.replace('/dashboard');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to join home. Please check the ID and password.',
        position: 'top',
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 30
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
