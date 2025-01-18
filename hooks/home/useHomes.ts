import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Home } from '../../types/Home';
import { API_ENDPOINTS } from '../../constants/api';
import Toast from 'react-native-toast-message';

export const useHomes = () => {
  const [homes, setHomes] = useState<Home[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHomes = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        if (!token) {
          throw new Error('Authentication required');
        }

        const fields = 'fields=*,property_users.*,property_users.directus_users_id.id,property_users.directus_users_id.first_name,property_users.directus_users_id.last_name,property_users.directus_users_id.email,property_users.directus_users_id.avatar,property_users.directus_users_id.status';
        const response = await fetch(`${API_ENDPOINTS.HOME}?${fields}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch homes');
        }

        const data = await response.json();
        
        // Transform API data to match our Home type
        const transformedHomes: Home[] = data.data.map((home: any) => ({
          id: home.id,
          name: home.name,
          date_created: home.date_created,
          is_default: home.is_default,
          property_users: home.property_users?.map((pu: any) => ({
            id: pu.directus_users_id.id,
            first_name: pu.directus_users_id.first_name,
            last_name: pu.directus_users_id.last_name,
            email: pu.directus_users_id.email,
            avatar: pu.directus_users_id.avatar,
            status: pu.directus_users_id.status
          })) || [],
          // Static values until we get the calculation API
          tasks: 5,
          links: 3,
          progress: 75
        }));

        setHomes(transformedHomes);
        setIsLoading(false);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch homes';
        setError(message);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: message,
          position: 'top',
          visibilityTime: 3000,
          autoHide: true,
          topOffset: 30
        });
        setIsLoading(false);
      }
    };

    fetchHomes();
  }, []);

  return {
    homes,
    isLoading,
    error
  };
};
