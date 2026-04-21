import { theme } from "@/src/theme/theme";
import React from "react";
import {
  StyleProp,
  StyleSheet,
  Switch,
  Text,
  View,
  ViewStyle,
} from "react-native";
import type { SFSymbol } from "sf-symbols-typescript";
import { Icon } from "./Icon";
import { Pressable } from "./Pressable";

const DEFAULT_ICON_BG = theme.colors.ios.blue;

export type ListRowTrailing =
  | { type: "chevron" }
  | { type: "text"; value: string }
  | { type: "switch"; value: boolean; onValueChange: (v: boolean) => void }
  | { type: "custom"; node: React.ReactNode }
  | { type: "none" };

type ListRowProps = {
  title: string;
  subtitle?: string;
  icon?: SFSymbol;
  iconColor?: string;
  iconBackground?: string;
  trailing?: ListRowTrailing;
  onPress?: () => void;
  destructive?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * iOS settings-cell row. 44pt min height, optional leading icon tile,
 * title + optional subtitle, optional trailing (chevron, value, switch, custom).
 * Place inside <GroupedList> for hairline separators + rounded container.
 */
export const ListRow = React.memo(function ListRow({
  title,
  subtitle,
  icon,
  iconColor = "#FFFFFF",
  iconBackground = DEFAULT_ICON_BG,
  trailing = { type: "none" },
  onPress,
  destructive = false,
  style,
}: ListRowProps) {
  const titleStyle = destructive ? styles.titleDestructive : styles.title;
  const iconTileStyle =
    iconBackground === DEFAULT_ICON_BG
      ? styles.iconTileDefault
      : [styles.iconTile, { backgroundColor: iconBackground }];

  const content = (
    <View style={styles.row}>
      {icon ? (
        <View style={iconTileStyle}>
          <Icon name={icon} size={17} color={iconColor} weight="semibold" />
        </View>
      ) : null}

      <View style={styles.textCol}>
        <Text style={titleStyle} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      <Trailing trailing={trailing} />
    </View>
  );

  if (!onPress || trailing.type === "switch") {
    return <View style={[styles.base, style]}>{content}</View>;
  }

  return (
    <Pressable
      onPress={onPress}
      haptic="selection"
      pressedScale={1}
      style={[styles.base, style]}
      android_ripple={{ color: theme.colors.ios.fill }}
    >
      {content}
    </Pressable>
  );
});

function Trailing({ trailing }: { trailing: ListRowTrailing }) {
  switch (trailing.type) {
    case "chevron":
      return (
        <Icon
          name="chevron.right"
          size={15}
          color={theme.colors.ios.tertiaryLabel}
          weight="semibold"
        />
      );
    case "text":
      return (
        <Text style={styles.trailingText} numberOfLines={1}>
          {trailing.value}
        </Text>
      );
    case "switch":
      return (
        <Switch
          value={trailing.value}
          onValueChange={trailing.onValueChange}
          trackColor={{ true: theme.colors.ios.success }}
        />
      );
    case "custom":
      return <>{trailing.node}</>;
    case "none":
    default:
      return null;
  }
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: theme.colors.ios.secondarySystemGroupedBackground,
    minHeight: 44,
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 11,
    gap: 12,
  },
  iconTile: {
    width: 29,
    height: 29,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  textCol: { flex: 1, justifyContent: "center" },
  title: {
    fontSize: 17,
    fontWeight: "400",
    letterSpacing: -0.41,
    color: theme.colors.ios.label,
  },
  titleDestructive: {
    fontSize: 17,
    fontWeight: "400",
    letterSpacing: -0.41,
    color: theme.colors.ios.destructive,
  },
  iconTileDefault: {
    width: 29,
    height: 29,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.ios.blue,
  },
  subtitle: {
    fontSize: 13,
    color: theme.colors.ios.secondaryLabel,
    marginTop: 2,
    letterSpacing: -0.08,
  },
  trailingText: {
    fontSize: 17,
    color: theme.colors.ios.secondaryLabel,
    letterSpacing: -0.41,
    maxWidth: 160,
  },
});
