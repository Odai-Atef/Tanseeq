
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { useTranslation } from '../../contexts/LanguageContext';
import { dashboardTheme as main_styles, colors } from "../../constants/Theme";

export default function Houses() {
  const { t } = useTranslation();

  return (
    <ThemedView style={[styles.container, main_styles.ios_boarder]}>
      <View style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Manage Houses
        </ThemedText>
        <ThemedText style={styles.description}>
          This page will contain house management functionality.
        </ThemedText>
      </View>

      <Footer activeTab="houses" />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  ios_boarder: {
    paddingTop: 50,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    color: colors.textSecondary,
  },
});
