import { theme } from "@/src/theme/theme";
import { Feather, Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface HeaderProps {
  title: string;
  onBack?: () => void;
  rightIcon?: "dots" | "search" | "info";
  onRightPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  onBack,
  rightIcon,
  onRightPress,
}) => {
  return (
    <View style={styles.container}>
      {onBack ? (
        <TouchableOpacity style={styles.iconBtn} onPress={onBack}>
          <Ionicons
            name="chevron-back"
            size={22}
            color={theme.colors.textPrimary}
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.iconBtn} />
      )}
      <Text style={styles.title}>{title}</Text>
      {rightIcon ? (
        <TouchableOpacity style={styles.iconBtn} onPress={onRightPress}>
          {rightIcon === "dots" && (
            <Feather
              name="more-vertical"
              size={20}
              color={theme.colors.textPrimary}
            />
          )}
          {rightIcon === "search" && (
            <Feather name="search" size={20} color={theme.colors.textPrimary} />
          )}
          {rightIcon === "info" && (
            <Feather name="info" size={20} color={theme.colors.textPrimary} />
          )}
        </TouchableOpacity>
      ) : (
        <View style={styles.iconBtn} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
  },
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
});
