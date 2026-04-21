import AppHeader from "@/src/components/common/AppHeader";
import { SegmentedControl } from "@/src/components/ui";
import { theme } from "@/src/theme/theme";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Period = "week" | "month" | "year";

const PERIODS: readonly { value: Period; label: string }[] = [
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "year", label: "This Year" },
] as const;

interface PeriodSummary {
  total: number;
  jobsCompleted: number;
  tips: number;
  pendingPayout: number;
  changePct: number; // vs previous period
}

const SUMMARIES: Record<Period, PeriodSummary> = {
  week: {
    total: 420,
    jobsCompleted: 7,
    tips: 35,
    pendingPayout: 120,
    changePct: 12.4,
  },
  month: {
    total: 1820,
    jobsCompleted: 29,
    tips: 140,
    pendingPayout: 280,
    changePct: 8.1,
  },
  year: {
    total: 18450,
    jobsCompleted: 312,
    tips: 1620,
    pendingPayout: 280,
    changePct: 24.5,
  },
};

interface Transaction {
  id: string;
  service: string;
  customer: string;
  date: string;
  amount: number;
  status: "paid" | "pending";
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}

const MOCK_TRANSACTIONS: Record<Period, Transaction[]> = {
  week: [
    {
      id: "w1",
      service: "Leaky Faucet Repair",
      customer: "Emily Watson",
      date: "Today, 10:20 AM",
      amount: 55,
      status: "pending",
      icon: "pipe",
    },
    {
      id: "w2",
      service: "Door Lock Replacement",
      customer: "Sophia Kim",
      date: "Yesterday",
      amount: 45,
      status: "paid",
      icon: "lock-outline",
    },
    {
      id: "w3",
      service: "Ceiling Fan Install",
      customer: "Michael Chen",
      date: "Apr 17",
      amount: 90,
      status: "paid",
      icon: "fan",
    },
    {
      id: "w4",
      service: "Electrical Wiring",
      customer: "Alex Brown",
      date: "Apr 16",
      amount: 80,
      status: "paid",
      icon: "lightning-bolt",
    },
  ],
  month: [
    {
      id: "m1",
      service: "Leaky Faucet Repair",
      customer: "Emily Watson",
      date: "Today",
      amount: 55,
      status: "pending",
      icon: "pipe",
    },
    {
      id: "m2",
      service: "AC Installation",
      customer: "David Carter",
      date: "Apr 14",
      amount: 120,
      status: "paid",
      icon: "air-conditioner",
    },
    {
      id: "m3",
      service: "Drain Cleaning",
      customer: "Priya Shah",
      date: "Apr 10",
      amount: 65,
      status: "paid",
      icon: "water-pump",
    },
    {
      id: "m4",
      service: "Ceiling Fan Install",
      customer: "Michael Chen",
      date: "Apr 04",
      amount: 90,
      status: "paid",
      icon: "fan",
    },
  ],
  year: [
    {
      id: "y1",
      service: "AC Installation",
      customer: "David Carter",
      date: "Apr 14, 2026",
      amount: 120,
      status: "paid",
      icon: "air-conditioner",
    },
    {
      id: "y2",
      service: "Full Bathroom Refit",
      customer: "Liam O'Connor",
      date: "Mar 22, 2026",
      amount: 450,
      status: "paid",
      icon: "shower",
    },
    {
      id: "y3",
      service: "Kitchen Rewire",
      customer: "Nora Patel",
      date: "Feb 09, 2026",
      amount: 320,
      status: "paid",
      icon: "lightning-bolt",
    },
  ],
};

