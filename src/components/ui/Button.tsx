import { theme } from "@/src/theme/theme";
import React from "react";
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { Pressable } from "./Pressable";

export type ButtonVariant = "filled" | "tinted" | "plain" | "destructive";
export type ButtonSize = "small" | "medium" | "large";

type ButtonProps = {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

/**
 * iOS-native Button primitive.
 * Variants: filled (solid blue), tinted (blue-on-translucent-blue), plain (blue text), destructive.
 * Sizes: small (34pt), medium (44pt), large (50pt) — all HIG touch-target compliant.
 */
export const Button = React.memo(function Button({
  title,
  onPress,
  variant = "filled",
  size = "large",
  disabled = false,
  loading = false,
  leading,
  trailing,
  style,
  textStyle,
}: ButtonProps) {
  const isInteractive = !disabled && !loading;
  const containerStyle = SIZE_CONTAINER[size];
  const textBaseStyle = SIZE_TEXT[size];
  const variantContainer = VARIANT_CONTAINER[variant];
  const variantText = VARIANT_TEXT[variant];
  const spinnerColor = VARIANT_SPINNER[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={!isInteractive}
      haptic={variant === "plain" ? "selection" : "tap"}
      style={[
        styles.base,
        containerStyle,
        variantContainer,
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={spinnerColor} />
      ) : (
        <View style={styles.content}>
          {leading ? <View style={styles.leading}>{leading}</View> : null}
          <Text numberOfLines={1} style={[textBaseStyle, variantText, textStyle]}>
            {title}
          </Text>
          {trailing ? <View style={styles.trailing}>{trailing}</View> : null}
        </View>
      )}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  disabled: { opacity: 0.4 },
  content: { flexDirection: "row", alignItems: "center" },
  leading:  { marginRight: 8 },
  trailing: { marginLeft: 8 },

  // Size: container
  sizeSmallContainer:  { height: 34, paddingHorizontal: 14, borderRadius: theme.radius.md },
  sizeMediumContainer: { height: 44, paddingHorizontal: 18, borderRadius: theme.radius.md },
  sizeLargeContainer:  { height: 50, paddingHorizontal: 22, borderRadius: theme.radius.lg },

  // Size: text
  sizeSmallText:  { fontSize: 15, fontWeight: "600", letterSpacing: -0.24 },
  sizeMediumText: { fontSize: 16, fontWeight: "600", letterSpacing: -0.32 },
  sizeLargeText:  { fontSize: 17, fontWeight: "600", letterSpacing: -0.41 },

  // Variant: container
  variantFilledContainer:      { backgroundColor: theme.colors.ios.blue },
  variantTintedContainer:      { backgroundColor: "rgba(0,122,255,0.15)" },
  variantPlainContainer:       { backgroundColor: "transparent" },
  variantDestructiveContainer: { backgroundColor: theme.colors.ios.destructive },

  // Variant: text
  variantFilledText:      { color: "#FFFFFF" },
  variantTintedText:      { color: theme.colors.ios.blue },
  variantPlainText:       { color: theme.colors.ios.blue },
  variantDestructiveText: { color: "#FFFFFF" },
});

const SIZE_CONTAINER = {
  small:  styles.sizeSmallContainer,
  medium: styles.sizeMediumContainer,
  large:  styles.sizeLargeContainer,
} as const;

const SIZE_TEXT = {
  small:  styles.sizeSmallText,
  medium: styles.sizeMediumText,
  large:  styles.sizeLargeText,
} as const;

const VARIANT_CONTAINER = {
  filled:      styles.variantFilledContainer,
  tinted:      styles.variantTintedContainer,
  plain:       styles.variantPlainContainer,
  destructive: styles.variantDestructiveContainer,
} as const;

const VARIANT_TEXT = {
  filled:      styles.variantFilledText,
  tinted:      styles.variantTintedText,
  plain:       styles.variantPlainText,
  destructive: styles.variantDestructiveText,
} as const;

const VARIANT_SPINNER = {
  filled:      "#FFFFFF",
  tinted:      theme.colors.ios.blue,
  plain:       theme.colors.ios.blue,
  destructive: "#FFFFFF",
} as const;
