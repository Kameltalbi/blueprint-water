import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export const Scene1Intro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgScale = interpolate(frame, [0, 210], [1.05, 1], { extrapolateRight: "clamp" });
  
  const logoOpacity = interpolate(frame, [10, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const logoY = interpolate(frame, [10, 40], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const titleOpacity = interpolate(frame, [35, 65], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [35, 65], [40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const subtitleOpacity = interpolate(frame, [60, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const tagOpacity = interpolate(frame, [90, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tagScale = spring({ frame: frame - 90, fps, config: { damping: 15, stiffness: 200 } });

  // Floating circles
  const c1Y = Math.sin(frame * 0.03) * 20;
  const c2Y = Math.cos(frame * 0.025) * 15;

  return (
    <AbsoluteFill style={{ background: "linear-gradient(135deg, #0F1724 0%, #015486 50%, #0EA5E9 100%)", transform: `scale(${bgScale})` }}>
      {/* Decorative circles */}
      <div style={{ position: "absolute", right: 200, top: 150 + c1Y, width: 400, height: 400, borderRadius: "50%", background: "rgba(14,165,233,0.08)", transform: `translateY(${c1Y}px)` }} />
      <div style={{ position: "absolute", left: 100, bottom: 100 + c2Y, width: 250, height: 250, borderRadius: "50%", background: "rgba(255,255,255,0.03)" }} />
      
      {/* Content */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: "0 120px" }}>
        {/* Logo */}
        <div style={{ opacity: logoOpacity, transform: `translateY(${logoY}px)`, fontSize: 28, fontWeight: 800, color: "white", letterSpacing: 6, fontFamily: "sans-serif", marginBottom: 40 }}>
          HYDROSCAN
        </div>

        {/* Title */}
        <div style={{ opacity: titleOpacity, transform: `translateY(${titleY}px)`, textAlign: "center" }}>
          <div style={{ fontSize: 72, fontWeight: 800, color: "white", lineHeight: 1.1, fontFamily: "sans-serif" }}>
            Mesurez votre
          </div>
          <div style={{ fontSize: 80, fontWeight: 800, color: "#7DD3FC", lineHeight: 1.1, fontFamily: "sans-serif", marginTop: 8 }}>
            Empreinte Eau
          </div>
        </div>

        {/* Subtitle */}
        <div style={{ opacity: subtitleOpacity, fontSize: 24, color: "rgba(255,255,255,0.7)", marginTop: 40, textAlign: "center", fontFamily: "sans-serif", maxWidth: 700 }}>
          La plateforme universelle de calcul d'empreinte eau pour tous les secteurs
        </div>

        {/* Tag */}
        <div style={{ opacity: tagOpacity, transform: `scale(${tagScale})`, marginTop: 50, display: "flex", gap: 20 }}>
          {["ISO 14046", "13 Secteurs", "500+ Coefficients"].map((t, i) => (
            <div key={t} style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 30,
              padding: "10px 24px",
              color: "white",
              fontSize: 16,
              fontWeight: 600,
              fontFamily: "sans-serif",
              opacity: interpolate(frame, [95 + i * 8, 110 + i * 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            }}>
              {t}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
