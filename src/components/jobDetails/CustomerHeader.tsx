import { theme } from "@/src/theme/theme";
import { Feather, Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  avatar: string;
  name: string;
  rating: number;
  reviews: number;
  onChat: () => void;
  onCall: () => void;
};

export function CustomerHeader({ avatar, name, rating, reviews, onChat, onCall }: Props) {
  return (
    <View style={ss.row}>
      <Image source={{ uri: avatar }} style={ss.avatar} />
      <View style={ss.info}>
        <Text style={ss.name}>{name}</Text>
        <View style={ss.ratingRow}>
          <Ionicons name="star" size={14} color={theme.colors.rating} />
          <Text style={ss.ratingVal}>{rating.toFixed(1)}</Text>
          <Text style={ss.ratingDot}>•</Text>
          <Text style={ss.ratingReviews}>{reviews} reviews</Text>
        </View>
      </View>
      <View style={ss.actions}>
        <TouchableOpacity style={ss.btn} onPress={onChat} activeOpacity={0.7}>
          <Ionicons name="chatbubble-outline" size={18} color={theme.colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={ss.btn} onPress={onCall} activeOpacity={0.7}>
          <Feather name="phone" size={18} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const ss = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  avatar: { width: 52, height: 52, borderRadius: theme.radius.full },
  info: { flex: 1 },
  name: {
    ...theme.typography.ios.headline,
    color: theme.colors.textPrimary,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    marginTop: 3,
  },
  ratingVal: {
    ...theme.typography.ios.footnote,
    fontWeight: "600",
    color: theme.colors.textPrimary,
  },
  ratingDot: {
    ...theme.typography.ios.footnote,
    color: theme.colors.textMuted,
  },
  ratingReviews: {
    ...theme.typography.ios.caption1,
    color: theme.colors.textSecondary,
  },
  actions: { flexDirection: "row", gap: theme.spacing.sm },
  btn: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: theme.hairline,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadows.small,
  },
});
