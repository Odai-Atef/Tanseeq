import React, { useEffect, useState } from 'react';
import { copilot, CopilotStep, CopilotStepProps } from 'react-native-copilot';
import { useTour } from '../contexts/TourContext';
import { useTranslation } from '../contexts/LanguageContext';

// Define the props for the tour step component
export interface TourableViewProps {
  copilot?: CopilotStepProps;
  tourProps?: {
    name: string;
    order: number;
    text: string;
  };
}

// Create a higher-order component that adds tour functionality
export const withTour = (Component: React.ComponentType<any>) => {
  const EnhancedComponent = copilot({
    overlay: 'svg',
    animated: true,
    backdropColor: 'rgba(0, 0, 0, 0.7)',
    stepNumberComponent: () => null,
    tooltipStyle: {
      borderRadius: 10,
    },
  })(({ start, copilotEvents, ...props }: any) => {
    const { currentTour, markTourAsCompleted, hasCompletedTour } = useTour();
    const { language } = useTranslation();
    const [tourChecked, setTourChecked] = useState(false);

    useEffect(() => {
      if (currentTour && !tourChecked) {
        checkAndStartTour();
      }
    }, [currentTour, tourChecked]);

    useEffect(() => {
      if (copilotEvents) {
        copilotEvents.on('stop', handleTourStop);
        copilotEvents.on('stepChange', handleStepChange);

        return () => {
          copilotEvents.off('stop');
          copilotEvents.off('stepChange');
        };
      }
    }, [copilotEvents]);

    const checkAndStartTour = async () => {
      setTourChecked(true);
      if (currentTour) {
        const completed = await hasCompletedTour(currentTour);
        if (!completed) {
          // Small delay to ensure the component is fully rendered
          setTimeout(() => {
            start();
          }, 500);
        }
      }
    };

    const handleTourStop = () => {
      if (currentTour) {
        markTourAsCompleted(currentTour);
      }
    };

    const handleStepChange = (step: any) => {
      // You can add analytics or other tracking here
    };

    return <Component {...props} />;
  });

  return EnhancedComponent;
};

// Create a component for individual tour steps
export const TourableView: React.FC<TourableViewProps> = ({ 
  children, 
  copilot, 
  tourProps,
  ...props 
}) => {
  const { getTourStepText } = useTour();
  
  if (!tourProps) {
    return <>{children}</>;
  }

  const { name, order, text } = tourProps;
  const translatedText = getTourStepText(text);

  return (
    <CopilotStep
      name={name}
      order={order}
      text={translatedText}
    >
      {copilot => React.cloneElement(React.Children.only(children as React.ReactElement), {
        ...props,
        ...copilot,
      })}
    </CopilotStep>
  );
};
