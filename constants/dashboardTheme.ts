import { StyleSheet } from 'react-native';
import { colors } from './Colors';

export const dashboardTheme = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 16,
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
