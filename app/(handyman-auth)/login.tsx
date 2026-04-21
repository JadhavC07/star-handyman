import {
  useHandymanLogin,
  useHandymanSendOtp,
} from "@/src/hooks/auth/useHandymanAuth";
import { extractErrorMessage } from "@/src/lib/errorMessage";
import { theme } from "@/src/theme/theme";
import { Feather } from "@expo/vector-icons";
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

const HandymanLoginScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);
  const [focusedField, setFocused] = useState<string | null>(null);
  const [resendTimer, setResend] = useState(0);
  const otpRefs = useRef<(TextInput | null)[]>([]);

  const sendOtp = useHandymanSendOtp();
  const login = useHandymanLogin();

  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setInterval(() => setResend((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [resendTimer]);

  const onAuthSuccess = (user: { id: number; email: string; name: string }) => {
    router.replace("/(handyman)/(tabs)");
  };

  const handleSendOtp = () => {
    //only email needed for login send-otp
    sendOtp.mutate(
      { email: email.trim() },
      {
        onSuccess: () => {
          setOtpSent(true);
          setResend(RESEND_SECONDS);
          setOtpDigits(["", "", "", "", "", ""]);
          setTimeout(() => otpRefs.current[0]?.focus(), 100);
        },
      },
    );
  };

  const handleVerifyOtp = () => {
    // uses useHandymanLogin with {email, otp}
    login.mutate(
      { email: email.trim(), otp: otpDigits.join("") },
      { onSuccess: (data) => onAuthSuccess(data.user) },
    );
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
  const isLoading = sendOtp.isPending || login.isPending;
  const activeError = sendOtp.error ?? login.error;
  const errorMessage = activeError ? extractErrorMessage(activeError) : null;

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
            <View style={styles.brandSection}>
              <View style={styles.logoMark}>
                <Text style={styles.logoLetter}>U</Text>
              </View>
              <Text style={styles.brandName}>StarHandyMan</Text>
              <View style={styles.roleBadge}>
                <Feather name="tool" size={12} color={theme.colors.primary} />
                <Text style={styles.roleBadgeText}>HANDYMAN</Text>
              </View>
              <Text style={styles.brandTagline}>
                Serve customers on StarHandyMan
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                {otpSent ? "Enter OTP" : "Welcome back"}
              </Text>
              <Text style={styles.cardSub}>
                {otpSent
                  ? `OTP sent to ${email.trim()}`
                  : "Login with OTP to manage your jobs"}
              </Text>

              {/* Email */}
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
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                  />
                </View>
              )}

              {/* OTP boxes */}
              {otpSent && (
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
                        onFocus={() => setFocused(`otp-${i}`)}
                        onBlur={() => setFocused(null)}
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
                        login.reset();
                      }}
                    >
                      <Text style={styles.changeLink}>Change email</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}

              {errorMessage && (
                <Text style={styles.errorText}>{errorMessage}</Text>
              )}

              {!otpSent && (
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

              {otpSent && (
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
                    <Text style={styles.mainBtnText}>Verify & Login</Text>
                  )}
                </TouchableOpacity>
              )}

              <View style={styles.footer}>
                <Text style={styles.footerText}>New handyman? </Text>
                <TouchableOpacity
                  onPress={() => router.push("/(handyman-auth)/register")}
                >
                  <Text style={styles.linkText}>Sign Up</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.swapFooter}>
                <Text style={styles.footerText}>
                  Looking to book a service?{" "}
                </Text>
                <TouchableOpacity
                  onPress={() => router.replace("/(auth)/login")}
                >
                  <Text style={styles.linkText}>Customer login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default HandymanLoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: 40,
  },
  brandSection: { alignItems: "center", paddingTop: 40, paddingBottom: 32 },
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
    marginBottom: 8,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primarySubtle,
    marginBottom: 8,
  },
  roleBadgeText: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    fontWeight: "700",
    letterSpacing: 1,
    fontSize: 11,
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
  inputFocused: { borderColor: theme.colors.primary },
  input: {
    flex: 1,
    marginLeft: 10,
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    height: "100%",
    fontSize: 15,
  },
  otpRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
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
  otpBoxFocused: { borderColor: theme.colors.primary, borderWidth: 2 },
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
  mainBtnDisabled: { opacity: 0.5, elevation: 0, shadowOpacity: 0 },
  mainBtnText: {
    ...theme.typography.button,
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 22 },
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
