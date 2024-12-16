import { View, TouchableOpacity, StyleSheet, Modal, Text } from 'react-native';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/Theme';
import { useState } from 'react';

type FooterProps = {
  activeTab: 'home' | 'tasks' | 'profile' | 'calendar' | 'tasks/calendar';
};

export function Footer({ activeTab }: FooterProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <View style={styles.footer}>
      <Link href="/dashboard" asChild>
        <TouchableOpacity style={styles.tab}>
          <Ionicons
            name={activeTab === 'home' ? 'grid' : 'grid-outline'}
            size={24}
            color={activeTab === 'home' ? colors.primary : colors.textSecondary}
          />
        </TouchableOpacity>
      </Link>

     
      <Link href="/tasks/calendar" asChild>
        <TouchableOpacity style={styles.tab}>
          <Ionicons
            name={activeTab === 'tasks/calendar' ? 'calendar' : 'calendar-outline'}
            size={24}
            color={activeTab === 'tasks/calendar' ? colors.primary : colors.textSecondary}
          />
        </TouchableOpacity>
      </Link>

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setShowModal(true)}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>

      <Link href="/tasks" asChild>
        <TouchableOpacity style={styles.tab}>
          <Ionicons
            name={activeTab === 'tasks' ? 'checkmark' : 'checkmark-outline'}
            size={24}
            color={activeTab === 'tasks' ? colors.primary : colors.textSecondary}
          />
        </TouchableOpacity>
      </Link>

      <Link href="/profile" asChild>
        <TouchableOpacity style={styles.tab}>
          <Ionicons
            name={activeTab === 'profile' ? 'person' : 'person-outline'}
            size={24}
            color={activeTab === 'profile' ? colors.primary : colors.textSecondary}
          />
        </TouchableOpacity>
      </Link>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowModal(false)}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.modalOption}
              onPress={() => {
                setShowModal(false);
                router.push('/tasks/add');
              }}
            >
              <Ionicons name="add-circle-outline" size={24} color={colors.primary} />
              <View style={styles.optionText}>
                <Ionicons name="create-outline" size={24} color={colors.primary} />
                <View style={styles.textContainer}>
                  <Text style={styles.optionTitle}>Create a Task</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.modalOption}
              onPress={() => {
                setShowModal(false);
                router.push('/schedules/add');
              }}
            >
              <Ionicons name="time-outline" size={24} color={colors.primary} />
              <View style={styles.optionText}>
                <Ionicons name="calendar-outline" size={24} color={colors.primary} />
                <View style={styles.textContainer}>
                  <Text style={styles.optionTitle}>Schedule current task</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  tab: {
    padding: 10,
  },
  addButton: {
    backgroundColor: colors.primary,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -30,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  optionText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
  textContainer: {
    marginLeft: 10,
  },
  optionTitle: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
});
