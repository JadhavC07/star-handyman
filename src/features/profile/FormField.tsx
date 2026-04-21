import { theme } from "@/src/theme/theme";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

interface Props extends Omit<TextInputProps, "style"> {
  label: string;
  hint?: string;
  error?: string | null;
  required?: boolean;
  multiline?: boolean;
}

export const FormField: React.FC<Props> = ({
  label,
  hint,
  error,
  required,
  multiline,
  ...inputProps
}) => {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>
        {label}
        {required ? <Text style={styles.required}> *</Text> : null}
      </Text>
      <TextInput
        {...inputProps}
        multiline={multiline}
        placeholderTextColor={theme.colors.textMuted}
        style={[
          styles.input,
          multiline && styles.multiline,
          error ? styles.inputError : null,
        ]}
      />
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : hint ? (
        <Text style={styles.hint}>{hint}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { marginBottom: theme.spacing.lg },
  label: {
    fontSize: 13,
    color: theme.colors.textMuted,
    marginBottom: 6,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    paddingHorizontal: 14,
    height: 52,
    backgroundColor: theme.colors.surface,
    fontSize: 15,
    color: theme.colors.textPrimary,
  },
  multiline: {
    height: 100,
    paddingTop: 12,
    textAlignVertical: "top",
  },
  hint: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 6,
    marginLeft: 2,
  },
  errorText: {
    fontSize: 12,
    color: theme.colors.error ?? "#EF4444",
    marginTop: 6,
    marginLeft: 2,
    fontWeight: "500",
  },
  inputError: {
    borderColor: theme.colors.error ?? "#EF4444",
  },
  required: {
    color: theme.colors.error ?? "#EF4444",
  },
});
