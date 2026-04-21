import { theme } from "@/src/theme/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  title: string;
  subtitle?: string;
  saving?: boolean;
  onSave: () => void;
  saveLabel?: string;
  cancelLabel?: string;
  children: React.ReactNode;
}

export const EditSectionScaffold: React.FC<Props> = ({
  title,
  subtitle,
  saving,
  onSave,
  saveLabel = "Save",
  cancelLabel = "Cancel",
  children,
}) => {
  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={10}>
          <Text style={styles.cancel}>{cancelLabel}</Text>
        </TouchableOpacity>
        <View style={styles.titleWrap}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </View>
        <TouchableOpacity onPress={onSave} disabled={saving} hitSlop={10}>
          {saving ? (
            <ActivityIndicator size="small" color={theme.colors.primary} />
          ) : (
            <Text style={styles.save}>{saveLabel}</Text>
          )}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {subtitle ? (
            <View style={styles.subtitleBox}>
              <Ionicons
                name="information-circle-outline"
                size={16}
                color={theme.colors.textSecondary}
              />
              <Text style={styles.subtitle}>{subtitle}</Text>
            </View>
          ) : null}
          {children}
          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background },
  flex: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  titleWrap: { flex: 1, alignItems: "center", paddingHorizontal: theme.spacing.md },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.textPrimary,
  },
  cancel: { fontSize: 15, color: theme.colors.textSecondary, minWidth: 60 },
  save: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.primary,
    minWidth: 60,
    textAlign: "right",
  },
  scroll: {
    padding: theme.spacing.xl,
  },
  subtitleBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  subtitle: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
});
