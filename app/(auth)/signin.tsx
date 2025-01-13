import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Image, ScrollView, Platform } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { colors, authTheme as styles } from '../../constants/Theme';
import { API_ENDPOINTS } from '../../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';

WebBrowser.maybeCompleteAuthSession();

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

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

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const router = useRouter();

  // Note: To get the client IDs:
  // 1. Go to Google Cloud Console (https://console.cloud.google.com)
  // 2. Create a project or select existing one
  // 3. Enable Google Sign-In API
  // 4. Create OAuth 2.0 credentials
  // 5. Add your app's bundle ID and OAuth redirect URI
  // Configure Google Sign-In
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: '971482339745-13626slrfdkbjdatcirbl2lftl65dpha.apps.googleusercontent.com',
    iosClientId: '971482339745-h8muqs921dv3usnsfek3mhu2cc5924t7.apps.googleusercontent.com',
    clientId: '971482339745-6opbc4ijqapscv98muma2u326ed1lq5g.apps.googleusercontent.com', // For web/Expo client
    scopes: ['profile', 'email']
  });

  // Log auth configuration for debugging
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

  const showError = (message: string) => {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: message,
      position: 'top',
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 30
    });
  };

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
      showError('Failed to fetch user information');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await promptAsync();
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      showError('Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (accessToken: string | undefined) => {
    console.log(accessToken)
    if (!accessToken) {
      showError('Failed to get access token from Google');
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

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Signed in with Google successfully',
        position: 'top',
        visibilityTime: 2000,
        autoHide: true,
        topOffset: 30
      });

      router.replace('/dashboard');
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in with Google';
      showError(errorMessage);
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

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Signed in with Apple successfully',
        position: 'top',
        visibilityTime: 2000,
        autoHide: true,
        topOffset: 30
      });

      router.replace('/dashboard');
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in with Apple';
      showError(errorMessage);
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
      showError('Password is required');
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
        showError(errorMessage || 'Login failed');
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

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Signed in successfully',
        position: 'top',
        visibilityTime: 2000,
        autoHide: true,
        topOffset: 30
      });

      router.replace('/dashboard');
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in. Please try again.';
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={[styles.container, { borderTopWidth: 50, borderTopColor: colors.primary }]}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Image 
            source={require('../../assets/images/logo/logo-1.png')} 
            style={{ 
              width: 100, 
              height: 100, 
              alignSelf: 'center',
              marginBottom: 20,
              resizeMode: 'contain'
            }} 
          />
        </View>
        <View>
          <ThemedText style={styles.headerTitle}>
            Welcome in Tanseeq 
          </ThemedText>
        </View>
        <View style={styles.content}>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={colors.secondary} style={{ marginRight: 8 }} />
            <TextInput
              style={[styles.input, emailError && { borderColor: colors.danger }]}
              placeholder="Type your email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setEmailError('');
              }}
              keyboardType="email-address"
              placeholderTextColor={colors.secondary}
              editable={!loading}
              autoCapitalize="none"
              autoFocus={false}
              autoCorrect={false}
              blurOnSubmit={true}
            />
          </View>
          {emailError ? (
            <ThemedText style={styles.errorText}>
              {emailError}
            </ThemedText>
          ) : null}

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.secondary} style={{ marginRight: 8 }} />
            <TextInput
              style={styles.input}
              placeholder="Type your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholderTextColor={colors.secondary}
              editable={!loading}
              autoCapitalize="none"
              autoFocus={false}
              autoCorrect={false}
              blurOnSubmit={true}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color={colors.secondary} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.button, loading && { opacity: 0.7 }]} 
            onPress={handleSignIn}
            disabled={loading}
          >
            <ThemedText style={styles.buttonText}>{loading ? 'Signing In...' : 'Sign In'}</ThemedText>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <ThemedText style={styles.dividerText}>or continue with</ThemedText>
            <View style={styles.divider} />
          </View>

          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity 
              style={styles.socialButton}
              onPress={handleGoogleSignIn}
              disabled={loading}
            >
              <Image source={require('../../assets/images/logo/google.png')} style={styles.socialIcon} />
            </TouchableOpacity>
            {Platform.OS === 'ios' && (
              <AppleAuthentication.AppleAuthenticationButton
                buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE_OUTLINE}
                cornerRadius={5}
                style={[styles.socialButton, { width: 50, height: 50 }]}
                onPress={handleAppleSignIn}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
