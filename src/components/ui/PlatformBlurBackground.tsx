import { theme } from "@/src/theme/theme";
import { BlurView } from "expo-blur";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

type Props = {
  /** BlurView intensity on iOS. Defaults to 80. */
  intensity?: number;
  /** BlurView tint on iOS. Defaults to "light". */
  tint?: "light" | "dark" | "default" | "systemChromeMaterial";
};

/**
 * Absolute-fill background that uses iOS BlurView for translucency, and a
 * solid system background on Android where blur is not reliable.
 */
export const PlatformBlurBackground = React.memo(
  function PlatformBlurBackground({ intensity = 80, tint = "light" }: Props) {
    if (Platform.OS === "ios") {
      return (
        <BlurView intensity={intensity} tint={tint} style={StyleSheet.absoluteFill} />
      );
    }
    return (
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: theme.colors.ios.systemBackground },
        ]}
      />
    );
  },
);
