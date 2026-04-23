import { theme } from "@/src/theme/theme";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  icon: keyof typeof Feather.glyphMap;
  iconColor: string;
  label: string;
  children?: React.ReactNode;
  value?: string;
  valueColor?: string;
};

export function InfoRow({ icon, iconColor, label, children, value, valueColor }: Props) {
  return (
    <View style={[ss.row, (value != null) && ss.rowSpaced]}>
      <View style={ss.left}>
        <View style={[ss.iconCircle, { backgroundColor: `${iconColor}22` }]}>
          <Feather name={icon} size={16} color={iconColor} />
        </View>
        <Text style={ss.label}>{label}</Text>
      </View>
      {value != null ? (
        <Text style={[ss.value, valueColor ? { color: valueColor } : null]}>{value}</Text>
      ) : (
        <View style={ss.rightChildren}>{children}</View>
      )}
    </View>
  );
}

const ss = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.md + 2,
    gap: theme.spacing.md,
    flexWrap: "wrap",
  },
  rowSpaced: {
    justifyContent: "space-between",
    flexWrap: "nowrap",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    ...theme.typography.ios.subhead,
    fontWeight: "500",
    color: theme.colors.textPrimary,
  },
  value: {
    ...theme.typography.ios.footnote,
    fontWeight: "500",
    color: theme.colors.textSecondary,
  },
  rightChildren: { flex: 1 },
});
