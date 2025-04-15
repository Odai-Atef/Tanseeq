import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { CopilotProvider } from 'react-native-copilot';
import { useTour } from '../contexts/TourContext';
import { useTranslation } from '../contexts/LanguageContext';

interface TourWrapperProps {
  children: React.ReactNode;
  tourName: string;
}

export const TourWrapper: React.FC<TourWrapperProps> = ({ 
  children, 
  tourName 
}) => {
  const { startTour, markTourAsCompleted, hasCompletedTour } = useTour();
  const { language, isRTL } = useTranslation();
  const [tourChecked, setTourChecked] = useState(false);

  useEffect(() => {
    if (!tourChecked) {
      checkAndStartTour();
    }
  }, [tourChecked]);

  const checkAndStartTour = async () => {
    setTourChecked(true);
    const completed = await hasCompletedTour(tourName);
    if (!completed) {
      // Small delay to ensure the component is fully rendered
      setTimeout(() => {
        startTour(tourName);
      }, 500);
    }
  };

  const handleTourStop = () => {
    markTourAsCompleted(tourName);
  };

  return (
    <CopilotProvider
      stepNumberComponent={() => null}
      tooltipStyle={styles.tooltip}
      animated={true}
      overlay="svg"
      backdropColor="rgba(0, 0, 0, 0.7)"
      onStop={handleTourStop}
      verticalOffset={36}
      androidStatusBarVisible={true}
    >
      {children}
    </CopilotProvider>
  );
};

const styles = StyleSheet.create({
  tooltip: {
    borderRadius: 10,
    paddingTop: 5,
  },
});
