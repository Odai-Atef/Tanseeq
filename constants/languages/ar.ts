export const ar = {
  common: {
    loading: 'جاري التحميل...',
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
      viewAll: 'عرض الكل'
    }
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
      }
    },
    view: {
      title: 'تفاصيل المهمة',
      status: 'الحالة',
      createdAt: 'تم الإنشاء في',
      updatedAt: 'تم التحديث في'
    },
    calendar: {
      title: 'التقويم',
      noEvents: 'لا توجد أحداث للتاريخ المحدد'
    }
  },
  schedules: {
    title: 'الجداول',
    add: {
      title: 'إضافة جدول',
      selectDate: 'اختر التاريخ',
      selectTask: 'اختر المهمة',
      noTasks: 'لا توجد مهام متاحة. يرجى إنشاء مهمة أولاً.',
      invalidDate: 'يرجى اختيار اليوم أو تاريخ مستقبلي'
    },
    view: {
      title: 'تفاصيل الجدول',
      task: 'المهمة',
      date: 'التاريخ',
      status: 'الحالة'
    }
  },
  footer: {
    home: 'الرئيسية',
    tasks: 'المهام',
    schedules: 'الجداول',
    profile: 'الملف الشخصي'
  }
};