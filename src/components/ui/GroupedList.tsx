import { theme } from "@/src/theme/theme";
import React, { Children, isValidElement } from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

// iOS inset-grouped separator inset: align past leading icon tile.
// See ListRow: row paddingLeft (16) + iconTile width (29) + gap (12).
const ROW_PADDING_LEFT = 16;
const ICON_TILE_WIDTH  = 29;
const ICON_TILE_GAP    = 12;
const SEPARATOR_INSET  = ROW_PADDING_LEFT + ICON_TILE_WIDTH + ICON_TILE_GAP;

type GroupedListProps = {
  header?: string;
  footer?: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

/**
 * iOS "inset grouped" container for ListRows.
 * Renders a rounded-corner card with hairline separators between children
 * and optional header/footer labels.
 */
export const GroupedList = React.memo(function GroupedList({
  header,
  footer,
  children,
  style,
}: GroupedListProps) {
  const rows = Children.toArray(children).filter(isValidElement);

  return (
    <View style={style}>
      {header ? <Text style={styles.header}>{header.toUpperCase()}</Text> : null}

      <View style={styles.container}>
        {rows.map((child, i) => (
          <View key={i}>
            {child}
            {i < rows.length - 1 ? <View style={styles.separator} /> : null}
          </View>
        ))}
      </View>

      {footer ? <Text style={styles.footer}>{footer}</Text> : null}
    </View>
  );
});

const styles = StyleSheet.create({
  header: {
    fontSize: 13,
    color: theme.colors.ios.secondaryLabel,
    letterSpacing: -0.08,
    marginLeft: 16,
    marginBottom: 6,
  },
  container: {
    backgroundColor: theme.colors.ios.secondarySystemGroupedBackground,
    borderRadius: 10,
    overflow: "hidden",
  },
  separator: {
    height: theme.hairline,
    backgroundColor: theme.colors.ios.separator,
    marginLeft: SEPARATOR_INSET,
  },
  footer: {
    fontSize: 13,
    color: theme.colors.ios.secondaryLabel,
    letterSpacing: -0.08,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 6,
    lineHeight: 18,
  },
});
