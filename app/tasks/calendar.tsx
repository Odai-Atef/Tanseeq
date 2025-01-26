import React from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { Footer } from '../../components/Footer';
import { colors, taskTheme as styles } from '../../constants/Theme';
import { Ionicons } from '@expo/vector-icons';
import { Calendar, DateData } from 'react-native-calendars';
import { useRouter } from 'expo-router';
import { Schedule } from '../../types/Schedule';
import { useCalendar } from '../../hooks/tasks/calendarHook';
import { useTranslation } from '../../contexts/LanguageContext';

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
  const { t, isRTL } = useTranslation();
  const hasTasks = tasks.length > 0;

  return (
    <View style={styles.taskSection}>
      <TouchableOpacity 
        onPress={onToggle} 
        style={[styles.taskSectionHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
      >
        <View style={[styles.taskTitleContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <ThemedText style={[styles.taskSectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
            {title}
          </ThemedText>
          <View style={[styles.taskCount, { 
            backgroundColor: countType === 'type-1' ? colors.primary : 
                           countType === 'type-2' ? colors.success : 
                           colors.danger
          }]}>
            <ThemedText style={styles.taskCountText}>{count}</ThemedText>
          </View>
        </View>
        <Ionicons 
          name={isExpanded ? "chevron-down" : isRTL ? "chevron-back" : "chevron-forward"} 
          size={24} 
          color={colors.textPrimary} 
        />
      </TouchableOpacity>

      {isExpanded && hasTasks && (
        <>
          <View style={[styles.assignHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <ThemedText style={[styles.assignText, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t('tasks.calendar.taskName')}
            </ThemedText>
            <ThemedText style={[styles.assignText, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t('tasks.calendar.time')}
            </ThemedText>
          </View>

          {tasks.map((schedule) => (
            <TouchableOpacity 
              key={schedule.id} 
              style={[styles.taskItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
              onPress={() => router.push({
                pathname: "/schedules/view",
                params: { id: schedule.id }
              })}
            >
              <ThemedText style={[styles.taskName, { textAlign: isRTL ? 'right' : 'left' }]}>
                {schedule.task.name}
              </ThemedText>
              <ThemedText style={[styles.taskDueDate, { textAlign: isRTL ? 'right' : 'left' }]}>
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
  const { t, isRTL } = useTranslation();
  const [refreshing, setRefreshing] = React.useState(false);
  const {
    expandedSections,
    selectedDate,
    loading,
    inProgressTasks,
    doneTasks,
    notStartedTasks,
    setSelectedDate,
    toggleSection,
    fetchSchedules
  } = useCalendar();

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchSchedules(selectedDate);
    setRefreshing(false);
  }, [selectedDate, fetchSchedules]);

  return (
    <ThemedView style={[styles.container_trans,styles.ios_boarder]}>
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
              title={t('tasks.calendar.inProgress')}
              count={inProgressTasks.length} 
              tasks={inProgressTasks}
              countType="type-1"
              isExpanded={expandedSections.inProgress}
              onToggle={() => toggleSection('inProgress')}
            />

            <TaskSection 
              title={t('tasks.calendar.done')}
              count={doneTasks.length} 
              tasks={doneTasks}
              countType="type-2"
              isExpanded={expandedSections.done}
              onToggle={() => toggleSection('done')}
            />

            <TaskSection 
              title={t('tasks.calendar.notStarted')}
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
