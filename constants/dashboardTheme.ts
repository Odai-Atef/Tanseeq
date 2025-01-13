import { StyleSheet } from 'react-native';
import { colors } from './Colors';
import { baseTheme } from './baseTheme';

export const dashboardTheme = StyleSheet.create({
  ...baseTheme,
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.white,
  },
  greeting: {
    ...baseTheme.headerTitle,
    fontSize: 20,
    color: colors.textPrimary,
  },
  subGreeting: {
    ...baseTheme.subtitle,
    marginTop: 4,
    marginBottom: 0,
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
    ...baseTheme.headerTitle,
    color: colors.white,
    fontSize: 16,
  },
  progressSubtext: {
    ...baseTheme.subtitle,
    color: colors.white,
    fontSize: 12,
    marginBottom: 0,
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    ...baseTheme.headerTitle,
    fontSize: 18,
    color: colors.textPrimary,
  },
  viewAll: {
    ...baseTheme.subtitle,
    fontSize: 12,
    lineHeight: 20,
    marginBottom: 0,
  },
  taskItem: {
    ...baseTheme.inputContainer,
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
    ...baseTheme.headerTitle,
    color: colors.textPrimary,
  },
  taskDescription: {
    ...baseTheme.subtitle,
    fontSize: 12,
    lineHeight: 20,
    marginBottom: 12,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskTime: {
    ...baseTheme.subtitle,
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 0,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    ...baseTheme.subtitle,
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 0,
    textTransform: 'capitalize',
  },
  emptyState: {
    ...baseTheme.errorContainer,
    marginTop: 16,
  },
  emptyStateIcon: {
    marginBottom: 16,
    color: colors.textSecondary,
  },
  emptyStateText: {
    ...baseTheme.errorText,
  },
});
