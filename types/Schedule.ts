import { Task } from './Task';

export type TaskStatus = 'Done' | 'Not-Started' | 'In-progress';

export class Schedule {
  id: string;
  day: string;
  start_time: string;
  end_time: string;
  status: TaskStatus;
  task: Task;

  constructor(data: any) {
    this.id = data.id;
    this.day = data.day;
    this.start_time = data.start_time;
    this.end_time = data.end_time;
    this.status = data.status;
    this.task = data.task instanceof Task ? data.task : Task.fromAPI(data.task);
  }

  // Format time to AM/PM format
  getFormattedStartTime(): string {
    return this.formatTime(this.start_time);
  }

  getFormattedEndTime(): string {
    return this.formatTime(this.end_time);
  }

  private formatTime(time: string): string {
    try {
      return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return time;
    }
  }

  // Create a new Schedule instance from API response
  static fromAPI(data: any): Schedule {
    return new Schedule(data);
  }

  // Convert Schedule to API format
  toAPI(): any {
    return {
      id: this.id,
      day: this.day,
      start_time: this.start_time,
      end_time: this.end_time,
      status: this.status,
      task: this.task.toAPI()
    };
  }

  // Clone the schedule
  clone(): Schedule {
    return new Schedule({
      id: this.id,
      day: this.day,
      start_time: this.start_time,
      end_time: this.end_time,
      status: this.status,
      task: this.task.clone()
    });
  }
}
