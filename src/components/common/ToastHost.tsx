import { Icon } from "@/src/components/ui/Icon";
import { PlatformBlurBackground } from "@/src/components/ui/PlatformBlurBackground";
import { Toast, useToastStore } from "@/src/lib/toast";
import { theme } from "@/src/theme/theme";
import React, { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  SlideInUp,
  SlideOutUp,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { SFSymbol } from "sf-symbols-typescript";

const VARIANT_STYLES: Record<
  Toast["variant"],
  { tint: string; icon: SFSymbol }
> = {
  error:   { tint: theme.colors.ios.destructive, icon: "exclamationmark.circle.fill" },
  success: { tint: theme.colors.ios.success,     icon: "checkmark.circle.fill" },
  info:    { tint: theme.colors.ios.blue,        icon: "info.circle.fill" },
};

function ToastItem({ toast }: { toast: Toast }) {
  const dismiss = useToastStore((s) => s.dismiss);
  const { tint, icon } = VARIANT_STYLES[toast.variant];

  useEffect(() => {
    const t = setTimeout(() => dismiss(toast.id), toast.duration);
    return () => clearTimeout(t);
  }, [toast.id, toast.duration, dismiss]);

  return (
    <Animated.View
      entering={SlideInUp.duration(220).easing(Easing.out(Easing.quad))}
      exiting={SlideOutUp.duration(180).easing(Easing.in(Easing.quad))}
      style={styles.toast}
    >
      <PlatformBlurBackground />
      <Icon name={icon} size={20} color={tint} />
      <Text style={styles.message} numberOfLines={3}>
        {toast.message}
      </Text>
      <Pressable hitSlop={8} onPress={() => dismiss(toast.id)}>
        <Icon name="xmark" size={16} color={theme.colors.ios.secondaryLabel} />
      </Pressable>
    </Animated.View>
  );
}

export function ToastHost() {
  const toasts = useToastStore((s) => s.toasts);
  const insets = useSafeAreaInsets();

  if (toasts.length === 0) return null;

  return (
    <View
      pointerEvents="box-none"
      style={[styles.host, { top: insets.top + 8 }]}
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: "absolute",
    left: theme.spacing.lg,
    right: theme.spacing.lg,
    zIndex: 9999,
    gap: theme.spacing.sm,
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: 14,
    overflow: "hidden",
    ...theme.shadows.medium,
  },
  message: {
    flex: 1,
    color: theme.colors.ios.label,
    fontSize: 15,
    fontWeight: "500",
    letterSpacing: -0.24,
  },
});
