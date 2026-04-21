import { theme } from "@/src/theme/theme";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
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
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Svg, {
  Circle,
  Defs,
  Rect,
  Stop,
  LinearGradient as SvgLinearGradient,
} from "react-native-svg";

const { width: SW } = Dimensions.get("window");
const IMG_H = 280;
const HEADER_SCROLL_THRESHOLD = IMG_H - 60;

const SERVICE = {
  id: "1",
  name: "Leaky Faucet Repair",
  category: "Plumbing",
  categoryIcon: "water-outline",
  desc: "Our expert plumbers fix dripping taps, joint leaks, pipe bursts and water seepage. We carry all standard fittings so most jobs are resolved in a single visit. Enjoy hassle-free service with a 30-day workmanship warranty.",
  price: 50,
  originalPrice: 70,
  rating: 4.9,
  reviews: "12.4K",
  bookings: "8.2K",
  duration: "45–60 min",
  badge: "Best Value",
  badgeColor: "#16A34A",
  image:
    "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&h=560&fit=crop",
  warranty: "30-day warranty",
  slots: ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"],
  includes: [
    {
      icon: "checkmark-circle",
      color: "#16A34A",
      label: "All materials included",
    },
    {
      icon: "shield-checkmark",
      color: "#2563EB",
      label: "30-day workmanship warranty",
    },
    {
      icon: "person",
      color: "#7C3AED",
      label: "Verified & background-checked pro",
    },
    { icon: "time", color: "#F97316", label: "On-time or we reschedule free" },
    { icon: "leaf", color: "#0891B2", label: "Eco-safe cleaning products" },
  ],
  steps: [
    {
      step: 1,
      title: "Book & Confirm",
      desc: "Pick a time slot. Get instant confirmation.",
    },
    {
      step: 2,
      title: "Pro Arrives",
      desc: "Verified professional arrives on time.",
    },
    { step: 3, title: "Service Done", desc: "Job completed, area cleaned up." },
    { step: 4, title: "Rate & Pay", desc: "Pay after you're satisfied." },
  ],
  professionals: [
    {
      id: "1",
      name: "Rajesh K.",
      rating: 4.9,
      jobs: "2.1K",
      avatar: "https://i.pravatar.cc/80?img=11",
      badge: "Top Pro",
    },
    {
      id: "2",
      name: "Anil M.",
      rating: 4.8,
      jobs: "1.8K",
      avatar: "https://i.pravatar.cc/80?img=15",
      badge: null,
    },
    {
      id: "3",
      name: "Suresh P.",
      rating: 4.7,
      jobs: "1.2K",
      avatar: "https://i.pravatar.cc/80?img=20",
      badge: null,
    },
  ],
  reviews_list: [
    {
      id: "1",
      name: "Priya S.",
      avatar: "https://i.pravatar.cc/50?img=5",
      rating: 5,
      date: "2 days ago",
      text: "Very professional, fixed the leak in 20 minutes. Area was clean when he left. Would book again!",
      tags: ["On Time", "Clean Work"],
    },
    {
      id: "2",
      name: "Karan M.",
      avatar: "https://i.pravatar.cc/50?img=12",
      rating: 5,
      date: "1 week ago",
      text: "Excellent service. The pro explained what was wrong before starting. Fair pricing.",
      tags: ["Friendly", "Professional"],
    },
    {
      id: "3",
      name: "Neha R.",
      avatar: "https://i.pravatar.cc/50?img=9",
      rating: 4,
      date: "2 weeks ago",
      text: "Good work overall. Arrived 10 min late but informed me in advance. Problem solved.",
      tags: ["Clean Work"],
    },
  ],
  faqs: [
    {
      q: "Do I need to provide any tools or materials?",
      a: "No — the professional brings all required tools and standard materials. You only pay the listed price.",
    },
    {
      q: "What if the problem isn't fixed on the first visit?",
      a: "We offer a 30-day warranty. If the same issue recurs, we'll send a pro at no extra charge.",
    },
    {
      q: "Can I schedule for the same day?",
      a: "Yes! Same-day slots are available based on professional availability in your area.",
    },
  ],
};

