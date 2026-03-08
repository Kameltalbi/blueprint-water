import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PageMeta } from "@/components/PageMeta";
import { useI18n } from "@/lib/i18n";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { ChevronDown, ChevronUp, Clock, BookOpen, FileText } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

interface Article {
  category: string;
  categoryColor: string;
  title: string;
  hook: string;
  readTime: string;
  tags: string[];
  content: React.ReactNode;
}

function ArticleCard({ article }: { article: Article }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      variants={fadeUp}
      className="rounded-2xl border border-border bg-card overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left p-6 lg:p-8 hover:bg-accent/30 transition-colors"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${article.categoryColor}`}>
                {article.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" /> {article.readTime}
              </span>
            </div>
            <h3 className="font-display text-xl font-bold text-foreground leading-snug mb-2">
              {article.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{article.hook}</p>
            <div className="flex gap-2 mt-3 flex-wrap">
              {article.tags.map((tag) => (
                <span key={tag} className="text-xs text-primary/70 font-medium">{tag}</span>
              ))}
            </div>
          </div>
          <div className="flex-shrink-0 mt-1 text-muted-foreground">
            {open ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </div>
        </div>
      </button>

      {open && (
        <div className="px-6 lg:px-8 pb-8 border-t border-border pt-6">
          <div className="prose-hydroscan">{article.content}</div>
        </div>
      )}
    </motion.div>
  );
}

export default function ResourcesPage() {
  const { lang } = useI18n();
  const fr = lang === "fr";

  const articles: Article[] = [
    {
      category: fr ? "Fondamentaux" : "Fundamentals",
      categoryColor: "bg-blue-water/10 text-blue-water",
      title: fr
        ? "Eau verte, bleue, grise : quelles différences et pourquoi ça change tout"
        : "Green, blue, grey water: what are the differences and why it changes everything",
      hook: fr
        ? "La plupart des entreprises ne mesurent que l'eau bleue — et passent à côté de 80% de leur empreinte réelle. Voici pourquoi les trois composantes sont indispensables."
        : "Most companies only measure blue water — and miss 80% of their real footprint. Here's why all three components are essential.",
      readTime: "6 min",
      tags: ["#Fundamentals", "#ISO14046", "#WaterFootprint"],
      content: fr ? (
        <>
          <p>Quand on parle de consommation d'eau en entreprise, l'instinct est de regarder la facture d'eau. C'est compréhensible — mais c'est incomplet. La norme ISO 14046 et le Water Footprint Network distinguent trois types d'eau radicalement différents, qui n'ont ni la même origine, ni le même impact, ni les mêmes leviers de réduction.</p>
          <h4>L'eau verte — l'eau invisible de l'agriculture</h4>
          <p>L'eau verte est l'eau de pluie stockée dans le sol et consommée par les plantes par évapotranspiration. Elle ne transite jamais par un réseau, ne figure sur aucune facture, et pourtant elle représente la majorité de l'empreinte eau mondiale — environ 74% selon les estimations du Water Footprint Network.</p>
          <p>Pour une entreprise agroalimentaire, textile ou toute industrie utilisant des matières premières agricoles, l'eau verte de la chaîne d'approvisionnement est souvent la composante dominante. L'ignorer, c'est s'exposer à des angles morts stratégiques majeurs.</p>
          <div className="rounded-lg border border-border bg-background p-4 my-4 font-mono text-sm">WF_vert = Évapotranspiration verte / Rendement de la culture</div>
          <h4>L'eau bleue — l'eau que l'on prélève</h4>
          <p>L'eau bleue est l'eau de surface (rivières, lacs) ou souterraine (nappes phréatiques) prélevée et consommée — c'est-à-dire non restituée au même bassin versant dans la même période. C'est la composante la plus directement liée aux tensions hydriques locales et aux risques réglementaires.</p>
          <p><strong>Attention :</strong> il ne faut pas confondre prélèvement et consommation. Une usine qui prélève 1 000 m³ et en rejette 900 m³ (traités) dans le même bassin n'a consommé que 100 m³ d'eau bleue.</p>
          <div className="rounded-lg border border-border bg-background p-4 my-4 font-mono text-sm">WF_bleu = Évaporation bleue + Eau incorporée + Flux de retour perdu</div>
          <h4>L'eau grise — l'eau de la pollution</h4>
          <p>L'eau grise est le volume d'eau théorique nécessaire pour diluer vos rejets polluants jusqu'à atteindre les normes de qualité ambiante acceptables. Elle ne représente pas de l'eau physiquement consommée, mais l'impact de la pollution sur la disponibilité effective de l'eau pour les autres usagers.</p>
          <div className="rounded-lg border border-border bg-background p-4 my-4 font-mono text-sm">WF_gris = Charge polluante L / (Cmax − Cnat)</div>
          <h4>Ce que ça change concrètement</h4>
          <p>Une entreprise qui ne mesure que son eau bleue opérationnelle voit peut-être 5% de son empreinte réelle. Les 95% restants sont dans sa chaîne d'approvisionnement. C'est précisément pour cette raison que la norme ISO 14046 impose une approche cycle de vie complète.</p>
        </>
      ) : (
        <>
          <p>When talking about corporate water consumption, the instinct is to look at the water bill. That's understandable — but incomplete. ISO 14046 and the Water Footprint Network distinguish three radically different types of water, with different origins, impacts and reduction levers.</p>
          <h4>Green water — agriculture's invisible water</h4>
          <p>Green water is rainwater stored in the soil and consumed by plants through evapotranspiration. It never passes through a network, appears on no bill, yet represents the majority of the global water footprint — about 74% according to the Water Footprint Network.</p>
          <p>For food, textile or any industry using agricultural raw materials, supply chain green water is often the dominant component. Ignoring it means major strategic blind spots.</p>
          <div className="rounded-lg border border-border bg-background p-4 my-4 font-mono text-sm">WF_green = Green evapotranspiration / Crop yield</div>
          <h4>Blue water — the water we withdraw</h4>
          <p>Blue water is surface water (rivers, lakes) or groundwater withdrawn and consumed — meaning not returned to the same watershed in the same period. It's the component most directly linked to local water stress and regulatory risks.</p>
          <p><strong>Note:</strong> don't confuse withdrawal and consumption. A factory that withdraws 1,000 m³ and returns 900 m³ (treated) to the same basin has only consumed 100 m³ of blue water.</p>
          <div className="rounded-lg border border-border bg-background p-4 my-4 font-mono text-sm">WF_blue = Blue evaporation + Incorporated water + Lost return flow</div>
          <h4>Grey water — the water of pollution</h4>
          <p>Grey water is the theoretical volume of water needed to dilute your pollutant discharges to acceptable ambient quality standards. It doesn't represent physically consumed water, but the impact of pollution on effective water availability for other users.</p>
          <div className="rounded-lg border border-border bg-background p-4 my-4 font-mono text-sm">WF_grey = Pollutant load L / (Cmax − Cnat)</div>
          <h4>What this means in practice</h4>
          <p>A company measuring only its operational blue water may be seeing just 5% of its real footprint. The remaining 95% is in its supply chain. This is precisely why ISO 14046 requires a complete life cycle approach.</p>
        </>
      ),
    },
    {
      category: fr ? "Réglementation" : "Regulation",
      categoryColor: "bg-primary/10 text-primary",
      title: fr
        ? "ISO 14046, CSRD, taxonomie verte : ce que les entreprises doivent vraiment savoir en 2025"
        : "ISO 14046, CSRD, green taxonomy: what companies really need to know in 2025",
      hook: fr
        ? "L'eau s'impose progressivement dans les obligations de reporting environnemental. Tour d'horizon des textes en vigueur et de ce qu'ils impliquent concrètement pour votre organisation."
        : "Water is gradually becoming part of environmental reporting obligations. An overview of current regulations and what they concretely mean for your organization.",
      readTime: "8 min",
      tags: ["#Regulation", "#CSRD", "#ISO14046", "#CSR"],
      content: fr ? (
        <>
          <p>Pendant des années, l'eau est restée le parent pauvre du reporting environnemental — derrière le carbone, la biodiversité et les déchets. Ce temps est révolu.</p>
          <h4>ISO 14046 — Le standard technique de référence</h4>
          <p>Publiée en 2014, la norme ISO 14046 est le cadre technique mondial pour l'évaluation de l'empreinte eau dans le contexte d'une analyse du cycle de vie.</p>
          <p><strong>Ce que la norme impose :</strong> une approche cycle de vie complète, une distinction entre les trois composantes, une évaluation spatiale et temporelle des impacts, et une transparence totale sur les hypothèses.</p>
          <p><strong>Ce que la norme ne prescrit pas :</strong> un outil ou un logiciel particulier, ni un seuil acceptable d'empreinte.</p>
          <h4>CSRD — L'eau entre dans le reporting obligatoire</h4>
          <p>La Corporate Sustainability Reporting Directive (CSRD), entrée en vigueur depuis 2024, impose aux grandes entreprises européennes de publier des informations selon les standards ESRS. L'ESRS E3 est dédié à l'eau et aux ressources marines.</p>
          <h4>La taxonomie européenne — L'eau comme critère de durabilité</h4>
          <p>La taxonomie verte de l'UE inclut la protection des ressources en eau parmi ses six objectifs environnementaux. Les entreprises doivent démontrer la conformité DNSH pour accéder aux financements verts.</p>
          <h4>Ce qu'il faut retenir</h4>
          <p>La pression réglementaire sur l'eau va croître. Les entreprises qui investissent dès maintenant dans une mesure rigoureuse transforment cette pression en avantage compétitif.</p>
        </>
      ) : (
        <>
          <p>For years, water remained the poor relation of environmental reporting — behind carbon, biodiversity and waste. Those days are over.</p>
          <h4>ISO 14046 — The technical reference standard</h4>
          <p>Published in 2014, ISO 14046 is the global technical framework for water footprint assessment within a life cycle analysis context.</p>
          <p><strong>What the standard requires:</strong> a complete life cycle approach, distinction between three components, spatial and temporal impact assessment, and full transparency on assumptions.</p>
          <p><strong>What the standard doesn't prescribe:</strong> a specific tool or software, nor an acceptable footprint threshold.</p>
          <h4>CSRD — Water enters mandatory reporting</h4>
          <p>The Corporate Sustainability Reporting Directive (CSRD), effective since 2024, requires large European companies to publish information per ESRS standards. ESRS E3 is dedicated to water and marine resources.</p>
          <h4>EU Taxonomy — Water as a sustainability criterion</h4>
          <p>The EU green taxonomy includes water resource protection among its six environmental objectives. Companies must demonstrate DNSH compliance to access green financing.</p>
          <h4>Key takeaway</h4>
          <p>Regulatory pressure on water will increase. Companies investing now in rigorous measurement transform this pressure into competitive advantage.</p>
        </>
      ),
    },
    {
      category: fr ? "Secteur" : "Sector",
      categoryColor: "bg-green-water/10 text-green-water",
      title: fr
        ? "Agroalimentaire : pourquoi votre empreinte eau est dans votre chaîne d'approvisionnement, pas dans votre usine"
        : "Food industry: why your water footprint is in your supply chain, not your factory",
      hook: fr
        ? "Pour une entreprise agroalimentaire type, plus de 90% de l'empreinte eau se situe en amont — chez les agriculteurs et les transformateurs primaires."
        : "For a typical food company, over 90% of the water footprint is upstream — with farmers and primary processors.",
      readTime: "7 min",
      tags: ["#Food", "#SupplyChain", "#GreenWater"],
      content: fr ? (
        <>
          <p>Un industriel agroalimentaire qui mesure uniquement sa consommation d'eau en usine voit une fraction marginale de son impact réel.</p>
          <h4>Le poids de l'eau verte agricole</h4>
          <p>Pour un produit à base de blé, de soja, de coton ou de viande bovine, l'eau verte représente souvent 70 à 90% de l'empreinte totale.</p>
          <h4>Les hotspots géographiques : le vrai risque</h4>
          <p>Ce qui compte n'est pas seulement le volume d'eau consommé, mais <strong>où</strong> il est consommé. 1 000 m³ prélevés en Norvège n'ont pas le même impact que 1 000 m³ prélevés dans le bassin du Guadalquivir en période estivale.</p>
          <h4>Les leviers d'action pour l'agroalimentaire</h4>
          <p>Les actions les plus efficaces sont dans la relation avec les fournisseurs agricoles : encourager l'irrigation déficitaire, accompagner la transition vers l'agriculture biologique, favoriser les fournisseurs hors zones de stress, et intégrer des critères eau dans vos cahiers des charges.</p>
        </>
      ) : (
        <>
          <p>A food manufacturer measuring only its factory water consumption sees a marginal fraction of its real impact.</p>
          <h4>The weight of agricultural green water</h4>
          <p>For products based on wheat, soy, cotton or beef, green water often represents 70 to 90% of the total footprint.</p>
          <h4>Geographic hotspots: the real risk</h4>
          <p>What matters is not just the volume consumed, but <strong>where</strong> it's consumed. 1,000 m³ withdrawn in Norway doesn't have the same impact as 1,000 m³ in the Guadalquivir basin during summer.</p>
          <h4>Action levers for the food industry</h4>
          <p>The most effective actions are in the relationship with agricultural suppliers: encouraging deficit irrigation, supporting the transition to organic farming, favoring suppliers outside stress zones, and integrating water criteria into procurement specifications.</p>
        </>
      ),
    },
    {
      category: fr ? "Bonnes pratiques" : "Best practices",
      categoryColor: "bg-destructive/10 text-destructive",
      title: fr
        ? "Les 5 erreurs les plus fréquentes dans le calcul d'une empreinte eau"
        : "The 5 most common mistakes in water footprint calculation",
      hook: fr
        ? "Double comptage, mesure annuelle au lieu de mensuelle, confusion prélèvement/consommation... Ces erreurs compromettent la crédibilité de vos résultats."
        : "Double counting, annual instead of monthly measurement, withdrawal/consumption confusion... These errors compromise the credibility of your results.",
      readTime: "5 min",
      tags: ["#Methodology", "#BestPractices", "#ISO14046"],
      content: fr ? (
        <>
          <p>Après analyse de dizaines de rapports d'empreinte eau, les mêmes erreurs reviennent systématiquement.</p>
          <h4>Erreur 1 — Mesurer annuellement au lieu de mensuellement</h4>
          <p>L'empreinte eau annuelle peut sembler soutenable et masquer des mois de stress hydrique critique. La norme impose une granularité mensuelle minimum.</p>
          <h4>Erreur 2 — Confondre prélèvement et consommation</h4>
          <p>Le prélèvement est le volume extrait. La consommation est la part non restituée. Seule la consommation entre dans le calcul de l'empreinte bleue.</p>
          <h4>Erreur 3 — Additionner des empreintes de produits intermédiaires</h4>
          <p>Chaque étape ajoute uniquement sa valeur ajoutée en eau, pas la totalité de l'empreinte du produit intermédiaire entrant.</p>
          <h4>Erreur 4 — Retenir plusieurs polluants pour l'empreinte grise</h4>
          <p>On retient uniquement le polluant critique — celui qui génère le volume de dilution le plus élevé.</p>
          <h4>Erreur 5 — Utiliser le débit actuel pour la pénurie bleue</h4>
          <p>Il faut utiliser le débit naturel — tel qu'il serait sans intervention humaine — et non le débit actuel.</p>
        </>
      ) : (
        <>
          <p>After analyzing dozens of water footprint reports, the same mistakes keep coming back.</p>
          <h4>Mistake 1 — Measuring annually instead of monthly</h4>
          <p>An annual water footprint may seem sustainable while hiding months of critical water stress. The standard requires at minimum monthly granularity.</p>
          <h4>Mistake 2 — Confusing withdrawal and consumption</h4>
          <p>Withdrawal is the volume extracted. Consumption is the portion not returned. Only consumption enters the blue footprint calculation.</p>
          <h4>Mistake 3 — Adding intermediate product footprints</h4>
          <p>Each step only adds its water value-added, not the entire footprint of the incoming intermediate product.</p>
          <h4>Mistake 4 — Retaining multiple pollutants for grey footprint</h4>
          <p>Only the critical pollutant is retained — the one generating the highest dilution volume.</p>
          <h4>Mistake 5 — Using current flow for blue water scarcity</h4>
          <p>The natural flow must be used — as it would be without human intervention — not the current flow.</p>
        </>
      ),
    },
    {
      category: fr ? "Stratégie" : "Strategy",
      categoryColor: "bg-accent text-accent-foreground",
      title: fr
        ? "Réduire son empreinte eau : par où commencer quand on ne sait pas où regarder"
        : "Reducing your water footprint: where to start when you don't know where to look",
      hook: fr
        ? "La matrice de priorisation du Water Footprint Network répond à cette question : fort potentiel de réduction + zone de stress = priorité absolue."
        : "The Water Footprint Network's prioritization matrix answers this: high reduction potential + stress zone = absolute priority.",
      readTime: "6 min",
      tags: ["#Reduction", "#Strategy", "#Hotspot"],
      content: fr ? (
        <>
          <p>La tentation, une fois l'empreinte calculée, est d'agir là où c'est le plus visible. C'est rarement là où c'est le plus efficace.</p>
          <h4>La matrice de priorisation</h4>
          <p>Le WFN propose une grille à deux axes : présence d'un hotspot et potentiel de réduction. La priorité maximale (++) va aux actions à fort potentiel dans des hotspots.</p>
          <h4>Réduire hors hotspot a quand même du sens</h4>
          <p>Chaque m³ économisé réduit la pression sur les ressources mondiales et libère de la capacité pour d'autres usages. Ce n'est pas prioritaire, mais ce n'est pas inutile.</p>
          <h4>Les trois grands leviers selon votre profil</h4>
          <p><strong>Pour un industriel :</strong> le recyclage en circuit fermé peut amener l'empreinte bleue opérationnelle à zéro.</p>
          <p><strong>Pour un acteur agricole :</strong> l'irrigation déficitaire et le passage au bio sont les deux actions à plus fort impact.</p>
          <p><strong>Pour un responsable achats :</strong> intégrer l'origine géographique des matières premières par rapport aux zones de stress hydrique.</p>
          <h4>L'offsetting : en dernier recours seulement</h4>
          <p>La compensation est une option valide — mais uniquement après avoir réduit au maximum. L'utiliser comme premier recours est du greenwashing.</p>
        </>
      ) : (
        <>
          <p>The temptation, once the footprint is calculated, is to act where it's most visible. That's rarely where it's most effective.</p>
          <h4>The prioritization matrix</h4>
          <p>The WFN proposes a grid with two axes: hotspot presence and reduction potential. Maximum priority (++) goes to high-potential actions in hotspots.</p>
          <h4>Reducing outside hotspots still makes sense</h4>
          <p>Every m³ saved reduces pressure on global resources and frees capacity for other uses. It's not priority, but it's not useless.</p>
          <h4>Three main levers by profile</h4>
          <p><strong>For manufacturers:</strong> closed-loop recycling can bring operational blue footprint to zero.</p>
          <p><strong>For agricultural actors:</strong> deficit irrigation and organic transition are the two highest-impact actions.</p>
          <p><strong>For procurement managers:</strong> integrate the geographic origin of raw materials relative to water stress zones.</p>
          <h4>Offsetting: last resort only</h4>
          <p>Water footprint offsetting is a valid option — but only after maximizing reductions. Using it as a first resort is greenwashing.</p>
        </>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-card font-sans">
      <PageMeta
        title={fr ? "Ressources — HydroScan" : "Resources — HydroScan"}
        description={fr ? "Articles, guides et documentation méthodologique sur l'empreinte eau." : "Articles, guides and methodological documentation on water footprint."}
      />

      <LandingHeader activePage="ressources" />

      {/* ── Hero ── */}
      <section className="pt-32 pb-16 px-[5%] text-center bg-card">
        <motion.div initial="hidden" animate="visible" variants={stagger} className="mx-auto max-w-[800px]">
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-semibold text-primary mb-7">
            <BookOpen className="h-3.5 w-3.5" />
            {fr ? "Centre de ressources" : "Resource center"}
          </motion.div>
          <motion.h1 variants={fadeUp} className="font-display text-[clamp(2.4rem,5vw,4rem)] font-extrabold leading-[1.1] text-foreground mb-5">
            {fr ? "Ressources" : "Resources"}
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-muted-foreground max-w-[620px] mx-auto">
            {fr
              ? "Tout ce qu'il faut savoir sur l'empreinte eau — pour comprendre, calculer et agir avec méthode."
              : "Everything you need to know about water footprint — to understand, calculate and act with method."}
          </motion.p>
        </motion.div>
      </section>

      {/* ── Articles ── */}
      <section className="py-20 px-[5%] bg-background">
        <div className="mx-auto max-w-[900px]">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-12">
            <p className="text-xs font-bold tracking-[0.18em] uppercase text-primary mb-3">
              {fr ? "Articles & Analyses" : "Articles & Analysis"}
            </p>
            <h2 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] font-extrabold text-foreground leading-tight mb-3">
              {fr ? "Les dernières publications de l'équipe HydroScan" : "Latest publications from the HydroScan team"}
            </h2>
            <p className="text-muted-foreground text-sm max-w-[600px]">
              {fr
                ? "Sur l'empreinte eau, la réglementation et les bonnes pratiques sectorielles."
                : "On water footprint, regulations and sector best practices."}
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="flex flex-col gap-5"
          >
            {articles.map((article, i) => (
              <ArticleCard key={i} article={article} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Guide Méthodologique ── */}
      <section className="py-24 px-[5%] bg-card">
        <div className="mx-auto max-w-[900px]">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-12">
            <div className="flex items-center gap-3 mb-3">
              <FileText className="h-5 w-5 text-primary" />
              <p className="text-xs font-bold tracking-[0.18em] uppercase text-primary">
                {fr ? "Guide Méthodologique" : "Methodology Guide"}
              </p>
            </div>
            <h2 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] font-extrabold text-foreground leading-tight mb-3">
              {fr
                ? "La référence complète pour comprendre comment HydroScan calcule votre empreinte eau"
                : "The complete reference to understand how HydroScan calculates your water footprint"}
            </h2>
            <p className="text-muted-foreground text-sm max-w-[700px]">
              {fr
                ? <>HydroScan est construit sur le standard le plus rigoureux disponible : <em>The Water Footprint Assessment Manual</em> (Hoekstra, Chapagain, Aldaya, Mekonnen — Water Footprint Network, 2011), base de la norme ISO 14046.</>
                : <>HydroScan is built on the most rigorous standard available: <em>The Water Footprint Assessment Manual</em> (Hoekstra, Chapagain, Aldaya, Mekonnen — Water Footprint Network, 2011), the basis for ISO 14046.</>}
            </p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="flex flex-col gap-8">
            {/* Chapitre 1 */}
            <motion.div variants={fadeUp} className="rounded-2xl border border-border bg-background p-6 lg:p-8">
              <h3 className="font-display text-lg font-bold text-foreground mb-4">
                <span className="text-primary mr-2">01</span>
                {fr ? "Les fondements : pourquoi trois composantes ?" : "Foundations: why three components?"}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                {fr
                  ? "L'eau douce se présente sous trois formes fonctionnellement différentes dans les systèmes de production humains. Les traiter comme une seule entité conduit à des évaluations incomplètes."
                  : "Fresh water comes in three functionally different forms in human production systems. Treating them as a single entity leads to incomplete assessments."}
              </p>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-blue-water/20 bg-blue-water/5 p-4">
                  <p className="font-bold text-blue-water text-sm mb-1">💧 {fr ? "Eau bleue" : "Blue water"}</p>
                  <p className="text-xs text-muted-foreground">{fr ? "Prélevée dans les cours d'eau, lacs ou nappes phréatiques. Directement liée aux tensions hydriques locales." : "Withdrawn from rivers, lakes or aquifers. Directly linked to local water stress."}</p>
                </div>
                <div className="rounded-xl border border-green-water/20 bg-green-water/5 p-4">
                  <p className="font-bold text-green-water text-sm mb-1">🌿 {fr ? "Eau verte" : "Green water"}</p>
                  <p className="text-xs text-muted-foreground">{fr ? "Issue des précipitations, stockée dans le sol, consommée par les végétaux. Principale composante de l'agriculture." : "From precipitation, stored in soil, consumed by plants. Main component of agriculture."}</p>
                </div>
                <div className="rounded-xl border border-grey-water/20 bg-grey-water/5 p-4">
                  <p className="font-bold text-grey-water text-sm mb-1">🏭 {fr ? "Eau grise" : "Grey water"}</p>
                  <p className="text-xs text-muted-foreground">{fr ? "Volume théorique nécessaire pour diluer les rejets jusqu'aux normes ambiantes. Peut atteindre zéro pour le bio." : "Theoretical volume needed to dilute discharges to ambient standards. Can reach zero for organic."}</p>
                </div>
              </div>
            </motion.div>

            {/* Chapitre 2 */}
            <motion.div variants={fadeUp} className="rounded-2xl border border-border bg-background p-6 lg:p-8">
              <h3 className="font-display text-lg font-bold text-foreground mb-4">
                <span className="text-primary mr-2">02</span>
                {fr ? "Les formules de calcul" : "Calculation formulas"}
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">{fr ? "Empreinte verte et bleue d'un procédé agricole" : "Green and blue footprint of an agricultural process"}</p>
                  <div className="rounded-lg border border-border bg-card p-4 font-mono text-sm text-muted-foreground">
                    <p>WF_green (m³/ton) = CWU_green / Yield</p>
                    <p>WF_blue (m³/ton) = CWU_blue / Yield</p>
                    <p className="mt-2 text-xs opacity-70">CWU = {fr ? "Consommation en eau de la culture (modèle CROPWAT 8.0 — FAO)" : "Crop water use (CROPWAT 8.0 model — FAO)"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">{fr ? "Empreinte grise" : "Grey footprint"}</p>
                  <div className="rounded-lg border border-border bg-card p-4 font-mono text-sm text-muted-foreground">
                    <p>WF_grey (m³/ton) = Pollutant load L / (Cmax − Cnat) / Yield</p>
                    <p className="mt-2 text-xs opacity-70">Cmax = {fr ? "concentration max acceptable" : "max acceptable concentration"} · Cnat = {fr ? "concentration naturelle" : "natural concentration"}</p>
                    <p className="text-xs opacity-70">{fr ? "Règle : retenir uniquement le polluant critique" : "Rule: retain only the critical pollutant"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">{fr ? "Empreinte d'un produit (approche accumulative)" : "Product footprint (cumulative approach)"}</p>
                  <div className="rounded-lg border border-border bg-card p-4 font-mono text-sm text-muted-foreground">
                    <p>WF_prod[p] = WF_proc[p] + Σ (WF_prod[input_i] / f_product[p,i]) × f_value[p]</p>
                    <p className="mt-2 text-xs opacity-70">f_value[p] = {fr ? "valeur économique du produit p / Σ valeur de tous les co-produits" : "economic value of product p / Σ value of all co-products"}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Chapitre 3 */}
            <motion.div variants={fadeUp} className="rounded-2xl border border-border bg-background p-6 lg:p-8">
              <h3 className="font-display text-lg font-bold text-foreground mb-4">
                <span className="text-primary mr-2">03</span>
                {fr ? "Les sources de données utilisées" : "Data sources used"}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 pr-4 font-semibold text-foreground">{fr ? "Donnée" : "Data"}</th>
                      <th className="text-left py-2 pr-4 font-semibold text-foreground">{fr ? "Source" : "Source"}</th>
                      <th className="text-left py-2 font-semibold text-foreground">{fr ? "Usage" : "Usage"}</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">{fr ? "Évapotranspiration cultures" : "Crop evapotranspiration"}</td><td className="py-2 pr-4">CROPWAT 8.0 (FAO)</td><td className="py-2">{fr ? "Calcul WF vert et bleu agricole" : "Agricultural green & blue WF"}</td></tr>
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">{fr ? "Données climatiques" : "Climate data"}</td><td className="py-2 pr-4">CLIMWAT 2.0 (FAO)</td><td className="py-2">{fr ? "Alimentation CROPWAT" : "CROPWAT input"}</td></tr>
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">{fr ? "Rendements agricoles" : "Crop yields"}</td><td className="py-2 pr-4">FAOSTAT + Monfreda et al.</td><td className="py-2">{fr ? "Conversion CWU → m³/tonne" : "CWU → m³/ton conversion"}</td></tr>
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">{fr ? "Engrais & pesticides" : "Fertilizers & pesticides"}</td><td className="py-2 pr-4">FertiStat (FAO) + IFA</td><td className="py-2">{fr ? "Calcul charge polluante" : "Pollutant load calculation"}</td></tr>
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">{fr ? "Fraction lixiviation azote" : "Nitrogen leaching fraction"}</td><td className="py-2 pr-4">{fr ? "Valeur par défaut : α = 10%" : "Default value: α = 10%"}</td><td className="py-2">{fr ? "Calcul WF gris agriculture" : "Agricultural grey WF"}</td></tr>
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">{fr ? "Normes qualité eau" : "Water quality standards"}</td><td className="py-2 pr-4">EU WFD, US EPA, WHO</td><td className="py-2">{fr ? "Calcul WF gris" : "Grey WF calculation"}</td></tr>
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">{fr ? "Débit naturel bassins" : "Natural basin flow"}</td><td className="py-2 pr-4">AQUASTAT (FAO)</td><td className="py-2">{fr ? "Calcul pénurie hydrique bleue" : "Blue water scarcity"}</td></tr>
                    <tr><td className="py-2 pr-4">{fr ? "Données commerciales" : "Trade data"}</td><td className="py-2 pr-4">FAOSTAT + COMTRADE (UN)</td><td className="py-2">{fr ? "Empreinte chaîne d'appro" : "Supply chain footprint"}</td></tr>
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Chapitre 4 */}
            <motion.div variants={fadeUp} className="rounded-2xl border border-border bg-background p-6 lg:p-8">
              <h3 className="font-display text-lg font-bold text-foreground mb-4">
                <span className="text-primary mr-2">04</span>
                {fr ? "L'évaluation de la durabilité" : "Sustainability assessment"}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                {fr
                  ? "Un volume d'eau consommé n'a pas la même signification selon où et quand il est consommé. HydroScan croise vos résultats avec les données de disponibilité locale pour identifier les hotspots."
                  : "A volume of water consumed doesn't have the same meaning depending on where and when it's consumed. HydroScan cross-references your results with local availability data to identify hotspots."}
              </p>
              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-lg border border-green-water/20 bg-green-water/5 p-4">
                  <p className="font-mono text-xs text-green-water font-bold mb-1">{fr ? "Pénurie eau verte" : "Green water scarcity"}</p>
                  <p className="font-mono text-xs text-muted-foreground">WS_green = ΣWF_green / WA_green</p>
                  <p className="text-xs text-muted-foreground mt-1">{fr ? "Hotspot si > 100%" : "Hotspot if > 100%"}</p>
                </div>
                <div className="rounded-lg border border-blue-water/20 bg-blue-water/5 p-4">
                  <p className="font-mono text-xs text-blue-water font-bold mb-1">{fr ? "Pénurie eau bleue" : "Blue water scarcity"}</p>
                  <p className="font-mono text-xs text-muted-foreground">WS_blue = ΣWF_blue / WA_blue</p>
                  <p className="text-xs text-muted-foreground mt-1">{fr ? "Hotspot si > 100%" : "Hotspot if > 100%"}</p>
                </div>
                <div className="rounded-lg border border-grey-water/20 bg-grey-water/5 p-4">
                  <p className="font-mono text-xs text-grey-water font-bold mb-1">{fr ? "Niveau de pollution" : "Pollution level"}</p>
                  <p className="font-mono text-xs text-muted-foreground">WPL = ΣWF_grey / {fr ? "Débit actuel" : "Actual flow"}</p>
                  <p className="text-xs text-muted-foreground mt-1">{fr ? "Hotspot si > 100%" : "Hotspot if > 100%"}</p>
                </div>
              </div>
              <p className="mt-4 text-xs text-primary font-semibold">
                ⚠️ {fr ? "Règle absolue : tous ces indicateurs sont calculés au niveau mensuel — jamais annuel uniquement." : "Absolute rule: all indicators are calculated monthly — never annually only."}
              </p>
            </motion.div>

            {/* Chapitre 5 */}
            <motion.div variants={fadeUp} className="rounded-2xl border border-border bg-background p-6 lg:p-8">
              <h3 className="font-display text-lg font-bold text-foreground mb-4">
                <span className="text-primary mr-2">05</span>
                {fr ? "Les limites de l'empreinte eau" : "Limitations of the water footprint"}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                {fr
                  ? "La transparence sur les limites d'un outil est la condition de sa crédibilité."
                  : "Transparency about a tool's limitations is the condition of its credibility."}
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
                  <p className="font-bold text-sm text-foreground mb-2">{fr ? "Ce que l'empreinte eau ne couvre pas" : "What the water footprint doesn't cover"}</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>× {fr ? "Les risques d'inondation" : "Flood risks"}</li>
                    <li>× {fr ? "L'accès à l'eau potable" : "Access to drinking water"}</li>
                    <li>× {fr ? "Les autres impacts environnementaux" : "Other environmental impacts"}</li>
                    <li>× {fr ? "La qualité totale de la gestion de l'eau (IWRM)" : "Overall water management quality (IWRM)"}</li>
                  </ul>
                </div>
                <div className="rounded-xl border border-green-water/20 bg-green-water/5 p-4">
                  <p className="font-bold text-sm text-foreground mb-2">{fr ? "Ce qu'HydroScan fait pour atténuer" : "What HydroScan does to mitigate"}</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>✓ {fr ? "Section hypothèses dans chaque rapport" : "Assumptions section in every report"}</li>
                    <li>✓ {fr ? "Données par défaut documentées" : "Documented default data"}</li>
                    <li>✓ {fr ? "Recommandations d'affinage" : "Refinement recommendations"}</li>
                    <li>✓ {fr ? "Transparence méthodologique totale" : "Full methodological transparency"}</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Chapitre 6 */}
            <motion.div variants={fadeUp} className="rounded-2xl border border-border bg-background p-6 lg:p-8">
              <h3 className="font-display text-lg font-bold text-foreground mb-4">
                <span className="text-primary mr-2">06</span>
                {fr ? "Références & ressources externes" : "References & external resources"}
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <strong className="text-foreground">Hoekstra, A.Y., et al. (2011)</strong> — The Water Footprint Assessment Manual. Earthscan, London. →{" "}
                  <a href="https://waterfootprint.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">waterfootprint.org</a>
                </li>
                <li><strong className="text-foreground">ISO 14046:2014</strong> — {fr ? "Management environnemental — Empreinte eau" : "Environmental management — Water footprint"}</li>
                <li>
                  <strong className="text-foreground">CROPWAT 8.0</strong> →{" "}
                  <a href="https://www.fao.org/land-water/databases-and-software/cropwat/en/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">fao.org/cropwat</a>
                </li>
                <li>
                  <strong className="text-foreground">CLIMWAT 2.0</strong> →{" "}
                  <a href="https://www.fao.org/land-water/databases-and-software/climwat-for-cropwat/en/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">fao.org/climwat</a>
                </li>
                <li>
                  <strong className="text-foreground">AQUASTAT</strong> →{" "}
                  <a href="https://www.fao.org/aquastat/en/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">fao.org/aquastat</a>
                </li>
                <li>
                  <strong className="text-foreground">FAOSTAT</strong> →{" "}
                  <a href="https://www.fao.org/faostat/en/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">fao.org/faostat</a>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="gradient-water py-24 px-[5%] text-center text-primary-foreground">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mx-auto max-w-[640px]">
          <motion.h2 variants={fadeUp} className="font-display text-[clamp(2rem,4vw,3.2rem)] font-extrabold mb-4">
            {fr ? <>Vous avez les connaissances.<br />Passez à l'action.</> : <>You have the knowledge.<br />Take action.</>}
          </motion.h2>
          <motion.p variants={fadeUp} className="opacity-85 max-w-[520px] mx-auto mb-10 text-sm">
            {fr
              ? "Calculez votre empreinte eau en quelques minutes avec la méthodologie que vous venez de lire — directement dans HydroScan."
              : "Calculate your water footprint in minutes using the methodology you just read — directly in HydroScan."}
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-3">
            <Link to="/calculateur" className="inline-flex items-center gap-2 px-8 py-3.5 text-white rounded-[10px] font-bold text-sm hover:-translate-y-0.5 hover:shadow-lg transition-all" style={{ backgroundColor: '#015486' }}>
              💧 {fr ? "Commencer gratuitement" : "Start for free"}
            </Link>
            <Link to="/fonctionnalites" className="inline-block px-8 py-3.5 border-2 border-primary-foreground/50 text-primary-foreground rounded-[10px] font-semibold text-sm hover:border-primary-foreground hover:bg-primary-foreground/10 transition-all">
              {fr ? "Voir la documentation technique" : "View technical documentation"}
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <LandingFooter />
    </div>
  );
}
