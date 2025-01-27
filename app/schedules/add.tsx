import React from 'react';
import { View, ScrollView, TouchableOpacity, Platform, ActivityIndicator, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { colors, scheduleTheme as styles, baseTheme } from '../../constants/Theme';
import { Ionicons } from '@expo/vector-icons';
import { useScheduleAdd } from '../../hooks/schedules/addHook';
import { useTranslation } from '../../contexts/LanguageContext';

export default function ScheduleAdd() {
  const {
    date,
    showDatePicker,
    tasks,
    loading,
    error,
    selectedTaskId,
    setShowDatePicker,
    setSelectedTaskId,
    handleDateChange,
    handleSubmit
  } = useScheduleAdd();

  const { t, isRTL } = useTranslation();

  const renderDatePicker = () => {
    if (!showDatePicker) return null;

    const pickerElement = (
      <DateTimePicker
        value={date}
        mode="date"
        display={Platform.OS === 'ios' ? "spinner" : "default"}
        onChange={handleDateChange}
        minimumDate={new Date()}
        textColor={colors.textPrimary}
        themeVariant="dark"
      />
    );

    if (Platform.OS === 'ios') {
      return (
        <Modal
          animationType="slide"
          transparent={true}
          visible={showDatePicker}
          onRequestClose={() => setShowDatePicker(false)}
        >
          <View style={{
            flex: 1,
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
            <View style={{
              backgroundColor: colors.white,
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              padding: 16,
            }}>
              <View style={{
                flexDirection: isRTL ? 'row-reverse' : 'row',
                justifyContent: 'space-between',
                marginBottom: 16,
              }}>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <ThemedText style={{ color: colors.textSecondary }}>
                    {t('common.buttons.cancel')}
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <ThemedText style={{ color: colors.primary }}>
                    {t('common.buttons.done')}
                  </ThemedText>
                </TouchableOpacity>
              </View>
              {pickerElement}
            </View>
          </View>
        </Modal>
      );
    }

    return pickerElement;
  };

  return (
    <ThemedView style={[styles.container,styles.ios_boarder]}>
      <ScrollView style={styles.content}>
        <View style={[styles.section, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
          <ThemedText style={[styles.label, { textAlign: isRTL ? 'right' : 'left', width: '100%' }]}>
            {t('schedules.add.selectDate')}
          </ThemedText>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={[styles.dateButton, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
          >
            <Ionicons 
              name="calendar-outline" 
              size={20} 
              color={colors.textSecondary} 
              style={[styles.dateIcon, isRTL ? { marginLeft: 8 } : { marginRight: 8 }]} 
            />
            <ThemedText style={[styles.dateText, { textAlign: isRTL ? 'right' : 'left' }]}>
              {date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </ThemedText>
          </TouchableOpacity>
        </View>

        <View>
          <ThemedText style={[styles.label, { textAlign: isRTL ? 'right' : 'left' }]}>
            {t('schedules.add.selectTask')}
          </ThemedText>
          {loading ? (
            <View style={baseTheme.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : error ? (
            <View style={baseTheme.errorContainer}>
              <ThemedText style={[baseTheme.errorText, { textAlign: isRTL ? 'right' : 'left' }]}>
                {error}
              </ThemedText>
            </View>
          ) : (
            <View style={styles.taskList}>
              {tasks.map((task) => (
                <TouchableOpacity
                  key={task.id}
                  style={[
                    styles.taskItem,
                    selectedTaskId === task.id && styles.taskItemSelected,
                  ]}
                  onPress={() => setSelectedTaskId(task.id)}
                >
                  <ThemedText style={[styles.taskItemText, { textAlign: isRTL ? 'right' : 'left' }]}>
                    {task.name}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            baseTheme.submitButton,
            (loading || !!error || !selectedTaskId) && baseTheme.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={loading || !!error || !selectedTaskId}
        >
          <ThemedText style={baseTheme.submitButtonText}>
            {t('schedules.add.createSchedule')}
          </ThemedText>
        </TouchableOpacity>
      </View>

      {renderDatePicker()}
    </ThemedView>
  );
}
