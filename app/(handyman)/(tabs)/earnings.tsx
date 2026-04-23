import { SegmentedControl } from "@/src/components/ui";
import { theme } from "@/src/theme/theme";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Period = "weekly" | "monthly";

const PERIODS: readonly { value: Period; label: string }[] = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
] as const;

interface PeriodSummary {
  total: number;
  completedJobs: number;
  pendingPayments: number;
  withdrawn: number;
  chart: { label: string; value: number; highlight?: boolean }[];
  chartMax: number;
}

const SUMMARIES: Record<Period, PeriodSummary> = {
  weekly: {
    total: 320,
    completedJobs: 6,
    pendingPayments: 80,
    withdrawn: 200,
    chart: [
      { label: "M", value: 40 },
      { label: "T", value: 65 },
      { label: "W", value: 30 },
      { label: "T", value: 85, highlight: true },
      { label: "F", value: 55 },
      { label: "S", value: 45 },
      { label: "S", value: 0 },
    ],
    chartMax: 100,
  },
  monthly: {
    total: 1240,
    completedJobs: 24,
    pendingPayments: 320,
    withdrawn: 900,
    chart: [
      { label: "W1", value: 320 },
      { label: "W2", value: 480, highlight: true },
      { label: "W3", value: 260 },
      { label: "W4", value: 180 },
      { label: "W5", value: 380 },
      { label: "W6", value: 220 },
      { label: "W7", value: 420, highlight: true },
    ],
    chartMax: 500,
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
  weekly: [
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
  monthly: [
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
};

const CHART_HEIGHT = 150;
const GRID_LINES = 4;

export default function HandymanEarnings() {
  const [period, setPeriod] = useState<Period>("monthly");

  const summary = SUMMARIES[period];
  const transactions = useMemo(() => MOCK_TRANSACTIONS[period], [period]);

  const periodLabel = period === "weekly" ? "This Week" : "This Month";

  return (
    <SafeAreaView style={ss.safe} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={ss.scroll}
      >
        {/* ── Nav header: back + title ──────────────────────── */}
        <View style={ss.navBar}>
          <TouchableOpacity
            style={ss.navBtn}
            onPress={() => router.back()}
            hitSlop={8}
            activeOpacity={0.6}
          >
            <Ionicons
              name="chevron-back"
              size={26}
              color={theme.colors.textPrimary}
            />
          </TouchableOpacity>
          <Text style={ss.navTitle}>Earnings</Text>
          <View style={ss.navBtn} />
        </View>

        {/* ── Hero total (centered) ─────────────────────────── */}
        <View style={ss.hero}>
          <Text style={ss.heroAmount}>
            ${summary.total.toLocaleString()}
          </Text>
          <Text style={ss.heroLabel}>{periodLabel}</Text>
        </View>

        {/* ── Period selector ──────────────────────────────── */}
        <SegmentedControl<Period>
          segments={PERIODS}
          value={period}
          onChange={setPeriod}
          style={ss.segment}
        />

        {/* ── Bar chart card ───────────────────────────────── */}
        <View style={ss.chartCard}>
          <BarChart data={summary.chart} max={summary.chartMax} />
        </View>

        {/* ── Summary cards ────────────────────────────────── */}
        <View style={ss.summaryList}>
          <SummaryCard
            icon="checkmark-done-outline"
            iconColor={theme.colors.primary}
            iconBg={theme.colors.primarySubtle}
            label="Completed Jobs"
            value={String(summary.completedJobs)}
          />
          <SummaryCard
            icon="time-outline"
            iconColor={theme.colors.warning}
            iconBg={theme.colors.warningSubtle}
            label="Pending Payments"
            value={`$${summary.pendingPayments}`}
          />
          <SummaryCard
            icon="arrow-down-circle-outline"
            iconColor={theme.colors.success}
            iconBg={`${theme.colors.ios.green}18`}
            label="Withdrawn"
            value={`$${summary.withdrawn.toLocaleString()}`}
          />
        </View>

        {/* ── Transactions ─────────────────────────────────── */}
        <View style={ss.sectionHeader}>
          <Text style={ss.sectionTitle}>Transactions</Text>
          <TouchableOpacity activeOpacity={0.6} hitSlop={8}>
            <Text style={ss.sectionAction}>See All</Text>
          </TouchableOpacity>
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

// ── Bar Chart (view-based, no chart lib) ──────────────────

function BarChart({
  data,
  max,
}: {
  data: { label: string; value: number; highlight?: boolean }[];
  max: number;
}) {
  return (
    <View style={ss.chartWrap}>
      <View style={ss.chartBody}>
        {/* Grid lines */}
        <View style={ss.gridLines} pointerEvents="none">
          {Array.from({ length: GRID_LINES }).map((_, i) => (
            <View key={i} style={ss.gridLine} />
          ))}
        </View>

        {/* Bars */}
        <View style={ss.barsRow}>
          {data.map((d, i) => {
            const h = max > 0 ? Math.max(4, (d.value / max) * CHART_HEIGHT) : 4;
            return (
              <View key={i} style={ss.barCol}>
                <View
                  style={[
                    ss.bar,
                    {
                      height: h,
                      backgroundColor: d.highlight
                        ? theme.colors.primary
                        : theme.colors.primarySubtle,
                    },
                  ]}
                />
              </View>
            );
          })}
        </View>
      </View>

      {/* X-axis labels */}
      <View style={ss.barsRow}>
        {data.map((d, i) => (
          <View key={i} style={ss.barCol}>
            <Text style={ss.barLabel}>{d.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ── Summary Card ──────────────────────────────────────────

function SummaryCard({
  icon,
  iconColor,
  iconBg,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
  label: string;
  value: string;
}) {
  return (
    <View style={ss.summaryCard}>
      <View style={[ss.summaryIcon, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <View style={ss.summaryText}>
        <Text style={ss.summaryLabel}>{label}</Text>
        <Text style={ss.summaryValue}>{value}</Text>
      </View>
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
        <View
          style={[
            ss.txBadge,
            isPending ? ss.txBadgePending : ss.txBadgePaid,
          ]}
        >
          <Text
            style={[
              ss.txBadgeText,
              isPending ? ss.txBadgeTextPending : ss.txBadgeTextPaid,
            ]}
          >
            {isPending ? "Pending" : "Paid"}
          </Text>
        </View>
      </View>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────

const ss = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.ios.systemGroupedBackground },
  scroll: { paddingHorizontal: theme.spacing.xl },

  // Nav header
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
  },
  navBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  navTitle: {
    ...theme.typography.ios.headline,
    color: theme.colors.textPrimary,
    fontWeight: "600",
  },

  // Hero
  hero: {
    alignItems: "center",
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  heroAmount: {
    fontSize: 44,
    fontWeight: "700",
    color: theme.colors.textPrimary,
    letterSpacing: -1,
  },
  heroLabel: {
    ...theme.typography.ios.subhead,
    color: theme.colors.ios.secondaryLabel,
    marginTop: 4,
  },

  segment: { marginBottom: theme.spacing.lg },

  // Chart
  chartCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    ...theme.shadows.small,
  },
  chartWrap: {},
  chartBody: {
    height: CHART_HEIGHT,
    justifyContent: "flex-end",
    position: "relative",
  },
  gridLines: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
  },
  gridLine: {
    height: theme.hairline,
    backgroundColor: theme.colors.borderLight,
  },
  barsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: "100%",
  },
  barCol: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  bar: {
    width: 18,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  barLabel: {
    ...theme.typography.ios.caption2,
    color: theme.colors.textMuted,
    marginTop: 8,
  },

  // Summary cards
  summaryList: {
    gap: theme.spacing.sm,
    marginTop: theme.spacing.lg,
  },
  summaryCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    paddingVertical: 14,
    paddingHorizontal: theme.spacing.md,
    ...theme.shadows.small,
  },
  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryText: { flex: 1 },
  summaryLabel: {
    ...theme.typography.ios.caption1,
    color: theme.colors.ios.secondaryLabel,
    marginBottom: 2,
  },
  summaryValue: {
    ...theme.typography.ios.headline,
    color: theme.colors.textPrimary,
    fontWeight: "700",
  },

  // Section header
  sectionHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginTop: theme.spacing.xxl,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.ios.title3,
    color: theme.colors.textPrimary,
  },
  sectionAction: {
    ...theme.typography.ios.subhead,
    color: theme.colors.ios.blue,
    fontWeight: "500",
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
    width: 40,
    height: 40,
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
  txRight: { alignItems: "flex-end", gap: 4 },
  txAmount: {
    ...theme.typography.ios.subhead,
    color: theme.colors.textPrimary,
    fontWeight: "700",
  },
  txBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.radius.full,
  },
  txBadgePaid: {
    backgroundColor: `${theme.colors.ios.green}18`,
  },
  txBadgePending: {
    backgroundColor: theme.colors.warningSubtle,
  },
  txBadgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  txBadgeTextPaid: { color: theme.colors.success },
  txBadgeTextPending: { color: theme.colors.warning },
  txDivider: {
    height: theme.hairline,
    backgroundColor: theme.colors.borderLight,
    marginLeft: 52,
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
