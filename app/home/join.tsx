import React from 'react';
import { View, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { colors, baseTheme  as styles } from '../../constants/Theme';
import { useJoinHome } from '../../hooks/home/joinHook';
import { useTranslation } from '../../contexts/LanguageContext';

export default function JoinHome() {
  const { t, isRTL } = useTranslation();
  const {
    homeId,
    homePassword,
    setHomeId,
    setHomePassword,
    hasPermission,
    showScanner,
    isSubmitting,
    requestCameraPermission,
    handleBarCodeScanned,
    handleSubmit
  } = useJoinHome();

  if (showScanner && hasPermission) {
    return (
      <ThemedView style={styles.container}>
        <BarCodeScanner
          onBarCodeScanned={handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={[stylesC.section, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
          <ThemedText style={[styles.headerTitle, { textAlign: isRTL ? 'right' : 'left', width: '100%' }]}>
            {t('home.join.homeId')}
          </ThemedText>
          <TextInput
            style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
            placeholder={t('home.join.homeIdPlaceholder')}
            placeholderTextColor={colors.textSecondary}
            value={homeId}
            onChangeText={setHomeId}
            keyboardType="number-pad"
            maxLength={6}
          />
        </View>

        <View style={[stylesC.section, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
          <ThemedText style={[styles.headerTitle, { textAlign: isRTL ? 'right' : 'left', width: '100%' }]}>
            {t('home.join.homePassword')}
          </ThemedText>
          <TextInput
            style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
            placeholder={t('home.join.homePasswordPlaceholder')}
            placeholderTextColor={colors.textSecondary}
            value={homePassword}
            onChangeText={setHomePassword}
            keyboardType="number-pad"
            maxLength={6}
          />
        </View>

        <TouchableOpacity
          style={stylesC.scanButton}
          onPress={requestCameraPermission}
        >
          <ThemedText style={stylesC.scanButtonText}>
            {t('home.join.scanQrCode')}
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>

      <View style={stylesC.footer}>
        <TouchableOpacity 
          style={[
            styles.submitButton,
            isSubmitting && styles.submitButtonDisabled
          ]} 
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <ThemedText style={styles.submitButtonText}>
            {isSubmitting 
              ? t('common.loading')
              : t('home.join.submit')
            }
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const stylesC = StyleSheet.create({

  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    opacity: 0.8,
  },
  scanButton: {
    backgroundColor: colors.background,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
  },
  scanButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
});
