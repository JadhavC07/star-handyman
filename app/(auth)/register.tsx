import { useRegister } from "@/src/hooks/auth/useRegister";
import { extractErrorMessage } from "@/src/lib/errorMessage";
import { theme } from "@/src/theme/theme";
import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
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

const RegisterScreen: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const register = useRegister();

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const passwordsMatch = password === passwordConfirm && password.length >= 8;
  const isValid =
    name.trim().length >= 2 &&
    emailValid &&
    phone.length === 10 &&
    passwordsMatch;

  const errorMessage = register.error
    ? extractErrorMessage(register.error)
    : null;

  const handleSignup = () => {
    register.mutate(
      {
        name: name.trim(),
        email: email.trim(),
        phone,
        password,
        password_confirmation: passwordConfirm,
      },
      { onSuccess: () => router.replace("/(app)/(tabs)") },
    );
  };

  const inputProps = (id: string) => ({
    onFocus: () => setFocusedField(id),
    onBlur: () => setFocusedField(null),
  });

  const wrapperStyle = (id: string) => [
    styles.inputWrapper,
    focusedField === id && styles.inputFocused,
  ];

  const iconColor = (id: string) =>
    focusedField === id ? theme.colors.primary : theme.colors.textMuted;

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.flex}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Top Bar */}
            <View style={styles.topBar}>
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backBtn}
              >
                <Ionicons
                  name="arrow-back"
                  size={22}
                  color={theme.colors.textPrimary}
                />
              </TouchableOpacity>
            </View>

            {/* Brand */}
            <View style={styles.brandSection}>
              <View style={styles.logoMark}>
                <Text style={styles.logoLetter}>U</Text>
              </View>
              <Text style={styles.brandName}>Join StarHandyMan</Text>
              <Text style={styles.brandTagline}>
                Get started with premium services
              </Text>
            </View>

            {/* Form Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Create Account</Text>
              <Text style={styles.cardSub}>Enter your details to register</Text>

              {/* Name */}
              <View style={wrapperStyle("name")}>
                <Feather name="user" size={18} color={iconColor("name")} />
                <TextInput
                  placeholder="Full Name"
                  placeholderTextColor={theme.colors.textMuted}
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  {...inputProps("name")}
                />
              </View>

              {/* Email */}
              <View style={[wrapperStyle("email"), { marginTop: 14 }]}>
                <Feather name="mail" size={18} color={iconColor("email")} />
                <TextInput
                  placeholder="Email Address"
                  placeholderTextColor={theme.colors.textMuted}
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  {...inputProps("email")}
                />
              </View>

              {/* Phone */}
              <View style={[wrapperStyle("phone"), { marginTop: 14 }]}>
                <Text style={styles.countryCode}>🇨🇦 +1</Text>
                <View style={styles.separator} />
                <TextInput
                  placeholder="Phone Number"
                  placeholderTextColor={theme.colors.textMuted}
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
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
              {phone.length > 0 && phone.length < 10 && (
                <Text style={styles.hint}>
                  {10 - phone.length} more digits needed
                </Text>
              )}

              {/* Password */}
              <View style={[wrapperStyle("password"), { marginTop: 14 }]}>
                <Feather name="lock" size={18} color={iconColor("password")} />
                <TextInput
                  placeholder="Password (min 8 chars)"
                  placeholderTextColor={theme.colors.textMuted}
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  {...inputProps("password")}
                />
                <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={18}
                    color={theme.colors.textMuted}
                  />
                </TouchableOpacity>
              </View>

              {/* Confirm Password */}
              <View style={[wrapperStyle("confirm"), { marginTop: 14 }]}>
                <Feather name="lock" size={18} color={iconColor("confirm")} />
                <TextInput
                  placeholder="Confirm Password"
                  placeholderTextColor={theme.colors.textMuted}
                  style={styles.input}
                  value={passwordConfirm}
                  onChangeText={setPasswordConfirm}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  {...inputProps("confirm")}
                />
                {passwordConfirm.length > 0 && (
                  <Ionicons
                    name={
                      passwordsMatch
                        ? "checkmark-circle"
                        : "close-circle-outline"
                    }
                    size={18}
                    color={
                      passwordsMatch
                        ? theme.colors.success
                        : (theme.colors.error ?? "#EF4444")
                    }
                  />
                )}
              </View>

              {/* Error */}
              {errorMessage && (
                <Text style={styles.errorText}>{errorMessage}</Text>
              )}

              <TouchableOpacity
                style={[styles.mainBtn, !isValid && styles.mainBtnDisabled]}
                onPress={handleSignup}
                disabled={!isValid || register.isPending}
                activeOpacity={0.85}
              >
                {register.isPending ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.mainBtnText}>Create Account</Text>
                )}
              </TouchableOpacity>

              <Text style={styles.termsText}>
                By signing up, you agree to our{" "}
                <Text style={styles.linkText}>Terms of Service</Text> and{" "}
                <Text style={styles.linkText}>Privacy Policy</Text>.
              </Text>

              <View style={styles.footer}>
                <Text style={styles.footerText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                  <Text style={styles.linkText}>Login</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.swapFooter}>
                <Text style={styles.footerText}>
                  Signing up as a handyman?{" "}
                </Text>
                <TouchableOpacity
                  onPress={() => router.push("/(handyman-auth)/register")}
                >
                  <Text style={styles.linkText}>Register here</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: 40,
  },
  topBar: { paddingTop: 8, marginBottom: 4 },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadows.small,
  },
  brandSection: {
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 28,
  },
  logoMark: {
    width: 56,
    height: 56,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    ...theme.shadows.medium,
  },
  logoLetter: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 26,
    color: "#FFFFFF",
  },
  brandName: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 24,
    color: theme.colors.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  brandTagline: {
    ...theme.typography.body,
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xxl,
    ...theme.shadows.medium,
  },
  cardTitle: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  cardSub: {
    ...theme.typography.body,
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 24,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    paddingHorizontal: 14,
    height: 56,
    backgroundColor: theme.colors.background,
  },
  // ✅ CHANGED: removed backgroundColor: primary
  inputFocused: {
    borderColor: theme.colors.primary,
  },
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
  hint: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    marginTop: 4,
    marginLeft: 2,
    fontSize: 12,
  },
  errorText: {
    ...theme.typography.caption,
    color: theme.colors.error ?? "#EF4444",
    fontSize: 13,
    marginTop: 12,
    textAlign: "center",
  },
  mainBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    ...theme.shadows.medium,
  },
  mainBtnDisabled: {
    opacity: 0.5,
    elevation: 0,
    shadowOpacity: 0,
  },
  mainBtnText: {
    ...theme.typography.button,
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  swapFooter: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  footerText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  linkText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  termsText: {
    ...theme.typography.caption,
    textAlign: "center",
    color: theme.colors.textMuted,
    marginTop: 20,
    lineHeight: 18,
    paddingHorizontal: 10,
  },
});
