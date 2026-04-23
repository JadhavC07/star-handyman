import { theme } from "@/src/theme/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
};

export function DetailCard({ icon, iconColor, title, right, children }: Props) {
  const color = iconColor ?? theme.colors.primary;
  return (
    <View style={ss.card}>
      <View style={ss.header}>
        <View style={[ss.iconCircle, { backgroundColor: `${color}22` }]}>
          <Ionicons name={icon} size={18} color={color} />
        </View>
        <Text style={ss.title}>{title}</Text>
        {right ? <View style={ss.right}>{right}</View> : null}
      </View>
      {children}
    </View>
  );
}

const ss = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    borderWidth: theme.hairline,
    borderColor: theme.colors.borderLight,
    ...theme.shadows.small,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm + 2,
    marginBottom: theme.spacing.md,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    ...theme.typography.ios.headline,
    color: theme.colors.textPrimary,
  },
  right: { marginLeft: "auto" },
});
