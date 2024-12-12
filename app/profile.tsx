import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '../components/ThemedView';
import { ThemedText } from '../components/ThemedText';
import { Footer } from '../components/Footer';
import { colors } from '../constants/Theme';
import { ProfileTheme } from '../constants/ProfileTheme';

type IconName = keyof typeof Ionicons.glyphMap;

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
    <Ionicons name="chevron-forward-outline" size={20} color={colors.textSecondary} />
  </TouchableOpacity>
);

export default function Profile() {
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    router.push('/(auth)/signin');
  };

  return (
    <ThemedView style={ProfileTheme.container}>
      <ScrollView>
        <View style={ProfileTheme.profileSection}>
          <View style={ProfileTheme.avatarContainer}>
            <Image
              source={require('../assets/images/avt4.jpg')}
              style={ProfileTheme.avatar}
            />
            <TouchableOpacity style={ProfileTheme.cameraButton}>
              <Ionicons name="camera-outline" size={20} color="white" />
            </TouchableOpacity>
          </View>
          <ThemedText style={ProfileTheme.userName}>Jonathan Smith</ThemedText>
          <Text style={ProfileTheme.userEmail}>jonathansmith@workmail.com</Text>
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
