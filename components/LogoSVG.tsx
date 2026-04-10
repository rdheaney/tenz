import React from 'react';
import Svg, { Defs, LinearGradient, Stop, Rect, Path, Text as SvgText } from 'react-native-svg';

type Props = {
  width: number;
  height: number;
};

// All coordinates in viewBox 0 0 400 520
const VB_W = 400;
const VB_H = 520;

// Cell layout
const CELL_W = 115;
const CELL_H = 115;
const CELL_R = 18;
const LEFT_X = 65;
const RIGHT_X = 220;
const CELL_Y = 170;
const LEFT_CX = LEFT_X + CELL_W / 2;   // 122.5
const RIGHT_CX = RIGHT_X + CELL_W / 2; // 277.5
const CELL_CY = CELL_Y + CELL_H / 2;   // 227.5

// Arc from top-center of left cell to top-center of right cell, curving up
const ARC = `M ${LEFT_CX} ${CELL_Y} Q ${VB_W / 2} 90 ${RIGHT_CX} ${CELL_Y}`;

export default function LogoSVG({ width, height }: Props) {
  return (
    <Svg width={width} height={height} viewBox={`0 0 ${VB_W} ${VB_H}`}>
      <Defs>
        <LinearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#071a2e" />
          <Stop offset="1" stopColor="#0a2540" />
        </LinearGradient>
        <LinearGradient id="cellGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#0f3a60" />
          <Stop offset="1" stopColor="#0a2840" />
        </LinearGradient>
      </Defs>

      {/* Background */}
      <Rect x="0" y="0" width={VB_W} height={VB_H} fill="url(#bg)" />

      {/* Connecting arc */}
      <Path
        d={ARC}
        stroke="#22d3ee"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        opacity={0.85}
      />

      {/* Arc endpoint dots */}
      <Rect x={LEFT_CX - 5} y={CELL_Y - 5} width="10" height="10" rx="5" fill="#22d3ee" />
      <Rect x={RIGHT_CX - 5} y={CELL_Y - 5} width="10" height="10" rx="5" fill="#22d3ee" />

      {/* Left cell */}
      <Rect
        x={LEFT_X} y={CELL_Y}
        width={CELL_W} height={CELL_H}
        rx={CELL_R}
        fill="url(#cellGrad)"
        stroke="#1a5276"
        strokeWidth="2"
      />

      {/* Right cell */}
      <Rect
        x={RIGHT_X} y={CELL_Y}
        width={CELL_W} height={CELL_H}
        rx={CELL_R}
        fill="url(#cellGrad)"
        stroke="#1a5276"
        strokeWidth="2"
      />

      {/* Numbers */}
      <SvgText
        x={LEFT_CX} y={CELL_CY + 22}
        textAnchor="middle"
        fontSize="62"
        fontWeight="700"
        fill="#e0f2fe"
      >1</SvgText>
      <SvgText
        x={RIGHT_CX} y={CELL_CY + 22}
        textAnchor="middle"
        fontSize="62"
        fontWeight="700"
        fill="#e0f2fe"
      >9</SvgText>

      {/* Title */}
      <SvgText
        x={VB_W / 2} y={360}
        textAnchor="middle"
        fontSize="52"
        fontWeight="700"
        fill="#38bdf8"
        letterSpacing="6"
      >TAP TENZ</SvgText>

      {/* Tagline */}
      <SvgText
        x={VB_W / 2} y={400}
        textAnchor="middle"
        fontSize="16"
        fontWeight="400"
        fill="#4a90b8"
        letterSpacing="3"
      >match · clear · win</SvgText>
    </Svg>
  );
}
