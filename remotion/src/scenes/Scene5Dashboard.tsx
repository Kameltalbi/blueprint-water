import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export const Scene5Dashboard = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const float = Math.sin(frame * 0.03) * 3;

  // Dashboard mockup cards
  const cards = [
    { title: "Tableau de bord", desc: "KPIs, graphiques, alertes temps réel", color: "#0EA5E9", icon: "📊" },
    { title: "Saisie de données", desc: "Sources, usages, volumes par site", color: "#10B981", icon: "📝" },
    { title: "Empreinte eau", desc: "Analyse Verte/Bleue/Grise + score", color: "#8B5CF6", icon: "💧" },
    { title: "Stress hydrique", desc: "Carte WSI par région et site", color: "#F59E0B", icon: "🗺️" },
    { title: "Chaîne appro.", desc: "Eau virtuelle des matières premières", color: "#EC4899", icon: "🔗" },
    { title: "Pollution", desc: "Suivi rejets & conformité réglementaire", color: "#EF4444", icon: "⚠️" },
    { title: "Recommandations", desc: "Plan d'action IA personnalisé", color: "#06B6D4", icon: "🎯" },
    { title: "Rapports", desc: "Export PDF, CSV, Word certifié ISO", color: "#84CC16", icon: "📄" },
  ];

  return (
    <AbsoluteFill style={{
      background: "linear-gradient(135deg, #0B1622 0%, #0D2137 60%, #0A1929 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 80,
    }}>
      {/* Title */}
      <div style={{
        opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
        transform: `translateY(${interpolate(spring({ frame, fps, config: { damping: 20 } }), [0, 1], [30, 0])}px)`,
        fontSize: 14,
        fontWeight: 700,
        color: "#8B5CF6",
        fontFamily: "sans-serif",
        letterSpacing: 3,
        textTransform: "uppercase",
        marginBottom: 12,
      }}>
        Espace Connecté
      </div>
      <div style={{
        opacity: interpolate(frame, [5, 25], [0, 1], { extrapolateRight: "clamp" }),
        transform: `translateY(${interpolate(spring({ frame: frame - 5, fps, config: { damping: 20 } }), [0, 1], [30, 0])}px)`,
        fontSize: 48,
        fontWeight: 800,
        color: "white",
        fontFamily: "sans-serif",
        letterSpacing: -2,
        textAlign: "center",
        marginBottom: 50,
      }}>
        8 modules de gestion de l'eau
      </div>

      {/* Cards grid */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 20,
        justifyContent: "center",
        maxWidth: 1400,
      }}>
        {cards.map((card, i) => {
          const delay = 15 + i * 8;
          const cardSpring = spring({ frame: frame - delay, fps, config: { damping: 15 } });
          return (
            <div key={i} style={{
              opacity: interpolate(frame, [delay, delay + 15], [0, 1], { extrapolateRight: "clamp" }),
              transform: `scale(${interpolate(cardSpring, [0, 1], [0.8, 1])}) translateY(${interpolate(cardSpring, [0, 1], [20, 0]) + float}px)`,
              width: 310,
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${card.color}22`,
              borderRadius: 14,
              padding: "24px 28px",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 28 }}>{card.icon}</span>
                <span style={{ fontSize: 18, fontWeight: 700, color: card.color, fontFamily: "sans-serif" }}>
                  {card.title}
                </span>
              </div>
              <span style={{ fontSize: 14, color: "#94A3B8", fontFamily: "sans-serif", lineHeight: 1.4 }}>
                {card.desc}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
