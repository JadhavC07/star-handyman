import { theme } from "@/src/theme/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  onSendQuote: () => void;
  onAccept: () => void;
  acceptLabel?: string;
};

export function JobDetailsBottomBar({ onSendQuote, onAccept, acceptLabel = "Accept Job" }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[ss.bar, { paddingBottom: Math.max(insets.bottom+5, theme.spacing.md) }]}>
      <TouchableOpacity style={ss.secondary} onPress={onSendQuote} activeOpacity={0.8}>
        <Ionicons name="chatbubble-outline" size={18} color={theme.colors.primary} />
        <Text style={ss.secondaryText}>Send Quote</Text>
      </TouchableOpacity>
      <TouchableOpacity style={ss.primary} onPress={onAccept} activeOpacity={0.8}>
        <Ionicons name="checkmark-circle" size={20} color={theme.colors.surface} />
        <Text style={ss.primaryText}>{acceptLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

const ss = StyleSheet.create({
  bar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderTopWidth: theme.hairline,
    borderTopColor: theme.colors.border,
  },
  secondary: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    paddingVertical: 15,
    borderRadius: theme.radius.lg,
    borderWidth: theme.hairline * 2,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.surface,
  },
  secondaryText: {
    ...theme.typography.ios.subhead,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  primary: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    paddingVertical: 15,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.primary,
    ...theme.shadows.medium,
  },
  primaryText: {
    ...theme.typography.ios.subhead,
    fontWeight: "700",
    color: theme.colors.surface,
  },
});
