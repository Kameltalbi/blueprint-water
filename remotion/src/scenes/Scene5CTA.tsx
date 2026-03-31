import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export const Scene5CTA = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgPulse = 1 + Math.sin(frame * 0.05) * 0.02;
  const titleOp = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const titleSc = spring({ frame, fps, config: { damping: 12 } });
  const subOp = interpolate(frame, [30, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const askOp = interpolate(frame, [55, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const askSc = spring({ frame: frame - 55, fps, config: { damping: 15, stiffness: 150 } });
  const contactOp = interpolate(frame, [90, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: `linear-gradient(135deg, #015486, #0EA5E9)`, transform: `scale(${bgPulse})` }}>
      {/* Decorative */}
      <div style={{ position: "absolute", right: 150, bottom: 150, width: 350, height: 350, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
      <div style={{ position: "absolute", left: 200, top: 100, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.03)" }} />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center", padding: "0 120px" }}>
        <div style={{ opacity: titleOp, transform: `scale(${titleSc})`, fontSize: 58, fontWeight: 800, color: "white", lineHeight: 1.2, fontFamily: "sans-serif" }}>
          Rejoignez l'aventure
          <br />
          <span style={{ color: "#BAE6FD" }}>HydroScan</span>
        </div>

        <div style={{ opacity: subOp, fontSize: 22, color: "rgba(255,255,255,0.7)", marginTop: 30, fontFamily: "sans-serif" }}>
          Investissez dans la gestion durable de l'eau
        </div>

        {/* Ask box */}
        <div style={{
          opacity: askOp,
          transform: `scale(${askSc})`,
          background: "rgba(255,255,255,0.12)",
          borderRadius: 20,
          padding: "30px 60px",
          marginTop: 50,
        }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: 3, fontFamily: "sans-serif" }}>LEVEE DE FONDS SEED</div>
          <div style={{ fontSize: 52, fontWeight: 800, color: "white", fontFamily: "sans-serif", marginTop: 8 }}>500 000 TND</div>
        </div>

        <div style={{ opacity: contactOp, marginTop: 50, fontSize: 16, color: "rgba(255,255,255,0.6)", fontFamily: "sans-serif" }}>
          contact@ktconsulting.info  |  +216 55 053 505
        </div>
      </div>
    </AbsoluteFill>
  );
};
