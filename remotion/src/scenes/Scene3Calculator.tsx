import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Img, staticFile } from "remotion";

export const Scene3Calculator = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const float = Math.sin(frame * 0.025) * 4;

  return (
    <AbsoluteFill style={{
      background: "linear-gradient(150deg, #0D2137 0%, #0B1622 100%)",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      padding: "60px 80px",
    }}>
      {/* Left - screenshot */}
      <div style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 40,
      }}>
        <div style={{
          opacity: interpolate(frame, [10, 30], [0, 1], { extrapolateRight: "clamp" }),
          transform: `scale(${interpolate(spring({ frame: frame - 10, fps, config: { damping: 18 } }), [0, 1], [0.9, 1])}) translateY(${float}px)`,
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
        }}>
          <Img src={staticFile("images/page-calculator.png")} style={{ width: 1200, display: "block" }} />
        </div>
      </div>

      {/* Right - text */}
      <div style={{ flex: "0 0 420px", display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{
          opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
          fontSize: 14,
          fontWeight: 700,
          color: "#10B981",
          fontFamily: "sans-serif",
          letterSpacing: 3,
          textTransform: "uppercase",
        }}>
          Calculateur
        </div>
        <div style={{
          opacity: interpolate(frame, [10, 30], [0, 1], { extrapolateRight: "clamp" }),
          transform: `translateY(${interpolate(spring({ frame: frame - 10, fps, config: { damping: 20 } }), [0, 1], [30, 0])}px)`,
          fontSize: 40,
          fontWeight: 800,
          color: "white",
          fontFamily: "sans-serif",
          lineHeight: 1.15,
          letterSpacing: -1,
        }}>
          Calcul d'Empreinte Eau en 4 étapes
        </div>
        <div style={{
          opacity: interpolate(frame, [25, 45], [0, 1], { extrapolateRight: "clamp" }),
          fontSize: 18,
          color: "#94A3B8",
          fontFamily: "sans-serif",
          lineHeight: 1.6,
        }}>
          Eau Verte, Bleue et Grise avec pondération WSI locale. 100% gratuit, sans inscription.
        </div>

        {/* Steps */}
        {["1. Secteur & produit", "2. Matières premières", "3. Processus industriels", "4. Effluents & résultats"].map((text, i) => (
          <div key={i} style={{
            opacity: interpolate(frame, [40 + i * 8, 55 + i * 8], [0, 1], { extrapolateRight: "clamp" }),
            transform: `translateX(${interpolate(spring({ frame: frame - 40 - i * 8, fps, config: { damping: 18 } }), [0, 1], [30, 0])}px)`,
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 16,
            color: "#CBD5E1",
            fontFamily: "sans-serif",
          }}>
            <div style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              background: "#10B981",
              flexShrink: 0,
            }} />
            {text}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
