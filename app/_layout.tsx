import { ToastHost } from "@/src/components/common/ToastHost";
import { queryClient } from "@/src/lib/queryClient";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import "../src/lib/i18n";

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
          </KeyboardProvider>
        </BottomSheetModalProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

export default RootLayout;
