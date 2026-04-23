import { HandymanJob, MOCK_JOBS } from "@/app/(handyman)/(tabs)/jobs";
import { CustomerHeader } from "@/src/components/jobDetails/CustomerHeader";
import { DetailCard } from "@/src/components/jobDetails/DetailCard";
import { JobDetailsBottomBar } from "@/src/components/jobDetails/JobDetailsBottomBar";
import { haptic } from "@/src/lib/haptics";
import { theme } from "@/src/theme/theme";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function JobDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const job: HandymanJob | undefined = useMemo(
    () => MOCK_JOBS.find((j) => j.id === id),
    [id],
  );

  if (!job) {
    return (
      <SafeAreaView style={ss.safe} edges={["top"]}>
        <View style={ss.notFound}>
          <Text style={ss.notFoundText}>Job not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleBack = () => {
    haptic.selection();
    router.back();
  };
  const handleAccept = () => haptic.success();
  const handleSendQuote = () => haptic.selection();
  const handleChat = () => haptic.selection();
  const handleCall = () => haptic.tap();

  return (
    <SafeAreaView style={ss.safe} edges={["top", "bottom"]}>
      <NavBar onBack={handleBack} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={ss.scroll}
      >
        <CustomerHeader
          avatar={job.customerAvatar}
          name={job.customer}
          rating={job.customerRating}
          reviews={job.customerReviews}
          onChat={handleChat}
          onCall={handleCall}
        />

        <View style={ss.card}>
          <View style={ss.jobInfoTop}>
            <View style={ss.serviceIconBox}>
              <MaterialCommunityIcons
                name={job.icon}
                size={36}
                color={theme.colors.primary}
              />
            </View>
            <View style={ss.jobInfoRight}>
              <Text style={ss.jobTitle}>{job.service}</Text>
              <View style={ss.categoryChip}>
                <Text style={ss.categoryChipText}>{job.category}</Text>
              </View>
              {job.notes ? (
                <Text style={ss.jobNotes} numberOfLines={3}>
                  {job.notes}
                </Text>
              ) : null}
            </View>
          </View>
          <View style={ss.postedRow}>
            <Ionicons name="time-outline" size={14} color={theme.colors.textMuted} />
            <Text style={ss.postedText}>Posted {job.postedAgo}</Text>
          </View>
        </View>

        <DetailCard icon="location" title="Location">
          <View style={ss.locationBody}>
            <View style={ss.locationTextCol}>
              <Text style={ss.locationAddress}>{job.address}</Text>
              <Text style={ss.locationDistance}>
                {job.distanceKm.toFixed(1)} km away
              </Text>
            </View>
            <View style={ss.mapThumb}>
              <Ionicons name="map-outline" size={28} color={theme.colors.textMuted} />
            </View>
          </View>
        </DetailCard>

        <DetailCard icon="cash-outline" title="Budget & Payment">
          <Text style={ss.priceRange}>${job.priceMin} – ${job.priceMax}</Text>
          <View style={ss.paymentMeta}>
            <PaymentMetaRow
              icon="card-outline"
              label="Payment Type"
              value={job.paymentType}
            />
            <PaymentMetaRow
              icon="pricetag-outline"
              label="Budget Type"
              value={job.budgetType}
            />
          </View>
        </DetailCard>

        {job.photos && job.photos.length > 0 ? (
          <DetailCard
            icon="images-outline"
            iconColor={theme.colors.ios.indigo}
            title="Photos"
            right={
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={ss.viewAllText}>View All ({job.photos.length})</Text>
              </TouchableOpacity>
            }
          >
            <View style={ss.photosRow}>
              {job.photos.map((uri, i) => (
                <TouchableOpacity key={i} activeOpacity={0.85} style={{ flex: 1 }}>
                  <Image source={{ uri }} style={ss.photoThumb} />
                </TouchableOpacity>
              ))}
            </View>
          </DetailCard>
        ) : null}

        <DetailCard
          icon="calendar-outline"
          iconColor={theme.colors.ios.indigo}
          title="Schedule"
        >
          <View style={ss.scheduleRow}>
            <SchedulePill label="Preferred Date" value={job.date} icon="calendar-outline" />
            <SchedulePill label="Preferred Time" value={job.timeRange} icon="time-outline" />
          </View>
        </DetailCard>

        <View style={{ height: 120 }} />
      </ScrollView>

      <JobDetailsBottomBar
        onSendQuote={handleSendQuote}
        onAccept={handleAccept}
      />
    </SafeAreaView>
  );
}

function NavBar({ onBack }: { onBack: () => void }) {
  return (
    <View style={ss.navBar}>
      <TouchableOpacity style={ss.navBtn} onPress={onBack} activeOpacity={0.7}>
        <Feather name="arrow-left" size={20} color={theme.colors.textPrimary} />
      </TouchableOpacity>
      <Text style={ss.navTitle}>Job Details</Text>
      <TouchableOpacity style={ss.navBtn} activeOpacity={0.7}>
        <Feather name="more-horizontal" size={20} color={theme.colors.textPrimary} />
      </TouchableOpacity>
    </View>
  );
}

function PaymentMetaRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={ss.paymentMetaRow}>
      <Ionicons name={icon} size={15} color={theme.colors.textMuted} />
      <Text style={ss.paymentMetaLabel}>{label}</Text>
      <Text style={ss.paymentMetaValue}>{value}</Text>
    </View>
  );
}

