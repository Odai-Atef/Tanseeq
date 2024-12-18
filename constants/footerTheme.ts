import { StyleSheet } from 'react-native';
import { colors } from './Colors';

export const footerTheme = StyleSheet.create({
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
