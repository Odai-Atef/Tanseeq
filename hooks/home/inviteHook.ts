import { useState, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showToast } from '../../components/Toast';
import { API_ENDPOINTS } from '../../constants/api';

export const useInviteHome = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Generate random 6-digit numbers for home ID and password
  const homeId = useMemo(() => Math.floor(100000 + Math.random() * 900000).toString(), []);
  const homePassword = useMemo(() => Math.floor(100000 + Math.random() * 900000).toString(), []);
  const qrData = useMemo(() => `${homeId},${homePassword}`, [homeId, homePassword]);

  const createOrUpdateHome = async () => {
    setIsSubmitting(true);
    try {
      var user=null;
      const userInfoStr = await AsyncStorage.getItem('userInfo');
      if (userInfoStr) {
         user =JSON.parse(userInfoStr);
      }
      const token = await AsyncStorage.getItem('access_token');
      if (!token || !user) {
        showToast({
          type: 'error',
          text1Key: 'common.toast.auth.required',
          text2Key: 'common.toast.auth.signInRequired'
        });
        return;
      }

      // Get existing home for the user
      const getResponse = await fetch(`${API_ENDPOINTS.HOME}?filter[user_created][_eq]=${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const homes = await getResponse.json();
      const existingHome = homes.data?.[0];

      const homeData = {
        auth_id: homeId,
        auth_token: homePassword,
        user_created: user.id
      };

      let response;
      if (existingHome) {
        // Update existing home
        response = await fetch(`${API_ENDPOINTS.HOME}/${existingHome.id}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(homeData)
        });
      } else {
        // Create new home
        response = await fetch(API_ENDPOINTS.HOME, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(homeData)
        });
      }

      if (!response.ok) {
        throw new Error('Failed to create/update home');
      }

      showToast({
        type: 'success',
        text1Key: 'common.toast.success',
        text2Key: 'common.toast.defaultHome.success'
      });

      return await response.json();
    } catch (error) {
      showToast({
        type: 'error',
        text1Key: 'common.toast.error',
        text2Key: 'common.toast.defaultHome.error'
      });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    homeId,
    homePassword,
    qrData,
    isSubmitting,
    createOrUpdateHome
  };
};
