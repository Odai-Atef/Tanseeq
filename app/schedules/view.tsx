import React from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { colors, taskTheme as styles } from '../../constants/Theme';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useScheduleView } from '../../hooks/schedules/viewHook';
import { useTranslation } from '../../contexts/LanguageContext';

export default function ScheduleView() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { t } = useTranslation();
  const {
    schedule,
    loading,
    error,
    isAdmin,
    handleCancel,
    handleStartTask,
    handleCloseTask
  } = useScheduleView(id);

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <View style={[styles.content, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ThemedView>
    );
  }

  if (error || !schedule) {
    return (
      <ThemedView style={styles.container}>
        <View style={[styles.content, { justifyContent: 'center', alignItems: 'center' }]}>
          <ThemedText style={{ color: colors.danger }}>{error || t('schedules.view.notFound')}</ThemedText>
        </View>
      </ThemedView>
    );
  }

  const renderFooter = () => {
    if (schedule.status === 'Done') {
      return null;
    }
    if (schedule.status === 'Not-Started') {
      if (isAdmin) {
        return (
          <View style={styles.footer}>
            <TouchableOpacity
            style={[styles.submitButton, styles.footerButtonDanger]}
              onPress={handleCancel}
            >
              <ThemedText style={styles.footerButtonText}>{t('schedules.view.actions.cancel')}</ThemedText>
            </TouchableOpacity>
          </View>
        );
      } else {
        return (
          <View style={styles.footer}>
            <TouchableOpacity
            style={[styles.submitButton, styles.footerButtonPrimary]}
              onPress={handleStartTask}
            >
              <ThemedText style={styles.footerButtonText}>{t('schedules.view.actions.start')}</ThemedText>
            </TouchableOpacity>
          </View>
        );
      }
    }

    if (schedule.status === 'In-progress' && !isAdmin) {
      return (
        <View style={styles.footer}>
          <TouchableOpacity
                       style={[styles.submitButton, styles.footerButtonPrimary]}

            onPress={handleCloseTask}
          >
            <ThemedText style={styles.footerButtonText}>{t('schedules.view.actions.close')}</ThemedText>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.footerButton, styles.footerButtonPrimary, { flex: 1 }]}
          onPress={() => router.push({
            pathname: "/schedules/add",
            params: { id: schedule.id }
          })}
        >
          <Ionicons name="pencil" size={20} color="white" style={styles.footerButtonIcon} />
          <ThemedText style={styles.footerButtonText}>{t('schedules.view.actions.edit')}</ThemedText>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <ThemedText style={styles.title}>{schedule.task.name}</ThemedText>
          <ThemedText style={styles.description}>{schedule.task.description}</ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.subtitle}>{t('schedules.view.day')}</ThemedText>
          <ThemedText style={styles.description}>{schedule.day}</ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.subtitle}>{t('schedules.view.time')}</ThemedText>
          <ThemedText style={styles.description}>
            {schedule.getFormattedStartTime()} - {schedule.getFormattedEndTime()}
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.subtitle}>{t('schedules.view.status')}</ThemedText>
          <ThemedText style={styles.description}>{schedule.status}</ThemedText>
        </View>
      </ScrollView>

      {renderFooter()}
    </ThemedView>
  );
}
