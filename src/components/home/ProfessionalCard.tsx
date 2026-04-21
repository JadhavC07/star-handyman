import { haptic } from "@/src/lib/haptics";
import { theme } from "@/src/theme/theme";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useCallback } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const PROFESSIONALS = [
  {
    id: "1",
    name: "Rajesh K.",
    service: "AC Repair",
    rating: 4.9,
    jobs: "2.1K",
    avatar: "https://i.pravatar.cc/80?img=11",
  },
  {
    id: "2",
    name: "Priya S.",
    service: "Salon & Spa",
    rating: 4.8,
    jobs: "1.8K",
    avatar: "https://i.pravatar.cc/80?img=5",
  },
  {
    id: "3",
    name: "Anil M.",
    service: "Plumbing",
    rating: 4.9,
    jobs: "3.2K",
    avatar: "https://i.pravatar.cc/80?img=15",
  },
  {
    id: "4",
    name: "Neha R.",
    service: "Cleaning",
    rating: 4.7,
    jobs: "1.4K",
    avatar: "https://i.pravatar.cc/80?img=9",
  },
];

type Professional = (typeof PROFESSIONALS)[number];

export const ProfessionalCard = React.memo(({ pro }: { pro: Professional }) => {
  const handlePress = useCallback(() => {
    haptic.tap();
    router.push({ pathname: "/professional/[id]", params: { id: pro.id } });
  }, [pro.id]);

  return (
    <TouchableOpacity style={styles.proCard} onPress={handlePress}>
      <View style={styles.proAvatarWrap}>
        <Image
          source={{ uri: pro.avatar }}
          style={styles.proAvatar}
          contentFit="cover"
          cachePolicy="memory-disk" // ← better cache hit rate on scroll
        />
        <View style={styles.proRatingPill}>
          <Ionicons name="star" size={9} color={theme.colors.rating} />
          <Text style={styles.proRatingNum}>{pro.rating}</Text>
        </View>
      </View>
      <Text style={styles.proName}>{pro.name}</Text>
      <Text style={styles.proService}>{pro.service}</Text>
      <Text style={styles.proJobs}>{pro.jobs} jobs</Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  proCard: {
    width: 110,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: 12,
    alignItems: "center",
    gap: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  proAvatarWrap: { position: "relative", marginBottom: theme.spacing.xs },
  proAvatar: { width: 58, height: 58, borderRadius: theme.radius.full },
  proRatingPill: {
    position: "absolute",
    bottom: -3,
    right: -5,
    backgroundColor: theme.colors.textPrimary,
    borderRadius: theme.radius.sm,
    paddingHorizontal: 5,
    paddingVertical: 2,
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  proRatingNum: { fontSize: 9.5, color: theme.colors.surface },
  proName: {
    fontSize: 12.5,
    color: theme.colors.textPrimary,
    textAlign: "center",
  },
  proService: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  proJobs: { fontSize: 11, color: theme.colors.primary },
});

ProfessionalCard.displayName = "ProfessionalCard";
