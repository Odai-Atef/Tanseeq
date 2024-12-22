export interface TaskImage {
  id: string;
  filename_download: string;
}

export class Task {
  id: number;
  status: string;
  user_created: string;
  date_created: string;
  user_updated: string | null;
  date_updated: string | null;
  name: string;
  description: string | null;
  images: TaskImage[] | null;
  repeat_days: string[];
  repeat_monthly: string;

  constructor(data: any) {
    this.id = data.id;
    this.status = data.status;
    this.user_created = data.user_created;
    this.date_created = data.date_created;
    this.user_updated = data.user_updated;
    this.date_updated = data.date_updated;
    this.name = data.name;
    this.description = data.description;
    this.images = data.images;
    this.repeat_days = data.repeat_days || [];
    this.repeat_monthly = data.repeat_monthly;
  }

  // Format the created date to a readable string
  getFormattedCreatedDate(): string {
    return new Date(this.date_created).toLocaleDateString('en-US', {
      month: 'long',
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
      '1': 'Monday',
      '2': 'Tuesday',
      '3': 'Wednesday',
      '4': 'Thursday',
      '5': 'Friday',
      '6': 'Saturday',
      '7': 'Sunday'
    };
    return this.repeat_days.map(day => dayMap[day] || day);
  }

  // Create a new Task instance from API response
  static fromAPI(data: any): Task {
    return new Task(data);
  }

  // Convert Task to API format for sending to server
  toAPI(): any {
    return {
      id: this.id,
      status: this.status,
      name: this.name,
      description: this.description,
      images: this.images,
      repeat_days: this.repeat_days,
      repeat_monthly: this.repeat_monthly
    };
  }

  // Create a copy of the task
  clone(): Task {
    return new Task({
      id: this.id,
      status: this.status,
      user_created: this.user_created,
      date_created: this.date_created,
      user_updated: this.user_updated,
      date_updated: this.date_updated,
      name: this.name,
      description: this.description,
      images: this.images ? [...this.images] : null,
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

  // Get formatted repeat schedule
  getRepeatFormat(): string {
    const monthlyValue = parseInt(this.repeat_monthly, 10);
    
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

  // Validate task data
  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.name?.trim()) {
      errors.push('Task name is required');
    }

    if (this.repeat_days.length === 0) {
      errors.push('At least one repeat day is required');
    }

    if (!this.repeat_monthly) {
      errors.push('Monthly repeat day is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
