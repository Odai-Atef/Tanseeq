import { StyleSheet } from 'react-native';
import { colors } from './Colors';
import { baseTheme } from './baseTheme';

export const taskTheme = StyleSheet.create({
  ...baseTheme,
  container: {
    ...baseTheme.container,
  },
  container_trans: {
    flex: 1,
  },
  content: {
    ...baseTheme.content,
    flex: 1,
  },
  header: {
    ...baseTheme.header,
    justifyContent: 'space-between',
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
  taskSection: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 10,
    elevation: 4,
    marginBottom: 10,
  },
  taskSectionHeader: {
    ...baseTheme.header,
    justifyContent: 'space-between',
    paddingVertical: 0,
    borderBottomWidth: 0,
  },
  taskTitleContainer: {
    ...baseTheme.header,
    paddingVertical: 0,
    borderBottomWidth: 0,
    justifyContent: 'flex-start',
  },
  taskSectionTitle: {
    ...baseTheme.headerTitle,
    fontSize: 14,
    marginRight: 8,
  },
  taskCount: {
    paddingHorizontal: 3,
    borderRadius: 12,
    minWidth: 24,
    alignItems: 'center',
    marginHorizontal:10
  },
  taskCountText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  assignHeader: {
    ...baseTheme.inputContainer,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    marginBottom: 8,
    borderRadius: 0,
  },
  assignText: {
    ...baseTheme.subtitle,
    fontWeight:"600",
    fontSize: 14,
    marginBottom: 0,
  },
  taskItem: {
    ...baseTheme.inputContainer,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderRadius: 0,
    marginBottom: 0,
    paddingHorizontal: 0,
  },
  taskName: {
    ...baseTheme.subtitle,
    flex: 1,
    marginRight: 16,
    marginBottom: 0,
  },
  taskDueDate: {
    ...baseTheme.subtitle,
    fontSize: 14,
    marginBottom: 0,
  },
  loadingContainer: {
    ...baseTheme.loadingContainer,
    padding: 20,
  },
  sectionHeader: {
    ...baseTheme.header,
    justifyContent: 'space-between',
    paddingVertical: 0,
    borderBottomWidth: 0,
    marginBottom: 16,
  },
  title: {
    ...baseTheme.headerTitle,
    fontSize: 24,
    marginBottom: 8,
  },
  subtitle: {
    ...baseTheme.headerTitle,
    fontSize: 16,
    marginBottom: 8,
  },
  description: {
    ...baseTheme.subtitle,
    lineHeight: 24,
    marginBottom: 0,
  },
  taskList: {
    gap: 12,
  },
  swipeableContainer: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  taskTitle: {
    ...baseTheme.headerTitle,
    fontSize: 16,
    marginBottom: 8,
  },
  taskTime: {
    ...baseTheme.subtitle,
    fontSize: 14,
    marginBottom: 0,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: colors.textPrimary,
    opacity: 0.8,
  },
  input: {
    ...baseTheme.input,
    width: '100%',
    fontSize: 14,
    lineHeight: 16,
    backgroundColor: colors.white,
  },
  textArea: {
    height: 140,
    textAlignVertical: 'top',
  },
  imageButtonsContainer: {
    ...baseTheme.header,
    justifyContent: 'space-between',
    paddingVertical: 0,
    borderBottomWidth: 0,
    marginBottom: 16,
  },
  uploadButton: {
    ...baseTheme.inputContainer,
    justifyContent: 'center',
    borderStyle: 'dashed',
    flex: 1,
    padding: 16,
  },
  uploadText: {
    marginLeft: 8,
    fontSize: 16,
  },
  imagePreview: {
    marginTop: 16,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: colors.background,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 4,
  },
  radioGroup: {
    gap: 10,
  },
  radioButton: {
    ...baseTheme.inputContainer,
    padding: 12,
  },
  radioButtonActive: {
    borderColor: colors.primary,
  },
  checkboxContainer: {
    ...baseTheme.inputContainer,
    padding: 4,
    marginBottom:0
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
    marginLeft:12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  checkboxText: {
    ...baseTheme.subtitle,
    marginBottom: 0,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: colors.white,
  },
  footerButton: {
    ...baseTheme.submitButton,
    flex: 1,
    flexDirection: 'row',
  },
  footerButtonPrimary: {
    backgroundColor: colors.primary,
  },
  footerButtonDanger: {
    backgroundColor: colors.danger,
  },
  footerButtonText: {
    ...baseTheme.submitButtonText,
  },
  footerButtonIcon: {
    marginRight: 8,
  },
  actionButton: {
    ...baseTheme.button,
    width: 80,
    minHeight: 80,
    marginTop: 0,
  },
  actionButtonDanger: {
    backgroundColor: colors.danger,
  },
  actionButtonText: {
    ...baseTheme.buttonText,
    fontSize: 12,
    marginTop: 4,
  },
  repeatDayChip: {
    ...baseTheme.inputContainer,
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 0,
  },
  repeatDayText: {
    color: colors.textPrimary,
  },
  submitButton: {
    ...baseTheme.submitButton,
    width: '100%',
  },
  submitButtonText: {
    ...baseTheme.submitButtonText,
  },
  calendar: {
    marginBottom: 20,
    borderRadius: 10,
    elevation: 4,
  },
  imageContainer: {
    marginBottom: 16,
    marginHorizontal: -16,
    backgroundColor: colors.background,
  },
  bannerImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  seeDetails: {
    color: colors.primary,
    marginLeft: 4,
  },
  listSection: {
    marginTop: 24,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  listItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  listItemTitle: {
    fontSize: 16,
    color: colors.textPrimary,
    opacity: 0.8,
  },
  teamList: {
    flexDirection: 'row',
    gap: 8,
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  addMemberButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  leaderAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  leaderName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  dueDateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dueDateText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  attachmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  attachmentText: {
    fontSize: 14,
    color: colors.primary,
  },
  editButton: {
    ...baseTheme.submitButton,
    width: '100%',
    backgroundColor: colors.primary,
  },
  editButtonText: {
    ...baseTheme.submitButtonText,
    color: colors.white,
  },
});
