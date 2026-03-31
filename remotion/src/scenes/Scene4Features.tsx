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
      <div style={{ flex: "0 0 420px", display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{
          opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
          fontSize: 13, fontWeight: 700, color: "#F59E0B", fontFamily: "sans-serif",
          letterSpacing: 3, textTransform: "uppercase",
        }}>
          Fonctionnalités
        </div>
        <div style={{
          opacity: interpolate(frame, [10, 30], [0, 1], { extrapolateRight: "clamp" }),
          transform: `translateY(${interpolate(spring({ frame: frame - 10, fps, config: { damping: 20 } }), [0, 1], [30, 0])}px)`,
          fontSize: 36, fontWeight: 800, color: "white", fontFamily: "sans-serif",
          lineHeight: 1.15, letterSpacing: -1,
        }}>
          6 outils pour mesurer et agir
        </div>
        <div style={{
          opacity: interpolate(frame, [20, 40], [0, 1], { extrapolateRight: "clamp" }),
          fontSize: 16, color: "#94A3B8", fontFamily: "sans-serif", lineHeight: 1.7,
        }}>
          Cette page détaille les capacités de la plateforme : calcul certifié ISO 14046, résultats instantanés avec décomposition eau verte/bleue/grise, benchmarks sectoriels, rapports professionnels exportables et plan d'action IA personnalisé.
        </div>

        {["Empreinte eau complète", "Carte stress hydrique", "Chaîne d'approvisionnement", "Plan d'action IA", "Rapports PDF/Word", "Conformité ANPE & CSRD"].map((text, i) => (
          <div key={i} style={{
            opacity: interpolate(frame, [35 + i * 6, 48 + i * 6], [0, 1], { extrapolateRight: "clamp" }),
            transform: `translateX(${interpolate(spring({ frame: frame - 35 - i * 6, fps, config: { damping: 18 } }), [0, 1], [20, 0])}px)`,
            display: "flex", alignItems: "center", gap: 10,
            fontSize: 14, color: "#CBD5E1", fontFamily: "sans-serif",
          }}>
            <span style={{ color: "#F59E0B" }}>✓</span>
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
          <Img src={staticFile("images/page-features.png")} style={{ width: 1100, display: "block" }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
