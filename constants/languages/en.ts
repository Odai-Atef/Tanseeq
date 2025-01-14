export const en = {
  common: {
    loading: 'Loading...',
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
    }
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
      invalidDate: 'Please select today or a future date'
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
  }
};
