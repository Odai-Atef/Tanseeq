import { StyleSheet } from 'react-native';
import { colors } from './Colors';

export const taskTheme = StyleSheet.create({
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
  },
});
