import { haptic } from "@/src/lib/haptics";
import { theme } from "@/src/theme/theme";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Option<T extends string> {
  value: T;
  label: string;
}

interface Props<T extends string> {
  label: string;
  options: Option<T>[];
  value: T | undefined;
  onChange: (v: T) => void;
}

export function ChipSelector<T extends string>({
  label,
  options,
  value,
  onChange,
}: Props<T>) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <TouchableOpacity
              key={opt.value}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => {
                haptic.selection();
                onChange(opt.value);
              }}
              activeOpacity={0.85}
            >
              <Text style={[styles.text, active && styles.textActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: theme.spacing.lg },
  label: {
    fontSize: 13,
    color: theme.colors.textMuted,
    marginBottom: 8,
    fontWeight: "500",
  },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: theme.radius.lg,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  chipActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primarySubtle,
  },
  text: { fontSize: 13, color: theme.colors.textMuted, fontWeight: "500" },
  textActive: { color: theme.colors.primary, fontWeight: "700" },
});
