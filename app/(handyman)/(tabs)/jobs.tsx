import AppHeader from "@/src/components/common/AppHeader";
import { Button, SegmentedControl } from "@/src/components/ui";
import { haptic } from "@/src/lib/haptics";
import { theme } from "@/src/theme/theme";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
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

type JobStatus = "incoming" | "active" | "completed";
type JobSegment = JobStatus;

interface HandymanJob {
  id: string;
  service: string;
  customer: string;
  customerAvatar: string;
  address: string;
  distanceKm: number;
  date: string;
  time: string;
  price: number;
  status: JobStatus;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  notes?: string;
}

const SEGMENTS: readonly { value: JobSegment; label: string }[] = [
  { value: "incoming", label: "Incoming" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
] as const;

const MOCK_JOBS: HandymanJob[] = [
  {
    id: "1",
    service: "Leaky Faucet Repair",
    customer: "Emily Watson",
    customerAvatar: "https://i.pravatar.cc/150?u=emily",
    address: "221B Baker Street, Apt 4",
    distanceKm: 2.4,
    date: "Today",
    time: "3:30 PM",
    price: 55,
    status: "incoming",
    icon: "pipe",
    notes: "Kitchen sink, dripping for 2 days.",
  },
  {
    id: "2",
    service: "Ceiling Fan Install",
    customer: "Michael Chen",
    customerAvatar: "https://i.pravatar.cc/150?u=michael",
    address: "45 Oak Avenue",
    distanceKm: 5.1,
    date: "Tomorrow",
    time: "11:00 AM",
    price: 90,
    status: "incoming",
    icon: "fan",
  },
  {
    id: "3",
    service: "AC Installation",
    customer: "David Carter",
    customerAvatar: "https://i.pravatar.cc/150?u=david",
    address: "12 Elm Park Road",
    distanceKm: 3.8,
    date: "Today",
    time: "2:30 PM",
    price: 120,
    status: "active",
    icon: "air-conditioner",
  },
  {
    id: "4",
    service: "Electrical Wiring",
    customer: "Alex Brown",
    customerAvatar: "https://i.pravatar.cc/150?u=alex",
    address: "88 Maple Court",
    distanceKm: 1.2,
    date: "Mar 20, 2026",
    time: "11:00 AM",
    price: 80,
    status: "completed",
    icon: "lightning-bolt",
  },
  {
    id: "5",
    service: "Door Lock Replacement",
    customer: "Sophia Kim",
    customerAvatar: "https://i.pravatar.cc/150?u=sophia",
    address: "7 Pine Lane",
    distanceKm: 4.6,
    date: "Mar 18, 2026",
    time: "9:30 AM",
    price: 45,
    status: "completed",
    icon: "lock-outline",
  },
];

export default function HandymanJobs() {
  const [segment, setSegment] = useState<JobSegment>("incoming");

  const jobs = useMemo(
    () => MOCK_JOBS.filter((j) => j.status === segment),
    [segment],
  );

  const handleAccept = (_id: string) => haptic.success();
  const handleDecline = (_id: string) => haptic.warning();
  const handleStart = (_id: string) => haptic.tap();
  const handleComplete = (_id: string) => haptic.success();
  const handleChat = (_id: string) => haptic.selection();
  const handleReview = (_id: string) => haptic.selection();

  return (
    <SafeAreaView style={ss.safe} edges={["top"]}>
      <AppHeader title="Jobs" />

      <View style={ss.segmentWrap}>
        <SegmentedControl<JobSegment>
          segments={SEGMENTS}
          value={segment}
          onChange={setSegment}
        />
      </View>

      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={ss.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <JobCard
            job={item}
            onAccept={() => handleAccept(item.id)}
            onDecline={() => handleDecline(item.id)}
            onStart={() => handleStart(item.id)}
            onComplete={() => handleComplete(item.id)}
            onChat={() => handleChat(item.id)}
            onReview={() => handleReview(item.id)}
          />
        )}
        ListEmptyComponent={<EmptyState segment={segment} />}
      />
    </SafeAreaView>
  );
}

// ── Job Card ──────────────────────────────────────────────

type JobCardProps = {
  job: HandymanJob;
  onAccept: () => void;
  onDecline: () => void;
  onStart: () => void;
  onComplete: () => void;
  onChat: () => void;
  onReview: () => void;
};

