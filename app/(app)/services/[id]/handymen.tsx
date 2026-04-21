import { theme } from "@/src/theme/theme";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
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
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const { width: SW } = Dimensions.get("window");


type FilterId =
  | "recommended"
  | "price_low"
  | "price_high"
  | "rating_high"
  | "rating_low"
  | "most_reviews";

interface Handyman {
  id: string;
  name: string;
  avatar: string;
  badge: string | null;
  badgeColor: string | null;
  rating: number;
  reviewCount: number;
  totalJobs: number;
  pricePerHour: number;
  responseTime: string;
  tags: string[];
  isOnline: boolean;
  yearsExp: number;
  completionRate: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────

const SERVICE_SUMMARY = {
  title: "Leaky Faucet Repair",
  category: "Plumbing",
  price: 50,
  image:
    "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=200&h=200&fit=crop",
};

const HANDYMEN: Handyman[] = [
  {
    id: "1",
    name: "Rajesh Kumar",
    avatar: "https://i.pravatar.cc/150?img=11",
    badge: "Top Pro",
    badgeColor: "#F59E0B",
    rating: 4.9,
    reviewCount: 2148,
    totalJobs: 2102,
    pricePerHour: 55,
    responseTime: "~5 min",
    tags: ["Pipe Repair", "Faucet Fix", "Drain Cleaning"],
    isOnline: true,
    yearsExp: 8,
    completionRate: 99,
  },
  {
    id: "2",
    name: "Anil Mehta",
    avatar: "https://i.pravatar.cc/150?img=15",
    badge: "Verified",
    badgeColor: "#3B82F6",
    rating: 4.8,
    reviewCount: 1832,
    totalJobs: 1790,
    pricePerHour: 45,
    responseTime: "~8 min",
    tags: ["Leak Detection", "Water Heater", "Faucet Fix"],
    isOnline: true,
    yearsExp: 6,
    completionRate: 97,
  },
  {
    id: "3",
    name: "Suresh Patil",
    avatar: "https://i.pravatar.cc/150?img=20",
    badge: null,
    badgeColor: null,
    rating: 4.7,
    reviewCount: 1203,
    totalJobs: 1175,
    pricePerHour: 40,
    responseTime: "~12 min",
    tags: ["Pipe Repair", "Drain Cleaning", "Installation"],
    isOnline: false,
    yearsExp: 5,
    completionRate: 96,
  },
  {
    id: "4",
    name: "Vikram Singh",
    avatar: "https://i.pravatar.cc/150?img=33",
    badge: "Rising Star",
    badgeColor: "#8B5CF6",
    rating: 4.6,
    reviewCount: 412,
    totalJobs: 398,
    pricePerHour: 38,
    responseTime: "~3 min",
    tags: ["Faucet Fix", "Pipe Repair", "Emergency"],
    isOnline: true,
    yearsExp: 3,
    completionRate: 98,
  },
  {
    id: "5",
    name: "Mohan Reddy",
    avatar: "https://i.pravatar.cc/150?img=52",
    badge: null,
    badgeColor: null,
    rating: 4.5,
    reviewCount: 876,
    totalJobs: 850,
    pricePerHour: 42,
    responseTime: "~15 min",
    tags: ["Water Heater", "Drain Cleaning", "Leak Detection"],
    isOnline: false,
    yearsExp: 7,
    completionRate: 95,
  },
  {
    id: "6",
    name: "Deepak Joshi",
    avatar: "https://i.pravatar.cc/150?img=61",
    badge: "Verified",
    badgeColor: "#3B82F6",
    rating: 4.4,
    reviewCount: 654,
    totalJobs: 629,
    pricePerHour: 35,
    responseTime: "~10 min",
    tags: ["Installation", "Pipe Repair", "Faucet Fix"],
    isOnline: true,
    yearsExp: 4,
    completionRate: 94,
  },
];

const FILTERS: { id: FilterId; label: string; icon: string }[] = [
  { id: "recommended", label: "Recommended", icon: "ribbon-outline" },
  { id: "price_low", label: "Price ↑", icon: "trending-down-outline" },
  { id: "price_high", label: "Price ↓", icon: "trending-up-outline" },
  { id: "rating_high", label: "Top Rated", icon: "star-outline" },
  { id: "rating_low", label: "Rating ↑", icon: "star-half-outline" },
  { id: "most_reviews", label: "Most Reviews", icon: "chatbubbles-outline" },
];

// ─── Sub-components ────────────────────────────────────────────────────────

function StepIndicator() {
  return (
    <View style={ss.stepWrap}>
      <View style={ss.stepLineBase}>
        <View style={[ss.stepLineFill, { width: "33%" }]} />
      </View>
      <View style={ss.stepDotsRow}>
        {[1, 2, 3].map((s) => (
          <View key={s} style={[ss.stepDot, s === 1 && ss.stepDotActive]}>
            {s === 1 ? (
              <Text style={ss.stepDotTextActive}>{s}</Text>
            ) : (
              <Text style={ss.stepDotText}>{s}</Text>
            )}
          </View>
        ))}
      </View>
      <View style={ss.stepLabels}>
        {["Choose Pro", "Review", "Confirm"].map((l, i) => (
          <Text
            key={l}
            style={[ss.stepLabel, i === 0 && ss.stepLabelActive]}
          >
            {l}
          </Text>
        ))}
      </View>
    </View>
  );
}

function ServiceMiniCard() {
  return (
    <View style={ss.miniCard}>
      <Image source={{ uri: SERVICE_SUMMARY.image }} style={ss.miniImg} />
      <View style={ss.miniInfo}>
        <Text style={ss.miniCategory}>{SERVICE_SUMMARY.category}</Text>
        <Text style={ss.miniTitle}>{SERVICE_SUMMARY.title}</Text>
      </View>
      <View style={ss.miniPriceBox}>
        <Text style={ss.miniPriceLabel}>From</Text>
        <Text style={ss.miniPrice}>${SERVICE_SUMMARY.price}</Text>
      </View>
    </View>
  );
}

function FilterBar({
  active,
  onSelect,
}: {
  active: FilterId;
  onSelect: (id: FilterId) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={ss.filterScroll}
    >
      {FILTERS.map((f) => {
        const isActive = active === f.id;
        return (
          <TouchableOpacity
            key={f.id}
            style={[ss.filterChip, isActive && ss.filterChipActive]}
            onPress={() => onSelect(f.id)}
          >
            <Ionicons
              name={f.icon as any}
              size={13}
              color={isActive ? "#fff" : theme.colors.textSecondary}
            />
            <Text
              style={[ss.filterChipText, isActive && ss.filterChipTextActive]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

function HandymanCard({
  item,
  selected,
  onSelect,
}: {
  item: Handyman;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <TouchableOpacity
      style={[ss.card, selected && ss.cardSelected]}
      activeOpacity={0.92}
      onPress={() => onSelect(item.id)}
    >
      {/* Left border accent when selected */}
      {selected && <View style={ss.cardAccent} />}

      <View style={ss.cardTop}>
        {/* Avatar + online dot */}
        <View style={ss.avatarWrap}>
          <Image source={{ uri: item.avatar }} style={ss.avatar} />
          {item.isOnline && <View style={ss.onlineDot} />}
        </View>

        {/* Info */}
        <View style={ss.cardInfo}>
          <View style={ss.nameRow}>
            <Text style={ss.name} numberOfLines={1}>
              {item.name}
            </Text>
            {item.badge && (
              <View
                style={[
                  ss.badge,
                  { backgroundColor: (item.badgeColor ?? "#888") + "20" },
                ]}
              >
                <Text style={[ss.badgeText, { color: item.badgeColor ?? "#888" }]}>
                  {item.badge}
                </Text>
              </View>
            )}
          </View>

          <View style={ss.metaRow}>
            <Ionicons name="star" size={12} color={theme.colors.rating} />
            <Text style={ss.ratingText}>{item.rating}</Text>
            <Text style={ss.reviewCount}>
              ({item.reviewCount.toLocaleString()})
            </Text>
            <View style={ss.dot} />
            <Text style={ss.jobsText}>{item.totalJobs.toLocaleString()} jobs</Text>
          </View>

          <View style={ss.metaRow}>
            <MaterialCommunityIcons
              name="briefcase-outline"
              size={12}
              color={theme.colors.textMuted}
            />
            <Text style={ss.expText}>{item.yearsExp} yrs exp</Text>
            <View style={ss.dot} />
            <Ionicons
              name="flash-outline"
              size={12}
              color={theme.colors.textMuted}
            />
            <Text style={ss.expText}>{item.responseTime}</Text>
          </View>
        </View>

        {/* Price + radio */}
        <View style={ss.cardRight}>
          <View style={[ss.radio, selected && ss.radioSelected]}>
            {selected && (
              <View style={ss.radioInner} />
            )}
          </View>
          <Text style={ss.priceMain}>${item.pricePerHour}</Text>
          <Text style={ss.priceUnit}>/hr</Text>
        </View>
      </View>

      {/* Tags */}
      <View style={ss.tagsRow}>
        {item.tags.map((tag) => (
          <View key={tag} style={ss.tag}>
            <Text style={ss.tagText}>{tag}</Text>
          </View>
        ))}
      </View>

      {/* Stats strip */}
      <View style={ss.statsStrip}>
        <StatPill
          icon="checkmark-circle-outline"
          color={theme.colors.success}
          label={`${item.completionRate}% completion`}
        />
        <StatPill
          icon={item.isOnline ? "radio-button-on" : "radio-button-off"}
          color={item.isOnline ? theme.colors.success : theme.colors.textMuted}
          label={item.isOnline ? "Online now" : "Offline"}
        />
      </View>
    </TouchableOpacity>
  );
}

function StatPill({
  icon,
  color,
  label,
}: {
  icon: string;
  color: string;
  label: string;
}) {
  return (
    <View style={ss.statPill}>
      <Ionicons name={icon as any} size={13} color={color} />
      <Text style={ss.statPillText}>{label}</Text>
    </View>
  );
}

// ─── Main Screen ───────────────────────────────────────────────────────────

const HandymanSelectionScreen: React.FC = () => {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState<FilterId>("recommended");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const sortedHandymen = useMemo(() => {
    const data = [...HANDYMEN];
    switch (activeFilter) {
      case "recommended":
        // Weighted score: rating × log(reviews) × completionRate
        return data.sort(
          (a, b) =>
            b.rating * Math.log(b.reviewCount) * b.completionRate -
            a.rating * Math.log(a.reviewCount) * a.completionRate,
        );
      case "price_low":
        return data.sort((a, b) => a.pricePerHour - b.pricePerHour);
      case "price_high":
        return data.sort((a, b) => b.pricePerHour - a.pricePerHour);
      case "rating_high":
        return data.sort((a, b) => b.rating - a.rating);
      case "rating_low":
        return data.sort((a, b) => a.rating - b.rating);
      case "most_reviews":
        return data.sort((a, b) => b.reviewCount - a.reviewCount);
      default:
        return data;
    }
  }, [activeFilter]);

  const selectedHandyman = HANDYMEN.find((h) => h.id === selectedId);

  return (
    <SafeAreaView style={ss.safe} edges={["top"]}>
      {/* Header */}
      <View style={ss.header}>
        <TouchableOpacity style={ss.backBtn} onPress={() => router.back()}>
          <Ionicons
            name="chevron-back"
            size={24}
            color={theme.colors.textPrimary}
          />
        </TouchableOpacity>
        <View style={ss.headerCenter}>
          <Text style={ss.headerTitle}>Choose Professional</Text>
          <Text style={ss.headerSub}>Step 1 of 3</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={sortedHandymen}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          ss.listContent,
          { paddingBottom: insets.bottom + 110 },
        ]}
        ListHeaderComponent={
          <>
            <StepIndicator />
            <ServiceMiniCard />

            {/* Section title + filter */}
            <View style={ss.sectionHeader}>
              <View>
                <Text style={ss.sectionTitle}>Available Professionals</Text>
                <Text style={ss.sectionSub}>
                  {HANDYMEN.length} pros near you
                </Text>
              </View>
            </View>

            <FilterBar active={activeFilter} onSelect={setActiveFilter} />

            <View style={{ height: 12 }} />
          </>
        }
        renderItem={({ item }) => (
          <HandymanCard
            item={item}
            selected={selectedId === item.id}
            onSelect={setSelectedId}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />

      {/* Sticky footer */}
      <View style={[ss.footer, { paddingBottom: insets.bottom + 10 }]}>
        {selectedHandyman ? (
          <View style={ss.footerSelected}>
            <Image
              source={{ uri: selectedHandyman.avatar }}
              style={ss.footerAvatar}
            />
            <View style={ss.footerInfo}>
              <Text style={ss.footerName}>{selectedHandyman.name}</Text>
              <Text style={ss.footerMeta}>
                ★ {selectedHandyman.rating} · ${selectedHandyman.pricePerHour}/hr
              </Text>
            </View>
          </View>
        ) : (
          <View style={ss.footerPlaceholder}>
            <Feather
              name="user"
              size={20}
              color={theme.colors.textMuted}
            />
            <Text style={ss.footerPlaceholderText}>No pro selected yet</Text>
          </View>
        )}

        <TouchableOpacity
          style={[ss.continueBtn, !selectedId && ss.continueBtnDisabled]}
          disabled={!selectedId}
          onPress={() =>
            router.push({
              pathname: "/services/[id]/book",
              params: { id: id as string, handymanId: selectedId! },
            })
          }
        >
          <Text style={ss.continueBtnText}>
            {selectedId ? "Confirm & Continue" : "Select a Pro"}
          </Text>
          {selectedId && (
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HandymanSelectionScreen;

// ─── Styles ────────────────────────────────────────────────────────────────

const ss = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.background,
    ...theme.shadows.small,
  },
  headerCenter: { alignItems: "center" },
  headerTitle: {
    fontSize: 17,
    color: theme.colors.textPrimary,
    fontWeight: "600",
  },
  headerSub: { fontSize: 12, color: theme.colors.textMuted, marginTop: 1 },

  listContent: { paddingHorizontal: 16 },

  // Step indicator
  stepWrap: {
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  stepLineBase: {
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    marginHorizontal: 24,
  },
  stepLineFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },
  stepDotsRow: {
    position: "absolute",
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    top: -12,
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  stepDotActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  stepDotText: { fontSize: 12, color: theme.colors.textMuted },
  stepDotTextActive: { fontSize: 12, color: "#fff", fontWeight: "600" },
  stepLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 22,
  },
  stepLabel: {
    fontSize: 11,
    color: theme.colors.textMuted,
    textAlign: "center",
    flex: 1,
  },
  stepLabelActive: {
    color: theme.colors.primary,
    fontWeight: "600",
  },

  // Mini service card
  miniCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: 14,
    padding: 12,
    marginBottom: 20,
    gap: 12,
    ...theme.shadows.small,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  miniImg: { width: 52, height: 52, borderRadius: 10 },
  miniInfo: { flex: 1 },
  miniCategory: {
    fontSize: 11,
    color: theme.colors.primary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontWeight: "600",
  },
  miniTitle: {
    fontSize: 14,
    color: theme.colors.textPrimary,
    fontWeight: "600",
    marginTop: 2,
  },
  miniPriceBox: { alignItems: "flex-end" },
  miniPriceLabel: { fontSize: 10, color: theme.colors.textMuted },
  miniPrice: {
    fontSize: 18,
    color: theme.colors.primary,
    fontWeight: "700",
  },

  // Section header
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    color: theme.colors.textPrimary,
    fontWeight: "600",
  },
  sectionSub: { fontSize: 12, color: theme.colors.textMuted, marginTop: 2 },

  // Filter bar
  filterScroll: { gap: 8, paddingBottom: 4 },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 5,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterChipText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: "500",
  },
  filterChipTextActive: { color: "#fff" },

  // Handyman card
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    gap: 10,
    ...theme.shadows.small,
    overflow: "hidden",
  },
  cardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + "05",
  },
  cardAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: theme.colors.primary,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  cardTop: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  avatarWrap: { position: "relative" },
  avatar: { width: 56, height: 56, borderRadius: 28 },
  onlineDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.success,
    borderWidth: 2,
    borderColor: "#fff",
  },
  cardInfo: { flex: 1, gap: 4 },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  name: {
    fontSize: 15,
    color: theme.colors.textPrimary,
    fontWeight: "600",
  },
  badge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "600",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: theme.colors.textMuted,
  },
  ratingText: {
    fontSize: 12,
    color: "#92400E",
    fontWeight: "600",
  },
  reviewCount: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  jobsText: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  expText: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  cardRight: {
    alignItems: "flex-end",
    gap: 4,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  radioSelected: {
    borderColor: theme.colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primary,
  },
  priceMain: {
    fontSize: 18,
    color: theme.colors.textPrimary,
    fontWeight: "700",
  },
  priceUnit: {
    fontSize: 11,
    color: theme.colors.textMuted,
  },

  // Tags
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  tag: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  tagText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontWeight: "500",
  },

  // Stats strip
  statsStrip: {
    flexDirection: "row",
    gap: 10,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  statPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statPillText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingHorizontal: 16,
    paddingTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    ...theme.shadows.large,
  },
  footerSelected: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  footerAvatar: { width: 40, height: 40, borderRadius: 20 },
  footerInfo: { flex: 1 },
  footerName: {
    fontSize: 14,
    color: theme.colors.textPrimary,
    fontWeight: "600",
  },
  footerMeta: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 1,
  },
  footerPlaceholder: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  footerPlaceholderText: {
    fontSize: 13,
    color: theme.colors.textMuted,
  },
  continueBtn: {
    flex: 1.4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
    height: 52,
    borderRadius: 14,
    gap: 8,
  },
  continueBtnDisabled: {
    backgroundColor: theme.colors.border,
  },
  continueBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});