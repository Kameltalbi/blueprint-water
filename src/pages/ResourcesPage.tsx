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

function ArticleCard({ article, index }: { article: Article; index: number }) {
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
      category: "Fondamentaux",
      categoryColor: "bg-blue-water/10 text-blue-water",
      title: "Eau verte, bleue, grise : quelles différences et pourquoi ça change tout",
      hook: "La plupart des entreprises ne mesurent que l'eau bleue — et passent à côté de 80% de leur empreinte réelle. Voici pourquoi les trois composantes sont indispensables.",
      readTime: "6 min",
      tags: ["#Fondamentaux", "#ISO14046", "#WaterFootprint"],
      content: (
        <>
          <p>Quand on parle de consommation d'eau en entreprise, l'instinct est de regarder la facture d'eau. C'est compréhensible — mais c'est incomplet. La norme ISO 14046 et le Water Footprint Network distinguent trois types d'eau radicalement différents, qui n'ont ni la même origine, ni le même impact, ni les mêmes leviers de réduction.</p>

          <h4>L'eau verte — l'eau invisible de l'agriculture</h4>
          <p>L'eau verte est l'eau de pluie stockée dans le sol et consommée par les plantes par évapotranspiration. Elle ne transite jamais par un réseau, ne figure sur aucune facture, et pourtant elle représente la majorité de l'empreinte eau mondiale — environ 74% selon les estimations du Water Footprint Network.</p>
          <p>Pour une entreprise agroalimentaire, textile ou toute industrie utilisant des matières premières agricoles, l'eau verte de la chaîne d'approvisionnement est souvent la composante dominante. L'ignorer, c'est s'exposer à des angles morts stratégiques majeurs.</p>
          <div className="rounded-lg border border-border bg-background p-4 my-4 font-mono text-sm">
            WF_vert = Évapotranspiration verte / Rendement de la culture
          </div>

          <h4>L'eau bleue — l'eau que l'on prélève</h4>
          <p>L'eau bleue est l'eau de surface (rivières, lacs) ou souterraine (nappes phréatiques) prélevée et consommée — c'est-à-dire non restituée au même bassin versant dans la même période. C'est la composante la plus directement liée aux tensions hydriques locales et aux risques réglementaires.</p>
          <p><strong>Attention :</strong> il ne faut pas confondre prélèvement et consommation. Une usine qui prélève 1 000 m³ et en rejette 900 m³ (traités) dans le même bassin n'a consommé que 100 m³ d'eau bleue. C'est cette consommation nette qui compte dans le calcul.</p>
          <div className="rounded-lg border border-border bg-background p-4 my-4 font-mono text-sm">
            WF_bleu = Évaporation bleue + Eau incorporée + Flux de retour perdu
          </div>

          <h4>L'eau grise — l'eau de la pollution</h4>
          <p>L'eau grise est le volume d'eau théorique nécessaire pour diluer vos rejets polluants jusqu'à atteindre les normes de qualité ambiante acceptables. Elle ne représente pas de l'eau physiquement consommée, mais l'impact de la pollution sur la disponibilité effective de l'eau pour les autres usagers.</p>
          <p>C'est la composante la plus souvent négligée — et celle qui peut exploser dans les secteurs utilisant des engrais, des pesticides ou des produits chimiques industriels. Pour l'agriculture biologique, l'eau grise est par définition nulle.</p>
          <div className="rounded-lg border border-border bg-background p-4 my-4 font-mono text-sm">
            WF_gris = Charge polluante L / (Cmax − Cnat)
          </div>

          <h4>Ce que ça change concrètement</h4>
          <p>Une entreprise qui ne mesure que son eau bleue opérationnelle voit peut-être 5% de son empreinte réelle. Les 95% restants sont dans sa chaîne d'approvisionnement — eau verte des cultures, eau grise des intrants agricoles, eau bleue des fournisseurs en zones de stress hydrique.</p>
          <p>C'est précisément pour cette raison que la norme ISO 14046 impose une approche cycle de vie complète : de la matière première au produit fini, en passant par chaque étape de transformation.</p>
        </>
      ),
    },
    {
      category: "Réglementation",
      categoryColor: "bg-primary/10 text-primary",
      title: "ISO 14046, CSRD, taxonomie verte : ce que les entreprises doivent vraiment savoir en 2025",
      hook: "L'eau s'impose progressivement dans les obligations de reporting environnemental. Tour d'horizon des textes en vigueur et de ce qu'ils impliquent concrètement pour votre organisation.",
      readTime: "8 min",
      tags: ["#Réglementation", "#CSRD", "#ISO14046", "#RSE"],
      content: (
        <>
          <p>Pendant des années, l'eau est restée le parent pauvre du reporting environnemental — derrière le carbone, la biodiversité et les déchets. Ce temps est révolu. Voici les textes que vous devez connaître et ce qu'ils impliquent.</p>

          <h4>ISO 14046 — Le standard technique de référence</h4>
          <p>Publiée en 2014, la norme ISO 14046 est le cadre technique mondial pour l'évaluation de l'empreinte eau dans le contexte d'une analyse du cycle de vie. Elle définit les principes, exigences et lignes directrices pour calculer une empreinte eau crédible et défendable.</p>
          <p><strong>Ce que la norme impose :</strong> une approche cycle de vie complète, une distinction entre les trois composantes (verte, bleue, grise), une évaluation spatiale et temporelle des impacts, et une transparence totale sur les hypothèses et les sources de données.</p>
          <p><strong>Ce que la norme ne prescrit pas :</strong> un outil ou un logiciel particulier, ni un seuil acceptable d'empreinte. Elle définit comment mesurer, pas quelle valeur atteindre.</p>

          <h4>CSRD — L'eau entre dans le reporting obligatoire</h4>
          <p>La Corporate Sustainability Reporting Directive (CSRD), entrée en vigueur progressivement depuis 2024, impose aux grandes entreprises européennes de publier des informations sur leur impact environnemental selon les standards ESRS. L'ESRS E3 est spécifiquement dédié à l'eau et aux ressources marines.</p>
          <p>Il couvre : les prélèvements et consommations d'eau par bassin versant, les rejets dans l'eau, l'exposition aux zones de stress hydrique, et les objectifs de réduction avec leurs jalons temporels. Pour les entreprises dans le champ d'application, ce reporting sera audité — ce qui rend la qualité méthodologique du calcul non négociable.</p>

          <h4>La taxonomie européenne — L'eau comme critère de durabilité</h4>
          <p>La taxonomie verte de l'UE inclut la protection des ressources en eau parmi ses six objectifs environnementaux. Pour qu'une activité économique soit qualifiée de "durable" selon la taxonomie, elle ne doit pas porter atteinte significative (DNSH — Do No Significant Harm) à la protection et à l'utilisation durable des ressources en eau.</p>
          <p>Concrètement : les entreprises qui cherchent à accéder à des financements verts ou à se qualifier pour des appels d'offres publics intégrant des critères ESG doivent pouvoir démontrer leur conformité à cet objectif — ce qui passe par une évaluation rigoureuse de leur empreinte eau.</p>

          <h4>Ce qu'il faut retenir</h4>
          <p>La pression réglementaire sur l'eau va croître, pas diminuer. Les entreprises qui investissent dès maintenant dans une mesure rigoureuse de leur empreinte eau ne subissent pas cette pression — elles la transforment en avantage compétitif.</p>
        </>
      ),
    },
    {
      category: "Secteur",
      categoryColor: "bg-green-water/10 text-green-water",
      title: "Agroalimentaire : pourquoi votre empreinte eau est dans votre chaîne d'approvisionnement, pas dans votre usine",
      hook: "Pour une entreprise agroalimentaire type, plus de 90% de l'empreinte eau se situe en amont — chez les agriculteurs et les transformateurs primaires. Voici comment l'identifier et comment agir.",
      readTime: "7 min",
      tags: ["#Agroalimentaire", "#ChaîneAppro", "#EauVerte"],
      content: (
        <>
          <p>Un industriel agroalimentaire qui mesure uniquement sa consommation d'eau en usine voit une fraction marginale de son impact réel. La quasi-totalité de l'empreinte eau d'un produit alimentaire transformé est accumulée bien en amont — dans les champs, les élevages et les premières étapes de transformation.</p>

          <h4>Le poids de l'eau verte agricole</h4>
          <p>Pour un produit à base de blé, de soja, de coton ou de viande bovine, l'eau verte représente souvent 70 à 90% de l'empreinte totale. Cette eau n'est pas facturée, n'apparaît dans aucun bilan comptable, et n'est mesurée par aucun compteur — mais elle est bien réelle, et sa consommation a des conséquences directes sur les écosystèmes locaux.</p>

          <h4>Les hotspots géographiques : le vrai risque</h4>
          <p>Ce qui compte n'est pas seulement le volume d'eau consommé, mais <strong>où</strong> il est consommé. 1 000 m³ d'eau prélevés en Norvège n'ont pas le même impact que 1 000 m³ prélevés dans le bassin du Guadalquivir en période estivale. Un "hotspot" est une zone géographique et une période temporelle où la consommation d'eau dépasse la disponibilité locale — créant un stress hydrique mesurable.</p>
          <p>Pour identifier vos hotspots fournisseurs, il faut cartographier l'origine géographique de vos intrants et la croiser avec les données de pénurie hydrique locales. C'est exactement ce que fait le moteur de calcul HydroScan.</p>

          <h4>Les leviers d'action pour l'agroalimentaire</h4>
          <p>Les actions les plus efficaces ne sont pas dans l'usine — elles sont dans la relation avec les fournisseurs agricoles : encourager l'irrigation déficitaire, accompagner la transition vers l'agriculture biologique (empreinte grise nulle), favoriser les fournisseurs hors zones de stress, et intégrer des critères eau dans vos cahiers des charges d'achat.</p>
        </>
      ),
    },
    {
      category: "Bonnes pratiques",
      categoryColor: "bg-destructive/10 text-destructive",
      title: "Les 5 erreurs les plus fréquentes dans le calcul d'une empreinte eau",
      hook: "Double comptage, mesure annuelle au lieu de mensuelle, confusion prélèvement/consommation... Ces erreurs méthodologiques sont communes et compromettent la crédibilité de vos résultats.",
      readTime: "5 min",
      tags: ["#Méthodologie", "#BonnesPratiques", "#ISO14046"],
      content: (
        <>
          <p>Après analyse de dizaines de rapports d'empreinte eau, les mêmes erreurs reviennent systématiquement. Les voici, avec la correction à appliquer.</p>

          <h4>Erreur 1 — Mesurer annuellement au lieu de mensuellement</h4>
          <p>L'empreinte eau annuelle d'un bassin versant peut sembler soutenable — et masquer des mois entiers de stress hydrique critique. La norme et le bon sens imposent une granularité mensuelle minimum pour identifier les périodes de tension. Une moyenne annuelle est trompeuse par construction.</p>

          <h4>Erreur 2 — Confondre prélèvement et consommation</h4>
          <p>Le prélèvement (withdrawal) est le volume d'eau extrait d'une source. La consommation (consumptive use) est la part qui n'est pas restituée au même bassin dans la même période. Seule la consommation entre dans le calcul de l'empreinte bleue. Utiliser le prélèvement gonfle artificiellement les résultats et génère de fausses alertes.</p>

          <h4>Erreur 3 — Additionner des empreintes de produits intermédiaires</h4>
          <p>Additionner l'empreinte du coton brut + l'empreinte du fil + l'empreinte du tissu revient à compter la même eau trois fois. L'approche correcte est l'approche accumulative : chaque étape ajoute uniquement sa valeur ajoutée en eau, pas la totalité de l'empreinte du produit intermédiaire entrant.</p>

          <h4>Erreur 4 — Retenir plusieurs polluants pour l'empreinte grise</h4>
          <p>L'empreinte grise se calcule polluant par polluant, et on retient uniquement le polluant critique — celui qui génère le volume de dilution le plus élevé. Faire une moyenne ou additionner les empreintes grises de plusieurs polluants est une erreur méthodologique explicitement déconseillée par la norme.</p>

          <h4>Erreur 5 — Utiliser le débit actuel pour la pénurie bleue</h4>
          <p>Pour calculer la disponibilité en eau bleue d'un bassin versant, il faut utiliser le débit naturel — tel qu'il serait sans aucune intervention humaine — et non le débit actuel, qui a déjà été réduit par les prélèvements existants. Utiliser le débit actuel sous-estime systématiquement le niveau de pénurie réelle.</p>
        </>
      ),
    },
    {
      category: "Stratégie",
      categoryColor: "bg-accent text-accent-foreground",
      title: "Réduire son empreinte eau : par où commencer quand on ne sait pas où regarder",
      hook: "La matrice de priorisation du Water Footprint Network répond à cette question avec une logique simple : fort potentiel de réduction + zone de stress hydrique = priorité absolue.",
      readTime: "6 min",
      tags: ["#Réduction", "#Stratégie", "#Hotspot"],
      content: (
        <>
          <p>La tentation, une fois l'empreinte calculée, est d'agir là où c'est le plus visible ou le plus facile. C'est rarement là où c'est le plus efficace. Voici la méthode recommandée par le Water Footprint Network pour prioriser vos actions.</p>

          <h4>La matrice de priorisation</h4>
          <p>Le WFN propose une grille simple à deux axes : la présence ou non d'un hotspot (zone de stress hydrique avéré) et le potentiel de réduction (la mesure est-elle techniquement et économiquement faisable ?).</p>
          <p>La priorité maximale (++) est donnée aux actions à fort potentiel de réduction situées dans des hotspots. La priorité nulle (0) concerne les mesures à faible potentiel hors hotspot — inutile d'y consacrer de l'énergie.</p>

          <h4>Réduire hors hotspot a quand même du sens</h4>
          <p>Un point contre-intuitif mais important : réduire son empreinte dans une zone sans stress hydrique n'est pas sans intérêt. Chaque m³ économisé localement réduit la pression sur les ressources mondiales, augmente la productivité hydrique globale et libère de la capacité pour d'autres usages. Ce n'est pas prioritaire, mais ce n'est pas inutile.</p>

          <h4>Les trois grands leviers selon votre profil</h4>
          <p><strong>Pour un industriel :</strong> le recyclage en circuit fermé peut amener l'empreinte bleue opérationnelle à zéro. C'est techniquement faisable, souvent rentable à moyen terme, et c'est le levier le plus puissant disponible.</p>
          <p><strong>Pour un acteur agricole :</strong> l'irrigation déficitaire (petites quantités ciblées pendant les périodes critiques) et le passage à l'agriculture biologique (empreinte grise nulle) sont les deux actions à plus fort impact.</p>
          <p><strong>Pour un responsable achats :</strong> revoir les critères de sélection des fournisseurs pour intégrer l'origine géographique des matières premières par rapport aux zones de stress hydrique est le levier le plus systémique — et souvent le plus négligé.</p>

          <h4>L'offsetting : en dernier recours seulement</h4>
          <p>La compensation de l'empreinte eau (investir dans des projets de restauration de bassins versants) est une option valide — mais uniquement après avoir réduit au maximum ce qui peut l'être. L'utiliser comme premier recours est une forme de greenwashing que les auditeurs et les ONG repèrent immédiatement.</p>
        </>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-card font-sans">
      <PageMeta
        title="Ressources — HydroScan"
        description="Articles, guides et documentation méthodologique sur l'empreinte eau. Tout pour comprendre, calculer et agir."
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
            Ressources
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-muted-foreground max-w-[620px] mx-auto">
            Tout ce qu'il faut savoir sur l'empreinte eau — pour comprendre, calculer et agir avec méthode.
          </motion.p>
        </motion.div>
      </section>

      {/* ── Articles ── */}
      <section className="py-20 px-[5%] bg-background">
        <div className="mx-auto max-w-[900px]">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-12">
            <p className="text-xs font-bold tracking-[0.18em] uppercase text-primary mb-3">
              Articles & Analyses
            </p>
            <h2 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] font-extrabold text-foreground leading-tight mb-3">
              Les dernières publications de l'équipe HydroScan
            </h2>
            <p className="text-muted-foreground text-sm max-w-[600px]">
              Sur l'empreinte eau, la réglementation et les bonnes pratiques sectorielles.
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
              <ArticleCard key={i} article={article} index={i} />
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
                Guide Méthodologique
              </p>
            </div>
            <h2 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] font-extrabold text-foreground leading-tight mb-3">
              La référence complète pour comprendre comment HydroScan calcule votre empreinte eau
            </h2>
            <p className="text-muted-foreground text-sm max-w-[700px]">
              HydroScan est construit sur le standard le plus rigoureux disponible : <em>The Water Footprint Assessment Manual</em> (Hoekstra, Chapagain, Aldaya, Mekonnen — Water Footprint Network, 2011), base de la norme ISO 14046. Ce guide explique comment cette méthodologie est appliquée dans la plateforme, quelles sources de données sont utilisées, et quelles hypothèses sont retenues.
            </p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="flex flex-col gap-8">
            {/* Chapitre 1 */}
            <motion.div variants={fadeUp} className="rounded-2xl border border-border bg-background p-6 lg:p-8">
              <h3 className="font-display text-lg font-bold text-foreground mb-4">
                <span className="text-primary mr-2">01</span>
                Les fondements : pourquoi trois composantes ?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                L'eau douce se présente sous trois formes fonctionnellement différentes dans les systèmes de production humains. Les traiter comme une seule entité homogène conduit à des évaluations incomplètes et à des décisions mal informées.
              </p>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-blue-water/20 bg-blue-water/5 p-4">
                  <p className="font-bold text-blue-water text-sm mb-1">💧 Eau bleue</p>
                  <p className="text-xs text-muted-foreground">Prélevée dans les cours d'eau, lacs ou nappes phréatiques. Directement liée aux tensions hydriques locales.</p>
                </div>
                <div className="rounded-xl border border-green-water/20 bg-green-water/5 p-4">
                  <p className="font-bold text-green-water text-sm mb-1">🌿 Eau verte</p>
                  <p className="text-xs text-muted-foreground">Issue des précipitations, stockée dans le sol, consommée par les végétaux. Principale composante de l'agriculture.</p>
                </div>
                <div className="rounded-xl border border-grey-water/20 bg-grey-water/5 p-4">
                  <p className="font-bold text-grey-water text-sm mb-1">🏭 Eau grise</p>
                  <p className="text-xs text-muted-foreground">Volume théorique nécessaire pour diluer les rejets jusqu'aux normes ambiantes. Peut atteindre zéro pour le bio.</p>
                </div>
              </div>
            </motion.div>

            {/* Chapitre 2 */}
            <motion.div variants={fadeUp} className="rounded-2xl border border-border bg-background p-6 lg:p-8">
              <h3 className="font-display text-lg font-bold text-foreground mb-4">
                <span className="text-primary mr-2">02</span>
                Les formules de calcul
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">Empreinte verte et bleue d'un procédé agricole</p>
                  <div className="rounded-lg border border-border bg-card p-4 font-mono text-sm text-muted-foreground">
                    <p>WF_vert (m³/tonne) = CWU_vert / Rendement</p>
                    <p>WF_bleu (m³/tonne) = CWU_bleu / Rendement</p>
                    <p className="mt-2 text-xs opacity-70">CWU = Consommation en eau de la culture (modèle CROPWAT 8.0 — FAO)</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">Empreinte grise</p>
                  <div className="rounded-lg border border-border bg-card p-4 font-mono text-sm text-muted-foreground">
                    <p>WF_gris (m³/tonne) = Charge polluante L / (Cmax − Cnat) / Rendement</p>
                    <p className="mt-2 text-xs opacity-70">Cmax = concentration max acceptable · Cnat = concentration naturelle</p>
                    <p className="text-xs opacity-70">Règle : retenir uniquement le polluant critique</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">Empreinte d'un produit (approche accumulative)</p>
                  <div className="rounded-lg border border-border bg-card p-4 font-mono text-sm text-muted-foreground">
                    <p>WF_prod[p] = WF_proc[p] + Σ (WF_prod[input_i] / f_produit[p,i]) × f_valeur[p]</p>
                    <p className="mt-2 text-xs opacity-70">f_valeur[p] = valeur économique du produit p / Σ valeur de tous les co-produits</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Chapitre 3 */}
            <motion.div variants={fadeUp} className="rounded-2xl border border-border bg-background p-6 lg:p-8">
              <h3 className="font-display text-lg font-bold text-foreground mb-4">
                <span className="text-primary mr-2">03</span>
                Les sources de données utilisées
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 pr-4 font-semibold text-foreground">Donnée</th>
                      <th className="text-left py-2 pr-4 font-semibold text-foreground">Source</th>
                      <th className="text-left py-2 font-semibold text-foreground">Usage</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">Évapotranspiration cultures</td><td className="py-2 pr-4">CROPWAT 8.0 (FAO)</td><td className="py-2">Calcul WF vert et bleu agricole</td></tr>
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">Données climatiques</td><td className="py-2 pr-4">CLIMWAT 2.0 (FAO)</td><td className="py-2">Alimentation CROPWAT</td></tr>
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">Rendements agricoles</td><td className="py-2 pr-4">FAOSTAT + Monfreda et al.</td><td className="py-2">Conversion CWU → m³/tonne</td></tr>
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">Engrais & pesticides</td><td className="py-2 pr-4">FertiStat (FAO) + IFA</td><td className="py-2">Calcul charge polluante</td></tr>
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">Fraction lixiviation azote</td><td className="py-2 pr-4">Valeur par défaut : α = 10%</td><td className="py-2">Calcul WF gris agriculture</td></tr>
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">Normes qualité eau</td><td className="py-2 pr-4">EU WFD, US EPA, WHO</td><td className="py-2">Calcul WF gris</td></tr>
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">Débit naturel bassins</td><td className="py-2 pr-4">AQUASTAT (FAO)</td><td className="py-2">Calcul pénurie hydrique bleue</td></tr>
                    <tr><td className="py-2 pr-4">Données commerciales</td><td className="py-2 pr-4">FAOSTAT + COMTRADE (ONU)</td><td className="py-2">Empreinte chaîne d'appro</td></tr>
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Chapitre 4 */}
            <motion.div variants={fadeUp} className="rounded-2xl border border-border bg-background p-6 lg:p-8">
              <h3 className="font-display text-lg font-bold text-foreground mb-4">
                <span className="text-primary mr-2">04</span>
                L'évaluation de la durabilité
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                Un volume d'eau consommé n'a pas la même signification selon où et quand il est consommé. HydroScan croise vos résultats de calcul avec les données de disponibilité locale pour identifier les hotspots.
              </p>
              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-lg border border-green-water/20 bg-green-water/5 p-4">
                  <p className="font-mono text-xs text-green-water font-bold mb-1">Pénurie eau verte</p>
                  <p className="font-mono text-xs text-muted-foreground">WS_vert = ΣWF_vert / WA_vert</p>
                  <p className="text-xs text-muted-foreground mt-1">Hotspot si &gt; 100%</p>
                </div>
                <div className="rounded-lg border border-blue-water/20 bg-blue-water/5 p-4">
                  <p className="font-mono text-xs text-blue-water font-bold mb-1">Pénurie eau bleue</p>
                  <p className="font-mono text-xs text-muted-foreground">WS_bleu = ΣWF_bleu / WA_bleu</p>
                  <p className="text-xs text-muted-foreground mt-1">Hotspot si &gt; 100%</p>
                </div>
                <div className="rounded-lg border border-grey-water/20 bg-grey-water/5 p-4">
                  <p className="font-mono text-xs text-grey-water font-bold mb-1">Niveau de pollution</p>
                  <p className="font-mono text-xs text-muted-foreground">WPL = ΣWF_gris / Débit actuel</p>
                  <p className="text-xs text-muted-foreground mt-1">Hotspot si &gt; 100%</p>
                </div>
              </div>
              <p className="mt-4 text-xs text-primary font-semibold">
                ⚠️ Règle absolue : tous ces indicateurs sont calculés au niveau mensuel — jamais annuel uniquement.
              </p>
            </motion.div>

            {/* Chapitre 5 */}
            <motion.div variants={fadeUp} className="rounded-2xl border border-border bg-background p-6 lg:p-8">
              <h3 className="font-display text-lg font-bold text-foreground mb-4">
                <span className="text-primary mr-2">05</span>
                Les limites de l'empreinte eau
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                La transparence sur les limites d'un outil est la condition de sa crédibilité. L'empreinte eau, aussi rigoureuse soit-elle, ne traite pas de tout.
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
                  <p className="font-bold text-sm text-foreground mb-2">Ce que l'empreinte eau ne couvre pas</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>× Les risques d'inondation</li>
                    <li>× L'accès à l'eau potable</li>
                    <li>× Les autres impacts environnementaux</li>
                    <li>× La qualité totale de la gestion de l'eau (IWRM)</li>
                  </ul>
                </div>
                <div className="rounded-xl border border-green-water/20 bg-green-water/5 p-4">
                  <p className="font-bold text-sm text-foreground mb-2">Ce qu'HydroScan fait pour atténuer</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>✓ Section hypothèses dans chaque rapport</li>
                    <li>✓ Données par défaut documentées</li>
                    <li>✓ Recommandations d'affinage</li>
                    <li>✓ Transparence méthodologique totale</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Chapitre 6 */}
            <motion.div variants={fadeUp} className="rounded-2xl border border-border bg-background p-6 lg:p-8">
              <h3 className="font-display text-lg font-bold text-foreground mb-4">
                <span className="text-primary mr-2">06</span>
                Références & ressources externes
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <strong className="text-foreground">Hoekstra, A.Y., et al. (2011)</strong> — The Water Footprint Assessment Manual. Earthscan, London. →{" "}
                  <a href="https://waterfootprint.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">waterfootprint.org</a>
                </li>
                <li><strong className="text-foreground">ISO 14046:2014</strong> — Management environnemental — Empreinte eau</li>
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
            Vous avez les connaissances.<br />Passez à l'action.
          </motion.h2>
          <motion.p variants={fadeUp} className="opacity-85 max-w-[520px] mx-auto mb-10 text-sm">
            Calculez votre empreinte eau en quelques minutes avec la méthodologie que vous venez de lire — directement dans HydroScan.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-3">
            <Link to="/calculateur" className="inline-flex items-center gap-2 px-8 py-3.5 text-white rounded-[10px] font-bold text-sm hover:-translate-y-0.5 hover:shadow-lg transition-all" style={{ backgroundColor: '#015486' }}>
              💧 Commencer gratuitement
            </Link>
            <Link to="/fonctionnalites" className="inline-block px-8 py-3.5 border-2 border-primary-foreground/50 text-primary-foreground rounded-[10px] font-semibold text-sm hover:border-primary-foreground hover:bg-primary-foreground/10 transition-all">
              Voir la documentation technique
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <LandingFooter />
    </div>
  );
}
