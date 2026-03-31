import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const features = [
  { icon: "ISO", title: "Calcul ISO 14046", desc: "Eau Verte / Bleue / Grise" },
  { icon: "5'", title: "Resultats en 5 min", desc: "Interface guidee simple" },
  { icon: "VS", title: "Benchmarks", desc: "Comparez votre secteur" },
  { icon: "PDF", title: "Rapports certifies", desc: "Word & PDF exportables" },
];

export const Scene3Solution = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOp = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [0, 25], [30, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "linear-gradient(135deg, #015486 0%, #0EA5E9 100%)" }}>
      {/* Decorative */}
      <div style={{ position: "absolute", right: -100, top: -100, width: 500, height: 500, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
      
      <div style={{ padding: "80px 120px", height: "100%" }}>
        <div style={{ opacity: titleOp, color: "rgba(255,255,255,0.7)", fontSize: 14, fontWeight: 700, letterSpacing: 4, fontFamily: "sans-serif", marginBottom: 16 }}>
          LA SOLUTION
        </div>

        <div style={{ opacity: titleOp, transform: `translateY(${titleY}px)` }}>
          <div style={{ fontSize: 52, fontWeight: 800, color: "white", lineHeight: 1.15, fontFamily: "sans-serif" }}>
            HydroScan : mesurez,
          </div>
          <div style={{ fontSize: 52, fontWeight: 800, color: "#7DD3FC", lineHeight: 1.15, fontFamily: "sans-serif" }}>
            comprenez, agissez
          </div>
        </div>

        {/* Feature cards */}
        <div style={{ display: "flex", gap: 24, marginTop: 70 }}>
          {features.map((f, i) => {
            const delay = 40 + i * 18;
            const op = interpolate(frame, [delay, delay + 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const y = interpolate(frame, [delay, delay + 25], [40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <div key={f.icon} style={{
                opacity: op,
                transform: `translateY(${y}px)`,
                background: "rgba(255,255,255,0.1)",
                borderRadius: 16,
                padding: "36px 32px",
                flex: 1,
                textAlign: "center",
              }}>
                <div style={{
                  width: 56, height: 56, borderRadius: "50%",
                  background: "rgba(255,255,255,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 16px",
                  fontSize: 18, fontWeight: 800, color: "white", fontFamily: "sans-serif",
                }}>
                  {f.icon}
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "white", fontFamily: "sans-serif" }}>{f.title}</div>
                <div style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", marginTop: 8, fontFamily: "sans-serif" }}>{f.desc}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
