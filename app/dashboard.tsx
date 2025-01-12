import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { ThemedView } from '../components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { dashboardTheme as styles, colors } from '../constants/Theme';
import { Footer } from '../components/Footer';
import CircularProgress from 'react-native-circular-progress-indicator';
import { router } from 'expo-router';
import { Schedule } from '../types/Schedule';
import { TaskItem } from '../components/TaskItem';
import { useDashboard } from '../hooks/dashboardHooks';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const EmptyState = ({ message }: { message: string }) => (
  <View style={styles.emptyState}>
    <Ionicons name="calendar-outline" size={48} color="#464D61" style={styles.emptyStateIcon} />
    <Text style={styles.emptyStateText}>{message}</Text>
  </View>
);

export default function Dashboard() {
  const {
    userName,
    schedules,
    firstInProgressSchedule,
    recentCompletedSchedule,
    progressPercentage,
    isLoading,
    error
  } = useDashboard();

  const renderTaskContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading schedules...</Text>
        </View>
      );
    }

    if (error) {
      return <EmptyState message={error} />;
    }

    if (schedules.length === 0) {
      return <EmptyState message="No schedules for today" />;
    }

    return (
      <>
        {firstInProgressSchedule && (
          <TaskItem item={firstInProgressSchedule} type="schedule" />
        )}
        
        {recentCompletedSchedule && (
          <TaskItem item={recentCompletedSchedule} type="schedule" />
        )}

        {!firstInProgressSchedule && !recentCompletedSchedule && (
          <EmptyState message="No in-progress or completed schedules" />
        )}
      </>
    );
  };

  return (
    <ThemedView style={[styles.container, { borderTopWidth: 50, borderTopColor: 'rgb(121, 128, 255)' }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {userName}!</Text>
          <Text style={styles.subGreeting}>Let's complete your tasks</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.progressSection}>
          <View style={[styles.progressCircle, { backgroundColor: '#7980FF' }]}>
            <CircularProgress
              value={progressPercentage}
              radius={25}
              duration={2000}
              progressValueColor={colors.white}
              activeStrokeColor={colors.white}
              inActiveStrokeColor={'rgba(255, 255, 255, 0.3)'}
              inActiveStrokeWidth={5}
              activeStrokeWidth={5}
              titleColor={colors.white}
              titleStyle={{ fontWeight: '600' }}
            />
          </View>
          <View style={styles.progressInfo}>
            <Text style={styles.progressTitle}>Progress Today Task</Text>
            <Text style={styles.progressSubtext}>
              {schedules.filter((schedule: Schedule) => 
                ['Done', 'Cancelled'].includes(schedule.status)
              ).length}/{schedules.length} Tasks Completed
            </Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today Tasks</Text>
          <TouchableOpacity onPress={() => router.push('/tasks/calendar')}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        {renderTaskContent()}
      </ScrollView>

      <Footer activeTab="home" />
    </ThemedView>
  );
}
