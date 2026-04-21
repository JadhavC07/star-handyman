import AppHeader from "@/src/components/common/AppHeader";
import { LanguageSheet } from "@/src/components/common/LanguageSheet";
import { BottomSheetRef } from "@/src/components/ui/BottomSheet";
import { LANGUAGE_OPTIONS } from "@/src/features/i18n/i18n.types";
import { useProfile } from "@/src/features/profile/useProfile";
import { useLogout } from "@/src/hooks/auth/useLogout";
import { useLanguage, useT } from "@/src/hooks/i18n/useLanguage";
import { haptic } from "@/src/lib/haptics";
import { theme } from "@/src/theme/theme";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
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
  const { mutate: logout, isPending: loggingOut } = useLogout();
  const { data: profileData, isLoading } = useProfile();
  console.log(
    "[PROFILE SCREEN] isLoading:",
    isLoading,
    "data:",
    profileData?.user?.name,
  );

  const t = useT("profile");
  const { language, setLanguage } = useLanguage();
  const langSheetRef = React.useRef<BottomSheetRef>(null);

  const user = profileData?.user;
  const profile = profileData?.profile;

  const handleLogout = () => {
    haptic.warning();
    Alert.alert(t("logout.title"), t("logout.message"), [
      { text: t("logout.cancel"), style: "cancel" },
      {
        text: t("logout.confirm"),
        style: "destructive",
        onPress: () =>
          logout(undefined, {
            onSuccess: () => {
              router.replace("/(auth)/login");
            },
          }),
      },
    ]);
  };

  const ACCOUNT_SECTION = [
    {
      id: "1",
      label: t("items.my_bookings"),
      icon: "clipboard-text-outline",
      color: theme.colors.primary,
      onPress: () => {
        haptic.tap();
        router.push("/bookings");
      },
    },
    {
      id: "2",
      label: t("items.addresses"),
      icon: "map-marker-outline",
      color: theme.colors.primary,
      onPress: () => haptic.tap(),
    },
    {
      id: "3",
      label: t("items.payment_methods"),
      icon: "credit-card-outline",
      color: theme.colors.primary,
      onPress: () => haptic.tap(),
    },
  ];

  const SUPPORT_SECTION = [
    {
      id: "4",
      label: t("items.notifications"),
      icon: "bell-outline",
      color: theme.colors.primary,
      onPress: () => haptic.tap(),
    },
    {
      id: "5",
      label: t("items.language"),
      icon: "web",
      color: theme.colors.primary,
      onPress: () => {
        haptic.tap();
        langSheetRef.current?.present();
      },
      trailing: LANGUAGE_OPTIONS.find((l) => l.code === language)?.nativeLabel,
    },
    {
      id: "6",
      label: t("items.help"),
      icon: "help-circle-outline",
      color: theme.colors.primary,
      onPress: () => haptic.tap(),
    },
    {
      id: "7",
      label: t("items.privacy"),
      icon: "shield-check-outline",
      color: theme.colors.primary,
      onPress: () => haptic.tap(),
    },
  ];

  return (
    <SafeAreaView style={ss.safe} edges={["top", "bottom"]}>
      <AppHeader
        title={t("header")}
        rightComponent={
          <TouchableOpacity>
            <Feather name="settings" size={20} />
          </TouchableOpacity>
        }
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={ss.scrollContent}
      >
        <View style={ss.profileHeader}>
          <View style={ss.avatarWrapper}>
            <Image
              source={{ uri: "https://i.pravatar.cc/150?img=11" }}
              style={ss.avatar}
            />
            <TouchableOpacity style={ss.editDot}>
              <Feather name="camera" size={14} color={theme.colors.surface} />
            </TouchableOpacity>
          </View>
          <View style={ss.profileInfo}>
            <Text style={ss.name}>{isLoading ? "—" : user?.name}</Text>
            <Text style={ss.email}>{isLoading ? "—" : user?.email}</Text>
            {profile?.city && <Text style={ss.city}>{profile.city}</Text>}
            <TouchableOpacity
              style={ss.editProfileBtn}
              onPress={() => router.push("/(auth)/edit-profile")}
            >
              <Text style={ss.editProfileText}>{t("edit_profile_cta")}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={ss.statsCard}>
          <View style={ss.statItem}>
            <Text style={ss.statNumber}>12</Text>
            <Text style={ss.statLabel}>{t("stats.jobs_done")}</Text>
          </View>
          <View style={ss.statDivider} />
          <View style={ss.statItem}>
            <Text style={ss.statNumber}>$45.50</Text>
            <Text style={ss.statLabel}>{t("stats.wallet")}</Text>
          </View>
          <View style={ss.statDivider} />
          <View style={ss.statItem}>
            <View style={ss.rewardRow}>
              <Ionicons name="trophy" size={14} color={theme.colors.rating} />
              <Text style={ss.statNumber}>{t("stats.gold_tier")}</Text>
            </View>
            <Text style={ss.statLabel}>{t("stats.member")}</Text>
          </View>
        </View>

        <Text style={ss.sectionLabel}>{t("sections.account_settings")}</Text>
        <View style={ss.menuCard}>
          {ACCOUNT_SECTION.map((item, index) => (
            <MenuRow
              key={item.id}
              item={item}
              isLast={index === ACCOUNT_SECTION.length - 1}
            />
          ))}
        </View>

        <Text style={ss.sectionLabel}>{t("sections.preferences_support")}</Text>
        <View style={ss.menuCard}>
          {SUPPORT_SECTION.map((item, index) => (
            <MenuRow
              key={item.id}
              item={item}
              isLast={index === SUPPORT_SECTION.length - 1}
            />
          ))}
        </View>

        <TouchableOpacity
          style={ss.logoutBtn}
          onPress={handleLogout}
          disabled={loggingOut}
        >
          <MaterialCommunityIcons
            name="logout"
            size={18}
            color={theme.colors.error}
          />
          <Text style={ss.logoutText}>
            {loggingOut ? t("logout.in_progress") : t("logout.button")}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 80 }} />
      </ScrollView>
      <LanguageSheet
        ref={langSheetRef}
        current={language}
        onSelect={async (lang) => {
          langSheetRef.current?.dismiss();
          await setLanguage(lang);
        }}
      />
    </SafeAreaView>
  );
}

