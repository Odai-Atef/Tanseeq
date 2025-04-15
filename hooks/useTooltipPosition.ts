import { useEffect } from 'react';

// Define a type for the global object with our custom properties
declare global {
  interface Window {
    nativeFabricUIManager?: {
      measureLayout: (
        node: any,
        relativeToNode: any,
        onFail: (error: any) => void,
        onSuccess: (left: number, top: number, width: number, height: number) => void
      ) => void;
    };
  }
}

/**
 * A hook to modify the react-native-copilot tooltip position
 * This hook should be called in the component that uses the CopilotProvider
 */
export const useTooltipPosition = () => {
  useEffect(() => {
    // Find the CopilotModal component in the DOM
    const findAndModifyTooltipPosition = () => {
      try {
        // This is a hack to access the internal implementation of react-native-copilot
        // It may break with future updates of the library
        const global = window as any;
        const originalMeasureLayout = global.nativeFabricUIManager?.measureLayout;
        
        if (originalMeasureLayout) {
          global.nativeFabricUIManager.measureLayout = (
            node: any,
            relativeToNode: any,
            onFail: (error: any) => void,
            onSuccess: (left: number, top: number, width: number, height: number) => void
          ) => {
            originalMeasureLayout(node, relativeToNode, onFail, (left: number, top: number, width: number, height: number) => {
              // Modify the position to be at the bottom of the element
              onSuccess(left, top + height, width, height);
            });
          };
        }
      } catch (error) {
        console.error('Error modifying tooltip position:', error);
      }
    };

    // Run the function after a short delay to ensure the component is mounted
    const timeoutId = setTimeout(findAndModifyTooltipPosition, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);
};
