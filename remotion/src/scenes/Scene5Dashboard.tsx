import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Img, staticFile } from "remotion";

export const Scene5Dashboard = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const float = Math.sin(frame * 0.025) * 4;

  return (
    <AbsoluteFill style={{
      background: "linear-gradient(150deg, #0D2137 0%, #0B1622 100%)",
      display: "flex", flexDirection: "row", alignItems: "center", padding: "60px 80px",
    }}>
      <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", marginRight: 40 }}>
        <div style={{
          opacity: interpolate(frame, [10, 30], [0, 1], { extrapolateRight: "clamp" }),
          transform: `scale(${interpolate(spring({ frame: frame - 10, fps, config: { damping: 18 } }), [0, 1], [0.9, 1])}) translateY(${float}px)`,
          borderRadius: 16, overflow: "hidden",
          boxShadow: "0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
        }}>
          <Img src={staticFile("images/page-dashboard.png")} style={{ width: 1100, display: "block" }} />
        </div>
      </div>

      <div style={{ flex: "0 0 440px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{
          opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
          fontSize: 13, fontWeight: 700, color: "#8B5CF6", fontFamily: "sans-serif",
          letterSpacing: 3, textTransform: "uppercase",
        }}>
          Espace connecté
        </div>
        <div style={{
          opacity: interpolate(frame, [10, 30], [0, 1], { extrapolateRight: "clamp" }),
          transform: `translateY(${interpolate(spring({ frame: frame - 10, fps, config: { damping: 20 } }), [0, 1], [30, 0])}px)`,
          fontSize: 36, fontWeight: 800, color: "white", fontFamily: "sans-serif",
          lineHeight: 1.15, letterSpacing: -1,
        }}>
          Tableau de bord en temps réel
        </div>
        <div style={{
          opacity: interpolate(frame, [20, 40], [0, 1], { extrapolateRight: "clamp" }),
          fontSize: 16, color: "#94A3B8", fontFamily: "sans-serif", lineHeight: 1.7,
        }}>
          Une fois connecté, l'utilisateur accède à son tableau de bord personnalisé : KPIs globaux (volume total, score, sources), graphiques interactifs (mix par source, analyse par site) et filtres par période et localisation. Les données sont connectées en temps réel à Supabase.
        </div>

        {["Score environnemental A-E", "Mix hydrique par source", "Filtres site & période", "Données temps réel"].map((text, i) => (
          <div key={i} style={{
            opacity: interpolate(frame, [40 + i * 8, 55 + i * 8], [0, 1], { extrapolateRight: "clamp" }),
            transform: `translateX(${interpolate(spring({ frame: frame - 40 - i * 8, fps, config: { damping: 18 } }), [0, 1], [25, 0])}px)`,
            background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)",
            borderRadius: 8, padding: "6px 14px", fontSize: 13, color: "#A78BFA",
            fontFamily: "sans-serif", fontWeight: 600, width: "fit-content",
          }}>
            {text}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
