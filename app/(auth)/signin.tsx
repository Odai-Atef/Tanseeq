import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { colors, commonStyles } from '../../constants/Theme';
import { API_ENDPOINTS } from '../../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      Alert.alert('Error', 'Password is required');
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
        Alert.alert('Error', errorMessage);
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

      router.replace('/dashboard');
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={[commonStyles.container, { borderTopWidth: 50, borderTopColor: 'rgb(121, 128, 255)' }]}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={commonStyles.header}>
          <ThemedText style={commonStyles.headerTitle}>Sign In</ThemedText>
        </View>

        <View style={commonStyles.content}>
          <ThemedText style={commonStyles.subtitle}>
            Sign in to continue using the app
          </ThemedText>

          <View style={commonStyles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={colors.secondary} style={{ marginRight: 8 }} />
            <TextInput
              style={[commonStyles.input, emailError && { borderColor: 'red' }]}
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
            <Text style={{ color: 'red', marginLeft: 10, marginTop: -10, marginBottom: 10 }}>
              {emailError}
            </Text>
          ) : null}

          <View style={commonStyles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.secondary} style={{ marginRight: 8 }} />
            <TextInput
              style={commonStyles.input}
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
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={commonStyles.eyeIcon}>
              <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color={colors.secondary} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[commonStyles.button, loading && { opacity: 0.7 }]} 
            onPress={handleSignIn}
            disabled={loading}
          >
            <Text style={commonStyles.buttonText}>{loading ? 'Signing In...' : 'Sign In'}</Text>
          </TouchableOpacity>

          <View style={commonStyles.dividerContainer}>
            <View style={commonStyles.divider} />
            <ThemedText style={commonStyles.dividerText}>or continue with</ThemedText>
            <View style={commonStyles.divider} />
          </View>

          <View style={commonStyles.socialButtonsContainer}>
            <TouchableOpacity style={commonStyles.socialButton}>
              <Image source={require('../../taskose/images/logo/fb.png')} style={commonStyles.socialIcon} />
            </TouchableOpacity>
            <TouchableOpacity style={commonStyles.socialButton}>
              <Image source={require('../../taskose/images/logo/google.png')} style={commonStyles.socialIcon} />
            </TouchableOpacity>
            <TouchableOpacity style={commonStyles.socialButton}>
              <Image source={require('../../taskose/images/logo/apple.png')} style={commonStyles.socialIcon} />
            </TouchableOpacity>
          </View>

          <View style={commonStyles.bottomContainer}>
            <ThemedText style={commonStyles.bottomText}>
              Don't have an account?{' '}
              <Link href="/">
                <Text style={commonStyles.bottomLink}>Sign Up</Text>
              </Link>
            </ThemedText>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
