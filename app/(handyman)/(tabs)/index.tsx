import { useAuthStore } from "@/src/features/auth/auth.store";
import { haptic } from "@/src/lib/haptics";
import { theme } from "@/src/theme/theme";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ── Static placeholder data (backend integration pending) ─────────────────
const TODAY_SUMMARY = {
  earnings: 240,
  jobsDone: 1,
};

type NearbyJob = {
  id: string;
  service: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  customer: string;
  distanceKm: number;
  area: string;
  price: number;
  postedAgo: string;
};

const NEARBY_JOBS: NearbyJob[] = [
  {
    id: "j1",
    service: "Fix leaking kitchen sink",
    icon: "pipe-leak",
    customer: "Sarah J.",
    distanceKm: 2.3,
    area: "Midtown",
    price: 60,
    postedAgo: "2h ago",
  },
  {
    id: "j2",
    service: "Repair bedroom door",
    icon: "door",
    customer: "Michael B.",
    distanceKm: 3.8,
    area: "Parkside",
    price: 45,
    postedAgo: "45m ago",
  },
  {
    id: "j3",
    service: "Install ceiling fan",
    icon: "fan",
    customer: "Priya R.",
    distanceKm: 5.1,
    area: "Downtown",
    price: 95,
    postedAgo: "4h ago",
  },
];

// ─────────────────────────────────────────────────────────────────────────

