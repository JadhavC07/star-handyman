import CategoryCard from "@/src/components/home/CategoryCard";
import { OfferBanners } from "@/src/components/home/OfferBanners";
import { ProfessionalCard } from "@/src/components/home/ProfessionalCard";
import { PromoHero } from "@/src/components/home/Promohero";
import ServiceCard from "@/src/components/home/ServiceCard";
import { useCarousels } from "@/src/hooks/carousels/useCarousels";
import { useCategories } from "@/src/hooks/categories/usecategories";
import { useT } from "@/src/hooks/i18n/useLanguage";
import { useServices } from "@/src/hooks/services/useServices";
import { haptic } from "@/src/lib/haptics";
import { theme } from "@/src/theme/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";

const SkeletonRow = React.memo(({ count = 3 }: { count?: number }) => (
  <View style={styles.skeletonRow}>
    {Array.from({ length: count }).map((_, i) => (
      <View key={i} style={styles.skeletonCard} />
    ))}
  </View>
));

SkeletonRow.displayName = "SkeletonRow";

const PROFESSIONALS = [
  {
    id: "1",
    name: "Rajesh K.",
    service: "AC Repair",
    rating: 4.9,
    jobs: "2.1K",
    avatar: "https://i.pravatar.cc/80?img=11",
  },
  {
    id: "2",
    name: "Priya S.",
    service: "Salon & Spa",
    rating: 4.8,
    jobs: "1.8K",
    avatar: "https://i.pravatar.cc/80?img=5",
  },
  {
    id: "3",
    name: "Anil M.",
    service: "Plumbing",
    rating: 4.9,
    jobs: "3.2K",
    avatar: "https://i.pravatar.cc/80?img=15",
  },
  {
    id: "4",
    name: "Neha R.",
    service: "Cleaning",
    rating: 4.7,
    jobs: "1.4K",
    avatar: "https://i.pravatar.cc/80?img=9",
  },
];

type Professional = (typeof PROFESSIONALS)[number];

