import { BottomSheet, BottomSheetRef } from "@/src/components/ui/BottomSheet";
import { LANGUAGE_OPTIONS } from "@/src/features/i18n/i18n.types";
import { useT } from "@/src/hooks/i18n/useLanguage";
import type { SupportedLanguage } from "@/src/lib/i18n";
import { theme } from "@/src/theme/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { forwardRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  current: SupportedLanguage;
  onSelect: (lang: SupportedLanguage) => void | Promise<void>;
  onClose?: () => void;
};

/**
 * Bottom-sheet language picker. Shows the app's SUPPORTED_LANGUAGES
 * with a checkmark on the active one. Title is localized via the
 * `profile.language.title` key.
 */
export const LanguageSheet = forwardRef<BottomSheetRef, Props>(
  function LanguageSheet({ current, onSelect, onClose }, ref) {
    const t = useT("profile");

    return (
      <BottomSheet ref={ref} onDismiss={onClose}>
        <Text style={styles.title}>{t("language.title")}</Text>

        {LANGUAGE_OPTIONS.map((lang, i) => {
          const isActive = current === lang.code;
          return (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.row,
                i === LANGUAGE_OPTIONS.length - 1 && styles.rowLast,
              ]}
              onPress={() => onSelect(lang.code)}
              activeOpacity={0.7}
            >
              <View style={styles.labels}>
                <Text style={styles.native}>{lang.nativeLabel}</Text>
                {lang.nativeLabel !== lang.label ? (
                  <Text style={styles.english}>{lang.label}</Text>
                ) : null}
              </View>

              {isActive ? (
                <Ionicons
                  name="checkmark-circle"
                  size={22}
                  color={theme.colors.primary}
                />
              ) : null}
            </TouchableOpacity>
          );
        })}
      </BottomSheet>
    );
  },
);

const styles = StyleSheet.create({
  title: {
    ...theme.typography.ios.headline,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: theme.hairline,
    borderBottomColor: theme.colors.ios.separator,
  },
  rowLast: { borderBottomWidth: 0 },
  labels: { gap: 2 },
  native: {
    ...theme.typography.ios.body,
    color: theme.colors.textPrimary,
  },
  english: {
    ...theme.typography.ios.caption1,
    color: theme.colors.textMuted,
  },
});
