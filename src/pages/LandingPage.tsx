import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Droplets,
  ArrowRight,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  BarChart3,
  FileText,
  Database,
  Lightbulb,
  CloudRain,
  Beaker,
  Factory,
  Wheat,
  UtensilsCrossed,
  Hotel,
  ShieldCheck,
  Award,
  Globe,
  BookOpen,
  ChevronRight,
  Users,
  Building2,
  Leaf,
  Target,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

import dashboardPreview from "@/assets/dashboard-preview.jpg";
import { WaterCalculator } from "@/components/landing/WaterCalculator";
import { PricingSection } from "@/components/landing/PricingSection";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-water">
              <Droplets className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">HydroScan</span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#probleme" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Problème</a>
            <a href="#solution" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Solution</a>
            <a href="#fonctionnalites" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Fonctionnalités</a>
            <a href="#tarifs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Tarifs</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">Connexion</Button>
            </Link>
            <Button size="sm" className="gap-1.5">
              Demander une démo <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </nav>

      {/* ====== 1. HERO ====== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/20" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.div variants={fadeUp}>
                <Badge variant="secondary" className="mb-4 gap-1.5 px-3 py-1">
                  <Sparkles className="h-3 w-3" /> Conforme ISO 14046
                </Badge>
              </motion.div>
              <motion.h1
                variants={fadeUp}
                className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
              >
                Mesurez l'
                <span className="text-primary">empreinte eau</span>
                {" "}de votre entreprise
              </motion.h1>
              <motion.p
                variants={fadeUp}
                className="mt-5 max-w-lg text-lg text-muted-foreground"
              >
                Mesurez, analysez et réduisez votre consommation d'eau grâce à une
                plateforme conforme aux standards internationaux.
              </motion.p>
              <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" className="gap-2 text-base">
                  Demander une démo <ArrowRight className="h-4 w-4" />
                </Button>
                <Link to="/dashboard">
                  <Button size="lg" variant="outline" className="text-base">
                    Essayer la plateforme
                  </Button>
                </Link>
              </motion.div>
              <motion.div variants={fadeUp} className="mt-8 flex gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-primary" /> ISO 14046</span>
                <span className="flex items-center gap-1.5"><Award className="h-4 w-4 text-primary" /> GRI 303</span>
                <span className="flex items-center gap-1.5"><Globe className="h-4 w-4 text-primary" /> WFN</span>
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex justify-center"
            >
              <img
                src={dashboardPreview}
                alt="Aperçu du dashboard HydroScan"
                className="w-full rounded-2xl border shadow-elevated"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====== 2. PROBLÈME ====== */}
      <section id="probleme" className="bg-muted/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center"
          >
            <motion.h2 variants={fadeUp} className="text-3xl font-bold sm:text-4xl">
              Pourquoi mesurer son empreinte eau ?
            </motion.h2>
            <motion.p variants={fadeUp} className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              La pression sur les ressources en eau s'intensifie. Les entreprises consomment souvent sans visibilité réelle.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {[
              { icon: AlertTriangle, title: "Ressources sous pression", desc: "Le stress hydrique touche 40% de la population mondiale et s'aggrave chaque année." },
              { icon: Building2, title: "Aucune visibilité", desc: "La plupart des entreprises n'ont pas de suivi structuré de leur consommation d'eau." },
              { icon: BookOpen, title: "Normes ESG", desc: "Les réglementations exigent des indicateurs de performance environnementale." },
              { icon: DollarSign, title: "Coûts croissants", desc: "Le prix de l'eau augmente. Optimiser, c'est aussi réduire ses charges." },
            ].map((item) => (
              <motion.div key={item.title} variants={fadeUp}>
                <Card className="h-full shadow-card">
                  <CardContent className="p-6">
                    <div className="rounded-xl bg-destructive/10 p-2.5 inline-flex">
                      <item.icon className="h-5 w-5 text-destructive" />
                    </div>
                    <h3 className="mt-4 font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-10 flex flex-wrap justify-center gap-6 text-center">
            <div className="rounded-xl bg-card px-8 py-4 shadow-card">
              <p className="text-3xl font-bold text-primary">20%</p>
              <p className="text-sm text-muted-foreground">de l'eau mondiale consommée par l'industrie</p>
            </div>
            <div className="rounded-xl bg-card px-8 py-4 shadow-card">
              <p className="text-3xl font-bold text-primary">70%</p>
              <p className="text-sm text-muted-foreground">de l'eau douce utilisée par l'agriculture</p>
            </div>
          </div>
        </div>
      </section>

      {/* ====== 3. SOLUTION ====== */}
      <section id="solution" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid items-center gap-12 lg:grid-cols-2"
          >
            <motion.div variants={fadeUp}>
              <h2 className="text-3xl font-bold sm:text-4xl">
                Une plateforme <span className="text-primary">intelligente</span> pour gérer votre empreinte eau
              </h2>
              <p className="mt-4 text-muted-foreground">
                HydroScan permet aux entreprises de centraliser, calculer, analyser et optimiser leur consommation d'eau selon les standards internationaux.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  "Centraliser les données de consommation d'eau",
                  "Calculer l'empreinte eau selon les standards internationaux",
                  "Analyser les usages et détecter les inefficacités",
                  "Identifier les actions d'économie d'eau",
                ].map((text) => (
                  <div key={text} className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-full bg-primary/10 p-1">
                      <ChevronRight className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-sm">{text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div variants={fadeUp}>
              <img
                src={dashboardPreview}
                alt="Aperçu de la plateforme HydroScan"
                className="rounded-2xl border shadow-elevated"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ====== 4. FONCTIONNALITÉS ====== */}
      <section id="fonctionnalites" className="bg-muted/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center"
          >
            <motion.h2 variants={fadeUp} className="text-3xl font-bold sm:text-4xl">
              Fonctionnalités principales
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {[
              {
                icon: Database,
                title: "Collecte de données",
                points: ["Saisie simple", "Import Excel / CSV", "Suivi multisites"],
                color: "bg-primary/10 text-primary",
              },
              {
                icon: Droplets,
                title: "Calcul empreinte eau",
                points: ["Eau bleue, verte, grise", "Indicateurs par site", "Méthode ISO 14046"],
                color: "bg-blue-water/10 text-blue-water",
              },
              {
                icon: BarChart3,
                title: "Tableau de bord",
                points: ["Graphiques interactifs", "Évolution mensuelle", "Comparaison multisites"],
                color: "bg-green-water/10 text-green-water",
              },
              {
                icon: FileText,
                title: "Rapports & conformité",
                points: ["Rapport Water Footprint", "Export GRI 303", "Rapport ISO 14046"],
                color: "bg-accent text-accent-foreground",
              },
            ].map((feat) => (
              <motion.div key={feat.title} variants={fadeUp}>
                <Card className="h-full shadow-card hover:shadow-elevated transition-shadow">
                  <CardContent className="p-6">
                    <div className={`inline-flex rounded-xl p-2.5 ${feat.color}`}>
                      <feat.icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-semibold">{feat.title}</h3>
                    <ul className="mt-3 space-y-2">
                      {feat.points.map((p) => (
                        <li key={p} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="h-1 w-1 shrink-0 rounded-full bg-primary" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ====== 5. BÉNÉFICES ====== */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2 variants={fadeUp} className="text-center text-3xl font-bold sm:text-4xl">
              Pourquoi utiliser HydroScan ?
            </motion.h2>
            <motion.div variants={fadeUp} className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {[
                { icon: DollarSign, text: "Réduire les coûts liés à l'eau" },
                { icon: Leaf, text: "Améliorer la performance environnementale" },
                { icon: ShieldCheck, text: "Répondre aux exigences ESG" },
                { icon: Target, text: "Anticiper les risques liés à l'eau" },
                { icon: Award, text: "Améliorer l'image de marque" },
              ].map((b) => (
                <div key={b.text} className="flex flex-col items-center rounded-xl border bg-card p-5 text-center shadow-card">
                  <div className="rounded-lg bg-primary/10 p-2.5">
                    <b.icon className="h-5 w-5 text-primary" />
                  </div>
                  <p className="mt-3 text-sm font-medium">{b.text}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ====== 6. COMMENT ÇA MARCHE ====== */}
      <section className="bg-muted/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-bold sm:text-4xl">Comment ça fonctionne</h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
            Un processus simple en 3 étapes pour maîtriser votre empreinte eau.
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {[
              { step: "1", icon: Database, title: "Collectez vos données eau", desc: "Saisissez ou importez vos données de consommation par source et usage." },
              { step: "2", icon: Droplets, title: "HydroScan calcule votre empreinte", desc: "Notre moteur de calcul analyse vos données selon la méthode ISO 14046." },
              { step: "3", icon: Lightbulb, title: "Identifiez les actions", desc: "Recevez des recommandations pour réduire votre impact et vos coûts." },
            ].map((s) => (
              <div key={s.step} className="relative text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl gradient-water text-2xl font-bold text-primary-foreground">
                  {s.step}
                </div>
                <h3 className="mt-4 font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== 7. CAS D'USAGE ====== */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-bold sm:text-4xl">Adapté à votre secteur</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Factory, sector: "Industrie", desc: "Optimisez vos processus de refroidissement et de nettoyage industriel." },
              { icon: Wheat, sector: "Agriculture", desc: "Améliorez l'efficacité de l'irrigation et réduisez l'eau verte." },
              { icon: UtensilsCrossed, sector: "Agroalimentaire", desc: "Maîtrisez l'eau dans vos chaînes de production alimentaire." },
              { icon: Hotel, sector: "Hôtellerie", desc: "Suivez la consommation eau par chambre et optimisez les sanitaires." },
            ].map((s) => (
              <Card key={s.sector} className="shadow-card hover:shadow-elevated transition-shadow">
                <CardContent className="p-6">
                  <div className="rounded-xl bg-primary/10 p-2.5 inline-flex">
                    <s.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mt-4 font-semibold">{s.sector}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>


      {/* ====== 9. STANDARDS ====== */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-bold sm:text-4xl">Méthodologie reconnue</h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
            HydroScan s'appuie sur les standards internationaux pour garantir la fiabilité de vos résultats.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "ISO 14046", desc: "Norme internationale de référence pour l'empreinte eau", icon: ShieldCheck },
              { title: "Water Footprint Network", desc: "Réseau mondial pour la comptabilité de l'eau", icon: Globe },
              { title: "GRI 303", desc: "Standard de reporting eau dans les rapports ESG", icon: FileText },
              { title: "ESG Reporting", desc: "Intégration dans vos rapports de développement durable", icon: BookOpen },
            ].map((std) => (
              <div key={std.title} className="flex flex-col items-center rounded-xl border bg-card p-6 text-center shadow-card">
                <div className="rounded-lg bg-primary/10 p-3">
                  <std.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-3 font-semibold">{std.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{std.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== CALCULATEUR ====== */}
      <section className="bg-muted/40 py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="mb-8 text-center text-3xl font-bold sm:text-4xl">
            Estimez votre empreinte eau
          </h2>
          <WaterCalculator />
        </div>
      </section>

      {/* ====== 10. TARIFS ====== */}
      <section id="tarifs" className="py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-bold sm:text-4xl">Tarification</h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
            Des plans adaptés à la taille de votre entreprise.
          </p>
          <div className="mt-12">
            <PricingSection />
          </div>
        </div>
      </section>

      {/* ====== 11. CTA FINAL ====== */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="rounded-3xl gradient-water p-10 text-center sm:p-16">
            <h2 className="text-3xl font-bold text-primary-foreground sm:text-4xl">
              Commencez à mesurer votre empreinte eau dès aujourd'hui
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-primary-foreground/80">
              Rejoignez les entreprises qui prennent le contrôle de leur impact hydrique en Tunisie et en Afrique.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="secondary" className="gap-2 text-base">
                Demander une démo <ArrowRight className="h-4 w-4" />
              </Button>
              <Link to="/dashboard">
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-base">
                  Essai gratuit
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md gradient-water">
                <Droplets className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
              <span className="font-bold">HydroScan</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 HydroScan. Plateforme d'empreinte hydrique pour l'Afrique.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
