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
        activeOpacity={0.85}
      >
        <View style={ss.ring}>
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

          <View style={ss.ringBadge}>
            <Text style={ss.ringBadgeText} numberOfLines={1}>
              STARHANDYMAN
            </Text>
          </View>
        </View>

        {isVerified && (
          <View style={ss.verifiedDot}>
            <Ionicons name="checkmark-circle" size={22} color={theme.colors.primary} />
          </View>
        )}

        <View style={ss.cameraDot}>
          {isUpdatingAvatar ? (
            <ActivityIndicator size="small" color={theme.colors.surface} />
          ) : (
            <Feather name="camera" size={10} color={theme.colors.surface} />
          )}
        </View>
      </TouchableOpacity>

      <Text style={ss.name} numberOfLines={1}>
        {isLoading ? "Loading…" : (name ?? "Handyman")}
      </Text>

      <View style={ss.ratingRow}>
        <Ionicons name="star" size={16} color={theme.colors.rating} />
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
  avatarWrap: { position: "relative", marginBottom: theme.spacing.lg + 4 },
  ring: {
    width: 124,
    height: 124,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  ringInner: {
    width: 104,
    height: 104,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  ringBadge: {
    position: "absolute",
    bottom: -8,
    alignSelf: "center",
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.sm + 2,
    paddingVertical: 2,
    borderRadius: theme.radius.full,
    borderWidth: 2,
    borderColor: theme.colors.surface,
  },
  ringBadgeText: {
    ...theme.typography.ios.caption2,
    color: theme.colors.surface,
    fontWeight: "800",
    letterSpacing: 0.6,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: theme.radius.full,
  },
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
  verifiedDot: {
    position: "absolute",
    top: 6,
    right: 2,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: 1,
  },
  cameraDot: {
    position: "absolute",
    top: 6,
    left: 2,
    width: 26,
    height: 26,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: theme.colors.surface,
  },
  name: {
    ...theme.typography.ios.title2,
    color: theme.colors.textPrimary,
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
