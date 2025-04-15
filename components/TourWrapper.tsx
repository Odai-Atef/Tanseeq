import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { CopilotProvider } from 'react-native-copilot';
import { useTour } from '../contexts/TourContext';
import { useTranslation } from '../contexts/LanguageContext';
import { useTooltipPosition } from '../hooks/useTooltipPosition';

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
  
  // Use our custom hook to position the tooltip at the bottom
  useTooltipPosition();

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
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    marginTop: 10,
  },
});
