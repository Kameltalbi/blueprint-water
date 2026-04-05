import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, X } from "lucide-react";

const SLIDES = [
  {
    emoji: "🚰",
    title: "L'eau directe — votre robinet",
    subtitle: "Ce que vous prélevez chaque jour",
    body: "HydroScan mesure toute l'eau que vous consommez directement sur site : réseau SONEDE, forages, eau de pluie récupérée, eau recyclée. C'est l'eau que vous voyez sur vos factures.",
    highlight: "Saisissez simplement vos factures ou relevés de compteur dans l'onglet Saisie des données.",
    color: "from-blue-500/20 to-cyan-500/10",
    iconColor: "text-blue-500",
  },
  {
    emoji: "📦",
    title: "L'eau indirecte — vos achats",
    subtitle: "L'eau cachée dans vos matières premières",
    body: "Chaque matière première a une « empreinte eau » invisible : 1 kg de coton = 8 200 L, 1 kg d'huile d'olive = 14 500 L. HydroScan applique automatiquement ces coefficients WFN.",
    highlight: "Déclarez vos achats dans l'onglet Chaîne logistique — l'app calcule tout.",
    color: "from-green-500/20 to-emerald-500/10",
    iconColor: "text-green-500",
  },
  {
    emoji: "🗺️",
    title: "La rareté locale — indice AWARE",
    subtitle: "Tous les m³ ne se valent pas",
    body: "1 m³ consommé à Gafsa (WSI 4.9/5) a 2× plus d'impact qu'à Jendouba. HydroScan pondère automatiquement votre consommation selon votre bassin versant ou gouvernorat.",
    highlight: "Votre score final = (eau directe + eau indirecte) × facteur de rareté locale.",
    color: "from-orange-500/20 to-amber-500/10",
    iconColor: "text-orange-500",
  },
];

const LS_KEY = "hs_show_tutorial";

interface Props {
  onClose: () => void;
}

export function OnboardingTutorial({ onClose }: Props) {
  const [slide, setSlide] = useState(0);
  const current = SLIDES[slide];
  const isLast = slide === SLIDES.length - 1;

  function dismiss() {
    localStorage.removeItem(LS_KEY);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
        {/* Header */}
        <div className={`bg-gradient-to-br ${current.color} px-6 pt-6 pb-4`}>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Bienvenue sur HydroScan · {slide + 1}/{SLIDES.length}
              </p>
              <div className="text-5xl">{current.emoji}</div>
            </div>
            <button onClick={dismiss} className="text-muted-foreground hover:text-foreground transition-colors mt-1">
              <X className="h-5 w-5" />
            </button>
          </div>
          <h2 className="mt-3 font-display text-xl font-extrabold text-foreground">{current.title}</h2>
          <p className={`text-sm font-semibold mt-0.5 ${current.iconColor}`}>{current.subtitle}</p>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">{current.body}</p>
          <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm">
            <span className="font-semibold text-primary">→ </span>{current.highlight}
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 pt-1">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                className={`h-2 rounded-full transition-all ${i === slide ? "w-6 bg-primary" : "w-2 bg-muted"}`}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          {slide > 0 && (
            <Button variant="outline" className="gap-1" onClick={() => setSlide(slide - 1)}>
              <ChevronLeft className="h-4 w-4" /> Précédent
            </Button>
          )}
          {!isLast ? (
            <Button className="flex-1 gradient-water text-primary-foreground gap-1" onClick={() => setSlide(slide + 1)}>
              Suivant <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button className="flex-1 gradient-water text-primary-foreground" onClick={dismiss}>
              C'est parti ! 🚀
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export function useShouldShowTutorial() {
  return localStorage.getItem(LS_KEY) === "1";
}
