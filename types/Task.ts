export interface TaskImage {
  id: string;
  filename_download: string;
}

export class Task {
  id: number;
  property_id: string; // UUID of the property/home
  status: string;
  user_created: string;
  date_created: string;
  user_updated: string | null;
  date_updated: string | null;
  name: string;
  description: string | null;
  private _images: TaskImage[] | null;
  repeat_days: string[];
  repeat_monthly: string;

  constructor(data: any) {
    this.id = data.id;
    this.property_id = data.property_id;
    this.status = data.status;
    this.user_created = data.user_created;
    this.date_created = data.date_created;
    this.user_updated = data.user_updated;
    this.date_updated = data.date_updated;
    this.name = data.name;
    this.description = data.description;
    this._images = data.images;
    this.repeat_days = data.repeat_days || [];
    this.repeat_monthly = data.repeat_monthly;
  }

  get images(): TaskImage[] | null {
    return this._images;
  }

  set images(value: TaskImage[] | string | null) {
    if (typeof value === 'string') {
      this._images = [{ id: value, filename_download: value }];
    } else {
      this._images = value;
    }
  }

  // Format the created date to a readable string
  getFormattedCreatedDate(): string {
    return new Date(this.date_created).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Format the updated date to a readable string
  getFormattedUpdatedDate(): string | null {
    if (!this.date_updated) return null;
    return new Date(this.date_updated).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Get repeat days as day names
  getRepeatDayNames(): string[] {
    const dayMap: { [key: string]: string } = {
      '2': 'Monday',
      '3': 'Tuesday',
      '4': 'Wednesday',
      '5': 'Thursday',
      '6': 'Friday',
      '7': 'Saturday',
      '1': 'Sunday'
    };
    return this.repeat_days.map(day => dayMap[day] || day);
  }

  // Create a new Task instance from API response
  static fromAPI(data: any): Task {
    return new Task(data);
  }

  // Convert Task to API format for sending to server
  toAPI(): {
    id: number;
    property_id: string;
    status: string;
    name: string;
    description: string | null;
    images: string | null;
    repeat_days: string[];
    repeat_monthly: string;
  } {
    return {
      id: this.id,
      property_id: this.property_id,
      status: this.status,
      name: this.name,
      description: this.description,
      images: this._images && this._images.length > 0 ? this._images[0].id : null,
      repeat_days: this.repeat_days,
      repeat_monthly: this.repeat_monthly
    };
  }

  // Create a copy of the task
  clone(): Task {
    return new Task({
      id: this.id,
      property_id: this.property_id,
      status: this.status,
      user_created: this.user_created,
      date_created: this.date_created,
      user_updated: this.user_updated,
      date_updated: this.date_updated,
      name: this.name,
      description: this.description,
      images: this._images ? [...this._images] : null,
      repeat_days: [...this.repeat_days],
      repeat_monthly: this.repeat_monthly
    });
  }

  // Check if the task is active
  isActive(): boolean {
    return this.status === 'Active';
  }

  // Check if the task repeats on a specific day
  repeatsOnDay(day: string): boolean {
    return this.repeat_days.includes(day);
  }

  // Get the monthly repeat day as a number
  getMonthlyRepeatDay(): number {
    return parseInt(this.repeat_monthly, 10);
  }

  // Get formatted repeat schedule with translations
  getRepeatFormat(t?: (key: string, params?: Record<string, string>) => string): string {
    const monthlyValue = parseInt(this.repeat_monthly, 10);
    
    // If translation function is not provided, use default English strings
    if (!t) {
      if (monthlyValue === -1) {
        return "No Schedule";
      }
      
      if (monthlyValue === 1) {
        return "Every day";
      }

      const repeatMapping: { [key: number]: string } = {
        7: "Every week at",
        14: "Every two weeks at",
        28: "Every month at",
        90: "Every three months at",
        180: "Every six months at",
        360: "Every year at"
      };

      const prefix = repeatMapping[monthlyValue] || "";
      if (!prefix) return "";

      const dayNames = this.getRepeatDayNames();
      return `${prefix} ${dayNames.join(', ')}`;
    }
    
    // Using translations
    if (monthlyValue === -1) {
      return t('tasks.add.periods.manual');
    }
    
    if (monthlyValue === 1) {
      return t('tasks.add.periods.daily');
    }

    const repeatMapping: { [key: number]: string } = {
      7: t('tasks.add.periods.weekly'),
      14: t('tasks.add.periods.biWeekly'),
      28: t('tasks.add.periods.monthly'),
      90: t('tasks.add.periods.quarterly'),
      180: t('tasks.add.periods.biAnnually'),
      360: t('tasks.add.periods.annually')
    };

    const prefix = repeatMapping[monthlyValue] || "";
    if (!prefix) return "";

    // Get translated day names
    const dayNames = this.repeat_days.map(day => {
      const dayMap: { [key: string]: string } = {
        '1': t('tasks.add.days.sunday'),
        '2': t('tasks.add.days.monday'),
        '3': t('tasks.add.days.tuesday'),
        '4': t('tasks.add.days.wednesday'),
        '5': t('tasks.add.days.thursday'),
        '6': t('tasks.add.days.friday'),
        '7': t('tasks.add.days.saturday')
      };
      return dayMap[day] || day;
    });
    
    return `${prefix} ${dayNames.join(', ')}`;
  }

  // Validate task data
  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.name?.trim()) {
      errors.push('Task name is required');
    }

    if (!this.repeat_monthly) {
      errors.push('Monthly repeat day is required');
    } else if (this.repeat_monthly !== '1' && this.repeat_monthly !== '-1' && this.repeat_days.length === 0) {
      // Only require repeat days if not set to "Every Day" or "No Schedule"
      errors.push('At least one repeat day is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
