import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCopilot } from 'react-native-copilot';
import { useTranslation } from '../contexts/LanguageContext';
import { getTourText } from '../constants/languages/tour';

export const useCopilotTour = (tourName: string) => {
  const { start, copilotEvents } = useCopilot();
  const { language } = useTranslation();
  const [tourChecked, setTourChecked] = useState(false);

  useEffect(() => {
    if (!tourChecked) {
      checkAndStartTour();
    }

    if (copilotEvents) {
      copilotEvents.on('stop', handleTourStop);
      
      return () => {
        copilotEvents.off('stop');
      };
    }
  }, [tourChecked, copilotEvents]);

  const checkAndStartTour = async () => {
    setTourChecked(true);
    const completed = await hasCompletedTour(tourName);
    if (!completed) {
      // Small delay to ensure the component is fully rendered
      setTimeout(() => {
        start();
      }, 500);
    }
  };

  const handleTourStop = () => {
    markTourAsCompleted(tourName);
  };

  const hasCompletedTour = async (tourName: string): Promise<boolean> => {
    try {
      const completedTours = await AsyncStorage.getItem('completed_tours');
      if (completedTours) {
        const tours = JSON.parse(completedTours);
        return tours.includes(tourName);
      }
      return false;
    } catch (error) {
      console.error('Error checking completed tour:', error);
      return false;
    }
  };

  const markTourAsCompleted = async (tourName: string): Promise<void> => {
    try {
      const completedTours = await AsyncStorage.getItem('completed_tours');
      let tours = completedTours ? JSON.parse(completedTours) : [];
      
      if (!tours.includes(tourName)) {
        tours.push(tourName);
        await AsyncStorage.setItem('completed_tours', JSON.stringify(tours));
      }
    } catch (error) {
      console.error('Error marking tour as completed:', error);
    }
  };

  const getStepText = (key: string): string => {
    return getTourText(language, key);
  };

  return {
    getStepText,
    startTour: start,
  };
};
