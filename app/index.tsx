import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS } from '../constants/api';
import { handleAuthError } from '../utils/auth';

export default function Index() {
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const validateAuth = async () => {
      try {
        // Check if token exists
        const token = await AsyncStorage.getItem('access_token');
        if (!token) {
          setIsAuthenticated(false);
          setIsValidating(false);
          return;
        }

        // Validate token by calling USER_INFO endpoint
        const response = await fetch(API_ENDPOINTS.USER_INFO, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          // Store user info
          const userData = await response.json();
          await AsyncStorage.setItem('userInfo', JSON.stringify(userData));
          setIsAuthenticated(true);
        } else {
          // Handle auth error (will clear tokens and redirect)
          await handleAuthError({ status: response.status });
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth validation error:', error);
        setIsAuthenticated(false);
        await handleAuthError(error);
      } finally {
        setIsValidating(false);
      }
    };

    validateAuth();
  }, []);

  // Show nothing while validating
  if (isValidating) {
    return null;
  }

  // Redirect based on authentication status
  return <Redirect href={isAuthenticated ? "/dashboard" : "/(auth)/signin"} />;
}
