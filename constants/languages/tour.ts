import { Language } from './index';

type TourTexts = {
  [key in Language]: {
    dashboard: {
      myHomes: string;
      progressSection: string;
      taskSection: string;
    };
    footer: {
      addButton: string;
    };
  };
};

export const tourTexts: TourTexts = {
  en: {
    dashboard: {
      myHomes: "Each user has their own home. You can invite others to your home or join someone else's home. Click on a home to set it as your default.",
      progressSection: "This progress bar shows your task completion status for today.",
      taskSection: "Here you can see your most recent in-progress tasks, completed tasks, and tasks that haven't started yet.",
    },
    footer: {
      addButton: "From here you can join home, invite housemaids family to join your home, create task, schedule a task and see the calendar.",
    }
  },
  ar: {
    dashboard: {
      myHomes: "لكل مستخدم منزله الخاص. يمكنك دعوة الآخرين إلى منزلك أو الانضمام إلى منزل شخص آخر. انقر على منزل لتعيينه كمنزلك الافتراضي.",
      progressSection: "يوضح شريط التقدم هذا حالة إكمال المهمة لهذا اليوم.",
      taskSection: "هنا يمكنك رؤية أحدث المهام قيد التنفيذ والمهام المكتملة والمهام التي لم تبدأ بعد.",
    },
    footer: {
      addButton: "من هنا يمكنك الانضمام إلى المنزل، ودعوة عائلة العاملات المنزليات للانضمام إلى منزلك، وإنشاء مهمة، وجدولة مهمة ومشاهدة التقويم.",
    }
  }
};

export const getTourText = (language: Language, key: string): string => {
  const parts = key.split('.');
  let current: any = tourTexts[language];
  
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return key;
    }
  }
  
  return typeof current === 'string' ? current : key;
};
