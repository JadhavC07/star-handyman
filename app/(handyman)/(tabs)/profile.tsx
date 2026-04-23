import { GroupedList, ListRow } from "@/src/components/ui";
import { useHandymanUpdateProfile } from "@/src/hooks/auth/useHandymanAuth";
import { useLogout } from "@/src/hooks/auth/useLogout";
import { useHandymanProfile } from "@/src/hooks/profile/useHandymanProfile";
import { haptic } from "@/src/lib/haptics";
import { theme } from "@/src/theme/theme";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const { t } = useTranslation("handyman");
  const { data, isLoading, refetch } = useHandymanProfile();
  const { mutate: logout, isPending: loggingOut } = useLogout();
  const { mutate: updateProfile, isPending: updating } =
    useHandymanUpdateProfile();

  const user = data?.user;
  const profile = user?.profile;

  const goToEdit = () => router.push("/(handyman)/profile-edit" as any);
  const goToSection = (key: string) =>
    router.push(`/(handyman)/profile-edit/${key}` as any);

  const handlePickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    const ext = asset.uri.split(".").pop() ?? "jpg";
    updateProfile(
      {
        avatar: { uri: asset.uri, name: `avatar.${ext}`, type: `image/${ext}` },
      },
      {
        onSuccess: () => {
          haptic.success();
          refetch();
        },
      },
    );
  };

  const handleLogout = () => {
    haptic.warning();
    Alert.alert("Log Out", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: () =>
          logout(undefined, {
            onSuccess: () => {
              router.replace("/(handyman-auth)/login");
            },
          }),
      },
    ]);
  };

  const rating = Number(profile?.rating ?? 0).toFixed(1);
  const radius = profile?.service_radius_km
    ? parseFloat(String(profile.service_radius_km)).toFixed(0)
    : "0";

  const availabilityLabel = profile?.availability
    ? t(`profile.availability_options.${profile.availability}`)
    : t("profile.empty");

  return (
    <SafeAreaView style={ss.safe} edges={["top", "bottom"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={ss.scroll}
      >
        {/* iOS large-title header */}
        <View style={ss.header}>
          <Text style={ss.largeTitle}>{t("profile.title")}</Text>
          <TouchableOpacity
            onPress={goToEdit}
            style={ss.headerAction}
            activeOpacity={0.6}
          >
            <Feather
              name="edit-2"
              size={16}
              color={theme.colors.ios.blue}
            />
            <Text style={ss.headerActionText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* ── Avatar + Info ─────────────────────────────── */}
        <View style={ss.profileCard}>
          <TouchableOpacity
            style={ss.avatarWrapper}
            onPress={handlePickAvatar}
            activeOpacity={0.85}
          >
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={ss.avatar} />
            ) : (
              <View style={[ss.avatar, ss.avatarFallback]}>
                <Text style={ss.avatarLetter}>
                  {user?.name?.[0]?.toUpperCase() ?? "H"}
                </Text>
              </View>
            )}
            <View style={ss.cameraDot}>
              {updating ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Feather name="camera" size={12} color="#fff" />
              )}
            </View>
          </TouchableOpacity>

          <View style={ss.profileInfo}>
            <Text style={ss.name} numberOfLines={1}>
              {isLoading ? "—" : user?.name}
            </Text>
            <Text style={ss.email} numberOfLines={1}>
              {isLoading ? "—" : user?.email}
            </Text>
            {user?.phone && <Text style={ss.phone}>{user.phone}</Text>}

            <View style={ss.badgeRow}>
              <View style={ss.roleBadge}>
                <Feather name="tool" size={11} color={theme.colors.primary} />
                <Text style={ss.roleBadgeText}>SERVICEMAN</Text>
              </View>
              {user?.is_verified && (
                <View style={ss.verifiedBadge}>
                  <Ionicons
                    name="checkmark-circle"
                    size={12}
                    color={theme.colors.success}
                  />
                  <Text style={ss.verifiedText}>Verified</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* ── Edit profile primary CTA ──────────────────── */}
        <TouchableOpacity
          style={ss.editCta}
          onPress={goToEdit}
          activeOpacity={0.85}
        >
          <Feather name="edit-2" size={16} color="#fff" />
          <Text style={ss.editCtaText}>{t("profile.edit")}</Text>
        </TouchableOpacity>

        {/* ── Stats ──────────────────────────────────────── */}
        <View style={ss.statsCard}>
          <StatItem label={t("profile.rating")} value={`⭐ ${rating}`} />
          <View style={ss.statDivider} />
          <StatItem
            label="Experience"
            value={`${profile?.experience_years ?? 0} yrs`}
          />
          <View style={ss.statDivider} />
          <StatItem label="Radius" value={`${radius} km`} />
        </View>

        {/* ── Section shortcuts ─────────────────────────── */}
        <View style={ss.groupWrap}>
          <GroupedList header={t("profile.sections.title")}>
            <ListRow
              icon="person.fill"
              iconBackground={theme.colors.ios.blue}
              title={t("profile.sections.basic.title")}
              subtitle={t("profile.sections.basic.subtitle")}
              trailing={{ type: "chevron" }}
              onPress={() => goToSection("basic")}
            />
            <ListRow
              icon="checkmark.circle.fill"
              iconBackground={theme.colors.ios.indigo}
              title={t("profile.sections.legal.title")}
              subtitle={profile?.sin_number ? "Verified" : t("profile.empty")}
              trailing={{ type: "chevron" }}
              onPress={() => goToSection("legal")}
            />
            <ListRow
              icon="doc.text"
              iconBackground={theme.colors.ios.orange}
              title={t("profile.sections.licenses.title")}
              subtitle={t("profile.sections.licenses.subtitle")}
              trailing={{ type: "chevron" }}
              onPress={() => goToSection("licenses")}
            />
            <ListRow
              icon="creditcard.fill"
              iconBackground={theme.colors.ios.green}
              title={t("profile.sections.bank.title")}
              subtitle={
                profile?.bank_name ? profile.bank_name : t("profile.empty")
              }
              trailing={{ type: "chevron" }}
              onPress={() => goToSection("bank")}
            />
            <ListRow
              icon="slider.horizontal.3"
              iconBackground={theme.colors.ios.purple}
              title={t("profile.sections.other.title")}
              subtitle={availabilityLabel}
              trailing={{ type: "chevron" }}
              onPress={() => goToSection("other")}
            />
          </GroupedList>
        </View>

        {/* ── Skills preview ─────────────────────────────── */}
        <Text style={ss.sectionLabel}>{t("profile.skills")}</Text>
        <View style={ss.infoCard}>
          {profile?.skills?.length ? (
            <View style={ss.skillsWrap}>
              {profile.skills.map((s, i) => (
                <View key={i} style={ss.skillChip}>
                  <Text style={ss.skillText}>{s}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={ss.emptySkills}>No skills added yet</Text>
          )}
        </View>

        {/* ── Notes ──────────────────────────────────────── */}
        {profile?.notes ? (
          <>
            <Text style={ss.sectionLabel}>Notes</Text>
            <View style={ss.infoCard}>
              <Text style={ss.notesText}>{profile.notes}</Text>
            </View>
          </>
        ) : null}

        {/* ── Logout ─────────────────────────────────────── */}
        <TouchableOpacity
          style={ss.logoutBtn}
          onPress={handleLogout}
          disabled={loggingOut}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name="logout"
            size={18}
            color={theme.colors.error}
          />
          <Text style={ss.logoutText}>
            {loggingOut ? "Logging out…" : "Log Out"}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const StatItem = ({ label, value }: { label: string; value: string }) => (
  <View style={ss.statItem}>
    <Text style={ss.statValue}>{value}</Text>
    <Text style={ss.statLabel}>{label}</Text>
  </View>
);

const ss = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.ios.systemGroupedBackground },
  scroll: { paddingHorizontal: theme.spacing.xl },

  header: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
  },
  largeTitle: {
    ...theme.typography.ios.largeTitle,
    color: theme.colors.textPrimary,
  },
  headerAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 6,
  },
  headerActionText: {
    ...theme.typography.ios.body,
    color: theme.colors.ios.blue,
    fontWeight: "500",
  },

  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.xl,
    borderRadius: theme.radius.xl,
    marginTop: theme.spacing.xs,
    ...theme.shadows.small,
  },
  avatarWrapper: { position: "relative" },
  avatar: { width: 80, height: 80, borderRadius: 40 },
  avatarFallback: {
    backgroundColor: theme.colors.primarySubtle,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLetter: {
    fontSize: 32,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  cameraDot: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: theme.colors.surface,
  },
  profileInfo: { flex: 1, marginLeft: theme.spacing.lg },
  name: { fontSize: 18, fontWeight: "600", color: theme.colors.textPrimary },
  email: { fontSize: 13, color: theme.colors.textSecondary, marginTop: 2 },
  phone: { fontSize: 12, color: theme.colors.textMuted, marginTop: 2 },
  badgeRow: { flexDirection: "row", gap: 8, marginTop: 8, flexWrap: "wrap" },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primarySubtle,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: theme.colors.primary,
    letterSpacing: 0.8,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.full,
    backgroundColor: `${theme.colors.success}18`,
  },
  verifiedText: {
    fontSize: 11,
    color: theme.colors.success,
    fontWeight: "600",
  },

  editCta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: theme.colors.primary,
    marginTop: theme.spacing.lg,
    paddingVertical: 14,
    borderRadius: theme.radius.lg,
    ...theme.shadows.small,
  },
  editCtaText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },

  statsCard: {
    flexDirection: "row",
    backgroundColor: theme.colors.surface,
    marginTop: theme.spacing.lg,
    borderRadius: theme.radius.xl,
    paddingVertical: 18,
    ...theme.shadows.small,
  },
  statItem: { flex: 1, alignItems: "center" },
  statDivider: { width: 1, height: 30, backgroundColor: theme.colors.border },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
  statLabel: { fontSize: 12, color: theme.colors.textMuted, marginTop: 4 },

  sectionLabel: {
    ...theme.typography.ios.headline,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.xxl,
    marginBottom: theme.spacing.md,
  },
  groupWrap: { marginTop: theme.spacing.xxl },
  infoCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 4,
    ...theme.shadows.small,
  },
  skillsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingVertical: 14,
  },
  skillChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primarySubtle,
  },
  skillText: { fontSize: 13, color: theme.colors.primary, fontWeight: "500" },
  emptySkills: {
    fontSize: 13,
    color: theme.colors.textMuted,
    paddingVertical: 14,
  },
  notesText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    paddingVertical: 14,
    lineHeight: 20,
  },

  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: theme.colors.surface,
    marginTop: theme.spacing.xxl,
    borderRadius: theme.radius.xl,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "#FEE2E2",
  },
  logoutText: { fontSize: 15, color: theme.colors.error },
});
