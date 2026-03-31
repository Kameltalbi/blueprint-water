import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Img, staticFile } from "remotion";

export const Scene6Stress = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const float = Math.sin(frame * 0.025) * 4;

  return (
    <AbsoluteFill style={{
      background: "linear-gradient(150deg, #0B1622 0%, #0F2035 100%)",
      display: "flex", flexDirection: "row", alignItems: "center", padding: "60px 80px",
    }}>
      <div style={{ flex: "0 0 420px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{
          opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
          fontSize: 13, fontWeight: 700, color: "#EF4444", fontFamily: "sans-serif",
          letterSpacing: 3, textTransform: "uppercase",
        }}>
          Stress hydrique
        </div>
        <div style={{
          opacity: interpolate(frame, [10, 30], [0, 1], { extrapolateRight: "clamp" }),
          transform: `translateY(${interpolate(spring({ frame: frame - 10, fps, config: { damping: 20 } }), [0, 1], [30, 0])}px)`,
          fontSize: 36, fontWeight: 800, color: "white", fontFamily: "sans-serif",
          lineHeight: 1.15, letterSpacing: -1,
        }}>
          Carte d'impact géographique WSI
        </div>
        <div style={{
          opacity: interpolate(frame, [20, 40], [0, 1], { extrapolateRight: "clamp" }),
          fontSize: 16, color: "#94A3B8", fontFamily: "sans-serif", lineHeight: 1.7,
        }}>
          La heatmap affiche le stress hydrique pondéré par site et par pays (source: Aqueduct/WRI). Chaque barre montre l'impact en m³ équivalent, avec un code couleur allant du vert (faible) au rouge (extrême). Cette vue aide à prioriser les actions de réduction là où le stress est le plus critique.
        </div>

        {["Tunisie — WSI 4.2 (Extrême)", "Inde — WSI 3.9 (Élevé)", "Maroc — WSI 3.8 (Élevé)", "France — WSI 1.5 (Faible)"].map((text, i) => (
          <div key={i} style={{
            opacity: interpolate(frame, [40 + i * 7, 53 + i * 7], [0, 1], { extrapolateRight: "clamp" }),
            transform: `translateX(${interpolate(spring({ frame: frame - 40 - i * 7, fps, config: { damping: 18 } }), [0, 1], [20, 0])}px)`,
            display: "flex", alignItems: "center", gap: 10,
            fontSize: 14, color: "#CBD5E1", fontFamily: "sans-serif",
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: 4, flexShrink: 0,
              background: i === 0 ? "#EF4444" : i < 3 ? "#F97316" : "#10B981",
            }} />
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
          <Img src={staticFile("images/page-dashboard2.png")} style={{ width: 1100, display: "block" }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
