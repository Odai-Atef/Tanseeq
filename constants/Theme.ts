import { TextStyle, ViewStyle, ImageStyle, StyleSheet } from 'react-native';

// Colors from CSS variables
export const colors = {
  surface: '#f5f5f5',
  white: '#fff',
  primary: '#7980ff',
  primaryBold: '#878dff',
  secondary: 'rgba(49, 57, 79, 0.7)',
  secondary2: '#b9bac3',
  success: '#5fd788',
  success2: '#54b24c',
  danger: '#f05a5a',
  warning: '#fcdb66',
  info: '#64bef1',
  light: '#e7e7e7',
  dark: '#1b325f',
  disable: '#d3b7a5',
  onSurface: '#151515',
  text: '#6f7582',
  text2: '#c9cbce',
  text3: '#343434',
  text4: '#d3d5da',
  text5: '#abadb2',
  line: '#e5e5e5',
  line2: '#d9d9d9',
  line3: '#dbdbdb',
  lineRgba: 'rgba(255, 255, 255, 0.1)',
  backdrop: 'rgba(49, 57, 79, 0.12)',
  bgProgress: 'rgba(21, 21, 21, 0.15)',
  rgbaPrimary: 'rgba(135, 59, 10, 0.1)',
  rgbaSuccess: 'rgba(30, 127, 17, 0.1)',
  rgbaDanger: 'rgba(225, 0, 0, 0.1)',
  rgbaWarning: 'rgba(255, 138, 0, 0.1)',
  rgbaInfo: 'rgba(167, 2, 103, 0.1)',
  rgbaDark: 'rgba(27, 50, 95, 0.1)',
  rgbaDisable: 'rgba(135, 59, 10, 0.1)',
  linerPrimary: ['#7980ff', '#bcc0ff'],
  linner1: ['rgba(135, 59, 10, 0)', '#2e1200'],
  background: '#F8F9FA',
  textPrimary: '#31394F',
  textSecondary: '#464D61',
  lightGray: '#F0F1F5',
} as const;

// Common styles used across the app
export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    justifyContent: 'center',
  },
  headerTitle: {
    color:'#1b325f',
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
  content: {
    paddingTop: 24,
    paddingBottom: 24,
    paddingLeft: 16,
    paddingRight: 16,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.secondary,
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: colors.secondary,
  },
  eyeIcon: {
    padding: 8,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.line,
  },
  dividerText: {
    marginLeft: 16,
    marginRight: 16,
    color: colors.secondary,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  socialButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.line,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  bottomContainer: {
    marginTop: 32,
    alignItems: 'center',
  },
  bottomText: {
    fontSize: 16,
    lineHeight: 24,
  },
  bottomLink: {
    color: colors.primary,
    fontWeight: '600',
  },
});

// Dashboard specific styles
export const dashboardStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.white,
  },
  greeting: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subGreeting: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSecondary,
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  progressSection: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  progressCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  progressInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  progressTitle: {
    color: colors.white,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
  },
  progressSubtext: {
    color: colors.white,
    fontSize: 12,
    lineHeight: 20,
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  viewAll: {
    fontSize: 12,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  taskItem: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  taskDescription: {
    fontSize: 12,
    lineHeight: 20,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskTime: {
    fontSize: 11,
    lineHeight: 16,
    color: colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    lineHeight: 16,
    textTransform: 'capitalize',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: colors.white,
    borderRadius: 12,
    marginTop: 16,
  },
  emptyStateIcon: {
    marginBottom: 16,
    color: colors.textSecondary,
  },
  emptyStateText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: colors.white,
    borderRadius: 12,
    marginTop: 16,
  },
  loadingText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSecondary,
    marginTop: 12,
  },
});

// Schedule Add styles
export const scheduleAddStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    backgroundColor: colors.white,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  headerSpace: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: colors.textPrimary,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  dateIcon: {
    marginRight: 8,
  },
  dateText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
  },
  errorText: {
    color: colors.textSecondary,
    textAlign: 'center',
  },
  taskList: {
    gap: 12,
  },
  taskItem: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.line,
  },
  taskItemSelected: {
    backgroundColor: 'rgba(121, 128, 255, 0.1)',
    borderColor: colors.primary,
  },
  taskItemText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: colors.white,
  },
  submitButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

// Footer styles
export const footerStyles = StyleSheet.create({
  menubarFooter: {
    paddingVertical: 10,
    paddingHorizontal: 26,
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: colors.textPrimary,
    shadowOffset: {
      width: 0,
      height: -8,
    },
    shadowOpacity: 0.08,
    shadowRadius: 44,
    elevation: 8,
  },
  innerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  footerSide: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '40%',
  },
  footerItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  addTaskWrapper: {
    alignItems: 'center',
    width: '20%',
  },
  actionAddTask: {
    marginTop: -45,
    width: 64,
    height: 64,
    backgroundColor: colors.primary,
    borderRadius: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// Task Add styles
export const taskAddStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  headerButton: {
    padding: 8,
  },
  headerRight: {
    flexDirection: 'row',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    color: colors.textPrimary,
  },
  input: {
    width: '100%',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 16,
    padding: 16,
    paddingLeft: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.line,
    color: colors.textPrimary,
    backgroundColor: colors.background,
  },
  textArea: {
    height: 140,
    textAlignVertical: 'top',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 8,
    padding: 16,
    borderStyle: 'dashed',
  },
  uploadText: {
    marginLeft: 8,
    fontSize: 16,
  },
  radioGroup: {
    gap: 10,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 8,
  },
  radioButtonActive: {
    borderColor: colors.primary,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 8,
  },
  checkboxActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(121, 128, 255, 0.1)',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.line,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  checkboxText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  submitButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
