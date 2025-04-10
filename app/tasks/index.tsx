import React, { useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator, RefreshControl, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Footer } from '../../components/Footer';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { useTranslation, useTextDirection } from '../../contexts/LanguageContext';
import { colors, taskTheme as styles } from '../../constants/Theme';
import { API_ENDPOINTS } from '../../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../../types/Task';
import { TaskItem } from '../../components/TaskItem';

interface ApiResponse {
  data: any[];
}

export default function TasksScreen() {
  const router = useRouter();
  const { t, isRTL } = useTranslation();
  const { textAlign, flexDirection } = useTextDirection();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  // Filter tasks when search query or tasks change
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredTasks(tasks);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = tasks.filter(task => 
        (task.name && task.name.toLowerCase().includes(query)) || 
        (task.description && task.description.toLowerCase().includes(query))
      );
      setFilteredTasks(filtered);
    }
  }, [searchQuery, tasks]);

  const fetchTasks = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await fetch(
        `${API_ENDPOINTS.TASKS}?sort=-id`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }

      const result: ApiResponse = await response.json();
      const fetchedTasks = (result.data || []).map(item => Task.fromAPI(item));
      setTasks(fetchedTasks);
      setFilteredTasks(fetchedTasks);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  }, [fetchTasks]);

  return (
    <ThemedView style={[styles.container_trans,styles.ios_boarder]}>
      <View style={styles.content}>
        <View style={[{
          backgroundColor: colors.white,
          borderRadius: 8,
          marginBottom: 16,
          padding: 8,
          borderWidth: 1,
          borderColor: colors.line,
          alignItems: 'center'
        }, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          {isRTL ? null : (
            <Ionicons name="search" size={20} color={colors.secondary2} style={{ marginHorizontal: 8 }} />
          )}
          
          <TextInput
            style={[{
              flex: 1,
              height: 40,
              fontSize: 16,
              color: colors.textPrimary,
              paddingHorizontal: 8
            }, { textAlign: isRTL ? 'right' : 'left' }]}
            placeholder={t('tasks.searchPlaceholder') || "Search tasks..."}
            placeholderTextColor={colors.secondary2}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          
          {isRTL ? (
            <Ionicons name="search" size={20} color={colors.secondary2} style={{ marginHorizontal: 8 }} />
          ) : null}
        </View>
        
        <ScrollView 
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        >
        {loading ? (
          <View style={[styles.content, { justifyContent: 'center', alignItems: 'center' }]}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : error ? (
          <View style={[styles.content, { justifyContent: 'center', alignItems: 'center' }]}>
            <ThemedText style={{ color: colors.danger }}>{error}</ThemedText>
          </View>
        ) : filteredTasks.length === 0 && searchQuery === '' ? (
          <View style={{ alignItems: 'center', justifyContent: 'center', padding: 20, marginTop: 20 }}>
            <ThemedText style={{ textAlign: 'center', marginBottom: 20, fontSize: 16, lineHeight: 24 }}>
              {t('tasks.emptyMessage')}
            </ThemedText>
            <TouchableOpacity 
              style={{ backgroundColor: colors.primary, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 }} 
              onPress={() => router.push('/tasks/add')}
            >
              <ThemedText style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
                {t('tasks.addTaskButton')}
              </ThemedText>
            </TouchableOpacity>
          </View>
        ) : filteredTasks.length === 0 && searchQuery !== '' ? (
          <View style={{ alignItems: 'center', justifyContent: 'center', padding: 20, marginTop: 20 }}>
            <ThemedText style={{ textAlign: 'center', marginBottom: 20, fontSize: 16, lineHeight: 24 }}>
              {t('tasks.noSearchResults') || "No tasks match your search"}
            </ThemedText>
          </View>
        ) : (
          <View>
            {filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                item={task}
                type="task"
              />
            ))}
          </View>
        )}
        </ScrollView>
      </View>
      <Footer activeTab="tasks" />
    </ThemedView>
  );
}
