import { theme } from "@/src/theme/theme";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon } from "./Icon";
import { PlatformBlurBackground } from "./PlatformBlurBackground";

type NavigationHeaderProps = {
  title?: string;
  /** Show a back chevron that calls router.back(). Hidden by default on root screens. */
  showBack?: boolean;
  onBack?: () => void;
  /** Right-side action node (icon buttons, etc.) */
  right?: React.ReactNode;
  /** Render a 34pt iOS large-title under the bar. */
  largeTitle?: boolean;
  /** Transparent bar (for screens that want their own background). */
  transparent?: boolean;
};

const BAR_HEIGHT = 44;

/**
 * iOS navigation bar: translucent BlurView background, hairline bottom border,
 * inline title, back chevron on the left, right-side slot.
 * Supports a largeTitle variant that stacks a 34pt title under the bar.
 */
export const NavigationHeader = React.memo(function NavigationHeader({
  title,
  showBack = true,
  onBack,
  right,
  largeTitle = false,
  transparent = false,
}: NavigationHeaderProps) {
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    if (onBack) onBack();
    else if (router.canGoBack()) router.back();
  };

  return (
    <View style={{ paddingTop: insets.top }}>
      <View style={styles.bar}>
        {!transparent ? <PlatformBlurBackground /> : null}

        <View style={styles.left}>
          {showBack ? (
            <Pressable
              onPress={handleBack}
              hitSlop={10}
              style={styles.backBtn}
            >
              <Icon
                name="chevron.left"
                size={22}
                color={theme.colors.ios.blue}
                weight="semibold"
              />
              <Text style={styles.backLabel}>Back</Text>
            </Pressable>
          ) : null}
        </View>

        {!largeTitle && title ? (
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        ) : null}

        <View style={styles.right}>{right}</View>

        {!transparent ? <View style={styles.hairline} /> : null}
      </View>

      {largeTitle && title ? (
        <View style={styles.largeTitleRow}>
          <Text style={styles.largeTitle}>{title}</Text>
        </View>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  bar: {
    height: BAR_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  left:  { flex: 1, alignItems: "flex-start" },
  right: { flex: 1, alignItems: "flex-end", flexDirection: "row", justifyContent: "flex-end" },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
    height: BAR_HEIGHT,
  },
  backLabel: {
    fontSize: 17,
    color: theme.colors.ios.blue,
    letterSpacing: -0.41,
    marginLeft: 2,
  },
  title: {
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 17,
    fontWeight: "600",
    color: theme.colors.ios.label,
    letterSpacing: -0.41,
  },
  hairline: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: theme.hairline,
    backgroundColor: theme.colors.ios.separator,
  },
  largeTitleRow: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 8,
    backgroundColor: theme.colors.ios.systemBackground,
  },
  largeTitle: {
    fontSize: 34,
    fontWeight: "700",
    color: theme.colors.ios.label,
    letterSpacing: 0.37,
  },
});
