import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const taskItemTheme = StyleSheet.create({
  taskItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    zIndex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#464D61',
    flex: 1,
    marginRight: 8,
  },
  taskDescription: {
    fontSize: 14,
    color: '#464D61',
    opacity: 0.7,
    marginBottom: 12,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskTime: {
    fontSize: 12,
    color: '#464D61',
    opacity: 0.5,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  // Menu Styles
  menuWrapper: {
    position: 'relative',
    zIndex: 2,
  },
  fullScreenOverlay: {
    position: 'absolute',
    top: -SCREEN_HEIGHT,
    left: -SCREEN_WIDTH,
    right: 0,
    bottom: 0,
    width: SCREEN_WIDTH * 2,
    height: SCREEN_HEIGHT * 2,
    backgroundColor: 'transparent',
    zIndex: 9998,
  },
  menuContainer: {
    position: 'absolute',
    top: 25,
    right: 10,
    backgroundColor: '#ffffff',
    minWidth: 150,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 5,
    zIndex: 9999,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 0,
    backgroundColor: '#ffffff',
  },
  menuIcon: {
    marginRight: 6,
    width: 24,
    textAlign: 'center',
  },
  menuText: {
    fontSize: 14,
    color: '#464D61',
    fontWeight: '600',
  },
});
