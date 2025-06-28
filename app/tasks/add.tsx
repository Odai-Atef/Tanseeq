import React from 'react';
import { View, TextInput, TouchableOpacity, ScrollView, Platform, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams } from 'expo-router';
import { Header } from '../../components/Header';
import { Ionicons, Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { colors, taskTheme as styles } from '../../constants/Theme';
import { useTaskAdd } from '../../hooks/tasks/addHook';
import { useTranslation } from '../../contexts/LanguageContext';

const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

const getPeriodKey = (period: string): string => {
  switch (period) {
    case 'Manual Assignment (No Schedule)':
      return 'manual';
    case 'Every Day':
      return 'daily';
    case 'Weekly':
      return 'weekly';
    case 'Bi Weekly':
      return 'biWeekly';
    case 'Monthly':
      return 'monthly';
    case 'Every 3 Months':
      return 'quarterly';
    case 'Every 6 Months':
      return 'biAnnually';
    case 'Annually':
      return 'annually';
    default:
      return period.toLowerCase();
  }
};

export default function TaskAdd() {
  const params = useLocalSearchParams();
  const id = params.id as string | undefined;
  const { t, isRTL } = useTranslation();

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
        <ThemedText>{t('common.loading')}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.ios_boarder, styles.container]}>
      <Header title={id ? t('tasks.edit.title') : t('tasks.add.title')} />
      <ScrollView style={styles.content}>
        <View style={[styles.section, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
          <ThemedText style={[styles.label, { textAlign: isRTL ? 'right' : 'left', width: '100%' }]}>
            {t('tasks.add.name')} *
          </ThemedText>
          <TextInput
            style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
            placeholder={t('tasks.add.namePlaceholder')}
            placeholderTextColor="rgba(49, 57, 79, 0.6)"
            value={task.name}
            onChangeText={name => updateTaskField('name', name)}
          />
        </View>
        <View style={[styles.section, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
          <ThemedText style={[styles.label, { textAlign: isRTL ? 'right' : 'left', width: '100%' }]}>
            {t('tasks.add.schedule')} *
          </ThemedText>
          <TouchableOpacity 
            style={[styles.input, { paddingHorizontal: 10 }]}
            onPress={() => setShowPicker(true)}
          >
            <ThemedText style={[{ color: colors.textPrimary, fontSize: 16, textAlign: isRTL ? 'right' : 'left' }]}>
              {periods.find(p => periodValues[p] === task.repeat_monthly) 
                ? t(`tasks.add.periods.${getPeriodKey(periods.find(p => periodValues[p] === task.repeat_monthly) || '')}`)
                : t('tasks.add.schedule')}
            </ThemedText>
          </TouchableOpacity>
        </View>

        {task.repeat_monthly !== periodValues['Every Day'] && task.repeat_monthly !== periodValues['Manual Assignment (No Schedule)'] && (
          <View style={[styles.section, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
            <ThemedText style={[styles.label, { textAlign: isRTL ? 'right' : 'left', width: '100%' }]}>
              {t('tasks.add.scheduleDays')} *
            </ThemedText>
            <View style={[styles.radioGroup, { flexDirection: 'column',width:'100%'}]}>
              {DAYS.map((day, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.checkboxContainer,
                    task.repeatsOnDay((index + 1).toString()) && styles.checkboxActive,
                    { flexDirection: isRTL ? 'row-reverse' : 'row',  width: '100%' }
                  ]}
                  onPress={() => toggleDaySelection((index + 1).toString())}
                >
                  <View style={[
                    styles.checkbox,
                    task.repeatsOnDay((index + 1).toString()) && styles.checkboxChecked
                  ]} />
                  <ThemedText style={styles.checkboxText}>
                    {t(`tasks.add.days.${day}`)}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
        <View style={[styles.section, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
          <ThemedText style={[styles.label, { textAlign: isRTL ? 'right' : 'left', width: '100%' }]}>
            {t('tasks.add.description')}
          </ThemedText>
          <TextInput
            style={[styles.input, styles.textArea, { textAlign: isRTL ? 'right' : 'left' }]}
            placeholder={t('tasks.add.descriptionPlaceholder')}
            placeholderTextColor="rgba(49, 57, 79, 0.6)"
            multiline
            numberOfLines={4}
            value={task.description || ''}
            onChangeText={description => updateTaskField('description', description)}
          />
        </View>

        <View style={[styles.section, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
          <ThemedText style={[styles.label, { textAlign: isRTL ? 'right' : 'left', width: '100%' }]}>
            {t('tasks.add.images')}
          </ThemedText>
          <View style={[styles.imageButtonsContainer, { width:"100%",flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <TouchableOpacity 
              style={[styles.uploadButton,{flexDirection: isRTL ? 'row' : 'row-reverse'}]} 
              onPress={pickImage}
            >
              <ThemedText style={styles.uploadText}>{t('tasks.add.chooseImage')}</ThemedText>
              <Feather name="image" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.uploadButton,{flexDirection: isRTL ? 'row' : 'row-reverse'}]} 
              onPress={takePhoto}>
              <ThemedText style={styles.uploadText}>{t('tasks.add.takePhoto')}</ThemedText>
              <Feather name="camera" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
          {selectedImage && (
            <View style={[styles.imagePreview, { width: '100%', height: 200 }]}>
              <Image 
                source={{ uri: selectedImage }} 
                style={[styles.previewImage, { width: '100%', height: '100%' }]} 
                resizeMode="cover"
              />
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
            {isSubmitting 
              ? t('common.loading')
              : id 
                ? t('common.buttons.update')
                : t('common.buttons.create')
            }
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
              label={t(`tasks.add.periods.${getPeriodKey(period)}`)}
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
          display={Platform.OS === 'ios' ? "spinner" : "default"}
          onChange={handleStartDateChange}
        />
      )}
    </ThemedView>
  );
}
