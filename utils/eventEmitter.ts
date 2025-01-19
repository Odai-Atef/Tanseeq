import { EventEmitter } from 'events';

class GlobalEventEmitter extends EventEmitter {
  private static instance: GlobalEventEmitter;

  private constructor() {
    super();
  }

  public static getInstance(): GlobalEventEmitter {
    if (!GlobalEventEmitter.instance) {
      GlobalEventEmitter.instance = new GlobalEventEmitter();
    }
    return GlobalEventEmitter.instance;
  }
}

export const eventEmitter = GlobalEventEmitter.getInstance();
export const EVENTS = {
  DEFAULT_HOME_CHANGED: 'DEFAULT_HOME_CHANGED'
} as const;