const MenuRow = ({ item, isLast }: { item: any; isLast: boolean }) => (
  <View>
    <TouchableOpacity
      style={ss.menuRow}
      onPress={item.onPress}
      activeOpacity={0.7}
    >
      <View style={ss.menuLeft}>
        <View style={[ss.menuIconBox, { backgroundColor: item.color + "15" }]}>
          <MaterialCommunityIcons
            name={item.icon}
            size={20}
            color={item.color}
          />
        </View>
        <Text style={ss.menuLabel}>{item.label}</Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        {item.trailing && (
          <Text style={{ fontSize: 13, color: theme.colors.textMuted }}>
            {item.trailing}
          </Text>
        )}
        <Ionicons
          name="chevron-forward"
          size={16}
          color={theme.colors.textMuted}
        />
      </View>
    </TouchableOpacity>
    {!isLast && <View style={ss.divider} />}
  </View>
);

const ss = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.xl,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.xl,
    borderRadius: theme.radius.xl,
    marginTop: theme.spacing.lg,
    ...theme.shadows.small,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: theme.radius.full,
  },
  editDot: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: theme.colors.surface,
  },
  profileInfo: {
    flex: 1,
    marginLeft: theme.spacing.xl,
    justifyContent: "center",
  },
  name: {
    fontSize: 20,
    color: theme.colors.textPrimary,
  },
  email: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  editProfileBtn: {
    marginTop: 10,
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  editProfileText: {
    fontSize: 12,
    color: theme.colors.textPrimary,
  },
  statsCard: {
    flexDirection: "row",
    backgroundColor: theme.colors.surface,
    marginTop: theme.spacing.lg,
    borderRadius: theme.radius.xl,
    paddingVertical: 18,
    ...theme.shadows.small,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  rewardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statNumber: {
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: theme.colors.border,
  },
  sectionLabel: {
    fontSize: 15,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.xxl,
    marginBottom: theme.spacing.md,
  },
  menuCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    paddingVertical: 4,
    ...theme.shadows.small,
    overflow: "hidden",
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: theme.spacing.lg,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  menuIconBox: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  menuLabel: {
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  divider: {
    marginLeft: 70,
    marginRight: 16,
    height: 1,
    backgroundColor: theme.colors.border,
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
  logoutText: {
    fontSize: 15,
    color: theme.colors.error,
  },
  city: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
});
