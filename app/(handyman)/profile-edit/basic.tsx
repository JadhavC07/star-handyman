import { EditSectionScaffold } from "@/src/features/profile/EditSectionScaffold";
import { FormField } from "@/src/features/profile/FormField";
import { validateEmail, validateName } from "@/src/features/profile/validators";
import { useHandymanUpdateProfile } from "@/src/hooks/auth/useHandymanAuth";
import { useHandymanProfile } from "@/src/hooks/profile/useHandymanProfile";
import { haptic } from "@/src/lib/haptics";
import { theme } from "@/src/theme/theme";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function BasicEditScreen() {
  const { t } = useTranslation("handyman");
  const { data } = useHandymanProfile();
  const { mutate: updateProfile, isPending } = useHandymanUpdateProfile();
  const user = data?.user;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{
    name?: string | null;
    email?: string | null;
  }>({});

  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setEmail(user.email ?? "");
    }
  }, [user]);

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
      mediaTypes: ["images"],
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
      {
        avatar: { uri: asset.uri, name: `avatar.${ext}`, type: mime },
      },
      {
        onSuccess: () => haptic.success(),
        onError: (err: any) =>
          Alert.alert("Upload failed", err?.message ?? "Try again"),
      },
    );
  };

  const handleSave = () => {
    const nextErrors = {
      name: validateName(name),
      email: validateEmail(email),
    };
    setErrors(nextErrors);
    if (nextErrors.name || nextErrors.email) {
      haptic.warning();
      Alert.alert("Fix errors", "Please complete the required fields.");
      return;
    }
    updateProfile(
      {
        name: name.trim(),
        email: email.trim(),
      },
      {
        onSuccess: () => {
          haptic.success();
          router.back();
        },
        onError: (err: any) =>
          Alert.alert("Update failed", err?.message ?? "Try again"),
      },
    );
  };

  return (
    <EditSectionScaffold
      title={t("profile.sections.basic.title")}
      subtitle={t("profile.sections.basic.subtitle")}
      saving={isPending}
      onSave={handleSave}
      saveLabel={t("profile.save")}
      cancelLabel={t("profile.cancel")}
    >
      {/* Avatar */}
      <View style={styles.avatarSection}>
        <TouchableOpacity
          style={styles.avatarWrap}
          onPress={handlePickAvatar}
          activeOpacity={0.85}
        >
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarFallback]}>
              <Text style={styles.avatarLetter}>
                {user?.name?.[0]?.toUpperCase() ?? "H"}
              </Text>
            </View>
          )}
          <View style={styles.cameraDot}>
            {isPending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Feather name="camera" size={12} color="#fff" />
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePickAvatar}>
          <Text style={styles.changePhoto}>
            {t("profile.fields.change_photo")}
          </Text>
        </TouchableOpacity>
      </View>

      <FormField
        label={t("profile.fields.name")}
        value={name}
        onChangeText={(v) => {
          setName(v);
          if (errors.name) setErrors((e) => ({ ...e, name: null }));
        }}
        placeholder="John Doe"
        autoCapitalize="words"
        maxLength={255}
        required
        error={errors.name}
      />

      <FormField
        label={t("profile.fields.email")}
        value={email}
        onChangeText={(v) => {
          setEmail(v);
          if (errors.email) setErrors((e) => ({ ...e, email: null }));
        }}
        placeholder="name@example.com"
        autoCapitalize="none"
        keyboardType="email-address"
        autoCorrect={false}
        maxLength={255}
        required
        error={errors.email}
      />
    </EditSectionScaffold>
  );
}

const styles = StyleSheet.create({
  avatarSection: {
    alignItems: "center",
    marginBottom: theme.spacing.xxl,
  },
  avatarWrap: { position: "relative" },
  avatar: { width: 96, height: 96, borderRadius: 48 },
  avatarFallback: {
    backgroundColor: theme.colors.primarySubtle,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLetter: {
    fontSize: 36,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  cameraDot: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: theme.colors.background,
  },
  changePhoto: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: "600",
    marginTop: 12,
  },
});
