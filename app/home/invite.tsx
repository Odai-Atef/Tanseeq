import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { colors } from '../../constants/Theme';
import { useTranslation } from '../../contexts/LanguageContext';
import { useInviteHome } from '../../hooks/home/inviteHook';

export default function HomeInvite() {
  const { t } = useTranslation();
  const { homeId, homePassword, qrData, isSubmitting, createOrUpdateHome } = useInviteHome();

  useEffect(() => {
    createOrUpdateHome();
  }, []);

  if (isSubmitting) {
    return (
      <ThemedView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
   
        <View style={styles.section}>
          <ThemedText style={styles.label}>{t('home.invite.homeId')}</ThemedText>
          <ThemedText style={styles.value}>{homeId}</ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.label}>{t('home.invite.homePassword')}</ThemedText>
          <ThemedText style={styles.value}>{homePassword}</ThemedText>
        </View>

        <View style={styles.qrContainer}>
          <QRCode
            value={qrData}
            size={200}
            color={colors.textPrimary}
            backgroundColor={colors.background}
          />
        </View>
        <ThemedText style={styles.instruction}>
          {t('home.invite.instruction')}
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  instruction: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
    lineHeight: 24,
    opacity: 0.8,
    paddingHorizontal: 10,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginBottom: 20,
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    opacity: 0.8,
  },
  value: {
    paddingTop:15,
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  qrContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: colors.background,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
