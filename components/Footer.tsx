import * as React from 'react';
import { View, TouchableOpacity, StyleSheet, Modal, Text } from 'react-native';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/Theme';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ADMIN_ROLE } from '../constants/roles';
import { ThemedText } from './ThemedText';
import { useTranslation, useTextDirection } from '../contexts/LanguageContext';
import { getTourText } from '../constants/languages/tour';

type FooterProps = {
  activeTab: 'home' | 'tasks' | 'profile' | 'calendar' | 'tasks/calendar' | 'houses' | 'videos';
};

export function Footer({ activeTab }: FooterProps) {
  const [showModal, setShowModal] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { t, language } = useTranslation();
  const { flexDirection } = useTextDirection();
  
  // Tour state
  const [showTour, setShowTour] = useState(false);
  
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
    
    // Check if the footer tour has been completed
  }, []);
  
  
  

  

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

          <Link href="/houses" asChild>
            <TouchableOpacity style={styles.tab}>
              <Ionicons
                name={activeTab === 'houses' ? 'home' : 'home-outline'}
                size={24}
                color={activeTab === 'houses' ? colors.primary : colors.textSecondary}
              />
            </TouchableOpacity>
          </Link>

          <TouchableOpacity 
            style={[
              styles.addButton,
              showTour && styles.highlightedButton
            ]}
            onPress={() => setShowModal(true)}
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>

          <Link href="/videos" asChild>
            <TouchableOpacity style={styles.tab}>
              <Ionicons
                name={activeTab === 'videos' ? 'videocam' : 'videocam-outline'}
                size={24}
                color={activeTab === 'videos' ? colors.primary : colors.textSecondary}
              />
            </TouchableOpacity>
          </Link>

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
                  style={[styles.modalOption, flexDirection === 'row-reverse' && styles.modalOptionRTL]}
                  onPress={() => {
                    setShowModal(false);
                    router.push({ pathname: '/tasks/add' });
                  }}
                >
                  <Ionicons name="create-outline" size={20} color={colors.primary} />
                  <View style={[styles.optionText, flexDirection === 'row-reverse' && styles.optionTextRTL]}>
                    <View style={styles.textContainer}>
                      <ThemedText type="defaultSemiBold" style={styles.optionTitle}>
                        {t('tasks.add.title')}
                      </ThemedText>
                    </View>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.modalOption, flexDirection === 'row-reverse' && styles.modalOptionRTL]}
                  onPress={() => {
                    setShowModal(false);
                    router.push({ pathname: '/schedules/add' });
                  }}
                >
                  <Ionicons name="calendar-outline" size={20} color={colors.primary} />
                  <View style={[styles.optionText, flexDirection === 'row-reverse' && styles.optionTextRTL]}>
                    <View style={styles.textContainer}>
                      <ThemedText type="defaultSemiBold" style={styles.optionTitle}>
                        {t('schedules.add.title')}
                      </ThemedText>
                    </View>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.modalOption, flexDirection === 'row-reverse' && styles.modalOptionRTL]}
                  onPress={() => {
                    setShowModal(false);
                    router.push({ pathname: '/home/join' });
                  }}
                >
                  <Ionicons name="woman-outline" size={20} color={colors.primary} />
                  <View style={[styles.optionText, flexDirection === 'row-reverse' && styles.optionTextRTL]}>
                    <View style={styles.textContainer}>
                      <ThemedText type="defaultSemiBold" style={styles.optionTitle}>
                        {t('home.join.title')}
                      </ThemedText>
                    </View>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.modalOption, flexDirection === 'row-reverse' && styles.modalOptionRTL]}
                  onPress={() => {
                    setShowModal(false);
                    router.push({ pathname: '/home/invite' });
                  }}
                >
                  <Ionicons name="person-add-outline" size={20} color={colors.primary} />
                  <View style={[styles.optionText, flexDirection === 'row-reverse' && styles.optionTextRTL]}>
                    <View style={styles.textContainer}>
                      <ThemedText type="defaultSemiBold" style={styles.optionTitle}>
                        {t('home.invite.title')}
                      </ThemedText>
                    </View>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.modalOption, flexDirection === 'row-reverse' && styles.modalOptionRTL]}
                  onPress={() => {
                    setShowModal(false);
                    router.push({ pathname: '/houses/add' });
                  }}
                >
                  <Ionicons name="home-outline" size={20} color={colors.primary} />
                  <View style={[styles.optionText, flexDirection === 'row-reverse' && styles.optionTextRTL]}>
                    <View style={styles.textContainer}>
                      <ThemedText type="defaultSemiBold" style={styles.optionTitle}>
                        {t('home.add.title')}
                      </ThemedText>
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
    zIndex: 0,
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
  highlightedButton: {
    borderWidth: 3,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
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
  modalOptionRTL: {
    flexDirection: 'row-reverse',
  },
  optionText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  optionTextRTL: {
    flexDirection: 'row-reverse',
  },
  textContainer: {
    marginHorizontal: 10,
  },
  optionTitle: {
    fontSize: 16,
    color: colors.text,
  },
});
