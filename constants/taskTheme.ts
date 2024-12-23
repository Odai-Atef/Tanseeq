import { StyleSheet } from 'react-native';
import { colors } from './Colors';

export const taskTheme = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container_trans: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
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
  taskSection: {
    marginBottom: 10,
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 10,
    elevation: 4,
 
  },
  taskSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
  },
  taskTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginRight: 8,
  },
  taskCount: {
    paddingHorizontal: 3,
    borderRadius: 12,
    minWidth: 24,
    alignItems: 'center',
  },
  taskCountText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  assignHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    marginBottom: 8,
  },
  assignText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  taskName: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    marginRight: 16,
  },
  taskDueDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 0,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
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
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  taskTime: {
    fontSize: 14,
    color: colors.textSecondary,
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
  imageButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
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
    flex: 1,
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
  },
  previewImage: {
    width: '100%',
    height: 200,
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
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: colors.white,
  },
  footerButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerButtonPrimary: {
    backgroundColor: colors.primary,
  },
  footerButtonDanger: {
    backgroundColor: colors.danger,
  },
  footerButtonText: {
    color: colors.white,
    fontSize: 16,
  },
  footerButtonIcon: {
    marginRight: 8,
  },
  actionButton: {
    backgroundColor: colors.primary,
    width: 80,
    minHeight: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonDanger: {
    backgroundColor: colors.danger,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 12,
    marginTop: 4,
  },
  repeatDayChip: {
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  repeatDayText: {
    color: colors.textPrimary,
  },
  submitButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 16,
  },
  calendar: {
    marginBottom: 20,
    borderRadius: 10,
    elevation: 4,
  },
  imageContainer: {
    marginBottom: 16,
    marginHorizontal: -16, // Compensate for parent padding to make image full width
    backgroundColor: colors.background,
  },
});
