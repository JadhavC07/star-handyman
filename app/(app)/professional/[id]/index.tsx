import { theme } from "@/src/theme/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, {
  Circle,
  Defs,
  Rect,
  Stop,
  LinearGradient as SvgLinearGradient,
} from "react-native-svg";

const { width: SW } = Dimensions.get("window");
const HERO_H = 260;
const HEADER_THRESHOLD = HERO_H - 60;

// ── Mock data ──────────────────────────────────────────────────────────────
const PROFESSIONAL = {
  id: "1",
  name: "Rajesh Kumar",
  title: "Senior AC & Appliance Expert",
  category: "AC Repair",
  categoryIcon: "thermometer-outline",
  avatar: "https://i.pravatar.cc/200?img=11",
  coverBg: theme.colors.primary,
  rating: 4.9,
  reviews: "2.1K",
  jobs: 2100,
  experience: "6 yrs",
  responseTime: "~10 min",
  completionRate: 98,
  verified: true,
  badge: "Top Rated",
  location: "Nagpur, Maharashtra",
  bio: "Certified AC technician with 6+ years of field experience. Specialised in split AC installation, deep servicing, gas refilling and multi-brand appliance repair. Every job is backed by a 30-day workmanship warranty.",
  skills: [
    "Split AC",
    "Window AC",
    "Gas Refill",
    "Deep Service",
    "Inverter AC",
    "Washing Machine",
  ],
  stats: [
    { label: "Jobs Done", value: "2.1K", icon: "briefcase-outline" },
    { label: "Rating", value: "4.9", icon: "star-outline" },
    { label: "Experience", value: "6 yrs", icon: "time-outline" },
    { label: "Completion", value: "98%", icon: "checkmark-circle-outline" },
  ],
  services: [
    {
      id: "s1",
      name: "AC Deep Service",
      price: 549,
      rating: 4.9,
      duration: "60 min",
    },
    {
      id: "s2",
      name: "AC Gas Refill",
      price: 799,
      rating: 4.8,
      duration: "45 min",
    },
    {
      id: "s3",
      name: "AC Installation",
      price: 699,
      rating: 4.9,
      duration: "90 min",
    },
    {
      id: "s4",
      name: "AC Uninstallation",
      price: 399,
      rating: 4.7,
      duration: "45 min",
    },
  ],
  slots: ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"],
  reviews_list: [
    {
      id: "r1",
      name: "Priya S.",
      avatar: "https://i.pravatar.cc/50?img=5",
      rating: 5,
      date: "2 days ago",
      text: "Rajesh was on time and extremely professional. AC is running perfectly after the service. Highly recommend!",
      tags: ["On Time", "Professional"],
    },
    {
      id: "r2",
      name: "Karan M.",
      avatar: "https://i.pravatar.cc/50?img=12",
      rating: 5,
      date: "1 week ago",
      text: "Best AC technician I've booked. Explained every step clearly and cleaned up after the job.",
      tags: ["Friendly", "Clean Work"],
    },
    {
      id: "r3",
      name: "Neha R.",
      avatar: "https://i.pravatar.cc/50?img=9",
      rating: 4,
      date: "2 weeks ago",
      text: "Good work overall. Gas refill done quickly. Gave useful tips to maintain the AC better.",
      tags: ["Knowledgeable"],
    },
  ],
};

// ── Helpers ────────────────────────────────────────────────────────────────
function Stars({ rating, size = 12 }: { rating: number; size?: number }) {
  return (
    <View style={{ flexDirection: "row", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Ionicons
          key={s}
          name={
            s <= Math.floor(rating)
              ? "star"
              : s - 0.5 <= rating
                ? "star-half"
                : "star-outline"
          }
          size={size}
          color={theme.colors.rating}
        />
      ))}
    </View>
  );
}

function Section({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <View style={ss.section}>
      <View style={ss.sectionHeader}>
        <Text style={ss.sectionTitle}>{title}</Text>
        {action}
      </View>
      {children}
    </View>
  );
}

