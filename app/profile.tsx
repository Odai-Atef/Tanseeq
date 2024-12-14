import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '../components/ThemedView';
import { ThemedText } from '../components/ThemedText';
import { Footer } from '../components/Footer';
import { dashboardStyles as styles, colors } from '../constants/Theme';
import { ProfileTheme } from '../constants/ProfileTheme';
import AsyncStorage from '@react-native-async-storage/async-storage';

type IconName = keyof typeof Ionicons.glyphMap;

interface UserInfo {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

const ProfileListItem = ({ 
  icon, 
  title, 
  onPress,
  color = colors.textPrimary,
  danger = false 
}: { 
  icon: IconName;
  title: string; 
  onPress: () => void;
  color?: string;
  danger?: boolean;
}) => (
  <TouchableOpacity 
    onPress={onPress}
    style={ProfileTheme.listItem}
  >
    <View style={ProfileTheme.iconContainer}>
      <Ionicons name={icon} size={20} color={danger ? colors.danger : color} />
    </View>
    <ThemedText style={[
      ProfileTheme.listItemText,
      danger && { color: colors.danger }
    ]}>
      {title}
    </ThemedText>
    <Ionicons name="chevron-forward-outline" size={20} color={colors.textPrimary} />
  </TouchableOpacity>
);

export default function Profile() {
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const userInfoStr = await AsyncStorage.getItem('userInfo');
        if (userInfoStr) {
          setUserInfo(JSON.parse(userInfoStr));
        }
      } catch (error) {
        console.error('Error loading user info:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserInfo();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'userInfo']);
      router.push('/(auth)/signin');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
        <Footer activeTab="profile" />
      </ThemedView>
    );
  }

  const displayName = userInfo ? 
    [userInfo.first_name, userInfo.last_name].filter(Boolean).join(' ') || 'User' 
    : 'User';

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <View style={ProfileTheme.profileSection}>
          <View style={ProfileTheme.avatarContainer}>
            <Image
              source={require('../assets/images/avt4.jpg')}
              style={ProfileTheme.avatar}
            />
            <TouchableOpacity style={[ProfileTheme.cameraButton, { backgroundColor: colors.primary }]}>
              <Ionicons name="camera-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <ThemedText style={ProfileTheme.userName}>{displayName}</ThemedText>
          <Text style={ProfileTheme.userEmail}>{userInfo?.email || 'No email'}</Text>
        </View>

        <TouchableOpacity
          style={ProfileTheme.editButton}
          onPress={() => router.push('/(auth)/edit-profile' as any)}
        >
          <Text style={ProfileTheme.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>

        <View style={{ marginTop: 16 }}>
          <ProfileListItem
            icon="diamond-outline"
            title="Upgrade to Premium"
            onPress={() => {}}
            color={colors.primary}
          />
          <ProfileListItem
            icon="help-circle-outline"
            title="Help Center"
            onPress={() => {}}
          />
          <ProfileListItem
            icon="star-outline"
            title="Rate the App"
            onPress={() => {}}
          />
          <ProfileListItem
            icon="shield-outline"
            title="Privacy Policy"
            onPress={() => {}}
          />
          <ProfileListItem
            icon="log-out-outline"
            title="Log out"
            onPress={() => setShowLogoutModal(true)}
            danger
          />
        </View>
      </ScrollView>

      {showLogoutModal && (
        <View style={ProfileTheme.modal}>
          <View style={ProfileTheme.modalContent}>
            <ThemedText style={ProfileTheme.modalTitle}>
              Are you sure you want to log out?
            </ThemedText>
            <TouchableOpacity
              onPress={handleLogout}
              style={[ProfileTheme.modalButton, ProfileTheme.modalButtonBorder]}
            >
              <Text style={{ color: colors.danger, fontSize: 16, fontWeight: '600' }}>
                Log Out
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowLogoutModal(false)}
              style={ProfileTheme.modalButton}
            >
              <Text style={{ color: colors.textSecondary, fontSize: 16 }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Footer activeTab="profile" />
    </ThemedView>
  );
}
