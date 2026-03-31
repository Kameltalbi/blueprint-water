import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Img, staticFile } from "remotion";

export const Scene4Features = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const float = Math.sin(frame * 0.025) * 4;

  return (
    <AbsoluteFill style={{
      background: "linear-gradient(150deg, #0B1622 0%, #0F2035 100%)",
      display: "flex", flexDirection: "row", alignItems: "center", padding: "60px 80px",
    }}>
      <div style={{ flex: "0 0 400px", display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{
          opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
          fontSize: 14, fontWeight: 700, color: "#F59E0B", fontFamily: "sans-serif",
          letterSpacing: 3, textTransform: "uppercase",
        }}>
          Fonctionnalites
        </div>
        <div style={{
          opacity: interpolate(frame, [10, 30], [0, 1], { extrapolateRight: "clamp" }),
          transform: `translateY(${interpolate(spring({ frame: frame - 10, fps, config: { damping: 20 } }), [0, 1], [30, 0])}px)`,
          fontSize: 40, fontWeight: 800, color: "white", fontFamily: "sans-serif",
          lineHeight: 1.15, letterSpacing: -1,
        }}>
          6 outils pour mesurer et agir
        </div>
        <div style={{
          opacity: interpolate(frame, [25, 45], [0, 1], { extrapolateRight: "clamp" }),
          fontSize: 18, color: "#94A3B8", fontFamily: "sans-serif", lineHeight: 1.6,
        }}>
          De l'analyse au rapport certifie ISO, sans expertise technique.
        </div>

        {["Empreinte eau complete", "Carte stress hydrique", "Chaine d'approvisionnement", "Plan d'action IA", "Rapports PDF/Word", "Conformite ANPE et CSRD"].map((text, i) => (
          <div key={i} style={{
            opacity: interpolate(frame, [35 + i * 7, 50 + i * 7], [0, 1], { extrapolateRight: "clamp" }),
            transform: `translateX(${interpolate(spring({ frame: frame - 35 - i * 7, fps, config: { damping: 18 } }), [0, 1], [20, 0])}px)`,
            display: "flex", alignItems: "center", gap: 10,
            fontSize: 15, color: "#CBD5E1", fontFamily: "sans-serif",
          }}>
            <span style={{ color: "#F59E0B" }}>&#10003;</span>
            {text}
          </div>
        ))}
      </div>

      <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", marginLeft: 40 }}>
        <div style={{
          opacity: interpolate(frame, [15, 35], [0, 1], { extrapolateRight: "clamp" }),
          transform: `scale(${interpolate(spring({ frame: frame - 15, fps, config: { damping: 18 } }), [0, 1], [0.9, 1])}) translateY(${float}px)`,
          borderRadius: 16, overflow: "hidden",
          boxShadow: "0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
        }}>
          <Img src={staticFile("images/page-features.png")} style={{ width: 1200, display: "block" }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
