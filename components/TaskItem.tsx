import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { taskItemTheme as styles } from '../constants/taskItemTheme';
import { Schedule } from '../types/Schedule';
import { Task } from '../types/Task';

interface MenuProps {
  visible: boolean;
  onClose: () => void;
  onView: () => void;
}

const OptionsMenu = ({ visible, onClose, onView }: MenuProps) => (
  <Modal
    transparent
    visible={visible}
    onRequestClose={onClose}
    animationType="fade"
  >
    <Pressable 
      style={styles.modalOverlay}
      onPress={onClose}
    >
      <View style={styles.menuContainer}>
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => {
            onView();
            onClose();
          }}
        >
          <Ionicons name="eye-outline" size={20} color="#464D61" style={styles.menuIcon} />
          <Text style={styles.menuText}>View</Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  </Modal>
);

interface TaskItemProps {
  item: Schedule | Task;
  type: 'schedule' | 'task';
}

export const TaskItem = ({ item, type }: TaskItemProps) => {
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
    return item.getFormattedCreatedDate();
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

  return (
    <View style={styles.taskItem}>
      <View style={styles.taskHeader}>
        <Text style={styles.taskTitle}>{getTitle()}</Text>
        <TouchableOpacity 
          onPress={() => setMenuVisible(true)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="ellipsis-vertical" size={20} color="#464D61" />
        </TouchableOpacity>
      </View>
      <Text style={styles.taskDescription}>{getDescription()}</Text>
      <View style={styles.taskFooter}>
        <Text style={styles.taskTime}>{getTimeInfo()}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatus() === 'Done' ? '#E8F5E9' : '#E3F2FD' }]}>
          <Text style={[styles.statusText, { color: getStatus() === 'Done' ? '#4CAF50' : '#2196F3' }]}>
            {getStatus()}
          </Text>
        </View>
      </View>
      <OptionsMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onView={handleView}
      />
    </View>
  );
};
