import { theme } from "@/src/theme/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SERVICES = [
  {
    id: "1",
    name: "Roll-on waxing\n(Full arms, legs & und...",
    tag: "safe &\nhygienic",
    rating: 4.88,
    reviews: "125K",
    price: "₹499",
    badge: null,
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=300&h=200&fit=crop",
  },
  {
    id: "2",
    name: "Drilling work",
    tag: "Certified Work",
    rating: 4.7,
    reviews: "47K",
    price: "₹149",
    badge: null,
    image:
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=300&h=200&fit=crop",
  },
  {
    id: "3",
    name: "AC Servicing\n(Deep clean)",
    tag: null,
    rating: 4.9,
    reviews: "221K",
    price: "₹549",
    badge: "Most popular",
    image:
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=300&h=200&fit=crop",
  },
  {
    id: "4",
    name: "Deep House\nCleaning",
    tag: null,
    rating: 4.8,
    reviews: "89K",
    price: "₹399",
    badge: null,
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&h=200&fit=crop",
  },
];

export default function SearchScreen() {
  const [query, setQuery] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      {/* ── Search Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={theme.colors.textPrimary}
          />
        </TouchableOpacity>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color={theme.colors.primary} />
          <TextInput
            style={styles.input}
            placeholder="Search for services..."
            autoFocus
            value={query}
            onChangeText={setQuery}
          />
        </View>
      </View>

      {/* ── Suggested Services List ── */}
      <FlatList
        data={SERVICES} // Reusing your existing SERVICES array
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <Text style={styles.listTitle}>Popular Services</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.serviceRow}>
            <View style={styles.serviceIconWrap}>
              <Ionicons
                name="construct-outline"
                size={20}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceName}>
                {item.name.replace("\n", " ")}
              </Text>
              <Text style={styles.servicePrice}>
                Starting from {item.price}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={theme.colors.textMuted}
            />
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.lg,
    gap: 12,
  },
  backBtn: { padding: 4 },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: theme.radius.md,
    paddingHorizontal: 12,
    height: 48,
    gap: 10,
  },
  input: { flex: 1, fontSize: 16, color: theme.colors.textPrimary },
  listContent: { padding: theme.spacing.lg },
  listTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.textMuted,
    textTransform: "uppercase",
    marginBottom: 16,
  },
  serviceRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  serviceIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: theme.colors.primarySubtle,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  serviceInfo: { flex: 1 },
  serviceName: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.textPrimary,
  },
  servicePrice: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
});
