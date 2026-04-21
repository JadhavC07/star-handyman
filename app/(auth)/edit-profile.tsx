import { useProfile } from "@/src/features/profile/useProfile";
import { useUpdateProfile } from "@/src/hooks/profile/useUpdateProfile";
import { extractErrorMessage } from "@/src/lib/errorMessage";
import { theme } from "@/src/theme/theme";
import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditProfileScreen() {
  const { data } = useProfile();
  const updateProfile = useUpdateProfile();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Populate fields once profile loads
  useEffect(() => {
    if (!data?.user || !data?.profile) return;
    setName(data.user.name ?? "");
    setPhone(data.user.phone ?? "");
    setAddress(data.profile.address ?? "");
    setCity(data.profile.city ?? "");
    setPincode(data.profile.pincode ?? "");
  }, [data]);

  const isValid = name.trim().length >= 2 && phone.length === 10;

  const errorMessage = updateProfile.error
    ? extractErrorMessage(updateProfile.error)
    : null;

  const handleSave = () => {
    updateProfile.mutate(
      { name: name.trim(), phone, address, city, pincode },
      { onSuccess: () => router.back() },
    );
  };

  const wrapperStyle = (id: string) => [
    ss.inputWrapper,
    focusedField === id && ss.inputFocused,
  ];

  const iconColor = (id: string) =>
    focusedField === id ? theme.colors.primary : theme.colors.textMuted;

  const inputProps = (id: string) => ({
    onFocus: () => setFocusedField(id),
    onBlur: () => setFocusedField(null),
  });

  return (
    <SafeAreaView style={ss.safe}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={ss.flex}
        >
          {/* Header */}
          <View style={ss.header}>
            <TouchableOpacity onPress={() => router.back()} style={ss.backBtn}>
              <Ionicons
                name="arrow-back"
                size={22}
                color={theme.colors.textPrimary}
              />
            </TouchableOpacity>
            <Text style={ss.headerTitle}>Edit Profile</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView
            contentContainerStyle={ss.scroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={ss.card}>
              {/* Name */}
              <Text style={ss.label}>Full Name</Text>
              <View style={wrapperStyle("name")}>
                <Feather name="user" size={18} color={iconColor("name")} />
                <TextInput
                  style={ss.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Full Name"
                  placeholderTextColor={theme.colors.textMuted}
                  autoCapitalize="words"
                  {...inputProps("name")}
                />
              </View>

              {/* Phone */}
              <Text style={[ss.label, { marginTop: 16 }]}>Phone</Text>
              <View style={wrapperStyle("phone")}>
                <Text style={ss.countryCode}>🇨🇦 +1</Text>
                <View style={ss.separator} />
                <TextInput
                  style={ss.input}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Phone Number"
                  placeholderTextColor={theme.colors.textMuted}
                  keyboardType="phone-pad"
                  maxLength={10}
                  {...inputProps("phone")}
                />
                {phone.length === 10 && (
                  <Ionicons
                    name="checkmark-circle"
                    size={18}
                    color={theme.colors.success}
                  />
                )}
              </View>

              {/* Address */}
              <Text style={[ss.label, { marginTop: 16 }]}>Address</Text>
              <View style={wrapperStyle("address")}>
                <Feather
                  name="map-pin"
                  size={18}
                  color={iconColor("address")}
                />
                <TextInput
                  style={ss.input}
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Street Address"
                  placeholderTextColor={theme.colors.textMuted}
                  {...inputProps("address")}
                />
              </View>

              {/* City + Pincode row */}
              <View style={ss.row}>
                <View style={{ flex: 1 }}>
                  <Text style={[ss.label, { marginTop: 16 }]}>City</Text>
                  <View style={wrapperStyle("city")}>
                    <TextInput
                      style={[ss.input, { marginLeft: 0 }]}
                      value={city}
                      onChangeText={setCity}
                      placeholder="City"
                      placeholderTextColor={theme.colors.textMuted}
                      {...inputProps("city")}
                    />
                  </View>
                </View>
                <View style={{ width: 12 }} />
                <View style={{ flex: 1 }}>
                  <Text style={[ss.label, { marginTop: 16 }]}>Postal Code</Text>
                  <View style={wrapperStyle("pincode")}>
                    <TextInput
                      style={[ss.input, { marginLeft: 0 }]}
                      value={pincode}
                      onChangeText={setPincode}
                      placeholder="A1A 1A1"
                      placeholderTextColor={theme.colors.textMuted}
                      autoCapitalize="characters"
                      maxLength={7}
                      {...inputProps("pincode")}
                    />
                  </View>
                </View>
              </View>

              {errorMessage && <Text style={ss.errorText}>{errorMessage}</Text>}

              <TouchableOpacity
                style={[ss.saveBtn, !isValid && ss.saveBtnDisabled]}
                onPress={handleSave}
                disabled={!isValid || updateProfile.isPending}
                activeOpacity={0.85}
              >
                {updateProfile.isPending ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={ss.saveBtnText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const ss = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background },
  flex: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: 12,
    backgroundColor: theme.colors.background,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadows.small,
  },
  headerTitle: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
  },
  scroll: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xxl,
    marginTop: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  label: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: 6,
    fontSize: 12,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    paddingHorizontal: 14,
    height: 52,
    backgroundColor: theme.colors.background,
  },
  inputFocused: { borderColor: theme.colors.primary },
  countryCode: {
    ...theme.typography.body,
    fontSize: 15,
    color: theme.colors.textPrimary,
    fontWeight: "500",
  },
  separator: {
    width: 1,
    height: 22,
    backgroundColor: theme.colors.border,
    marginHorizontal: 10,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    height: "100%",
    fontSize: 15,
  },
  row: { flexDirection: "row" },
  errorText: {
    ...theme.typography.caption,
    color: theme.colors.error ?? "#EF4444",
    fontSize: 13,
    marginTop: 12,
    textAlign: "center",
  },
  saveBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    ...theme.shadows.medium,
  },
  saveBtnDisabled: { opacity: 0.5, elevation: 0, shadowOpacity: 0 },
  saveBtnText: {
    ...theme.typography.button,
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
