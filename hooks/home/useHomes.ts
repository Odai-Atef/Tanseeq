import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Home } from '../../types/Home';
import { API_ENDPOINTS, DEFAULT_HOME } from '../../constants/api';
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
        // Get user info from localStorage
        const userInfoStr = await AsyncStorage.getItem('userInfo');
        if (!userInfoStr) {
          throw new Error('User info not found');
        }
        const userInfo = JSON.parse(userInfoStr);

        const transformedHomes: Home[] = data.data.map((home: any) => {
          // Find the property user that matches the current user
          const currentUserPropertyUser = home.property_users?.find(
            (pu: any) => pu.directus_users_id.id === userInfo.id
          );

          return {
            id: home.id,
            name: home.name,
            date_created: home.date_created,
            // Use is_default from the matching property user if found
            is_default: currentUserPropertyUser ? currentUserPropertyUser.is_default : false,
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
          };
        });

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

  const setDefaultHome = useCallback(async (homeId: string) => {
    try {
      const [token, userInfoStr] = await Promise.all([
        AsyncStorage.getItem('access_token'),
        AsyncStorage.getItem('userInfo')
      ]);

      if (!token || !userInfoStr) {
        throw new Error('Authentication required');
      }

      interface UserInfo {
        id: string;
        email: string;
        first_name?: string;
        last_name?: string;
        avatar?: string;
        role?: string;
      }

      const userInfo = JSON.parse(userInfoStr) as UserInfo;
      const userId = userInfo.id;

      // First, set is_default to false for all property_users of current user
      const response = await fetch(`${API_ENDPOINTS.PROPERTY_USERS}?filter[directus_users_id][_eq]=${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch property users');
      }

      interface PropertyUser {
        id: string;
        properties_id: string;
        directus_users_id: string;
        is_default: boolean;
      }

      const data = await response.json();
      const propertyUsers: PropertyUser[] = data.data;

      // Update all property users to set is_default false
      await Promise.all(propertyUsers.map((pu: PropertyUser) => 
        fetch(`${API_ENDPOINTS.PROPERTY_USERS}/${pu.id}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            is_default: false
          })
        })
      ));

      // Find and update the property user for selected home
      const selectedPropertyUser = propertyUsers.find((pu: PropertyUser) => pu.properties_id === homeId);
      if (selectedPropertyUser) {
        await fetch(`${API_ENDPOINTS.PROPERTY_USERS}/${selectedPropertyUser.id}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            is_default: true
          })
        });
      }

      // Update local state
      setHomes(prevHomes => 
        prevHomes.map(home => ({
          ...home,
          is_default: home.id === homeId
        }))
      );

      // Save to local storage
      await AsyncStorage.setItem(DEFAULT_HOME, homeId);

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Default home updated successfully',
        position: 'top',
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 30
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update default home';
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: message,
        position: 'top',
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 30
      });
    }
  }, [homes]);

  return {
    homes,
    isLoading,
    error,
    setDefaultHome
  };
};
