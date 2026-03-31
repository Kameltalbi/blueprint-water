import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const items = [
  { num: "13", label: "Secteurs couverts", sub: "Textile, Agriculture, Energie..." },
  { num: "500+", label: "Coefficients WFN", sub: "Base de donnees integree" },
  { num: "x10", label: "ROI client", sub: "Des la premiere annee" },
  { num: "ISO", label: "14046 conforme", sub: "Standard international" },
];

export const Scene4Features = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOp = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #0F1724 0%, #0D2137 100%)" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 6, height: "100%", background: "#0EA5E9" }} />

      <div style={{ padding: "80px 120px", height: "100%", display: "flex", flexDirection: "column" }}>
        <div style={{ opacity: titleOp, color: "#0EA5E9", fontSize: 14, fontWeight: 700, letterSpacing: 4, fontFamily: "sans-serif", marginBottom: 16 }}>
          CHIFFRES CLES
        </div>
        <div style={{ opacity: titleOp, fontSize: 48, fontWeight: 800, color: "white", fontFamily: "sans-serif", marginBottom: 60 }}>
          Des resultats concrets
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30, flex: 1 }}>
          {items.map((item, i) => {
            const delay = 25 + i * 20;
            const op = interpolate(frame, [delay, delay + 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const sc = spring({ frame: frame - delay, fps, config: { damping: 15 } });
            const float = Math.sin((frame + i * 30) * 0.04) * 3;
            return (
              <div key={item.num} style={{
                opacity: op,
                transform: `scale(${sc}) translateY(${float}px)`,
                background: "rgba(14,165,233,0.06)",
                border: "1px solid rgba(14,165,233,0.15)",
                borderRadius: 20,
                padding: "40px 44px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}>
                <div style={{ fontSize: 56, fontWeight: 800, color: "#0EA5E9", fontFamily: "sans-serif" }}>{item.num}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "white", marginTop: 8, fontFamily: "sans-serif" }}>{item.label}</div>
                <div style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", marginTop: 4, fontFamily: "sans-serif" }}>{item.sub}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
