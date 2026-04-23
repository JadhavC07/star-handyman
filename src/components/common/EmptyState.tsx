import { theme } from "@/src/theme/theme";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  subtitle?: string;
};

export const EmptyState = React.memo(function EmptyState({ icon, title, subtitle }: Props) {
  return (
    <View style={ss.wrap}>
      <View style={ss.iconBg}>
        <Feather name={icon} size={34} color={theme.colors.textMuted} />
      </View>
      <Text style={ss.title}>{title}</Text>
      {subtitle ? <Text style={ss.sub}>{subtitle}</Text> : null}
    </View>
  );
});

const ss = StyleSheet.create({
  wrap: {
    alignItems: "center",
    marginTop: 60,
    paddingHorizontal: 40,
  },
  iconBg: {
    width: 88,
    height: 88,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.lg,
  },
  title: {
    ...theme.typography.ios.headline,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs + 2,
  },
  sub: {
    ...theme.typography.ios.footnote,
    color: theme.colors.textMuted,
    textAlign: "center",
    lineHeight: 18,
  },
});
