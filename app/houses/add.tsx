import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { Header } from '../../components/Header';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { colors } from '../../constants/Theme';
import { useHomeAdd } from '../../hooks/home/addHook';
import { useTranslation } from '../../contexts/LanguageContext';
import { Footer } from '../../components/Footer';
import { API_HOST } from '../../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeAdd() {
  const { t, isRTL } = useTranslation();
  const { 
    homeName, 
    setHomeName, 
    isSubmitting, 
    handleSubmit, 
    isEditing,
    propertyUsers,
    isDeleting,
    confirmDeleteUser
  } = useHomeAdd();
  
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const userInfoStr = await AsyncStorage.getItem('userInfo');
        if (userInfoStr) {
          const userInfo = JSON.parse(userInfoStr);
          setCurrentUserId(userInfo.id);
        }
      } catch (error) {
        console.error('Error getting current user:', error);
      }
    };
    
    getCurrentUser();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <Header title={isEditing ? t('home.edit.title') : t('home.add.title')} />
      <ScrollView style={styles.content}>
        <View style={[styles.section, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
          <ThemedText style={[styles.label, { textAlign: isRTL ? 'right' : 'left', width: '100%' }]}>
            {t('home.add.name')} *
          </ThemedText>
          <TextInput
            style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
            placeholder={t('home.add.namePlaceholder')}
            placeholderTextColor="rgba(49, 57, 79, 0.6)"
            value={homeName}
            onChangeText={setHomeName}
          />
        </View>

        {isEditing && (
          <View style={styles.section}>
            <ThemedText style={[styles.label, { textAlign: isRTL ? 'right' : 'left', width: '100%' }]}>
              {t('home.users.title')}
            </ThemedText>
            
            {propertyUsers.length === 0 ? (
              <ThemedText style={styles.noUsers}>
                {t('home.users.noUsers')}
              </ThemedText>
            ) : (
              propertyUsers.map((user) => (
                <View key={user.id} style={styles.userRow}>
                  <View style={styles.userInfo}>
                    {user.avatar ? (
                      <Image 
                        source={{ uri: `${API_HOST}/assets/${user.avatar}` }} 
                        style={styles.userAvatar} 
                      />
                    ) : (
                      <View style={styles.userAvatarPlaceholder}>
                        <ThemedText style={styles.userAvatarText}>
                          {user.first_name.charAt(0).toUpperCase()}
                        </ThemedText>
                      </View>
                    )}
                    <ThemedText style={styles.userName}>
                      {user.first_name} {user.last_name || ''}
                      {currentUserId !== user.id && (
                        <ThemedText style={styles.adminLabel}> {currentUserId}({t('common.admin')})</ThemedText>
                      )}
                    </ThemedText>
                  </View>
                  {/* Don't show delete button if it's the current user */}
                  {currentUserId !== user.id && (
                    <TouchableOpacity 
                      style={styles.deleteButton}
                      onPress={() => confirmDeleteUser(user.id, `${user.first_name} ${user.last_name || ''}`)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <ThemedText style={styles.deleteButtonText}>
                          {t('common.buttons.delete')}
                        </ThemedText>
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              ))
            )}
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
            {isSubmitting 
              ? t('common.loading')
              : isEditing 
                ? t('home.edit.updateHome')
                : t('home.add.createHome')
            }
          </ThemedText>
        </TouchableOpacity>
      </View>

      <Footer activeTab="houses" />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.line,
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
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  userAvatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  deleteButton: {
    backgroundColor: colors.danger,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginLeft: 10,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 14,
  },
  noUsers: {
    fontStyle: 'italic',
    color: colors.textSecondary,
    marginTop: 10,
  },
  adminLabel: {
    fontWeight: 'bold',
    color: colors.primary,
  },
});