export default function HomeScreen() {
  const t = useT("home");
  const { data: categories, isLoading: catsLoading } = useCategories();
  const { data: services, isLoading: svcsLoading } = useServices();
  const { data: carousels = [] } = useCarousels();

  const safeCategories = categories || [];
  const safeServices = services || [];

  const handleSearchPress = useCallback(() => {
    haptic.tap();
    router.push("/search");
  }, []);

  const handleBookNowPress = useCallback(() => {
    haptic.press();
  }, []);

  const handleInvitePress = useCallback(() => {
    haptic.press();
  }, []);

  const handleSeeAllPros = useCallback(() => {
    router.push("/professional/top");
  }, []);

  const renderCategory = useCallback(
    ({ item }: { item: (typeof safeCategories)[number] }) => (
      <CategoryCard category={item} />
    ),

    [],
  );

  const renderService = useCallback(
    ({ item }: { item: (typeof safeServices)[number] }) => (
      <ServiceCard {...item} />
    ),
    [],
  );

  const renderProfessional = useCallback(
    ({ item }: { item: Professional }) => <ProfessionalCard pro={item} />,
    [],
  );

  const keyExtractor = useCallback(
    (item: { id: string | number }) => String(item.id),
    [],
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* Top Nav */}
      <View style={styles.topNav}>
        <View>
          <Text style={styles.locationLabel}>{t("header.delivering_to")}</Text>
          <TouchableOpacity style={styles.locationRow}>
            <Ionicons
              name="location-sharp"
              size={15}
              color={theme.colors.primary}
            />
            <Text style={styles.locationText}>Nagpur, Maharashtra</Text>
            <Ionicons
              name="chevron-down"
              size={13}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.headerActionBtn}
          onPress={handleSearchPress}
        >
          <Ionicons name="search" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <Animated.ScrollView showsVerticalScrollIndicator={false}>
        <PromoHero slides={carousels} autoPlayInterval={4000} />

        {/* ── Categories ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t("categories.title")}</Text>
            <TouchableOpacity style={styles.seeAllBtn}>
              <Text style={styles.seeAllText}>{t("categories.see_all")}</Text>
              <Ionicons
                name="chevron-forward"
                size={14}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          </View>

          {catsLoading ? (
            <SkeletonRow count={4} />
          ) : (
            <FlatList
              data={categories}
              keyExtractor={keyExtractor}
              renderItem={renderCategory}
              numColumns={4}
              columnWrapperStyle={styles.catGrid}
              scrollEnabled={false}
            />
          )}
        </View>

        {/* ── Promo Banner ── */}
        <View style={styles.bannerOuter}>
          <View style={styles.promoBanner}>
            <Svg
              style={StyleSheet.absoluteFill}
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <Circle cx="90" cy="10" r="25" fill="rgba(255,255,255,0.08)" />
              <Circle cx="5" cy="90" r="20" fill="rgba(255,255,255,0.05)" />
            </Svg>

            <View style={styles.promoLeft}>
              <View style={styles.iconCircle}>
                <Text style={styles.emojiIcon}>⚡</Text>
              </View>
              <View style={styles.promoTextWrap}>
                <Text style={styles.promoTitle}>{t("promo_banner.title")}</Text>
                <Text style={styles.promoSub} numberOfLines={2}>
                  {t("promo_banner.subtitle").replace(/<\/?highlight>/g, "")}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.promoBtn}
              onPress={handleBookNowPress}
            >
              <Text style={styles.promoBtnText}>{t("promo_banner.cta")}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Most Booked ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t("popular_services.title")}</Text>
          </View>

          {svcsLoading ? (
            <ActivityIndicator
              color={theme.colors.primary}
              style={styles.centeredLoader}
            />
          ) : (
            <FlatList
              data={safeServices}
              horizontal
              keyExtractor={keyExtractor}
              renderItem={renderService}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.hScroll}
            />
          )}
        </View>

        <OfferBanners />

        {/* ── Top Professionals ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t("top_professionals.title")}</Text>
            <TouchableOpacity
              style={styles.seeAllBtn}
              onPress={handleSeeAllPros}
            >
              <Text style={styles.seeAllText}>{t("top_professionals.see_all")}</Text>
              <Ionicons
                name="chevron-forward"
                size={14}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          </View>

          <FlatList
            data={PROFESSIONALS}
            horizontal
            keyExtractor={keyExtractor}
            renderItem={renderProfessional}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hScroll}
          />
        </View>

        {/* ── Invite Banner ── */}
        <View style={styles.bannerOuter}>
          <View style={styles.inviteBanner}>
            <Svg
              style={StyleSheet.absoluteFill}
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <Circle cx="85" cy="0" r="30" fill="rgba(255,255,255,0.07)" />
              <Circle cx="15" cy="100" r="25" fill="rgba(255,255,255,0.04)" />
            </Svg>

            <View style={styles.inviteLeft}>
              <View style={styles.iconCircle}>
                <Text style={styles.emojiIcon}>🎁</Text>
              </View>
              <View>
                <Text style={styles.inviteTitle}>
                  {t("invite_banner.title")}
                </Text>
                <Text style={styles.inviteSub}>
                  {t("invite_banner.subtitle")}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.inviteBtn}
              onPress={handleInvitePress}
            >
              <Text style={styles.inviteBtnText}>{t("invite_banner.cta")}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background },

  topNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm + 2,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  locationLabel: { fontSize: 11, color: theme.colors.textMuted },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    marginTop: 2,
  },
  locationText: { fontSize: 14, color: theme.colors.textPrimary },

  section: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xxl,
    paddingBottom: theme.spacing.xs,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 17, color: theme.colors.textPrimary },
  seeAllBtn: { flexDirection: "row", alignItems: "center", gap: 2 },
  seeAllText: { fontSize: 13, color: theme.colors.primary },

  catGrid: { gap: theme.spacing.sm + 2 },

  bannerOuter: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
  },

  promoBanner: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    overflow: "hidden",
    paddingVertical: 16,
    paddingHorizontal: 16,
    minHeight: 85,
    backgroundColor: theme.colors.primary,
  },
  inviteBanner: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    overflow: "hidden",
    paddingVertical: 14,
    paddingHorizontal: 16,
    minHeight: 75,
    backgroundColor: theme.colors.primary,
  },

  promoLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  promoTextWrap: { flex: 1 },
  inviteLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  iconCircle: {
    width: 44,
    height: 44,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  emojiIcon: { fontSize: 22 },

  promoTitle: { fontSize: 15, fontWeight: "700", color: "#FFFFFF" },
  promoSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.9)",
    marginTop: 2,
    lineHeight: 16,
  },
  promoHighlight: { color: theme.colors.success, fontWeight: "700" },
  inviteTitle: { fontSize: 14, fontWeight: "700", color: "#FFFFFF" },
  inviteSub: { fontSize: 11, color: "rgba(255,255,255,0.8)", marginTop: 2 },

  promoBtn: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginLeft: 8,
  },
  promoBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  inviteBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
  inviteBtnText: { fontSize: 13, fontWeight: "600", color: "#FFFFFF" },

  centeredLoader: { marginVertical: 24 },
  hScroll: { gap: 12, paddingBottom: theme.spacing.xs },

  headerActionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  skeletonRow: { flexDirection: "row", gap: 10 },
  skeletonCard: {
    height: 80,
    backgroundColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    opacity: 0.5,
    flex: 1,
  },

  bottomSpacer: { height: 100 },
});