export default function HandymanEarnings() {
  const [period, setPeriod] = useState<Period>("week");

  const summary = SUMMARIES[period];
  const transactions = useMemo(() => MOCK_TRANSACTIONS[period], [period]);

  const periodLabel =
    period === "week"
      ? "this week"
      : period === "month"
        ? "this month"
        : "this year";

  return (
    <SafeAreaView style={ss.safe} edges={["top"]}>
      <AppHeader title="Earnings" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={ss.scroll}
      >
        {/* Period selector */}
        <SegmentedControl<Period>
          segments={PERIODS}
          value={period}
          onChange={setPeriod}
          style={ss.segment}
        />

        {/* Hero total */}
        <View style={ss.heroCard}>
          <Text style={ss.heroLabel}>Total earned {periodLabel}</Text>
          <Text style={ss.heroAmount}>${summary.total.toLocaleString()}</Text>
          <View style={ss.trendRow}>
            <View
              style={[
                ss.trendPill,
                summary.changePct >= 0 ? ss.trendUp : ss.trendDown,
              ]}
            >
              <Feather
                name={summary.changePct >= 0 ? "trending-up" : "trending-down"}
                size={12}
                color={
                  summary.changePct >= 0
                    ? theme.colors.success
                    : theme.colors.error
                }
              />
              <Text
                style={[
                  ss.trendText,
                  summary.changePct >= 0 ? ss.trendUpText : ss.trendDownText,
                ]}
              >
                {summary.changePct >= 0 ? "+" : ""}
                {summary.changePct.toFixed(1)}%
              </Text>
            </View>
            <Text style={ss.trendCaption}>vs previous period</Text>
          </View>
        </View>

        {/* Breakdown */}
        <View style={ss.breakdownRow}>
          <BreakdownCard
            icon="briefcase-outline"
            label="Jobs"
            value={String(summary.jobsCompleted)}
          />
          <BreakdownCard
            icon="cash-outline"
            label="Tips"
            value={`$${summary.tips}`}
          />
          <BreakdownCard
            icon="time-outline"
            label="Pending"
            value={`$${summary.pendingPayout}`}
            accent
          />
        </View>

        {/* Transactions */}
        <View style={ss.sectionHeader}>
          <Text style={ss.sectionLabel}>Transactions</Text>
          <Text style={ss.sectionCount}>{transactions.length}</Text>
        </View>

        {transactions.length === 0 ? (
          <View style={ss.emptyCard}>
            <View style={ss.emptyIconBox}>
              <Feather
                name="file-text"
                size={22}
                color={theme.colors.primary}
              />
            </View>
            <Text style={ss.emptyTitle}>No transactions yet</Text>
            <Text style={ss.emptySub}>
              Earnings from completed jobs will appear here.
            </Text>
          </View>
        ) : (
          <View style={ss.txList}>
            {transactions.map((tx, i) => (
              <View key={tx.id}>
                <TransactionRow tx={tx} />
                {i < transactions.length - 1 ? (
                  <View style={ss.txDivider} />
                ) : null}
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Breakdown Card ────────────────────────────────────────

function BreakdownCard({
  icon,
  label,
  value,
  accent = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <View style={ss.breakdownCard}>
      <View
        style={[ss.breakdownIcon, accent ? ss.breakdownIconAccent : undefined]}
      >
        <Ionicons
          name={icon}
          size={16}
          color={accent ? theme.colors.warning : theme.colors.primary}
        />
      </View>
      <Text style={ss.breakdownValue}>{value}</Text>
      <Text style={ss.breakdownLabel}>{label}</Text>
    </View>
  );
}

// ── Transaction Row ───────────────────────────────────────

function TransactionRow({ tx }: { tx: Transaction }) {
  const isPending = tx.status === "pending";
  return (
    <View style={ss.txRow}>
      <View style={ss.txIcon}>
        <MaterialCommunityIcons
          name={tx.icon}
          size={18}
          color={theme.colors.primary}
        />
      </View>
      <View style={ss.txText}>
        <Text style={ss.txService} numberOfLines={1}>
          {tx.service}
        </Text>
        <Text style={ss.txMeta} numberOfLines={1}>
          {tx.customer} · {tx.date}
        </Text>
      </View>
      <View style={ss.txRight}>
        <Text style={ss.txAmount}>
          {isPending ? "" : "+"}${tx.amount.toFixed(0)}
        </Text>
        <Text style={[ss.txStatus, isPending ? ss.txPending : ss.txPaid]}>
          {isPending ? "Pending" : "Paid"}
        </Text>
      </View>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────

const ss = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { paddingHorizontal: theme.spacing.xl },

  segment: { marginTop: theme.spacing.sm, marginBottom: theme.spacing.lg },

  // Hero
  heroCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xl,
    ...theme.shadows.small,
  },
  heroLabel: {
    ...theme.typography.ios.footnote,
    color: theme.colors.ios.secondaryLabel,
    marginBottom: 6,
  },
  heroAmount: {
    ...theme.typography.ios.largeTitle,
    color: theme.colors.textPrimary,
    marginBottom: 10,
  },
  trendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  trendPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.full,
  },
  trendUp: { backgroundColor: theme.colors.successSubtle },
  trendDown: { backgroundColor: theme.colors.errorSubtle },
  trendText: { fontSize: 12, fontWeight: "600" },
  trendUpText: { color: theme.colors.success },
  trendDownText: { color: theme.colors.error },
  trendCaption: {
    ...theme.typography.ios.caption1,
    color: theme.colors.textMuted,
  },

  // Breakdown
  breakdownRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: theme.spacing.lg,
  },
  breakdownCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    paddingVertical: 14,
    paddingHorizontal: 12,
    ...theme.shadows.small,
  },
  breakdownIcon: {
    width: 30,
    height: 30,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primarySubtle,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  breakdownIconAccent: {
    backgroundColor: theme.colors.warningSubtle,
  },
  breakdownValue: {
    ...theme.typography.ios.title3,
    color: theme.colors.textPrimary,
  },
  breakdownLabel: {
    ...theme.typography.ios.caption1,
    color: theme.colors.textMuted,
    marginTop: 2,
  },

  // Section header
  sectionHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginTop: theme.spacing.xxl,
    marginBottom: theme.spacing.md,
  },
  sectionLabel: {
    ...theme.typography.ios.headline,
    color: theme.colors.textPrimary,
  },
  sectionCount: {
    ...theme.typography.ios.footnote,
    color: theme.colors.textMuted,
  },

  // Transactions list
  txList: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    paddingHorizontal: theme.spacing.md,
    ...theme.shadows.small,
  },
  txRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 4,
  },
  txIcon: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primarySubtle,
    alignItems: "center",
    justifyContent: "center",
  },
  txText: { flex: 1 },
  txService: {
    ...theme.typography.ios.subhead,
    color: theme.colors.textPrimary,
    fontWeight: "600",
  },
  txMeta: {
    ...theme.typography.ios.caption1,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  txRight: { alignItems: "flex-end" },
  txAmount: {
    ...theme.typography.ios.subhead,
    color: theme.colors.textPrimary,
    fontWeight: "700",
  },
  txStatus: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
  },
  txPaid: { color: theme.colors.success },
  txPending: { color: theme.colors.warning },
  txDivider: {
    height: theme.hairline,
    backgroundColor: theme.colors.borderLight,
    marginLeft: 48,
  },

  // Empty
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
    ...theme.typography.ios.headline,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  emptySub: {
    ...theme.typography.ios.footnote,
    color: theme.colors.textMuted,
    textAlign: "center",
  },
});
