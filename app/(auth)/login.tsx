import { useAuthStore } from "@/src/features/auth/auth.store";
import { ProfileService } from "@/src/features/profile/profile.service";
import { useLoginWithPassword } from "@/src/hooks/auth/useLogin";
import { useLoginWithOtp } from "@/src/hooks/auth/useLoginWithOtp";
import { useSendOtp } from "@/src/hooks/auth/useSendOtp";
import { extractErrorMessage } from "@/src/lib/errorMessage";
import { PROFILE_KEYS } from "@/src/lib/queryKeys";
import { theme } from "@/src/theme/theme";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
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

const RESEND_SECONDS = 30;

const LoginScreen: React.FC = () => {
  const [tab, setTab] = useState<"password" | "otp">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);
  const otpRefs = useRef<(TextInput | null)[]>([]);

  const loginWithPassword = useLoginWithPassword();
  const sendOtp = useSendOtp();
  const loginWithOtp = useLoginWithOtp();
  const qc = useQueryClient();
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [resendTimer]);

  const onAuthSuccess = (user: { id: number; email: string; name: string }) => {
    router.replace("/(app)/(tabs)");
  };

  const handleSendOtp = () => {
    sendOtp.mutate(email.trim(), {
      onSuccess: () => {
        setOtpSent(true);
        setResendTimer(RESEND_SECONDS);
        setOtpDigits(["", "", "", "", "", ""]);
        setTimeout(() => otpRefs.current[0]?.focus(), 100);
      },
    });
  };

  const handleVerifyOtp = async () => {
    try {
      const data = await loginWithOtp.mutateAsync({
        email: email.trim(),
        otp: otpDigits.join(""),
      });
      // 1. Set token first so axios interceptor has it for profile fetch
      await setAuth(data.user, data.token);
      // 2. Clear stale cache
      qc.clear();
      // 3. Fetch profile NOW with valid token
      await qc.fetchQuery({
        queryKey: PROFILE_KEYS.all,
        queryFn: ProfileService.getProfile,
      });
      // 4. Navigate only after cache is warm
      onAuthSuccess(data.user);
    } catch (_) {
      // error handled by mutationCache globalhandler
    }
  };

  const handlePasswordLogin = async () => {
    try {
      const data = await loginWithPassword.mutateAsync({
        email: email.trim(),
        password,
      });
      await setAuth(data.user, data.token);
      qc.clear();
      await qc.fetchQuery({
        queryKey: PROFILE_KEYS.all,
        queryFn: ProfileService.getProfile,
      });
      onAuthSuccess(data.user);
    } catch (_) {}
  };

  const handleOtpChange = (text: string, index: number) => {
    const cleaned = text.replace(/[^0-9]/g, "").slice(-1);
    const updated = [...otpDigits];
    updated[index] = cleaned;
    setOtpDigits(updated);
    if (cleaned && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
      const updated = [...otpDigits];
      updated[index - 1] = "";
      setOtpDigits(updated);
    }
  };

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const otpComplete = otpDigits.every((d) => d !== "");

  const isLoading =
    loginWithPassword.isPending || sendOtp.isPending || loginWithOtp.isPending;

  const activeError =
    loginWithPassword.error ?? sendOtp.error ?? loginWithOtp.error;
  const errorMessage = activeError ? extractErrorMessage(activeError) : null;

  const handleTabSwitch = (t: "password" | "otp") => {
    setTab(t);
    setOtpSent(false);
    setOtpDigits(["", "", "", "", "", ""]);
    loginWithPassword.reset();
    sendOtp.reset();
    loginWithOtp.reset();
  };

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
            {/* Brand */}
            <View style={styles.brandSection}>
              <View style={styles.logoMark}>
                <Text style={styles.logoLetter}>U</Text>
              </View>
              <Text style={styles.brandName}>StarHandyMan</Text>
              <Text style={styles.brandTagline}>
                Quality service at your doorstep
              </Text>
            </View>

            {/* Form Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                {otpSent ? "Enter OTP" : "Welcome back"}
              </Text>
              <Text style={styles.cardSub}>
                {otpSent
                  ? `OTP sent to ${email.trim()}`
                  : "Login to manage your bookings"}
              </Text>

              {/* Login method tabs */}
              {!otpSent && (
                <View style={styles.tabContainer}>
                  {(["password", "otp"] as const).map((t) => (
                    <TouchableOpacity
                      key={t}
                      onPress={() => handleTabSwitch(t)}
                      style={[styles.tab, tab === t && styles.tabActive]}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.tabText,
                          tab === t && styles.tabTextActive,
                        ]}
                      >
                        {t === "password" ? "Password" : "OTP"}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Email field — always shown unless OTP already sent */}
              {!otpSent && (
                <View
                  style={[
                    styles.inputWrapper,
                    focusedField === "email" && styles.inputFocused,
                  ]}
                >
                  <Feather
                    name="mail"
                    size={18}
                    color={
                      focusedField === "email"
                        ? theme.colors.primary
                        : theme.colors.textMuted
                    }
                  />
                  <TextInput
                    placeholder="Email Address"
                    placeholderTextColor={theme.colors.textMuted}
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              )}

              {/* Password field */}
              {tab === "password" && !otpSent && (
                <View
                  style={[
                    styles.inputWrapper,
                    { marginTop: 14 },
                    focusedField === "password" && styles.inputFocused,
                  ]}
                >
                  <Feather
                    name="lock"
                    size={18}
                    color={
                      focusedField === "password"
                        ? theme.colors.primary
                        : theme.colors.textMuted
                    }
                  />
                  <TextInput
                    placeholder="Password"
                    placeholderTextColor={theme.colors.textMuted}
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                  />
                  <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={18}
                      color={theme.colors.textMuted}
                    />
                  </TouchableOpacity>
                </View>
              )}

              {/* OTP boxes */}
              {tab === "otp" && otpSent && (
                <>
                  <View style={styles.otpRow}>
                    {otpDigits.map((digit, i) => (
                      <TextInput
                        key={i}
                        ref={(r) => {
                          otpRefs.current[i] = r;
                        }}
                        style={[
                          styles.otpBox,
                          digit !== "" && styles.otpBoxFilled,
                          focusedField === `otp-${i}` && styles.otpBoxFocused,
                        ]}
                        value={digit}
                        onChangeText={(t) => handleOtpChange(t, i)}
                        onKeyPress={(e) => handleOtpKeyPress(e, i)}
                        keyboardType="number-pad"
                        maxLength={1}
                        textAlign="center"
                        onFocus={() => setFocusedField(`otp-${i}`)}
                        onBlur={() => setFocusedField(null)}
                      />
                    ))}
                  </View>

                  <View style={styles.resendRow}>
                    {resendTimer > 0 ? (
                      <Text style={styles.resendTimer}>
                        Resend in{" "}
                        <Text style={styles.timerBold}>{resendTimer}s</Text>
                      </Text>
                    ) : (
                      <TouchableOpacity onPress={handleSendOtp}>
                        <Text style={styles.resendLink}>Resend OTP</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      onPress={() => {
                        setOtpSent(false);
                        setOtpDigits(["", "", "", "", "", ""]);
                        sendOtp.reset();
                        loginWithOtp.reset();
                      }}
                    >
                      <Text style={styles.changeLink}>Change email</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}

              {/* Error */}
              {errorMessage && (
                <Text style={styles.errorText}>{errorMessage}</Text>
              )}

              {/* Main CTA */}
              {tab === "password" && (
                <TouchableOpacity
                  style={[
                    styles.mainBtn,
                    (!emailValid || !password) && styles.mainBtnDisabled,
                  ]}
                  onPress={handlePasswordLogin}
                  disabled={!emailValid || !password || isLoading}
                  activeOpacity={0.85}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.mainBtnText}>Login</Text>
                  )}
                </TouchableOpacity>
              )}

              {tab === "otp" && !otpSent && (
                <TouchableOpacity
                  style={[
                    styles.mainBtn,
                    !emailValid && styles.mainBtnDisabled,
                  ]}
                  onPress={handleSendOtp}
                  disabled={!emailValid || isLoading}
                  activeOpacity={0.85}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.mainBtnText}>Send OTP</Text>
                  )}
                </TouchableOpacity>
              )}

              {tab === "otp" && otpSent && (
                <TouchableOpacity
                  style={[
                    styles.mainBtn,
                    !otpComplete && styles.mainBtnDisabled,
                  ]}
                  onPress={handleVerifyOtp}
                  disabled={!otpComplete || isLoading}
                  activeOpacity={0.85}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.mainBtnText}>Verify & Continue</Text>
                  )}
                </TouchableOpacity>
              )}

              {!otpSent && (
                <>
                  <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.orText}>OR</Text>
                    <View style={styles.dividerLine} />
                  </View>

                  {/* <TouchableOpacity
                    style={styles.googleBtn}
                    activeOpacity={0.85}
                  >
                    <AntDesign name="google" size={18} color="#EA4335" />
                    <Text style={styles.googleText}>Continue with Google</Text>
                  </TouchableOpacity> */}
                </>
              )}

              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  Don&apos;t have an account?{" "}
                </Text>
                <TouchableOpacity
                  onPress={() => router.push("/(auth)/register")}
                >
                  <Text style={styles.linkText}>Sign Up</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.swapFooter}>
                <Text style={styles.footerText}>Are you a handyman? </Text>
                <TouchableOpacity
                  onPress={() => router.push("/(handyman-auth)/login")}
                >
                  <Text style={styles.linkText}>Login here</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: 40,
  },
  brandSection: {
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 32,
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
  tabContainer: {
    flexDirection: "row",
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: theme.radius.lg,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: theme.radius.md,
  },
  tabActive: {
    backgroundColor: theme.colors.primary,
    ...theme.shadows.small,
  },
  tabText: { ...theme.typography.button, color: theme.colors.textMuted },
  tabTextActive: { color: "#FFFFFF", fontWeight: "600" },
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

  inputFocused: {
    borderColor: theme.colors.primary,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    height: "100%",
    fontSize: 15,
  },
  otpRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  otpBox: {
    flex: 1,
    height: 54,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.background,
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 20,
    color: theme.colors.textPrimary,
    textAlign: "center",
  },
  otpBoxFilled: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + "15",
  },
  otpBoxFocused: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  resendRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  resendTimer: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    fontSize: 13,
  },
  timerBold: { color: theme.colors.textSecondary, fontWeight: "600" },
  resendLink: {
    ...theme.typography.button,
    color: theme.colors.primary,
    fontWeight: "600",
    fontSize: 13,
  },
  changeLink: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontSize: 13,
  },
  errorText: {
    ...theme.typography.caption,
    color: theme.colors.error ?? "#EF4444",
    fontSize: 13,
    marginTop: 10,
    textAlign: "center",
  },
  mainBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
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
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    height: 56,
    backgroundColor: "#FFFFFF",
    gap: 10,
  },
  googleText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textPrimary,
    fontSize: 15,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: theme.colors.divider },
  orText: {
    marginHorizontal: 14,
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    fontWeight: "600",
    letterSpacing: 1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 22,
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
});
