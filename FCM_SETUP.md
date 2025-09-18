# Firebase Cloud Messaging (FCM) Setup Guide

This guide explains how to set up Firebase Cloud Messaging for your Tanseeq app.

## Prerequisites

1. A Firebase project created in the [Firebase Console](https://console.firebase.google.com/)
2. The app must be registered in Firebase for both Android and iOS platforms

## Configuration Steps

### 1. Update Firebase Configuration Files

Replace the placeholder values in the following files with your actual Firebase project details:

- `constants/Firebase.ts`: Update with your Firebase web configuration (required even if your app only receives notifications)
- `android/app/google-services.json`: Update with your Android configuration
- `ios/GoogleService-Info.plist`: Update with your iOS configuration

You can download these configuration files from the Firebase Console after registering your app.

**Important Note:** Even though your app only receives notifications and doesn't send them, you still need to fill in all the required Firebase configuration values. These values are necessary for the Firebase SDK to initialize properly and set up the FCM client that will receive the notifications.

### 2. Android Setup

1. Make sure the `google-services.json` file is placed in the `android/app/` directory
2. The app's package name in Firebase should match the one in `app.json` (currently `pro.tanseeq.app`)

### 3. iOS Setup

1. Make sure the `GoogleService-Info.plist` file is placed in the `ios/` directory
2. The bundle identifier in Firebase should match the one in `app.json` (currently `pro.tanseeq.app`)
3. Enable push notification capabilities in Xcode for your project

## Testing FCM

After setting up FCM, you can test it by:

1. Running the app on a device
2. Checking the dashboard to see if the FCM token is displayed
3. Sending a test notification from the Firebase Console to that token

## Troubleshooting

If you encounter issues with FCM:

1. Verify that the configuration files have the correct values
2. Check that the app has the necessary permissions
3. For iOS, ensure that push notification capabilities are enabled
4. Check the console logs for any error messages

## Additional Resources

- [Firebase Cloud Messaging Documentation](https://firebase.google.com/docs/cloud-messaging)
- [React Native Firebase Messaging Documentation](https://rnfirebase.io/messaging/usage)
