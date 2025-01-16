import React from 'react';
import { View, TextInput, TouchableOpacity, Image, ScrollView, Platform } from 'react-native';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { colors, authTheme as styles } from '../../constants/Theme';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useSignin } from '../../hooks/useSignin';
import { useLanguage } from '../../hooks/useLanguage';

export default function SignIn() {
  const { t } = useLanguage();
  const {
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
  } = useSignin();

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
            {t('auth.welcome')}
          </ThemedText>
        </View>
        <View style={styles.content}>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={colors.secondary} style={{ marginRight: 8 }} />
            <TextInput
              style={[styles.input, emailError && { borderColor: colors.danger }]}
              placeholder={t('auth.emailPlaceholder')}
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
              placeholder={t('auth.passwordPlaceholder')}
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
            <ThemedText style={styles.buttonText}>
              {loading ? t('common.loading') : t('auth.signIn')}
            </ThemedText>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <ThemedText style={styles.dividerText}>{t('auth.orContinueWith')}</ThemedText>
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
