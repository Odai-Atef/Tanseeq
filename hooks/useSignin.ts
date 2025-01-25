import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from './useLanguage';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';
import Toast from 'react-native-toast-message';
import { API_ENDPOINTS } from '../constants/api';

WebBrowser.maybeCompleteAuthSession();

interface ApiError {
  message: string;
  extensions: {
    reason: string;
    code: string;
  };
}

interface LoginResponse {
  data?: {
    access_token: string;
    refresh_token: string;
    user: {
      id: string;
      email: string;
    };
  };
  errors?: ApiError[];
}

interface UserInfoResponse {
  data?: {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
    avatar?: string;
    role?: string;
  };
  errors?: ApiError[];
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const useSignin = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const handleToast = useCallback((type: string, text1Key: string, text2Key: string) => {
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
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const router = useRouter();

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: '971482339745-13626slrfdkbjdatcirbl2lftl65dpha.apps.googleusercontent.com',
    iosClientId: 'YOUR_IOS_CLIENT_ID',
    clientId: '971482339745-6opbc4ijqapscv98muma2u326ed1lq5g.apps.googleusercontent.com',
    scopes: ['profile', 'email']
  });

  useEffect(() => {
    const getRedirectUri = async () => {
      const redirectUri = makeRedirectUri({
        scheme: 'tanseeq',
        path: 'auth/google-redirect',
      });
      console.log('Auth Configuration:', {
        redirectUri,
        nativeRedirect: 'tanseeq://auth/google-redirect',
        platform: Platform.OS
      });
    };
    getRedirectUri();
  }, []);

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      handleGoogleSuccess(authentication?.accessToken);
    }
  }, [response]);


  const fetchUserInfo = async (accessToken: string): Promise<void> => {
    try {
      const response = await fetch(API_ENDPOINTS.USER_INFO, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data: UserInfoResponse = await response.json();

      if (data.errors) {
        throw new Error(data.errors[0]?.message || 'Failed to fetch user information');
      }

      if (!data.data) {
        throw new Error('Invalid user info response');
      }

      await AsyncStorage.setItem('userInfo', JSON.stringify(data.data));
    } catch (error) {
      console.error('Error fetching user info:', error);
      handleToast('error', 'common.toast.error', 'common.toast.fetch.userInfo');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await promptAsync();
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      handleToast('error', 'common.toast.error', 'common.toast.auth.failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (accessToken: string | undefined) => {
    if (!accessToken) {
      handleToast('error', 'common.toast.error', 'common.toast.auth.failed');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.GOOGLE_LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: accessToken,
        }),
      });

      const data: LoginResponse = await response.json();

      if (data.errors) {
        throw new Error(data.errors[0]?.message || 'Google login failed');
      }

      if (!data.data) {
        throw new Error('Invalid response from server');
      }

      await Promise.all([
        AsyncStorage.setItem('access_token', data.data.access_token),
        AsyncStorage.setItem('refresh_token', data.data.refresh_token),
      ]);

      await fetchUserInfo(data.data.access_token);
      handleToast('success', 'common.toast.success', 'auth.signInSuccess');
      router.replace('/dashboard');
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in with Google';
      handleToast('error', 'common.toast.error', 'common.toast.auth.failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      setLoading(true);
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      const response = await fetch(API_ENDPOINTS.APPLE_LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identityToken: credential.identityToken,
          fullName: credential.fullName,
          email: credential.email,
        }),
      });

      const data: LoginResponse = await response.json();

      if (data.errors) {
        throw new Error(data.errors[0]?.message || 'Apple login failed');
      }

      if (!data.data) {
        throw new Error('Invalid response from server');
      }

      await Promise.all([
        AsyncStorage.setItem('access_token', data.data.access_token),
        AsyncStorage.setItem('refresh_token', data.data.refresh_token),
      ]);

      await fetchUserInfo(data.data.access_token);
      handleToast('success', 'common.toast.success', 'auth.signInSuccess');
      router.replace('/dashboard');
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in with Apple';
      handleToast('error', 'common.toast.error', 'common.toast.auth.failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    setEmailError('');

    if (!email) {
      setEmailError('Email is required');
      return;
    }
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    if (!password) {
      handleToast('error', 'common.toast.error', 'common.error.validation.required');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data: LoginResponse = await response.json();

      if (data.errors) {
        const errorMessage = data.errors[0]?.message;
        handleToast('error', 'common.toast.error', 'common.toast.auth.failed');
        return;
      }

      if (!data.data) {
        throw new Error('Invalid response from server');
      }

      await Promise.all([
        AsyncStorage.setItem('access_token', data.data.access_token),
        AsyncStorage.setItem('refresh_token', data.data.refresh_token),
      ]);

      await fetchUserInfo(data.data.access_token);
      handleToast('success', 'common.toast.success', 'auth.signInSuccess');
      router.replace('/dashboard');
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in. Please try again.';
      handleToast('error', 'common.toast.error', 'common.toast.auth.failed');
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    loading,
    emailError,
    setEmailError,
    handleSignIn,
    handleGoogleSignIn,
    handleAppleSignIn
  };
};