// ── Screen ─────────────────────────────────────────────────────────────────
export default function ProfessionalDetailScreen() {
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const headerBg = scrollY.interpolate({
    inputRange: [HEADER_THRESHOLD - 40, HEADER_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });
  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [HEADER_THRESHOLD, HEADER_THRESHOLD + 20],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* ── Floating Header ── */}
      <Animated.View style={[ss.floatingHeader, { paddingTop: insets.top }]}>
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            ss.floatingHeaderBg,
            { opacity: headerBg },
          ]}
        />
        <View style={ss.floatingHeaderContent}>
          <TouchableOpacity
            style={ss.headerIconBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Animated.Text
            style={[ss.floatingHeaderTitle, { opacity: headerTitleOpacity }]}
            numberOfLines={1}
          >
            {PROFESSIONAL.name}
          </Animated.Text>
          <TouchableOpacity
            style={ss.headerIconBtn}
            onPress={() => setSaved((v) => !v)}
          >
            <Ionicons
              name={saved ? "bookmark" : "bookmark-outline"}
              size={20}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* ── Scroll Content ── */}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        {/* ── Hero ── */}
        <View style={ss.heroWrap}>
          {/* Gradient background */}
          <Svg
            style={StyleSheet.absoluteFill}
            viewBox={`0 0 ${SW} ${HERO_H}`}
            preserveAspectRatio="none"
          >
            <Defs>
              <SvgLinearGradient
                id="proHero"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <Stop offset="0%" stopColor={theme.colors.primaryDark} />
                <Stop offset="60%" stopColor={theme.colors.primary} />
                <Stop offset="100%" stopColor={theme.colors.primaryLight} />
              </SvgLinearGradient>
            </Defs>
            <Rect width={SW} height={HERO_H} fill="url(#proHero)" />
            <Circle
              cx={SW * 0.85}
              cy="30"
              r="90"
              fill="rgba(255,255,255,0.07)"
            />
            <Circle
              cx="30"
              cy={HERO_H - 10}
              r="70"
              fill="rgba(255,255,255,0.05)"
            />
          </Svg>

          {/* Avatar + identity */}
          <View style={[ss.heroContent, { paddingTop: insets.top + 60 }]}>
            <View style={ss.avatarWrap}>
              <Image source={{ uri: PROFESSIONAL.avatar }} style={ss.avatar} />
              {PROFESSIONAL.verified && (
                <View style={ss.verifiedBadge}>
                  <Ionicons name="checkmark" size={11} color="#fff" />
                </View>
              )}
            </View>

            <Text style={ss.heroName}>{PROFESSIONAL.name}</Text>
            <Text style={ss.heroTitle}>{PROFESSIONAL.title}</Text>

            <View style={ss.heroChips}>
              {/* Category */}
              <View style={ss.heroChip}>
                <Ionicons
                  name={PROFESSIONAL.categoryIcon as any}
                  size={12}
                  color="rgba(255,255,255,0.9)"
                />
                <Text style={ss.heroChipText}>{PROFESSIONAL.category}</Text>
              </View>
              {/* Location */}
              <View style={ss.heroChip}>
                <Ionicons
                  name="location-outline"
                  size={12}
                  color="rgba(255,255,255,0.9)"
                />
                <Text style={ss.heroChipText}>{PROFESSIONAL.location}</Text>
              </View>
              {/* Badge */}
              {PROFESSIONAL.badge && (
                <View style={[ss.heroChip, ss.heroChipBadge]}>
                  <Ionicons
                    name="ribbon-outline"
                    size={12}
                    color={theme.colors.warning}
                  />
                  <Text
                    style={[ss.heroChipText, { color: theme.colors.warning }]}
                  >
                    {PROFESSIONAL.badge}
                  </Text>
                </View>
              )}
            </View>

            {/* Rating row */}
            <View style={ss.heroRatingRow}>
              <Stars rating={PROFESSIONAL.rating} size={14} />
              <Text style={ss.heroRatingNum}>{PROFESSIONAL.rating}</Text>
              <Text style={ss.heroRatingCount}>
                ({PROFESSIONAL.reviews} reviews)
              </Text>
            </View>
          </View>
        </View>

        {/* ── Stats ── */}
        <View style={ss.statsCard}>
          {PROFESSIONAL.stats.map((stat, i) => (
            <React.Fragment key={stat.label}>
              <View style={ss.statItem}>
                <Ionicons
                  name={stat.icon as any}
                  size={18}
                  color={theme.colors.primary}
                />
                <Text style={ss.statValue}>{stat.value}</Text>
                <Text style={ss.statLabel}>{stat.label}</Text>
              </View>
              {i < PROFESSIONAL.stats.length - 1 && (
                <View style={ss.statDivider} />
              )}
            </React.Fragment>
          ))}
        </View>

        {/* ── About ── */}
        <Section title="About">
          <Text style={ss.bioText}>{PROFESSIONAL.bio}</Text>
          {/* Response time + completion */}
          <View style={ss.metaRow}>
            <View style={ss.metaItem}>
              <Ionicons
                name="flash-outline"
                size={15}
                color={theme.colors.success}
              />
              <Text style={ss.metaLabel}>Responds in</Text>
              <Text style={ss.metaValue}>{PROFESSIONAL.responseTime}</Text>
            </View>
            <View style={ss.metaDivider} />
            <View style={ss.metaItem}>
              <Ionicons
                name="checkmark-done-outline"
                size={15}
                color={theme.colors.primary}
              />
              <Text style={ss.metaLabel}>Completion</Text>
              <Text style={ss.metaValue}>{PROFESSIONAL.completionRate}%</Text>
            </View>
          </View>
        </Section>

        {/* ── Skills ── */}
        <Section title="Skills & Expertise">
          <View style={ss.skillsWrap}>
            {PROFESSIONAL.skills.map((skill) => (
              <View key={skill} style={ss.skillChip}>
                <Text style={ss.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </Section>

        {/* ── Services Offered ── */}
        <Section title="Services Offered">
          <View style={ss.servicesList}>
            {PROFESSIONAL.services.map((svc) => (
              <TouchableOpacity
                key={svc.id}
                style={ss.serviceRow}
                activeOpacity={0.8}
                onPress={() => router.push(`/service-detail?id=${svc.id}`)}
              >
                <View style={ss.serviceLeft}>
                  <Text style={ss.serviceName}>{svc.name}</Text>
                  <View style={ss.serviceMetaRow}>
                    <Ionicons
                      name="star"
                      size={11}
                      color={theme.colors.rating}
                    />
                    <Text style={ss.serviceMeta}>{svc.rating}</Text>
                    <View style={ss.dot} />
                    <Ionicons
                      name="time-outline"
                      size={11}
                      color={theme.colors.textMuted}
                    />
                    <Text style={ss.serviceMeta}>{svc.duration}</Text>
                  </View>
                </View>
                <View style={ss.serviceRight}>
                  <Text style={ss.servicePrice}>₹{svc.price}</Text>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={theme.colors.textMuted}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Section>

        {/* ── Pick a Slot ── */}
        <Section title="Pick a Time Slot">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={ss.slotsScroll}
          >
            {PROFESSIONAL.slots.map((slot) => {
              const active = selectedSlot === slot;
              return (
                <TouchableOpacity
                  key={slot}
                  style={[ss.slotChip, active && ss.slotChipActive]}
                  onPress={() => setSelectedSlot(slot)}
                >
                  <Ionicons
                    name="time-outline"
                    size={14}
                    color={active ? "#fff" : theme.colors.textSecondary}
                  />
                  <Text style={[ss.slotText, active && ss.slotTextActive]}>
                    {slot}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Section>

        {/* ── Reviews ── */}
        <Section
          title={`Reviews (${PROFESSIONAL.reviews})`}
          action={
            <TouchableOpacity>
              <Text style={ss.seeAll}>See All</Text>
            </TouchableOpacity>
          }
        >
          {/* Rating summary card */}
          <View style={ss.ratingCard}>
            <View style={ss.ratingCardLeft}>
              <Svg
                style={StyleSheet.absoluteFill}
                viewBox="0 0 110 90"
                preserveAspectRatio="none"
              >
                <Defs>
                  <SvgLinearGradient
                    id="rg"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <Stop offset="0%" stopColor={theme.colors.primary} />
                    <Stop offset="100%" stopColor={theme.colors.primaryLight} />
                  </SvgLinearGradient>
                </Defs>
                <Rect width="110" height="90" rx="12" fill="url(#rg)" />
                <Circle cx="95" cy="10" r="35" fill="rgba(255,255,255,0.08)" />
              </Svg>
              <Text style={ss.ratingBig}>{PROFESSIONAL.rating}</Text>
              <Stars rating={PROFESSIONAL.rating} size={13} />
              <Text style={ss.ratingTotal}>{PROFESSIONAL.reviews} ratings</Text>
            </View>
            <View style={ss.ratingBars}>
              {[5, 4, 3, 2, 1].map((star) => {
                const pcts: Record<number, number> = {
                  5: 74,
                  4: 17,
                  3: 5,
                  2: 2,
                  1: 2,
                };
                const pct = pcts[star];
                return (
                  <View key={star} style={ss.ratingBarRow}>
                    <Text style={ss.ratingBarLabel}>{star}</Text>
                    <Ionicons
                      name="star"
                      size={10}
                      color={theme.colors.rating}
                    />
                    <View style={ss.ratingBarTrack}>
                      <View style={[ss.ratingBarFill, { width: `${pct}%` }]} />
                    </View>
                    <Text style={ss.ratingBarPct}>{pct}%</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Review cards */}
          <View style={ss.reviewsList}>
            {PROFESSIONAL.reviews_list.map((rev) => (
              <View key={rev.id} style={ss.reviewCard}>
                <View style={ss.reviewTop}>
                  <Image source={{ uri: rev.avatar }} style={ss.reviewAvatar} />
                  <View style={{ flex: 1 }}>
                    <Text style={ss.reviewName}>{rev.name}</Text>
                    <View style={ss.reviewMeta}>
                      <Stars rating={rev.rating} size={11} />
                      <Text style={ss.reviewDate}>{rev.date}</Text>
                    </View>
                  </View>
                </View>
                <Text style={ss.reviewText}>{rev.text}</Text>
                <View style={ss.reviewTags}>
                  {rev.tags.map((t) => (
                    <View key={t} style={ss.reviewTag}>
                      <Text style={ss.reviewTagText}>{t}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </Section>
      </Animated.ScrollView>

      {/* ── Sticky CTA ── */}
      <View style={[ss.stickyFooter, { paddingBottom: insets.bottom + 10 }]}>
        <TouchableOpacity style={ss.chatBtn}>
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={20}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[ss.bookBtn, !selectedSlot && ss.bookBtnDisabled]}
          activeOpacity={0.88}
          onPress={() => router.push("/RequestServiceScreen")}
        >
          <Text style={ss.bookBtnText}>
            {selectedSlot
              ? `Book for ${selectedSlot}`
              : "Select a Slot to Book"}
          </Text>
          {selectedSlot && (
            <Ionicons name="arrow-forward" size={16} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────
const ss = StyleSheet.create({
  // Floating header
  floatingHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  floatingHeaderBg: { backgroundColor: theme.colors.primaryDark },
  floatingHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(0,0,0,0.28)",
    alignItems: "center",
    justifyContent: "center",
  },
  floatingHeaderTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 15,
    fontFamily: theme.fonts.subheading,
    color: "#fff",
    marginHorizontal: 8,
  },

  // Hero
  heroWrap: {
    height: HERO_H,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  heroContent: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 6,
  },
  avatarWrap: { position: "relative", marginBottom: 4 },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.35)",
  },
  verifiedBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: theme.colors.success,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  heroName: {
    fontSize: 22,
    fontFamily: theme.fonts.heading,
    color: "#fff",
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  heroTitle: {
    fontSize: 13,
    fontFamily: theme.fonts.body,
    color: "rgba(255,255,255,0.82)",
    textAlign: "center",
  },
  heroChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    justifyContent: "center",
    marginTop: 2,
  },
  heroChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  heroChipBadge: {
    backgroundColor: "rgba(250,204,21,0.12)",
    borderColor: "rgba(250,204,21,0.35)",
  },
  heroChipText: {
    fontSize: 11.5,
    fontFamily: theme.fonts.bodyMedium,
    color: "rgba(255,255,255,0.92)",
  },
  heroRatingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  heroRatingNum: {
    fontSize: 14,
    fontFamily: theme.fonts.heading,
    color: "#fff",
  },
  heroRatingCount: {
    fontSize: 12,
    fontFamily: theme.fonts.body,
    color: "rgba(255,255,255,0.7)",
  },

  // Stats
  statsCard: {
    flexDirection: "row",
    backgroundColor: theme.colors.surface,
    marginTop: 0,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  statItem: { flex: 1, alignItems: "center", gap: 4 },
  statValue: {
    fontSize: 16,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: theme.fonts.body,
    color: theme.colors.textMuted,
  },
  statDivider: { width: 1, backgroundColor: theme.colors.border },

  // Section
  section: {
    backgroundColor: theme.colors.surface,
    marginTop: 8,
    padding: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
    gap: 14,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
  },
  seeAll: {
    fontSize: 13,
    color: theme.colors.primary,
    fontFamily: theme.fonts.bodyMedium,
  },

  // About
  bioText: {
    fontSize: 14,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
  metaRow: {
    flexDirection: "row",
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: "hidden",
  },
  metaItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: 12,
  },
  metaDivider: { width: 1, backgroundColor: theme.colors.border },
  metaLabel: {
    fontSize: 12,
    fontFamily: theme.fonts.body,
    color: theme.colors.textMuted,
  },
  metaValue: {
    fontSize: 13,
    fontFamily: theme.fonts.subheading,
    color: theme.colors.textPrimary,
  },

  // Skills
  skillsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  skillChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: theme.colors.primarySubtle,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.primaryLight + "40",
  },
  skillText: {
    fontSize: 12.5,
    fontFamily: theme.fonts.bodyMedium,
    color: theme.colors.primary,
  },

  // Services
  servicesList: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    overflow: "hidden",
  },
  serviceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
    backgroundColor: theme.colors.surface,
  },
  serviceLeft: { gap: 4 },
  serviceName: {
    fontSize: 14,
    fontFamily: theme.fonts.subheading,
    color: theme.colors.textPrimary,
  },
  serviceMetaRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  serviceMeta: {
    fontSize: 11.5,
    fontFamily: theme.fonts.body,
    color: theme.colors.textMuted,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: theme.colors.border,
  },
  serviceRight: { flexDirection: "row", alignItems: "center", gap: 4 },
  servicePrice: {
    fontSize: 15,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
  },

  // Slots
  slotsScroll: { gap: 10, paddingRight: 4 },
  slotChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  slotChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  slotText: {
    fontSize: 13,
    fontFamily: theme.fonts.bodyMedium,
    color: theme.colors.textSecondary,
  },
  slotTextActive: { color: "#fff" },

  // Rating summary
  ratingCard: { flexDirection: "row", gap: 14 },
  ratingCardLeft: {
    width: 110,
    height: 90,
    borderRadius: 12,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  ratingBig: {
    fontSize: 28,
    fontFamily: theme.fonts.heading,
    color: "#fff",
  },
  ratingTotal: {
    fontSize: 10,
    color: "rgba(255,255,255,0.8)",
    fontFamily: theme.fonts.body,
  },
  ratingBars: { flex: 1, gap: 5, justifyContent: "center" },
  ratingBarRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  ratingBarLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontFamily: theme.fonts.body,
    width: 10,
    textAlign: "right",
  },
  ratingBarTrack: {
    flex: 1,
    height: 6,
    backgroundColor: theme.colors.border,
    borderRadius: 3,
    overflow: "hidden",
  },
  ratingBarFill: {
    height: "100%",
    backgroundColor: theme.colors.rating,
    borderRadius: 3,
  },
  ratingBarPct: {
    fontSize: 10,
    color: theme.colors.textMuted,
    fontFamily: theme.fonts.body,
    width: 26,
  },

  // Reviews
  reviewsList: { gap: 12 },
  reviewCard: {
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    padding: 13,
    gap: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  reviewTop: { flexDirection: "row", gap: 10, alignItems: "center" },
  reviewAvatar: { width: 38, height: 38, borderRadius: 19 },
  reviewName: {
    fontSize: 13.5,
    fontFamily: theme.fonts.subheading,
    color: theme.colors.textPrimary,
  },
  reviewMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 2,
  },
  reviewDate: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontFamily: theme.fonts.body,
  },
  reviewText: {
    fontSize: 13,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    lineHeight: 19,
  },
  reviewTags: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  reviewTag: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    backgroundColor: theme.colors.primaryLight + "18",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colors.primaryLight + "40",
  },
  reviewTagText: {
    fontSize: 11,
    color: theme.colors.primary,
    fontFamily: theme.fonts.bodyMedium,
  },

  // Sticky footer
  stickyFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 10,
  },
  chatBtn: {
    width: 46,
    height: 46,
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primarySubtle,
  },
  bookBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
  },
  bookBtnDisabled: { backgroundColor: theme.colors.primaryLight },
  bookBtnText: {
    fontSize: 14,
    color: "#fff",
    fontFamily: theme.fonts.subheading,
  },
});
