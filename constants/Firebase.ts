// Firebase configuration constants
// These values are required even if the app only receives notifications
// This configuration is needed to initialize the Firebase app properly
export const FIREBASE_CONFIG = {
  // You'll need to replace these values with your actual Firebase project configuration
  // from the Firebase console (https://console.firebase.google.com/)
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "tanseeq-app",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "1078602923233",
  appId: "YOUR_APP_ID",
  // measurementId is optional if you're not using Firebase Analytics
  measurementId: "YOUR_MEASUREMENT_ID" // Optional if not using Analytics
};

// Note: Even though your app only receives notifications and doesn't send them,
// the Firebase initialization still requires these configuration values to
// properly set up the FCM client that will receive the notifications.
