import { theme } from "@/src/theme/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { InfoRow } from "./InfoRow";

type Props = {
  skills?: string[];
  experienceYears: string;
  availabilityLabel: string;
  isAvailable: boolean;
};

export function ProfileInfoCard({
  skills,
  experienceYears,
  availabilityLabel,
  isAvailable,
}: Props) {
  return (
    <View style={ss.card}>
      <InfoRow icon="tool" iconColor={theme.colors.ios.orange} label="Skills">
        {skills?.length ? (
          <View style={ss.chipsRow}>
            {skills.map((skill, i) => (
              <View key={i} style={ss.chip}>
                <Text style={ss.chipText}>{skill}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={ss.empty}>Add skills</Text>
        )}
      </InfoRow>

      <View style={ss.divider} />

      <InfoRow
        icon="briefcase"
        iconColor={theme.colors.ios.indigo}
        label="Experience"
        value={experienceYears}
      />

      <View style={ss.divider} />

      <InfoRow
        icon="target"
        iconColor={theme.colors.ios.green}
        label="Availability"
        value={availabilityLabel}
        valueColor={isAvailable ? theme.colors.success : theme.colors.textMuted}
      />
    </View>
  );
}

const ss = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xs,
    marginBottom: theme.spacing.xxl,
    ...theme.shadows.small,
  },
  divider: {
    height: theme.hairline,
    backgroundColor: theme.colors.border,
    marginLeft: 48,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    flex: 1,
    alignItems: "flex-start",
    alignContent: "flex-start",
  },
  chip: {
    height: 28,
    paddingHorizontal: theme.spacing.md + 2,
    paddingVertical: theme.spacing.xs + 1,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primarySubtle,
    borderWidth: theme.hairline,
    borderColor: `${theme.colors.primary}33`,
    justifyContent: "center",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  chipText: {
    ...theme.typography.ios.caption1,
    color: theme.colors.primary,
    fontWeight: "500",
  },
  empty: {
    ...theme.typography.ios.caption1,
    color: theme.colors.textMuted,
  },
});
