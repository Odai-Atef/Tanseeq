import React, { useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  SafeAreaView,
  Image
} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { useTranslation, useTextDirection } from '../contexts/LanguageContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../constants/Theme';

// Key to store in AsyncStorage to track if intro has been shown
const INTRO_SHOWN_KEY = 'app_intro_shown';

interface Slide {
  key: string;
  title: string;
  text: string;
  backgroundColor: string;
  image: any;
}

interface AppIntroProps {
  onDone: () => void;
}

export const AppIntro: React.FC<AppIntroProps> = ({ onDone }) => {
  const { t, isRTL } = useTranslation();
  const { textAlign, flexDirection } = useTextDirection();
  const sliderRef = useRef<AppIntroSlider>(null);

  // Define slides based on translations
  const slides: Slide[] = [
    {
      key: 'slide1',
      title: t('intro.slide1.title'),
      text: t('intro.slide1.description'),
      backgroundColor: colors.primary,
      image: require('../assets/images/house_keeping.png'),
    },
    {
      key: 'slide2',
      title: t('intro.slide2.title'),
      text: t('intro.slide2.description'),
      backgroundColor: colors.secondary,
      image: require('../assets/images/plan.png'),
    },
    {
      key: 'slide3',
      title: t('intro.slide3.title'),
      text: t('intro.slide3.description'),
      backgroundColor: colors.primary,
      image: require('../assets/images/family.png'),
    },
  ];

  const handleDone = async () => {
    try {
      // Mark intro as shown in AsyncStorage
      await AsyncStorage.setItem(INTRO_SHOWN_KEY, 'true');
      // Call the onDone callback
      onDone();
    } catch (error) {
      console.error('Error saving intro state:', error);
      onDone(); // Still call onDone even if saving fails
    }
  };

  const renderItem = ({ item }: { item: Slide }) => {
    return (
      <View style={[styles.slide]}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.imageContainer}>
            <Image source={item.image} style={styles.image} resizeMode="contain" />
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.title, { textAlign }]}>{item.title}</Text>
            <Text style={[styles.text, { textAlign:'center' }]}>{item.text}</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  };

  const renderNextButton = () => {
    return (
      <View style={[styles.buttonCircle, { flexDirection }]}>
        <Text style={styles.buttonText}>{t('intro.next')}</Text>
        {isRTL ? (
          <Text style={styles.buttonIcon}>←</Text>
        ) : (
          <Text style={styles.buttonIcon}>→</Text>
        )}
      </View>
    );
  };

  const renderDoneButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Text style={styles.buttonText}>{t('intro.done')}</Text>
      </View>
    );
  };

  const renderSkipButton = () => {
    return (
      <View style={styles.skipButton}>
        <Text style={styles.skipButtonText}>{t('intro.skip')}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AppIntroSlider
        ref={sliderRef}
        data={slides}
        renderItem={renderItem}
        onDone={handleDone}
        showSkipButton={true}
        renderNextButton={renderNextButton}
        renderDoneButton={renderDoneButton}
        renderSkipButton={renderSkipButton}
        onSkip={handleDone}
        dotStyle={styles.dot}
        activeDotStyle={styles.activeDot}
      />
    </View>
  );
};

// Check if intro has been shown before
export const checkIfIntroShown = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(INTRO_SHOWN_KEY);
    return value === 'true';
  } catch (error) {
    console.error('Error checking if intro was shown:', error);
    return false;
  }
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"#7980fe",

  },
  safeArea: {
    backgroundColor:"#7980fe",
    flex: 1,
    alignItems: 'center',
    textAlign:'center',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign:'center',

  },
  imageContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  image: {
    width: width * 0.8,
    height: height * 0.4,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    paddingBottom: 150,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 10,
    color: colors.white,
    fontFamily: 'Cairo',
    textAlign: 'center',

  },
  text: {
    fontSize: 18,
    color: colors.white,
    fontFamily: 'Cairo',
    paddingHorizontal:50
  },
  buttonCircle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  buttonIcon: {
    fontSize: 22,
    marginLeft: 5,
    color: colors.primary,
  },
  buttonText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Cairo',
  },
  skipButton: {
    padding: 10,
  },
  skipButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Cairo',
  },
  dot: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: colors.white,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
