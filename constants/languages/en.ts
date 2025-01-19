export const en = {
  common: {
    loading: 'Loading...',
    toast: {
      success: 'Success',
      error: 'Error',
      join: {
        success: 'Successfully joined the home',
        error: 'Failed to join home'
      },
      defaultHome: {
        success: 'Default home updated successfully',
        error: 'Failed to update default home'
      },
      auth: {
        required: 'Authentication Required',
        failed: 'Authentication Failed',
        signInRequired: 'Please sign in to join a home'
      },
      fetch: {
        homes: 'Failed to fetch homes',
        userInfo: 'User info not found'
      }
    },
    error: {
      general: 'Something went wrong. Please try again.',
      network: 'Network error. Please check your connection.',
      auth: {
        required: 'Authentication required',
        failed: 'Authentication failed'
      },
      validation: {
        required: 'This field is required',
        email: 'Please enter a valid email address'
      },
      fetch: 'Failed to load data. Please try again.',
      submit: 'Failed to submit. Please try again.',
      permission: 'Permission denied'
    },
    success: {
      created: '{item} created successfully',
      updated: '{item} updated successfully',
      deleted: '{item} deleted successfully'
    },
    buttons: {
      submit: 'Submit',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      save: 'Save',
      create: 'Create',
      update: 'Update',
      done: 'Done',
      back: 'Back',
      next: 'Next',
      viewAll: 'View All',
      confirm: 'Yes'
    },
    progress: 'Progress'
  },
  auth: {
    welcome: 'Welcome in Tanseeq',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    email: 'Email',
    password: 'Password',
    emailPlaceholder: 'Type your email',
    passwordPlaceholder: 'Type your password',
    forgotPassword: 'Forgot Password?',
    orContinueWith: 'or continue with',
    noAccount: 'Don\'t have an account?',
    hasAccount: 'Already have an account?',
    signInSuccess: 'Signed in successfully',
    signOutSuccess: 'Signed out successfully',
    googleSignIn: 'Sign in with Google',
    appleSignIn: 'Sign in with Apple'
  },
  dashboard: {
    greeting: 'Hello, {name}!',
    subGreeting: 'Let\'s complete your tasks',
    myHomes: 'My Homes',
    todayTasks: 'Today Tasks',
    progressTitle: 'Progress Today Task',
    tasksCompleted: '{completed}/{total} Tasks Completed',
    noTasks: 'No tasks for today',
    noInProgress: 'No in-progress or completed schedules'
  },
  tasks: {
    title: 'Tasks',
    add: {
      title: 'Add Task',
      name: 'Task Name',
      namePlaceholder: 'Enter task name',
      description: 'Description',
      descriptionPlaceholder: 'Write your description',
      images: 'Images (Optional)',
      chooseImage: 'Choose Image',
      takePhoto: 'Take Photo',
      schedule: 'Select Recurrence Schedule',
      scheduleDays: 'Select Scheduled Days',
      periods: {
        manual: 'Manual Assignment (No Schedule)',
        daily: 'Every Day',
        weekly: 'Weekly',
        biWeekly: 'Bi Weekly',
        monthly: 'Monthly',
        quarterly: 'Every 3 Months',
        biAnnually: 'Every 6 Months',
        annually: 'Annually'
      },
      days: {
        sunday: 'Sun',
        monday: 'Mon',
        tuesday: 'Tue',
        wednesday: 'Wed',
        thursday: 'Thu',
        friday: 'Fri',
        saturday: 'Sat'
      }
    },
    view: {
      title: 'Task Details',
      status: 'Status',
      createdAt: 'Created At',
      updatedAt: 'Updated At'
    },
    calendar: {
      title: 'Calendar',
      noEvents: 'No events for selected date',
      taskName: 'Task Name',
      time: 'Time',
      inProgress: 'In Progress',
      done: 'Done',
      notStarted: 'Not Started'
    }
  },
  schedules: {
    title: 'Schedules',
    add: {
      title: 'Add Schedule',
      selectDate: 'Select Date',
      selectTask: 'Select Task',
      noTasks: 'No tasks available. Please create a task first.',
      invalidDate: 'Please select today or a future date',
      createSchedule: 'Create Schedule',
      success: 'Schedule created successfully',
      error: 'Failed to create schedule'
    },
    view: {
      title: 'Schedule Details',
      task: 'Task',
      date: 'Date',
      status: 'Status',
      day: 'Day',
      time: 'Time',
      notFound: 'Schedule not found',
      actions: {
        cancel: 'Cancel Schedule',
        start: 'Start this task',
        close: 'Close the task',
        edit: 'Edit Schedule'
      },
      confirmations: {
        cancel: {
          title: 'Cancel Schedule',
          message: 'Are you sure you want to cancel this schedule?'
        },
        start: {
          title: 'Start Task',
          message: 'Are you sure you want to start this task?'
        },
        close: {
          title: 'Close Task',
          message: 'Are you sure you want to close this task?'
        }
      },
      success: {
        cancelled: 'Schedule cancelled successfully',
        started: 'Task started successfully',
        closed: 'Task closed successfully'
      },
      error: {
        cancel: 'Failed to cancel schedule. Please try again.',
        start: 'Failed to start task. Please try again.',
        close: 'Failed to close task. Please try again.'
      }
    }
  },
  footer: {
    home: 'Home',
    tasks: 'Tasks',
    schedules: 'Schedules',
    profile: 'Profile'
  },
  home: {
    invite: {
      title: 'Home Invite',
      homeId: 'Home ID',
      homePassword: 'Home Password',
      instruction: 'Show the QR code or share the home ID and password to invite the housemaid to join'
    },
    join: {
      title: 'Join Home',
      homeId: 'Home ID',
      cameraRequired: 'Camera permission is required to scan QR codes',
      invalidQR: 'The QR code does not contain valid home information',
      enterBoth: 'Please enter both Home ID and Password',
      sixDigits: 'Home ID and Password must be 6 digits',
      invalidCredentials: 'Invalid home ID or password',
      homePassword: 'Home Password',
      homeIdPlaceholder: 'Enter 6-digit Home ID',
      homePasswordPlaceholder: 'Enter 6-digit Home Password',
      scanQrCode: 'Scan QR Code',
      submit: 'Join Home'
    }
  }
};
