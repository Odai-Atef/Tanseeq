import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Image, Dimensions, FlatList, ActivityIndicator, Modal, Text, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
import { colors } from '../constants/Theme';
import { Ionicons } from '@expo/vector-icons';
import { HomeItem } from './HomeItem';
import { useTranslation } from '../contexts/LanguageContext';
import { myHomesTheme as styles } from '../constants/myHomesTheme';
import { Home } from '../types/Home';
import { Member } from '../types/Member';
import { useHomes } from '../hooks/home/useHomes';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.75; // 75% of screen width

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

export const MyHomes = () => {
  const { t, isRTL, language } = useTranslation();
  const { homes, isLoading, error, setDefaultHome } = useHomes();
  
  // Tour state
  const [showTour, setShowTour] = useState(false);
  
  useEffect(() => {
    // Check if the homes tour has been completed
  }, []);



  const handleHomePress = (homeId: string) => {
    setDefaultHome(homeId);
  };

  const renderHomeItem = ({ item }: { item: Home }) => (
    <View style={{ width: CARD_WIDTH - 20 }}>
      <HomeItem 
        home={item} 
        onPress={handleHomePress}
        inHousesList={false}
      />
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      </View>
    );
  }

  return (
    <View style={[styles.container, showTour && tourStyles.highlightedContainer]}>
      <View style={[styles.sectionHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <ThemedText type="defaultSemiBold" style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
          {t('dashboard.myHomes')}
        </ThemedText>
      </View>
      <FlatList
        data={[...homes].sort((a, b) => {
          if (a.is_default && !b.is_default) return -1;
          if (!a.is_default && b.is_default) return 1;
          return 0;
        })}
        renderItem={renderHomeItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: 0,marginBottom:25 }}
        ItemSeparatorComponent={() => <View style={{ width: 20 }} />}
        inverted={isRTL} // Reverse the list direction for RTL
      />
    
    </View>
  );
};

const tourStyles = StyleSheet.create({
  highlightedContainer: {
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 10,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
    padding: 5,
  },
  highlightedItem: {
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tooltipContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  tooltipText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 20,
    textAlign: 'left',
    fontFamily: 'Cairo',
  },
  tooltipTextRTL: {
    textAlign: 'right',
  },
  nextButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Cairo',
  },
});
