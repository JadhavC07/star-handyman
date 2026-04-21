import React from "react";
import Svg, { Circle, Path, Rect } from "react-native-svg";

// ── Home ──────────────────────────────────────────────────────────────────
export const HomeTabIcon = ({
  size = 26,
  color = "#2563EB",
  active = false,
}: {
  size?: number;
  color?: string;
  active?: boolean;
}) => (
  <Svg width={size} height={size} viewBox="0 0 26 26" fill="none">
    {/* Roof */}
    <Path
      d="M3 11.5L13 3L23 11.5"
      stroke={color}
      strokeWidth={active ? 2.2 : 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Walls */}
    <Path
      d="M5 10V22H10.5V16.5C10.5 15.4 11.4 14.5 12.5 14.5H13.5C14.6 14.5 15.5 15.4 15.5 16.5V22H21V10"
      stroke={color}
      strokeWidth={active ? 2.2 : 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Active fill on door area */}
    {active && (
      <Path
        d="M10.5 22V16.5C10.5 15.4 11.4 14.5 12.5 14.5H13.5C14.6 14.5 15.5 15.4 15.5 16.5V22H10.5Z"
        fill={color}
        opacity={0.2}
      />
    )}
    {/* Active fill on roof */}
    {active && (
      <Path
        d="M3 11.5L13 3L23 11.5L21 10V22H5V10L3 11.5Z"
        fill={color}
        opacity={0.08}
      />
    )}
  </Svg>
);

// ── Services (wrench + sparkle) ───────────────────────────────────────────
export const ServicesTabIcon = ({
  size = 26,
  color = "#2563EB",
  active = false,
}: {
  size?: number;
  color?: string;
  active?: boolean;
}) => (
  <Svg width={size} height={size} viewBox="0 0 26 26" fill="none">
    {/* Wrench body */}
    <Path
      d="M16.5 3.5C14.3 3.5 12.5 5.3 12.5 7.5C12.5 7.9 12.6 8.3 12.7 8.6L4.5 16.8C3.9 17.4 3.9 18.4 4.5 19C5.1 19.6 6.1 19.6 6.7 19L14.9 10.8C15.2 10.9 15.8 11 16.2 11C18.4 11 20.2 9.2 20.2 7"
      stroke={color}
      strokeWidth={active ? 2.1 : 1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Wrench head circle */}
    <Circle
      cx={16.8}
      cy={6.8}
      r={2.6}
      stroke={color}
      strokeWidth={active ? 2.1 : 1.75}
      fill={active ? color : "none"}
      fillOpacity={active ? 0.15 : 0}
    />
    {/* Handle end dot */}
    <Circle cx={5.6} cy={17.9} r={1} fill={color} />
    {/* Sparkle top-right */}
    <Path
      d="M21 13L21.7 14.7L23 13L21.7 11.3L21 13Z"
      fill={color}
      opacity={active ? 1 : 0.5}
    />
    <Path
      d="M21 15.5V17M19.5 16.5H22.5"
      stroke={color}
      strokeWidth={1.4}
      strokeLinecap="round"
      opacity={active ? 1 : 0.5}
    />
  </Svg>
);

// ── Bookings (clipboard with check) ───────────────────────────────────────
export const BookingsTabIcon = ({
  size = 26,
  color = "#2563EB",
  active = false,
}: {
  size?: number;
  color?: string;
  active?: boolean;
}) => (
  <Svg width={size} height={size} viewBox="0 0 26 26" fill="none">
    {/* Clipboard body */}
    <Rect
      x={5}
      y={5}
      width={16}
      height={19}
      rx={3}
      stroke={color}
      strokeWidth={active ? 2.1 : 1.75}
      fill={active ? color : "none"}
      fillOpacity={active ? 0.08 : 0}
    />
    {/* Clip at top */}
    <Path
      d="M10 5V4C10 3.4 10.4 3 11 3H15C15.6 3 16 3.4 16 4V5"
      stroke={color}
      strokeWidth={active ? 2.1 : 1.75}
      strokeLinecap="round"
    />
    <Rect
      x={9}
      y={4}
      width={8}
      height={3}
      rx={1.5}
      fill={active ? color : "none"}
      stroke={color}
      strokeWidth={1.2}
      fillOpacity={active ? 0.25 : 0}
    />
    {/* Check mark */}
    <Path
      d="M9 14L12 17L17 11"
      stroke={color}
      strokeWidth={active ? 2.2 : 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ── Profile (person with ring) ─────────────────────────────────────────────
export const ProfileTabIcon = ({
  size = 26,
  color = "#2563EB",
  active = false,
}: {
  size?: number;
  color?: string;
  active?: boolean;
}) => (
  <Svg width={size} height={size} viewBox="0 0 26 26" fill="none">
    {/* Head */}
    <Circle
      cx={13}
      cy={9}
      r={4}
      stroke={color}
      strokeWidth={active ? 2.1 : 1.75}
      fill={active ? color : "none"}
      fillOpacity={active ? 0.15 : 0}
    />
    {/* Shoulders */}
    <Path
      d="M5 22C5 18.1 8.6 15 13 15C17.4 15 21 18.1 21 22"
      stroke={color}
      strokeWidth={active ? 2.1 : 1.75}
      strokeLinecap="round"
    />
    {/* Active accent ring */}
    {active && (
      <Circle
        cx={13}
        cy={9}
        r={6}
        stroke={color}
        strokeWidth={1}
        opacity={0.2}
      />
    )}
  </Svg>
);
