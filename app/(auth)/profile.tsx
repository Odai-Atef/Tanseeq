import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "../../components/ThemedView";
import { ThemedText } from "../../components/ThemedText";
import { Footer } from "../../components/Footer";
import {
  colors,
  authProfileTheme as styles,
  baseTheme,
} from "../../constants/Theme";
import { useProfileView } from "../../hooks/profile/viewHook";
import { useTranslation } from "../../contexts/LanguageContext";

type IconName = keyof typeof Ionicons.glyphMap;

const ProfileListItem = ({
  icon,
  title,
  onPress,
  color = colors.textPrimary,
  danger = false,
  isRTL,
}: {
  icon: IconName;
  title: string;
  onPress: () => void;
  color?: string;
  danger?: boolean;
  isRTL: boolean;
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.listItem,
      {
        flexDirection: isRTL ? "row-reverse" : "row",
      },
    ]}
  >
    <View
      style={[
        styles.iconContainer,
        isRTL ? { marginLeft: 10 } : { marginRight: 10 },
      ]}
    >
      <Ionicons name={icon} size={20} color={danger ? colors.danger : color} />
    </View>
    <ThemedText
      style={[
        styles.listItemText,
        danger && { color: colors.danger },
        { textAlign: isRTL ? "right" : "left" },
      ]}
    >
      {title}
    </ThemedText>
  </TouchableOpacity>
);

export default function Profile() {
  const { t, language, changeLanguage,isRTL } = useTranslation();
  const {
    loading,
    userInfo,
    showLogoutModal,
    setShowLogoutModal,
    handleLogout,
    handleFeatureNotAvailable,
    getDisplayName,
  } = useProfileView();

  if (loading) {
    return (
      <ThemedView
        style={[
          baseTheme.container,
          { borderTopWidth: 44, borderTopColor: colors.primary },
        ]}
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
        <Footer activeTab="profile" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[baseTheme.container, baseTheme.ios_boarder]}>
      <ScrollView
   
      >
        <View
          style={[
            styles.profileSection,
            isRTL && { alignItems: "center" },
          ]}
        >
          <View style={styles.avatarContainer}>
            <Image
              source={require("../../assets/images/icon.png")}
              style={styles.avatar}
            />
          </View>
          <ThemedText
            style={[
              styles.userName,
              isRTL && { textAlign: "center", width: "100%" },
            ]}
          >
            {getDisplayName()}
          </ThemedText>
          <Text
            style={[
              styles.userEmail,
              isRTL && { textAlign: "center" },
            ]}
          >
            {userInfo?.email || t("profile.noEmail")}
          </Text>
        </View>

        <View
          style={[
            { marginTop: 16 },
            isRTL && { alignItems: "stretch" },
          ]}
        >
          <ProfileListItem
            icon="language"
            title={t("profile.switchLanguage")}
            onPress={() => {
              const newLanguage = language === "ar" ? "en" : "ar";
              changeLanguage(newLanguage);
            }}
            isRTL={isRTL}
          />
          <ProfileListItem
            icon="diamond-outline"
            title={t("profile.upgradeTitle")}
            onPress={handleFeatureNotAvailable}
            color={colors.primary}
            isRTL={isRTL}
          />

          <ProfileListItem
            icon="log-out-outline"
            title={t("profile.logout")}
            onPress={() => setShowLogoutModal(true)}
            danger
            isRTL={isRTL}
          />
        </View>
      </ScrollView>

      {showLogoutModal && (
        <View
          style={[styles.modal, isRTL && { alignItems: "center" }]}
        >
          <View
            style={[
              styles.modalContent,
              isRTL && { alignItems: "center", width: "90%" },
            ]}
          >
            <ThemedText
              style={[
                styles.modalTitle,
                isRTL && { textAlign: "center" },
              ]}
            >
              {t("profile.logoutConfirmation")}
            </ThemedText>
            <TouchableOpacity
              onPress={handleLogout}
              style={[styles.modalButton, styles.modalButtonBorder]}
            >
              <Text
                style={[
                  { color: colors.danger, fontSize: 16, fontWeight: "600" },
                  isRTL && { textAlign: "center" },
                ]}
              >
                {t("profile.logoutButton")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowLogoutModal(false)}
              style={styles.modalButton}
            >
              <Text
                style={[
                  { color: colors.textSecondary, fontSize: 16 },
                  isRTL && { textAlign: "center" },
                ]}
              >
                {t("profile.cancelButton")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Footer activeTab="profile" />
    </ThemedView>
  );
}
