import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { colors, commonStyles } from '../../constants/Theme';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSignIn = () => {
    // Implement sign in logic here
    console.log('Sign in:', { email, password });
    // Navigate to dashboard
    router.replace('/dashboard');
  };

  return (
    <ThemedView style={commonStyles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
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
              style={commonStyles.input}
              placeholder="Type your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholderTextColor={colors.secondary}
            />
          </View>

          <View style={commonStyles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.secondary} style={{ marginRight: 8 }} />
            <TextInput
              style={commonStyles.input}
              placeholder="Type your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholderTextColor={colors.secondary}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={commonStyles.eyeIcon}>
              <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color={colors.secondary} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={commonStyles.button} onPress={handleSignIn}>
            <Text style={commonStyles.buttonText}>Sign In</Text>
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
