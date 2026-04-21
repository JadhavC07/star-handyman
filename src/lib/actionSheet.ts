import { ActionSheetIOS, Platform } from "react-native";

type ActionSheetOptions = {
  title?: string;
  message?: string;
  options: string[];
  cancelLabel?: string;
  destructiveIndex?: number;
};

/**
 * Imperative action sheet.
 * - iOS: native `ActionSheetIOS`.
 * - Android: no built-in equivalent is installed; callers should fall back to
 *   a custom <BottomSheet> menu. This helper returns null on Android and the
 *   caller is responsible for rendering a menu UI in that case.
 *
 * Returns the chosen index, or null if cancelled / unsupported.
 */
export function showActionSheet(
  opts: ActionSheetOptions,
): Promise<number | null> {
  if (Platform.OS !== "ios") {
    return Promise.resolve(null);
  }

  const {
    title,
    message,
    options,
    cancelLabel = "Cancel",
    destructiveIndex,
  } = opts;

  const allOptions = [...options, cancelLabel];
  const cancelIndex = allOptions.length - 1;

  return new Promise((resolve) => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        title,
        message,
        options: allOptions,
        cancelButtonIndex: cancelIndex,
        destructiveButtonIndex: destructiveIndex,
        userInterfaceStyle: "light",
      },
      (selectedIndex) => {
        if (selectedIndex === cancelIndex) {
          resolve(null);
        } else {
          resolve(selectedIndex);
        }
      },
    );
  });
}
