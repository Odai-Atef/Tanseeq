import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ThemedView } from '../../components/ThemedView';
import { Footer } from '../../components/Footer';
import { TasksTheme } from '../../constants/TasksTheme';
import { Ionicons } from '@expo/vector-icons';
import { Calendar, DateData } from 'react-native-calendars';
import { useRouter } from 'expo-router';
import { API_ENDPOINTS } from '../../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';

type TaskStatus = 'Done' | 'Not-Started' | 'In-progress';

interface Task {
  id: string;
  name: string;
}

interface Schedule {
  id: string;
  day: string;
  start_time: string;
  end_time: string;
  status: TaskStatus;
  task: Task;
}

interface ApiResponse {
  data: Schedule[];
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
    <View style={TasksTheme.taskSection}>
      <TouchableOpacity onPress={onToggle} style={TasksTheme.taskSectionHeader}>
        <View style={TasksTheme.taskTitleContainer}>
          <Text style={TasksTheme.taskSectionTitle}>{title}</Text>
          <View style={[TasksTheme.taskCount, { 
            backgroundColor: countType === 'type-1' ? '#7980FF' : // In Progress - Blue
                           countType === 'type-2' ? '#54B24C' : // Done - Green
                           '#F05A5A' // Not Started - Red
          }]}>
            <Text style={TasksTheme.taskCountText}>{count}</Text>
          </View>
        </View>
        <Ionicons 
          name={isExpanded ? "chevron-down" : "chevron-forward"} 
          size={24} 
          color="#31394F" 
        />
      </TouchableOpacity>

      {isExpanded && hasTasks && (
        <>
          <View style={TasksTheme.assignHeader}>
            <Text style={TasksTheme.assignText}>Task Name</Text>
            <Text style={TasksTheme.assignText}>Time</Text>
          </View>

          {tasks.map((schedule) => (
            <TouchableOpacity 
              key={schedule.id} 
              style={TasksTheme.taskItem}
              onPress={() => router.push({
                pathname: "/tasks/view",
                params: { id: schedule.task.id }
              })}
            >
              <Text style={TasksTheme.taskName}>{schedule.task.name}</Text>
              <Text style={TasksTheme.taskDueDate}>
                {/* {format(new Date(`2000-01-01T${schedule.start_time}`), 'hh:mm a')} */}
              </Text>
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
  const [error, setError] = useState('');

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
      setSchedules(result.data || []);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load schedules');
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
    <ThemedView style={TasksTheme.container}>
      <ScrollView style={TasksTheme.content}>
        <Calendar
          style={{
            marginBottom: 20,
            borderRadius: 10,
            elevation: 4,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          }}
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#31394F',
            selectedDayBackgroundColor: '#7980FF',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#7980FF',
            dayTextColor: '#31394F',
            textDisabledColor: '#d9e1e8',
            dotColor: '#7980FF',
            selectedDotColor: '#ffffff',
            arrowColor: '#7980FF',
            monthTextColor: '#31394F',
            indicatorColor: '#7980FF',
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
              selectedColor: '#7980FF'
            }
          }}
        />

        {loading ? (
          <View style={TasksTheme.loadingContainer}>
            <ActivityIndicator size="large" color="#7980FF" />
          </View>
        ) : error ? (
          <View style={TasksTheme.errorContainer}>
            <Text style={TasksTheme.errorText}>{error}</Text>
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