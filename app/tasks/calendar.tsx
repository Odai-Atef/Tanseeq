import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { Footer } from '../../components/Footer';
import { colors, taskTheme as styles } from '../../constants/Theme';
import { Ionicons } from '@expo/vector-icons';
import { Calendar, DateData } from 'react-native-calendars';
import { useRouter } from 'expo-router';
import { API_ENDPOINTS } from '../../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import Toast from 'react-native-toast-message';
import { Schedule } from '../../types/Schedule';

interface ApiResponse {
  data: any[];
}

const TaskSection = ({ 
  title, 
  count, 
  tasks,
  countType,
  isExpanded,
  onToggle 
}: { 
  title: string; 
  count: number; 
  tasks: Schedule[];
  countType: 'type-1' | 'type-2' | 'type-3';
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  const router = useRouter();
  const hasTasks = tasks.length > 0;

  return (
    <View style={styles.taskSection}>
      <TouchableOpacity onPress={onToggle} style={styles.taskSectionHeader}>
        <View style={styles.taskTitleContainer}>
          <ThemedText style={styles.taskSectionTitle}>{title}</ThemedText>
          <View style={[styles.taskCount, { 
            backgroundColor: countType === 'type-1' ? colors.primary : // In Progress - Blue
                           countType === 'type-2' ? colors.success : // Done - Green
                           colors.danger // Not Started - Red
          }]}>
            <ThemedText style={styles.taskCountText}>{count}</ThemedText>
          </View>
        </View>
        <Ionicons 
          name={isExpanded ? "chevron-down" : "chevron-forward"} 
          size={24} 
          color={colors.textPrimary} 
        />
      </TouchableOpacity>

      {isExpanded && hasTasks && (
        <>
          <View style={styles.assignHeader}>
            <ThemedText style={styles.assignText}>Task Name</ThemedText>
            <ThemedText style={styles.assignText}>Time</ThemedText>
          </View>

          {tasks.map((schedule) => (
            <TouchableOpacity 
              key={schedule.id} 
              style={styles.taskItem}
              onPress={() => router.push({
                pathname: "/schedules/view",
                params: { id: schedule.id }
              })}
            >
              <ThemedText style={styles.taskName}>{schedule.task.name}</ThemedText>
              <ThemedText style={styles.taskDueDate}>
                {schedule.getFormattedStartTime()}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </>
      )}
    </View>
  );
};

export default function Tasks() {
  const [expandedSections, setExpandedSections] = useState({
    inProgress: true,
    done: true,
    notStarted: true
  });
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  const showError = (message: string) => {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: message,
      position: 'top',
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 30
    });
  };

  const fetchSchedules = async (date: string) => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await fetch(
        `${API_ENDPOINTS.SCHEDULE}?fields=*,task.*&filter[day][_eq]=${date}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch schedules');
      }

      const result: ApiResponse = await response.json();
      const scheduleInstances = (result.data || []).map(schedule => Schedule.fromAPI(schedule));
      setSchedules(scheduleInstances);
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to load schedules');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules(selectedDate);
  }, [selectedDate]);

  const toggleSection = (section: 'inProgress' | 'done' | 'notStarted') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const inProgressTasks = schedules.filter(schedule => schedule.status === 'In-progress');
  const doneTasks = schedules.filter(schedule => schedule.status === 'Done');
  const notStartedTasks = schedules.filter(schedule => schedule.status === 'Not-Started');

  return (
    <ThemedView style={styles.container_trans}>
      <ScrollView style={styles.content}>
        <Calendar
          style={styles.calendar}
          theme={{
            backgroundColor: colors.white,
            calendarBackground: colors.white,
            textSectionTitleColor: colors.textPrimary,
            selectedDayBackgroundColor: colors.primary,
            selectedDayTextColor: colors.white,
            todayTextColor: colors.primary,
            dayTextColor: colors.textPrimary,
            textDisabledColor: colors.line,
            dotColor: colors.primary,
            selectedDotColor: colors.white,
            arrowColor: colors.primary,
            monthTextColor: colors.textPrimary,
            indicatorColor: colors.primary,
            textDayFontFamily: 'System',
            textMonthFontFamily: 'System',
            textDayHeaderFontFamily: 'System',
            textDayFontSize: 16,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 14
          }}
          onDayPress={(day: DateData) => {
            setSelectedDate(day.dateString);
          }}
          markedDates={{
            [selectedDate]: {
              selected: true,
              disableTouchEvent: true,
              selectedColor: colors.primary
            }
          }}
        />

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <>
            <TaskSection 
              title="In Progress" 
              count={inProgressTasks.length} 
              tasks={inProgressTasks}
              countType="type-1"
              isExpanded={expandedSections.inProgress}
              onToggle={() => toggleSection('inProgress')}
            />

            <TaskSection 
              title="Done" 
              count={doneTasks.length} 
              tasks={doneTasks}
              countType="type-2"
              isExpanded={expandedSections.done}
              onToggle={() => toggleSection('done')}
            />

            <TaskSection 
              title="Not Started" 
              count={notStartedTasks.length} 
              tasks={notStartedTasks}
              countType="type-3"
              isExpanded={expandedSections.notStarted}
              onToggle={() => toggleSection('notStarted')}
            />
          </>
        )}
      </ScrollView>

      <Footer activeTab="tasks/calendar" />
    </ThemedView>
  );
}
