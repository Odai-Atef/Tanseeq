import { StyleSheet } from 'react-native';
import { colors } from './Colors';

export const baseTheme = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    justifyContent: 'center',
  },
  headerTitle: {
    color: colors.dark,
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '700',
    textAlign: 'left',
  },
  ios_boarder: { borderTopWidth: 65, borderTopColor: 'rgb(121, 128, 255)' },
  content: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: colors.textPrimary,
    opacity: 0.8,
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
    borderColor: colors.line,
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 0,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: colors.secondary,
    borderRadius: 4,
    padding:12
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
  divider: {
    height: 1,
    backgroundColor: colors.line,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: colors.white,
    borderRadius: 12,
  },
  loadingText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSecondary,
    marginTop: 12,
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
  submitButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 16,
  },
});