export default function HandymanHome() {
  const user = useAuthStore((s) => s.user);
  const firstName = user?.name?.split(" ")[0] ?? "there";
  const [available, setAvailable] = useState(true);

  const toggleAvailable = () => {
    haptic.selection();
    setAvailable((v) => !v);
  };

  const goToJobs = () => router.push("/(handyman)/(tabs)/jobs");
  const goToEarnings = () => router.push("/(handyman)/(tabs)/earnings");
  const goToProfile = () => router.push("/(handyman)/(tabs)/profile");

  const onAccept = (id: string) => {
    haptic.selection();
    goToJobs();
  };

  const onDetails = (id: string) => {
    haptic.selection();
    goToJobs();
  };

  return (
    <SafeAreaView style={ss.safe} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={ss.scroll}
      >
        {/* ── Header: greeting + availability pill + profile ─────── */}
        <View style={ss.headerRow}>
          <View style={ss.headerText}>
            <Text style={ss.greeting}>Good afternoon,</Text>
            <Text style={ss.largeTitle}>{firstName}</Text>
          </View>

          <TouchableOpacity
            style={ss.profileBtn}
            onPress={goToProfile}
            activeOpacity={0.7}
            hitSlop={8}
          >
            <Ionicons
              name="person-circle-outline"
              size={32}
              color={theme.colors.textPrimary}
            />
          </TouchableOpacity>
        </View>

        {/* ── Availability pill toggle ──────────────────────────── */}
        <TouchableOpacity
          style={ss.availPill}
          onPress={toggleAvailable}
          activeOpacity={0.85}
        >
          <View
            style={[
              ss.availDot,
              { backgroundColor: available ? theme.colors.success : theme.colors.textMuted },
            ]}
          />
          <Text style={ss.availText}>
            {available ? "You're online" : "You're offline"}
          </Text>
          <View
            style={[ss.availSwitch, !available && ss.availSwitchOff]}
          >
            <View
              style={[ss.availKnob, !available && ss.availKnobOff]}
            />
          </View>
        </TouchableOpacity>

        {/* ── Earnings HERO card ────────────────────────────────── */}
        <TouchableOpacity
          style={ss.heroCard}
          onPress={goToEarnings}
          activeOpacity={0.9}
        >
          <View style={ss.heroTopRow}>
            <View>
              <Text style={ss.heroLabel}>Today's Earnings</Text>
              <Text style={ss.heroAmount}>${TODAY_SUMMARY.earnings}.00</Text>
            </View>
            <View style={ss.heroIconBox}>
              <MaterialCommunityIcons
                name="wallet-outline"
                size={24}
                color="#fff"
              />
            </View>
          </View>

          <View style={ss.heroBottomRow}>
            <Text style={ss.heroMeta}>
              {TODAY_SUMMARY.jobsDone} Job{TODAY_SUMMARY.jobsDone === 1 ? "" : "s"} completed
            </Text>
            <View style={ss.heroCta}>
              <Text style={ss.heroCtaText}>View details</Text>
              <Feather name="arrow-right" size={14} color="#fff" />
            </View>
          </View>
        </TouchableOpacity>

        {/* ── New jobs nearby ───────────────────────────────────── */}
        <View style={ss.sectionHeader}>
          <Text style={ss.sectionTitle}>New jobs nearby</Text>
          <TouchableOpacity onPress={goToJobs} activeOpacity={0.6}>
            <Text style={ss.sectionAction}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={ss.jobList}>
          {NEARBY_JOBS.map((job) => (
            <View key={job.id} style={ss.jobCard}>
              <View style={ss.jobTopRow}>
                <View style={ss.jobIconWrap}>
                  <MaterialCommunityIcons
                    name={job.icon}
                    size={22}
                    color={theme.colors.primary}
                  />
                </View>
                <View style={ss.jobTitleCol}>
                  <Text style={ss.jobService} numberOfLines={1}>
                    {job.service}
                  </Text>
                  <Text style={ss.jobCustomer} numberOfLines={1}>
                    {job.customer}
                  </Text>
                </View>
                <Text style={ss.jobPrice}>${job.price}</Text>
              </View>

              <View style={ss.jobMetaRow}>
                <Ionicons
                  name="location-outline"
                  size={13}
                  color={theme.colors.ios.secondaryLabel}
                />
                <Text style={ss.jobMetaText}>
                  {job.area} · {job.distanceKm.toFixed(1)} km
                </Text>
                <View style={ss.jobMetaDot} />
                <Ionicons
                  name="time-outline"
                  size={13}
                  color={theme.colors.ios.secondaryLabel}
                />
                <Text style={ss.jobMetaText}>{job.postedAgo}</Text>
              </View>

              <View style={ss.jobBtnRow}>
                <TouchableOpacity
                  style={ss.detailsBtn}
                  onPress={() => onDetails(job.id)}
                  activeOpacity={0.8}
                >
                  <Text style={ss.detailsBtnText}>Details</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={ss.acceptBtn}
                  onPress={() => onAccept(job.id)}
                  activeOpacity={0.85}
                >
                  <Text style={ss.acceptBtnText}>Accept</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const ss = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.ios.systemGroupedBackground },
  scroll: { paddingHorizontal: theme.spacing.xl, paddingTop: theme.spacing.sm },

  // Header
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  headerText: { flex: 1 },
  greeting: {
    ...theme.typography.ios.subhead,
    color: theme.colors.ios.secondaryLabel,
    marginBottom: 2,
  },
  largeTitle: {
    ...theme.typography.ios.largeTitle,
    color: theme.colors.textPrimary,
  },
  profileBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  // Availability pill
  availPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 8,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.full,
    paddingVertical: 8,
    paddingLeft: 12,
    paddingRight: 6,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.small,
  },
  availDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  availText: {
    ...theme.typography.ios.subhead,
    fontWeight: "600",
    color: theme.colors.textPrimary,
  },
  availSwitch: {
    width: 36,
    height: 22,
    borderRadius: 11,
    backgroundColor: theme.colors.success,
    padding: 2,
    justifyContent: "center",
  },
  availSwitchOff: { backgroundColor: theme.colors.border },
  availKnob: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#fff",
    alignSelf: "flex-end",
    ...theme.shadows.small,
  },
  availKnobOff: { alignSelf: "flex-start" },

  // Hero earnings card
  heroCard: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    ...theme.shadows.small,
  },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  heroLabel: {
    ...theme.typography.ios.subhead,
    color: "rgba(255,255,255,0.85)",
    marginBottom: 4,
  },
  heroAmount: {
    ...theme.typography.ios.largeTitle,
    color: "#fff",
    fontWeight: "700",
  },
  heroIconBox: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.md,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: theme.hairline,
    borderTopColor: "rgba(255,255,255,0.2)",
  },
  heroMeta: {
    ...theme.typography.ios.subhead,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500",
  },
  heroCta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  heroCtaText: {
    ...theme.typography.ios.subhead,
    color: "#fff",
    fontWeight: "600",
  },

  // Section header
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
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

  // Job cards
  jobList: { gap: theme.spacing.md },
  jobCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    ...theme.shadows.small,
  },
  jobTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  jobIconWrap: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primarySubtle,
    alignItems: "center",
    justifyContent: "center",
  },
  jobTitleCol: { flex: 1 },
  jobService: {
    ...theme.typography.ios.headline,
    color: theme.colors.textPrimary,
  },
  jobCustomer: {
    ...theme.typography.ios.caption1,
    color: theme.colors.ios.secondaryLabel,
    marginTop: 2,
  },
  jobPrice: {
    ...theme.typography.ios.title3,
    color: theme.colors.primary,
    fontWeight: "700",
  },
  jobMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: theme.spacing.md,
  },
  jobMetaText: {
    ...theme.typography.ios.caption1,
    color: theme.colors.ios.secondaryLabel,
  },
  jobMetaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: theme.colors.textMuted,
    marginHorizontal: 6,
  },
  jobBtnRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: theme.hairline,
    borderTopColor: theme.colors.borderLight,
  },
  detailsBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surfaceAlt,
    paddingVertical: 10,
    borderRadius: theme.radius.full,
  },
  detailsBtnText: {
    ...theme.typography.ios.subhead,
    color: theme.colors.textPrimary,
    fontWeight: "600",
  },
  acceptBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
    paddingVertical: 10,
    borderRadius: theme.radius.full,
  },
  acceptBtnText: {
    ...theme.typography.ios.subhead,
    color: "#fff",
    fontWeight: "600",
  },
});
