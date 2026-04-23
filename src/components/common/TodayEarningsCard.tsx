import { haptic } from "@/src/lib/haptics";
import { theme } from "@/src/theme/theme";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  amount: number;
  jobsDone: number;
  onPress: () => void;
};

export const TodayEarningsCard = React.memo(function TodayEarningsCard({ amount, jobsDone, onPress }: Props) {
  return (
    <TouchableOpacity
      style={ss.card}
      onPress={() => { haptic.selection(); onPress(); }}
      activeOpacity={0.9}
    >
      <View style={ss.topRow}>
        <View>
          <Text style={ss.label}>Today&apos;s Earnings</Text>
          <Text style={ss.amount}>${amount}.00</Text>
        </View>
        <View style={ss.iconBox}>
          <MaterialCommunityIcons name="wallet-outline" size={24} color={theme.colors.surface} />
        </View>
      </View>

      <View style={ss.bottomRow}>
        <Text style={ss.meta}>
          {jobsDone} Job{jobsDone === 1 ? "" : "s"} completed
        </Text>
        <View style={ss.cta}>
          <Text style={ss.ctaText}>View details</Text>
          <Feather name="arrow-right" size={14} color={theme.colors.surface} />
        </View>
      </View>
    </TouchableOpacity>
  );
});

const ss = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    ...theme.shadows.small,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  label: {
    ...theme.typography.ios.subhead,
    color: "rgba(255,255,255,0.85)",
    marginBottom: theme.spacing.xs,
  },
  amount: {
    ...theme.typography.ios.largeTitle,
    color: theme.colors.surface,
    fontWeight: "700",
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.md,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: theme.hairline,
    borderTopColor: "rgba(255,255,255,0.2)",
  },
  meta: {
    ...theme.typography.ios.subhead,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500",
  },
  cta: { flexDirection: "row", alignItems: "center", gap: theme.spacing.xs },
  ctaText: {
    ...theme.typography.ios.subhead,
    color: theme.colors.surface,
    fontWeight: "600",
  },
});
