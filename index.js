import { registerRootComponent } from 'expo';
import App from './App';

// 👇 Import your FCM utils
import { setupBackgroundNotificationHandler } from './src/utils/firebaseMessaging';

// 👇 Register background handler outside of React
setupBackgroundNotificationHandler();

// Register main app
registerRootComponent(App);
