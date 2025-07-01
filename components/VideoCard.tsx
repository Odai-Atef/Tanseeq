import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Platform, ActivityIndicator } from 'react-native';
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
  const { language, t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Extract YouTube video ID from various YouTube URL formats
  const getYouTubeVideoId = (url: string): string | null => {
    if (!url) return null;
    
    // Handle various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i, // Standard YouTube URLs
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/,  // More formats
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i // Another pattern
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1] && match[1].length === 11) {
        return match[1];
      }
      if (match && match[2] && match[2].length === 11) {
        return match[2];
      }
    }
    
    return null;
  };

  const videoId = getYouTubeVideoId(link);
  const title = language === 'ar' ? title_ar : title_en;

  if (!videoId) {
    return (
      <ThemedView style={styles.errorCard}>
        <ThemedText style={styles.errorText}>
          {t('videos.invalidUrl')}
        </ThemedText>
      </ThemedView>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}`;
  
  const handleLoadStart = () => {
    setIsLoading(true);
    setHasError(false);
  };
  
  const handleLoadEnd = () => {
    setIsLoading(false);
  };
  
  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // Function to render loading indicator for WebView
  const renderLoadingView = () => {
    return (
      <View style={styles.loadingOverlay}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  };

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
          <>
            <WebView
              source={{ uri: embedUrl }}
              style={styles.webview}
              allowsFullscreenVideo={true}
              mediaPlaybackRequiresUserAction={false}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              startInLoadingState={true}
              onLoadStart={handleLoadStart}
              onLoadEnd={handleLoadEnd}
              onError={handleError}
              renderLoading={renderLoadingView}
              userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1"
            />
            {isLoading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color={colors.primary} />
                <ThemedText style={styles.loadingText}>
                  {t('common.loading')}
                </ThemedText>
              </View>
            )}
            {hasError && (
              <View style={styles.errorOverlay}>
                <ThemedText style={styles.errorText}>
                  {t('videos.loadError')}
                </ThemedText>
              </View>
            )}
          </>
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
    position: 'relative',
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
    textAlign: 'center',
    color: colors.danger,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.textSecondary,
    marginTop: 10,
  },
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});
