import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

// This interface should match what react-native-copilot expects
interface TooltipProps {
  isFirstStep: boolean;
  isLastStep: boolean;
  handleNext: () => void;
  handlePrev: () => void;
  handleStop: () => void;
  currentStep: {
    name: string;
    order: number;
    text: string;
  };
  labels: {
    previous?: string;
    next?: string;
    skip?: string;
    finish?: string;
  };
}

const { width } = Dimensions.get('window');

export const CustomTooltip: React.FC<TooltipProps> = (props) => {
  const {
    isFirstStep,
    isLastStep,
    handleNext,
    handlePrev,
    handleStop,
    currentStep,
    labels,
  } = props;

  return (
    <View style={styles.container}>
      <View style={styles.tooltipContainer}>
        <Text style={styles.tooltipText}>{currentStep.text}</Text>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={handleStop} style={styles.button}>
            <Text style={styles.buttonText}>{labels.skip || 'Skip'}</Text>
          </TouchableOpacity>
          {!isFirstStep && (
            <TouchableOpacity onPress={handlePrev} style={styles.button}>
              <Text style={styles.buttonText}>{labels.previous || 'Previous'}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleNext} style={styles.button}>
            <Text style={styles.buttonText}>
              {isLastStep ? (labels.finish || 'Finish') : (labels.next || 'Next')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  tooltipContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    width: width - 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tooltipText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    marginLeft: 10,
    padding: 5,
  },
  buttonText: {
    color: '#007AFF',
    fontSize: 14,
  },
});
