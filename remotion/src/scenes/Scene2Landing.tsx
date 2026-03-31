import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Img, staticFile } from "remotion";

export const Scene2Landing = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const labelX = interpolate(spring({ frame, fps, config: { damping: 20 } }), [0, 1], [-40, 0]);

  const imgScale = interpolate(
    spring({ frame: frame - 15, fps, config: { damping: 18 } }),
    [0, 1], [0.9, 1]
  );
  const imgOpacity = interpolate(frame, [15, 35], [0, 1], { extrapolateRight: "clamp" });

  const float = Math.sin(frame * 0.025) * 4;

  return (
    <AbsoluteFill style={{
      background: "linear-gradient(150deg, #0B1622 0%, #0F2035 100%)",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      padding: "60px 80px",
    }}>
      {/* Left side - text */}
      <div style={{ flex: "0 0 380px", display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{
          opacity: labelOpacity,
          transform: `translateX(${labelX}px)`,
          fontSize: 14,
          fontWeight: 700,
          color: "#0EA5E9",
          fontFamily: "sans-serif",
          letterSpacing: 3,
          textTransform: "uppercase",
        }}>
          Page d'accueil
        </div>
        <div style={{
          opacity: interpolate(frame, [10, 30], [0, 1], { extrapolateRight: "clamp" }),
          transform: `translateY(${interpolate(spring({ frame: frame - 10, fps, config: { damping: 20 } }), [0, 1], [30, 0])}px)`,
          fontSize: 42,
          fontWeight: 800,
          color: "white",
          fontFamily: "sans-serif",
          lineHeight: 1.15,
          letterSpacing: -1,
        }}>
          Landing Page avec Hero & Statistiques
        </div>
        <div style={{
          opacity: interpolate(frame, [25, 45], [0, 1], { extrapolateRight: "clamp" }),
          fontSize: 18,
          color: "#94A3B8",
          fontFamily: "sans-serif",
          lineHeight: 1.6,
        }}>
          Certification ISO 14046, 12 secteurs couverts, 500+ coefficients WFN.
        </div>

        {/* Feature pills */}
        {["Sections animées", "Responsive", "SEO optimisé"].map((text, i) => (
          <div key={i} style={{
            opacity: interpolate(frame, [40 + i * 10, 55 + i * 10], [0, 1], { extrapolateRight: "clamp" }),
            transform: `translateX(${interpolate(spring({ frame: frame - 40 - i * 10, fps, config: { damping: 18 } }), [0, 1], [20, 0])}px)`,
            background: "rgba(14,165,233,0.1)",
            border: "1px solid rgba(14,165,233,0.2)",
            borderRadius: 8,
            padding: "8px 16px",
            fontSize: 14,
            color: "#0EA5E9",
            fontFamily: "sans-serif",
            fontWeight: 600,
            display: "inline-block",
            width: "fit-content",
          }}>
            {text}
          </div>
        ))}
      </div>

      {/* Right side - screenshot */}
      <div style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 40,
      }}>
        <div style={{
          opacity: imgOpacity,
          transform: `scale(${imgScale}) translateY(${float}px)`,
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
        }}>
          <Img src={staticFile("images/page-landing.png")} style={{ width: 1200, display: "block" }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
