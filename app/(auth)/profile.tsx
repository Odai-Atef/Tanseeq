import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator, I18nManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { Footer } from '../../components/Footer';
import { colors, authProfileTheme as styles, baseTheme } from '../../constants/Theme';
import { useProfileView } from '../../hooks/profile/viewHook';
import { useLanguage } from '../../hooks/useLanguage';

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
    style={[
      styles.listItem,
      { flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row' }
    ]}
  >
    <View style={[
      styles.iconContainer,
      I18nManager.isRTL && { marginLeft: 10, marginRight: 0 }
    ]}>
      <Ionicons name={icon} size={20} color={danger ? colors.danger : color} />
    </View>
    <ThemedText style={[
      styles.listItemText,
      danger && { color: colors.danger },
      I18nManager.isRTL && { textAlign: 'right' }
    ]}>
      {title}
    </ThemedText>
  
  </TouchableOpacity>
);

export default function Profile() {
  const { t } = useLanguage();
  const {
    loading,
    userInfo,
    showLogoutModal,
    setShowLogoutModal,
    handleLogout,
    handleFeatureNotAvailable,
    getDisplayName
  } = useProfileView();

  if (loading) {
    return (
    <ThemedView style={[baseTheme.container, { borderTopWidth: 44, borderTopColor: colors.primary }]}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
        <Footer activeTab="profile" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[baseTheme.container, { borderTopWidth: 50, borderTopColor: colors.primary }]}>
      <ScrollView>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={require('../../assets/images/avt4.jpg')}
              style={styles.avatar}
            />
          </View>
          <ThemedText style={[
            styles.userName 
          ]}>
            {getDisplayName()}
          </ThemedText>
          <Text style={[
            styles.userEmail,
            I18nManager.isRTL && { textAlign: 'center' }
          ]}>
            {userInfo?.email || t('profile.noEmail')}
          </Text>
        </View>

        <View style={{ marginTop: 16 }}>
          <ProfileListItem
            icon="diamond-outline"
            title={t('profile.upgradeTitle')}
            onPress={handleFeatureNotAvailable}
            color={colors.primary}
          />
          <ProfileListItem
            icon="help-circle-outline"
            title={t('profile.helpCenter')}
            onPress={handleFeatureNotAvailable}
          />
          <ProfileListItem
            icon="star-outline"
            title={t('profile.rateApp')}
            onPress={handleFeatureNotAvailable}
          />
          <ProfileListItem
            icon="shield-outline"
            title={t('profile.privacyPolicy')}
            onPress={handleFeatureNotAvailable}
          />
          <ProfileListItem
            icon="log-out-outline"
            title={t('profile.logout')}
            onPress={() => setShowLogoutModal(true)}
            danger
          />
        </View>
      </ScrollView>

      {showLogoutModal && (
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <ThemedText style={[
              styles.modalTitle,
              I18nManager.isRTL && { textAlign: 'center' }
            ]}>
              {t('profile.logoutConfirmation')}
            </ThemedText>
            <TouchableOpacity
              onPress={handleLogout}
              style={[styles.modalButton, styles.modalButtonBorder]}
            >
              <Text style={[
                { color: colors.danger, fontSize: 16, fontWeight: '600' },
                I18nManager.isRTL && { textAlign: 'center' }
              ]}>
                {t('profile.logoutButton')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowLogoutModal(false)}
              style={styles.modalButton}
            >
              <Text style={[
                { color: colors.textSecondary, fontSize: 16 },
                I18nManager.isRTL && { textAlign: 'center' }
              ]}>
                {t('profile.cancelButton')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Footer activeTab="profile" />
    </ThemedView>
  );
}
