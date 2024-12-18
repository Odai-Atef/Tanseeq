import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Animated, Easing } from 'react-native';
import { colors } from '../constants/Colors';

interface PreloaderProps {
  visible: boolean;
}

export const Preloader = ({ visible }: PreloaderProps) => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1200,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={styles.preload}>
      <View style={styles.logoContainer}>
        <Image 
          source={require('../assets/images/icon.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <Animated.View 
        style={[
          styles.spinnerContainer,
          {
            transform: [{
              rotate: spinValue.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg']
              })
            }]
          }
        ]}
      >
        {[...Array(9)].map((_, index) => (
          <View 
            key={index} 
            style={[
              styles.spinnerCircle,
              {
                transform: [{ rotate: `${index * 40}deg` }],
                opacity: 0.2 + (index * 0.1)
              }
            ]} 
          />
        ))}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  preload: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
  },
  spinnerContainer: {
    width: 40,
    height: 40,
    position: 'relative',
  },
  spinnerCircle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    left: '50%',
    top: -4,
  },
});
