import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { ThemedText } from './ThemedText';
import { colors } from '../constants/Theme';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../contexts/LanguageContext';
import { Home } from '../types/Home';
import { Member } from '../types/Member';
import { router } from 'expo-router';

const MemberAvatar = ({ member, index, isRTL }: { member: Member; index: number; isRTL: boolean }) => (
  <View 
    style={[
      styles.memberAvatar, 
      { marginLeft: isRTL ? 0 : (index > 0 ? -10 : 0),
        marginRight: isRTL ? (index > 0 ? -10 : 0) : 0 }
    ]}
  >
    <Image 
      source={member.avatar ? { uri: member.avatar } : require('../assets/images/avt4.jpg')} 
      style={styles.avatarImage}
    />
  </View>
);

interface HomeItemProps {
  home: Home;
  onPress: (homeId: string) => void;
  inHousesList?: boolean;
}

export const HomeItem = ({ home, onPress, inHousesList = false }: HomeItemProps) => {
  const { t, isRTL } = useTranslation();

  const handleSetDefault = () => {
    onPress(home.id);
  };

  const handleEdit = () => {
    router.push({
      pathname: '/houses/add',
      params: { id: home.id }
    });
  };

  return (
    <TouchableOpacity 
      style={[
        styles.homeItem,
        home.is_default && styles.activeHomeItem,
      ]}
      onPress={() => inHousesList ? handleEdit() : handleSetDefault()}
    >
      <View style={styles.top}>
        <View style={[styles.headerRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <View style={styles.iconBox}>
            <Ionicons name="home-outline" size={18} color={colors.primary} />
          </View>
          <ThemedText type="defaultSemiBold" style={[styles.title, { textAlign: isRTL ? 'right' : 'left' }]}>
            {home.name}
          </ThemedText>
          
          {inHousesList && (
            <TouchableWithoutFeedback onPress={handleSetDefault}>
              <View style={styles.actionButton}>
                <Ionicons 
                  name={home.is_default ? "star" : "star-outline"} 
                  size={18} 
                  color={home.is_default ? colors.primary : colors.textSecondary} 
                />
                <ThemedText style={styles.actionText}>
                  {home.is_default ? t('common.default') : t('common.setDefault')}
                </ThemedText>
              </View>
            </TouchableWithoutFeedback>
          )}
        </View>
      </View>

      <View style={[styles.bottom, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <View style={[styles.membersList, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          {home.property_users.map((member, index) => (
            <MemberAvatar key={member.id} member={member} index={index} isRTL={isRTL} />
          ))}
        </View>
        <View style={[styles.progressContainer, { marginLeft: isRTL ? 0 : 15, marginRight: isRTL ? 15 : 0 }]}>
          <View style={[styles.progressHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <ThemedText style={[styles.progressLabel, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t('common.progress')}
            </ThemedText>
            <ThemedText style={styles.progressValue}>{home.progress}%</ThemedText>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${home.progress}%` }]} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  homeItem: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: '100%',
  },
  activeHomeItem: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  top: {
    marginBottom: 15,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    flex: 1,
  },
  metaList: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  metaText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  membersList: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: colors.white,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  progressContainer: {
    flex: 1,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  progressLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  progressValue: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.lightGray,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: colors.background,
  },
  actionText: {
    fontSize: 10,
    marginLeft: 4,
    color: colors.textSecondary,
  },
});
