
import React from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { useTranslation } from '../../contexts/LanguageContext';
import { dashboardTheme as main_styles, colors } from "../../constants/Theme";
import { HomeItem } from '../../components/HomeItem';
import { useHomes } from '../../hooks/home/useHomes';

export default function Houses() {
  const { t } = useTranslation();
  const { homes, isLoading, error, setDefaultHome } = useHomes();

  const handleHomePress = (homeId: string) => {
    setDefaultHome(homeId);
  };

  return (
    <ThemedView style={[styles.container, main_styles.ios_boarder]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <ThemedText type="title" style={styles.title}>
            {t('dashboard.myHomes')}
          </ThemedText>
          
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : error ? (
            <ThemedText style={styles.errorText}>
              {error}
            </ThemedText>
          ) : (
            <View style={styles.homesContainer}>
              {homes.map((home) => (
                <HomeItem 
                  key={home.id} 
                  home={home} 
                  onPress={handleHomePress}
                  inHousesList={true}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  homesContainer: {
    marginTop: 10,
  },
  loadingContainer: {
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: colors.danger,
    textAlign: 'center',
    marginTop: 20,
  },
});
