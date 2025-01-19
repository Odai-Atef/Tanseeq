import React, { useState } from 'react';
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

const OptionsMenu = ({ visible, onClose, onView, onEdit }: MenuProps) => {
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

  const getTimeInfo = () => {
    if (isSchedule(item)) {
      return `${item.getFormattedStartTime()} - ${item.getFormattedEndTime()}`;
    }
    return item.getRepeatFormat();
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
          <ThemedText type="defaultSemiBold" style={[styles.taskTitle, { marginLeft: isRTL ? 8 : 0, marginRight: isRTL ? 0 : 8 }]}>{getTitle()}</ThemedText>
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
            />
          </View>
        </View>
        <ThemedText style={styles.taskDescription}>{getDescription()}</ThemedText>
        <View style={[styles.taskFooter, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <ThemedText style={styles.taskTime}>{getTimeInfo()}</ThemedText>
          <View style={[styles.statusBadge, { backgroundColor: getStatus() === 'Done' ? '#E8F5E9' : '#E3F2FD' }]}>
            <ThemedText style={[styles.statusText, { color: getStatus() === 'Done' ? '#4CAF50' : '#2196F3' }]}>
              {getStatus()}
            </ThemedText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
