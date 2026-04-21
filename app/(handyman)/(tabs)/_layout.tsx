import {
  BookingsTabIcon,
  HomeTabIcon,
  ProfileTabIcon,
} from "@/src/components/svg/TabIcons";
import { theme } from "@/src/theme/theme";
import { Feather } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import { JSX } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TabIconProps = { color: string; focused: boolean };

const TAB_ICONS: Record<string, (props: TabIconProps) => JSX.Element> = {
  index: ({ color, focused }) => (
    <HomeTabIcon size={22} color={color} active={focused} />
  ),
  jobs: ({ color, focused }) => (
    <BookingsTabIcon size={22} color={color} active={focused} />
  ),
  earnings: ({ color, focused }) => (
    <View style={{ opacity: focused ? 1 : 0.85 }}>
      <Feather name="dollar-sign" size={22} color={color} />
    </View>
  ),
  profile: ({ color, focused }) => (
    <ProfileTabIcon size={22} color={color} active={focused} />
  ),
};

const TAB_LABELS: Record<string, string> = {
  index: "Home",
  jobs: "Jobs",
  earnings: "Earnings",
  profile: "Profile",
};

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { bottom: insets.bottom + 12 }]}>
      <View style={styles.pill}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const color = focused ? theme.colors.primary : theme.colors.textMuted;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              activeOpacity={0.75}
              style={[styles.tab, focused && styles.tabActive]}
            >
              {TAB_ICONS[route.name]?.({ color, focused })}
              <Text style={[styles.label, { color }]}>
                {TAB_LABELS[route.name]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function HandymanTabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="jobs" />
      <Tabs.Screen name="earnings" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 16,
    right: 16,
    alignItems: "center",
  },
  pill: {
    flexDirection: "row",
    backgroundColor: theme.colors.surface,
    borderRadius: 50,
    padding: 10,
    width: "100%",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 9,
    borderRadius: 32,
  },
  tabActive: {
    backgroundColor: `${theme.colors.primary}15`,
  },
  label: {
    fontSize: 12,
  },
});
