import { PageMeta } from "@/components/PageMeta";
import { useI18n } from "@/lib/i18n";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function ResourcesPage() {
  const { lang } = useI18n();
  const fr = lang === "fr";

  return (
    <div className="min-h-screen bg-card font-sans">
      <PageMeta
        title={fr ? "Ressources — HydroScan" : "Resources — HydroScan"}
        description={fr ? "Guides, documentation et ressources sur l'empreinte eau." : "Guides, documentation and resources on water footprint."}
      />

      <LandingHeader activePage="ressources" />

      <section className="pt-32 pb-24 px-[5%]">
        <div className="mx-auto max-w-[800px] text-center">
          <p className="text-xs font-bold tracking-[0.18em] uppercase text-primary mb-3">
            {fr ? "Ressources" : "Resources"}
          </p>
          <h1 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-extrabold text-foreground leading-tight mb-6">
            {fr ? "Ressources" : "Resources"}
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            {fr
              ? "Contenu à venir. Cette page contiendra des guides, articles et documentation technique."
              : "Content coming soon. This page will contain guides, articles and technical documentation."}
          </p>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
