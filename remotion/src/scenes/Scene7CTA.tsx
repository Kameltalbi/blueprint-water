import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Img, staticFile } from "remotion";

export const Scene7CTA = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame: frame - 5, fps, config: { damping: 15, stiffness: 80 } });
  const float = Math.sin(frame * 0.03) * 5;

  return (
    <AbsoluteFill style={{
      background: "linear-gradient(135deg, #015486 0%, #0EA5E9 50%, #015486 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
    }}>
      {/* Logo */}
      <div style={{
        opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
        transform: `scale(${logoScale}) translateY(${float}px)`,
        marginBottom: 30,
      }}>
        <Img src={staticFile("images/logo.png")} style={{ height: 100, objectFit: "contain" }} />
      </div>

      {/* Title */}
      <div style={{
        opacity: interpolate(frame, [15, 35], [0, 1], { extrapolateRight: "clamp" }),
        transform: `translateY(${interpolate(spring({ frame: frame - 15, fps, config: { damping: 20 } }), [0, 1], [40, 0])}px)`,
        fontSize: 64,
        fontWeight: 800,
        color: "white",
        textAlign: "center",
        fontFamily: "sans-serif",
        letterSpacing: -2,
      }}>
        Mesurez votre impact.
      </div>
      <div style={{
        opacity: interpolate(frame, [25, 45], [0, 1], { extrapolateRight: "clamp" }),
        transform: `translateY(${interpolate(spring({ frame: frame - 25, fps, config: { damping: 20 } }), [0, 1], [40, 0])}px)`,
        fontSize: 64,
        fontWeight: 800,
        color: "white",
        textAlign: "center",
        fontFamily: "sans-serif",
        letterSpacing: -2,
      }}>
        Agissez pour l'eau.
      </div>

      {/* URL */}
      <div style={{
        opacity: interpolate(frame, [50, 70], [0, 1], { extrapolateRight: "clamp" }),
        marginTop: 40,
        fontSize: 22,
        color: "rgba(255,255,255,0.8)",
        fontFamily: "sans-serif",
        fontWeight: 500,
      }}>
        hydroscan.app
      </div>
    </AbsoluteFill>
  );
};
