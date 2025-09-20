// Firebase configuration constants
// These values are required even if the app only receives notifications
// This configuration is needed to initialize the Firebase app properly
export const FIREBASE_CONFIG = {
  // You'll need to replace these values with your actual Firebase project configuration
  // from the Firebase console (https://console.firebase.google.com/)
 apiKey: "AIzaSyA9kwufgmYL1zzG-mrGAaY696ZgS7B8V4c",
  authDomain: "tanseeq-pushnotification.firebaseapp.com",
  projectId: "tanseeq-pushnotification",
  storageBucket: "tanseeq-pushnotification.firebasestorage.app",
  messagingSenderId: "887468193862",
  appId: "1:887468193862:web:265fc72b040b5434de3247",
  databaseURL: "https://tanseeq-app-default-rtdb.firebaseio.com"  // ✅ Add this

};

// Note: Even though your app only receives notifications and doesn't send them,
// the Firebase initialization still requires these configuration values to
// properly set up the FCM client that will receive the notifications.