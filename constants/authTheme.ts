import { StyleSheet } from 'react-native';
import { colors } from './Colors';

export const authTheme = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
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
    textAlign: 'center',
  },
  content: {
    padding: 16,
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
    backgroundColor: colors.white,
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
    marginHorizontal: 16,
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
    color: colors.textSecondary,
  },
  bottomLink: {
    color: colors.primary,
    fontWeight: '600',
  },
  errorText: {
    color: colors.danger,
    marginLeft: 10,
    marginTop: -10,
    marginBottom: 10,
  },
});
