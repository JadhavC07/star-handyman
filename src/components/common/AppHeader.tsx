import { theme } from "@/src/theme/theme";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  title: string;
  showNotification?: boolean;
  showDot?: boolean;
  onPressNotification?: () => void;
  rightComponent?: React.ReactNode;
};

const AppHeader: React.FC<Props> = ({
  title,
  showNotification = true,
  showDot = false,
  onPressNotification,
  rightComponent,
}) => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{title}</Text>

      {rightComponent ? (
        rightComponent
      ) : showNotification ? (
        <TouchableOpacity
          style={styles.notificationBtn}
          onPress={onPressNotification}
        >
          <Feather name="bell" size={20} color={theme.colors.textPrimary} />
          {showDot && <View style={styles.dot} />}
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default AppHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 24,
    color: theme.colors.textPrimary,
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadows.small,
  },
  dot: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "red",
    borderWidth: 1.5,
    borderColor: "#fff",
  },
});
