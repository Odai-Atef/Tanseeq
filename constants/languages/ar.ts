export const ar = {
  common: {
    loading: 'جاري التحميل...',
    toast: {
      success: 'نجاح',
      error: 'خطأ',
      join: {
        success: 'تم الانضمام إلى المنزل بنجاح',
        error: 'فشل في الانضمام إلى المنزل'
      },
      defaultHome: {
        success: 'تم تحديث المنزل الافتراضي بنجاح',
        error: 'فشل في تحديث المنزل الافتراضي'
      },
      auth: {
        required: 'المصادقة مطلوبة',
        failed: 'فشل المصادقة',
        signInRequired: 'يرجى تسجيل الدخول للانضمام إلى المنزل'
      },
      fetch: {
        homes: 'فشل في جلب المنازل',
        userInfo: 'معلومات المستخدم غير موجودة'
      }
    },
    error: {
      general: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
      network: 'خطأ في الشبكة. يرجى التحقق من اتصالك.',
      auth: {
        required: 'المصادقة مطلوبة',
        failed: 'فشلت المصادقة'
      },
      validation: {
        required: 'هذا الحقل مطلوب',
        email: 'يرجى إدخال بريد إلكتروني صحيح'
      },
      fetch: 'فشل تحميل البيانات. يرجى المحاولة مرة أخرى.',
      submit: 'فشل الإرسال. يرجى المحاولة مرة أخرى.',
      permission: 'تم رفض الإذن'
    },
    success: {
      created: 'تم إنشاء {item} بنجاح',
      updated: 'تم تحديث {item} بنجاح',
      deleted: 'تم حذف {item} بنجاح'
    },
    buttons: {
      submit: 'إرسال',
      cancel: 'إلغاء',
      delete: 'حذف',
      edit: 'تعديل',
      save: 'حفظ',
      create: 'إنشاء',
      update: 'تحديث',
      done: 'تم',
      back: 'رجوع',
      next: 'التالي',
      viewAll: 'عرض الكل',
      confirm: 'نعم'
    },
    progress: 'التقدم'
  },
  auth: {
    welcome: 'مرحباً بك في تنسيق',
    signIn: 'تسجيل الدخول',
    signUp: 'إنشاء حساب',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    emailPlaceholder: 'أدخل بريدك الإلكتروني',
    passwordPlaceholder: 'أدخل كلمة المرور',
    forgotPassword: 'نسيت كلمة المرور؟',
    orContinueWith: 'أو تابع باستخدام',
    noAccount: 'ليس لديك حساب؟',
    hasAccount: 'لديك حساب بالفعل؟',
    signInSuccess: 'تم تسجيل الدخول بنجاح',
    signOutSuccess: 'تم تسجيل الخروج بنجاح',
    googleSignIn: 'تسجيل الدخول باستخدام جوجل',
    appleSignIn: 'تسجيل الدخول باستخدام آبل'
  },
  dashboard: {
    greeting: 'مرحباً، {name}!',
    subGreeting: 'هيا نكمل مهامك',
    myHomes: 'منازلي',
    todayTasks: 'مهام اليوم',
    progressTitle: 'تقدم مهام اليوم',
    tasksCompleted: 'تم إكمال {completed} من {total} مهام',
    noTasks: 'لا توجد مهام لليوم',
    noInProgress: 'لا توجد مهام قيد التنفيذ أو مكتملة'
  },
  tasks: {
    title: 'المهام',
    add: {
      title: 'إضافة مهمة',
      name: 'اسم المهمة',
      namePlaceholder: 'أدخل اسم المهمة',
      description: 'الوصف',
      descriptionPlaceholder: 'اكتب الوصف',
      images: 'الصور (اختياري)',
      chooseImage: 'اختر صورة',
      takePhoto: 'التقط صورة',
      schedule: 'اختر جدول التكرار',
      scheduleDays: 'اختر أيام الجدول',
      periods: {
        manual: 'تعيين يدوي (بدون جدول)',
        daily: 'يومياً',
        weekly: 'أسبوعياً',
        biWeekly: 'كل أسبوعين',
        monthly: 'شهرياً',
        quarterly: 'كل 3 أشهر',
        biAnnually: 'كل 6 أشهر',
        annually: 'سنوياً'
      },
      days: {
        sunday: 'أحد',
        monday: 'إثن',
        tuesday: 'ثلا',
        wednesday: 'أرب',
        thursday: 'خمي',
        friday: 'جمع',
        saturday: 'سبت'
      }
    },
    view: {
      title: 'تفاصيل المهمة',
      status: 'الحالة',
      createdAt: 'تم الإنشاء في',
      updatedAt: 'تم التحديث في',
      createdBy: 'تم الإنشاء بواسطة',
      schedule: 'الجدول',
      attachment: 'المرفق',
      attachments: 'مرفقات',
      noAttachments: 'لا توجد مرفقات',
      notFound: 'لم يتم العثور على المهمة'
    },
    calendar: {
      title: 'التقويم',
      noEvents: 'لا توجد أحداث للتاريخ المحدد',
      taskName: 'اسم المهمة',
      time: 'الوقت',
      inProgress: 'قيد التنفيذ',
      done: 'مكتمل',
      notStarted: 'لم يبدأ'
    }
  },
  schedules: {
    title: 'الجداول',
    add: {
      title: 'إضافة جدول',
      selectDate: 'اختر التاريخ',
      selectTask: 'اختر المهمة',
      noTasks: 'لا توجد مهام متاحة. يرجى إنشاء مهمة أولاً.',
      invalidDate: 'يرجى اختيار اليوم أو تاريخ مستقبلي',
      createSchedule: 'إنشاء جدول',
      success: 'تم إنشاء الجدول بنجاح',
      error: 'فشل في إنشاء الجدول'
    },
    view: {
      title: 'تفاصيل الجدول',
      task: 'المهمة',
      date: 'التاريخ',
      status: 'الحالة',
      day: 'اليوم',
      time: 'الوقت',
      notFound: 'لم يتم العثور على الجدول',
      actions: {
        cancel: 'إلغاء الجدول',
        start: 'بدء هذه المهمة',
        close: 'إنهاء المهمة',
        edit: 'تعديل الجدول'
      },
      confirmations: {
        cancel: {
          title: 'إلغاء الجدول',
          message: 'هل أنت متأكد من إلغاء هذا الجدول؟'
        },
        start: {
          title: 'بدء المهمة',
          message: 'هل أنت متأكد من بدء هذه المهمة؟'
        },
        close: {
          title: 'إنهاء المهمة',
          message: 'هل أنت متأكد من إنهاء هذه المهمة؟'
        }
      },
      success: {
        cancelled: 'تم إلغاء الجدول بنجاح',
        started: 'تم بدء المهمة بنجاح',
        closed: 'تم إنهاء المهمة بنجاح'
      },
      error: {
        cancel: 'فشل إلغاء الجدول. يرجى المحاولة مرة أخرى.',
        start: 'فشل بدء المهمة. يرجى المحاولة مرة أخرى.',
        close: 'فشل إنهاء المهمة. يرجى المحاولة مرة أخرى.'
      }
    }
  },
  footer: {
    home: 'الرئيسية',
    tasks: 'المهام',
    schedules: 'الجداول',
    profile: 'الملف الشخصي'
  },
  home: {
    invite: {
      title: 'دعوة للمنزل',
      homeId: 'معرف المنزل',
      homePassword: 'كلمة مرور المنزل',
      instruction: 'اعرض رمز QR أو شارك معرف المنزل وكلمة المرور لدعوة العاملة للانضمام'
    },
    join: {
      title: 'الانضمام للمنزل',
      homeId: 'معرف المنزل',
      homePassword: 'كلمة مرور المنزل',
      cameraRequired: 'إذن الكاميرا مطلوب لمسح رموز QR',
      invalidQR: 'رمز QR لا يحتوي على معلومات منزل صالحة',
      enterBoth: 'يرجى إدخال معرف المنزل وكلمة المرور',
      sixDigits: 'يجب أن يكون معرف المنزل وكلمة المرور 6 أرقام',
      invalidCredentials: 'معرف المنزل أو كلمة المرور غير صحيحة',
      homeIdPlaceholder: 'أدخل معرف المنزل المكون من 6 أرقام',
      homePasswordPlaceholder: 'أدخل كلمة المرور المكونة من 6 أرقام',
      scanQrCode: 'مسح رمز QR',
      submit: 'انضمام للمنزل'
    }
  },
  profile: {
    defaultUser: 'مستخدم',
    upgradeTitle: 'الترقية إلى بريميوم',
    helpCenter: 'مركز المساعدة',
    rateApp: 'تقييم التطبيق',
    privacyPolicy: 'سياسة الخصوصية',
    logout: 'تسجيل الخروج',
    editProfile: 'تعديل الملف الشخصي',
    logoutConfirmation: 'هل أنت متأكد أنك تريد تسجيل الخروج؟',
    featureNotAvailable: 'هذه الميزة غير متوفرة حالياً',
    noEmail: 'لا يوجد بريد إلكتروني',
    logoutButton: 'تسجيل الخروج',
    cancelButton: 'إلغاء',
    switchLanguage: 'تغيير اللغة'
  }
};
