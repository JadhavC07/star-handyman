import { EmptyState } from "@/src/components/common/EmptyState";
import { JobCard } from "@/src/components/common/JobCard";
import { JobStatus } from "@/src/components/common/JobStatusPill";
import { PromoCard } from "@/src/components/common/PromoCard";
import { SegmentedControl } from "@/src/components/ui";
import { haptic } from "@/src/lib/haptics";
import { theme } from "@/src/theme/theme";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type JobSegment = JobStatus;

export interface HandymanJob {
  id: string;
  service: string;
  category: string;
  customer: string;
  customerAvatar: string;
  customerRating: number;
  customerReviews: number;
  customerPhone: string;
  address: string;
  distanceKm: number;
  postedAgo: string;
  date: string;
  time: string;
  timeRange: string;
  priceMin: number;
  priceMax: number;
  price: number;
  paymentType: string;
  budgetType: string;
  status: JobStatus;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  notes?: string;
  photos?: string[];
}

export const MOCK_JOBS: HandymanJob[] = [
  {
    id: "1",
    service: "Fix leaking sink",
    category: "Plumbing",
    customer: "Sarah Johnson",
    customerAvatar: "https://i.pravatar.cc/150?u=sarah",
    customerRating: 4.7,
    customerReviews: 120,
    customerPhone: "+1 312 555 0101",
    address: "45 Pine Street, Chicago, IL 60601",
    distanceKm: 2.5,
    postedAgo: "1h ago",
    date: "May 31, 2025",
    time: "10:00 AM",
    timeRange: "10:00 AM – 02:00 PM",
    priceMin: 50,
    priceMax: 80,
    price: 45,
    paymentType: "Fixed Price",
    budgetType: "Customer Budget",
    status: "incoming",
    icon: "pipe",
    notes:
      "The kitchen sink is leaking from the pipe connection. Need someone to fix it as soon as possible.",
    photos: [
      "https://images.unsplash.com/photo-1585704032915-c3400305e979?w=400",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
    ],
  },
  {
    id: "2",
    service: "Repair door lock",
    category: "Carpentry",
    customer: "Michael Brown",
    customerAvatar: "https://i.pravatar.cc/150?u=michael",
    customerRating: 4.5,
    customerReviews: 87,
    customerPhone: "+1 312 555 0202",
    address: "78 Maple Avenue, Chicago, IL 60602",
    distanceKm: 3.2,
    postedAgo: "2h ago",
    date: "Jun 1, 2025",
    time: "2:00 PM",
    timeRange: "2:00 PM – 05:00 PM",
    priceMin: 50,
    priceMax: 80,
    price: 60,
    paymentType: "Fixed Price",
    budgetType: "Customer Budget",
    status: "active",
    icon: "lock-outline",
    notes: "Door lock is broken and needs replacement.",
  },
  {
    id: "3",
    service: "Install ceiling fan",
    category: "Electrical",
    customer: "Emily Davis",
    customerAvatar: "https://i.pravatar.cc/150?u=emily",
    customerRating: 4.8,
    customerReviews: 204,
    customerPhone: "+1 312 555 0303",
    address: "12 Oak Drive, Chicago, IL 60603",
    distanceKm: 4.1,
    postedAgo: "5h ago",
    date: "Mar 20, 2026",
    time: "11:00 AM",
    timeRange: "11:00 AM – 01:00 PM",
    priceMin: 70,
    priceMax: 100,
    price: 80,
    paymentType: "Fixed Price",
    budgetType: "Customer Budget",
    status: "completed",
    icon: "fan",
    notes: "Standard ceiling fan install in living room.",
  },
  {
    id: "4",
    service: "Electrical Wiring",
    category: "Electrical",
    customer: "Alex Brown",
    customerAvatar: "https://i.pravatar.cc/150?u=alex",
    customerRating: 4.3,
    customerReviews: 56,
    customerPhone: "+1 312 555 0404",
    address: "88 Maple Court, Chicago, IL 60604",
    distanceKm: 1.2,
    postedAgo: "1d ago",
    date: "Mar 18, 2026",
    time: "11:00 AM",
    timeRange: "11:00 AM – 03:00 PM",
    priceMin: 60,
    priceMax: 100,
    price: 80,
    paymentType: "Hourly",
    budgetType: "Negotiable",
    status: "completed",
    icon: "lightning-bolt",
  },
];

const SEGMENT_DEFS: readonly { value: JobSegment; label: string }[] = [
  { value: "incoming", label: "Incoming" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Done" },
] as const;

const EMPTY_COPY: Record<JobSegment, { icon: keyof typeof Feather.glyphMap; title: string; sub: string }> = {
  incoming: {
    icon: "inbox",
    title: "No incoming jobs",
    sub: "New job requests will appear here. Make sure you're set to Available.",
  },
  active: {
    icon: "briefcase",
    title: "No active jobs",
    sub: "Accepted jobs you're working on will show up here.",
  },
  completed: {
    icon: "check-circle",
    title: "No completed jobs yet",
    sub: "Finished jobs will be listed here for your records.",
  },
};

export default function HandymanJobs() {
  const [segment, setSegment] = useState<JobSegment>("incoming");

  const jobs = useMemo(
    () => MOCK_JOBS.filter((j) => j.status === segment),
    [segment],
  );

  const counts = useMemo(
    () => ({
      incoming: MOCK_JOBS.filter((j) => j.status === "incoming").length,
      active: MOCK_JOBS.filter((j) => j.status === "active").length,
      completed: MOCK_JOBS.filter((j) => j.status === "completed").length,
    }),
    [],
  );

  const segments = useMemo(
    () =>
      SEGMENT_DEFS.map((s) => ({
        value: s.value,
        label: counts[s.value] > 0 ? `${s.label} (${counts[s.value]})` : s.label,
      })),
    [counts],
  );

  const handleViewDetails = (job: HandymanJob) => {
    haptic.selection();
    router.push(`/(handyman)/job-details/${job.id}`);
  };

  return (
    <SafeAreaView style={ss.safe} edges={["top"]}>
      <View style={ss.header}>
        <Text style={ss.largeTitle}>My Jobs</Text>
        <TouchableOpacity style={ss.avatarBtn} activeOpacity={0.8}>
          <Image
            source={{ uri: "https://i.pravatar.cc/150?u=handyman" }}
            style={ss.headerAvatar}
          />
        </TouchableOpacity>
      </View>

      <View style={ss.segmentWrap}>
        <SegmentedControl<JobSegment>
          segments={segments}
          value={segment}
          onChange={setSegment}
        />
      </View>

      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={ss.listContent}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <PromoCard
            title="Want more jobs?"
            subtitle="Keep your profile updated and get more job opportunities."
            ctaLabel="Update Profile"
            onPress={() => router.push("/(handyman)/profile-edit" as any)}
          />
        }
        renderItem={({ item }) => (
          <JobCard
            variant="full"
            job={item}
            onPress={() => handleViewDetails(item)}
            onAccept={() => haptic.success()}
            onStart={() => haptic.tap()}
            onComplete={() => haptic.success()}
            onViewDetails={() => handleViewDetails(item)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon={EMPTY_COPY[segment].icon}
            title={EMPTY_COPY[segment].title}
            subtitle={EMPTY_COPY[segment].sub}
          />
        }
      />
    </SafeAreaView>
  );
}

const ss = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.ios.systemGroupedBackground },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.xl,
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
  segmentWrap: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
  },
  listContent: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: 120,
    gap: theme.spacing.md + 2,
  },
});
