import React from "react";
import { AbsoluteFill } from "remotion";
import { loadFont } from "@remotion/google-fonts/GeistMono";
import { MonoBadge } from "./MonoSlab";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "600"],
  subsets: ["latin"],
});

// mesmos tokens do tema claro de not-a-mono/src/index.css
const colors = {
  ground: "#fafafa",
  amber: "#ea580c",
  figure: "#fafafa",
  bone: "#27272a",
  slate: "#71717a",
};

export const GmailSignature: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: colors.ground }}>
      {/* grid sutil idêntico ao da capa do LinkedIn e ao body de index.css */}
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
          backgroundPosition: "0 17px",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          paddingLeft: 28,
        }}
      >
        <MonoBadge size={92} t={1} amber={colors.amber} figure={colors.figure} />

        <div style={{ marginLeft: 22, display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontFamily,
              fontWeight: 600,
              fontSize: 22,
              letterSpacing: "-0.02em",
              color: colors.bone,
            }}
          >
            Jansen Alves Raimundo
          </div>

          <div
            style={{
              fontFamily,
              fontWeight: 400,
              fontSize: 14,
              color: colors.slate,
              marginTop: 5,
            }}
          >
            Engenheiro de Software
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
