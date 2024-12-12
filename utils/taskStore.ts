import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Task {
  id: string;
  name: string;
  description: string;
  status: 'todo' | 'ongoing' | 'backlog';
  startDate: string;
  dueDate: string;
  createdAt: string;
}

const TASKS_STORAGE_KEY = '@tasks';

export const taskStore = {
  async getTasks(): Promise<Task[]> {
    try {
      const tasksJson = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
      return tasksJson ? JSON.parse(tasksJson) : [];
    } catch (error) {
      console.error('Error loading tasks:', error);
      return [];
    }
  },

  async addTask(task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> {
    try {
      const tasks = await this.getTasks();
      const newTask: Task = {
        ...task,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      
      await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify([...tasks, newTask]));
      return newTask;
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  },

  async updateTask(taskId: string, updates: Partial<Task>): Promise<Task | null> {
    try {
      const tasks = await this.getTasks();
      const taskIndex = tasks.findIndex(t => t.id === taskId);
      
      if (taskIndex === -1) return null;
      
      const updatedTask = {
        ...tasks[taskIndex],
        ...updates,
      };
      
      tasks[taskIndex] = updatedTask;
      await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
      
      return updatedTask;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  async deleteTask(taskId: string): Promise<boolean> {
    try {
      const tasks = await this.getTasks();
      const filteredTasks = tasks.filter(t => t.id !== taskId);
      
      await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(filteredTasks));
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },
};
