import React from 'react';
import { View, ScrollView, ActivityIndicator, Image, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { colors, taskTheme as styles } from '../../constants/Theme';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { API_ENDPOINTS } from '../../constants/api';
import { useTaskView } from '../../hooks/tasks/viewHook';

export default function TaskView() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { task, loading, error, token } = useTaskView(id);

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
          <ThemedText style={{ color: colors.danger }}>{error || 'Task not found'}</ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.content}>
        {task.images && task.images.length > 0 && token && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: `${API_ENDPOINTS.BASE_URL}/assets/${task.images}?access_token=${token}` }}
              style={{
                width: Dimensions.get('window').width,
                height: 250,
                resizeMode: 'cover'
              }}
            />
          </View>
        )}
        <View style={styles.section}>
          <ThemedText style={styles.title}>{task.name}</ThemedText>
          <ThemedText style={styles.description}>{task.description}</ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.subtitle}>Status</ThemedText>
          <ThemedText style={styles.description}>
            {task.status}
          </ThemedText>
        </View>

        {task.repeat_days.length > 0 && (
          <View style={styles.section}>
            <ThemedText style={styles.subtitle}>Repeat Days</ThemedText>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
              {task.getRepeatDayNames().map((dayName) => (
                <View key={dayName} style={styles.repeatDayChip}>
                  <ThemedText style={styles.repeatDayText}>{dayName}</ThemedText>
                </View>
              ))}
            </View>
          </View>
        )}

        {task.repeat_monthly && (
          <View style={styles.section}>
            <ThemedText style={styles.subtitle}>Monthly Repeat</ThemedText>
            <ThemedText style={styles.description}>
               {task.getRepeatFormat()}
            </ThemedText>
          </View>
        )}

        <View style={styles.section}>
          <ThemedText style={styles.subtitle}>Created</ThemedText>
          <ThemedText style={styles.description}>
            {task.getFormattedCreatedDate()}
          </ThemedText>
        </View>

        {task.date_updated && (
          <View style={styles.section}>
            <ThemedText style={styles.subtitle}>Last Updated</ThemedText>
            <ThemedText style={styles.description}>
              {task.getFormattedUpdatedDate()}
            </ThemedText>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => router.push({
            pathname: "/tasks/add",
            params: { id: task.id }
          })}
        >
          <ThemedText style={styles.footerButtonText}>Edit Task</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}
