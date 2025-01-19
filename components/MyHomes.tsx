import React from 'react';
import { View, TouchableOpacity, Image, Dimensions, FlatList, ActivityIndicator } from 'react-native';
import { ThemedText } from './ThemedText';
import { colors } from '../constants/Theme';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../contexts/LanguageContext';
import { myHomesTheme as styles } from '../constants/myHomesTheme';
import { Home } from '../types/Home';
import { Member } from '../types/Member';
import { useHomes } from '../hooks/home/useHomes';

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
  const { t, isRTL } = useTranslation();
  const { homes, isLoading, error, setDefaultHome } = useHomes();

  const handleHomePress = (homeId: string) => {
    setDefaultHome(homeId);
  };

  const renderHomeItem = ({ item }: { item: Home }) => (
    <TouchableOpacity 
      style={[
        styles.homeItem, 
        { width: CARD_WIDTH - 20 },
        item.is_default && styles.activeHomeItem
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
          <View style={[styles.metaItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Ionicons name="calendar-outline" size={12} color={colors.text} />
            <ThemedText style={[styles.metaText, { marginRight: isRTL ? 4 : 0, marginLeft: isRTL ? 0 : 4 }]}>
              {item.date_created}
            </ThemedText>
          </View>
          <View style={[styles.metaItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
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
          </View>
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
    <View style={styles.container}>
      <View style={[styles.sectionHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <ThemedText type="defaultSemiBold" style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
          {t('dashboard.myHomes')}
        </ThemedText>
      </View>
      <FlatList
        data={homes}
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
