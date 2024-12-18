export { colors } from './Colors';
export { baseTheme } from './baseTheme';
export { dashboardTheme } from './dashboardTheme';
export { taskTheme } from './taskTheme';
export { scheduleTheme } from './scheduleTheme';
export { footerTheme } from './footerTheme';

// Re-export common types if needed by components
import { TextStyle, ViewStyle, ImageStyle } from 'react-native';
export type ThemeStyles = TextStyle | ViewStyle | ImageStyle;
