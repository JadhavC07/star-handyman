import { haptic } from "@/src/lib/haptics";
import { theme } from "@/src/theme/theme";
import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { MMKV, useMMKVBoolean } from "react-native-mmkv";

import React from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const storage = new MMKV({ id: "notif-settings" });

// ── Setting row ───────────────────────────────────────────────────────────────
function SettingRow({
  iconName,
  iconBg,
  label,
  description,
  storageKey,
  disabled,
}: {
  iconName: any;
  iconBg: string;
  label: string;
  description: string;
  storageKey: string;
  disabled?: boolean;
}) {
  const [enabled, setEnabled] = useMMKVBoolean(storageKey, storage);
  const value = enabled ?? true; // default ON

  const toggle = (val: boolean) => {
    haptic.selection();
    setEnabled(val);
  };

  return (
    <View style={[ss.row, disabled && ss.rowDisabled]}>
      <View style={[ss.iconWrap, { backgroundColor: iconBg + "1A" }]}>
        <Ionicons name={iconName} size={20} color={iconBg} />
      </View>
      <View style={ss.rowText}>
        <Text style={ss.rowLabel}>{label}</Text>
        <Text style={ss.rowDesc}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={toggle}
        disabled={disabled}
        trackColor={{
          false: theme.colors.border,
          true: theme.colors.primary + "80",
        }}
        thumbColor={value ? theme.colors.primary : "#fff"}
        ios_backgroundColor={theme.colors.border}
      />
    </View>
  );
}

// ── Section header ────────────────────────────────────────────────────────────
function SectionHeader({ label }: { label: string }) {
  return <Text style={ss.sectionLabel}>{label}</Text>;
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function NotificationSettingsScreen() {
  const [masterEnabled, setMasterEnabled] = useMMKVBoolean(
    "notif.master",
    storage,
  );
  const master = masterEnabled ?? true;

  const handleMasterToggle = (val: boolean) => {
    haptic.selection();
    setMasterEnabled(val);
  };

  return (
    <SafeAreaView style={ss.safe} edges={["top"]}>
      {/* Header */}
      <View style={ss.header}>
        <TouchableOpacity
          style={ss.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color={theme.colors.textPrimary}
          />
        </TouchableOpacity>
        <Text style={ss.headerTitle}>Notification Settings</Text>
        <View style={ss.backBtn} />
      </View>

      <ScrollView
        contentContainerStyle={ss.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Master toggle card */}
        <View style={ss.masterCard}>
          <View style={ss.masterLeft}>
            <View
              style={[
                ss.iconWrap,
                { backgroundColor: theme.colors.primarySubtle },
              ]}
            >
              <Ionicons
                name="notifications"
                size={22}
                color={theme.colors.primary}
              />
            </View>
            <View>
              <Text style={ss.masterLabel}>Push Notifications</Text>
              <Text style={ss.masterDesc}>
                {master
                  ? "Notifications are enabled"
                  : "All notifications muted"}
              </Text>
            </View>
          </View>
          <Switch
            value={master}
            onValueChange={handleMasterToggle}
            trackColor={{
              false: theme.colors.border,
              true: theme.colors.primary + "80",
            }}
            thumbColor={master ? theme.colors.primary : "#fff"}
            ios_backgroundColor={theme.colors.border}
          />
        </View>

        {/* Jobs */}
        <SectionHeader label="Jobs" />
        <View style={ss.group}>
          <SettingRow
            iconName="briefcase-outline"
            iconBg={theme.colors.ios.blue}
            label="New Job Alerts"
            description="Get notified when a new job matches your skills"
            storageKey="notif.jobs.new"
            disabled={!master}
          />
          <View style={ss.divider} />
          <SettingRow
            iconName="checkmark-circle-outline"
            iconBg={theme.colors.ios.green}
            label="Job Accepted / Completed"
            description="Status updates on your assigned jobs"
            storageKey="notif.jobs.status"
            disabled={!master}
          />
          <View style={ss.divider} />
          <SettingRow
            iconName="close-circle-outline"
            iconBg={theme.colors.ios.orange}
            label="Job Cancellations"
            description="When a customer cancels a booked job"
            storageKey="notif.jobs.cancelled"
            disabled={!master}
          />
        </View>

        {/* Payments */}
        <SectionHeader label="Payments" />
        <View style={ss.group}>
          <SettingRow
            iconName="card-outline"
            iconBg={theme.colors.ios.green}
            label="Payment Received"
            description="When a payment is credited to your account"
            storageKey="notif.payment.received"
            disabled={!master}
          />
          <View style={ss.divider} />
          <SettingRow
            iconName="alert-circle-outline"
            iconBg={theme.colors.ios.orange}
            label="Payment Issues"
            description="Failed or disputed payment alerts"
            storageKey="notif.payment.issues"
            disabled={!master}
          />
        </View>

        {/* Reviews */}
        <SectionHeader label="Reviews & Ratings" />
        <View style={ss.group}>
          <SettingRow
            iconName="star-outline"
            iconBg={theme.colors.ios.yellow}
            label="New Reviews"
            description="When a customer leaves you a review"
            storageKey="notif.reviews"
            disabled={!master}
          />
        </View>

        {/* Account */}
        <SectionHeader label="Account" />
        <View style={ss.group}>
          <SettingRow
            iconName="shield-checkmark-outline"
            iconBg={theme.colors.ios.indigo}
            label="Verification Updates"
            description="KYC and document verification status"
            storageKey="notif.account.verification"
            disabled={!master}
          />
          <View style={ss.divider} />
          <SettingRow
            iconName="megaphone-outline"
            iconBg={theme.colors.ios.purple}
            label="Promotions & Offers"
            description="Platform updates and special promotions"
            storageKey="notif.promotions"
            disabled={!master}
          />
        </View>

        {/* Info note */}
        <View style={ss.infoBox}>
          <Feather name="info" size={14} color={theme.colors.textMuted} />
          <Text style={ss.infoText}>
            These preferences are saved locally. To manage system-level
            notifications, go to your phone&apos;s Settings app.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const ss = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.ios.systemGroupedBackground,
  },
  scroll: { paddingHorizontal: theme.spacing.xl, paddingBottom: 40 },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.ios.tertiaryFill,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    ...theme.typography.ios.headline,
    color: theme.colors.textPrimary,
  },

  // Master card
  masterCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xs,
    ...theme.shadows.small,
  },
  masterLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  masterLabel: {
    ...theme.typography.ios.headline,
    color: theme.colors.textPrimary,
  },
  masterDesc: {
    ...theme.typography.ios.caption1,
    color: theme.colors.textMuted,
    marginTop: 2,
  },

  // Section
  sectionLabel: {
    ...theme.typography.ios.footnote,
    color: theme.colors.textMuted,
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
  },

  // Group
  group: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    overflow: "hidden",
    ...theme.shadows.small,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.border,
    marginLeft: 56 + theme.spacing.lg,
  },

  // Row
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  rowDisabled: { opacity: 0.4 },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  rowText: { flex: 1 },
  rowLabel: {
    ...theme.typography.ios.subhead,
    fontWeight: "600",
    color: theme.colors.textPrimary,
  },
  rowDesc: {
    ...theme.typography.ios.caption1,
    color: theme.colors.textMuted,
    marginTop: 2,
  },

  // Info
  infoBox: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xl,
    padding: theme.spacing.md,
  },
  infoText: {
    ...theme.typography.ios.caption1,
    color: theme.colors.textMuted,
    flex: 1,
    lineHeight: 17,
  },
});