function JobCard({
  job,
  onAccept,
  onDecline,
  onStart,
  onComplete,
  onChat,
  onReview,
}: JobCardProps) {
  return (
    <View style={ss.card}>
      {/* Header */}
      <View style={ss.cardHeader}>
        <View style={ss.iconWrapper}>
          <MaterialCommunityIcons
            name={job.icon}
            size={20}
            color={theme.colors.primary}
          />
        </View>
        <View style={ss.titleContent}>
          <Text style={ss.serviceTitle} numberOfLines={1}>
            {job.service}
          </Text>
          <Text style={ss.priceText}>${job.price.toFixed(2)}</Text>
        </View>
        <StatusBadge status={job.status} />
      </View>

      <View style={ss.divider} />

      {/* Customer + time */}
      <View style={ss.cardBody}>
        <View style={ss.customerInfo}>
          <Image
            source={{ uri: job.customerAvatar }}
            style={ss.customerAvatar}
          />
          <View style={ss.customerText}>
            <Text style={ss.customerName} numberOfLines={1}>
              {job.customer}
            </Text>
            <Text style={ss.customerSub} numberOfLines={1}>
              {job.distanceKm.toFixed(1)} km away
            </Text>
          </View>
        </View>
        <View style={ss.timeInfo}>
          <Text style={ss.dateTime}>{job.date}</Text>
          <Text style={ss.timeLabel}>{job.time}</Text>
        </View>
      </View>

      {/* Location */}
      <View style={ss.metaRow}>
        <Ionicons
          name="location-outline"
          size={14}
          color={theme.colors.ios.secondaryLabel}
        />
        <Text style={ss.metaText} numberOfLines={1}>
          {job.address}
        </Text>
      </View>

      {/* Notes (only for incoming) */}
      {job.status === "incoming" && job.notes ? (
        <View style={ss.notesRow}>
          <Feather
            name="message-circle"
            size={13}
            color={theme.colors.ios.secondaryLabel}
          />
          <Text style={ss.notesText} numberOfLines={2}>
            {job.notes}
          </Text>
        </View>
      ) : null}

      {/* Footer actions */}
      <View style={ss.cardFooter}>
        {job.status === "incoming" && (
          <>
            <Button
              title="Decline"
              variant="tinted"
              size="medium"
              onPress={onDecline}
              style={ss.footerFlex1}
              textStyle={ss.declineText}
            />
            <Button
              title="Accept"
              variant="filled"
              size="medium"
              onPress={onAccept}
              style={ss.footerFlex2}
            />
          </>
        )}

        {job.status === "active" && (
          <>
            <Button
              title="Chat"
              variant="tinted"
              size="medium"
              onPress={onChat}
              style={ss.footerFlex1}
              leading={
                <Feather
                  name="message-square"
                  size={15}
                  color={theme.colors.ios.blue}
                />
              }
            />
            <Button
              title="Complete Job"
              variant="filled"
              size="medium"
              onPress={onComplete}
              style={ss.footerFlex2}
              trailing={
                <Ionicons name="checkmark-circle" size={16} color="#fff" />
              }
            />
          </>
        )}

        {job.status === "completed" && (
          <Button
            title="View Receipt"
            variant="tinted"
            size="medium"
            onPress={onReview}
            style={ss.footerFull}
            trailing={
              <Feather
                name="chevron-right"
                size={16}
                color={theme.colors.ios.blue}
              />
            }
          />
        )}
      </View>

      {/* Start hint shown for active jobs that haven't begun yet — optional decoration */}
      {job.status === "active" ? (
        <TouchableOpacity
          style={ss.startStrip}
          onPress={onStart}
          activeOpacity={0.8}
        >
          <Ionicons
            name="play-circle-outline"
            size={16}
            color={theme.colors.ios.blue}
          />
          <Text style={ss.startStripText}>Mark as started</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

// ── Status Badge ──────────────────────────────────────────

function StatusBadge({ status }: { status: JobStatus }) {
  const label =
    status === "incoming"
      ? "NEW"
      : status === "active"
        ? "IN PROGRESS"
        : "DONE";

  const style =
    status === "incoming"
      ? ss.badgeIncoming
      : status === "active"
        ? ss.badgeActive
        : ss.badgeCompleted;

  const textStyle =
    status === "incoming"
      ? ss.badgeIncomingText
      : status === "active"
        ? ss.badgeActiveText
        : ss.badgeCompletedText;

  return (
    <View style={[ss.badgeBase, style]}>
      <Text style={[ss.badgeText, textStyle]}>{label}</Text>
    </View>
  );
}

// ── Empty State ───────────────────────────────────────────

function EmptyState({ segment }: { segment: JobSegment }) {
  const copy = EMPTY_COPY[segment];

  return (
    <View style={ss.emptyState}>
      <View style={ss.emptyIconBg}>
        <Feather name={copy.icon} size={34} color={theme.colors.textMuted} />
      </View>
      <Text style={ss.emptyTitle}>{copy.title}</Text>
      <Text style={ss.emptySub}>{copy.sub}</Text>
    </View>
  );
}

const EMPTY_COPY: Record<
  JobSegment,
  { icon: keyof typeof Feather.glyphMap; title: string; sub: string }
> = {
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

// ── Styles ────────────────────────────────────────────────

const ss = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background },

  segmentWrap: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
  },

  listContent: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: 120,
  },

  // Card
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    ...theme.shadows.small,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.lg,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primarySubtle,
    alignItems: "center",
    justifyContent: "center",
  },
  titleContent: { flex: 1, marginLeft: 12 },
  serviceTitle: {
    ...theme.typography.ios.headline,
    color: theme.colors.textPrimary,
  },
  priceText: {
    ...theme.typography.ios.footnote,
    color: theme.colors.primary,
    fontWeight: "600",
    marginTop: 2,
  },

  // Badge
  badgeBase: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
  },
  badgeIncoming: { backgroundColor: `${theme.colors.primary}18` },
  badgeActive: { backgroundColor: `${theme.colors.warning}20` },
  badgeCompleted: { backgroundColor: theme.colors.surfaceAlt },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.6,
  },
  badgeIncomingText: { color: theme.colors.primary },
  badgeActiveText: { color: theme.colors.warning },
  badgeCompletedText: { color: theme.colors.textMuted },

  divider: {
    height: 1,
    backgroundColor: theme.colors.borderLight,
    marginHorizontal: theme.spacing.lg,
  },

  // Body
  cardBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
  },
  customerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  customerAvatar: { width: 36, height: 36, borderRadius: 18 },
  customerText: { flex: 1 },
  customerName: {
    ...theme.typography.ios.subhead,
    color: theme.colors.textPrimary,
    fontWeight: "600",
  },
  customerSub: {
    ...theme.typography.ios.caption1,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  timeInfo: { alignItems: "flex-end" },
  dateTime: {
    ...theme.typography.ios.subhead,
    color: theme.colors.textPrimary,
    fontWeight: "500",
  },
  timeLabel: {
    ...theme.typography.ios.caption1,
    color: theme.colors.textMuted,
  },

  // Meta rows (location / notes)
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
  },
  metaText: {
    ...theme.typography.ios.footnote,
    color: theme.colors.ios.secondaryLabel,
    flex: 1,
  },

  notesRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
  },
  notesText: {
    ...theme.typography.ios.footnote,
    color: theme.colors.ios.secondaryLabel,
    flex: 1,
    lineHeight: 18,
  },

  // Footer
  cardFooter: {
    flexDirection: "row",
    gap: 10,
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.md,
  },
  footerFlex1: { flex: 1 },
  footerFlex2: { flex: 2 },
  footerFull: { flex: 1 },
  declineText: { color: theme.colors.ios.destructive },

  startStrip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderTopWidth: theme.hairline,
    borderTopColor: theme.colors.borderLight,
  },
  startStripText: {
    ...theme.typography.ios.footnote,
    color: theme.colors.ios.blue,
    fontWeight: "600",
  },

  // Empty state
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
    paddingHorizontal: 40,
  },
  emptyIconBg: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: theme.colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    ...theme.typography.ios.headline,
    color: theme.colors.textPrimary,
    marginBottom: 6,
  },
  emptySub: {
    ...theme.typography.ios.footnote,
    color: theme.colors.textMuted,
    textAlign: "center",
    lineHeight: 18,
  },
});
