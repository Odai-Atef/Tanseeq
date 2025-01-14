import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { colors, baseTheme } from '../../constants/Theme';
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
    <ThemedView style={baseTheme.container}>
      <View style={baseTheme.content}>
        <View style={styles.section}>
          <ThemedText style={[styles.label, { textAlign: isRTL ? 'right' : 'left' }]}>
            {t('home.join.homeId')}
          </ThemedText>
          <TextInput
            style={[baseTheme.input, { textAlign: isRTL ? 'right' : 'left' }]}
            placeholder={t('home.join.homeIdPlaceholder')}
            placeholderTextColor={colors.textSecondary}
            value={homeId}
            onChangeText={setHomeId}
            keyboardType="number-pad"
            maxLength={6}
          />
        </View>

        <View style={styles.section}>
          <ThemedText style={[styles.label, { textAlign: isRTL ? 'right' : 'left' }]}>
            {t('home.join.homePassword')}
          </ThemedText>
          <TextInput
            style={[baseTheme.input, { textAlign: isRTL ? 'right' : 'left' }]}
            placeholder={t('home.join.homePasswordPlaceholder')}
            placeholderTextColor={colors.textSecondary}
            value={homePassword}
            onChangeText={setHomePassword}
            keyboardType="number-pad"
            maxLength={6}
          />
        </View>

        <TouchableOpacity
          style={styles.scanButton}
          onPress={requestCameraPermission}
        >
          <ThemedText style={styles.scanButtonText}>
            {t('home.join.scanQrCode')}
          </ThemedText>
        </TouchableOpacity>

      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[
            styles.submitButton,
            isSubmitting && { opacity: 0.5 }
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

const styles = StyleSheet.create({
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  submitButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
 
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
});
