import { ProfileIdentity } from "@/src/components/profile/ProfileIdentity";
import { ProfileInfoCard } from "@/src/components/profile/ProfileInfoCard";
import { MenuItem, ProfileMenuList } from "@/src/components/profile/ProfileMenuList";
import { useHandymanUpdateProfile } from "@/src/hooks/auth/useHandymanAuth";
import { useLogout } from "@/src/hooks/auth/useLogout";
import { useHandymanProfile } from "@/src/hooks/profile/useHandymanProfile";
import { haptic } from "@/src/lib/haptics";
import { theme } from "@/src/theme/theme";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
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
  const { mutate: updateProfile, isPending: updating } = useHandymanUpdateProfile();

  const user = data?.user;
  const profile = user?.profile;

  const goToEdit = () => {
    haptic.selection();
    router.push("/(handyman)/profile-edit" as any);
  };
  const goToSection = (key: string) =>
    router.push(`/(handyman)/profile-edit/${key}` as any);

  const handlePickAvatar = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert(
        "Camera permission needed",
        "Please allow camera access to take a profile photo.",
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      cameraType: ImagePicker.CameraType.front,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    const ext = (asset.uri.split(".").pop() ?? "jpg").toLowerCase();
    const mime =
      ext === "png" ? "image/png"
      : ext === "webp" ? "image/webp"
      : ext === "heic" ? "image/heic"
      : "image/jpeg";
    updateProfile(
      { avatar: { uri: asset.uri, name: `avatar.${ext}`, type: mime } },
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
            onSettled: () => router.replace("/(handyman-auth)/login"),
          }),
      },
    ]);
  };

  const rating = Number(profile?.rating ?? 0).toFixed(1);
  const reviewsCount = (profile as any)?.reviews_count ?? 0;
  const experienceYears = profile?.experience_years
    ? `${profile.experience_years}+ Years`
    : "—";
  const availabilityLabel = profile?.availability
    ? t(`profile.availability_options.${profile.availability}`)
    : "Available for jobs";
  const isAvailable = (profile?.availability as string | undefined) === "available";

  const menuItems = useMemo<MenuItem[]>(
    () => [
      {
        key: "edit-profile",
        label: "Edit Profile",
        iconName: "person",
        iconBg: theme.colors.ios.orange,
        onPress: goToEdit,
      },
      {
        key: "documents",
        label: "Documents / KYC Verification",
        iconName: "document-text",
        iconBg: theme.colors.ios.indigo,
        onPress: () => goToSection("legal"),
      },
      {
        key: "payment",
        label: "Payment Settings",
        iconName: "wallet",
        iconBg: theme.colors.ios.green,
        onPress: () => goToSection("bank"),
      },
      {
        key: "notifications",
        label: "Notifications",
        iconName: "notifications",
        iconBg: theme.colors.ios.purple,
        onPress: () => goToSection("other"),
      },
      {
        key: "help",
        label: "Help & Support",
        iconName: "help-circle",
        iconBg: theme.colors.ios.blue,
        onPress: () => goToSection("basic"),
      },
    ],
    [],
  );

  return (
    <SafeAreaView style={ss.safe} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={ss.scroll}
      >
        <View style={ss.topRow}>
          <TouchableOpacity
            style={ss.editIconBtn}
            onPress={goToEdit}
            activeOpacity={0.7}
          >
            <Feather name="edit-2" size={16} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        <ProfileIdentity
          name={user?.name}
          avatarUri={user?.avatar}
          isVerified={user?.is_verified}
          isLoading={isLoading}
          isUpdatingAvatar={updating}
          rating={rating}
          reviewsCount={reviewsCount}
          location={(profile as any)?.location}
          onPickAvatar={handlePickAvatar}
        />

        <ProfileInfoCard
          skills={profile?.category_enrollments
            ?.map((e) => e.category_name)
            .filter((n): n is string => !!n)}
          experienceYears={experienceYears}
          availabilityLabel={availabilityLabel}
          isAvailable={isAvailable}
        />

        <ProfileMenuList items={menuItems} />

        <TouchableOpacity
          style={ss.logoutBtn}
          onPress={handleLogout}
          disabled={loggingOut}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="logout" size={18} color={theme.colors.ios.destructive} />
          <Text style={ss.logoutText}>
            {loggingOut ? "Logging out…" : "Logout"}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 140 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const ss = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.ios.systemGroupedBackground,
  },
  scroll: { paddingHorizontal: theme.spacing.xl },
  topRow: {
    alignItems: "flex-end",
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xs,
  },
  editIconBtn: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadows.small,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm + 2,
    borderWidth: theme.hairline * 2,
    borderColor: `${theme.colors.primary}55`,
    borderRadius: theme.radius.lg,
    paddingVertical: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.small,
  },
  logoutText: {
    ...theme.typography.ios.subhead,
    fontWeight: "600",
    color: theme.colors.ios.destructive,
  },
});
