import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "@/src/theme/theme";
import { Header } from "@/src/components/common/Header";

const JobTrackingScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.safe}>
      <Header
        title="Job Tracking"
        onBack={() => router.back()}
        rightIcon="dots"
      />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.statusBar}>
          <View style={styles.statusBadge}>
            <MaterialCommunityIcons
              name="briefcase-clock-outline"
              size={16}
              color={theme.colors.primary}
            />
            <Text style={styles.statusText}>Job In Progress</Text>
          </View>
          <Feather name="clock" size={18} color={theme.colors.textMuted} />
        </View>

        <View style={styles.mapContainer}>
          <View style={styles.mapGrid}>
            {Array.from({ length: 6 }).map((_, row) =>
              Array.from({ length: 5 }).map((_, col) => (
                <View
                  key={`${row}-${col}`}
                  style={[
                    styles.mapCell,
                    (row + col) % 3 === 0 && styles.mapCellAlt,
                  ]}
                />
              )),
            )}
          </View>
          <View style={styles.routeContainer}>
            <View style={styles.routeNode}>
              <MaterialCommunityIcons
                name="map-marker"
                size={28}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.routeLine} />
            <View style={styles.routeDot} />
            <View style={styles.routeLine} />
            <View style={styles.routeNode}>
              <MaterialCommunityIcons
                name="map-marker"
                size={28}
                color={theme.colors.primary}
              />
            </View>
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <View style={[styles.infoIcon, { backgroundColor: "#F0FDF4" }]}>
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={theme.colors.success}
                />
              </View>
              <Text style={styles.infoLabel}>John is on the way</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.infoRow}
            onPress={() => router.push("/LoggingDetailScreen")}
          >
            <View style={styles.infoLeft}>
              <View style={[styles.infoIcon, { backgroundColor: "#EFF6FF" }]}>
                <Ionicons
                  name="location-outline"
                  size={20}
                  color={theme.colors.primary}
                />
              </View>
              <View>
                <Text style={styles.infoLabel}>Arriving in 10 mins</Text>
                <Text style={styles.infoSub}>Estimated arrival time</Text>
              </View>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={theme.colors.textMuted}
            />
          </TouchableOpacity>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <View style={[styles.infoIcon, { backgroundColor: "#FFF7ED" }]}>
                <MaterialCommunityIcons
                  name="progress-wrench"
                  size={20}
                  color={theme.colors.primary}
                />
              </View>
              <Text style={styles.infoLabel}>In Progress</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={styles.progressFill} />
            </View>
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default JobTrackingScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { flex: 1 },
  statusBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    backgroundColor: "#EFF6FF",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    ...theme.typography.caption,
    color: theme.colors.primary,
   
  },
  mapContainer: {
    marginHorizontal: theme.spacing.lg,
    height: 200,
    borderRadius: theme.radius.lg,
    overflow: "hidden",
    backgroundColor: "#E8F4F8",
    marginBottom: theme.spacing.md,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  mapGrid: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  mapCell: {
    width: "20%",
    height: 200 / 6,
    borderWidth: 0.5,
    borderColor: "rgba(100,150,200,0.2)",
    backgroundColor: "#D4E8F2",
  },
  mapCellAlt: { backgroundColor: "#C8DDE9" },
  routeContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  routeNode: {},
  routeLine: {
    flex: 1,
    height: 3,
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },
  routeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.primary,
    marginHorizontal: 4,
  },
  infoCard: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.medium,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.md,
  },
  infoLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  infoLabel: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textPrimary,
  },
  infoSub: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  divider: { height: 1, backgroundColor: theme.colors.divider },
  progressBar: {
    width: 80,
    height: 6,
    backgroundColor: theme.colors.border,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    width: "55%",
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: 3,
  },
});
