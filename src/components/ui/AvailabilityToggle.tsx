import { theme } from "@/src/theme/theme";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  value: boolean;
  onChange: (next: boolean) => void;
};

export function AvailabilityToggle({ value, onChange }: Props) {
  return (
    <TouchableOpacity
      style={ss.pill}
      onPress={() => onChange(!value)}
      activeOpacity={0.85}
    >
      <View
        style={[
          ss.dot,
          { backgroundColor: value ? theme.colors.success : theme.colors.textMuted },
        ]}
      />
      <Text style={ss.text}>{value ? "You're online" : "You're offline"}</Text>
      <View style={[ss.switch, !value && ss.switchOff]}>
        <View style={[ss.knob, !value && ss.knobOff]} />
      </View>
    </TouchableOpacity>
  );
}

const ss = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.full,
    paddingVertical: theme.spacing.sm,
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.xs + 2,
    ...theme.shadows.small,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  text: {
    ...theme.typography.ios.subhead,
    fontWeight: "600",
    color: theme.colors.textPrimary,
  },
  switch: {
    width: 36,
    height: 22,
    borderRadius: 11,
    backgroundColor: theme.colors.success,
    padding: 2,
    justifyContent: "center",
  },
  switchOff: { backgroundColor: theme.colors.border },
  knob: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: theme.colors.surface,
    alignSelf: "flex-end",
    ...theme.shadows.small,
  },
  knobOff: { alignSelf: "flex-start" },
});
