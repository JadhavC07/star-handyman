import { theme } from "@/src/theme/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: SW } = Dimensions.get("window");
const BANNER_WIDTH = SW - theme.spacing.lg * 2;

// Expanded data with all 6 types
const MOCK_OFFERS = [
  {
    id: "1",
    type: "gradient",
    title: "Home Deep Cleaning",
    subTitle: "Flat 25% OFF on first booking",
    code: "CLEAN25",
    color: theme.colors.primary,
    image: "https://cdn-icons-png.flaticon.com/512/2954/2954893.png",
  },
  {
    id: "2",
    type: "perspective",
    title: "Kitchen Remodel",
    desc: "Free consultation from top architects",
    cta: "Claim Now",
    color: theme.colors.primary,
    image: "https://cdn-icons-png.flaticon.com/512/2329/2329094.png",
  },
  {
    id: "3",
    type: "minimal",
    title: "Full Body Massage",
    subTitle: "Relax & Unwind at home",
    tag: "STARTING @ ₹499",
    color: theme.colors.secondary,
    image: "https://cdn-icons-png.flaticon.com/512/2947/2947656.png",
  },
  {
    id: "4",
    type: "layered",
    title: "Instant Electrician",
    desc: "20-minute arrival guaranteed",
    tag: "99% Success Rate",
    color: theme.colors.secondary,
    image: "https://cdn-icons-png.flaticon.com/512/1904/1904437.png",
  },
  {
    id: "5",
    type: "service",
    title: "AC Gas Charging",
    subTitle: "Get your AC summer ready",
    extra: "Verified Pros",
    color: theme.colors.success,
    image: "https://cdn-icons-png.flaticon.com/512/911/911409.png",
  },
  {
    id: "6",
    type: "geometric",
    title: "Safety First",
    desc: "All pros are background checked",
    highlight: "Secured",
    color: theme.colors.success,
    image: "https://cdn-icons-png.flaticon.com/512/1162/1162456.png",
  },
];

