import { theme } from "@/src/theme/theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export type Transaction = {
  id: string;
  service: string;
  date: string;
  amount: number;
  status: "paid" | "pending";
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
};

export function TransactionRow({ tx }: { tx: Transaction }) {
  const isPending = tx.status === "pending";
  return (
    <View style={ss.card}>
      <View style={ss.iconBox}>
        <MaterialCommunityIcons name={tx.icon} size={22} color={theme.colors.primary} />
      </View>
      <View style={ss.info}>
        <Text style={ss.service}>{tx.service}</Text>
        <View style={ss.dateRow}>
          <Ionicons name="calendar-outline" size={12} color={theme.colors.textMuted} />
          <Text style={ss.date}>{tx.date}</Text>
        </View>
      </View>
      <View style={ss.right}>
        <Text
          style={[
            ss.amount,
            { color: isPending ? theme.colors.primary : theme.colors.success },
          ]}
        >
          +${tx.amount}
        </Text>
        <View
          style={[
            ss.badge,
            { borderColor: isPending ? theme.colors.warning : theme.colors.success },
          ]}
        >
          <Text
            style={[
              ss.badgeText,
              { color: isPending ? theme.colors.warning : theme.colors.success },
            ]}
          >
            {isPending ? "Pending" : "Paid"}
          </Text>
        </View>
      </View>
    </View>
  );
}

const ss = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg + 2,
    padding: theme.spacing.md + 2,
    borderWidth: theme.hairline,
    borderColor: theme.colors.borderLight,
    ...theme.shadows.small,
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.primarySubtle,
    alignItems: "center",
    justifyContent: "center",
  },
  info: { flex: 1 },
  service: {
    ...theme.typography.ios.subhead,
    fontWeight: "600",
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  dateRow: { flexDirection: "row", alignItems: "center", gap: theme.spacing.xs },
  date: {
    ...theme.typography.ios.caption1,
    color: theme.colors.textMuted,
  },
  right: { alignItems: "flex-end", gap: theme.spacing.xs + 2 },
  amount: {
    ...theme.typography.ios.callout,
    fontWeight: "700",
  },
  badge: {
    paddingHorizontal: theme.spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: theme.radius.full,
    borderWidth: theme.hairline * 2,
  },
  badgeText: {
    ...theme.typography.ios.caption2,
    fontWeight: "600",
  },
});
