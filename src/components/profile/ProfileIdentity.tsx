import { theme } from "@/src/theme/theme";
import { Feather, Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    ActivityIndicator,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {
    Circle,
    Defs,
    Path,
    Stop,
    Svg,
    LinearGradient as SvgLinearGradient,
} from "react-native-svg";

// ─── Brand tokens (from the logo) ────────────────────────────────────────────
const B = {
  navy: "#1B2F8A",
  mid: "#3B5BDB",
  light: "#6B8EFF",
} as const;

const RING_SIZE = 130; // SVG canvas size
const RING_CX = RING_SIZE / 2;
const RING_STROKE = 7;
const RING_R = RING_CX - RING_STROKE / 2 - 1; // circle radius for stroke center

// ─── Gradient ring rendered in SVG ───────────────────────────────────────────
function GradientRing() {
  return (
    <Svg
      width={RING_SIZE}
      height={RING_SIZE}
      style={StyleSheet.absoluteFillObject}
    >
      <Defs>
        <SvgLinearGradient id="rg" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor={B.navy} />
          <Stop offset="45%" stopColor={B.mid} />
          <Stop offset="100%" stopColor={B.light} />
        </SvgLinearGradient>
      </Defs>
      <Circle
        cx={RING_CX}
        cy={RING_CX}
        r={RING_R}
        fill="none"
        stroke="url(#rg)"
        strokeWidth={RING_STROKE}
      />
    </Svg>
  );
}

// ─── 4-pointed sparkle — the logo's signature mark ───────────────────────────
function Sparkle({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20">
      <Defs>
        <SvgLinearGradient id="sg" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor={B.light} />
          <Stop offset="100%" stopColor={B.navy} />
        </SvgLinearGradient>
      </Defs>
      {/* 4-pointed star — horizontal + vertical diamond blades */}
      <Path
        d="M10 0.5 C10 0.5 11.5 7.2 16.5 10 C11.5 12.8 10 19.5 10 19.5 C10 19.5 8.5 12.8 3.5 10 C8.5 7.2 10 0.5 10 0.5Z"
        fill="url(#sg)"
      />
    </Svg>
  );
}

// ─── Mini sparkle for the badge ───────────────────────────────────────────────
function MiniSparkle() {
  return (
    <Svg width={9} height={9} viewBox="0 0 20 20">
      <Path
        d="M10 0.5 C10 0.5 11.5 7.2 16.5 10 C11.5 12.8 10 19.5 10 19.5 C10 19.5 8.5 12.8 3.5 10 C8.5 7.2 10 0.5 10 0.5Z"
        fill="rgba(255,255,255,0.85)"
      />
    </Svg>
  );
}

// ─── Badge background — SVG gradient pill ────────────────────────────────────
function BadgeBackground({ width, height }: { width: number; height: number }) {
  const r = height / 2;
  return (
    <Svg width={width} height={height} style={StyleSheet.absoluteFillObject}>
      <Defs>
        <SvgLinearGradient id="bg" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0%" stopColor={B.navy} />
          <Stop offset="100%" stopColor={B.mid} />
        </SvgLinearGradient>
      </Defs>
      <Path
        d={`M${r},0 H${width - r} A${r},${r} 0 0 1 ${width - r},${height} H${r} A${r},${r} 0 0 1 ${r},0Z`}
        fill="url(#bg)"
      />
    </Svg>
  );
}

// ─── Gradient dot (verified / camera bg) ─────────────────────────────────────
function GradientDot({ size }: { size: number }) {
  const r = size / 2;
  return (
    <Svg width={size} height={size} style={StyleSheet.absoluteFillObject}>
      <Defs>
        <SvgLinearGradient id="dg" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor={B.navy} />
          <Stop offset="100%" stopColor={B.mid} />
        </SvgLinearGradient>
      </Defs>
      <Circle cx={r} cy={r} r={r} fill="url(#dg)" />
    </Svg>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
type Props = {
  name?: string;
  avatarUri?: string | null;
  isVerified?: boolean;
  isLoading?: boolean;
  isUpdatingAvatar?: boolean;
  rating: string;
  reviewsCount: number;
  location?: string;
  onPickAvatar: () => void;
};

export function ProfileIdentity({
  name,
  avatarUri,
  isVerified,
  isLoading,
  isUpdatingAvatar,
  rating,
  reviewsCount,
  location,
  onPickAvatar,
}: Props) {
  return (
    <View style={ss.section}>
      <TouchableOpacity
        style={ss.avatarWrap}
        onPress={onPickAvatar}
        activeOpacity={0.82}
      >
        {/* ── SVG gradient ring + white gap + avatar ───── */}
        <View style={ss.ringCanvas}>
          <GradientRing />

          {/* White gap between ring stroke and avatar */}
          <View style={ss.ringInner}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={ss.avatar} />
            ) : (
              <View style={[ss.avatar, ss.avatarFallback]}>
                <Text style={ss.avatarLetter}>
                  {name?.[0]?.toUpperCase() ?? "H"}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* ── 4-pointed sparkle above ring (logo mark) ─── */}
        <View style={ss.sparkleDeco}>
          <Sparkle size={22} />
        </View>

        {/* ── Brand badge (bottom) ─────────────────────── */}
        <View style={ss.ringBadge}>
          <BadgeBackground width={116} height={22} />
          <View style={ss.ringBadgeContent}>
            <MiniSparkle />
            <Text style={ss.ringBadgeText}>STARHANDYMAN</Text>
          </View>
        </View>

        {/* ── Verified dot (top-right) ─────────────────── */}
        {isVerified && (
          <View style={ss.verifiedDot}>
            <GradientDot size={26} />
            <Ionicons
              name="checkmark"
              size={13}
              color="#fff"
              style={ss.dotIcon}
            />
          </View>
        )}

        {/* ── Camera dot (top-left) ────────────────────── */}
        <View style={ss.cameraDot}>
          <GradientDot size={28} />
          {isUpdatingAvatar ? (
            <ActivityIndicator size="small" color="#fff" style={ss.dotIcon} />
          ) : (
            <Feather name="camera" size={11} color="#fff" style={ss.dotIcon} />
          )}
        </View>
      </TouchableOpacity>

      <Text style={ss.name} numberOfLines={1}>
        {isLoading ? "Loading…" : (name ?? "Handyman")}
      </Text>

      <View style={ss.ratingRow}>
        <Ionicons name="star" size={15} color={theme.colors.rating} />
        <Text style={ss.ratingValue}>{rating}</Text>
        <Text style={ss.ratingDot}>•</Text>
        <Text style={ss.ratingReviews}>{reviewsCount} reviews</Text>
      </View>

      {location ? (
        <View style={ss.locationRow}>
          <Feather name="map-pin" size={13} color={theme.colors.textMuted} />
          <Text style={ss.locationText}>{location}</Text>
        </View>
      ) : null}
    </View>
  );
}

const ss = StyleSheet.create({
  section: {
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },

  avatarWrap: {
    position: "relative",
    width: RING_SIZE,
    height: RING_SIZE,
    marginBottom: theme.spacing.lg + 10,
    alignItems: "center",
    justifyContent: "center",
  },

  // Ambient glow — same size as canvas, centered
  outerGlow: {
    position: "absolute",
    width: RING_SIZE + 20,
    height: RING_SIZE + 20,
    borderRadius: (RING_SIZE + 20) / 2,
    backgroundColor: "rgba(59, 91, 219, 0.28)",
  },

  // The 130×130 view that holds the SVG ring + avatar
  ringCanvas: {
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },

  // White gap: ring inner edge is ~(RING_R - RING_STROKE/2) from center = ~57.5 - 3.5 = 54
  // So inner diameter ≈ 108 → use 106 to leave a clean 1px gap
  ringInner: {
    width: 106,
    height: 106,
    borderRadius: 53,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarFallback: {
    backgroundColor: "rgba(59, 91, 219, 0.10)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLetter: {
    fontSize: 36,
    fontWeight: "700",
    color: B.navy,
    letterSpacing: -1,
  },

  // 4-pointed sparkle sits above the ring
  sparkleDeco: {
    position: "absolute",
    top: -13,
    alignSelf: "center",
  },

  // Badge at the bottom of the ring
  ringBadge: {
    position: "absolute",
    bottom: -13,
    width: 116,
    height: 22,
    alignSelf: "center",
    borderRadius: 11,
    borderWidth: 2,
    borderColor: theme.colors.surface,
    overflow: "hidden",
  },
  ringBadgeContent: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  ringBadgeText: {
    fontSize: 9,
    color: "#fff",
    fontWeight: "800",
    letterSpacing: 0.7,
  },

  // Verified & camera dots
  verifiedDot: {
    position: "absolute",
    top: 6,
    right: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2.5,
    borderColor: theme.colors.surface,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  cameraDot: {
    position: "absolute",
    top: 6,
    left: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2.5,
    borderColor: theme.colors.surface,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  dotIcon: {
    position: "absolute",
  },

  // Text section
  name: {
    ...theme.typography.ios.title2,
    color: theme.colors.textPrimary,
    letterSpacing: -0.3,
    marginBottom: theme.spacing.xs + 2,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs + 1,
    marginBottom: theme.spacing.xs + 2,
  },
  ratingValue: {
    ...theme.typography.ios.subhead,
    fontWeight: "600",
    color: theme.colors.textPrimary,
  },
  ratingDot: {
    ...theme.typography.ios.footnote,
    color: theme.colors.textMuted,
  },
  ratingReviews: {
    ...theme.typography.ios.footnote,
    color: theme.colors.textSecondary,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  locationText: {
    ...theme.typography.ios.caption1,
    color: theme.colors.textMuted,
  },
});
