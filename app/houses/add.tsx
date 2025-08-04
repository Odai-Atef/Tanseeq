import React from 'react';
import { View, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Header } from '../../components/Header';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { colors } from '../../constants/Theme';
import { useHomeAdd } from '../../hooks/home/addHook';
import { useTranslation } from '../../contexts/LanguageContext';
import { Footer } from '../../components/Footer';

export default function HomeAdd() {
  const { t, isRTL } = useTranslation();
  const { homeName, setHomeName, isSubmitting, handleSubmit } = useHomeAdd();

  return (
    <ThemedView style={styles.container}>
      <Header title={t('home.add.title')} />
      <ScrollView style={styles.content}>
        <View style={[styles.section, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
          <ThemedText style={[styles.label, { textAlign: isRTL ? 'right' : 'left', width: '100%' }]}>
            {t('home.add.name')} *
          </ThemedText>
          <TextInput
            style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
            placeholder={t('home.add.namePlaceholder')}
            placeholderTextColor="rgba(49, 57, 79, 0.6)"
            value={homeName}
            onChangeText={setHomeName}
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
              : t('home.add.createHome')
            }
          </ThemedText>
        </TouchableOpacity>
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
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: colors.textPrimary,
  },
  input: {
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.textPrimary,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.line,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
