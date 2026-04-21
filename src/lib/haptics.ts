import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

// iOS-only: Android haptics are noisy and inconsistent across OEMs.
const isIOS = Platform.OS === "ios";

const fire = (fn: () => Promise<void>) => {
  if (!isIOS) return;
  fn().catch(() => {
    // Haptics can reject on simulators or low-battery mode. Silent by design.
  });
};

export const haptic = {
  selection: () => fire(() => Haptics.selectionAsync()),
  tap:       () => fire(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)),
  press:     () => fire(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)),
  heavy:     () => fire(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)),
  success:   () => fire(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)),
  warning:   () => fire(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)),
  error:     () => fire(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)),
};
