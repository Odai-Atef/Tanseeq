import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from './LanguageContext';
import { getTourText } from '../constants/languages/tour';

type TourContextType = {
  startTour: (tourName: string) => void;
  isTourRunning: boolean;
  currentTour: string | null;
  getTourStepText: (key: string) => string;
  endTour: () => void;
  hasCompletedTour: (tourName: string) => Promise<boolean>;
  markTourAsCompleted: (tourName: string) => Promise<void>;
};

const TourContext = createContext<TourContextType | undefined>(undefined);

export const TourProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isTourRunning, setIsTourRunning] = useState(false);
  const [currentTour, setCurrentTour] = useState<string | null>(null);
  const { language } = useTranslation();

  const startTour = (tourName: string) => {
    setCurrentTour(tourName);
    setIsTourRunning(true);
  };

  const endTour = () => {
    setIsTourRunning(false);
    setCurrentTour(null);
  };

  const getTourStepText = (key: string) => {
    return getTourText(language, key);
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

  return (
    <TourContext.Provider
      value={{
        startTour,
        isTourRunning,
        currentTour,
        getTourStepText,
        endTour,
        hasCompletedTour,
        markTourAsCompleted,
      }}
    >
      {children}
    </TourContext.Provider>
  );
};

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
};
