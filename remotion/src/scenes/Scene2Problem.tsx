import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const stats = [
  { value: "2,2T $", label: "Pertes mondiales / an" },
  { value: "80%", label: "Eaux usees non traitees" },
  { value: "40%", label: "Deficit eau d'ici 2030" },
];

export const Scene2Problem = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOp = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" });
  const titleX = interpolate(frame, [0, 25], [-40, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #0F1724 0%, #1A2332 100%)" }}>
      {/* Red accent line */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 6, height: "100%", background: "#EF4444" }} />
      
      <div style={{ padding: "80px 120px", height: "100%" }}>
        {/* Section label */}
        <div style={{ opacity: titleOp, color: "#EF4444", fontSize: 14, fontWeight: 700, letterSpacing: 4, fontFamily: "sans-serif", marginBottom: 20 }}>
          LE PROBLEME
        </div>

        {/* Title */}
        <div style={{ opacity: titleOp, transform: `translateX(${titleX}px)`, fontSize: 56, fontWeight: 800, color: "white", lineHeight: 1.15, fontFamily: "sans-serif", maxWidth: 800 }}>
          L'eau : la crise invisible qui menace les entreprises
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 40, marginTop: 80 }}>
          {stats.map((s, i) => {
            const delay = 30 + i * 15;
            const op = interpolate(frame, [delay, delay + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const sc = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 200 } });
            return (
              <div key={s.value} style={{
                opacity: op,
                transform: `scale(${sc})`,
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: 16,
                padding: "40px 50px",
                textAlign: "center",
              }}>
                <div style={{ fontSize: 52, fontWeight: 800, color: "#EF4444", fontFamily: "sans-serif" }}>{s.value}</div>
                <div style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", marginTop: 8, fontFamily: "sans-serif" }}>{s.label}</div>
              </div>
            );
          })}
        </div>

        {/* Bottom text */}
        <div style={{
          opacity: interpolate(frame, [100, 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          position: "absolute", bottom: 80, left: 120, right: 120,
          fontSize: 20, color: "rgba(255,255,255,0.5)", fontFamily: "sans-serif",
        }}>
          Les entreprises ont besoin d'outils simples pour mesurer et agir.
        </div>
      </div>
    </AbsoluteFill>
  );
};
