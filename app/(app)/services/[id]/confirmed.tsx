import { theme } from "@/src/theme/theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
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

const { width } = Dimensions.get("window");

const BookingConfirmedScreen: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={ss.container}>
      <View style={ss.blueHeader}>
        <SafeAreaView edges={["top"]}>
          <View style={ss.headerNav}>
            <TouchableOpacity onPress={() => router.replace("/(app)/(tabs)")}>
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={ss.headerContent}>
            <Text style={ss.headerTitle}>Booking Confirmed!</Text>
            <Text style={ss.headerSub}>
              Your service has been booked successfully.
            </Text>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView
        style={ss.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={ss.scrollContent}
      >
        <View style={ss.heroContainer}>
          <View style={ss.imageWrapper}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&h=600&fit=crop",
              }}
              style={ss.providerImage}
            />
          </View>
        </View>

        <View style={ss.arrivalCard}>
          <View style={ss.arrivalIconBg}>
            <MaterialCommunityIcons
              name="truck-delivery-outline"
              size={24}
              color={theme.colors.primary}
            />
          </View>
          <View style={ss.arrivalTextWrap}>
            <Text style={ss.arrivalLabel}>Estimated Arrival</Text>
            <Text style={ss.arrivalTime}>Today, 02:30 PM - 03:00 PM</Text>
          </View>
          <View style={ss.statusBadge}>
            <View style={ss.dot} />
            <Text style={ss.statusText}>On Time</Text>
          </View>
        </View>

        <View style={ss.summaryCard}>
          <Text style={ss.sectionTitle}>Payment Summary</Text>

          <View style={ss.priceRow}>
            <Text style={ss.priceLabel}>Leaky Faucet Repair</Text>
            <Text style={ss.priceValue}>$120.00</Text>
          </View>

          <View style={ss.priceRow}>
            <Text style={ss.priceLabel}>Service Fee</Text>
            <Text style={ss.priceValue}>$5.00</Text>
          </View>

          <View style={ss.priceRow}>
            <Text style={ss.priceLabel}>Tax (8%)</Text>
            <Text style={ss.priceValue}>$8.20</Text>
          </View>

          <View style={ss.dashDivider} />

          <View style={[ss.priceRow, { marginTop: 8 }]}>
            <Text style={ss.totalLabel}>Total Amount</Text>
            <Text style={ss.totalValue}>$133.20</Text>
          </View>
        </View>

        <View style={ss.helpSection}>
          <Text style={ss.helpText}>Need to change something?</Text>
          <TouchableOpacity>
            <Text style={ss.contactLink}>Contact Support</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 200 }} />
      </ScrollView>

      <View style={[ss.footer, { paddingBottom: insets.bottom }]}>
        <TouchableOpacity
          style={ss.mainBtn}
          onPress={() => router.push("/(app)/(tabs)/bookings")}
        >
          <Text style={ss.mainBtnText}>View My Bookings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={ss.secondaryBtn}
          onPress={() => router.replace("/(app)/(tabs)")}
        >
          <Text style={ss.secondaryBtnText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BookingConfirmedScreen;

const ss = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },

  blueHeader: {
    backgroundColor: theme.colors.primary,
    height: 220,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerNav: { paddingTop: 10 },
  headerContent: { alignItems: "center", marginTop: 10 },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
  },
  headerSub: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    marginTop: 4,
  },

  scroll: { flex: 1, marginTop: -60 },
  scrollContent: { paddingHorizontal: 20 },

  heroContainer: { alignItems: "center", marginBottom: 20 },
  imageWrapper: {
    width: width * 0.8,
    height: 200,
    borderRadius: 24,
    backgroundColor: "#fff",
    ...theme.shadows.medium,
    overflow: "hidden",
    borderWidth: 4,
    borderColor: "#fff",
  },
  providerImage: { width: "100%", height: "100%" },

  arrivalCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    ...theme.shadows.small,
    marginBottom: 16,
  },
  arrivalIconBg: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: theme.colors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
  },
  arrivalTextWrap: { flex: 1, marginLeft: 12 },
  arrivalLabel: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  arrivalTime: {
    fontSize: 15,
    color: theme.colors.textPrimary,
    marginTop: 2,
    fontWeight: "600",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.successSubtle,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.success,
    marginRight: 6,
  },
  statusText: {
    fontSize: 11,
    color: theme.colors.success,
    fontWeight: "600",
  },

  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    ...theme.shadows.small,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.textPrimary,
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  priceLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  priceValue: {
    fontSize: 14,
    color: theme.colors.textPrimary,
    fontWeight: "500",
  },
  dashDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
    borderStyle: "dashed",
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.textPrimary,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.primary,
  },

  helpSection: { alignItems: "center", marginTop: 24 },
  helpText: {
    fontSize: 14,
    color: theme.colors.textMuted,
  },
  contactLink: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: "600",
    marginTop: 4,
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  mainBtn: {
    backgroundColor: theme.colors.primary,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  mainBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryBtn: {
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryBtnText: {
    color: theme.colors.textSecondary,
    fontSize: 15,
    fontWeight: "500",
  },
});
