import React from 'react';
import { View, ViewStyle } from 'react-native';
import { CopilotStep } from 'react-native-copilot';

interface BottomPositionedCopilotStepProps {
  name: string;
  order: number;
  text: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

export const BottomPositionedCopilotStep: React.FC<BottomPositionedCopilotStepProps> = ({
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
      {(props: any) => {
        // Add a small delay to allow the component to render before modifying the measure function
        setTimeout(() => {
          if (props.wrapperRef?.current) {
            const originalMeasure = props.wrapperRef.current.measure;
            if (originalMeasure) {
              props.wrapperRef.current.measure = function(callback: any) {
                originalMeasure.call(this, (x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
                  // Position the tooltip at the bottom of the element
                  callback(x, y, width, height, pageX, pageY + height);
                });
              };
            }
          }
        }, 0);
        
        return (
          <View {...props} style={style}>
            {children}
          </View>
        );
      }}
    </CopilotStep>
  );
};
