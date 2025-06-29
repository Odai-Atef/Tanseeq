import React from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { colors } from '../constants/Theme';
import { useTranslation } from '../contexts/LanguageContext';

interface VideoCardProps {
  title_ar: string;
  title_en: string;
  link: string;
}

const { width } = Dimensions.get('window');

export const VideoCard: React.FC<VideoCardProps> = ({ title_ar, title_en, link }) => {
  const { language } = useTranslation();

  // Extract YouTube video ID from various YouTube URL formats
  const getYouTubeVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeVideoId(link);
  const title = language === 'ar' ? title_ar : title_en;

  if (!videoId) {
    return (
      <ThemedView style={styles.errorCard}>
        <ThemedText style={styles.errorText}>Invalid video URL</ThemedText>
      </ThemedView>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  return (
    <ThemedView style={styles.card}>
      <ThemedText type="subtitle" style={styles.title}>
        {title}
      </ThemedText>

      <View style={styles.videoContainer}>
        {Platform.OS === 'web' ? (
          <iframe
            width="100%"
            height="200"
            src={embedUrl}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={styles.iframe}
          />
        ) : (
          <WebView
            source={{ uri: embedUrl }}
            style={styles.webview}
            allowsFullscreenVideo={true}
            mediaPlaybackRequiresUserAction={false}
            javaScriptEnabled={true}
            domStorageEnabled={true}
          />
        )}
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    marginBottom: 12,
    color: colors.text,
    textAlign: 'center',
  },
  videoContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#000',
    aspectRatio: 16/9,
  },
  iframe: {
    borderRadius: 8,
  },
  webview: {
    flex: 1,
    borderRadius: 8,
  },
  errorCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  errorText: {
    color: colors.error,
    textAlign: 'center',
  },
});