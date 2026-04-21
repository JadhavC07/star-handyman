import { haptic } from "@/src/lib/haptics";
import { theme } from "@/src/theme/theme";
import React, { useCallback } from "react";
import {
  Pressable as RNPressable,
  PressableProps as RNPressableProps,
  StyleProp,
  ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(RNPressable);

export type HapticKind = "tap" | "selection" | "press" | "success" | "none";

type PressableProps = Omit<RNPressableProps, "style"> & {
  style?: StyleProp<ViewStyle>;
  /** Haptic fired on pressIn. Defaults to "tap". Pass "none" to disable. */
  haptic?: HapticKind;
  /** Scale on pressIn. Defaults to 0.97. Set to 1 to disable scale. */
  pressedScale?: number;
  children?: React.ReactNode;
};

/**
 * iOS-native feel pressable: Reanimated spring scale on pressIn, haptic on pressIn.
 */
export const Pressable = React.memo(function Pressable({
  style,
  haptic: hapticKind = "tap",
  pressedScale = 0.97,
  onPressIn,
  onPressOut,
  children,
  disabled,
  ...rest
}: PressableProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(
    (e: Parameters<NonNullable<RNPressableProps["onPressIn"]>>[0]) => {
      if (!disabled) {
        scale.value = withSpring(pressedScale, theme.motion.snappy);
        if (hapticKind !== "none") haptic[hapticKind]();
      }
      onPressIn?.(e);
    },
    [disabled, pressedScale, hapticKind, onPressIn, scale],
  );

  const handlePressOut = useCallback(
    (e: Parameters<NonNullable<RNPressableProps["onPressOut"]>>[0]) => {
      scale.value = withSpring(1, theme.motion.snappy);
      onPressOut?.(e);
    },
    [onPressOut, scale],
  );

  return (
    <AnimatedPressable
      {...rest}
      disabled={disabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[style, animatedStyle]}
    >
      {children}
    </AnimatedPressable>
  );
});
