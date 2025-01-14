import React from 'react';
import { View, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { colors, homeTheme as styles } from '../../constants/Theme';
import { useJoinHome } from '../../hooks/home/joinHook';
import { useTranslation } from '../../contexts/LanguageContext';
import { Feather } from '@expo/vector-icons';

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
        <View style={[styles.section, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
          <ThemedText style={[styles.label, { textAlign: isRTL ? 'right' : 'left', width: '100%' }]}>
            {t('home.join.homeId')} *
          </ThemedText>
          <TextInput
            style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
            placeholder={t('home.join.homeIdPlaceholder')}
            placeholderTextColor="rgba(49, 57, 79, 0.6)"
            value={homeId}
            onChangeText={setHomeId}
            keyboardType="number-pad"
            maxLength={6}
          />
        </View>

        <View style={[styles.section, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
          <ThemedText style={[styles.label, { textAlign: isRTL ? 'right' : 'left', width: '100%' }]}>
            {t('home.join.homePassword')} *
          </ThemedText>
          <TextInput
            style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
            placeholder={t('home.join.homePasswordPlaceholder')}
            placeholderTextColor="rgba(49, 57, 79, 0.6)"
            value={homePassword}
            onChangeText={setHomePassword}
            keyboardType="number-pad"
            maxLength={6}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={styles.scanButton}
          onPress={requestCameraPermission}
        >
          <Feather name="camera" size={24} color={colors.primary} style={{ marginRight: 8 }} />
          <ThemedText style={styles.scanButtonText}>
            {t('home.join.scanQrCode')}
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>

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
