import { ToastHost } from "@/src/components/common/ToastHost";
import { fcm, logNotification } from "@/src/lib/fcm";
import { queryClient } from "@/src/lib/queryClient";
import { toast } from "@/src/lib/toast";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import "../src/lib/i18n";

fcm.setBackgroundMessageHandler(async (msg) => {
  // Background messages are auto-displayed by FCM on Android
  // No action needed unless you want custom handling
  logNotification("background", msg);
});

// Initialize before component — catches crashes
// Sentry.init({
//   dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
//   enableNative: !isRunningInExpoGo(),
//   environment: __DEV__ ? "development" : "production",
//   tracesSampleRate: __DEV__ ? 1.0 : 0.2,
//   enableLogs: true,
//   enableCaptureFailedRequests: true,
//   debug: __DEV__,
// });

// function RootLayout() {
//   return (
//     <Sentry.ErrorBoundary
//       fallback={({ error, resetError }) => (
//         <ErrorFallback error={error} resetError={resetError} />
//       )}
//     >
//       <GestureHandlerRootView style={{ flex: 1 }}>
//         <QueryClientProvider client={queryClient}>
//           <BottomSheetModalProvider>
//             <KeyboardProvider>
//               <StatusBar style="auto" />
//               <Stack
//                 screenOptions={{
//                   headerShown: false,
//                   animation: Platform.OS === "ios" ? "default" : "slide_from_right",
//                   gestureEnabled: true,
//                   fullScreenGestureEnabled: true,
//                 }}
//               />
//               <ToastHost />
//             </KeyboardProvider>
//           </BottomSheetModalProvider>
//         </QueryClientProvider>
//       </GestureHandlerRootView>
//     </Sentry.ErrorBoundary>
//   );
// }

// export default Sentry.wrap(RootLayout);

function RootLayout() {
  function NotificationBootstrap() {
    const qc = useQueryClient();

    useEffect(() => {
      // Foreground: show toast + refresh unread count
      const unsubFG = fcm.onForegroundMessage((msg) => {
        logNotification("foreground", msg);
        const { title, body } = msg.notification ?? {};
        if (title) toast.info(`${title}${body ? `: ${body}` : ""}`);
        qc.invalidateQueries({ queryKey: ["notifications"] });
      });

      // Background tap: refresh notifications
      const unsubBG = fcm.onNotificationOpenedApp((_msg) => {
        logNotification("foreground", _msg);
        qc.invalidateQueries({ queryKey: ["notifications"] });
        // TODO: navigate based on msg.data.type
      });

      // Killed state tap
      fcm.getInitialNotification().then((msg) => {
        logNotification("foreground", msg);
        if (!msg) return;
        qc.invalidateQueries({ queryKey: ["notifications"] });
        // TODO: navigate based on msg.data.type
      });

      return () => {
        unsubFG();
        unsubBG();
      };
    }, [qc]);

    return null;
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <BottomSheetModalProvider>
          <KeyboardProvider>
            <StatusBar style="auto" />
            <Stack
              screenOptions={{
                headerShown: false,
                animation:
                  Platform.OS === "ios" ? "default" : "slide_from_right",
                gestureEnabled: true,
                fullScreenGestureEnabled: true,
              }}
            />
            <ToastHost />
            <NotificationBootstrap />
          </KeyboardProvider>
        </BottomSheetModalProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

export default RootLayout;
