import { haptic } from "@/src/lib/haptics";
import { theme } from "@/src/theme/theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { JobStatus, JobStatusPill } from "./JobStatusPill";

export type JobCardData = {
  id: string;
  service: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  customer?: string;
  address?: string;
  distanceKm?: number;
  distanceLabel?: string;
  postedAgo?: string;
  price: number;
  status?: JobStatus;
};

type CommonProps = {
  job: JobCardData;
  onPress?: () => void;
};

type FullProps = CommonProps & {
  variant: "full";
  onAccept?: () => void;
  onStart?: () => void;
  onComplete?: () => void;
  onViewDetails?: () => void;
};

type CompactProps = CommonProps & {
  variant?: "compact";
  onAccept?: () => void;
  onDetails?: () => void;
};

export type JobCardProps = FullProps | CompactProps;

export const JobCard = React.memo(function JobCard(props: JobCardProps) {
  if (props.variant === "full") return <FullCard {...props} />;
  return <CompactCard {...props} />;
});

function FullCard({ job, onPress, onAccept, onStart, onComplete, onViewDetails }: FullProps) {
  const status = job.status ?? "incoming";
  const distance = job.distanceLabel ?? (job.distanceKm != null ? `${job.distanceKm.toFixed(1)} km away` : undefined);

  const stop = (fn?: () => void) => (e: any) => {
    e?.stopPropagation?.();
    fn?.();
  };

  return (
    <TouchableOpacity style={ss.fullCard} activeOpacity={0.9} onPress={onPress}>
      <View style={ss.iconTile}>
        <MaterialCommunityIcons name={job.icon} size={42} color={theme.colors.primary} />
      </View>

      <View style={ss.fullContent}>
        <View style={ss.titleRow}>
          <Text style={ss.title} numberOfLines={1}>{job.service}</Text>
          <JobStatusPill status={status} />
        </View>

        {job.customer ? (
          <MetaRow icon="person-outline" text={job.customer} />
        ) : null}

        {job.address ? (
          <MetaRow icon="location-outline" text={job.address} />
        ) : null}
        {distance ? <Text style={ss.distanceText}>{distance}</Text> : null}

        <View style={ss.bottomRow}>
          <View style={ss.timeRow}>
            <Ionicons name="time-outline" size={13} color={theme.colors.textMuted} />
            <Text style={ss.metaMuted}>{job.postedAgo ?? ""}</Text>
          </View>

          <View style={ss.priceAction}>
            <Text style={ss.priceText}>${job.price}</Text>
            {status === "incoming" && (
              <TouchableOpacity style={ss.btnPrimary} onPress={stop(() => { haptic.success(); onAccept?.(); })} activeOpacity={0.8}>
                <Text style={ss.btnPrimaryText}>Accept</Text>
              </TouchableOpacity>
            )}
            {status === "active" && (
              <TouchableOpacity style={ss.btnDark} onPress={stop(() => { haptic.tap(); onStart?.(); })} activeOpacity={0.8}>
                <Text style={ss.btnDarkText}>Start Job</Text>
              </TouchableOpacity>
            )}
            {status === "completed" && (
              <TouchableOpacity style={ss.btnOutline} onPress={stop(() => { haptic.selection(); onViewDetails?.(); })} activeOpacity={0.8}>
                <Text style={ss.btnOutlineText}>View Details</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function CompactCard({ job, onPress, onAccept, onDetails }: CompactProps) {
  const distance = job.distanceLabel ?? (job.distanceKm != null ? `${job.distanceKm.toFixed(1)} km` : undefined);

  return (
    <TouchableOpacity style={ss.compactCard} activeOpacity={0.85} onPress={onPress}>
      <View style={ss.compactTop}>
        <View style={ss.iconChip}>
          <MaterialCommunityIcons name={job.icon} size={22} color={theme.colors.primary} />
        </View>
        <View style={ss.compactTitleCol}>
          <Text style={ss.compactTitle} numberOfLines={1}>{job.service}</Text>
          <View style={ss.compactMetaRow}>
            {job.customer ? <Text style={ss.metaMuted} numberOfLines={1}>{job.customer}</Text> : null}
            {job.customer && (distance || job.postedAgo) ? <Dot /> : null}
            {distance ? <Text style={ss.metaMuted}>{distance}</Text> : null}
            {distance && job.postedAgo ? <Dot /> : null}
            {job.postedAgo ? <Text style={ss.metaMuted}>{job.postedAgo}</Text> : null}
          </View>
        </View>
        <Text style={ss.priceText}>${job.price}</Text>
      </View>

      {(onAccept || onDetails) ? (
        <View style={ss.compactBtnRow}>
          {onDetails ? (
            <TouchableOpacity style={ss.btnMuted} activeOpacity={0.8} onPress={() => { haptic.selection(); onDetails?.(); }}>
              <Text style={ss.btnMutedText}>Details</Text>
            </TouchableOpacity>
          ) : null}
          {onAccept ? (
            <TouchableOpacity style={ss.btnPrimaryFlex} activeOpacity={0.8} onPress={() => { haptic.success(); onAccept?.(); }}>
              <Text style={ss.btnPrimaryText}>Accept</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

function MetaRow({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  return (
    <View style={ss.metaRow}>
      <Ionicons name={icon} size={13} color={theme.colors.textMuted} />
      <Text style={ss.metaText} numberOfLines={1}>{text}</Text>
    </View>
  );
}

function Dot() {
  return <View style={ss.dot} />;
}

const ss = StyleSheet.create({
  // ── Full ─────────────────────────────────────────────────────────────────
  fullCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    flexDirection: "row",
    padding: theme.spacing.md + 2,
    gap: theme.spacing.md + 2,
    borderWidth: theme.hairline,
    borderColor: theme.colors.borderLight,
    ...theme.shadows.small,
  },
  iconTile: {
    width: 100,
    height: 120,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.primarySubtle,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  fullContent: { flex: 1, justifyContent: "space-between" },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs + 2,
  },
  title: {
    ...theme.typography.ios.headline,
    color: theme.colors.textPrimary,
    flex: 1,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs + 1,
    marginBottom: 2,
  },
  metaText: {
    ...theme.typography.ios.footnote,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  distanceText: {
    ...theme.typography.ios.caption1,
    color: theme.colors.textMuted,
    marginLeft: 18,
    marginBottom: theme.spacing.xs + 2,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: theme.spacing.xs,
  },
  timeRow: { flexDirection: "row", alignItems: "center", gap: theme.spacing.xs },
  metaMuted: { ...theme.typography.ios.caption1, color: theme.colors.textMuted },

  priceAction: { flexDirection: "row", alignItems: "center", gap: theme.spacing.sm },
  priceText: {
    ...theme.typography.ios.title3,
    color: theme.colors.primary,
    fontWeight: "700",
    letterSpacing: -0.5,
  },

  btnPrimary: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.full,
  },
  btnPrimaryFlex: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm + 2,
    borderRadius: theme.radius.full,
    alignItems: "center",
  },
  btnPrimaryText: {
    ...theme.typography.ios.footnote,
    color: theme.colors.surface,
    fontWeight: "700",
  },
  btnDark: {
    backgroundColor: theme.colors.textPrimary,
    paddingHorizontal: theme.spacing.md + 2,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.full,
  },
  btnDarkText: {
    ...theme.typography.ios.footnote,
    color: theme.colors.surface,
    fontWeight: "700",
  },
  btnOutline: {
    borderWidth: theme.hairline * 2,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm - 1,
    borderRadius: theme.radius.full,
  },
  btnOutlineText: {
    ...theme.typography.ios.footnote,
    color: theme.colors.textPrimary,
    fontWeight: "600",
  },

  // ── Compact ──────────────────────────────────────────────────────────────
  compactCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    ...theme.shadows.small,
  },
  compactTop: { flexDirection: "row", alignItems: "center", gap: theme.spacing.md },
  iconChip: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primarySubtle,
    alignItems: "center",
    justifyContent: "center",
  },
  compactTitleCol: { flex: 1 },
  compactTitle: {
    ...theme.typography.ios.headline,
    color: theme.colors.textPrimary,
  },
  compactMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    flexWrap: "wrap",
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: theme.colors.textMuted,
    marginHorizontal: theme.spacing.xs + 2,
  },
  compactBtnRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: theme.hairline,
    borderTopColor: theme.colors.borderLight,
  },
  btnMuted: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surfaceAlt,
    paddingVertical: theme.spacing.sm + 2,
    borderRadius: theme.radius.full,
  },
  btnMutedText: {
    ...theme.typography.ios.subhead,
    color: theme.colors.textPrimary,
    fontWeight: "600",
  },
});
