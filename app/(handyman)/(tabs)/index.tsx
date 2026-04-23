import { JobCard, JobCardData } from "@/src/components/common/JobCard";
import { TodayEarningsCard } from "@/src/components/common/TodayEarningsCard";
import { AvailabilityToggle } from "@/src/components/ui/AvailabilityToggle";
import { useAuthStore } from "@/src/features/auth/auth.store";
import { haptic } from "@/src/lib/haptics";
import { theme } from "@/src/theme/theme";
import { Ionicons } from "@expo/vector-icons";
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

const TODAY_SUMMARY = { earnings: 240, jobsDone: 1 };

const NEARBY_JOBS: JobCardData[] = [
  {
    id: "j1",
    service: "Fix leaking kitchen sink",
    icon: "pipe-leak",
    customer: "Sarah J.",
    distanceLabel: "2.3 km",
    postedAgo: "2h ago",
    price: 60,
  },
  {
    id: "j2",
    service: "Repair bedroom door",
    icon: "door",
    customer: "Michael B.",
    distanceLabel: "3.8 km",
    postedAgo: "45m ago",
    price: 45,
  },
  {
    id: "j3",
    service: "Install ceiling fan",
    icon: "fan",
    customer: "Priya R.",
    distanceLabel: "5.1 km",
    postedAgo: "4h ago",
    price: 95,
  },
];

export default function HandymanHome() {
  const user = useAuthStore((s) => s.user);
  const firstName = user?.name?.split(" ")[0] ?? "there";
  const [available, setAvailable] = useState(true);

  const toggleAvailable = (next: boolean) => {
    haptic.selection();
    setAvailable(next);
  };

  const goToJobs = () => {
    haptic.selection();
    router.push("/(handyman)/(tabs)/jobs");
  };
  const goToEarnings = () => router.push("/(handyman)/(tabs)/earnings");
  const goToProfile = () => {
    haptic.selection();
    router.push("/(handyman)/(tabs)/profile");
  };

  return (
    <SafeAreaView style={ss.safe} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={ss.scroll}
      >
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

        <View style={ss.availabilityWrap}>
          <AvailabilityToggle value={available} onChange={toggleAvailable} />
        </View>

        <TodayEarningsCard
          amount={TODAY_SUMMARY.earnings}
          jobsDone={TODAY_SUMMARY.jobsDone}
          onPress={goToEarnings}
        />

        <View style={ss.sectionHeader}>
          <Text style={ss.sectionTitle}>New jobs nearby</Text>
          <TouchableOpacity onPress={goToJobs} activeOpacity={0.6}>
            <Text style={ss.sectionAction}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={ss.jobList}>
          {NEARBY_JOBS.map((job) => (
            <JobCard
              key={job.id}
              variant="compact"
              job={job}
              onPress={goToJobs}
              onDetails={goToJobs}
              onAccept={goToJobs}
            />
          ))}
        </View>

        <View style={{ height: 150 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const ss = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.ios.systemGroupedBackground },
  scroll: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.sm,
  },
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
  availabilityWrap: { marginBottom: theme.spacing.lg },
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
  jobList: { gap: theme.spacing.md },
});
