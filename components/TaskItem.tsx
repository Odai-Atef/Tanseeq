import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, TouchableOpacity, Pressable } from 'react-native';
import { ThemedText } from './ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { taskItemTheme as styles } from '../constants/taskItemTheme';
import { Schedule } from '../types/Schedule';
import { Task } from '../types/Task';
import { useTranslation } from '../contexts/LanguageContext';

interface MenuProps {
  visible: boolean;
  onClose: () => void;
  onView: () => void;
  onEdit: () => void;
}

const OptionsMenu = ({ visible, onClose, onView, onEdit, showEdit }: MenuProps & { showEdit: boolean }) => {
  const { t, isRTL } = useTranslation();
  
  if (!visible) return null;

  return (
    <>
      <Pressable 
        style={styles.fullScreenOverlay}
        onPress={onClose}
      />
      <View style={[styles.menuContainer, { [isRTL ? 'left' : 'right']: 10 }]}>
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => {
            onView();
            onClose();
          }}
        >
          <View style={[styles.menuItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Ionicons name="eye-outline" size={20} color="#464D61" style={[styles.menuIcon, { marginLeft: isRTL ? 6 : 0, marginRight: isRTL ? 0 : 6 }]} />
            <ThemedText style={styles.menuText}>{t('common.buttons.viewAll')}</ThemedText>
          </View>
        </TouchableOpacity>
        {showEdit && (
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => {
              onEdit();
              onClose();
            }}
          >
            <View style={[styles.menuItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Ionicons name="pencil-outline" size={20} color="#464D61" style={[styles.menuIcon, { marginLeft: isRTL ? 6 : 0, marginRight: isRTL ? 0 : 6 }]} />
              <ThemedText style={styles.menuText}>{t('common.buttons.edit')}</ThemedText>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
};

interface TaskItemProps {
  item: Schedule | Task;
  type: 'schedule' | 'task';
}

export const TaskItem = ({ item, type }: TaskItemProps) => {
  const { isRTL } = useTranslation();
  const [menuVisible, setMenuVisible] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    const checkUserPermission = async () => {
      try {
        const userInfoStr = await AsyncStorage.getItem('userInfo');
        if (userInfoStr) {
          const userInfo = JSON.parse(userInfoStr);
          // Only show edit if it's a task and user created it
          if (!isSchedule(item)) {
            setShowEdit(userInfo.id === item.user_created);
          }
        }
      } catch (error) {
        console.error('Error checking user permission:', error);
      }
    };

    checkUserPermission();
  }, [item]);

  const isSchedule = (item: Schedule | Task): item is Schedule => {
    return 'task' in item;
  };

  const getTitle = () => {
    if (isSchedule(item)) {
      return item.task.name;
    }
    return item.name;
  };

  const getDescription = () => {
    if (isSchedule(item)) {
      return item.task.description;
    }
    return item.description;
  };

  const { t } = useTranslation();
  
  const getTimeInfo = () => {
    if (isSchedule(item)) {
      return `${item.getFormattedStartTime()} - ${item.getFormattedEndTime()}`;
    }
    return item.getRepeatFormat(t);
  };

  const getStatus = () => {
    return item.status;
  };

  const handleView = () => {
    if (isSchedule(item)) {
      router.push(`/schedules/view?id=${item.id}`);
    } else {
      router.push(`/tasks/view?id=${item.id}`);
    }
  };

  const handleEdit = () => {
    if (isSchedule(item)) {
      router.push(`/schedules/add?id=${item.id}`);
    } else {
      router.push(`/tasks/add?id=${item.id}`);
    }
  };

  return (
    <TouchableOpacity onPress={handleView}>
      <View style={styles.taskItem}>
        <View style={[styles.taskHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          {isRTL ? (
            <>
              <ThemedText type="defaultSemiBold" style={[styles.taskTitle, { marginRight: 8, textAlign: 'right' }]}>
                {getTitle()}
              </ThemedText>
              <View style={styles.menuWrapper}>
                <TouchableOpacity 
                  onPress={() => setMenuVisible(!menuVisible)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="ellipsis-vertical" size={20} color="#464D61" />
                </TouchableOpacity>
                <OptionsMenu
                  visible={menuVisible}
                  onClose={() => setMenuVisible(false)}
                  onView={handleView}
                  onEdit={handleEdit}
                  showEdit={showEdit}
                />
              </View>
            </>
          ) : (
            <>
              <View style={styles.menuWrapper}>
                <TouchableOpacity 
                  onPress={() => setMenuVisible(!menuVisible)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="ellipsis-vertical" size={20} color="#464D61" />
                </TouchableOpacity>
                <OptionsMenu
                  visible={menuVisible}
                  onClose={() => setMenuVisible(false)}
                  onView={handleView}
                  onEdit={handleEdit}
                  showEdit={showEdit}
                />
              </View>
              <ThemedText type="defaultSemiBold" style={[styles.taskTitle, { marginLeft: 8, textAlign: 'left' }]}>
                {getTitle()}
              </ThemedText>
            </>
          )}
        </View>
        <ThemedText style={[styles.taskDescription, { textAlign: isRTL ? 'right' : 'left' }]}>
          {getDescription()}
        </ThemedText>
        <View style={[styles.taskFooter, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <ThemedText style={[styles.taskTime, { textAlign: isRTL ? 'right' : 'left' }]}>
            {getTimeInfo()}
          </ThemedText>
          <View style={[
            styles.statusBadge, 
            { 
              backgroundColor: getStatus() === 'Done' ? '#E8F5E9' : '#E3F2FD',
              alignSelf: isRTL ? 'flex-start' : 'flex-end'
            }
          ]}>
            <ThemedText style={[styles.statusText, { color: getStatus() === 'Done' ? '#4CAF50' : '#2196F3' }]}>
              {getStatus()}
            </ThemedText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
