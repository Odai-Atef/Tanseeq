import React from 'react';
import { ScrollView, View, TouchableOpacity, Dimensions, ActivityIndicator, RefreshControl } from 'react-native';
import { ThemedView } from '../components/ThemedView';
import { ThemedText } from '../components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { dashboardTheme as styles, colors } from '../constants/Theme';
import { Footer } from '../components/Footer';
import CircularProgress from 'react-native-circular-progress-indicator';
import { router } from 'expo-router';
import { Schedule } from '../types/Schedule';
import { TaskItem } from '../components/TaskItem';
import { useDashboard } from '../hooks/dashboardHooks';
import { useTranslation } from '../contexts/LanguageContext';
import { MyHomes } from '../components/MyHomes';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const EmptyState = ({ message }: { message: string }) => (
  <View style={styles.emptyState}>
    <Ionicons name="calendar-outline" size={48} color="#464D61" style={styles.emptyStateIcon} />
    <ThemedText style={styles.emptyStateText}>{message}</ThemedText>
  </View>
);

export default function Dashboard() {
  const [refreshing, setRefreshing] = React.useState(false);
  const {
    userName,
    schedules,
    firstInProgressSchedule,
    recentCompletedSchedule,
    progressPercentage,
    isLoading,
    error,
    fetchTodaySchedules
  } = useDashboard();

  const { t, isRTL } = useTranslation();

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchTodaySchedules();
    setRefreshing(false);
  }, [fetchTodaySchedules]);

  const renderTaskContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <ThemedText style={styles.loadingText}>{t('common.loading')}</ThemedText>
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
    <ThemedView style={[styles.container,styles.ios_boarder]}>
      <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <View>
          <ThemedText type="title" style={[styles.greeting, { textAlign: isRTL ? 'right' : 'left' }]}>
            {t('dashboard.greeting', { name: userName })}
          </ThemedText>
          <ThemedText type="subtitle" style={[styles.subGreeting, { textAlign: isRTL ? 'right' : 'left' }]}>
            {t('dashboard.subGreeting')}
          </ThemedText>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        <MyHomes />
      
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
              titleStyle={{ fontFamily: 'Cairo', fontWeight: '600' }}
            />
          </View>
          <View style={styles.progressInfo}>
            <ThemedText type="defaultSemiBold" style={[styles.progressTitle, { textAlign: isRTL ? 'right' : 'left', color: colors.white }]}>
              {t('dashboard.progressTitle')}
            </ThemedText>
            <ThemedText style={[styles.progressSubtext, { textAlign: isRTL ? 'right' : 'left', color: colors.white }]}>
              {t('dashboard.tasksCompleted', {
                completed: schedules.filter((schedule: Schedule) => 
                  ['Done', 'Cancelled'].includes(schedule.status)
                ).length.toString(),
                total: schedules.length.toString()
              })}
            </ThemedText>
          </View>
        </View>

        <View style={[styles.sectionHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <ThemedText type="defaultSemiBold" style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
            {t('dashboard.todayTasks')}
          </ThemedText>
          <TouchableOpacity onPress={() => router.push('/tasks/calendar')}>
            <ThemedText type="link" style={styles.viewAll}>{t('common.buttons.viewAll')}</ThemedText>
          </TouchableOpacity>
        </View>

        {renderTaskContent()}
      </ScrollView>

      <Footer activeTab="home" />
    </ThemedView>
  );
}
