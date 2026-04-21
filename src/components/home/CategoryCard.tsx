import { Category } from "@/src/features/categories/categories.types";
import { haptic } from "@/src/lib/haptics";
import { theme } from "@/src/theme/theme";
import { getCategoryColor } from "@/src/utils/format";
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
  category: Category;
}

function CategoryCard({ category }: Props) {
  const { width: SW } = useWindowDimensions();
  const { id, name, slug, image } = category;
  const { bg } = getCategoryColor(slug);

  const shortName =
    name.length > 14 ? name.split(" ").slice(0, 2).join("\n") : name;

  // Stable handler — no new function per render
  const handlePress = useCallback(() => {
    haptic.tap();
    router.push({ pathname: "/services", params: { category: slug } });
  }, [slug]);

  // Card width depends on screen width; recomputed only when SW changes
  const cardStyle = React.useMemo(() => ({ width: (SW - 32 - 30) / 4 }), [SW]);

  // Icon box background depends on category — stable per slug
  const iconBoxStyle = React.useMemo(
    () => [styles.catIconBox, { backgroundColor: bg }],
    [bg],
  );

  return (
    <TouchableOpacity
      style={[styles.catCard, cardStyle]}
      onPress={handlePress}
      activeOpacity={0.75}
    >
      <View style={iconBoxStyle}>
        {image ? (
          <Image
            source={{ uri: image }}
            style={styles.catImage}
            contentFit="cover"
            cachePolicy="memory-disk"
          />
        ) : (
          <Text style={styles.catInitial}>{name.charAt(0)}</Text>
        )}
      </View>

      <Text style={styles.catLabel} numberOfLines={2}>
        {shortName}
      </Text>
    </TouchableOpacity>
  );
}

export default React.memo(CategoryCard);

const styles = StyleSheet.create({
  catCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    paddingVertical: 12,
    paddingHorizontal: theme.spacing.xs,
    alignItems: "center",
    gap: theme.spacing.sm,
    elevation: 2,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  catLabel: {
    fontSize: 10.5,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 15,
  },
  catImage: {
    width: 44,
    height: 44,
    borderRadius: 12,
  },
  catIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  catInitial: { fontSize: 20, fontWeight: "700" },
});
