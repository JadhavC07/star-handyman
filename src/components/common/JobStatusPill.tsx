import { theme } from "@/src/theme/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export type JobStatus = "incoming" | "active" | "completed";

type Props = { status: JobStatus };

const LABELS: Record<JobStatus, string> = {
  incoming: "New",
  active: "Ongoing",
  completed: "Completed",
};

export const JobStatusPill = React.memo(function JobStatusPill({ status }: Props) {
  const { bg, fg, border } = pillColors(status);
  return (
    <View style={[ss.pill, { backgroundColor: bg, borderColor: border ?? "transparent", borderWidth: border ? theme.hairline : 0 }]}>
      <Text style={[ss.text, { color: fg }]}>{LABELS[status]}</Text>
    </View>
  );
});

function pillColors(status: JobStatus) {
  switch (status) {
    case "incoming":
      return { bg: theme.colors.primary, fg: theme.colors.surface };
    case "active":
      return { bg: theme.colors.textPrimary, fg: theme.colors.surface };
    case "completed":
      return {
        bg: theme.colors.surfaceAlt,
        fg: theme.colors.textMuted,
        border: theme.colors.border,
      };
  }
}

const ss = StyleSheet.create({
  pill: {
    paddingHorizontal: theme.spacing.sm + 2,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.full,
  },
  text: {
    ...theme.typography.ios.caption2,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});
