import * as React from 'react';
import { View, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/Theme';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ADMIN_ROLE } from '../constants/roles';
import { ThemedText } from './ThemedText';
import { useTranslation } from '../contexts/LanguageContext';

type FooterProps = {
  activeTab: 'home' | 'tasks' | 'profile' | 'calendar' | 'tasks/calendar';
};

export function Footer({ activeTab }: FooterProps) {
  const [showModal, setShowModal] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const userInfoStr = await AsyncStorage.getItem('userInfo');
        if (userInfoStr) {
          const userInfo = JSON.parse(userInfoStr);
          setUserRole(userInfo.role);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };
    fetchUserRole();
  }, []);

  return (
    <View style={styles.footer}>
      {userRole === ADMIN_ROLE ? (
        // Admin Footer
        <>
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
                name={activeTab === 'tasks' ? 'clipboard' : 'clipboard-outline'}
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
                  <Ionicons name="create-outline" size={20} color={colors.primary} />
                  <View style={styles.optionText}>
                    <View style={styles.textContainer}>
                      <ThemedText type="defaultSemiBold" style={styles.optionTitle}>
                        {t('tasks.add.title')}
                      </ThemedText>
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
                  <Ionicons name="calendar-outline" size={20} color={colors.primary} />
                  <View style={styles.optionText}>
                    <View style={styles.textContainer}>
                      <ThemedText type="defaultSemiBold" style={styles.optionTitle}>
                        {t('schedules.add.title')}
                      </ThemedText>
                    </View>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.modalOption}
                  onPress={() => {
                    setShowModal(false);
                    router.push('/home/join');
                  }}
                >
                  <Ionicons name="woman-outline" size={20} color={colors.primary} />
                  <View style={styles.optionText}>
                    <View style={styles.textContainer}>
                      <ThemedText type="defaultSemiBold" style={styles.optionTitle}>
                        {t('home.join.title')}
                      </ThemedText>
                    </View>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.modalOption}
                  onPress={() => {
                    setShowModal(false);
                    router.push('/home/invite');
                  }}
                >
                  <Ionicons name="person-add-outline" size={20} color={colors.primary} />
                  <View style={styles.optionText}>
                    <View style={styles.textContainer}>
                      <ThemedText type="defaultSemiBold" style={styles.optionTitle}>
                        {t('home.invite.title')}
                      </ThemedText>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>
        </>
      ) : (
        // Non-admin Footer
        <>
          <Link href="/tasks/calendar" asChild>
            <TouchableOpacity style={styles.tab}>
              <Ionicons
                name={activeTab === 'tasks/calendar' ? 'calendar' : 'calendar-outline'}
                size={24}
                color={activeTab === 'tasks/calendar' ? colors.primary : colors.textSecondary}
              />
            </TouchableOpacity>
          </Link>

          <Link href="/dashboard" asChild>
            <TouchableOpacity style={styles.tab}>
              <Ionicons
                name={activeTab === 'home' ? 'grid' : 'grid-outline'}
                size={24}
                color={activeTab === 'home' ? colors.primary : colors.textSecondary}
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
        </>
      )}
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
  },
});
