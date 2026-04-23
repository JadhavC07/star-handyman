import { haptic } from "@/src/lib/haptics";
import { theme } from "@/src/theme/theme";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Period = "weekly" | "monthly" | "yearly";

type Props = {
  total: number;
  periodLabel: string;
  period: Period;
  onChangePeriod: (p: Period) => void;
};

export function EarningsHero({
  total,
  periodLabel,
  period,
  onChangePeriod,
}: Props) {
  return (
    <View style={ss.row}>
      <View>
        <Text style={ss.sub}>Total Earnings</Text>
        <Text style={ss.amount}>${total.toLocaleString()}</Text>
        <Text style={ss.period}>{periodLabel}</Text>
      </View>
      <View style={ss.toggle}>
        {(["weekly", "monthly", "yearly"] as Period[]).map((p) => (
          <TouchableOpacity
            key={p}
            style={[ss.toggleBtn, period === p && ss.toggleBtnActive]}
            onPress={() => {
              haptic.selection();
              onChangePeriod(p);
            }}
            activeOpacity={0.8}
          >
            <Text style={[ss.toggleText, period === p && ss.toggleTextActive]}>
              {p === "weekly"
                ? "Weekly"
                : p === "monthly"
                  ? "Monthly"
                  : "Yearly"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const ss = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  sub: {
    ...theme.typography.ios.subhead,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  amount: {
    fontSize: 40,
    fontWeight: "800",
    color: theme.colors.primary,
    letterSpacing: -1.5,
  },
  period: {
    ...theme.typography.ios.footnote,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
  },
  toggle: {
    flexDirection: "row",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.full,
    padding: theme.spacing.xs,
    ...theme.shadows.small,
  },
  toggleBtn: {
    paddingHorizontal: theme.spacing.md + 2,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.full,
  },
  toggleBtnActive: { backgroundColor: theme.colors.primary },
  toggleText: {
    ...theme.typography.ios.footnote,
    fontWeight: "600",
    color: theme.colors.textMuted,
  },
  toggleTextActive: { color: theme.colors.surface },
});
