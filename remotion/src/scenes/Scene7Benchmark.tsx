import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Img, staticFile } from "remotion";

export const Scene7Benchmark = () => {
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
          <Img src={staticFile("images/page-dashboard3.png")} style={{ width: 1100, display: "block" }} />
        </div>
      </div>

      <div style={{ flex: "0 0 440px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{
          opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
          fontSize: 13, fontWeight: 700, color: "#06B6D4", fontFamily: "sans-serif",
          letterSpacing: 3, textTransform: "uppercase",
        }}>
          Benchmarks & Alertes
        </div>
        <div style={{
          opacity: interpolate(frame, [10, 30], [0, 1], { extrapolateRight: "clamp" }),
          transform: `translateY(${interpolate(spring({ frame: frame - 10, fps, config: { damping: 20 } }), [0, 1], [30, 0])}px)`,
          fontSize: 36, fontWeight: 800, color: "white", fontFamily: "sans-serif",
          lineHeight: 1.15, letterSpacing: -1,
        }}>
          Suivi objectifs & benchmark sectoriel
        </div>
        <div style={{
          opacity: interpolate(frame, [20, 40], [0, 1], { extrapolateRight: "clamp" }),
          fontSize: 16, color: "#94A3B8", fontFamily: "sans-serif", lineHeight: 1.7,
        }}>
          Le tableau de bord intègre un benchmark sectoriel (Top 35% agroalimentaire), un suivi des objectifs de réduction avec jauges visuelles, et un système d'alertes en temps réel : fuites détectées, hausses de consommation et échéances réglementaires ANPE.
        </div>

        {["Benchmark sectoriel", "Objectifs de réduction", "Alertes critiques", "Potentiel d'économie"].map((text, i) => (
          <div key={i} style={{
            opacity: interpolate(frame, [40 + i * 8, 55 + i * 8], [0, 1], { extrapolateRight: "clamp" }),
            transform: `translateX(${interpolate(spring({ frame: frame - 40 - i * 8, fps, config: { damping: 18 } }), [0, 1], [25, 0])}px)`,
            background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.2)",
            borderRadius: 8, padding: "6px 14px", fontSize: 13, color: "#22D3EE",
            fontFamily: "sans-serif", fontWeight: 600, width: "fit-content",
          }}>
            {text}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
