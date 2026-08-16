import React from "react";
import { AbsoluteFill } from "remotion";
import { loadFont } from "@remotion/google-fonts/GeistMono";
import { MonoBadge } from "./MonoSlab";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "500"],
  subsets: ["latin"],
});

// tokens 1:1 com not-a-mono/src/index.css (tema claro, alinhado ao portfólio)
const colors = {
  ground: "#fafafa",
  amber: "#ea580c",
  figure: "#fafafa",
  bone: "#27272a",
  slate: "#71717a",
};

export const LinkedInCover: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: colors.ground }}>
      {/* grid sutil do portfólio — idêntico ao body de index.css */}
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
          backgroundPosition: "0 17px",
        }}
      />

      {/* reserva: foto de perfil do LinkedIn sobrepõe o canto inferior esquerdo — mantido livre */}

      {/* wordmark — porta de src/components/shell/Wordmark.tsx */}
      <div
        style={{
          position: "absolute",
          top: 44,
          left: 64,
          fontFamily,
          fontSize: 30,
          fontWeight: 500,
          letterSpacing: "-0.04em",
          color: colors.bone,
        }}
      >
        <span style={{ fontWeight: 400, color: colors.amber }}>[</span>
        mono
        <span style={{ fontWeight: 400, color: colors.amber }}>]</span>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
          paddingLeft: 900,
        }}
      >
        <MonoBadge size={150} t={1} amber={colors.amber} figure={colors.figure} />

        <div
          style={{
            fontFamily,
            fontWeight: 400,
            fontSize: 14,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: colors.slate,
          }}
        >
          em construção
        </div>
      </div>
    </AbsoluteFill>
  );
};
