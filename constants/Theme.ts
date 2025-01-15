// Export colors
export { colors } from './Colors';

// Export themes
export { baseTheme } from './baseTheme';
export { dashboardTheme } from './dashboardTheme';
export { taskTheme } from './taskTheme';
export { scheduleTheme } from './scheduleTheme';
export { footerTheme } from './footerTheme';
export { authTheme } from './authTheme';
export { authProfileTheme } from './authProfileTheme';
export { homeTheme } from './homeTheme';

// Re-export common types if needed by components
import { TextStyle, ViewStyle, ImageStyle } from 'react-native';
export type ThemeStyles = TextStyle | ViewStyle | ImageStyle;
