import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedView } from '../components/ThemedView';
import { Footer } from '../components/Footer';
import { TasksTheme } from '../constants/TasksTheme';
import { Ionicons } from '@expo/vector-icons';
import { Calendar, DateData } from 'react-native-calendars';
import { useRouter, useFocusEffect } from 'expo-router';
import { taskStore, Task } from '../utils/taskStore';

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
  tasks: Task[];
  countType: 'type-1' | 'type-2' | 'type-3';
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  const router = useRouter();

  return (
    <View style={TasksTheme.taskSection}>
      <TouchableOpacity onPress={onToggle} style={TasksTheme.taskSectionHeader}>
        <View style={TasksTheme.taskTitleContainer}>
          <Text style={TasksTheme.taskSectionTitle}>{title}</Text>
          <View style={[TasksTheme.taskCount, { backgroundColor: countType === 'type-1' ? '#7980FF' : countType === 'type-2' ? '#54B24C' : '#F05A5A' }]}>
            <Text style={TasksTheme.taskCountText}>{count}</Text>
          </View>
        </View>
        <Ionicons 
          name={isExpanded ? "chevron-down" : "chevron-forward"} 
          size={24} 
          color="#31394F" 
        />
      </TouchableOpacity>

      {isExpanded && (
        <>
          <View style={TasksTheme.assignHeader}>
            <Text style={TasksTheme.assignText}>Task Name</Text>
            <Text style={TasksTheme.assignText}>Due Date</Text>
          </View>

          {tasks.map((task) => (
            <TouchableOpacity 
              key={task.id} 
              style={TasksTheme.taskItem}
              onPress={() => router.push({
                pathname: "/task_view",
                params: { id: task.id }
              })}
            >
              <Text style={TasksTheme.taskName}>{task.name}</Text>
              <Text style={TasksTheme.taskDueDate}>
                {new Date(task.dueDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}
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
    backlog: true,
    todo: true,
    ongoing: true
  });
  const [selectedDate, setSelectedDate] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);

  const loadTasks = async () => {
    const loadedTasks = await taskStore.getTasks();
    setTasks(loadedTasks);
  };

  // Reload tasks when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadTasks();
    }, [])
  );

  const toggleSection = (section: 'backlog' | 'todo' | 'ongoing') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const backlogTasks = tasks.filter(task => task.status === 'backlog');
  const todoTasks = tasks.filter(task => task.status === 'todo');
  const ongoingTasks = tasks.filter(task => task.status === 'ongoing');

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
              selectedDotColor: 'white'
            }
          }}
        />

        <TaskSection 
          title="To Do" 
          count={todoTasks.length} 
          tasks={todoTasks}
          countType="type-1"
          isExpanded={expandedSections.todo}
          onToggle={() => toggleSection('todo')}
        />

        <TaskSection 
          title="Ongoing" 
          count={ongoingTasks.length} 
          tasks={ongoingTasks}
          countType="type-2"
          isExpanded={expandedSections.ongoing}
          onToggle={() => toggleSection('ongoing')}
        />

        <TaskSection 
          title="Backlog" 
          count={backlogTasks.length} 
          tasks={backlogTasks}
          countType="type-3"
          isExpanded={expandedSections.backlog}
          onToggle={() => toggleSection('backlog')}
        />
      </ScrollView>

      <Footer activeTab="tasks" />
    </ThemedView>
  );
}
