import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { colors, authTheme as styles } from '../../constants/Theme';
import { API_ENDPOINTS } from '../../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

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
          <ThemedText style={styles.headerTitle}>Sign In</ThemedText>
        </View>

        <View style={styles.content}>
          <ThemedText style={styles.subtitle}>
            Sign in to continue using the app
          </ThemedText>

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
            <TouchableOpacity style={styles.socialButton}>
              <Image source={require('../../taskose/images/logo/fb.png')} style={styles.socialIcon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Image source={require('../../taskose/images/logo/google.png')} style={styles.socialIcon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Image source={require('../../taskose/images/logo/apple.png')} style={styles.socialIcon} />
            </TouchableOpacity>
          </View>

          <View style={styles.bottomContainer}>
            <ThemedText style={styles.bottomText}>
              Don't have an account?{' '}
              <Link href="/" style={styles.bottomLink}>
                Sign Up
              </Link>
            </ThemedText>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
