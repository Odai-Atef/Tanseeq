
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS } from '../../constants/api';
import Toast from 'react-native-toast-message';
import { useTranslation } from '../../contexts/LanguageContext';

interface Video {
  id: string;
  title_ar: string;
  title_en: string;
  link: string;
}

interface ApiResponse {
  data: Video[];
}

export const useVideos = () => {
  const { t } = useTranslation();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await fetch(API_ENDPOINTS.VIDEOS, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }

      const result: ApiResponse = await response.json();
      setVideos(result.data || []);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load videos';
      setError(errorMessage);
      Toast.show({
        type: 'error',
        text1: t('common.toast.error'),
        text2: errorMessage,
        position: 'top',
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 70,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return {
    videos,
    loading,
    error,
    refetch: fetchVideos
  };
};
