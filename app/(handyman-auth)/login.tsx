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
import Svg, { Circle, Ellipse, G, Path, Rect } from "react-native-svg";

const RESEND_SECONDS = 30;

function HandymanIllustration() {
  return (
    <Svg width={220} height={220} viewBox="0 0 220 220">
      <Circle cx="110" cy="118" r="96" fill="#FDEBD0" />

      <G opacity="0.13">
        <Path
          d="M44,58 Q36,50 38,40 Q40,30 50,30 Q56,30 60,36 L72,48 L66,54 Z"
          fill={theme.colors.primary}
        />
        <Rect
          x="58"
          y="46"
          width="8"
          height="36"
          rx="4"
          fill={theme.colors.primary}
          transform="rotate(45,62,64)"
        />
        <Circle
          cx="42"
          cy="38"
          r="10"
          fill="none"
          stroke={theme.colors.primary}
          strokeWidth="6"
        />
      </G>

      <G opacity="0.13">
        <Rect
          x="162"
          y="42"
          width="10"
          height="44"
          rx="5"
          fill={theme.colors.primary}
          transform="rotate(-30,167,64)"
        />
        <Rect
          x="158"
          y="38"
          width="18"
          height="10"
          rx="3"
          fill={theme.colors.primary}
          transform="rotate(-30,167,43)"
        />
      </G>

      <Ellipse cx="110" cy="205" rx="44" ry="7" fill="rgba(0,0,0,0.07)" />

      <Path
        d="M72,208 L72,178 Q72,155 110,150 Q148,155 148,178 L148,208 Z"
        fill="#1E2A78"
      />

      <Rect x="69" y="190" width="82" height="11" rx="2" fill="#2D1B08" />
      <Rect x="103" y="188" width="14" height="15" rx="2" fill="#B8860B" />
      <Circle cx="110" cy="195" r="3" fill="#FFD700" />

      <Rect x="104" y="148" width="12" height="22" fill="#F5C7A3" />

      <Circle cx="110" cy="118" r="33" fill="#F5C7A3" />

      <Ellipse cx="78" cy="118" rx="5" ry="8" fill="#F5C7A3" />
      <Ellipse cx="142" cy="118" rx="5" ry="8" fill="#F5C7A3" />

      <Path d="M80,102 Q82,90 110,88 Q138,90 140,102" fill="#2D1B08" />

      <Ellipse cx="110" cy="97" rx="41" ry="9" fill="#FFA000" />
      <Path d="M72,100 Q72,68 110,64 Q148,68 148,100 Z" fill="#FFC107" />
      <Path
        d="M76,96 Q76,72 110,68 Q144,72 144,96"
        stroke="#FF8F00"
        strokeWidth="3"
        fill="none"
      />
      <Rect x="104" y="62" width="12" height="8" rx="2" fill="#FF8F00" />

      <Circle cx="100" cy="114" r="3.5" fill="#2D1200" />
      <Circle cx="120" cy="114" r="3.5" fill="#2D1200" />
      <Circle cx="101.5" cy="112.5" r="1" fill="#fff" />
      <Circle cx="121.5" cy="112.5" r="1" fill="#fff" />

      <Path
        d="M96,109 Q100,107 104,109"
        stroke="#2D1200"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M116,109 Q120,107 124,109"
        stroke="#2D1200"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />

      <Path
        d="M102,128 Q110,136 118,128"
        stroke="#C87941"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />

      <Path
        d="M148,160 Q165,152 172,162 Q180,158 182,170 Q180,195 155,188 L148,178 Z"
        fill="#F5C7A3"
      />
      <Path d="M176,157 Q188,148 190,160 Q186,168 176,163 Z" fill="#F5C7A3" />

      <Path
        d="M72,160 Q54,152 47,168 Q38,162 36,178 L50,208 L75,200 L72,178 Z"
        fill="#F5C7A3"
      />
      <Rect
        x="24"
        y="172"
        width="9"
        height="40"
        rx="4"
        fill="#8B6508"
        transform="rotate(-15,28,192)"
      />
      <Rect
        x="16"
        y="162"
        width="26"
        height="15"
        rx="4"
        fill="#546E7A"
        transform="rotate(-15,29,169)"
      />
      <Rect
        x="28"
        y="163"
        width="12"
        height="15"
        rx="3"
        fill="#607D8B"
        transform="rotate(-15,34,170)"
      />
    </Svg>
  );
}

function GoogleIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 48 48">
      <Path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <Path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <Path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <Path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </Svg>
  );
}

function FacebookIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 48 48">
      <Circle cx="24" cy="24" r="24" fill="#1877F2" />
      <Path
        fill="#fff"
        d="M33.1 15H28c-1.1 0-2 .9-2 2v4h7.1l-1 7H26v18h-7V28h-5v-7h5v-4c0-5.5 3.4-8.5 8.3-8.5 2.4 0 4.7.2 4.8.2V15z"
      />
    </Svg>
  );
}

const HandymanLoginScreen: React.FC = () => {
  const [phone, setPhone] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);
  const [focusedField, setFocused] = useState<string | null>(null);
  const [resendTimer, setResend] = useState(0);
  const [showOtp, setShowOtp] = useState(false);
  const otpRefs = useRef<(TextInput | null)[]>([]);

  const sendOtp = useHandymanSendOtp();
  const login = useHandymanLogin();

  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setInterval(() => setResend((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [resendTimer]);

  const sanitizedPhone = phone.replace(/\D/g, "").slice(0, 10);
  const fullPhone = `+1${sanitizedPhone}`;

  const onAuthSuccess = (_user: { id: number; name: string }) => {
    router.replace("/(handyman)/(tabs)");
  };

  const handleSendOtp = () => {
    sendOtp.mutate(
      { phone: fullPhone },
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
    login.mutate(
      { phone: fullPhone, otp: otpDigits.join("") },
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

  const phoneValid = sanitizedPhone.length === 10;
  const otpComplete = otpDigits.every((d) => d !== "");
  const isLoading = sendOtp.isPending || login.isPending;
  const activeError = sendOtp.error ?? login.error;
  const errorMessage = activeError ? extractErrorMessage(activeError) : null;

  return (
    <SafeAreaView style={ss.safe}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={ss.flex}
        >
          <ScrollView
            contentContainerStyle={ss.scroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={ss.illustrationWrap}>
              <HandymanIllustration />
            </View>

            <Text style={ss.title}>
              {otpSent ? "Enter OTP" : "Welcome Back"}
            </Text>
            <Text style={ss.subtitle}>
              {otpSent
                ? `Code sent to +1 ${sanitizedPhone}`
                : "Login to continue"}
            </Text>

            {!otpSent ? (
              <>
                <Text style={ss.fieldLabel}>Phone Number</Text>
                <View
                  style={[
                    ss.inputBox,
                    focusedField === "phone" && ss.inputBoxFocused,
                  ]}
                >
                  <Feather
                    name="phone"
                    size={19}
                    color={
                      focusedField === "phone"
                        ? theme.colors.primary
                        : theme.colors.textMuted
                    }
                    style={ss.fieldIcon}
                  />
                  <Text style={ss.countryCode}>+1</Text>
                  <View style={ss.sep} />
                  <TextInput
                    style={ss.input}
                    placeholder="Enter your phone number"
                    placeholderTextColor={theme.colors.textMuted}
                    value={sanitizedPhone}
                    onChangeText={(t) =>
                      setPhone(t.replace(/\D/g, "").slice(0, 10))
                    }
                    keyboardType="phone-pad"
                    maxLength={10}
                    onFocus={() => setFocused("phone")}
                    onBlur={() => setFocused(null)}
                  />
                </View>

                <TouchableOpacity
                  style={ss.forgotRow}
                  onPress={() =>
                    router.push("/(handyman-auth)/register" as any)
                  }
                  activeOpacity={0.7}
                >
                  <Text style={ss.forgotText}>New handyman? Sign Up</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={ss.fieldLabel}>One-Time Password</Text>
                <View style={ss.otpRow}>
                  {otpDigits.map((digit, i) => (
                    <TextInput
                      key={i}
                      ref={(r) => {
                        otpRefs.current[i] = r;
                      }}
                      style={[
                        ss.otpBox,
                        digit !== "" && ss.otpBoxFilled,
                        focusedField === `otp-${i}` && ss.otpBoxFocused,
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

                <View style={ss.resendRow}>
                  {resendTimer > 0 ? (
                    <Text style={ss.resendTimer}>
                      Resend in <Text style={ss.timerBold}>{resendTimer}s</Text>
                    </Text>
                  ) : (
                    <TouchableOpacity onPress={handleSendOtp}>
                      <Text style={ss.resendLink}>Resend OTP</Text>
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
                    <Text style={ss.changeLink}>Change number</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {errorMessage ? (
              <Text style={ss.errorText}>{errorMessage}</Text>
            ) : null}

            <TouchableOpacity
              style={[
                ss.signInBtn,
                (otpSent ? !otpComplete : !phoneValid) && ss.signInBtnDisabled,
              ]}
              onPress={otpSent ? handleVerifyOtp : handleSendOtp}
              disabled={(otpSent ? !otpComplete : !phoneValid) || isLoading}
              activeOpacity={0.88}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={ss.signInBtnText}>
                  {otpSent ? "Verify & Login" : "Send OTP"}
                </Text>
              )}
            </TouchableOpacity>

            <View style={ss.footerRow}>
              <Text style={ss.footerText}>Don&apos;t have an account? </Text>
              <TouchableOpacity
                onPress={() => router.push("/(handyman-auth)/register" as any)}
              >
                <Text style={ss.footerLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default HandymanLoginScreen;

const ss = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  illustrationWrap: {
    alignItems: "center",
    marginTop: 8,
    marginBottom: 4,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: theme.colors.textPrimary,
    textAlign: "center",
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginBottom: 28,
  },

  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.textPrimary,
    marginBottom: 8,
    marginLeft: 2,
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 58,
    borderWidth: 1.5,
    borderColor: "transparent",
    marginBottom: 16,
  },
  inputBoxFocused: {
    borderColor: theme.colors.primary,
    backgroundColor: "#fff",
  },
  fieldIcon: { marginRight: 10 },
  countryCode: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.textPrimary,
  },
  sep: {
    width: 1,
    height: 20,
    backgroundColor: theme.colors.border,
    marginHorizontal: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.textPrimary,
    height: "100%",
  },

  forgotRow: { alignItems: "flex-end", marginTop: -4, marginBottom: 4 },
  forgotText: { fontSize: 14, color: theme.colors.primary, fontWeight: "600" },

  otpRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  otpBox: {
    flex: 1,
    height: 52,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: 12,
    backgroundColor: theme.colors.surfaceAlt,
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.textPrimary,
    textAlign: "center",
  },
  otpBoxFilled: {
    borderColor: theme.colors.primary,
    backgroundColor: `${theme.colors.primary}12`,
  },
  otpBoxFocused: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
    backgroundColor: "#fff",
  },

  resendRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  resendTimer: { fontSize: 13, color: theme.colors.textMuted },
  timerBold: { fontWeight: "700", color: theme.colors.textSecondary },
  resendLink: { fontSize: 13, color: theme.colors.primary, fontWeight: "600" },
  changeLink: { fontSize: 13, color: theme.colors.textSecondary },

  errorText: {
    fontSize: 13,
    color: theme.colors.error,
    textAlign: "center",
    marginVertical: 8,
  },

  signInBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: 14,
    height: 58,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 24,
    ...theme.shadows.medium,
  },
  signInBtnDisabled: { opacity: 0.5, shadowOpacity: 0, elevation: 0 },
  signInBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.2,
  },

  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  footerText: { fontSize: 14, color: theme.colors.textSecondary },
  footerLink: { fontSize: 14, color: theme.colors.primary, fontWeight: "700" },
});
