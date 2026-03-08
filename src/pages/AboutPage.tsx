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
        title={fr ? "À propos — HydroScan" : "About — HydroScan"}
        description={fr ? "Mesurer l'eau avec rigueur pour mieux agir. Découvrez la mission, l'approche et les convictions de HydroScan." : "Measure water rigorously to act better. Discover HydroScan's mission, approach and convictions."}
      />

      <LandingHeader activePage="apropos" />

      {/* ── Hero ── */}
      <section className="pt-32 pb-20 px-[5%] bg-card">
        <motion.div initial="hidden" animate="visible" variants={stagger} className="mx-auto max-w-[800px] text-center">
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-semibold text-primary mb-7">
            <Droplets className="h-3.5 w-3.5" />
            {fr ? "À propos" : "About"}
          </motion.div>
          <motion.h1 variants={fadeUp} className="font-display text-[clamp(2.4rem,5vw,4rem)] font-extrabold leading-[1.1] text-foreground mb-6">
            {fr ? "Mesurer l'eau avec rigueur " : "Measure water rigorously "}
            <span className="text-primary">{fr ? "pour mieux agir" : "to act better"}</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-muted-foreground max-w-[640px] mx-auto leading-relaxed">
            {fr
              ? "HydroScan est une plateforme conçue pour aider les organisations à comprendre, mesurer et gérer leur empreinte eau de manière fiable et conforme aux standards internationaux."
              : "HydroScan is a platform designed to help organizations understand, measure and manage their water footprint reliably and in compliance with international standards."}
          </motion.p>
        </motion.div>
      </section>

      {/* ── Intro ── */}
      <section className="py-16 px-[5%] bg-background">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mx-auto max-w-[800px]">
          <motion.p variants={fadeUp} className="text-sm text-muted-foreground leading-relaxed mb-4">
            {fr
              ? "Aujourd'hui, de nombreuses entreprises souhaitent intégrer la gestion de l'eau dans leur stratégie environnementale. Pourtant, elles se heurtent souvent à des obstacles importants : des outils trop complexes, des méthodes peu transparentes ou des solutions réservées aux grandes organisations."
              : "Today, many companies want to integrate water management into their environmental strategy. Yet they often face significant obstacles: overly complex tools, opaque methods or solutions reserved for large organizations."}
          </motion.p>
          <motion.p variants={fadeUp} className="text-sm text-muted-foreground leading-relaxed">
            {fr
              ? "HydroScan a été conçu pour répondre à ce besoin : offrir une solution rigoureuse, accessible et opérationnelle permettant aux entreprises et aux experts environnementaux de mesurer leur empreinte eau avec précision."
              : "HydroScan was designed to meet this need: providing a rigorous, accessible and operational solution that enables companies and environmental experts to measure their water footprint with precision."}
          </motion.p>
        </motion.div>
      </section>

      {/* ── Notre origine ── */}
      <section className="py-20 px-[5%] bg-card">
        <div className="mx-auto max-w-[900px]">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-10">
            <p className="text-xs font-bold tracking-[0.18em] uppercase text-primary mb-3">{fr ? "Notre origine" : "Our origin"}</p>
            <h2 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] font-extrabold text-foreground leading-tight">
              {fr ? "Un constat partagé par de nombreux professionnels" : "A finding shared by many professionals"}
            </h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-4">
            <motion.p variants={fadeUp} className="text-sm text-muted-foreground leading-relaxed">
              {fr
                ? "Dans de nombreux projets liés à la performance environnementale et au reporting RSE, une difficulté revenait systématiquement : l'évaluation de l'impact lié à l'eau."
                : "In many projects related to environmental performance and CSR reporting, one difficulty kept coming up: assessing water-related impact."}
            </motion.p>
            <motion.p variants={fadeUp} className="text-sm text-muted-foreground leading-relaxed">
              {fr
                ? "Dans la pratique, deux situations dominaient : certaines organisations ne mesuraient pas leur empreinte eau, d'autres tentaient de l'évaluer à l'aide de tableurs internes ou de méthodes non standardisées. Ces approches posaient un problème majeur : les résultats obtenus étaient difficiles à défendre lors d'un audit, dans un rapport RSE ou face à des parties prenantes exigeantes."
                : "In practice, two situations dominated: some organizations did not measure their water footprint, others tried to assess it using internal spreadsheets or non-standardized methods. These approaches posed a major problem: results were difficult to defend during an audit, in a CSR report or in front of demanding stakeholders."}
            </motion.p>

            <motion.div variants={fadeUp} className="rounded-2xl border border-border bg-background p-6 lg:p-8 my-6">
              <p className="text-sm font-semibold text-foreground mb-4">
                {fr ? "Entre ces deux réalités, il manquait une solution capable d'apporter à la fois :" : "Between these two realities, a solution was missing that could provide:"}
              </p>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-start gap-3">
                  <FlaskConical className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">{fr ? "Une rigueur méthodologique reconnue" : "Recognized methodological rigor"}</p>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">{fr ? "Une accessibilité pour les PME et les consultants" : "Accessibility for SMEs and consultants"}</p>
                </div>
                <div className="flex items-start gap-3">
                  <Gauge className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">{fr ? "Une rapidité d'utilisation compatible avec les contraintes opérationnelles" : "Speed of use compatible with operational constraints"}</p>
                </div>
              </div>
            </motion.div>

            <motion.p variants={fadeUp} className="text-sm text-muted-foreground leading-relaxed">
              {fr
                ? "HydroScan a été développé pour combler cet espace. La plateforme intègre directement les principes du Water Footprint Network et de la norme ISO 14046, tout en offrant une expérience simple et structurée permettant de transformer rapidement les données collectées en résultats exploitables."
                : "HydroScan was developed to fill this gap. The platform directly integrates the principles of the Water Footprint Network and the ISO 14046 standard, while offering a simple and structured experience to quickly transform collected data into actionable results."}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── Nos convictions ── */}
      <section className="py-20 px-[5%] bg-background">
        <div className="mx-auto max-w-[900px]">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-10">
            <p className="text-xs font-bold tracking-[0.18em] uppercase text-primary mb-3">{fr ? "Nos convictions" : "Our convictions"}</p>
            <h2 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] font-extrabold text-foreground leading-tight">
              {fr ? "Ce en quoi nous croyons" : "What we believe in"}
            </h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid gap-6 md:grid-cols-3">
            <motion.div variants={fadeUp} className="rounded-2xl border border-border bg-card p-7">
              <FlaskConical className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-display text-base font-bold text-foreground mb-3">
                {fr ? "La rigueur scientifique est indispensable" : "Scientific rigor is essential"}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {fr
                  ? "Un calcul d'empreinte eau n'a de valeur que s'il repose sur une méthodologie reconnue et documentée. HydroScan s'appuie sur les références internationales, notamment les travaux du Water Footprint Network et les principes de la norme ISO 14046. Chaque résultat repose sur des formules, des données et des hypothèses clairement documentées."
                  : "A water footprint calculation only has value if it relies on a recognized and documented methodology. HydroScan is based on international references, including the Water Footprint Network's work and the ISO 14046 standard. Every result is based on clearly documented formulas, data and assumptions."}
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="rounded-2xl border border-border bg-card p-7">
              <ShieldCheck className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-display text-base font-bold text-foreground mb-3">
                {fr ? "La transparence renforce la crédibilité" : "Transparency strengthens credibility"}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {fr
                  ? "L'empreinte eau est un indicateur puissant, mais elle possède également ses limites. Elle ne remplace pas une analyse complète des risques liés à l'eau, ni une stratégie globale de gestion hydrique. HydroScan adopte une approche transparente : les rapports expliquent clairement les hypothèses utilisées, les sources de données et les limites méthodologiques."
                  : "The water footprint is a powerful indicator, but it also has its limitations. It does not replace a complete water risk analysis, nor a comprehensive water management strategy. HydroScan adopts a transparent approach: reports clearly explain the assumptions used, data sources and methodological limitations."}
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="rounded-2xl border border-border bg-card p-7">
              <Users className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-display text-base font-bold text-foreground mb-3">
                {fr ? "L'accessibilité est la clé du changement" : "Accessibility is the key to change"}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                {fr
                  ? "Les méthodes les plus solides ne produisent un impact réel que si elles sont utilisées à grande échelle. L'objectif de HydroScan est de rendre la mesure accessible à :"
                  : "The strongest methods only produce real impact when used at scale. HydroScan's goal is to make measurement accessible to:"}
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li className="flex gap-2"><span className="text-green-water font-bold">✓</span> {fr ? "PME industrielles" : "Industrial SMEs"}</li>
                <li className="flex gap-2"><span className="text-green-water font-bold">✓</span> {fr ? "Entreprises agricoles ou agroalimentaires" : "Agricultural or food processing companies"}</li>
                <li className="flex gap-2"><span className="text-green-water font-bold">✓</span> {fr ? "Bureaux d'études" : "Engineering firms"}</li>
                <li className="flex gap-2"><span className="text-green-water font-bold">✓</span> {fr ? "Consultants en RSE et durabilité" : "CSR and sustainability consultants"}</li>
                <li className="flex gap-2"><span className="text-green-water font-bold">✓</span> {fr ? "Filiales régionales de groupes internationaux" : "Regional subsidiaries of international groups"}</li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Notre approche ── */}
      <section className="py-20 px-[5%] bg-card">
        <div className="mx-auto max-w-[900px]">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-10">
            <p className="text-xs font-bold tracking-[0.18em] uppercase text-primary mb-3">{fr ? "Notre approche" : "Our approach"}</p>
            <h2 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] font-extrabold text-foreground leading-tight">
              {fr ? "Comment nous travaillons" : "How we work"}
            </h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid gap-8 md:grid-cols-3">
            <motion.div variants={fadeUp} className="rounded-2xl border border-border bg-background p-6">
              <BookOpen className="h-7 w-7 text-blue-water mb-4" />
              <h3 className="font-display text-base font-bold text-foreground mb-3">
                {fr ? "Une base scientifique solide" : "A solid scientific foundation"}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                {fr
                  ? "Le moteur de calcul repose sur les principes du Water Footprint Assessment Manual. Les méthodes utilisées permettent de mesurer les trois composantes : eau verte, eau bleue et eau grise."
                  : "The calculation engine is based on the principles of the Water Footprint Assessment Manual. The methods used measure all three components: green, blue and grey water."}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {fr
                  ? "Les données proviennent de sources reconnues au niveau international : bases hydrologiques, agricoles et climatiques utilisées dans la recherche environnementale."
                  : "Data comes from internationally recognized sources: hydrological, agricultural and climate databases used in environmental research."}
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="rounded-2xl border border-border bg-background p-6">
              <Gauge className="h-7 w-7 text-green-water mb-4" />
              <h3 className="font-display text-base font-bold text-foreground mb-3">
                {fr ? "Conçu pour l'opérationnel" : "Designed for operations"}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {fr
                  ? "HydroScan a été pensé pour répondre aux besoins réels des organisations qui doivent produire des analyses dans des délais courts. La plateforme simplifie : collecte des données, structuration des informations, calcul de l'empreinte eau, et génération de rapports exploitables."
                  : "HydroScan was designed to meet the real needs of organizations that must produce analyses within tight deadlines. The platform simplifies: data collection, information structuring, water footprint calculation, and generation of actionable reports."}
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="rounded-2xl border border-border bg-background p-6">
              <Globe className="h-7 w-7 text-primary mb-4" />
              <h3 className="font-display text-base font-bold text-foreground mb-3">
                {fr ? "Adapté aux réalités francophones" : "Adapted to francophone realities"}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {fr
                  ? "Les zones méditerranéennes et de nombreuses régions d'Afrique figurent parmi les territoires les plus exposés au stress hydrique. HydroScan tient compte des réalités climatiques, économiques et réglementaires de ces régions."
                  : "Mediterranean areas and many African regions are among the territories most exposed to water stress. HydroScan takes into account the climatic, economic and regulatory realities of these regions."}
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
              {fr ? "HydroScan en quelques repères" : "HydroScan at a glance"}
            </h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <motion.div variants={fadeUp}>
              <p className="font-display text-3xl font-extrabold text-primary leading-none mb-1">3</p>
              <p className="text-xs text-muted-foreground">
                {fr ? <>Composantes analysées<br />(verte, bleue, grise)</> : <>Components analyzed<br />(green, blue, grey)</>}
              </p>
            </motion.div>
            <motion.div variants={fadeUp}>
              <p className="font-display text-3xl font-extrabold text-primary leading-none mb-1">ISO</p>
              <p className="text-xs text-muted-foreground">
                {fr ? <>14046 / WFN<br />Standard de référence</> : <>14046 / WFN<br />Reference standard</>}
              </p>
            </motion.div>
            <motion.div variants={fadeUp}>
              <p className="font-display text-3xl font-extrabold text-primary leading-none mb-1">8+</p>
              <p className="text-xs text-muted-foreground">
                {fr ? <>Bases de données<br />internationales intégrées</> : <>International databases<br />integrated</>}
              </p>
            </motion.div>
            <motion.div variants={fadeUp}>
              <p className="font-display text-3xl font-extrabold text-primary leading-none mb-1">12</p>
              <p className="text-xs text-muted-foreground">
                {fr ? <>Secteurs d'activité<br />couverts</> : <>Industry sectors<br />covered</>}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Engagements ── */}
      <section className="py-20 px-[5%] bg-card">
        <div className="mx-auto max-w-[900px]">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-10">
            <p className="text-xs font-bold tracking-[0.18em] uppercase text-primary mb-3">{fr ? "Notre engagement" : "Our commitment"}</p>
            <h2 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] font-extrabold text-foreground leading-tight">
              {fr ? "Trois engagements fondamentaux" : "Three fundamental commitments"}
            </h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid gap-6 md:grid-cols-3">
            <motion.div variants={fadeUp} className="rounded-2xl border border-border bg-background p-6">
              <Target className="h-7 w-7 text-primary mb-3" />
              <h3 className="font-display text-base font-bold text-foreground mb-2">
                {fr ? "Fournir des résultats fiables" : "Deliver reliable results"}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {fr
                  ? "Les analyses produites doivent pouvoir être utilisées dans des rapports environnementaux, des démarches RSE ou des audits."
                  : "Analyses produced must be usable in environmental reports, CSR initiatives or audits."}
              </p>
            </motion.div>
            <motion.div variants={fadeUp} className="rounded-2xl border border-border bg-background p-6">
              <FlaskConical className="h-7 w-7 text-primary mb-3" />
              <h3 className="font-display text-base font-bold text-foreground mb-2">
                {fr ? "Respecter la méthodologie scientifique" : "Respect scientific methodology"}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {fr
                  ? "Les calculs ne sont pas simplifiés au point de compromettre leur validité."
                  : "Calculations are not simplified to the point of compromising their validity."}
              </p>
            </motion.div>
            <motion.div variants={fadeUp} className="rounded-2xl border border-border bg-background p-6">
              <HeartHandshake className="h-7 w-7 text-primary mb-3" />
              <h3 className="font-display text-base font-bold text-foreground mb-2">
                {fr ? "Contribuer à la diffusion de la mesure" : "Contribute to spreading measurement"}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {fr
                  ? "La transition vers une gestion durable de l'eau nécessite des outils accessibles, des méthodes transparentes et une meilleure compréhension des impacts."
                  : "The transition to sustainable water management requires accessible tools, transparent methods and a better understanding of impacts."}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="gradient-water py-24 px-[5%] text-center text-primary-foreground">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mx-auto max-w-[640px]">
          <motion.h2 variants={fadeUp} className="font-display text-[clamp(2rem,4vw,3.2rem)] font-extrabold mb-4">
            {fr ? <>Agir pour une meilleure<br />gestion de l'eau</> : <>Act for better<br />water management</>}
          </motion.h2>
          <motion.p variants={fadeUp} className="opacity-85 max-w-[520px] mx-auto mb-10 text-sm">
            {fr
              ? "Mesurer les impacts constitue la première étape indispensable pour pouvoir les réduire. HydroScan a été conçu pour accompagner les organisations dans cette démarche : transformer les données en compréhension, et la compréhension en action."
              : "Measuring impacts is the essential first step to reducing them. HydroScan was designed to support organizations in this process: transforming data into understanding, and understanding into action."}
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-3">
            <Link to="/calculateur" className="inline-flex items-center gap-2 px-8 py-3.5 text-white rounded-[10px] font-bold text-sm hover:-translate-y-0.5 hover:shadow-lg transition-all" style={{ backgroundColor: '#015486' }}>
              💧 {fr ? "Commencer gratuitement" : "Start for free"}
            </Link>
            <Link to="/fonctionnalites" className="inline-block px-8 py-3.5 border-2 border-primary-foreground/50 text-primary-foreground rounded-[10px] font-semibold text-sm hover:border-primary-foreground hover:bg-primary-foreground/10 transition-all">
              {fr ? "Découvrir les fonctionnalités" : "Discover features"}
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <LandingFooter />
    </div>
  );
}
