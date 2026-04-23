import { EarningsHero } from "@/src/components/earnings/EarningsHero";
import { EarningsLineChart } from "@/src/components/earnings/EarningsLineChart";
import { StatCard } from "@/src/components/earnings/StatCard";
import {
  Transaction,
  TransactionRow,
} from "@/src/components/earnings/TransactionRow";
import { theme } from "@/src/theme/theme";
import React, { useMemo, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Period = "weekly" | "monthly" | "yearly";

type PeriodSummary = {
  total: number;
  periodLabel: string;
  completedJobs: number;
  completedSub: string;
  pendingAmount: number;
  pendingCount: number;
  withdrawn: number;
  withdrawnSub: string;
  chart: { label: string; value: number }[];
  chartMax: number;
  peakIndex: number;
};

const SUMMARIES: Record<Period, PeriodSummary> = {
  weekly: {
    total: 320,
    periodLabel: "This week",
    completedJobs: 6,
    completedSub: "This Week",
    pendingAmount: 80,
    pendingCount: 1,
    withdrawn: 200,
    withdrawnSub: "This Week",
    chart: [
      { label: "Mon", value: 40 },
      { label: "Tue", value: 65 },
      { label: "Wed", value: 30 },
      { label: "Thu", value: 85 },
      { label: "Fri", value: 55 },
      { label: "Sat", value: 45 },
      { label: "Sun", value: 0 },
    ],
    chartMax: 100,
    peakIndex: 3,
  },
  monthly: {
    total: 1240,
    periodLabel: "This month",
    completedJobs: 24,
    completedSub: "This Month",
    pendingAmount: 320,
    pendingCount: 2,
    withdrawn: 900,
    withdrawnSub: "This Month",
    chart: [
      { label: "May 1", value: 0 },
      { label: "May 8", value: 100 },
      { label: "May 15", value: 200 },
      { label: "May 22", value: 320 },
      { label: "May 29", value: 280 },
    ],
    chartMax: 400,
    peakIndex: 3,
  },
  yearly: {
    total: 15400,
    periodLabel: "This year",
    completedJobs: 210,
    completedSub: "This Year",
    pendingAmount: 1200,
    pendingCount: 5,
    withdrawn: 12000,
    withdrawnSub: "This Year",
    chart: [
      { label: "Jan", value: 800 },
      { label: "Feb", value: 1200 },
      { label: "Mar", value: 900 },
      { label: "Apr", value: 1500 },
      { label: "May", value: 1800 },
      { label: "Jun", value: 1300 },
      { label: "Jul", value: 1600 },
      { label: "Aug", value: 1400 },
      { label: "Sep", value: 1700 },
      { label: "Oct", value: 1900 },
      { label: "Nov", value: 2100 },
      { label: "Dec", value: 2300 },
    ],
    chartMax: 2500,
    peakIndex: 11,
  },
};

const MOCK_TRANSACTIONS: Record<Period, Transaction[]> = {
  weekly: [
    {
      id: "w1",
      service: "Fix leaking sink",
      date: "May 30, 2025 • 10:30 AM",
      amount: 45,
      status: "paid",
      icon: "pipe",
    },
    {
      id: "w2",
      service: "Repair door lock",
      date: "May 29, 2025 • 02:15 PM",
      amount: 60,
      status: "paid",
      icon: "lock-outline",
    },
    {
      id: "w3",
      service: "Install ceiling fan",
      date: "May 28, 2025 • 11:20 AM",
      amount: 80,
      status: "paid",
      icon: "fan",
    },
    {
      id: "w4",
      service: "Bathroom sink repair",
      date: "May 27, 2025 • 09:45 AM",
      amount: 55,
      status: "pending",
      icon: "water-pump",
    },
  ],
  monthly: [
    {
      id: "m1",
      service: "Fix leaking sink",
      date: "May 30, 2025 • 10:30 AM",
      amount: 45,
      status: "paid",
      icon: "pipe",
    },
    {
      id: "m2",
      service: "Repair door lock",
      date: "May 29, 2025 • 02:15 PM",
      amount: 60,
      status: "paid",
      icon: "lock-outline",
    },
    {
      id: "m3",
      service: "Install ceiling fan",
      date: "May 28, 2025 • 11:20 AM",
      amount: 80,
      status: "paid",
      icon: "fan",
    },
    {
      id: "m4",
      service: "Bathroom sink repair",
      date: "May 27, 2025 • 09:45 AM",
      amount: 55,
      status: "pending",
      icon: "water-pump",
    },
  ],
  yearly: [
    {
      id: "m1",
      service: "Fix leaking sink",
      date: "May 30, 2025 • 10:30 AM",
      amount: 45,
      status: "paid",
      icon: "pipe",
    },
    {
      id: "m2",
      service: "Repair door lock",
      date: "May 29, 2025 • 02:15 PM",
      amount: 60,
      status: "paid",
      icon: "lock-outline",
    },
    {
      id: "m3",
      service: "Install ceiling fan",
      date: "May 28, 2025 • 11:20 AM",
      amount: 80,
      status: "paid",
      icon: "fan",
    },
    {
      id: "m4",
      service: "Bathroom sink repair",
      date: "May 27, 2025 • 09:45 AM",
      amount: 55,
      status: "pending",
      icon: "water-pump",
    },
  ],
};

export default function HandymanEarnings() {
  const [period, setPeriod] = useState<Period>("monthly");
  const summary = SUMMARIES[period];
  const transactions = useMemo(() => MOCK_TRANSACTIONS[period], [period]);

  return (
    <SafeAreaView style={ss.safe} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={ss.scroll}
      >
        <View style={ss.header}>
          <Text style={ss.largeTitle}>Earnings</Text>
          <TouchableOpacity style={ss.avatarBtn} activeOpacity={0.8}>
            <Image
              source={{ uri: "https://i.pravatar.cc/150?u=handyman" }}
              style={ss.headerAvatar}
            />
          </TouchableOpacity>
        </View>

        <EarningsHero
          total={summary.total}
          periodLabel={summary.periodLabel}
          period={period}
          onChangePeriod={setPeriod}
        />

        <EarningsLineChart
          data={summary.chart}
          max={summary.chartMax}
          peakIndex={summary.peakIndex}
        />

        <View style={ss.statsRow}>
          <StatCard
            iconName="briefcase-outline"
            iconColor={theme.colors.ios.orange}
            title="Completed Jobs"
            value={String(summary.completedJobs)}
            sub={summary.completedSub}
          />
          <StatCard
            iconName="time-outline"
            iconColor={theme.colors.ios.indigo}
            title="Pending Payments"
            value={`$${summary.pendingAmount}`}
            sub={`${summary.pendingCount} Payments`}
          />
          <StatCard
            iconName="wallet-outline"
            iconColor={theme.colors.ios.green}
            title="Withdrawn"
            value={`$${summary.withdrawn.toLocaleString()}`}
            sub={summary.withdrawnSub}
          />
        </View>

        <View style={ss.sectionHeader}>
          <Text style={ss.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={ss.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={ss.txList}>
          {transactions.map((tx) => (
            <TransactionRow key={tx.id} tx={tx} />
          ))}
        </View>

        <View style={{ height: 150 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const ss = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.ios.systemGroupedBackground },
  scroll: { paddingHorizontal: theme.spacing.xl },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
  },
  largeTitle: {
    ...theme.typography.ios.largeTitle,
    color: theme.colors.textPrimary,
  },
  avatarBtn: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.full,
    overflow: "hidden",
    ...theme.shadows.small,
  },
  headerAvatar: { width: 44, height: 44, borderRadius: theme.radius.full },

  statsRow: {
    flexDirection: "row",
    gap: theme.spacing.sm + 2,
    marginBottom: theme.spacing.xxl,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.ios.title3,
    color: theme.colors.textPrimary,
  },
  viewAll: {
    ...theme.typography.ios.subhead,
    color: theme.colors.primary,
    fontWeight: "600",
  },
  txList: { gap: theme.spacing.sm + 2 },
});
