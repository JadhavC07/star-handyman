import { GroupedList, ListRow } from "@/src/components/ui";
import { useHandymanProfile } from "@/src/hooks/profile/useHandymanProfile";
import { theme } from "@/src/theme/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type SectionKey = "basic" | "legal" | "licenses" | "bank" | "other";

const SECTIONS: {
  key: SectionKey;
  icon: any;
  iconBg: string;
}[] = [
  { key: "basic", icon: "person.fill", iconBg: theme.colors.ios.blue },
  { key: "legal", icon: "checkmark.circle.fill", iconBg: theme.colors.ios.indigo },
  { key: "licenses", icon: "doc.text", iconBg: theme.colors.ios.orange },
  { key: "bank", icon: "creditcard.fill", iconBg: theme.colors.ios.green },
  { key: "other", icon: "slider.horizontal.3", iconBg: theme.colors.ios.purple },
];

export default function ProfileEditIndex() {
  const { t } = useTranslation("handyman");
  const { data } = useHandymanProfile();
  const profile = data?.user?.profile;
  const user = data?.user;

  const completeness = (() => {
    const flags = [
      user?.name,
      user?.email,
      user?.avatar,
      profile?.sin_number,
      profile?.insurance_company,
      profile?.bank_name,
      profile?.bank_account_number,
      profile?.category_enrollments?.length,
      profile?.availability,
    ];
    const filled = flags.filter(Boolean).length;
    return Math.round((filled / flags.length) * 100);
  })();

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={10}>
          <Ionicons
            name="chevron-back"
            size={26}
            color={theme.colors.textPrimary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("profile.sections.title")}</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.intro}>{t("profile.sections.subtitle")}</Text>

        <View style={styles.progressCard}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>Profile completeness</Text>
            <Text style={styles.progressValue}>{completeness}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[styles.progressFill, { width: `${completeness}%` }]}
            />
          </View>
        </View>

        <View style={{ height: theme.spacing.lg }} />

        <GroupedList>
          {SECTIONS.map((s) => (
            <ListRow
              key={s.key}
              icon={s.icon}
              iconBackground={s.iconBg}
              title={t(`profile.sections.${s.key}.title`)}
              subtitle={t(`profile.sections.${s.key}.subtitle`)}
              trailing={{ type: "chevron" }}
              onPress={() => router.push(`/(handyman)/profile-edit/${s.key}` as any)}
            />
          ))}
        </GroupedList>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: 12,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.textPrimary,
  },
  scroll: {
    padding: theme.spacing.xl,
  },
  intro: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: theme.spacing.lg,
  },
  progressCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    ...theme.shadows.small,
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  progressLabel: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: "500",
  },
  progressValue: {
    fontSize: 15,
    color: theme.colors.primary,
    fontWeight: "700",
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.border,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: 3,
  },
});
