import React from "react";
import Svg, { Circle, Ellipse, Line, Path, Rect } from "react-native-svg";

// ── Salon ── Scissors with blue handles ───────────────────────────────────
export const SalonIcon = ({ size = 56 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    {/* Background pill */}
    <Rect x={0} y={0} width={56} height={56} rx={16} fill="#FFF7ED" />
    {/* Ring left */}
    <Circle
      cx={17}
      cy={18}
      r={7}
      fill="#FFF7ED"
      stroke="#F97316"
      strokeWidth={2.8}
    />
    <Circle cx={17} cy={18} r={2.5} fill="#F97316" />
    {/* Ring right */}
    <Circle
      cx={39}
      cy={18}
      r={7}
      fill="#FFF7ED"
      stroke="#F97316"
      strokeWidth={2.8}
    />
    <Circle cx={39} cy={18} r={2.5} fill="#F97316" />
    {/* Blades */}
    <Line
      x1={20}
      y1={23}
      x2={37}
      y2={43}
      stroke="#FB923C"
      strokeWidth={3}
      strokeLinecap="round"
    />
    <Line
      x1={36}
      y1={23}
      x2={19}
      y2={43}
      stroke="#FB923C"
      strokeWidth={3}
      strokeLinecap="round"
    />
    {/* Pivot */}
    <Circle
      cx={28}
      cy={31}
      r={3.5}
      fill="#FFF7ED"
      stroke="#F97316"
      strokeWidth={2}
    />
  </Svg>
);

// ── Electrician ── Lightning bolt ─────────────────────────────────────────
export const ElectricianIcon = ({ size = 56 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={0} y={0} width={56} height={56} rx={16} fill="#EFF6FF" />
    {/* Glow backing */}
    <Circle cx={28} cy={28} r={17} fill="#DBEAFE" opacity={0.7} />
    {/* Bolt */}
    <Path d="M32 10 L18 30 L27 30 L24 46 L38 26 L29 26 Z" fill="#2563EB" />
    {/* Highlight face */}
    <Path
      d="M32 10 L27 19 L29 19 L27 30 L18 30 Z"
      fill="#60A5FA"
      opacity={0.65}
    />
  </Svg>
);

// ── Cleaning ── Spray bottle ───────────────────────────────────────────────
export const CleaningIcon = ({ size = 56 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={0} y={0} width={56} height={56} rx={16} fill="#F0FDF4" />
    {/* Bottle body */}
    <Rect x={17} y={24} width={18} height={24} rx={6} fill="#16A34A" />
    {/* Pump head */}
    <Rect x={17} y={13} width={11} height={12} rx={4} fill="#22C55E" />
    {/* Nozzle */}
    <Rect x={28} y={15} width={13} height={5} rx={2.5} fill="#22C55E" />
    {/* Trigger */}
    <Path
      d="M17 28 Q10 28 11 36"
      stroke="#15803D"
      strokeWidth={3}
      fill="none"
      strokeLinecap="round"
    />
    {/* Spray lines */}
    <Line
      x1={42}
      y1={12}
      x2={47}
      y2={10}
      stroke="#86EFAC"
      strokeWidth={2}
      strokeLinecap="round"
    />
    <Line
      x1={42}
      y1={16}
      x2={48}
      y2={16}
      stroke="#86EFAC"
      strokeWidth={2}
      strokeLinecap="round"
    />
    <Line
      x1={42}
      y1={20}
      x2={47}
      y2={22}
      stroke="#86EFAC"
      strokeWidth={2}
      strokeLinecap="round"
    />
    {/* Shine */}
    <Rect
      x={19}
      y={26}
      width={5}
      height={9}
      rx={2.5}
      fill="#86EFAC"
      opacity={0.5}
    />
  </Svg>
);

// ── AC ── Unit with airflow ────────────────────────────────────────────────
export const ACIcon = ({ size = 56 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={0} y={0} width={56} height={56} rx={16} fill="#EFF6FF" />
    {/* Unit body */}
    <Rect x={8} y={15} width={40} height={18} rx={5} fill="#2563EB" />
    {/* Grille face */}
    <Rect x={10} y={17} width={36} height={14} rx={3} fill="#93C5FD" />
    {/* Vent slats */}
    <Line x1={10} y1={22} x2={46} y2={22} stroke="#2563EB" strokeWidth={1.5} />
    <Line x1={10} y1={26} x2={46} y2={26} stroke="#2563EB" strokeWidth={1.5} />
    {/* LED dot */}
    <Circle cx={41} cy={19} r={3} fill="#22D3EE" />
    {/* Power ring */}
    <Circle
      cx={41}
      cy={19}
      r={4.5}
      fill="none"
      stroke="#0EA5E9"
      strokeWidth={1}
      opacity={0.5}
    />
    {/* Airflow curves */}
    <Path
      d="M16 33 Q13 38 16 43"
      stroke="#60A5FA"
      strokeWidth={2.5}
      fill="none"
      strokeLinecap="round"
    />
    <Path
      d="M28 33 Q25 38 28 43"
      stroke="#60A5FA"
      strokeWidth={2.5}
      fill="none"
      strokeLinecap="round"
    />
    <Path
      d="M40 33 Q37 38 40 43"
      stroke="#60A5FA"
      strokeWidth={2.5}
      fill="none"
      strokeLinecap="round"
    />
  </Svg>
);

// ── Plumber ── Faucet + drop ───────────────────────────────────────────────
export const PlumberIcon = ({ size = 56 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={0} y={0} width={56} height={56} rx={16} fill="#EFF6FF" />
    {/* Handle bar */}
    <Rect x={14} y={12} width={22} height={7} rx={3.5} fill="#2563EB" />
    {/* Neck */}
    <Rect x={22} y={19} width={8} height={8} rx={2} fill="#60A5FA" />
    {/* Spout L-curve */}
    <Path
      d="M22 27 L22 36 Q22 42 30 42 L42 42"
      stroke="#2563EB"
      strokeWidth={7}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Knob */}
    <Circle cx={25} cy={15} r={3} fill="#BFDBFE" />
    {/* Water drop */}
    <Path
      d="M42 44 C42 44 39 48 39 51 C39 53 40.5 54 42 54 C43.5 54 45 53 45 51 C45 48 42 44 42 44 Z"
      fill="#93C5FD"
    />
  </Svg>
);

// ── Massage ── Table + hands ───────────────────────────────────────────────
export const MassageIcon = ({ size = 56 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={0} y={0} width={56} height={56} rx={16} fill="#FFF7ED" />
    {/* Table legs */}
    <Rect x={12} y={40} width={4} height={10} rx={2} fill="#F97316" />
    <Rect x={40} y={40} width={4} height={10} rx={2} fill="#F97316" />
    {/* Table surface */}
    <Rect x={9} y={34} width={38} height={7} rx={3} fill="#FDBA74" />
    {/* Person torso */}
    <Rect x={10} y={26} width={26} height={10} rx={5} fill="#FED7AA" />
    {/* Person head */}
    <Circle cx={42} cy={31} r={6} fill="#F97316" />
    {/* Left massage hand */}
    <Ellipse
      cx={18}
      cy={20}
      rx={6}
      ry={3.5}
      fill="#F97316"
      transform="rotate(-25, 18, 20)"
    />
    {/* Right massage hand */}
    <Ellipse
      cx={30}
      cy={19}
      rx={6}
      ry={3.5}
      fill="#F97316"
      transform="rotate(20, 30, 19)"
    />
    {/* Relax sparkles */}
    <Path
      d="M47 14 Q49 12 47 10"
      stroke="#FCD34D"
      strokeWidth={2}
      fill="none"
      strokeLinecap="round"
    />
    <Path
      d="M52 19 Q54 17 52 15"
      stroke="#FCD34D"
      strokeWidth={2}
      fill="none"
      strokeLinecap="round"
    />
  </Svg>
);

// ── Carpentry ── Hammer ────────────────────────────────────────────────────
export const CarpentryIcon = ({ size = 56 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={0} y={0} width={56} height={56} rx={16} fill="#FFFBEB" />
    {/* Handle */}
    <Rect x={25} y={22} width={7} height={28} rx={3.5} fill="#92400E" />
    {/* Head body */}
    <Rect x={11} y={11} width={34} height={14} rx={4} fill="#D97706" />
    {/* Head shine */}
    <Rect
      x={14}
      y={13}
      width={15}
      height={5}
      rx={2.5}
      fill="#FDE68A"
      opacity={0.65}
    />
    {/* Claw back of head */}
    <Path d="M11 14 Q8 17 8 20 Q11 22 11 18 Z" fill="#B45309" />
    {/* Grip lines */}
    <Line
      x1={25}
      y1={33}
      x2={32}
      y2={33}
      stroke="#78350F"
      strokeWidth={1.5}
      opacity={0.5}
    />
    <Line
      x1={25}
      y1={38}
      x2={32}
      y2={38}
      stroke="#78350F"
      strokeWidth={1.5}
      opacity={0.5}
    />
    <Line
      x1={25}
      y1={43}
      x2={32}
      y2={43}
      stroke="#78350F"
      strokeWidth={1.5}
      opacity={0.5}
    />
  </Svg>
);

// ── Water ── Teardrop ──────────────────────────────────────────────────────
export const WaterIcon = ({ size = 56 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 56 56">
    <Rect x={0} y={0} width={56} height={56} rx={16} fill="#ECFEFF" />
    {/* Main drop */}
    <Path
      d="M28 8 C28 8 14 24 14 33 C14 41.8 20.3 48 28 48 C35.7 48 42 41.8 42 33 C42 24 28 8 28 8 Z"
      fill="#0891B2"
    />
    {/* Highlight streak */}
    <Path
      d="M20 27 C19 31 18 34 18.5 38"
      stroke="#A5F3FC"
      strokeWidth={3.5}
      fill="none"
      strokeLinecap="round"
    />
    {/* Inner wave */}
    <Path
      d="M18 36 Q22 32 28 36 Q34 40 38 36"
      stroke="white"
      strokeWidth={2.5}
      fill="none"
      strokeLinecap="round"
      opacity={0.55}
    />
    {/* Tiny bubble */}
    <Circle cx={35} cy={24} r={3} fill="#67E8F9" opacity={0.6} />
  </Svg>
);
