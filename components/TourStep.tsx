import React from 'react';
import { View, ViewStyle } from 'react-native';
import { CopilotStep } from 'react-native-copilot';
import { useTour } from '../contexts/TourContext';

interface TourStepProps {
  name: string;
  order: number;
  text: string;
  children: React.ReactNode;
  style?: ViewStyle;
  active?: boolean;
  tourName?: string;
}

export const TourStep: React.FC<TourStepProps> = ({
  name,
  order,
  text,
  children,
  style,
  active = true,
  tourName = 'default',
}) => {
  const { getTourStepText, currentTour } = useTour();
  
  // Only show the tour step if the current tour matches the tourName
  const isActive = active && (!currentTour || currentTour === tourName);
  
  if (!isActive) {
    return <View style={style}>{children}</View>;
  }

  // Get the translated text for this step
  const translatedText = getTourStepText(text);

  return (
    <CopilotStep
      name={name}
      order={order}
      text={translatedText}
    >
      {(props: any) => {
        return (
          <View {...props} style={style}>
            {children}
          </View>
        );
      }}
    </CopilotStep>
  );
};
