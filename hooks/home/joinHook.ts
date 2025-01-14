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
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
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

      const response = await fetch(`${API_ENDPOINTS.HOMES}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          homeId,
          password: homePassword
        })
      });

      if (!response.ok) {
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
