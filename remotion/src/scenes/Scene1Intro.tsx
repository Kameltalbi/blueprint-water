import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Img, staticFile } from "remotion";

export const Scene1Intro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 15, stiffness: 80 } });
  const logoOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  
  const titleY = interpolate(
    spring({ frame: frame - 20, fps, config: { damping: 20 } }),
    [0, 1], [60, 0]
  );
  const titleOpacity = interpolate(frame, [20, 40], [0, 1], { extrapolateRight: "clamp" });

  const subtitleOpacity = interpolate(frame, [45, 65], [0, 1], { extrapolateRight: "clamp" });
  const subtitleY = interpolate(
    spring({ frame: frame - 45, fps, config: { damping: 20 } }),
    [0, 1], [40, 0]
  );

  const badgeOpacity = interpolate(frame, [70, 90], [0, 1], { extrapolateRight: "clamp" });
  const badgeScale = spring({ frame: frame - 70, fps, config: { damping: 12 } });

  const float = Math.sin(frame * 0.03) * 5;

  return (
    <AbsoluteFill style={{
      background: "linear-gradient(135deg, #0B1622 0%, #0D2137 40%, #0A1929 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
    }}>
      <div style={{
        position: "absolute",
        width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)",
        top: -100, right: -100, transform: `translateY(${float}px)`,
      }} />
      <div style={{
        position: "absolute",
        width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(1,84,134,0.1) 0%, transparent 70%)",
        bottom: -50, left: -50, transform: `translateY(${-float}px)`,
      }} />

      <div style={{ opacity: logoOpacity, transform: `scale(${logoScale}) translateY(${float}px)`, marginBottom: 30 }}>
        <Img src={staticFile("images/logo.png")} style={{ height: 120, objectFit: "contain" }} />
      </div>

      <div style={{
        opacity: titleOpacity, transform: `translateY(${titleY}px)`,
        fontSize: 72, fontWeight: 800, color: "white", textAlign: "center",
        fontFamily: "sans-serif", letterSpacing: -2,
      }}>
        Demo Walkthrough
      </div>

      <div style={{
        opacity: subtitleOpacity, transform: `translateY(${subtitleY}px)`,
        fontSize: 28, color: "#94A3B8", textAlign: "center",
        fontFamily: "sans-serif", marginTop: 16, maxWidth: 700,
      }}>
        Plateforme de calcul d'empreinte eau — ISO 14046
      </div>

      <div style={{
        opacity: badgeOpacity, transform: `scale(${badgeScale})`, marginTop: 40,
        background: "rgba(14,165,233,0.15)", border: "1px solid rgba(14,165,233,0.3)",
        borderRadius: 50, padding: "10px 28px", fontSize: 16, color: "#0EA5E9",
        fontWeight: 600, fontFamily: "sans-serif",
      }}>
        SaaS - React - TypeScript - Supabase
      </div>
    </AbsoluteFill>
  );
};