// ─── Helpers ───────────────────────────────────────────────────────────────
function Stars({ rating, size = 13 }: { rating: number; size?: number }) {
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

// ─── Section wrapper ───────────────────────────────────────────────────────
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

// ─── Collapsible FAQ item ──────────────────────────────────────────────────
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <TouchableOpacity
      style={ss.faqItem}
      onPress={() => setOpen((v) => !v)}
      activeOpacity={0.75}
    >
      <View style={ss.faqRow}>
        <Text style={ss.faqQ}>{q}</Text>
        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={16}
          color={theme.colors.textMuted}
        />
      </View>
      {open && <Text style={ss.faqA}>{a}</Text>}
    </TouchableOpacity>
  );
}

export default function ServiceDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [bookmarked, setBookmarked] = useState(false);

  const discount = Math.round(
    ((SERVICE.originalPrice - SERVICE.price) / SERVICE.originalPrice) * 100,
  );

  // Animated header opacity
  const headerBg = scrollY.interpolate({
    inputRange: [HEADER_SCROLL_THRESHOLD - 40, HEADER_SCROLL_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });
  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [HEADER_SCROLL_THRESHOLD, HEADER_SCROLL_THRESHOLD + 20],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      edges={["bottom","top"]}
    >
      {/* ── Floating animated header ── */}
      <Animated.View
        style={[ss.floatingHeader, { paddingTop: insets.top, opacity: 1 }]}
      >
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
            {SERVICE.name}
          </Animated.Text>
          <TouchableOpacity
            style={ss.headerIconBtn}
            onPress={() => setBookmarked((v) => !v)}
          >
            <Ionicons
              name={bookmarked ? "bookmark" : "bookmark-outline"}
              size={20}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* ── Scrollable content ── */}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        {/* ── Hero Image ── */}
        <View style={ss.heroWrap}>
          <Image source={{ uri: SERVICE.image }} style={ss.heroImage} />
          {/* gradient overlay */}
          <Svg
            style={StyleSheet.absoluteFill}
            viewBox="0 0 400 280"
            preserveAspectRatio="none"
          >
            <Defs>
              <SvgLinearGradient id="heroD" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#000" stopOpacity="0.35" />
                <Stop offset="50%" stopColor="transparent" stopOpacity="0" />
                <Stop offset="100%" stopColor="#000" stopOpacity="0.55" />
              </SvgLinearGradient>
            </Defs>
            <Rect width="400" height="280" fill="url(#heroD)" />
          </Svg>

          {/* Badge */}
          {SERVICE.badge && (
            <View
              style={[ss.heroBadge, { backgroundColor: SERVICE.badgeColor }]}
            >
              <Text style={ss.heroBadgeText}>{SERVICE.badge}</Text>
            </View>
          )}

          {/* Bottom-left: price */}
          <View style={ss.heroBottom}>
            <View style={ss.heroPrice}>
              <Text style={ss.heroPriceMain}>${SERVICE.price}</Text>
              <Text style={ss.heroPriceOrig}>${SERVICE.originalPrice}</Text>
              <View style={ss.discountPill}>
                <Text style={ss.discountText}>{discount}% off</Text>
              </View>
            </View>
            <View style={ss.heroMeta}>
              <View style={ss.heroMetaChip}>
                <Ionicons
                  name="time-outline"
                  size={12}
                  color="rgba(255,255,255,0.9)"
                />
                <Text style={ss.heroMetaText}>{SERVICE.duration}</Text>
              </View>
              <View style={ss.heroMetaChip}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={12}
                  color="rgba(255,255,255,0.9)"
                />
                <Text style={ss.heroMetaText}>{SERVICE.warranty}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── Title card ── */}
        <View style={ss.titleCard}>
          {/* Category pill */}
          <View style={ss.categoryPill}>
            <Ionicons
              name={SERVICE.categoryIcon as any}
              size={12}
              color={theme.colors.primary}
            />
            <Text style={ss.categoryText}>{SERVICE.category}</Text>
          </View>

          <Text style={ss.serviceName}>{SERVICE.name}</Text>

          {/* Stats row */}
          <View style={ss.statsRow}>
            <View style={ss.statItem}>
              <View style={ss.ratingPill}>
                <Ionicons name="star" size={13} color={theme.colors.rating} />
                <Text style={ss.ratingNum}>{SERVICE.rating}</Text>
              </View>
              <Text style={ss.statSub}>{SERVICE.reviews} reviews</Text>
            </View>
            <View style={ss.statDivider} />
            <View style={ss.statItem}>
              <Text style={ss.statBig}>{SERVICE.bookings}</Text>
              <Text style={ss.statSub}>booked</Text>
            </View>
            <View style={ss.statDivider} />
            <View style={ss.statItem}>
              <Text style={ss.statBig}>{SERVICE.duration}</Text>
              <Text style={ss.statSub}>duration</Text>
            </View>
          </View>

          <Text style={ss.desc}>{SERVICE.desc}</Text>
        </View>

        {/* ── What's included ── */}
        <Section title="What's Included">
          <View style={ss.includesList}>
            {SERVICE.includes.map((inc, i) => (
              <View key={i} style={ss.includeRow}>
                <View
                  style={[
                    ss.includeIconBg,
                    { backgroundColor: inc.color + "15" },
                  ]}
                >
                  <Ionicons
                    name={inc.icon as any}
                    size={16}
                    color={inc.color}
                  />
                </View>
                <Text style={ss.includeLabel}>{inc.label}</Text>
              </View>
            ))}
          </View>
        </Section>

        {/* ── How it works ── */}
        <Section title="How It Works">
          <View style={ss.stepsWrap}>
            {SERVICE.steps.map((s, i) => (
              <View key={s.step} style={ss.stepRow}>
                <View style={ss.stepLeft}>
                  <View style={ss.stepCircle}>
                    <Text style={ss.stepNum}>{s.step}</Text>
                  </View>
                  {i < SERVICE.steps.length - 1 && <View style={ss.stepLine} />}
                </View>
                <View style={ss.stepContent}>
                  <Text style={ss.stepTitle}>{s.title}</Text>
                  <Text style={ss.stepDesc}>{s.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </Section>

        {/* ── Pick a time slot ── */}
        <Section title="Pick a Time Slot">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={ss.slotsScroll}
          >
            {SERVICE.slots.map((slot) => {
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

        {/* ── Available Professionals ── */}
        <Section
          title="Available Professionals"
          action={
            <TouchableOpacity>
              <Text style={ss.seeAll}>See All</Text>
            </TouchableOpacity>
          }
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={ss.prosScroll}
          >
            {SERVICE.professionals.map((pro) => (
              <View key={pro.id} style={ss.proCard}>
                <View style={ss.proAvatarWrap}>
                  <Image source={{ uri: pro.avatar }} style={ss.proAvatar} />
                  {pro.badge && (
                    <View style={ss.proBadge}>
                      <Text style={ss.proBadgeText}>{pro.badge}</Text>
                    </View>
                  )}
                </View>
                <Text style={ss.proName}>{pro.name}</Text>
                <View style={ss.proRatingRow}>
                  <Ionicons name="star" size={11} color={theme.colors.rating} />
                  <Text style={ss.proRating}>{pro.rating}</Text>
                </View>
                <Text style={ss.proJobs}>{pro.jobs} jobs</Text>
              </View>
            ))}
          </ScrollView>
        </Section>

        {/* ── Reviews ── */}
        <Section
          title={`Reviews (${SERVICE.reviews})`}
          action={
            <TouchableOpacity>
              <Text style={ss.seeAll}>See All</Text>
            </TouchableOpacity>
          }
        >
          {/* Rating summary */}
          <View style={ss.ratingCard}>
            <View style={ss.ratingCardLeft}>
              <Svg
                style={StyleSheet.absoluteFill}
                viewBox="0 0 140 80"
                preserveAspectRatio="none"
              >
                <Defs>
                  <SvgLinearGradient
                    id="rG"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <Stop offset="0%" stopColor={theme.colors.primary} />
                    <Stop offset="100%" stopColor={theme.colors.primary} />
                  </SvgLinearGradient>
                </Defs>
                <Rect width="140" height="80" rx="12" fill="url(#rG)" />
                <Circle cx="120" cy="10" r="35" fill="rgba(255,255,255,0.08)" />
              </Svg>
              <Text style={ss.ratingBig}>{SERVICE.rating}</Text>
              <Stars rating={SERVICE.rating} size={14} />
              <Text style={ss.ratingTotal}>{SERVICE.reviews} ratings</Text>
            </View>
            <View style={ss.ratingBars}>
              {[5, 4, 3, 2, 1].map((star) => {
                const pcts = [72, 18, 6, 2, 2];
                const pct = pcts[5 - star];
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
            {SERVICE.reviews_list.map((rev) => (
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

        {/* ── FAQs ── */}
        <Section title="Frequently Asked Questions">
          <View style={ss.faqList}>
            {SERVICE.faqs.map((faq, i) => (
              <React.Fragment key={i}>
                <FAQItem q={faq.q} a={faq.a} />
                {i < SERVICE.faqs.length - 1 && <View style={ss.faqDivider} />}
              </React.Fragment>
            ))}
          </View>
        </Section>
      </Animated.ScrollView>

      {/* ── Sticky CTA ── */}
      <View style={[ss.stickyFooter, { paddingBottom: insets.bottom + 10 }]}>
        <View style={ss.footerPrice}>
          <Text style={ss.footerPriceMain}>${SERVICE.price}</Text>
          <Text style={ss.footerPriceOrig}>${SERVICE.originalPrice}</Text>
        </View>
        <TouchableOpacity
          style={[ss.bookBtn, !selectedSlot && ss.bookBtnDisabled]}
          onPress={() =>
            router.push({
              pathname: "/services/[id]/handymen",
              params: { id },
            })
          }
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
    </SafeAreaView>
  );
}

const ss = StyleSheet.create({
  floatingHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  floatingHeaderBg: {
    backgroundColor: theme.colors.primary,
  },
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
    backgroundColor: "rgba(0,0,0,0.32)",
    alignItems: "center",
    justifyContent: "center",
  },
  floatingHeaderTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 15,
    color: "#fff",
    marginHorizontal: 8,
  },

  // Hero
  heroWrap: { height: IMG_H, position: "relative" },
  heroImage: { width: "100%", height: IMG_H },
  heroBadge: {
    position: "absolute",
    top: 52,
    right: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  heroBadgeText: {
    fontSize: 11,
    color: "#fff",
  },
  heroBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    gap: 8,
  },
  heroPrice: { flexDirection: "row", alignItems: "center", gap: 8 },
  heroPriceMain: {
    fontSize: 28,

    color: "#fff",
  },
  heroPriceOrig: {
    fontSize: 16,
    color: "rgba(255,255,255,0.6)",

    textDecorationLine: "line-through",
    marginTop: 4,
  },
  discountPill: {
    backgroundColor: theme.colors.success,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  discountText: {
    fontSize: 11,
    color: "#fff",
  },
  heroMeta: { flexDirection: "row", gap: 8 },
  heroMetaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(0,0,0,0.38)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  heroMetaText: {
    fontSize: 11.5,
    color: "rgba(255,255,255,0.92)",
  },

  // Title card
  titleCard: {
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    gap: 10,
  },
  categoryPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    alignSelf: "flex-start",
    backgroundColor: theme.colors.primary + "18",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 12,
    color: theme.colors.primary,
  },
  serviceName: {
    fontSize: 22,

    color: theme.colors.textPrimary,
    lineHeight: 30,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    padding: 14,
    gap: 0,
  },
  statItem: { flex: 1, alignItems: "center", gap: 3 },
  statDivider: { width: 1, height: 32, backgroundColor: theme.colors.border },
  ratingPill: { flexDirection: "row", alignItems: "center", gap: 4 },
  ratingNum: {
    fontSize: 15,

    color: "#92400E",
  },
  statBig: {
    fontSize: 15,

    color: theme.colors.textPrimary,
  },
  statSub: {
    fontSize: 11,
    color: theme.colors.textMuted,
  },
  desc: {
    fontSize: 14,

    color: theme.colors.textSecondary,
    lineHeight: 22,
  },

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

    color: theme.colors.textPrimary,
  },
  seeAll: {
    fontSize: 13,
    color: theme.colors.primary,
  },

  // Includes
  includesList: { gap: 10 },
  includeRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  includeIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  includeLabel: {
    fontSize: 14,
    color: theme.colors.textPrimary,
  },

  // Steps
  stepsWrap: { gap: 0 },
  stepRow: { flexDirection: "row", gap: 14 },
  stepLeft: { alignItems: "center", width: 28 },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNum: { fontSize: 13, color: "#fff" },
  stepLine: {
    width: 2,
    flex: 1,
    backgroundColor: theme.colors.primary + "40",
    marginVertical: 4,
    minHeight: 20,
  },
  stepContent: { flex: 1, paddingBottom: 20, gap: 3 },
  stepTitle: {
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  stepDesc: {
    fontSize: 12.5,
    color: theme.colors.textSecondary,
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
    color: theme.colors.textSecondary,
  },
  slotTextActive: { color: "#fff" },

  // Professionals
  prosScroll: { gap: 12, paddingRight: 4 },
  proCard: {
    width: 90,
    backgroundColor: theme.colors.background,
    borderRadius: 14,
    padding: 10,
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  proAvatarWrap: { position: "relative" },
  proAvatar: { width: 54, height: 54, borderRadius: 27 },
  proBadge: {
    position: "absolute",
    bottom: -4,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.background,
    borderRadius: 6,
    paddingVertical: 2,
    alignItems: "center",
  },
  proBadgeText: {
    fontSize: 8.5,
    color: "#fff",
  },
  proName: {
    fontSize: 12,
    color: theme.colors.textPrimary,
    textAlign: "center",
  },
  proRatingRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  proRating: {
    fontSize: 11.5,
    color: "#92400E",
  },
  proJobs: {
    fontSize: 11,
    color: theme.colors.textMuted,
  },

  // Rating summary
  ratingCard: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 4,
  },
  ratingCardLeft: {
    width: 110,
    height: 90,
    borderRadius: 12,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  ratingBig: { fontSize: 28, color: "#fff" },
  ratingTotal: {
    fontSize: 10.5,
    color: "rgba(255,255,255,0.8)",
  },
  ratingBars: { flex: 1, gap: 5, justifyContent: "center" },
  ratingBarRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  ratingBarLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
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
  },
  reviewText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 19,
  },
  reviewTags: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  reviewTag: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    backgroundColor: theme.colors.primary + "18",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colors.primary + "40",
  },
  reviewTagText: {
    fontSize: 11,
    color: theme.colors.primary,
  },

  // FAQ
  faqList: {
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: "hidden",
  },
  faqItem: { padding: 14 },
  faqRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
  },
  faqQ: {
    flex: 1,
    fontSize: 13.5,
    color: theme.colors.textPrimary,
    lineHeight: 20,
  },
  faqA: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginTop: 8,
  },
  faqDivider: { height: 1, backgroundColor: theme.colors.border },

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
    gap: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 10,
  },
  footerPrice: { gap: 1 },
  footerPriceMain: {
    fontSize: 20,
    color: theme.colors.textPrimary,
  },
  footerPriceOrig: {
    fontSize: 12,
    color: theme.colors.textMuted,
    textDecorationLine: "line-through",
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
  bookBtnDisabled: { backgroundColor: theme.colors.primary },
  bookBtnText: {
    fontSize: 14,
    color: "#fff",
  },
});
