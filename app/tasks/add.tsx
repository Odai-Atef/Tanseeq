import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, ScrollView, Platform, Image, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams } from 'expo-router';
import { Header } from '../../components/Header';
import { Ionicons, Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { colors } from '../../constants/Theme';
import { StyleSheet } from 'react-native';
import { useTaskAdd } from '../../hooks/tasks/addHook';
import { useTranslation } from '../../contexts/LanguageContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

// Define styles locally to add the missing styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  ios_boarder: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: colors.textPrimary,
  },
  input: {
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.textPrimary,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.line,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  radioGroup: {
    marginTop: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  checkboxActive: {
    backgroundColor: `${colors.primary}20`,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.primary,
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
  },
  checkboxText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  imageButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    padding: 12,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: 'center',
  },
  uploadText: {
    marginHorizontal: 8,
    color: colors.textPrimary,
  },
  imagePreview: {
    marginTop: 16,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  previewImage: {
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 15,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  footerButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: colors.danger,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    width: 100,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default function TaskAdd() {
  const params = useLocalSearchParams();
  const id = params.id as string | undefined;
  const { t, isRTL } = useTranslation();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [canDelete, setCanDelete] = useState(false);

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
    setSelectedImage,
    deleteTask
  } = useTaskAdd(id);
  
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const userInfoStr = await AsyncStorage.getItem('userInfo');
        if (userInfoStr) {
          const userInfo = JSON.parse(userInfoStr);
          setCurrentUserId(userInfo.id);
          
          // Check if user can delete this task
          if (id && task) {
            setCanDelete(
              userInfo.id === task.user_created || 
              userInfo.id === task.property_id
            );
          }
        }
      } catch (error) {
        console.error('Error getting current user:', error);
      }
    };
    
    getCurrentUser();
  }, [id, task]);
  
  const confirmDelete = () => {
    Alert.alert(
      t('tasks.delete.title'),
      t('tasks.delete.message'),
      [
        {
          text: t('common.buttons.cancel'),
          style: 'cancel'
        },
        {
          text: t('common.buttons.delete'),
          onPress: deleteTask,
          style: 'destructive'
        }
      ]
    );
  };

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
        <View style={styles.footerButtonsContainer}>
          {id && canDelete && (
            <TouchableOpacity 
              style={[
                styles.deleteButton,
                isSubmitting && { opacity: 0.5 }
              ]} 
              onPress={confirmDelete}
              disabled={isSubmitting}
            >
              <ThemedText style={styles.deleteButtonText}>
                {t('common.buttons.delete')}
              </ThemedText>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[
              styles.submitButton,
              isSubmitting && { opacity: 0.5 },
              id && canDelete ? { flex: 1 } : { width: '100%' }
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
