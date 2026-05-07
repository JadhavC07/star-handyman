import type { AppNotification } from "@/src/features/notifications/notification.types";
import {
  useDeleteNotification,
  useMarkAllRead,
  useMarkRead,
  useNotifications,
  useUnreadCount,
} from "@/src/hooks/notifications/useNotifications";
import { theme } from "@/src/theme/theme";
import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

function NotificationItem({
  item,
  onRead,
  onDelete,
}: {
  item: AppNotification;
  onRead: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <TouchableOpacity
      style={[ss.item, !item.is_read && ss.itemUnread]}
      onPress={() => !item.is_read && onRead(item.id)}
      activeOpacity={0.75}
    >
      <View style={ss.itemLeft}>
        {!item.is_read && <View style={ss.dot} />}
        <View style={ss.iconWrap}>
          <Ionicons
            name={getTypeIcon(item.type)}
            size={20}
            color={theme.colors.primary}
          />
        </View>
      </View>
      <View style={ss.itemBody}>
        <Text style={ss.itemTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={ss.itemBody2} numberOfLines={2}>
          {item.body}
        </Text>
        <Text style={ss.itemTime}>{formatTime(item.created_at)}</Text>
      </View>
      <TouchableOpacity
        onPress={() => onDelete(item.id)}
        hitSlop={10}
        style={ss.deleteBtn}
      >
        <Ionicons name="close" size={16} color={theme.colors.textMuted} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

export default function NotificationsScreen() {
  const [page, setPage] = useState(1);
  const { data, isLoading, refetch, isRefetching } = useNotifications(page);
  const { data: unreadData } = useUnreadCount();
  const markRead = useMarkRead();
  const markAll = useMarkAllRead();
  const deleteNotif = useDeleteNotification();

  const notifications = data?.data ?? [];
  const hasMore =
    (data?.pagination?.current_page ?? 1) < (data?.pagination?.last_page ?? 1);

  return (
    <SafeAreaView style={ss.safe} edges={["top"]}>
      <View style={ss.header}>
        <Text style={ss.title}>Notifications</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          {(unreadData?.count ?? 0) > 0 && (
            <TouchableOpacity onPress={() => markAll.mutate()}>
              <Text style={ss.markAll}>Mark all read</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => router.push("/(handyman)/notifications/settings")}
          >
            <Feather
              name="settings"
              size={20}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {isLoading ? (
        <ActivityIndicator style={ss.loader} color={theme.colors.primary} />
      ) : notifications.length === 0 ? (
        <View style={ss.empty}>
          <Ionicons
            name="notifications-off-outline"
            size={48}
            color={theme.colors.textMuted}
          />
          <Text style={ss.emptyText}>No notifications yet</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <NotificationItem
              item={item}
              onRead={(id) => markRead.mutate(id)}
              onDelete={(id) => deleteNotif.mutate(id)}
            />
          )}
          ItemSeparatorComponent={() => <View style={ss.divider} />}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={() => {
                setPage(1);
                refetch();
              }}
              tintColor={theme.colors.primary}
            />
          }
          onEndReached={() => hasMore && setPage((p) => p + 1)}
          onEndReachedThreshold={0.4}
          contentContainerStyle={ss.list}
        />
      )}
    </SafeAreaView>
  );
}

function getTypeIcon(type: string | null): any {
  switch (type) {
    case "booking":
      return "calendar-outline";
    case "payment":
      return "card-outline";
    case "job_alert":
      return "briefcase-outline";
    default:
      return "notifications-outline";
  }
}

function formatTime(iso: string): string {
  const date = new Date(iso);
  const diff = (Date.now() - date.getTime()) / 1000;
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString();
}

const ss = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  title: { fontSize: 20, fontWeight: "700", color: theme.colors.textPrimary },
  markAll: { fontSize: 14, color: theme.colors.primary, fontWeight: "600" },
  loader: { marginTop: 40 },
  list: { paddingBottom: 24 },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  emptyText: { fontSize: 15, color: theme.colors.textMuted },
  item: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: theme.colors.background,
  },
  itemUnread: { backgroundColor: `${theme.colors.primary}08` },
  itemLeft: { alignItems: "center", marginRight: 12, gap: 6, paddingTop: 2 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primarySubtle,
    alignItems: "center",
    justifyContent: "center",
  },
  itemBody: { flex: 1 },
  itemTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.textPrimary,
    marginBottom: 3,
  },
  itemBody2: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  itemTime: { fontSize: 11, color: theme.colors.textMuted, marginTop: 6 },
  deleteBtn: { padding: 4, marginLeft: 8 },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.border,
  },
});
