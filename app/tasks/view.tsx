import React, { useState, useEffect } from 'react';
import { View, ScrollView, ActivityIndicator, Image, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { colors, taskTheme as styles } from '../../constants/Theme';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { API_ENDPOINTS } from '../../constants/api';
import { useTaskView } from '../../hooks/tasks/viewHook';
import { useTranslation, useTextDirection } from '../../contexts/LanguageContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header } from '../../components/Header';

export default function TaskView() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { task, loading, error, token } = useTaskView(id);
  const { t } = useTranslation();
  const { textAlign, flexDirection } = useTextDirection();
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    const checkUserPermission = async () => {
      try {
        const userInfoStr = await AsyncStorage.getItem('userInfo');
        if (userInfoStr && task) {
          const userInfo = JSON.parse(userInfoStr);
          setCanEdit(userInfo.id === task.user_created);
        }
      } catch (error) {
        console.error('Error checking user permission:', error);
      }
    };

    checkUserPermission();
  }, [task]);

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <View style={[styles.content, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ThemedView>
    );
  }

  if (error || !task) {
    return (
      <ThemedView style={styles.container}>
        <View style={[styles.content, { justifyContent: 'center', alignItems: 'center' }]}>
          <ThemedText style={{ color: colors.danger }}>{error || t('tasks.view.notFound')}</ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container,styles.ios_boarder]}>
      <Header title={t('tasks.view.title')} />

      <ScrollView style={styles.content}>
        {task.images && task.images.length > 0 && token && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: `${API_ENDPOINTS.BASE_URL}/assets/${task.images}?access_token=${token}` }}
              style={styles.bannerImage}
            />
          </View>
        )}

        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { textAlign }]}>{task.name}</ThemedText>
          <ThemedText style={[styles.description, { textAlign }]}>
            {task.description}
          </ThemedText>
        </View>

        <View style={styles.listSection}>
        

          {/* Created Date Section */}
          <View style={[styles.listItem, { flexDirection }]}>
            <View style={[styles.listItemLeft, { flexDirection }]}>
              <MaterialCommunityIcons name="clock-outline" size={20} color={colors.text} />
              <ThemedText style={[styles.listItemTitle, { textAlign }]}>{t('tasks.view.createdAt')}</ThemedText>
            </View>
            <ThemedText style={{ textAlign }}>{task.getFormattedCreatedDate()}</ThemedText>
          </View>

          {/* Status Section */}
          <View style={[styles.listItem, { flexDirection }]}>
            <View style={[styles.listItemLeft, { flexDirection }]}>
              <MaterialCommunityIcons name="checkbox-marked-circle" size={20} color={colors.text} />
              <ThemedText style={[styles.listItemTitle, { textAlign }]}>{t('tasks.view.status')}</ThemedText>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: colors.statusTodo }]}>
              <ThemedText style={styles.statusText}>{task.status}</ThemedText>
            </View>
          </View>

          {/* Schedule Section */}
          <View style={[styles.listItem, { flexDirection }]}>
            <View style={[styles.listItemLeft, { flexDirection }]}>
              <MaterialCommunityIcons name="calendar-clock" size={20} color={colors.text} />
              <ThemedText style={[styles.listItemTitle, { textAlign }]}>{t('tasks.view.schedule')}</ThemedText>
            </View>
            <ThemedText style={{ textAlign }}>{task.getRepeatFormat()}</ThemedText>
          </View>

         
        </View>
      </ScrollView>

      {canEdit && (
        <View style={[styles.footer, { flexDirection }]}>
          <TouchableOpacity
            style={[styles.editButton, { alignSelf: flexDirection === 'row-reverse' ? 'flex-start' : 'flex-end' }]}
            onPress={() => router.push({
              pathname: "/tasks/add",
              params: { id: task.id }
            })}
          >
            <ThemedText style={styles.editButtonText}>{t('common.buttons.edit')}</ThemedText>
          </TouchableOpacity>
        </View>
      )}
    </ThemedView>
  );
}