function SchedulePill({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={ss.schedulePill}>
      <Ionicons name={icon} size={14} color={theme.colors.textMuted} />
      <View>
        <Text style={ss.scheduleLabel}>{label}</Text>
        <Text style={ss.scheduleValue}>{value}</Text>
      </View>
    </View>
  );
}

const ss = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.ios.systemGroupedBackground },

  // Nav bar
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: theme.hairline,
    borderBottomColor: theme.colors.border,
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  navTitle: {
    ...theme.typography.ios.headline,
    color: theme.colors.textPrimary,
  },

  scroll: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    gap: theme.spacing.md,
  },

  // Job info card (bespoke because of side-by-side icon+content layout)
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    borderWidth: theme.hairline,
    borderColor: theme.colors.borderLight,
    ...theme.shadows.small,
  },
  jobInfoTop: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.sm + 2,
  },
  serviceIconBox: {
    width: 80,
    height: 90,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.primarySubtle,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  jobInfoRight: { flex: 1 },
  jobTitle: {
    ...theme.typography.ios.headline,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs + 2,
  },
  categoryChip: {
    alignSelf: "flex-start",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.full,
    borderWidth: theme.hairline * 2,
    borderColor: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  categoryChipText: {
    ...theme.typography.ios.caption1,
    color: theme.colors.primary,
    fontWeight: "600",
  },
  jobNotes: {
    ...theme.typography.ios.footnote,
    color: theme.colors.textSecondary,
    lineHeight: 19,
  },
  postedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs + 1,
  },
  postedText: {
    ...theme.typography.ios.footnote,
    color: theme.colors.textMuted,
  },

  // Location
  locationBody: { flexDirection: "row", alignItems: "center", gap: theme.spacing.md },
  locationTextCol: { flex: 1 },
  locationAddress: {
    ...theme.typography.ios.footnote,
    fontWeight: "500",
    color: theme.colors.textPrimary,
    lineHeight: 20,
    marginBottom: theme.spacing.xs,
  },
  locationDistance: {
    ...theme.typography.ios.footnote,
    color: theme.colors.textMuted,
  },
  mapThumb: {
    width: 72,
    height: 60,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceAlt,
    borderWidth: theme.hairline,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  // Budget
  priceRange: {
    ...theme.typography.ios.title1,
    fontWeight: "800",
    color: theme.colors.primary,
    letterSpacing: -1,
    marginBottom: theme.spacing.xs,
  },
  paymentMeta: { gap: theme.spacing.xs + 2 },
  paymentMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs + 2,
  },
  paymentMetaLabel: {
    ...theme.typography.ios.footnote,
    color: theme.colors.textMuted,
    flex: 1,
  },
  paymentMetaValue: {
    ...theme.typography.ios.footnote,
    color: theme.colors.primary,
    fontWeight: "600",
  },

  // Photos
  viewAllText: {
    ...theme.typography.ios.footnote,
    color: theme.colors.primary,
    fontWeight: "600",
  },
  photosRow: { flexDirection: "row", gap: theme.spacing.sm },
  photoThumb: {
    flex: 1,
    height: 90,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceAlt,
  },

  // Schedule
  scheduleRow: { flexDirection: "row", gap: theme.spacing.md },
  schedulePill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
  },
  scheduleLabel: {
    ...theme.typography.ios.caption2,
    color: theme.colors.textMuted,
    marginBottom: 3,
  },
  scheduleValue: {
    ...theme.typography.ios.footnote,
    fontWeight: "700",
    color: theme.colors.primary,
  },

  notFound: { flex: 1, alignItems: "center", justifyContent: "center" },
  notFoundText: {
    ...theme.typography.ios.body,
    color: theme.colors.textMuted,
  },
});
