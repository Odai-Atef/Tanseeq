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
      { 
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        justifyContent: 'flex-start'
      }
    ]}
  >
    <View style={[
      styles.iconContainer,
      I18nManager.isRTL ? { marginLeft: 10 } : { marginRight: 10 }
    ]}>
      <Ionicons name={icon} size={20} color={danger ? colors.danger : color} />
    </View>
    <ThemedText style={[
      styles.listItemText,
      danger && { color: colors.danger },
      { textAlign: I18nManager.isRTL ? 'right' : 'left' }
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
    <ThemedView style={[baseTheme.container, baseTheme.ios_boarder]}>
      <ScrollView contentContainerStyle={I18nManager.isRTL ? { alignItems: 'flex-end' } : undefined}>
        <View style={[
          styles.profileSection,
          I18nManager.isRTL && { alignItems: 'center' }
        ]}>
          <View style={styles.avatarContainer}>
            <Image
              source={require('../../assets/images/avt4.jpg')}
              style={styles.avatar}
            />
          </View>
          <ThemedText style={[
            styles.userName,
            I18nManager.isRTL && { textAlign: 'center', width: '100%' }
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

        <View style={[
          { marginTop: 16 },
          I18nManager.isRTL && { alignItems: 'stretch' }
        ]}>
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
            icon="language"
            title={t('profile.switchLanguage')}
            onPress={() => {
              I18nManager.forceRTL(!I18nManager.isRTL);
              I18nManager.allowRTL(!I18nManager.isRTL);
            }}
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
        <View style={[styles.modal, I18nManager.isRTL && { alignItems: 'center' }]}>
          <View style={[
            styles.modalContent,
            I18nManager.isRTL && { alignItems: 'center', width: '90%' }
          ]}>
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
