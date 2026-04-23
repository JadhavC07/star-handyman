import { haptic } from "@/src/lib/haptics";
import { theme } from "@/src/theme/theme";
import { Feather, Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type MenuItem = {
  key: string;
  label: string;
  iconName: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  onPress: () => void;
};

type Props = { items: MenuItem[] };

export function ProfileMenuList({ items }: Props) {
  return (
    <View style={ss.card}>
      {items.map((item, index) => (
        <React.Fragment key={item.key}>
          <TouchableOpacity
            style={ss.row}
            activeOpacity={0.7}
            onPress={() => { haptic.selection(); item.onPress(); }}
          >
            <View style={[ss.iconCircle, { backgroundColor: item.iconBg }]}>
              <Ionicons name={item.iconName} size={16} color={theme.colors.surface} />
            </View>
            <Text style={ss.label}>{item.label}</Text>
            <Feather name="chevron-right" size={16} color={theme.colors.textMuted} />
          </TouchableOpacity>
          {index < items.length - 1 && <View style={ss.divider} />}
        </React.Fragment>
      ))}
    </View>
  );
}

const ss = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xxl,
    ...theme.shadows.small,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.md + 2,
    gap: theme.spacing.md + 2,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    flex: 1,
    ...theme.typography.ios.subhead,
    color: theme.colors.textPrimary,
  },
  divider: {
    height: theme.hairline,
    backgroundColor: theme.colors.border,
    marginLeft: 50,
  },
});
