import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PageMeta } from "@/components/PageMeta";
import { useI18n } from "@/lib/i18n";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Droplets, ShieldCheck, Users, FlaskConical, Gauge, Globe, Target, BookOpen, HeartHandshake } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

export default function AboutPage() {
  const { lang } = useI18n();
  const fr = lang === "fr";

  return (
    <div className="min-h-screen bg-card font-sans">
      <PageMeta
        title="À propos — HydroScan"
        description="Mesurer l'eau avec rigueur pour mieux agir. Découvrez la mission, l'approche et les convictions de HydroScan."
      />

      <LandingHeader activePage="apropos" />

      {/* ── Hero ── */}
      <section className="pt-32 pb-20 px-[5%] bg-card">
        <motion.div initial="hidden" animate="visible" variants={stagger} className="mx-auto max-w-[800px] text-center">
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-semibold text-primary mb-7">
            <Droplets className="h-3.5 w-3.5" />
            À propos
          </motion.div>
          <motion.h1 variants={fadeUp} className="font-display text-[clamp(2.4rem,5vw,4rem)] font-extrabold leading-[1.1] text-foreground mb-6">
            Mesurer l'eau avec rigueur{" "}
            <span className="text-primary">pour mieux agir</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-muted-foreground max-w-[640px] mx-auto leading-relaxed">
            HydroScan est une plateforme conçue pour aider les organisations à comprendre, mesurer et gérer leur empreinte eau de manière fiable et conforme aux standards internationaux.
          </motion.p>
        </motion.div>
      </section>

      {/* ── Intro ── */}
      <section className="py-16 px-[5%] bg-background">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mx-auto max-w-[800px]">
          <motion.p variants={fadeUp} className="text-sm text-muted-foreground leading-relaxed mb-4">
            Aujourd'hui, de nombreuses entreprises souhaitent intégrer la gestion de l'eau dans leur stratégie environnementale. Pourtant, elles se heurtent souvent à des obstacles importants : des outils trop complexes, des méthodes peu transparentes ou des solutions réservées aux grandes organisations.
          </motion.p>
          <motion.p variants={fadeUp} className="text-sm text-muted-foreground leading-relaxed">
            HydroScan a été conçu pour répondre à ce besoin : offrir une solution rigoureuse, accessible et opérationnelle permettant aux entreprises et aux experts environnementaux de mesurer leur empreinte eau avec précision.
          </motion.p>
        </motion.div>
      </section>

      {/* ── Notre origine ── */}
      <section className="py-20 px-[5%] bg-card">
        <div className="mx-auto max-w-[900px]">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-10">
            <p className="text-xs font-bold tracking-[0.18em] uppercase text-primary mb-3">Notre origine</p>
            <h2 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] font-extrabold text-foreground leading-tight">
              Un constat partagé par de nombreux professionnels
            </h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-4">
            <motion.p variants={fadeUp} className="text-sm text-muted-foreground leading-relaxed">
              Dans de nombreux projets liés à la performance environnementale et au reporting RSE, une difficulté revenait systématiquement : l'évaluation de l'impact lié à l'eau.
            </motion.p>
            <motion.p variants={fadeUp} className="text-sm text-muted-foreground leading-relaxed">
              Dans la pratique, deux situations dominaient : certaines organisations ne mesuraient pas leur empreinte eau, d'autres tentaient de l'évaluer à l'aide de tableurs internes ou de méthodes non standardisées. Ces approches posaient un problème majeur : les résultats obtenus étaient difficiles à défendre lors d'un audit, dans un rapport RSE ou face à des parties prenantes exigeantes.
            </motion.p>

            <motion.div variants={fadeUp} className="rounded-2xl border border-border bg-background p-6 lg:p-8 my-6">
              <p className="text-sm font-semibold text-foreground mb-4">Entre ces deux réalités, il manquait une solution capable d'apporter à la fois :</p>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-start gap-3">
                  <FlaskConical className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">Une rigueur méthodologique reconnue</p>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">Une accessibilité pour les PME et les consultants</p>
                </div>
                <div className="flex items-start gap-3">
                  <Gauge className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">Une rapidité d'utilisation compatible avec les contraintes opérationnelles</p>
                </div>
              </div>
            </motion.div>

            <motion.p variants={fadeUp} className="text-sm text-muted-foreground leading-relaxed">
              HydroScan a été développé pour combler cet espace. La plateforme intègre directement les principes du Water Footprint Network et de la norme ISO 14046, tout en offrant une expérience simple et structurée permettant de transformer rapidement les données collectées en résultats exploitables.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── Nos convictions ── */}
      <section className="py-20 px-[5%] bg-background">
        <div className="mx-auto max-w-[900px]">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-10">
            <p className="text-xs font-bold tracking-[0.18em] uppercase text-primary mb-3">Nos convictions</p>
            <h2 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] font-extrabold text-foreground leading-tight">
              Ce en quoi nous croyons
            </h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid gap-6 md:grid-cols-3">
            <motion.div variants={fadeUp} className="rounded-2xl border border-border bg-card p-7">
              <FlaskConical className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-display text-base font-bold text-foreground mb-3">La rigueur scientifique est indispensable</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Un calcul d'empreinte eau n'a de valeur que s'il repose sur une méthodologie reconnue et documentée. HydroScan s'appuie sur les références internationales, notamment les travaux du Water Footprint Network et les principes de la norme ISO 14046. Chaque résultat repose sur des formules, des données et des hypothèses clairement documentées.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="rounded-2xl border border-border bg-card p-7">
              <ShieldCheck className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-display text-base font-bold text-foreground mb-3">La transparence renforce la crédibilité</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                L'empreinte eau est un indicateur puissant, mais elle possède également ses limites. Elle ne remplace pas une analyse complète des risques liés à l'eau, ni une stratégie globale de gestion hydrique. HydroScan adopte une approche transparente : les rapports expliquent clairement les hypothèses utilisées, les sources de données et les limites méthodologiques.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="rounded-2xl border border-border bg-card p-7">
              <Users className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-display text-base font-bold text-foreground mb-3">L'accessibilité est la clé du changement</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Les méthodes les plus solides ne produisent un impact réel que si elles sont utilisées à grande échelle. L'objectif de HydroScan est de rendre la mesure accessible à :
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li className="flex gap-2"><span className="text-green-water font-bold">✓</span> PME industrielles</li>
                <li className="flex gap-2"><span className="text-green-water font-bold">✓</span> Entreprises agricoles ou agroalimentaires</li>
                <li className="flex gap-2"><span className="text-green-water font-bold">✓</span> Bureaux d'études</li>
                <li className="flex gap-2"><span className="text-green-water font-bold">✓</span> Consultants en RSE et durabilité</li>
                <li className="flex gap-2"><span className="text-green-water font-bold">✓</span> Filiales régionales de groupes internationaux</li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Notre approche ── */}
      <section className="py-20 px-[5%] bg-card">
        <div className="mx-auto max-w-[900px]">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-10">
            <p className="text-xs font-bold tracking-[0.18em] uppercase text-primary mb-3">Notre approche</p>
            <h2 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] font-extrabold text-foreground leading-tight">
              Comment nous travaillons
            </h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid gap-8 md:grid-cols-3">
            <motion.div variants={fadeUp} className="rounded-2xl border border-border bg-background p-6">
              <BookOpen className="h-7 w-7 text-blue-water mb-4" />
              <h3 className="font-display text-base font-bold text-foreground mb-3">Une base scientifique solide</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Le moteur de calcul repose sur les principes du <em>Water Footprint Assessment Manual</em>. Les méthodes utilisées permettent de mesurer les trois composantes : eau verte, eau bleue et eau grise.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Les données proviennent de sources reconnues au niveau international : bases hydrologiques, agricoles et climatiques utilisées dans la recherche environnementale.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="rounded-2xl border border-border bg-background p-6">
              <Gauge className="h-7 w-7 text-green-water mb-4" />
              <h3 className="font-display text-base font-bold text-foreground mb-3">Conçu pour l'opérationnel</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                HydroScan a été pensé pour répondre aux besoins réels des organisations qui doivent produire des analyses dans des délais courts. La plateforme simplifie : collecte des données, structuration des informations, calcul de l'empreinte eau, et génération de rapports exploitables.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="rounded-2xl border border-border bg-background p-6">
              <Globe className="h-7 w-7 text-primary mb-4" />
              <h3 className="font-display text-base font-bold text-foreground mb-3">Adapté aux réalités francophones</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Les zones méditerranéennes et de nombreuses régions d'Afrique figurent parmi les territoires les plus exposés au stress hydrique. HydroScan tient compte des réalités climatiques, économiques et réglementaires de ces régions.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Repères ── */}
      <section className="py-20 px-[5%] bg-background">
        <div className="mx-auto max-w-[900px]">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
            <h2 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] font-extrabold text-foreground leading-tight">
              HydroScan en quelques repères
            </h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <motion.div variants={fadeUp}>
              <p className="font-display text-3xl font-extrabold text-primary leading-none mb-1">3</p>
              <p className="text-xs text-muted-foreground">Composantes analysées<br />(verte, bleue, grise)</p>
            </motion.div>
            <motion.div variants={fadeUp}>
              <p className="font-display text-3xl font-extrabold text-primary leading-none mb-1">ISO</p>
              <p className="text-xs text-muted-foreground">14046 / WFN<br />Standard de référence</p>
            </motion.div>
            <motion.div variants={fadeUp}>
              <p className="font-display text-3xl font-extrabold text-primary leading-none mb-1">8+</p>
              <p className="text-xs text-muted-foreground">Bases de données<br />internationales intégrées</p>
            </motion.div>
            <motion.div variants={fadeUp}>
              <p className="font-display text-3xl font-extrabold text-primary leading-none mb-1">12</p>
              <p className="text-xs text-muted-foreground">Secteurs d'activité<br />couverts</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Engagements ── */}
      <section className="py-20 px-[5%] bg-card">
        <div className="mx-auto max-w-[900px]">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-10">
            <p className="text-xs font-bold tracking-[0.18em] uppercase text-primary mb-3">Notre engagement</p>
            <h2 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] font-extrabold text-foreground leading-tight">
              Trois engagements fondamentaux
            </h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid gap-6 md:grid-cols-3">
            <motion.div variants={fadeUp} className="rounded-2xl border border-border bg-background p-6">
              <Target className="h-7 w-7 text-primary mb-3" />
              <h3 className="font-display text-base font-bold text-foreground mb-2">Fournir des résultats fiables</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Les analyses produites doivent pouvoir être utilisées dans des rapports environnementaux, des démarches RSE ou des audits.
              </p>
            </motion.div>
            <motion.div variants={fadeUp} className="rounded-2xl border border-border bg-background p-6">
              <FlaskConical className="h-7 w-7 text-primary mb-3" />
              <h3 className="font-display text-base font-bold text-foreground mb-2">Respecter la méthodologie scientifique</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Les calculs ne sont pas simplifiés au point de compromettre leur validité.
              </p>
            </motion.div>
            <motion.div variants={fadeUp} className="rounded-2xl border border-border bg-background p-6">
              <HeartHandshake className="h-7 w-7 text-primary mb-3" />
              <h3 className="font-display text-base font-bold text-foreground mb-2">Contribuer à la diffusion de la mesure</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                La transition vers une gestion durable de l'eau nécessite des outils accessibles, des méthodes transparentes et une meilleure compréhension des impacts.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="gradient-water py-24 px-[5%] text-center text-primary-foreground">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mx-auto max-w-[640px]">
          <motion.h2 variants={fadeUp} className="font-display text-[clamp(2rem,4vw,3.2rem)] font-extrabold mb-4">
            Agir pour une meilleure<br />gestion de l'eau
          </motion.h2>
          <motion.p variants={fadeUp} className="opacity-85 max-w-[520px] mx-auto mb-10 text-sm">
            Mesurer les impacts constitue la première étape indispensable pour pouvoir les réduire. HydroScan a été conçu pour accompagner les organisations dans cette démarche : transformer les données en compréhension, et la compréhension en action.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-3">
            <Link to="/calculateur" className="inline-flex items-center gap-2 px-8 py-3.5 text-white rounded-[10px] font-bold text-sm hover:-translate-y-0.5 hover:shadow-lg transition-all" style={{ backgroundColor: '#015486' }}>
              💧 Commencer gratuitement
            </Link>
            <Link to="/fonctionnalites" className="inline-block px-8 py-3.5 border-2 border-primary-foreground/50 text-primary-foreground rounded-[10px] font-semibold text-sm hover:border-primary-foreground hover:bg-primary-foreground/10 transition-all">
              Découvrir les fonctionnalités
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <LandingFooter />
    </div>
  );
}
