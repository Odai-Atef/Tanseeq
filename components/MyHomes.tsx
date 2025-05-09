import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Image, Dimensions, FlatList, ActivityIndicator, Modal, Text, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
import { colors } from '../constants/Theme';
import { Ionicons } from '@expo/vector-icons';
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
    checkTourStatus();
  }, []);
  
  const checkTourStatus = async () => {
    try {
      const completedTours = await AsyncStorage.getItem('completed_tours');
      const tours = completedTours ? JSON.parse(completedTours) : [];
      
      if (!tours.includes('homes')) {
        // Start tour after a short delay
        setTimeout(() => {
          setShowTour(true);
        }, 3000); // Delay a bit more to not conflict with dashboard tour
      }
    } catch (error) {
      console.error('Error checking tour status:', error);
    }
  };
  
  const completeTour = async () => {
    try {
      const completedTours = await AsyncStorage.getItem('completed_tours');
      let tours = completedTours ? JSON.parse(completedTours) : [];
      
      if (!tours.includes('homes')) {
        tours.push('homes');
        await AsyncStorage.setItem('completed_tours', JSON.stringify(tours));
      }
      
      setShowTour(false);
    } catch (error) {
      console.error('Error completing tour:', error);
    }
  };
  
  const getTourText = () => {
    return language === 'ar' 
      ? "لكل مستخدم منزله الخاص. يمكنك دعوة الآخرين إلى منزلك أو الانضمام إلى منزل شخص آخر. انقر على منزل لتعيينه كمنزلك الافتراضي."
      : "Each user has their own home. You can invite others to your home or join someone else's home. Click on a home to set it as your default.";
  };

  const handleHomePress = (homeId: string) => {
    setDefaultHome(homeId);
  };

  const renderHomeItem = ({ item }: { item: Home }) => (
    <TouchableOpacity 
      style={[
        styles.homeItem, 
        { width: CARD_WIDTH - 20 },
        item.is_default && styles.activeHomeItem,
        showTour && item.is_default && tourStyles.highlightedItem
      ]}
      onPress={() => handleHomePress(item.id)}
    >
      <View style={styles.top}>
        <View style={[styles.headerRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <View style={styles.iconBox}>
            <Ionicons name="home-outline" size={18} color={colors.primary} />
          </View>
          <ThemedText type="defaultSemiBold" style={[styles.title, { textAlign: isRTL ? 'right' : 'left' }]}>
            {item.name}
          </ThemedText>
        </View>
        <View style={[styles.metaList, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          {/* <View style={[styles.metaItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Ionicons name="list-outline" size={12} color={colors.text} />
            <ThemedText style={[styles.metaText, { marginRight: isRTL ? 4 : 0, marginLeft: isRTL ? 0 : 4 }]}>
              {item.tasks}
            </ThemedText>
          </View>
          <View style={[styles.metaItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Ionicons name="link-outline" size={12} color={colors.text} />
            <ThemedText style={[styles.metaText, { marginRight: isRTL ? 4 : 0, marginLeft: isRTL ? 0 : 4 }]}>
              {item.links}
            </ThemedText>
          </View> */}
        </View>
      </View>

      <View style={[styles.bottom, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <View style={[styles.membersList, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          {item.property_users.map((member, index) => (
            <MemberAvatar key={member.id} member={member} index={index} isRTL={isRTL} />
          ))}
        </View>
        <View style={[styles.progressContainer, { marginLeft: isRTL ? 0 : 15, marginRight: isRTL ? 15 : 0 }]}>
          <View style={[styles.progressHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <ThemedText style={[styles.progressLabel, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t('common.progress')}
            </ThemedText>
            <ThemedText style={styles.progressValue}>{item.progress}%</ThemedText>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${item.progress}%` }]} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
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
      
      {/* Tour Modal */}
      {showTour && (
        <Modal
          transparent={true}
          visible={showTour}
          animationType="fade"
        >
          <View style={tourStyles.modalOverlay}>
            <View style={tourStyles.tooltipContainer}>
              <Text style={[
                tourStyles.tooltipText,
                language === 'ar' && tourStyles.tooltipTextRTL
              ]}>
                {getTourText()}
              </Text>
              <TouchableOpacity 
                style={tourStyles.nextButton}
                onPress={completeTour}
              >
                <Text style={tourStyles.nextButtonText}>
                  {language === 'ar' ? 'فهمت' : 'Got it'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
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
