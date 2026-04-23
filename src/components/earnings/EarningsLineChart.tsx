import { theme } from "@/src/theme/theme";
import React, { useMemo, useState } from "react";
import { LayoutChangeEvent, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from "react-native-svg";

const CHART_HEIGHT = 160;
const Y_LABELS = 5;
const LEFT_OFFSET = 44;

type Props = {
  data: { label: string; value: number }[];
  max: number;
  peakIndex: number;
};

export function EarningsLineChart({ data, max, peakIndex }: Props) {
  const [width, setWidth] = useState(0);
  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  const yLabels = useMemo(() => {
    const step = max / (Y_LABELS - 1);
    return Array.from({ length: Y_LABELS }, (_, i) =>
      Math.round(step * (Y_LABELS - 1 - i)),
    );
  }, [max]);

  const chartW = width - LEFT_OFFSET;
  const pts = useMemo(() => {
    if (!chartW || !data.length) return [];
    return data.map((d, i) => ({
      x: LEFT_OFFSET + (i / (data.length - 1)) * chartW,
      y: CHART_HEIGHT - (d.value / max) * CHART_HEIGHT,
      value: d.value,
    }));
  }, [data, max, chartW]);

  const linePath = useMemo(() => {
    if (pts.length < 2) return "";
    return pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  }, [pts]);

  const areaPath = useMemo(() => {
    if (pts.length < 2) return "";
    const last = pts[pts.length - 1];
    const first = pts[0];
    return `${linePath} L ${last.x} ${CHART_HEIGHT} L ${first.x} ${CHART_HEIGHT} Z`;
  }, [linePath, pts]);

  const peak = pts[peakIndex];

  return (
    <View style={ss.card}>
      <View onLayout={onLayout} style={{ height: CHART_HEIGHT + 32 }}>
        {width > 0 && (
          <>
            <View style={ss.yAxis}>
              {yLabels.map((v, i) => (
                <Text key={i} style={ss.yLabel}>${v}</Text>
              ))}
            </View>

            <Svg width={width} height={CHART_HEIGHT} style={StyleSheet.absoluteFill}>
              <Defs>
                <LinearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor={theme.colors.primary} stopOpacity="0.25" />
                  <Stop offset="100%" stopColor={theme.colors.primary} stopOpacity="0.02" />
                </LinearGradient>
              </Defs>

              {yLabels.map((_, i) => {
                const y = (i / (Y_LABELS - 1)) * CHART_HEIGHT;
                return (
                  <Path
                    key={i}
                    d={`M ${LEFT_OFFSET} ${y} L ${width} ${y}`}
                    stroke={theme.colors.borderLight}
                    strokeWidth={1}
                  />
                );
              })}

              <Path d={areaPath} fill="url(#areaGrad)" />
              <Path
                d={linePath}
                stroke={theme.colors.primary}
                strokeWidth={2.5}
                fill="none"
                strokeLinejoin="round"
              />

              {pts.map((p, i) => (
                <Circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r={4}
                  fill={theme.colors.primary}
                  stroke={theme.colors.surface}
                  strokeWidth={2}
                />
              ))}
            </Svg>

            {peak && (
              <View style={[ss.tooltip, { left: peak.x - 28, top: peak.y - 36 }]}>
                <Text style={ss.tooltipText}>${peak.value}</Text>
              </View>
            )}

            <View style={[ss.xAxis, { paddingLeft: LEFT_OFFSET }]}>
              {data.map((d, i) => (
                <Text key={i} style={ss.xLabel}>{d.label}</Text>
              ))}
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const ss = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
    borderWidth: theme.hairline,
    borderColor: theme.colors.borderLight,
    ...theme.shadows.small,
    marginBottom: theme.spacing.lg,
  },
  yAxis: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 30,
    width: 40,
    justifyContent: "space-between",
  },
  yLabel: {
    ...theme.typography.ios.caption2,
    color: theme.colors.textMuted,
    textAlign: "right",
  },
  tooltip: {
    position: "absolute",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.sm + 2,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  tooltipText: {
    ...theme.typography.ios.caption1,
    fontWeight: "700",
    color: theme.colors.surface,
  },
  xAxis: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: theme.spacing.xs,
  },
  xLabel: {
    ...theme.typography.ios.caption2,
    color: theme.colors.textMuted,
  },
});
