import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Img, staticFile } from "remotion";

export const Scene6Pricing = () => {
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
      {/* Left */}
      <div style={{ flex: "0 0 380px", display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{
          opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
          fontSize: 14,
          fontWeight: 700,
          color: "#EC4899",
          fontFamily: "sans-serif",
          letterSpacing: 3,
          textTransform: "uppercase",
        }}>
          Tarification
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
          3 Plans : Gratuit, Pro & Entreprise
        </div>
        <div style={{
          opacity: interpolate(frame, [25, 45], [0, 1], { extrapolateRight: "clamp" }),
          fontSize: 18,
          color: "#94A3B8",
          fontFamily: "sans-serif",
          lineHeight: 1.6,
        }}>
          Modèle Freemium avec calculateur gratuit. Plans Pro à 99 DT/mois et Entreprise à 299 DT/mois.
        </div>
      </div>

      {/* Right - screenshot */}
      <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", marginLeft: 40 }}>
        <div style={{
          opacity: interpolate(frame, [15, 35], [0, 1], { extrapolateRight: "clamp" }),
          transform: `scale(${interpolate(spring({ frame: frame - 15, fps, config: { damping: 18 } }), [0, 1], [0.9, 1])}) translateY(${float}px)`,
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
        }}>
          <Img src={staticFile("images/page-pricing.png")} style={{ width: 1200, display: "block" }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
