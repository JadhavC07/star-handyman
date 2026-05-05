import messaging from "@react-native-firebase/messaging";
import { PermissionsAndroid, Platform } from "react-native";

export const fcm = {
  async requestPermission(): Promise<boolean> {
    if (Platform.OS === "android") {
      if (Platform.Version >= 33) {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        return result === PermissionsAndroid.RESULTS.GRANTED;
      }
      // Android < 13: permission is granted at install time
      return true;
    }

    // iOS
    const authStatus = await messaging().requestPermission();
    return (
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL
    );
  },

  /**
   * Request permission + return FCM token.
   * Returns null if permission denied or on web.
   */
  async init(): Promise<string | null> {
    if (Platform.OS === "web") return null;

    const granted = await fcm.requestPermission();
    if (!granted) {
      console.warn("[FCM] Permission denied");
      return null;
    }

    const token = await messaging().getToken();
    if (__DEV__) console.log("[FCM] Token:", token);
    return token;
  },

  platform(): "android" | "ios" {
    return Platform.OS === "ios" ? "ios" : "android";
  },

  /**
   * Listen to foreground messages. Returns unsubscribe fn.
   */
  onForegroundMessage(handler: (msg: any) => void) {
    return messaging().onMessage(handler);
  },

  /**
   * Called when app opened from a background notification tap.
   * Returns unsubscribe fn.
   */
  onNotificationOpenedApp(handler: (msg: any) => void) {
    return messaging().onNotificationOpenedApp(handler);
  },

  /**
   * Check if app was launched from a killed-state notification.
   */
  async getInitialNotification() {
    return messaging().getInitialNotification();
  },

  /**
   * Background handler — must be registered outside React tree.
   */
  setBackgroundMessageHandler(handler: (msg: any) => Promise<void>) {
    messaging().setBackgroundMessageHandler(handler);
  },
};

export const logNotification = (
  source: "foreground" | "background" | "killed",
  msg: any,
) => {
  const notification = msg?.notification ?? {};
  const data = msg?.data ?? {};

  console.log(`\n🔔 [FCM:${source.toUpperCase()}]`);
  console.log("  title  :", notification.title ?? "—");
  console.log("  body   :", notification.body ?? "—");
  console.log("  type   :", data.type ?? "—");
  console.log("  data   :", JSON.stringify(data, null, 2));
  console.log("  raw    :", JSON.stringify(msg, null, 2));
};
