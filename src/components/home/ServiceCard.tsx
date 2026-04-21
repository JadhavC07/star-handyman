import { haptic } from "@/src/lib/haptics";
import { theme } from "@/src/theme/theme";
import {
  formatDuration,
  formatPrice,
  resolveImageUrl,
} from "@/src/utils/format";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useCallback } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

interface Props {
  id: number;
  name: string;
  price: string;
  duration_minutes: number;
  image: string | null;
  service_type: string;
}

function ServiceCard({
  id,
  name,
  price,
  duration_minutes,
  image,
  service_type,
}: Props) {
  const { width: SW } = useWindowDimensions();
  const imageUrl = resolveImageUrl(image);
  const isRecurring = service_type === "recurring";

  const handlePress = useCallback(() => {
    haptic.tap();
    router.push({ pathname: "/services/[id]/book", params: { id } });
  }, [id]);

  const dynamicStyles = React.useMemo(() => {
    const CARD_W = SW * 0.44;
    return {
      card: { width: CARD_W },
      image: { width: CARD_W, height: CARD_W * 0.65 },
    };
  }, [SW]);

  return (
    <TouchableOpacity
      style={[styles.svcCard, dynamicStyles.card]}
      onPress={handlePress}
      activeOpacity={0.88}
    >
      <View>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={[styles.svcImage, dynamicStyles.image]}
            contentFit="cover"
            cachePolicy="memory-disk"
          />
        ) : (
          <View
            style={[
              styles.svcImage,
              styles.svcImagePlaceholder,
              dynamicStyles.image,
            ]}
          >
            <Ionicons
              name="image-outline"
              size={28}
              color={theme.colors.border}
            />
          </View>
        )}
        {isRecurring && (
          <View style={styles.svcBadgePurple}>
            <Text style={styles.svcBadgeText}>Recurring</Text>
          </View>
        )}
      </View>

      <View style={styles.svcInfo}>
        <Text style={styles.svcName} numberOfLines={2}>
          {name}
        </Text>
        <View style={styles.durationRow}>
          <Ionicons
            name="time-outline"
            size={11}
            color={theme.colors.textMuted}
          />
          <Text style={styles.durationText}>
            {formatDuration(duration_minutes)}
          </Text>
        </View>
        <Text style={styles.svcPrice}>{formatPrice(price)}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default React.memo(ServiceCard);

const styles = StyleSheet.create({
  svcCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    overflow: "hidden",
    elevation: 3,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  svcImage: {
    backgroundColor: theme.colors.border,
  },
  svcImagePlaceholder: { alignItems: "center", justifyContent: "center" },

  svcBadgePurple: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 3,
  },
  svcBadgeText: { fontSize: 10, color: theme.colors.surface },

  svcInfo: { padding: theme.spacing.sm + 2, gap: 3 },
  svcName: { fontSize: 12.5, color: theme.colors.textPrimary, lineHeight: 17 },

  durationRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  durationText: { fontSize: 11, color: theme.colors.textMuted },

  svcPrice: { fontSize: 14, color: theme.colors.textPrimary, marginTop: 2 },
});
