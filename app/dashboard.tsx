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
import { useTranslation } from '../contexts/LanguageContext';

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

  const { t, isRTL } = useTranslation();

  const renderTaskContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>{t('common.loading')}</Text>
        </View>
      );
    }

    if (error) {
      return <EmptyState message={error} />;
    }

    if (schedules.length === 0) {
      return <EmptyState message={t('dashboard.noTasks')} />;
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
          <EmptyState message={t('dashboard.noInProgress')} />
        )}
      </>
    );
  };

  return (
    <ThemedView style={[styles.container, { borderTopWidth: 50, borderTopColor: 'rgb(121, 128, 255)' }]}>
      <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <View>
          <Text style={[styles.greeting, { textAlign: isRTL ? 'right' : 'left' }]}>
            {t('dashboard.greeting', { name: userName })}
          </Text>
          <Text style={[styles.subGreeting, { textAlign: isRTL ? 'right' : 'left' }]}>
            {t('dashboard.subGreeting')}
          </Text>
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
            <Text style={[styles.progressTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t('dashboard.progressTitle')}
            </Text>
            <Text style={[styles.progressSubtext, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t('dashboard.tasksCompleted', {
                completed: schedules.filter((schedule: Schedule) => 
                  ['Done', 'Cancelled'].includes(schedule.status)
                ).length.toString(),
                total: schedules.length.toString()
              })}
            </Text>
          </View>
        </View>

        <View style={[styles.sectionHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
            {t('dashboard.todayTasks')}
          </Text>
          <TouchableOpacity onPress={() => router.push('/tasks/calendar')}>
            <Text style={styles.viewAll}>{t('common.buttons.viewAll')}</Text>
          </TouchableOpacity>
        </View>

        {renderTaskContent()}
      </ScrollView>

      <Footer activeTab="home" />
    </ThemedView>
  );
}
