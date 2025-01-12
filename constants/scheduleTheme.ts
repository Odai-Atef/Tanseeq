import { StyleSheet } from 'react-native';
import { colors } from './Colors';
import { baseTheme } from './baseTheme';

export const scheduleTheme = StyleSheet.create({
  ...baseTheme,


  section: {
    marginBottom: 4,
  },
  sectionTitle: {
    ...baseTheme.headerTitle,
    marginBottom: 8,
    color: colors.textPrimary,
  },
  dateButton: {
    ...baseTheme.inputContainer,
    padding: 12,
    backgroundColor: colors.white,
    borderRadius: 8,
  },
  dateIcon: {
    marginRight: 8,
  },
  dateText: {
    ...baseTheme.subtitle,
    marginBottom: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    ...baseTheme.errorText,
  },
  scheduleItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timeContainer: {
    marginRight: 16,
    alignItems: 'center',
  },
  time: {
    ...baseTheme.subtitle,
    fontSize: 14,
    marginBottom: 0,
  },
  timeDivider: {
    ...baseTheme.subtitle,
    fontSize: 14,
    marginBottom: 0,
    marginVertical: 4,
  },
  taskContainer: {
    flex: 1,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    ...baseTheme.subtitle,
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 0,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: colors.white,
  },
  taskList: {
    gap: 0,
  },
  taskItem: {
    ...baseTheme.inputContainer,
    padding: 10,
    backgroundColor: colors.white,
  },
  taskItemSelected: {
    backgroundColor: 'rgba(121, 128, 255, 0.1)',
    borderColor: colors.primary,
  },
  taskItemText: {
    ...baseTheme.subtitle,
    color: colors.textPrimary,
    marginBottom: 0,
  },
});
