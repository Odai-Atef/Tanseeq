import React from 'react';
import { View, ScrollView, TouchableOpacity, Platform, ActivityIndicator, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { colors, scheduleTheme as styles, baseTheme } from '../../constants/Theme';
import { Ionicons } from '@expo/vector-icons';
import { useScheduleAdd } from '../../hooks/schedules/addHook';

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
    handleSubmit,
    today
  } = useScheduleAdd();

  const renderDatePicker = () => {
    if (!showDatePicker) return null;

    const pickerElement = (
      <DateTimePicker
        value={date}
        mode="date"
        display={Platform.OS === 'ios' ? "spinner" : "default"}
        onChange={handleDateChange}
        minimumDate={today}
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
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 16,
              }}>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <ThemedText style={{ color: colors.textSecondary }}>Cancel</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <ThemedText style={{ color: colors.primary }}>Done</ThemedText>
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
    <ThemedView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Date</ThemedText>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.dateButton}
          >
            <Ionicons 
              name="calendar-outline" 
              size={20} 
              color={colors.textSecondary} 
              style={styles.dateIcon} 
            />
            <ThemedText style={styles.dateText}>
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
          <ThemedText style={styles.sectionTitle}>Select Task</ThemedText>
          {loading ? (
            <View style={baseTheme.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : error ? (
            <View style={baseTheme.errorContainer}>
              <ThemedText style={baseTheme.errorText}>{error}</ThemedText>
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
                  <ThemedText style={styles.taskItemText}>{task.name}</ThemedText>
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
          <ThemedText style={baseTheme.submitButtonText}>Create Schedule</ThemedText>
        </TouchableOpacity>
      </View>

      {renderDatePicker()}
    </ThemedView>
  );
}
