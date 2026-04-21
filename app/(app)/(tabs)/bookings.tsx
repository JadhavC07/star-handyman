import AppHeader from "@/src/components/common/AppHeader";
import { theme } from "@/src/theme/theme";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type BookingStatus = "active" | "completed" | "cancelled";

interface Booking {
  id: string;
  service: string;
  professional: string;
  proImage: string;
  date: string;
  time: string;
  price: number;
  status: BookingStatus;
  icon: string;
}

const ACTIVE_BOOKINGS: Booking[] = [
  {
    id: "1",
    service: "Leaky Faucet Repair",
    professional: "John Smith",
    proImage: "https://i.pravatar.cc/150?u=john",
    date: "Today",
    time: "2:30 PM",
    price: 50,
    status: "active",
    icon: "pipe",
  },
  {
    id: "2",
    service: "AC Installation",
    professional: "David Carter",
    proImage: "https://i.pravatar.cc/150?u=david",
    date: "Tomorrow",
    time: "10:00 AM",
    price: 120,
    status: "active",
    icon: "air-conditioner",
  },
];

const PAST_BOOKINGS: Booking[] = [
  {
    id: "3",
    service: "Electrical Wiring",
    professional: "Alex Brown",
    proImage: "https://i.pravatar.cc/150?u=alex",
    date: "Mar 20, 2026",
    time: "11:00 AM",
    price: 80,
    status: "completed",
    icon: "lightning-bolt",
  },
];

const BookingsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"active" | "past">("active");
  const data = activeTab === "active" ? ACTIVE_BOOKINGS : PAST_BOOKINGS;

  const renderBookingCard = ({ item }: { item: Booking }) => {
    const isActive = item.status === "active";

    return (
      <View style={ss.card}>
        <View style={ss.cardHeader}>
          <View style={ss.iconWrapper}>
            <MaterialCommunityIcons
              name={item.icon as any}
              size={20}
              color={theme.colors.primary}
            />
          </View>
          <View style={ss.titleContent}>
            <Text style={ss.serviceTitle} numberOfLines={1}>
              {item.service}
            </Text>
            <Text style={ss.priceText}>${item.price.toFixed(2)}</Text>
          </View>
          <View
            style={[
              ss.statusBadge,
              isActive ? ss.activeBadge : ss.completedBadge,
            ]}
          >
            <Text
              style={[
                ss.statusText,
                isActive ? ss.activeStatusText : ss.completedStatusText,
              ]}
            >
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={ss.divider} />

        <View style={ss.cardBody}>
          <View style={ss.proInfo}>
            <Image source={{ uri: item.proImage }} style={ss.proAvatar} />
            <View>
              <Text style={ss.proName}>{item.professional}</Text>
              <Text style={ss.proSub}>Service Professional</Text>
            </View>
          </View>
          <View style={ss.timeInfo}>
            <Text style={ss.dateTime}>{item.date}</Text>
            <Text style={ss.timeLabel}>{item.time}</Text>
          </View>
        </View>
        {isActive ? (
          <View style={ss.cardFooter}>
            <TouchableOpacity
              style={ss.secondaryAction}
              onPress={() =>
                router.push({
                  pathname: "/chat/[bookingId]",
                  params: { bookingId: item.id },
                })
              }
            >
              <Feather
                name="message-square"
                size={16}
                color={theme.colors.textPrimary}
              />
              <Text style={ss.secondaryActionText}>Chat</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={ss.primaryAction}
              onPress={() =>
                router.push({
                  pathname: "/tracking/[bookingId]",
                  params: { bookingId: item.id },
                })
              }
            >
              <Text style={ss.primaryActionText}>Track Job</Text>
              <Ionicons name="location-outline" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={ss.cardFooter}>
            <TouchableOpacity style={ss.fullAction}>
              <Text style={ss.fullActionText}>Book Again</Text>
              <Ionicons
                name="refresh-outline"
                size={16}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={ss.safe}>
      <AppHeader
        title="My Bookings"
        rightComponent={
          <TouchableOpacity>
            <Feather name="bell" size={20} />
          </TouchableOpacity>
        }
      />
      <View style={ss.tabWrapper}>
        <View style={ss.tabContainer}>
          <TouchableOpacity
            style={[ss.tab, activeTab === "active" && ss.tabActive]}
            onPress={() => setActiveTab("active")}
          >
            <Text
              style={[ss.tabText, activeTab === "active" && ss.tabTextActive]}
            >
              Active
            </Text>
            {activeTab === "active" && <View style={ss.indicator} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[ss.tab, activeTab === "past" && ss.tabActive]}
            onPress={() => setActiveTab("past")}
          >
            <Text
              style={[ss.tabText, activeTab === "past" && ss.tabTextActive]}
            >
              History
            </Text>
            {activeTab === "past" && <View style={ss.indicator} />}
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderBookingCard}
        contentContainerStyle={ss.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={ss.emptyState}>
            <View style={ss.emptyIconBg}>
              <Feather
                name="calendar"
                size={40}
                color={theme.colors.textMuted}
              />
            </View>
            <Text style={ss.emptyTitle}>No Bookings Yet</Text>
            <Text style={ss.emptySub}>
              When you book a service, it will appear here for you to track.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default BookingsScreen;

const ss = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background },

  // Tabs
  tabWrapper: { paddingHorizontal: 20, marginBottom: 20 },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  tab: { flex: 1, paddingVertical: 12, alignItems: "center" },
  tabActive: {},
  tabText: {
    fontSize: 15,
    color: theme.colors.textMuted,
  },
  tabTextActive: {
    color: theme.colors.primary,
  },
  indicator: {
    position: "absolute",
    bottom: -1,
    width: "40%",
    height: 3,
    backgroundColor: theme.colors.primary,
    borderRadius: 3,
  },

  // List
  listContent: { paddingHorizontal: 20, paddingBottom: 100 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginBottom: 16,
    ...theme.shadows.medium,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  cardHeader: { flexDirection: "row", alignItems: "center", padding: 16 },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.colors.primary + "10",
    alignItems: "center",
    justifyContent: "center",
  },
  titleContent: { flex: 1, marginLeft: 12 },
  serviceTitle: {
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  priceText: {
    fontSize: 14,
    color: theme.colors.primary,
    marginTop: 2,
  },

  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  activeBadge: { backgroundColor: "#E0F2FE" },
  completedBadge: { backgroundColor: "#F1F5F9" },
  statusText: { fontSize: 10 },
  activeStatusText: { color: "#0369A1" },
  completedStatusText: { color: "#64748B" },

  divider: { height: 1, backgroundColor: "#F1F5F9", marginHorizontal: 16 },

  cardBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  proInfo: { flexDirection: "row", alignItems: "center", gap: 10 },
  proAvatar: { width: 36, height: 36, borderRadius: 18 },
  proName: {
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  proSub: { fontSize: 11, color: theme.colors.textMuted },
  timeInfo: { alignItems: "flex-end" },
  dateTime: {
    fontSize: 13,

    color: theme.colors.textPrimary,
  },
  timeLabel: { fontSize: 12, color: theme.colors.textMuted },

  // Footer Actions
  cardFooter: { flexDirection: "row", gap: 12, padding: 16, paddingTop: 0 },
  primaryAction: {
    flex: 2,
    backgroundColor: theme.colors.primary,
    height: 44,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  primaryActionText: {
    color: "#fff",
    fontSize: 14,
  },
  secondaryAction: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.border,
    height: 44,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  secondaryActionText: {
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  fullAction: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: theme.colors.primary + "08",
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: theme.colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  fullActionText: {
    color: theme.colors.primary,
    fontSize: 14,
  },

  // Empty State
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 80,
    paddingHorizontal: 40,
  },
  emptyIconBg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,

    color: theme.colors.textPrimary,
  },
  emptySub: {
    fontSize: 14,
    color: theme.colors.textMuted,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
});
