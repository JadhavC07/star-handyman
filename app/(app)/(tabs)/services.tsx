import AppHeader from "@/src/components/common/AppHeader";
import { BottomSheet, BottomSheetRef } from "@/src/components/ui";
import { theme } from "@/src/theme/theme";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useRef, useState } from "react";

import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, {
  Circle,
  Defs,
  Rect,
  Stop,
  LinearGradient as SvgLinearGradient,
} from "react-native-svg";

const { width: SW } = Dimensions.get("window");

// ─── Data ─────────────────────────────────────────────────────────────────
const FILTERS = [
  { id: "all", label: "All", icon: "grid-outline" },
  { id: "plumbing", label: "Plumbing", icon: "water-outline" },
  { id: "electrical", label: "Electrical", icon: "flash-outline" },
  { id: "cleaning", label: "Cleaning", icon: "sparkles-outline" },
  { id: "ac", label: "AC Repair", icon: "thermometer-outline" },
];

const SORT_OPTIONS = [
  { id: "rating", label: "Top Rated", icon: "star-outline" },
  {
    id: "price_low",
    label: "Price: Low to High",
    icon: "trending-down-outline",
  },
  {
    id: "price_high",
    label: "Price: High to Low",
    icon: "trending-up-outline",
  },
];

const SERVICES = [
  {
    id: "1",
    name: "Leaky Faucet Repair",
    desc: "Fix dripping taps, joint leaks & pipe bursts. Same-day service.",
    price: 50,
    originalPrice: 70,
    rating: 4.9,
    reviews: "12.4K",
    bookings: "8.2K",
    badge: "Best Value",
    badgeColor: theme.colors.success,
    duration: "45 min",
    image:
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=220&fit=crop",
    category: "plumbing",
    includes: ["Material included", "30-day warranty"],
  },
  {
    id: "2",
    name: "Electrical Wiring",
    desc: "New wiring, MCB fitting, short-circuit repair & fan installation.",
    price: 80,
    originalPrice: null,
    rating: 4.8,
    reviews: "9.1K",
    bookings: "5.4K",
    badge: null,
    badgeColor: null,
    duration: "1–2 hrs",
    image:
      "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&h=220&fit=crop",
    category: "electrical",
    includes: ["ISI certified parts", "Safety check"],
  },
];

type Service = (typeof SERVICES)[0];

// ─── Sub-components ────────────────────────────────────────────────────────

type SortContentProps = {
  currentSort: string;
  onSelect: (value: string) => void;
};

const SortContent = ({ currentSort, onSelect }: SortContentProps) => {
  return (
    <View>
      <Text onPress={() => onSelect("latest")}>
        Latest {currentSort === "latest" ? "✓" : ""}
      </Text>

      <Text onPress={() => onSelect("popular")}>
        Popular {currentSort === "popular" ? "✓" : ""}
      </Text>
    </View>
  );
};

function CategoryHeroBanner() {
  return (
    <View style={styles.heroBanner}>
      <Svg
        style={StyleSheet.absoluteFill}
        viewBox="0 0 400 120"
        preserveAspectRatio="xMidYMid slice"
      >
        <Defs>
          <SvgLinearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={theme.colors.primary} />
            <Stop offset="100%" stopColor={theme.colors.primary} />
          </SvgLinearGradient>
        </Defs>
        <Rect width="400" height="120" fill="url(#heroGrad)" />
        <Circle cx="380" cy="20" r="100" fill="rgba(255,255,255,0.08)" />
      </Svg>

      <View style={styles.heroContent}>
        <View>
          <Text style={styles.heroTitle}>Premium Services</Text>
          <Text style={styles.heroSub}>Expert solutions for your home</Text>
        </View>
        <View style={styles.heroBadge}>
          <Ionicons name="shield-checkmark" size={16} color="#fff" />
          <Text style={styles.heroBadgeText}>Verified</Text>
        </View>
      </View>
    </View>
  );
}

