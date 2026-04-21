import { theme } from "@/src/theme/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const { width: SW } = Dimensions.get("window");

// ── Mock data — replace with API ──
const ALL_PROFESSIONALS = [
  {
    id: "1",
    name: "Rajesh Kumar",
    service: "AC Repair",
    category: "AC",
    rating: 4.9,
    jobs: 2100,
    avatar: "https://i.pravatar.cc/80?img=11",
    experience: "6 yrs",
    verified: true,
    badge: "Top Rated",
  },
  {
    id: "2",
    name: "Priya Sharma",
    service: "Salon & Spa",
    category: "Salon",
    rating: 4.8,
    jobs: 1800,
    avatar: "https://i.pravatar.cc/80?img=5",
    experience: "4 yrs",
    verified: true,
    badge: "Popular",
  },
  {
    id: "3",
    name: "Anil Mehra",
    service: "Plumbing",
    category: "Plumbing",
    rating: 4.9,
    jobs: 3200,
    avatar: "https://i.pravatar.cc/80?img=15",
    experience: "8 yrs",
    verified: true,
    badge: "Top Rated",
  },
  {
    id: "4",
    name: "Neha Rajput",
    service: "Cleaning",
    category: "Cleaning",
    rating: 4.7,
    jobs: 1400,
    avatar: "https://i.pravatar.cc/80?img=9",
    experience: "3 yrs",
    verified: true,
    badge: null,
  },
  {
    id: "5",
    name: "Suresh Patel",
    service: "Electrician",
    category: "Electric",
    rating: 4.8,
    jobs: 2700,
    avatar: "https://i.pravatar.cc/80?img=12",
    experience: "7 yrs",
    verified: true,
    badge: "Popular",
  },
  {
    id: "6",
    name: "Kavita Joshi",
    service: "Salon & Spa",
    category: "Salon",
    rating: 4.9,
    jobs: 980,
    avatar: "https://i.pravatar.cc/80?img=20",
    experience: "5 yrs",
    verified: true,
    badge: "Top Rated",
  },
  {
    id: "7",
    name: "Dinesh Yadav",
    service: "Carpentry",
    category: "Carpentry",
    rating: 4.6,
    jobs: 760,
    avatar: "https://i.pravatar.cc/80?img=33",
    experience: "9 yrs",
    verified: false,
    badge: null,
  },
  {
    id: "8",
    name: "Meena Verma",
    service: "Cleaning",
    category: "Cleaning",
    rating: 4.8,
    jobs: 1150,
    avatar: "https://i.pravatar.cc/80?img=44",
    experience: "2 yrs",
    verified: true,
    badge: null,
  },
  {
    id: "9",
    name: "Rohit Gupta",
    service: "AC Repair",
    category: "AC",
    rating: 4.7,
    jobs: 1900,
    avatar: "https://i.pravatar.cc/80?img=52",
    experience: "5 yrs",
    verified: true,
    badge: "Popular",
  },
  {
    id: "10",
    name: "Anita Desai",
    service: "Massage",
    category: "Massage",
    rating: 4.9,
    jobs: 630,
    avatar: "https://i.pravatar.cc/80?img=47",
    experience: "4 yrs",
    verified: true,
    badge: "Top Rated",
  },
  {
    id: "11",
    name: "Manoj Singh",
    service: "Plumbing",
    category: "Plumbing",
    rating: 4.5,
    jobs: 2400,
    avatar: "https://i.pravatar.cc/80?img=60",
    experience: "10 yrs",
    verified: false,
    badge: null,
  },
  {
    id: "12",
    name: "Sunita Bhatt",
    service: "Water Purifier",
    category: "Water",
    rating: 4.7,
    jobs: 540,
    avatar: "https://i.pravatar.cc/80?img=25",
    experience: "3 yrs",
    verified: true,
    badge: null,
  },
];

const FILTERS = [
  { id: "all", label: "All" },
  { id: "AC", label: "AC Repair" },
  { id: "Salon", label: "Salon & Spa" },
  { id: "Plumbing", label: "Plumbing" },
  { id: "Cleaning", label: "Cleaning" },
  { id: "Electric", label: "Electrician" },
  { id: "Carpentry", label: "Carpentry" },
  { id: "Massage", label: "Massage" },
  { id: "Water", label: "Water" },
];

