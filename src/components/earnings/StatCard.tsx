import { theme } from "@/src/theme/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  iconName: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  title: string;
  value: string;
  sub: string;
};

export function StatCard({ iconName, iconColor, title, value, sub }: Props) {
  return (
    <View style={ss.card}>
      <View style={[ss.iconBox, { backgroundColor: `${iconColor}22` }]}>
        <Ionicons name={iconName} size={22} color={iconColor} />
      </View>
      <Text style={ss.title}>{title}</Text>
      <Text style={ss.value}>{value}</Text>
      <Text style={ss.sub}>{sub}</Text>
    </View>
  );
}

const ss = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg + 2,
    padding: theme.spacing.md,
    borderWidth: theme.hairline,
    borderColor: theme.colors.borderLight,
    ...theme.shadows.small,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.sm + 2,
  },
  title: {
    ...theme.typography.ios.caption2,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    lineHeight: 14,
  },
  value: {
    fontSize: 20,
    fontWeight: "800",
    color: theme.colors.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  sub: {
    fontSize: 10,
    color: theme.colors.textMuted,
  },
});
