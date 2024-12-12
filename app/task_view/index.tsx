import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { taskStore, Task } from '../../utils/taskStore';
import { TasksTheme } from '../../constants/TasksTheme';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

export default function TaskView() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);

  useEffect(() => {
    const loadTask = async () => {
      const tasks = await taskStore.getTasks();
      const foundTask = tasks.find(t => t.id === id);
      setTask(foundTask || null);
    };

    loadTask();
  }, [id]);

  if (!task) {
    return (
      <ThemedView style={TasksTheme.container}>
        <View style={TasksTheme.header}>
          <TouchableOpacity onPress={() => router.back()} style={TasksTheme.backButton}>
            <Ionicons name="arrow-back" size={24} color="#31394F" />
          </TouchableOpacity>
          <ThemedText style={TasksTheme.headerTitle}>Task Details</ThemedText>
          <View style={{ width: 24 }} />
        </View>
        <View style={[TasksTheme.content, { justifyContent: 'center', alignItems: 'center' }]}>
          <ThemedText>Loading...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={TasksTheme.container}>
      <View style={TasksTheme.header}>
        <TouchableOpacity onPress={() => router.back()} style={TasksTheme.backButton}>
          <Ionicons name="arrow-back" size={24} color="#31394F" />
        </TouchableOpacity>
        <ThemedText style={TasksTheme.headerTitle}>Task Details</ThemedText>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={TasksTheme.content}>
        <View style={TasksTheme.section}>
          <ThemedText style={TasksTheme.title}>{task.name}</ThemedText>
          <ThemedText style={TasksTheme.description}>{task.description}</ThemedText>
        </View>

        <View style={TasksTheme.section}>
          <ThemedText style={TasksTheme.subtitle}>Timeline</ThemedText>
          <View style={TasksTheme.dueDateContainer}>
            <View>
              <ThemedText style={TasksTheme.dateLabel}>Start Date</ThemedText>
              <ThemedText style={TasksTheme.dueDate}>
                {new Date(task.startDate).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </ThemedText>
            </View>
            <View>
              <ThemedText style={TasksTheme.dateLabel}>Due Date</ThemedText>
              <ThemedText style={TasksTheme.dueDate}>
                {new Date(task.dueDate).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </ThemedText>
            </View>
          </View>
        </View>

        <View style={TasksTheme.section}>
          <ThemedText style={TasksTheme.subtitle}>Status</ThemedText>
          <View style={[
            TasksTheme.statusBadge,
            {
              backgroundColor: 
                task.status === 'todo' ? '#7980FF' :
                task.status === 'ongoing' ? '#54B24C' :
                '#F05A5A'
            }
          ]}>
            <ThemedText style={TasksTheme.statusText}>
              {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
            </ThemedText>
          </View>
        </View>

        <TouchableOpacity 
          style={TasksTheme.addSubtaskButton}
          onPress={() => {
            // TODO: Implement subtask creation
          }}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
          <ThemedText style={TasksTheme.addSubtaskText}>Add Subtask</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}
