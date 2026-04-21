import { theme } from "@/src/theme/theme";
import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
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

const BookServiceScreen: React.FC = () => {
  const [description, setDescription] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(
    "Home - 123, Maple Street",
  );
  
  const [selectedTime, setSelectedTime] = useState("Tomorrow, 10:00 AM");
  const [photos, setPhotos] = useState([1, 2]);
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView style={ss.safe} edges={["top"]}>
      <View style={ss.header}>
        <TouchableOpacity style={ss.backBtn} onPress={() => router.back()}>
          <Ionicons
            name="chevron-back"
            size={24}
            color={theme.colors.textPrimary}
          />
        </TouchableOpacity>
        <View style={ss.headerTitleWrap}>
          <Text style={ss.headerTitle}>Review Request</Text>
          <Text style={ss.headerSub}>Step 2 of 3</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView style={ss.scroll} showsVerticalScrollIndicator={false}>
          {/* --- Progress Indicator --- */}
          <View style={ss.stepContainer}>
            <View style={ss.stepLineBase}>
              <View style={[ss.stepLineFill, { width: "66%" }]} />
            </View>
            <View style={ss.stepDotsRow}>
              {[1, 2, 3].map((s) => (
                <View key={s} style={[ss.stepDot, s <= 2 && ss.stepDotActive]}>
                  {s < 2 ? (
                    <Ionicons name="checkmark" size={12} color="#fff" />
                  ) : (
                    <Text style={ss.stepDotText}>{s}</Text>
                  )}
                </View>
              ))}
            </View>
          </View>
          <View style={ss.miniSummary}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=200",
              }}
              style={ss.miniImage}
            />
            <View style={ss.miniInfo}>
              <Text style={ss.miniCategory}>Plumbing</Text>
              <Text style={ss.miniTitle}>Leaky Faucet Repair</Text>
              <Text style={ss.miniPrice}>Est. $50</Text>
            </View>
          </View>

          <View style={ss.section}>
            <Text style={ss.sectionLabel}>Problem Description</Text>
            <TextInput
              style={ss.textarea}
              placeholder="Tell us more about the issue so the pro can come prepared..."
              placeholderTextColor={theme.colors.textMuted}
              multiline
              value={description}
              onChangeText={setDescription}
              textAlignVertical="top"
            />
          </View>

          <View style={ss.section}>
            <Text style={ss.sectionLabel}>Photos (Optional)</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={ss.photoScroll}
            >
              <TouchableOpacity style={ss.addPhotoBtn}>
                <Feather name="camera" size={20} color={theme.colors.primary} />
                <Text style={ss.addPhotoText}>Add</Text>
              </TouchableOpacity>
              {photos.map((p) => (
                <View key={p} style={ss.photoThumb}>
                  <Image
                    source={{ uri: `https://picsum.photos/200/200?sig=${p}` }}
                    style={ss.thumbImg}
                  />
                  <TouchableOpacity style={ss.removePhoto}>
                    <Ionicons name="close" size={14} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
          <View style={ss.detailsCard}>
            <DetailRow
              icon="location"
              label="Service Location"
              value={selectedLocation}
              color="#3B82F6"
            />
            <View style={ss.divider} />
            <DetailRow
              icon="time"
              label="Scheduled For"
              value={selectedTime}
              color="#F59E0B"
            />
          </View>

          <View style={{ height: 150 }} />
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={[ss.footer, { paddingBottom: insets.bottom + 10 }]}>
        <View style={ss.priceCol}>
          <Text style={ss.totalLabel}>Total Estimate</Text>
          <Text style={ss.totalPrice}>$50.00</Text>
        </View>
        <TouchableOpacity
          style={ss.confirmBtn}
          onPress={() => router.push("./confirmed")}
        >
          <Text style={ss.confirmBtnText}>Confirm Booking</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const DetailRow = ({ icon, label, value, color }: any) => (
  <TouchableOpacity style={ss.dRow}>
    <View style={[ss.dIconBg, { backgroundColor: color + "15" }]}>
      <Ionicons name={icon} size={20} color={color} />
    </View>
    <View style={ss.dContent}>
      <Text style={ss.dLabel}>{label}</Text>
      <Text style={ss.dValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
    <Feather name="edit-3" size={16} color={theme.colors.textMuted} />
  </TouchableOpacity>
);

export default BookServiceScreen;

const ss = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    ...theme.shadows.small,
  },
  headerTitleWrap: { alignItems: "center" },
  headerTitle: {
    fontSize: 17,
    color: theme.colors.textPrimary,
  },
  headerSub: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },

  scroll: { flex: 1, paddingHorizontal: 20 },

  // Stepper
  stepContainer: { marginVertical: 20, height: 30, justifyContent: "center" },
  stepLineBase: {
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    marginHorizontal: 20,
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
  stepDotText: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },

  // Mini Card
  miniSummary: {
    flexDirection: "row",
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 12,
    gap: 12,
    ...theme.shadows.small,
    marginBottom: 24,
  },
  miniImage: { width: 70, height: 70, borderRadius: 12 },
  miniInfo: { flex: 1, justifyContent: "center" },
  miniCategory: {
    fontSize: 11,
    color: theme.colors.primary,
    textTransform: "uppercase",
  },
  miniTitle: {
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  miniPrice: {
    fontSize: 15,
    color: theme.colors.success,
    marginTop: 2,
  },

  section: { marginBottom: 24 },
  sectionLabel: {
    fontSize: 15,
    color: theme.colors.textPrimary,
    marginBottom: 12,
  },
  textarea: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    height: 120,
    fontSize: 14,
    color: theme.colors.textPrimary,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  // Photos
  photoScroll: { flexDirection: "row" },
  addPhotoBtn: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderStyle: "dashed",
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary + "08",
    marginRight: 12,
  },
  addPhotoText: {
    fontSize: 12,
    color: theme.colors.primary,
    marginTop: 4,
  },
  photoThumb: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 12,
    position: "relative",
  },
  thumbImg: { width: "100%", height: "100%", borderRadius: 12 },
  removePhoto: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  // Details Card
  detailsCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    paddingVertical: 8,
    ...theme.shadows.small,
  },
  dRow: { flexDirection: "row", alignItems: "center", padding: 16, gap: 14 },
  dIconBg: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  dContent: { flex: 1 },
  dLabel: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  dValue: {
    fontSize: 14,
    color: theme.colors.textPrimary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginHorizontal: 16,
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  priceCol: { flex: 1 },
  totalLabel: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  totalPrice: {
    fontSize: 22,
    color: theme.colors.textPrimary,
  },
  confirmBtn: {
    flex: 1.5,
    backgroundColor: theme.colors.primary,
    height: 56,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  confirmBtnText: {
    color: "#fff",
    fontSize: 16,
  },
});
