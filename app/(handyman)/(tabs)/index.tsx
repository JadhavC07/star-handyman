import AppHeader from "@/src/components/common/AppHeader";
import { useAuthStore } from "@/src/features/auth/auth.store";
import { haptic } from "@/src/lib/haptics";
import { theme } from "@/src/theme/theme";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SUMMARY = [
  { id: "active", label: "Active jobs", value: "0", icon: "briefcase-outline" },
  { id: "pending", label: "Pending", value: "0", icon: "time-outline" },
  { id: "week", label: "This week", value: "$0", icon: "cash-outline" },
] as const;

const QUICK_ACTIONS = [
  {
    id: "availability",
    label: "Availability",
    icon: "calendar-check-outline" as const,
  },
  { id: "schedule", label: "Schedule", icon: "calendar-outline" as const },
  {
    id: "support",
    label: "Support",
    icon: "help-circle-outline" as const,
  },
];

export default function HandymanHome() {
  const user = useAuthStore((s) => s.user);
  const firstName = user?.name?.split(" ")[0] ?? "there";

  const tapAction = () => {
    haptic.selection();
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <AppHeader title={`Hi, ${firstName}`} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeHeader}>
            <View style={styles.welcomeBadge}>
              <Feather name="tool" size={14} color={theme.colors.primary} />
              <Text style={styles.welcomeBadgeText}>HANDYMAN</Text>
            </View>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Available</Text>
          </View>
          <Text style={styles.welcomeTitle}>Ready for today&apos;s work?</Text>
          <Text style={styles.welcomeSub}>
            New job requests will appear in your Jobs tab.
          </Text>
        </View>

        <Text style={styles.sectionLabel}>Today&apos;s summary</Text>
        <View style={styles.summaryRow}>
          {SUMMARY.map((item) => (
            <View key={item.id} style={styles.summaryCard}>
              <View style={styles.summaryIconBox}>
                <Ionicons
                  name={item.icon as any}
                  size={16}
                  color={theme.colors.primary}
                />
              </View>
              <Text style={styles.summaryValue}>{item.value}</Text>
              <Text style={styles.summaryLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Quick actions</Text>
        <View style={styles.actionsRow}>
          {QUICK_ACTIONS.map((a) => (
            <TouchableOpacity
              key={a.id}
              onPress={tapAction}
              style={styles.actionCard}
              activeOpacity={0.8}
            >
              <View style={styles.actionIconBox}>
                <MaterialCommunityIcons
                  name={a.icon}
                  size={22}
                  color={theme.colors.primary}
                />
              </View>
              <Text style={styles.actionLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Recent activity</Text>
        <View style={styles.emptyCard}>
          <View style={styles.emptyIconBox}>
            <Feather name="clipboard" size={22} color={theme.colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>No recent jobs yet</Text>
          <Text style={styles.emptySub}>
            When you accept a job it will show up here.
          </Text>
        </View>

        <View style={{ height: 150 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { paddingHorizontal: theme.spacing.xl },
  welcomeCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xl,
    marginTop: theme.spacing.md,
    ...theme.shadows.small,
  },
  welcomeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  welcomeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primarySubtle,
  },
  welcomeBadgeText: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    fontWeight: "700",
    letterSpacing: 1,
    fontSize: 11,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.success,
    marginLeft: 4,
  },
  statusText: {
    ...theme.typography.caption,
    color: theme.colors.success,
    fontWeight: "600",
  },
  welcomeTitle: {
    fontSize: 18,
    color: theme.colors.textPrimary,
    fontWeight: "600",
    marginBottom: 4,
  },
  welcomeSub: {
    ...theme.typography.body,
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  sectionLabel: {
    fontSize: 15,
    color: theme.colors.textPrimary,
    fontWeight: "600",
    marginTop: theme.spacing.xxl,
    marginBottom: theme.spacing.md,
  },
  summaryRow: {
    flexDirection: "row",
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    paddingVertical: 14,
    paddingHorizontal: 12,
    ...theme.shadows.small,
  },
  summaryIconBox: {
    width: 32,
    height: 32,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primarySubtle,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  summaryValue: {
    fontSize: 18,
    color: theme.colors.textPrimary,
    fontWeight: "700",
  },
  summaryLabel: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    paddingVertical: 16,
    alignItems: "center",
    ...theme.shadows.small,
  },
  actionIconBox: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primarySubtle,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 13,
    color: theme.colors.textPrimary,
    fontWeight: "500",
  },
  emptyCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xxl,
    alignItems: "center",
    ...theme.shadows.small,
  },
  emptyIconBox: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primarySubtle,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 15,
    color: theme.colors.textPrimary,
    fontWeight: "600",
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 13,
    color: theme.colors.textMuted,
    textAlign: "center",
  },
});
