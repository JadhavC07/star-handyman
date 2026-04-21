import { haptic } from "@/src/lib/haptics";
import { theme } from "@/src/theme/theme";
import React, { useCallback, useState } from "react";
import {
  LayoutChangeEvent,
  Pressable as RNPressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type SegmentedControlProps<T extends string> = {
  segments: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * iOS-native segmented control. Sliding pill indicator driven by Reanimated
 * SharedValue + spring for a native-feel motion.
 */
export function SegmentedControl<T extends string>({
  segments,
  value,
  onChange,
  style,
}: SegmentedControlProps<T>) {
  const [trackWidth, setTrackWidth] = useState(0);
  const activeIndex = Math.max(0, segments.findIndex((s) => s.value === value));
  const translateX = useSharedValue(0);

  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    setTrackWidth(w);
    const pillWidth = (w - 4) / segments.length;
    translateX.value = activeIndex * pillWidth;
  };

  React.useEffect(() => {
    if (trackWidth === 0) return;
    const pillWidth = (trackWidth - 4) / segments.length;
    translateX.value = withSpring(activeIndex * pillWidth, theme.motion.snappy);
  }, [activeIndex, trackWidth, segments.length, translateX]);

  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const pillWidth = trackWidth > 0 ? (trackWidth - 4) / segments.length : 0;

  return (
    <View style={[styles.track, style]} onLayout={onLayout}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.pill,
          { width: pillWidth },
          pillStyle,
        ]}
      />
      {segments.map((seg) => (
        <Segment
          key={seg.value}
          active={seg.value === value}
          value={seg.value}
          label={seg.label}
          onChange={onChange}
        />
      ))}
    </View>
  );
}

const Segment = React.memo(function Segment<T extends string>({
  active,
  value,
  label,
  onChange,
}: {
  active: boolean;
  value: T;
  label: string;
  onChange: (value: T) => void;
}) {
  const handlePress = useCallback(() => {
    if (!active) {
      haptic.selection();
      onChange(value);
    }
  }, [active, value, onChange]);

  return (
    <RNPressable onPress={handlePress} style={styles.segment}>
      <Text
        style={[styles.label, active && styles.labelActive]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </RNPressable>
  );
}) as <T extends string>(props: {
  active: boolean;
  value: T;
  label: string;
  onChange: (value: T) => void;
}) => React.ReactElement;

const styles = StyleSheet.create({
  track: {
    flexDirection: "row",
    backgroundColor: "rgba(120,120,128,0.12)",  
    borderRadius: 9,
    padding: 2,
    height: 32,
    position: "relative",
  },
  pill: {
    position: "absolute",
    top: 2,
    left: 2,
    bottom: 2,
    backgroundColor: "#FFFFFF",
    borderRadius: 7,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  segment: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: theme.colors.ios.label,
    letterSpacing: -0.08,
  },
  labelActive: {
    fontWeight: "600",
  },
});
