import type {
  Category,
  EnrollmentDraft,
  LocalLicensePhoto,
} from "@/src/features/categories/categories.types";
import {
  useCategories,
  useCategoryLevels,
} from "@/src/hooks/categories/useCategories";
import { haptic } from "@/src/lib/haptics";
import { theme } from "@/src/theme/theme";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  value: EnrollmentDraft;
  onChange: (next: EnrollmentDraft) => void;
};

export function CategoryEnrollmentStep({ value, onChange }: Props) {
  const { data, isLoading, isError, refetch } = useCategories();
  const categories = data?.data ?? [];

  const toggleCategory = useCallback(
    (cat: Category) => {
      haptic.selection();
      const isSelected = value.selectedCategoryIds.includes(cat.id);
      if (isSelected) {
        const nextLevels = { ...value.levels };
        const nextPhotos = { ...value.licensePhotos };
        delete nextLevels[cat.id];
        delete nextPhotos[cat.id];
        onChange({
          selectedCategoryIds: value.selectedCategoryIds.filter((id) => id !== cat.id),
          levels: nextLevels,
          licensePhotos: nextPhotos,
        });
      } else {
        onChange({
          ...value,
          selectedCategoryIds: [...value.selectedCategoryIds, cat.id],
        });
      }
    },
    [value, onChange],
  );

  if (isLoading) {
    return (
      <View style={ss.center}>
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={ss.center}>
        <Text style={ss.errorText}>Couldn&apos;t load categories.</Text>
        <TouchableOpacity onPress={() => refetch()} activeOpacity={0.7}>
          <Text style={ss.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View>
      <Text style={ss.sectionLabel}>Select your service categories</Text>
      <View style={ss.chipWrap}>
        {categories.map((cat) => {
          const selected = value.selectedCategoryIds.includes(cat.id);
          return (
            <TouchableOpacity
              key={cat.id}
              style={[ss.chip, selected && ss.chipActive]}
              onPress={() => toggleCategory(cat)}
              activeOpacity={0.7}
            >
              <Text style={[ss.chipText, selected && ss.chipTextActive]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {value.selectedCategoryIds.map((id) => {
        const cat = categories.find((c) => c.id === id);
        if (!cat) return null;
        return (
          <CategoryDetail
            key={id}
            category={cat}
            level={value.levels[id]}
            photo={value.licensePhotos[id]}
            onLevelChange={(level) =>
              onChange({
                ...value,
                levels: { ...value.levels, [id]: level },
              })
            }
            onPhotoChange={(photo) => {
              const next = { ...value.licensePhotos };
              if (photo) next[id] = photo;
              else delete next[id];
              onChange({ ...value, licensePhotos: next });
            }}
          />
        );
      })}
    </View>
  );
}

type DetailProps = {
  category: Category;
  level: number | undefined;
  photo: LocalLicensePhoto | undefined;
  onLevelChange: (level: number) => void;
  onPhotoChange: (photo: LocalLicensePhoto | null) => void;
};

function CategoryDetail({
  category,
  level,
  photo,
  onLevelChange,
  onPhotoChange,
}: DetailProps) {
  const { data, isLoading } = useCategoryLevels(category.id);
  const levels = data?.data?.levels ?? [];

  const selectedLevel = level
    ? levels.find((l) => l.level === level)
    : undefined;
  const needsLicense = selectedLevel?.license_required_if_selected ?? false;

  const pickPhoto = useCallback(async () => {
    haptic.selection();
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    const ext = (asset.uri.split(".").pop() ?? "jpg").toLowerCase();
    const mime =
      ext === "png" ? "image/png"
      : ext === "webp" ? "image/webp"
      : "image/jpeg";
    onPhotoChange({
      uri: asset.uri,
      name: `license_${category.id}.${ext}`,
      type: mime,
    });
  }, [category.id, onPhotoChange]);

  return (
    <View style={ss.detailCard}>
      <Text style={ss.detailTitle}>{category.name}</Text>

      {isLoading ? (
        <ActivityIndicator color={theme.colors.primary} style={ss.detailLoader} />
      ) : (
        <>
          <Text style={ss.detailHint}>Choose your highest level</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={ss.levelRow}
          >
            {levels.map((l) => {
              const active = l.level === level;
              return (
                <TouchableOpacity
                  key={l.level}
                  style={[ss.levelPill, active && ss.levelPillActive]}
                  onPress={() => {
                    haptic.selection();
                    onLevelChange(l.level);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[ss.levelText, active && ss.levelTextActive]}>
                    L{l.level}
                  </Text>
                  {l.license_required_if_selected && (
                    <Feather
                      name="shield"
                      size={11}
                      color={
                        active
                          ? theme.colors.surface
                          : theme.colors.ios.orange
                      }
                      style={ss.shieldIcon}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {selectedLevel && (
            <Text style={ss.levelDesc}>{selectedLevel.description}</Text>
          )}

          {needsLicense && (
            <View style={ss.licenseSection}>
              <Text style={ss.licenseLabel}>License photo required</Text>
              {photo ? (
                <View style={ss.photoPreviewRow}>
                  <Image source={{ uri: photo.uri }} style={ss.photoPreview} />
                  <View style={ss.photoActions}>
                    <TouchableOpacity onPress={pickPhoto} activeOpacity={0.7}>
                      <Text style={ss.replaceText}>Replace</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        haptic.tap();
                        onPhotoChange(null);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={ss.removeText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  style={ss.uploadBtn}
                  onPress={pickPhoto}
                  activeOpacity={0.7}
                >
                  <Feather
                    name="upload"
                    size={16}
                    color={theme.colors.primary}
                  />
                  <Text style={ss.uploadText}>Upload license</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </>
      )}
    </View>
  );
}

const ss = StyleSheet.create({
  center: { paddingVertical: theme.spacing.xxl, alignItems: "center" },
  errorText: {
    ...theme.typography.ios.subhead,
    color: theme.colors.error,
    marginBottom: theme.spacing.sm,
  },
  retryText: {
    ...theme.typography.ios.subhead,
    color: theme.colors.primary,
    fontWeight: "600",
  },

  sectionLabel: {
    ...theme.typography.ios.subhead,
    fontWeight: "600",
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  chip: {
    paddingHorizontal: theme.spacing.md + 2,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.full,
    borderWidth: theme.hairline * 2,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  chipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipText: {
    ...theme.typography.ios.footnote,
    fontWeight: "600",
    color: theme.colors.textSecondary,
  },
  chipTextActive: { color: theme.colors.surface },

  detailCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: theme.hairline,
    borderColor: theme.colors.border,
  },
  detailTitle: {
    ...theme.typography.ios.headline,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  detailLoader: { marginVertical: theme.spacing.md },
  detailHint: {
    ...theme.typography.ios.footnote,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.sm,
  },
  levelRow: { gap: theme.spacing.sm, paddingVertical: theme.spacing.xs },
  levelPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.full,
    borderWidth: theme.hairline * 2,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  levelPillActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  levelText: {
    ...theme.typography.ios.footnote,
    fontWeight: "700",
    color: theme.colors.textSecondary,
  },
  levelTextActive: { color: theme.colors.surface },
  shieldIcon: { marginLeft: 2 },
  levelDesc: {
    ...theme.typography.ios.caption1,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.sm,
  },

  licenseSection: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: theme.hairline,
    borderTopColor: theme.colors.border,
  },
  licenseLabel: {
    ...theme.typography.ios.footnote,
    fontWeight: "600",
    color: theme.colors.ios.orange,
    marginBottom: theme.spacing.sm,
  },
  uploadBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: theme.hairline * 2,
    borderColor: theme.colors.primary,
    borderStyle: "dashed",
    backgroundColor: theme.colors.primarySubtle,
  },
  uploadText: {
    ...theme.typography.ios.subhead,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  photoPreviewRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  photoPreview: {
    width: 64,
    height: 64,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceAlt,
  },
  photoActions: { gap: theme.spacing.xs },
  replaceText: {
    ...theme.typography.ios.footnote,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  removeText: {
    ...theme.typography.ios.footnote,
    fontWeight: "600",
    color: theme.colors.error,
  },
});
