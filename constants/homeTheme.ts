import { StyleSheet } from 'react-native';
import { colors } from './Colors';
import { baseTheme } from './baseTheme';

export const homeTheme = StyleSheet.create({
  ...baseTheme,
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: colors.textPrimary,
    opacity: 0.8,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 12,
    width: '100%',
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.line,
    fontSize: 16,
  },
  scanButton: {
    backgroundColor: colors.background,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
  },
  scanButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: colors.background,
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '500',
  },
});
