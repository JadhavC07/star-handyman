import { haptic } from "@/src/lib/haptics";
import { theme } from "@/src/theme/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  title: string;
  subtitle: string;
  ctaLabel: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  onPress: () => void;
};

export const PromoCard = React.memo(function PromoCard({ title, subtitle, ctaLabel, icon = "clipboard-list", onPress }: Props) {
  return (
    <TouchableOpacity
      style={ss.card}
      activeOpacity={0.85}
      onPress={() => { haptic.selection(); onPress(); }}
    >
      <View style={ss.iconCircle}>
        <MaterialCommunityIcons name={icon} size={22} color={theme.colors.surface} />
      </View>
      <View style={ss.text}>
        <Text style={ss.title}>{title}</Text>
        <Text style={ss.sub}>{subtitle}</Text>
      </View>
      <View style={ss.cta}>
        <Text style={ss.ctaText}>{ctaLabel}</Text>
      </View>
    </TouchableOpacity>
  );
});

const ss = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    borderWidth: theme.hairline,
    borderColor: theme.colors.borderLight,
    ...theme.shadows.small,
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  text: { flex: 1 },
  title: {
    ...theme.typography.ios.footnote,
    fontWeight: "700",
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  sub: {
    ...theme.typography.ios.caption1,
    color: theme.colors.textSecondary,
    lineHeight: 17,
  },
  cta: {
    borderWidth: theme.hairline * 2,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm - 1,
  },
  ctaText: {
    ...theme.typography.ios.caption1,
    color: theme.colors.primary,
    fontWeight: "600",
  },
});