export const OfferBanners = () => {
  const renderBanner = ({ item }: { item: (typeof MOCK_OFFERS)[0] }) => {
    // 1. GRADIENT STYLE (Bold)
    if (item.type === "gradient") {
      return (
        <TouchableOpacity
          activeOpacity={0.9}
          style={[styles.bannerBase, { backgroundColor: item.color }]}
        >
          <View style={styles.textContainer}>
            <View style={styles.promoBadge}>
              <Text style={styles.promoText}>LIMITED OFFER</Text>
            </View>
            <Text style={styles.titleLight}>{item.title}</Text>
            <Text style={styles.subTitleLight}>{item.subTitle}</Text>
            <View style={styles.codeContainer}>
              <Text style={[styles.codeText, { color: item.color }]}>
                Use Code: {item.code}
              </Text>
            </View>
          </View>
          <Image source={{ uri: item.image }} style={styles.bannerImg} />
        </TouchableOpacity>
      );
    }

    // 2. PERSPECTIVE STYLE (Slanted Cut)
    if (item.type === "perspective") {
      return (
        <TouchableOpacity activeOpacity={0.9} style={styles.bannerBase}>
          <View
            style={[styles.perspectiveLeft, { backgroundColor: item.color }]}
          >
            <Text style={styles.titleLightSmall}>NEW SERVICE</Text>
            <Text style={styles.titleLight}>{item.title}</Text>
            <Text style={styles.descLight}>{item.desc}</Text>
            <View style={styles.whiteCta}>
              <Text style={[styles.ctaText, { color: item.color }]}>
                {item.cta}
              </Text>
            </View>
          </View>
          <View style={styles.perspectiveRight}>
            <View
              style={[styles.slantOverlay, { borderLeftColor: item.color }]}
            />
            <Image source={{ uri: item.image }} style={styles.sideImg} />
          </View>
        </TouchableOpacity>
      );
    }

    // 3. MINIMAL STYLE (Circle Image)
    if (item.type === "minimal") {
      return (
        <TouchableOpacity
          activeOpacity={0.9}
          style={[styles.bannerBase, styles.minimalCard]}
        >
          <View style={styles.textContainer}>
            <Text style={[styles.titleDark, { color: item.color }]}>
              {item.title}
            </Text>
            <Text style={styles.subTitleDark}>{item.subTitle}</Text>
            <View
              style={[
                styles.tagPill,
                { backgroundColor: theme.colors.secondarySubtle },
              ]}
            >
              <Text style={[styles.tagText, { color: item.color }]}>
                {item.tag}
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.imgCircle,
              { backgroundColor: theme.colors.secondarySubtle },
            ]}
          >
            <Image source={{ uri: item.image }} style={styles.circleImg} />
          </View>
        </TouchableOpacity>
      );
    }

    // 4. LAYERED STYLE (Floating Card)
    if (item.type === "layered") {
      return (
        <TouchableOpacity
          activeOpacity={0.9}
          style={[styles.bannerBase, styles.layeredCard]}
        >
          <View style={styles.layeredTextContent}>
            <View
              style={[
                styles.pill,
                { backgroundColor: theme.colors.secondarySubtle },
              ]}
            >
              <Text style={[styles.pillText, { color: item.color }]}>
                {item.tag}
              </Text>
            </View>
            <Text style={styles.titleDark}>{item.title}</Text>
            <Text style={styles.descDark}>{item.desc}</Text>
          </View>
          <View style={styles.innerCardWrap}>
            <View
              style={[
                styles.floatingCard,
                { borderColor: theme.colors.borderLight },
              ]}
            >
              <Image source={{ uri: item.image }} style={styles.floatingImg} />
            </View>
          </View>
        </TouchableOpacity>
      );
    }

    // 5. SERVICE STYLE (Booking Focus)
    if (item.type === "service") {
      return (
        <TouchableOpacity
          activeOpacity={0.9}
          style={[styles.bannerBase, styles.serviceCard]}
        >
          <View style={styles.serviceLeft}>
            <Image source={{ uri: item.image }} style={styles.serviceImg} />
          </View>
          <View style={styles.serviceRight}>
            <Text style={styles.titleDark}>{item.title}</Text>
            <Text style={styles.subTitleDark}>{item.subTitle}</Text>
            <View style={styles.verifiedRow}>
              <Ionicons
                name="shield-checkmark"
                size={14}
                color={theme.colors.success}
              />
              <Text style={styles.extraText}>{item.extra}</Text>
            </View>
            <View style={styles.bookNowBtn}>
              <Text style={styles.bookNowText}>Book Now</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }

    // 6. GEOMETRIC STYLE (Modern/Dark)
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={[
          styles.bannerBase,
          { backgroundColor: theme.colors.textPrimary },
        ]}
      >
        <View style={styles.geoCircle1} />
        <View style={styles.geoCircle2} />
        <View style={styles.geoContent}>
          <Ionicons
            name="shield-checkmark"
            size={32}
            color={theme.colors.success}
          />
          <Text style={styles.titleLight}>{item.title}</Text>
          <Text style={[styles.descLight, { maxWidth: "75%" }]}>
            {item.desc}
          </Text>
          <Text style={[styles.highlightText, { color: theme.colors.success }]}>
            {item.highlight}
          </Text>
        </View>
        <Image source={{ uri: item.image }} style={styles.geoImg} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={MOCK_OFFERS}
        renderItem={renderBanner}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        snapToInterval={BANNER_WIDTH + theme.spacing.md}
        decelerationRate="fast"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: theme.spacing.md },
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    // paddingVertical: theme.spacing.lg,
    gap: theme.spacing.md,
    paddingBottom: 20,
  },
  bannerBase: {
    width: BANNER_WIDTH,
    height: 160,
    borderRadius: theme.radius.xl,
    flexDirection: "row",
    overflow: "hidden",
    ...theme.shadows.medium,
  },
  textContainer: {
    flex: 1,
    padding: theme.spacing.lg,
    justifyContent: "center",
  },

  // Shared Light Typography
  titleLight: {
    color: "#FFF",
    fontSize: 20,
    fontFamily: theme.fonts.heading,
    fontWeight: "800",
  },
  subTitleLight: { color: "rgba(255,255,255,0.8)", fontSize: 13, marginTop: 4 },
  descLight: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },

  // Shared Dark Typography
  titleDark: {
    fontSize: 18,
    fontFamily: theme.fonts.heading,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
  subTitleDark: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  descDark: { color: theme.colors.textSecondary, fontSize: 13, marginTop: 4 },

  // Gradient Specific
  promoBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 6,
  },
  promoText: { color: "#FFF", fontSize: 10, fontWeight: "bold" },
  codeContainer: {
    marginTop: 12,
    backgroundColor: "#FFF",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.sm,
  },
  codeText: { fontSize: 12, fontWeight: "bold" },
  bannerImg: {
    width: 100,
    height: 100,
    alignSelf: "center",
    resizeMode: "contain",
    marginRight: 10,
  },

  // Perspective Specific
  perspectiveLeft: {
    flex: 1.4,
    padding: 20,
    justifyContent: "center",
    zIndex: 2,
  },
  perspectiveRight: {
    flex: 1,
    backgroundColor: theme.colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  slantOverlay: {
    position: "absolute",
    left: -20,
    top: 0,
    bottom: 0,
    width: 0,
    height: 0,
    borderBottomWidth: 160,
    borderLeftWidth: 40,
    borderBottomColor: "transparent",
    zIndex: 1,
  },
  whiteCta: {
    backgroundColor: "#FFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.sm,
    alignSelf: "flex-start",
    marginTop: 12,
  },
  ctaText: { fontSize: 12, fontWeight: "bold" },
  sideImg: { width: 80, height: 80, resizeMode: "contain" },
  titleLightSmall: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 4,
  },

  // Minimal Specific
  minimalCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  tagPill: {
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
    alignSelf: "flex-start",
  },
  tagText: { fontSize: 11, fontWeight: "bold" },
  imgCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    marginRight: -30,
    marginTop: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  circleImg: { width: 75, height: 75, resizeMode: "contain" },

  // Layered Specific
  layeredCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  layeredTextContent: { flex: 1, padding: 20, justifyContent: "center" },
  innerCardWrap: { flex: 0.8, alignItems: "center", justifyContent: "center" },
  floatingCard: {
    width: 90,
    height: 90,
    backgroundColor: "#FFF",
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadows.small,
  },
  floatingImg: { width: 50, height: 50, resizeMode: "contain" },
  pill: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: 8,
  },
  pillText: { fontSize: 10, fontWeight: "bold" },

  // Service Specific
  serviceCard: {
    backgroundColor: theme.colors.surfaceAlt,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  serviceLeft: {
    width: "35%",
    backgroundColor: "rgba(0,0,0,0.03)",
    alignItems: "center",
    justifyContent: "center",
  },
  serviceRight: {
    flex: 1,
    padding: theme.spacing.md,
    justifyContent: "center",
  },
  serviceImg: { width: 60, height: 60, resizeMode: "contain" },
  verifiedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  extraText: { fontSize: 11, color: theme.colors.textMuted },
  bookNowBtn: {
    marginTop: 10,
    backgroundColor: theme.colors.textPrimary,
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: theme.radius.md,
    alignSelf: "flex-start",
  },
  bookNowText: { color: "#FFF", fontSize: 12, fontWeight: "600" },

  // Geometric Specific
  geoContent: { flex: 1, padding: 20, justifyContent: "center", zIndex: 3 },
  geoCircle1: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.05)",
    top: -50,
    right: -20,
  },
  geoCircle2: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.03)",
    bottom: -20,
    left: 40,
  },
  geoImg: {
    width: 100,
    height: 100,
    position: "absolute",
    right: 10,
    bottom: 10,
    opacity: 0.8,
    resizeMode: "contain",
  },
  highlightText: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 8,
    letterSpacing: 1,
  },
});
