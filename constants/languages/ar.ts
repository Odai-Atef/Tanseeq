export const ar = {
  intro: {
    slide1: {
      title: "نظم منزلك بسهولة",
      description: "أنشئ وعين المهام المنزلية بسهولة. ابق على اطلاع بكل شيء من التنظيف إلى التسوق."
    },
    slide2: {
      title: "خطط أسبوعك بوضوح",
      description: "تصور جدولك الزمني، وتتبع التقدم في الوقت الفعلي، ولا تفوت أي شيء مع تقويمك اليومي لمهام المنزل."
    },
    slide3: {
      title: "مكّن عائلتك من التعاون",
      description: "ادعُ أفراد الأسرة للانضمام والعاملات المنزلية إلى نظام منزلك والمساهمة في إدارة منزل جيد."
    },
    skip: "تخطي",
    next: "التالي",
    done: "ابدأ الآن"
  },
  common: {
    loading: 'جاري التحميل...',
    toast: {
      info:"تنبية",
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
      },
      task: {
        created: 'تم إنشاء المهمة بنجاح',
        updated: 'تم تحديث المهمة بنجاح',
        error: {
          create: 'فشل في إنشاء المهمة',
          update: 'فشل في تحديث المهمة',
          validation: 'يرجى التحقق من تفاصيل المهمة',
          permission: 'تم رفض الإذن لهذه المهمة'
        }
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
    status: {
      active: 'نشط',
      inactive: 'غير نشط',
      inProgress: 'قيد التنفيذ',
      done: 'مكتمل',
      notStarted: 'لم يبدأ',
      'not-started': 'لم يبدأ',
      cancelled:"ملغي"
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
    appleSignIn: 'تسجيل الدخول باستخدام آبل',
    apple: {
      dataStored: 'تم تخزين بيانات مستخدم آبل للاستخدام في المستقبل',
      dataRetrieved: 'تم استرجاع البيانات المخزنة لمستخدم آبل',
      storeError: 'خطأ في تخزين بيانات مستخدم آبل',
      retrieveError: 'خطأ في استرجاع بيانات مستخدم آبل المخزنة'
    }
  },
  dashboard: {
    greeting: 'مرحباً، {name}!',
    subGreeting: 'هيا نكمل مهامك',
    myHomes: 'منازلي',
    todayTasks: 'مهام اليوم',
    progressTitle: 'تقدم مهام اليوم',
    tasksCompleted: 'تم إكمال {completed} من {total} مهام',
    noTasks: 'لا توجد مهام لليوم',
    noInProgress: 'لا توجد مهام قيد التنفيذ أو مكتملة',
    tour: {
      myHomes: "لكل مستخدم منزله الخاص. يمكنك دعوة الآخرين إلى منزلك أو الانضمام إلى منزل شخص آخر.\n انقر على منزل لتعيينه كمنزلك الافتراضي.\n سوف يتم عرض جميع المهام وجداول المهام في الصفحات الاخرى للمنزل الافتراضي المختار",
      progressSection: "يوضح شريط التقدم هذا حالة إكمال المهمة لهذا اليوم للمنزل المحدد.",
      taskSection: "هنا يمكنك رؤية أحدث المهام قيد التنفيذ والمهام المكتملة والمهام التي لم تبدأ بعد.",
      footer: "من هنا يمكنك الانضمام إلى المنزل \nدعوة افراد العائلة و العاملات المنزليات للانضمام إلى منزلك\nإنشاء مهام \n جدولة المهام \nمشاهدة التقويم.",
      next: "التالي",
      finish: "إنهاء"
    }
  },
  tasks: {
    title: 'المهام',
    emptyMessage: 'خطط مهمتك،\nقم بإنشاء مهمة لإدارة وتتبع منزلك بسهولة وفورية وبشكل رائع',
    addTaskButton: 'إضافة مهمة',
    searchPlaceholder: 'البحث عن المهام بالعنوان أو الوصف...',
    noSearchResults: 'لا توجد مهام تطابق بحثك',
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
        sunday: 'الأحد',
        monday: 'الإثنين',
        tuesday: 'الثلاثاء',
        wednesday: 'الأربعاء',
        thursday: 'الخميس',
        friday: 'الجمعة',
        saturday: 'السبت'
      }
    },
    edit:{
      "title": "تعديل المهمة",
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
      historicalLogs: 'السجلات التاريخية',
      noLogs: 'لا توجد سجلات تاريخية متاحة',
      notFound: 'لم يتم العثور على المهمة',
      deleteConfirmation: {
        title: 'حذف المهمة',
        message: 'هل أنت متأكد أنك تريد حذف هذه المهمة؟ سيؤدي هذا إلى تعيين حالة المهمة إلى غير نشط.',
        cancel: 'إلغاء',
        confirm: 'حذف'
      }
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
  },
  notFound: {
    title: 'غير موجود',
    message: 'هذه الصفحة غير موجودة.',
    goHome: 'الذهاب إلى الصفحة الرئيسية!'
  }
};
