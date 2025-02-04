declare module 'react-native-onesignal' {
  export interface NotificationReceivedEvent {
    notification: {
      title?: string;
      body?: string;
      additionalData?: any;
      [key: string]: any;
    };
  }

  export interface OpenedEvent {
    notification: {
      title?: string;
      body?: string;
      additionalData?: any;
      [key: string]: any;
    };
  }

  export interface DeviceState {
    userId?: string;
    pushToken?: string;
    emailUserId?: string;
    emailAddress?: string;
    isSubscribed?: boolean;
    isPushDisabled?: boolean;
    [key: string]: any;
  }

  const OneSignal: {
    initialize(appId: string): void;
    setLogLevel(logLevel: number, visualLevel: number): void;
    setAppId(appId: string): void;
    setRequiresUserPrivacyConsent(required: boolean): void;
    provideUserConsent(granted: boolean): void;
    setExternalUserId(externalId: string | null): void;
    setLanguage(language: string): void;
    addTrigger(key: string, value: string | number | boolean): void;
    addTriggers(triggers: { [key: string]: string | number | boolean }): void;
    removeTrigger(key: string): void;
    removeTriggers(keys: string[]): void;
    getTriggers(): Promise<{ [key: string]: any }>;
    getTrigger(key: string): Promise<any>;
    setNotificationWillShowInForegroundHandler(
      handler: (event: NotificationReceivedEvent) => void
    ): void;
    setNotificationOpenedHandler(
      handler: (event: OpenedEvent) => void
    ): void;
    promptForPushNotificationsWithUserResponse(): Promise<boolean>;
    getDeviceState(): Promise<DeviceState>;
    disablePush(disable: boolean): void;
    clearOneSignalNotifications(): void;
  };

  export default OneSignal;
}
