import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Home } from '../../types/Home';
import { API_ENDPOINTS, DEFAULT_HOME } from '../../constants/api';
import { showToast } from '../../components/Toast';
import { eventEmitter, EVENTS } from '../../utils/eventEmitter';
import { Schedule } from '../../types/Schedule';

export const useHomes = () => {
  const [homes, setHomes] = useState<Home[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHomeProgress = async (homeId: string): Promise<number> => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const today = new Date().toISOString().split('T')[0];
      
      const url = `${API_ENDPOINTS.SCHEDULE}?fields=*,task.*&filter[day][_eq]=${today}&filter[task][property_id][_eq]=${homeId}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) throw new Error('Failed to fetch schedules');
      
      const data = await response.json();
      const todaySchedules = (data.data || []).map((item: any) => Schedule.fromAPI(item));

      // Calculate progress percentage
      const totalSchedules = todaySchedules.length;
      const activeSchedules = todaySchedules.filter((schedule: Schedule) => 
        ['Done', 'Cancelled'].includes(schedule.status)
      ).length;
      
      return totalSchedules > 0 ? Math.round((activeSchedules / totalSchedules) * 100) : 0;
    } catch (error) {
      console.error('Error fetching home progress:', error);
      return 0;
    }
  };

  const fetchHomes = useCallback(async () => {
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
        // Find if any property user has is_default true
        const hasDefaultUser = home.property_users?.some((pu: any) => pu.is_default) || false;

        // Map property users
        const mappedPropertyUsers = home.property_users?.map((pu: any) => {
          const user = pu.directus_users_id;
          return {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name || null,
            email: user.email,
            avatar: user.avatar || null,
            status: user.status as 'active' | 'inactive'
          };
        }) || [];

        return {
          id: home.id,
          name: home.name,
          date_created: home.date_created,
          is_default: hasDefaultUser,
          property_users: mappedPropertyUsers,
          tasks: 5,
          links: 3,
          progress: 0 // Will be updated by fetchHomeProgress
        };
      });

      // Fetch progress for each home
      const homesWithProgress = await Promise.all(
        transformedHomes.map(async (home) => {
          const progress = await fetchHomeProgress(home.id);
          return { ...home, progress };
        })
      );

      setHomes(homesWithProgress);
      
      // If there's a default home, save it to AsyncStorage
      const defaultHome = homesWithProgress.find(home => home.is_default);
      if (defaultHome) {
        await AsyncStorage.setItem(DEFAULT_HOME, JSON.stringify(defaultHome));
      }
      
      setIsLoading(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch homes';
      setError(message);
      showToast({
        type: 'error',
        text1Key: 'common.toast.error',
        text2Key: 'common.toast.fetch.homes'
      });
      setIsLoading(false);
    }
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

      // Save to local storage - store the entire home object
      const defaultHome = homes.find(home => home.id === homeId);
      if (defaultHome) {
        await AsyncStorage.setItem(DEFAULT_HOME, JSON.stringify(defaultHome));
        // Emit event for default home change
        eventEmitter.emit(EVENTS.DEFAULT_HOME_CHANGED, defaultHome);
      }

      showToast({
        type: 'success',
        text1Key: 'common.toast.success',
        text2Key: 'common.toast.defaultHome.success'
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update default home';
      showToast({
        type: 'error',
        text1Key: 'common.toast.error',
        text2Key: 'common.toast.defaultHome.error'
      });
    }
  }, [homes]);

  useEffect(() => {
    fetchHomes();

    // Listen for schedule status changes to update progress
    const handleScheduleChange = () => {
      fetchHomes();
    };

    eventEmitter.on(EVENTS.SCHEDULE_STATUS_CHANGED, handleScheduleChange);

    return () => {
      eventEmitter.off(EVENTS.SCHEDULE_STATUS_CHANGED, handleScheduleChange);
    };
  }, [fetchHomes]);

  return {
    homes,
    isLoading,
    error,
    setDefaultHome
  };
};
