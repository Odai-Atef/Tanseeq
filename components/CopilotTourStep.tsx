import React from 'react';
import { View, ViewStyle } from 'react-native';
import { CopilotStep } from 'react-native-copilot';

interface CopilotTourStepProps {
  name: string;
  order: number;
  text: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

export const CopilotTourStep: React.FC<CopilotTourStepProps> = ({
  name,
  order,
  text,
  children,
  style,
}) => {
  return (
    <CopilotStep
      name={name}
      order={order}
      text={text}
    >
      {(props: any) => (
        <View {...props} style={style}>
          {children}
        </View>
      )}
    </CopilotStep>
  );
};
