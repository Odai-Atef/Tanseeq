
import React from 'react';
import { View, StyleSheet, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { VideoCard } from '../../components/VideoCard';
import { useVideos } from '../../hooks/videos/useVideos';
import { colors } from '../../constants/Theme';
import { useTranslation } from '../../contexts/LanguageContext';

interface Video {
  id: string;
  title_ar: string;
  title_en: string;
  link: string;
}

export default function Videos() {
  const { t } = useTranslation();
  const { videos, loading, error, refetch } = useVideos();

  const renderVideoItem = ({ item }: { item: Video }) => (
    <VideoCard
      title_ar={item.title_ar}
      title_en={item.title_en}
      link={item.link}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <ThemedText type="subtitle" style={styles.emptyText}>
        {t('videos.empty', 'No videos available')}
      </ThemedText>
    </View>
  );

  const renderError = () => (
    <View style={styles.emptyState}>
      <ThemedText type="subtitle" style={styles.errorText}>
        {error}
      </ThemedText>
    </View>
  );

  if (loading && videos.length === 0) {
    return (
      <ThemedView style={[styles.container, styles.ios_boarder]}>
        <Header title={t('videos.title', 'Videos')} />
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <ThemedText style={styles.loadingText}>
            {t('common.loading', 'Loading...')}
          </ThemedText>
        </View>

        <Footer activeTab="videos" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, styles.ios_boarder]}>
      <Header title={t('videos.title', 'Videos')} />
      
      <View style={styles.content}>
        {error ? (
          renderError()
        ) : (
          <FlatList
            data={videos}
            renderItem={renderVideoItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={refetch}
                colors={[colors.primary]}
                tintColor={colors.primary}
              />
            }
            ListEmptyComponent={renderEmptyState}
          />
        )}
      </View>

      <Footer activeTab="videos" />
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
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100, // Extra padding for footer
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: colors.textSecondary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textSecondary,
  },
  errorText: {
    textAlign: 'center',
    color: colors.error,
  },
});
