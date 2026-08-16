import React from "react";

// Porta 1:1 de not-a-mono/src/components/mono/MonoSlab.tsx
const THETA = 16;
const DIRS = [-1, 1, -1, 1];

function rot(
  px: number,
  py: number,
  ox: number,
  oy: number,
  deg: number,
): [number, number] {
  const a = (deg * Math.PI) / 180;
  const dx = px - ox;
  const dy = py - oy;
  return [
    ox + dx * Math.cos(a) - dy * Math.sin(a),
    oy + dx * Math.sin(a) + dy * Math.cos(a),
  ];
}

interface MonoSlabProps {
  size?: number;
  t: number;
  color: string;
}

export const MonoSlab: React.FC<MonoSlabProps> = ({ size = 56, t, color }) => {
  const S = size;
  const W = S * 0.3;
  const H = S * 0.142;
  const GAP = S * 0.026;
  const cx = S / 2;
  const angles = DIRS.map((d) => d * THETA * t);

  let P: [number, number] = [cx, 0];
  const ys = [0];
  for (const a of angles) {
    P = rot(P[0], P[1] + H + GAP, P[0], P[1], a);
    ys.push(P[1]);
  }
  const span = Math.max(...ys) - Math.min(...ys);
  const yoff = (S - span) / 2 - Math.min(...ys);

  const segs: { x: number; y: number; a: number }[] = [];
  P = [cx, yoff];
  for (const a of angles) {
    segs.push({ x: P[0] - W / 2, y: P[1], a });
    P = rot(P[0], P[1] + H + GAP, P[0], P[1], a);
  }

  return (
    <div style={{ position: "relative", width: S, height: S }}>
      {segs.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: W,
            height: H,
            backgroundColor: color,
            transformOrigin: "top",
            transform: `translate(${s.x}px, ${s.y}px) rotate(${s.a}deg)`,
          }}
        />
      ))}
    </div>
  );
};

interface MonoBadgeProps {
  size?: number;
  t?: number;
  amber: string;
  figure: string;
}

export const MonoBadge: React.FC<MonoBadgeProps> = ({
  size = 40,
  t = 0,
  amber,
  figure,
}) => {
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        width: size,
        height: size,
        borderRadius: "22%",
        backgroundColor: amber,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <MonoSlab size={size} t={t} color={figure} />
    </div>
  );
};