const SORT_OPTIONS = [
  { id: "rating", label: "Top Rated" },
  { id: "jobs", label: "Most Jobs" },
  { id: "name", label: "Name A–Z" },
];

const formatJobs = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1)}K` : `${n}`;

const badgeColor: Record<string, { bg: string; text: string }> = {
  "Top Rated": { bg: theme.colors.primarySubtle, text: theme.colors.primary },
  Popular: { bg: theme.colors.secondarySubtle, text: theme.colors.secondary },
};

export default function TopProfessionalsScreen() {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [activeFilter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"rating" | "jobs" | "name">("rating");
  const [sortOpen, setSortOpen] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  // Header shadow on scroll
  const headerElevation = scrollY.interpolate({
    inputRange: [0, 20],
    outputRange: [0, 0.1],
    extrapolate: "clamp",
  });

  const filtered = useMemo(() => {
    let list = ALL_PROFESSIONALS;

    if (activeFilter !== "all")
      list = list.filter((p) => p.category === activeFilter);

    if (search.trim())
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.service.toLowerCase().includes(search.toLowerCase()),
      );

    list = [...list].sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "jobs") return b.jobs - a.jobs;
      return a.name.localeCompare(b.name);
    });

    return list;
  }, [activeFilter, search, sortBy]);

  const activeSortLabel = SORT_OPTIONS.find((s) => s.id === sortBy)?.label;

  const renderCard = ({ item: pro, index }: any) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.82}
      onPress={() => router.push(`/professional/${pro.id}`)}
    >
      {/* Left: Avatar + verified badge */}
      <View style={styles.cardLeft}>
        <View style={styles.avatarWrap}>
          <Image source={{ uri: pro.avatar }} style={styles.avatar} />
          {pro.verified && (
            <View style={styles.verifiedBadge}>
              <Ionicons
                name="checkmark"
                size={9}
                color={theme.colors.surface}
              />
            </View>
          )}
        </View>
      </View>

      {/* Center: Info */}
      <View style={styles.cardBody}>
        <View style={styles.nameRow}>
          <Text style={styles.proName} numberOfLines={1}>
            {pro.name}
          </Text>
          {pro.badge && (
            <View
              style={[
                styles.badgePill,
                { backgroundColor: badgeColor[pro.badge]?.bg },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  { color: badgeColor[pro.badge]?.text },
                ]}
              >
                {pro.badge}
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.proService}>{pro.service}</Text>

        <View style={styles.metaRow}>
          {/* Rating */}
          <View style={styles.metaChip}>
            <Ionicons name="star" size={11} color={theme.colors.rating} />
            <Text style={styles.metaValue}>{pro.rating}</Text>
          </View>

          <View style={styles.metaDot} />

          {/* Jobs */}
          <View style={styles.metaChip}>
            <Ionicons
              name="briefcase-outline"
              size={11}
              color={theme.colors.textMuted}
            />
            <Text style={styles.metaValue}>{formatJobs(pro.jobs)} jobs</Text>
          </View>

          <View style={styles.metaDot} />

          {/* Experience */}
          <View style={styles.metaChip}>
            <Ionicons
              name="time-outline"
              size={11}
              color={theme.colors.textMuted}
            />
            <Text style={styles.metaValue}>{pro.experience}</Text>
          </View>
        </View>
      </View>

      {/* Right: Book CTA */}
      <TouchableOpacity style={styles.bookBtn} activeOpacity={0.85}>
        <Text style={styles.bookBtnText}>Book</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* ── Header ── */}
      <Animated.View
        style={[styles.header, { shadowOpacity: headerElevation }]}
      >
        {/* Back + Title */}
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={20}
              color={theme.colors.textPrimary}
            />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Top Professionals</Text>
            <Text style={styles.headerSub}>
              {filtered.length} available near you
            </Text>
          </View>
          {/* Sort Button */}
          <TouchableOpacity
            style={styles.sortBtn}
            onPress={() => setSortOpen((v) => !v)}
            activeOpacity={0.8}
          >
            <Ionicons
              name="funnel-outline"
              size={14}
              color={theme.colors.primary}
            />
            <Text style={styles.sortBtnText}>{activeSortLabel}</Text>
            <Ionicons
              name={sortOpen ? "chevron-up" : "chevron-down"}
              size={12}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Sort Dropdown */}
        {sortOpen && (
          <View style={styles.sortDropdown}>
            {SORT_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.id}
                style={[
                  styles.sortOption,
                  sortBy === opt.id && styles.sortOptionActive,
                ]}
                onPress={() => {
                  setSortBy(opt.id as any);
                  setSortOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.sortOptionText,
                    sortBy === opt.id && styles.sortOptionTextActive,
                  ]}
                >
                  {opt.label}
                </Text>
                {sortBy === opt.id && (
                  <Ionicons
                    name="checkmark"
                    size={14}
                    color={theme.colors.primary}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Search bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={17} color={theme.colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search professionals or services..."
            placeholderTextColor={theme.colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons
                name="close-circle"
                size={17}
                color={theme.colors.textMuted}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f.id}
              style={[
                styles.filterChip,
                activeFilter === f.id && styles.filterChipActive,
              ]}
              onPress={() => setFilter(f.id)}
              activeOpacity={0.75}
            >
              <Text
                style={[
                  styles.filterChipText,
                  activeFilter === f.id && styles.filterChipTextActive,
                ]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      {/* ── List ── */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        contentContainerStyle={[
          styles.listContent,
          filtered.length === 0 && styles.listEmpty,
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons
              name="search-outline"
              size={48}
              color={theme.colors.border}
            />
            <Text style={styles.emptyTitle}>No professionals found</Text>
            <Text style={styles.emptySub}>
              Try adjusting your search or filter
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background },

  // ── Header ──
  header: {
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 3 },
    // shadowRadius: 6,
    // elevation: 4,
    zIndex: 10,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
  },
  headerSub: {
    fontSize: 12,
    fontFamily: theme.fonts.body,
    color: theme.colors.textMuted,
    marginTop: 1,
  },

  // Sort
  sortBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: theme.colors.primarySubtle,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: theme.radius.full,
  },
  sortBtnText: {
    fontSize: 12,
    fontFamily: theme.fonts.bodyMedium,
    color: theme.colors.primary,
  },
  sortDropdown: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: "hidden",
    ...theme.shadows.medium,
  },
  sortOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  sortOptionActive: { backgroundColor: theme.colors.primarySubtle },
  sortOptionText: {
    fontSize: 14,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
  },
  sortOptionTextActive: {
    fontFamily: theme.fonts.bodyMedium,
    color: theme.colors.primary,
  },

  // Search
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surfaceAlt,
    marginHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
    gap: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: theme.fonts.body,
    color: theme.colors.textPrimary,
    padding: 0,
  },

  // Filter chips
  filterRow: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm,
    paddingBottom: theme.spacing.xs,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surfaceAlt,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterChipText: {
    fontSize: 12.5,
    fontFamily: theme.fonts.bodyMedium,
    color: theme.colors.textSecondary,
  },
  filterChipTextActive: {
    color: theme.colors.surface,
  },

  // ── List ──
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: 100,
  },
  listEmpty: {
    flex: 1,
  },

  // ── Card ──
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    gap: theme.spacing.md,
    ...theme.shadows.small,
  },
  cardLeft: {},
  avatarWrap: { position: "relative" },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.border,
  },
  verifiedBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.success,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: theme.colors.surface,
  },

  cardBody: { flex: 1, gap: 3 },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    flexWrap: "wrap",
  },
  proName: {
    fontSize: 14.5,
    fontFamily: theme.fonts.subheading,
    color: theme.colors.textPrimary,
    flexShrink: 1,
  },
  badgePill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: theme.radius.full,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: theme.fonts.bodyMedium,
  },
  proService: {
    fontSize: 12.5,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    flexWrap: "wrap",
    gap: 4,
  },
  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  metaValue: {
    fontSize: 11.5,
    fontFamily: theme.fonts.body,
    color: theme.colors.textMuted,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: theme.colors.border,
  },

  // Book CTA
  bookBtn: {
    backgroundColor: theme.colors.primarySubtle,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.primaryLight,
  },
  bookBtnText: {
    fontSize: 13,
    fontFamily: theme.fonts.subheading,
    color: theme.colors.primary,
  },

  // Empty
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: theme.spacing.sm,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: theme.fonts.subheading,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
  emptySub: {
    fontSize: 13,
    fontFamily: theme.fonts.body,
    color: theme.colors.textMuted,
  },
});
