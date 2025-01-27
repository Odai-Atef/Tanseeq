import React from 'react';
import { View, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
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
    handleSubmit
  } = useJoinHome();

  if (showScanner && hasPermission) {
    return (
      <ThemedView style={[styles.container, { padding: 0 }]}>
        <View style={{ flex: 1 }}>
     
          <View style={{ padding: 20, position: 'absolute', top: 0, left: 0, right: 0 }}>
            <ThemedText style={styles.scanButtonText}>
              {t('home.join.scanQrCode')}
            </ThemedText>
          </View>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container,styles.ios_boarder]}>
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
