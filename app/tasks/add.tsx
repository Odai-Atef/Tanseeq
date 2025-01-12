import React from 'react';
import { View, TextInput, TouchableOpacity, ScrollView, Platform, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { colors, taskTheme as styles } from '../../constants/Theme';
import { useTaskAdd } from '../../hooks/tasks/addHook';

export default function TaskAdd() {
  const params = useLocalSearchParams();
  const id = params.id as string | undefined;
  const {
    task,
    startDate,
    showStartPicker,
    isSubmitting,
    isLoading,
    selectedImage,
    showPicker,
    periodValues,
    periods,
    setShowStartPicker,
    setShowPicker,
    handleStartDateChange,
    toggleDaySelection,
    updateTaskField,
    pickImage,
    takePhoto,
    handleSubmit,
    setSelectedImage
  } = useTaskAdd(id);

  if (isLoading) {
    return (
      <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <ThemedText style={styles.label}>Title *</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="Task name"
            placeholderTextColor="rgba(49, 57, 79, 0.6)"
            value={task.name}
            onChangeText={name => updateTaskField('name', name)}
          />
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.label}>Description</ThemedText>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Write your description"
            placeholderTextColor="rgba(49, 57, 79, 0.6)"
            multiline
            numberOfLines={4}
            value={task.description || ''}
            onChangeText={description => updateTaskField('description', description)}
          />
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.label}>Images (Optional)</ThemedText>
          <View style={styles.imageButtonsContainer}>
            <TouchableOpacity style={[styles.uploadButton, { marginRight: 10 }]} onPress={pickImage}>
              <Feather name="image" size={24} color={colors.textPrimary} />
              <ThemedText style={styles.uploadText}>Choose Image</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.uploadButton} onPress={takePhoto}>
              <Feather name="camera" size={24} color={colors.textPrimary} />
              <ThemedText style={styles.uploadText}>Take Photo</ThemedText>
            </TouchableOpacity>
          </View>
          {selectedImage && (
            <View style={styles.imagePreview}>
              <Image source={{ uri: selectedImage }} style={styles.previewImage} />
              <TouchableOpacity 
                style={styles.removeImageButton}
                onPress={() => {
                  setSelectedImage(null);
                  updateTaskField('images', null);
                }}
              >
                <Ionicons name="close-circle" size={24} color={colors.danger} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.label}>Select Recurrence Schedule *</ThemedText>
          <TouchableOpacity 
            style={[styles.input, { paddingHorizontal: 10 }]}
            onPress={() => setShowPicker(true)}
          >
            <ThemedText style={{ color: colors.textPrimary, fontSize: 16 }}>
              {periods.find(p => periodValues[p] === task.repeat_monthly) || 'Select Schedule'}
            </ThemedText>
          </TouchableOpacity>
        </View>

        {task.repeat_monthly !== periodValues['Every Day'] && task.repeat_monthly !== periodValues['Manual Assignment (No Schedule)'] && (
          <View style={styles.section}>
            <ThemedText style={styles.label}>Select Scheduled Days *</ThemedText>
            <View style={styles.radioGroup}>
            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.checkboxContainer,
                  task.repeatsOnDay((index + 1).toString()) && styles.checkboxActive
                ]}
                onPress={() => toggleDaySelection((index + 1).toString())}
              >
                <View style={[
                  styles.checkbox,
                  task.repeatsOnDay((index + 1).toString()) && styles.checkboxChecked
                ]} />
                <ThemedText style={styles.checkboxText}>{day}</ThemedText>
              </TouchableOpacity>
            ))}
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[
            styles.submitButton,
            isSubmitting && { opacity: 0.5 }
          ]} 
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <ThemedText style={styles.submitButtonText}>
            {isSubmitting ? 'Submitting...' : id ? 'Update' : 'Create'}
          </ThemedText>
        </TouchableOpacity>
      </View>

      {showPicker && (
        <Picker
          selectedValue={task.repeat_monthly}
          onValueChange={(itemValue: string) => {
            updateTaskField('repeat_monthly', itemValue);
            setShowPicker(false);
          }}
          style={{ 
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: colors.background
          }}
        >
          {periods.map((period) => (
            <Picker.Item 
              key={period} 
              label={period} 
              value={periodValues[period]}
              color={colors.textPrimary}
            />
          ))}
        </Picker>
      )}

      {showStartPicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleStartDateChange}
        />
      )}
    </ThemedView>
  );
}
