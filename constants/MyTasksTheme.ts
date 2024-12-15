import { StyleSheet } from 'react-native';
import { colors } from './Theme';

export const myTasksTheme = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  taskSection: {
    marginTop: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E8EC',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#31394F',
  },
  taskList: {
    marginTop: 12,
  },
  taskItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    minHeight: 80,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#31394F',
    marginBottom: 8,
  },
  taskTime: {
    fontSize: 14,
    color: '#464D61',
    opacity: 0.7,
  },
  swipeableContainer: {
    marginBottom: 12,
    backgroundColor: 'transparent',
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    minHeight: 80,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
  },
});
