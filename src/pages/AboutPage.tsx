import { PageMeta } from "@/components/PageMeta";
import { useI18n } from "@/lib/i18n";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function AboutPage() {
  const { lang } = useI18n();
  const fr = lang === "fr";

  return (
    <div className="min-h-screen bg-card font-sans">
      <PageMeta
        title={fr ? "À propos — HydroScan" : "About — HydroScan"}
        description={fr ? "Découvrez l'histoire, la mission et l'équipe derrière HydroScan." : "Discover the story, mission and team behind HydroScan."}
      />

      <LandingHeader activePage="apropos" />

      <section className="pt-32 pb-24 px-[5%]">
        <div className="mx-auto max-w-[800px] text-center">
          <p className="text-xs font-bold tracking-[0.18em] uppercase text-primary mb-3">
            {fr ? "À propos" : "About"}
          </p>
          <h1 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-extrabold text-foreground leading-tight mb-6">
            {fr ? "À propos de HydroScan" : "About HydroScan"}
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            {fr
              ? "Contenu à venir. Cette page présentera la mission, l'équipe et les valeurs de HydroScan."
              : "Content coming soon. This page will present HydroScan's mission, team and values."}
          </p>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