function FilterBar({
  active,
  onSelect,
}: {
  active: string;
  onSelect: (id: string) => void;
}) {
  return (
    <View style={styles.filterContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
      >
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.id}
            onPress={() => onSelect(f.id)}
            style={[
              styles.filterChip,
              active === f.id && styles.filterChipActive,
            ]}
          >
            <Ionicons
              name={f.icon as any}
              size={14}
              color={active === f.id ? "#fff" : theme.colors.textSecondary}
            />
            <Text
              style={[
                styles.filterChipText,
                active === f.id && styles.filterChipTextActive,
              ]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

function ServiceCard({ item }: { item: Service }) {
  const discount = item.originalPrice
    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
    : null;

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.95}
      onPress={() => router.push(`/services/${item.id}`)}
    >
      <View style={styles.imageSection}>
        <Image source={{ uri: item.image }} style={styles.cardImage} />
        {item.badge && (
          <View
            style={[
              styles.cardBadge,
              { backgroundColor: item.badgeColor || theme.colors.primary },
            ]}
          >
            <Text style={styles.cardBadgeText}>{item.badge}</Text>
          </View>
        )}
        <View style={styles.durationPill}>
          <Ionicons name="time-outline" size={12} color="#fff" />
          <Text style={styles.durationText}>{item.duration}</Text>
        </View>
      </View>

      <View style={styles.cardDetails}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.serviceName} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.ratingBox}>
            <Ionicons name="star" size={12} color={theme.colors.warning} />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>

        <Text style={styles.serviceDesc} numberOfLines={2}>
          {item.desc}
        </Text>

        <View style={styles.cardFooter}>
          <View>
            <View style={styles.priceRow}>
              <Text style={styles.currentPrice}>${item.price}</Text>
              {item.originalPrice && (
                <Text style={styles.oldPrice}>${item.originalPrice}</Text>
              )}
            </View>
            <Text style={styles.bookingStats}>
              {item.bookings} booked recently
            </Text>
          </View>

          <TouchableOpacity
            style={styles.bookBtn}
            onPress={() =>
              router.push({
                pathname: "/services/[id]/book",
                params: { id: item.id },
              })
            }
          >
            <Text style={styles.bookBtnText}>Book</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── Main Screen ───────────────────────────────────────────────────────────
const ServiceListScreen: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("rating"); // Default sort
  const [isSortVisible, setIsSortVisible] = useState(false);
  const sortSheetRef = useRef<BottomSheetRef | null>(null);

  // 1. Filter logic
  let processedData =
    activeFilter === "all"
      ? [...SERVICES]
      : SERVICES.filter((s) => s.category === activeFilter);

  // 2. Sort logic
  processedData.sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "price_low") return a.price - b.price;
    if (sortBy === "price_high") return b.price - a.price;
    return 0;
  });

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <AppHeader
        title="All Services"
        rightComponent={
          <TouchableOpacity>
            <Feather name="grid" size={20} />
          </TouchableOpacity>
        }
      />
      <FlatList
        data={processedData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <CategoryHeroBanner />
            <FilterBar active={activeFilter} onSelect={setActiveFilter} />

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {processedData.length} Services Found
              </Text>
              <TouchableOpacity
                style={styles.sortBtn}
                onPress={() => setIsSortVisible(true)}
              >
                <MaterialCommunityIcons
                  name="sort-variant"
                  size={18}
                  color={theme.colors.primary}
                />
                <Text style={styles.sortBtnText}>
                  {SORT_OPTIONS.find((o) => o.id === sortBy)?.label || "Sort"}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        }
        renderItem={({ item }) => <ServiceCard item={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
      />
      <View style={{ height: 100 }} />

      <BottomSheet ref={sortSheetRef}>
        <SortContent
          currentSort={sortBy}
          onSelect={(value) => {
            setSortBy(value);
            sortSheetRef.current?.dismiss();
          }}
        />
      </BottomSheet>
    </SafeAreaView>
  );
};

export default ServiceListScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  listContent: { paddingBottom: 30 },

  // Hero Section
  heroBanner: {
    height: 120,
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 16,
    overflow: "hidden",
    justifyContent: "center",
  },
  heroContent: {
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroTitle: { fontSize: 22, color: "#fff" },
  heroSub: { fontSize: 13, color: "rgba(255,255,255,0.8)", marginTop: 2 },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  heroBadgeText: {
    color: "#fff",
    fontSize: 12,
  },

  // Filter Bar
  filterContainer: { marginTop: 16 },
  filterScroll: { paddingHorizontal: 16, gap: 10 },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 6,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  filterChipTextActive: { color: "#fff" },

  // Section Header
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,

    color: theme.colors.textPrimary,
  },
  sortBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
  sortBtnText: {
    color: theme.colors.primary,
    fontSize: 14,
  },

  // Card Design
  card: {
    marginHorizontal: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    overflow: "hidden",
    ...theme.shadows.medium,
  },
  imageSection: { height: 160, position: "relative" },
  cardImage: { width: "100%", height: "100%" },
  cardBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  cardBadgeText: {
    color: "#fff",
    fontSize: 11,
  },
  durationPill: {
    position: "absolute",
    bottom: 12,
    left: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  durationText: {
    color: "#fff",
    fontSize: 11,
  },

  cardDetails: { padding: 16 },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  serviceName: {
    fontSize: 18,

    color: theme.colors.textPrimary,
    flex: 1,
  },
  ratingBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: theme.colors.background,
    padding: 4,
    borderRadius: 6,
  },
  ratingText: {
    fontSize: 12,

    color: theme.colors.textPrimary,
  },
  serviceDesc: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 6,
    lineHeight: 18,
  },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  priceRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  currentPrice: {
    fontSize: 20,

    color: theme.colors.primary,
  },
  oldPrice: {
    fontSize: 14,
    color: theme.colors.textMuted,
    textDecorationLine: "line-through",
  },
  bookingStats: { fontSize: 12, color: theme.colors.textMuted, marginTop: 2 },
  bookBtn: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
  },
  bookBtnText: { color: "#fff", fontSize: 14 },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  bottomSheet: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 12,
  },
  sheetHandle: {
    width: 40,
    height: 5,
    backgroundColor: theme.colors.border,
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.textPrimary,
    marginBottom: 20,
  },
  sortOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  sortOptionActive: {
    borderBottomColor: "transparent",
  },
  sortOptionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sortOptionLabel: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  sortOptionLabelActive: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
});
