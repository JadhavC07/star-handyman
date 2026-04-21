import { Ionicons } from "@expo/vector-icons";
import { SymbolView, SymbolWeight } from "expo-symbols";
import React from "react";
import { ColorValue, Platform } from "react-native";
import type { SFSymbol } from "sf-symbols-typescript";

// Map of commonly-used SF Symbols → Ionicons names for Android fallback.
// Any symbol not in this map falls back to a best-effort Ionicons name conversion.
const IONICONS_MAP: Partial<Record<SFSymbol, keyof typeof Ionicons.glyphMap>> = {
  "chevron.left":        "chevron-back",
  "chevron.right":       "chevron-forward",
  "chevron.up":          "chevron-up",
  "chevron.down":        "chevron-down",
  "xmark":               "close",
  "xmark.circle":        "close-circle-outline",
  "xmark.circle.fill":   "close-circle",
  "checkmark":           "checkmark",
  "checkmark.circle":    "checkmark-circle-outline",
  "checkmark.circle.fill": "checkmark-circle",
  "bell":                "notifications-outline",
  "bell.fill":           "notifications",
  "magnifyingglass":     "search",
  "cart":                "cart-outline",
  "cart.fill":           "cart",
  "star":                "star-outline",
  "star.fill":           "star",
  "heart":               "heart-outline",
  "heart.fill":          "heart",
  "person":              "person-outline",
  "person.fill":         "person",
  "person.circle":       "person-circle-outline",
  "person.circle.fill":  "person-circle",
  "calendar":            "calendar-outline",
  "location":            "location-outline",
  "location.fill":       "location",
  "mappin":              "location-outline",
  "mappin.and.ellipse":  "location-outline",
  "house":               "home-outline",
  "house.fill":          "home",
  "gear":                "settings-outline",
  "gearshape":           "settings-outline",
  "gearshape.fill":      "settings",
  "lock":                "lock-closed-outline",
  "lock.fill":           "lock-closed",
  "envelope":            "mail-outline",
  "envelope.fill":       "mail",
  "phone":               "call-outline",
  "phone.fill":          "call",
  "eye":                 "eye-outline",
  "eye.slash":           "eye-off-outline",
  "arrow.right":         "arrow-forward",
  "arrow.left":          "arrow-back",
  "arrow.up":            "arrow-up",
  "arrow.down":          "arrow-down",
  "plus":                "add",
  "minus":               "remove",
  "trash":               "trash-outline",
  "trash.fill":          "trash",
  "info.circle":         "information-circle-outline",
  "info.circle.fill":    "information-circle",
  "exclamationmark.triangle": "warning-outline",
  "exclamationmark.triangle.fill": "warning",
  "exclamationmark.circle": "alert-circle-outline",
  "exclamationmark.circle.fill": "alert-circle",
  "square.and.arrow.up": "share-outline",
  "ellipsis":            "ellipsis-horizontal",
  "line.3.horizontal":   "menu",
  "line.3.horizontal.decrease": "filter-outline",
  "slider.horizontal.3": "options-outline",
  "creditcard":          "card-outline",
  "creditcard.fill":     "card",
  "doc.text":            "document-text-outline",
  "clock":               "time-outline",
  "clock.fill":          "time",
};

type IconProps = {
  name: SFSymbol;
  size?: number;
  color?: ColorValue;
  weight?: SymbolWeight;
};

/**
 * Cross-platform icon primitive.
 * - iOS: renders native `SymbolView` (SF Symbol).
 * - Android: renders the mapped Ionicons equivalent.
 *
 * Use SF Symbol names (e.g. "chevron.right", "bell.fill").
 * If a symbol isn't in IONICONS_MAP, add it there.
 */
export const Icon = React.memo(function Icon({
  name,
  size = 20,
  color = "#000",
  weight = "regular",
}: IconProps) {
  // For unmapped symbols we best-effort convert dots to dashes, otherwise
  // rendering would hard-crash in dev on Android.
  const fallbackName =
    IONICONS_MAP[name] ??
    (name.replace(/\./g, "-") as keyof typeof Ionicons.glyphMap);

  const fallback = (
    <Ionicons name={fallbackName} size={size} color={color} />
  );

  if (Platform.OS !== "ios") return fallback;

  return (
    <SymbolView
      name={name}
      size={size}
      tintColor={color}
      weight={weight}
      fallback={fallback}
    />
  );
});
