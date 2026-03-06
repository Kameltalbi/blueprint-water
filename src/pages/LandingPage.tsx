import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Droplets,
  ArrowRight,
  AlertTriangle,
  DollarSign,
  BarChart3,
  FileText,
  Database,
  Lightbulb,
  Factory,
  Wheat,
  UtensilsCrossed,
  Hotel,
  ShieldCheck,
  Award,
  Globe,
  BookOpen,
  ChevronRight,
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
import { EstimateForm } from "@/components/landing/EstimateForm";
import { LangToggle } from "@/components/LangToggle";
import { useI18n } from "@/lib/i18n";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function LandingPage() {
  const { t } = useI18n();

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
            <a href="#probleme" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("nav.problem")}</a>
            <a href="#solution" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("nav.solution")}</a>
            <a href="#fonctionnalites" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("nav.features")}</a>
            <a href="#tarifs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("nav.pricing")}</a>
          </div>
          <div className="flex items-center gap-2">
            <LangToggle />
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">{t("nav.login")}</Button>
            </Link>
            <Button size="sm" className="gap-1.5">
              {t("nav.demo")} <ArrowRight className="h-3.5 w-3.5" />
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
                  <Sparkles className="h-3 w-3" /> {t("hero.badge")}
                </Badge>
              </motion.div>
              <motion.h1
                variants={fadeUp}
                className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
              >
                {t("hero.title1")}
                <span className="text-primary">{t("hero.titleHighlight")}</span>
                {t("hero.title2")}
              </motion.h1>
              <motion.p
                variants={fadeUp}
                className="mt-5 max-w-lg text-lg text-muted-foreground"
              >
                {t("hero.subtitle")}
              </motion.p>
              <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" className="gap-2 text-base">
                  {t("hero.cta1")} <ArrowRight className="h-4 w-4" />
                </Button>
                <Link to="/dashboard">
                  <Button size="lg" variant="outline" className="text-base">
                    {t("hero.cta2")}
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
              <img src={dashboardPreview} alt="HydroScan dashboard" className="w-full rounded-2xl border shadow-elevated" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====== 2. PROBLÈME ====== */}
      <section id="probleme" className="bg-muted/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center">
            <motion.h2 variants={fadeUp} className="text-3xl font-bold sm:text-4xl">{t("problem.title")}</motion.h2>
            <motion.p variants={fadeUp} className="mx-auto mt-4 max-w-2xl text-muted-foreground">{t("problem.subtitle")}</motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: AlertTriangle, titleKey: "problem.card1.title", descKey: "problem.card1.desc" },
              { icon: Building2, titleKey: "problem.card2.title", descKey: "problem.card2.desc" },
              { icon: BookOpen, titleKey: "problem.card3.title", descKey: "problem.card3.desc" },
              { icon: DollarSign, titleKey: "problem.card4.title", descKey: "problem.card4.desc" },
            ].map((item) => (
              <motion.div key={item.titleKey} variants={fadeUp}>
                <Card className="h-full shadow-card">
                  <CardContent className="p-6">
                    <div className="rounded-xl bg-destructive/10 p-2.5 inline-flex">
                      <item.icon className="h-5 w-5 text-destructive" />
                    </div>
                    <h3 className="mt-4 font-semibold">{t(item.titleKey)}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{t(item.descKey)}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-10 flex flex-wrap justify-center gap-6 text-center">
            <div className="rounded-xl bg-card px-8 py-4 shadow-card">
              <p className="text-3xl font-bold text-primary">20%</p>
              <p className="text-sm text-muted-foreground">{t("problem.stat1")}</p>
            </div>
            <div className="rounded-xl bg-card px-8 py-4 shadow-card">
              <p className="text-3xl font-bold text-primary">70%</p>
              <p className="text-sm text-muted-foreground">{t("problem.stat2")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ====== 3. SOLUTION ====== */}
      <section id="solution" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div variants={fadeUp}>
              <h2 className="text-3xl font-bold sm:text-4xl">
                {t("solution.title1")}<span className="text-primary">{t("solution.titleHighlight")}</span>{t("solution.title2")}
              </h2>
              <p className="mt-4 text-muted-foreground">{t("solution.subtitle")}</p>
              <div className="mt-8 space-y-4">
                {["solution.point1", "solution.point2", "solution.point3", "solution.point4"].map((key) => (
                  <div key={key} className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-full bg-primary/10 p-1">
                      <ChevronRight className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-sm">{t(key)}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4">
              {[
                { icon: Database, label: t("features.data.title"), color: "text-primary bg-primary/10" },
                { icon: Droplets, label: t("features.calc.title"), color: "text-blue-water bg-blue-water/10" },
                { icon: BarChart3, label: t("features.dashboard.title"), color: "text-green-water bg-green-water/10" },
                { icon: Lightbulb, label: t("how.step3.title"), color: "text-accent-foreground bg-accent" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center gap-2 rounded-xl border bg-card p-5 text-center shadow-card">
                  <div className={`inline-flex rounded-lg p-2.5 ${item.color}`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ====== 4. FONCTIONNALITÉS ====== */}
      <section id="fonctionnalites" className="bg-muted/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center">
            <motion.h2 variants={fadeUp} className="text-3xl font-bold sm:text-4xl">{t("features.title")}</motion.h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Database, titleKey: "features.data.title", points: ["features.data.p1", "features.data.p2", "features.data.p3"], color: "bg-primary/10 text-primary" },
              { icon: Droplets, titleKey: "features.calc.title", points: ["features.calc.p1", "features.calc.p2", "features.calc.p3"], color: "bg-blue-water/10 text-blue-water" },
              { icon: BarChart3, titleKey: "features.dashboard.title", points: ["features.dashboard.p1", "features.dashboard.p2", "features.dashboard.p3"], color: "bg-green-water/10 text-green-water" },
              { icon: FileText, titleKey: "features.reports.title", points: ["features.reports.p1", "features.reports.p2", "features.reports.p3"], color: "bg-accent text-accent-foreground" },
            ].map((feat) => (
              <motion.div key={feat.titleKey} variants={fadeUp}>
                <Card className="h-full shadow-card hover:shadow-elevated transition-shadow">
                  <CardContent className="p-6">
                    <div className={`inline-flex rounded-xl p-2.5 ${feat.color}`}>
                      <feat.icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-semibold">{t(feat.titleKey)}</h3>
                    <ul className="mt-3 space-y-2">
                      {feat.points.map((p) => (
                        <li key={p} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="h-1 w-1 shrink-0 rounded-full bg-primary" />
                          {t(p)}
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
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="text-center text-3xl font-bold sm:text-4xl">{t("benefits.title")}</motion.h2>
            <motion.div variants={fadeUp} className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {[
                { icon: DollarSign, key: "benefits.b1" },
                { icon: Leaf, key: "benefits.b2" },
                { icon: ShieldCheck, key: "benefits.b3" },
                { icon: Target, key: "benefits.b4" },
                { icon: Award, key: "benefits.b5" },
              ].map((b) => (
                <div key={b.key} className="flex flex-col items-center rounded-xl border bg-card p-5 text-center shadow-card">
                  <div className="rounded-lg bg-primary/10 p-2.5">
                    <b.icon className="h-5 w-5 text-primary" />
                  </div>
                  <p className="mt-3 text-sm font-medium">{t(b.key)}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ====== 6. COMMENT ÇA MARCHE ====== */}
      <section className="bg-muted/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-bold sm:text-4xl">{t("how.title")}</h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">{t("how.subtitle")}</p>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {[
              { step: "1", icon: Database, titleKey: "how.step1.title", descKey: "how.step1.desc" },
              { step: "2", icon: Droplets, titleKey: "how.step2.title", descKey: "how.step2.desc" },
              { step: "3", icon: Lightbulb, titleKey: "how.step3.title", descKey: "how.step3.desc" },
            ].map((s) => (
              <div key={s.step} className="relative text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl gradient-water text-2xl font-bold text-primary-foreground">{s.step}</div>
                <h3 className="mt-4 font-semibold">{t(s.titleKey)}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{t(s.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== 7. CAS D'USAGE ====== */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-bold sm:text-4xl">{t("sectors.title")}</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Factory, titleKey: "sectors.industry", descKey: "sectors.industry.desc" },
              { icon: Wheat, titleKey: "sectors.agriculture", descKey: "sectors.agriculture.desc" },
              { icon: UtensilsCrossed, titleKey: "sectors.food", descKey: "sectors.food.desc" },
              { icon: Hotel, titleKey: "sectors.hotel", descKey: "sectors.hotel.desc" },
            ].map((s) => (
              <Card key={s.titleKey} className="shadow-card hover:shadow-elevated transition-shadow">
                <CardContent className="p-6">
                  <div className="rounded-xl bg-primary/10 p-2.5 inline-flex">
                    <s.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mt-4 font-semibold">{t(s.titleKey)}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{t(s.descKey)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ====== 9. STANDARDS ====== */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-bold sm:text-4xl">{t("standards.title")}</h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">{t("standards.subtitle")}</p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "ISO 14046", descKey: "standards.iso", icon: ShieldCheck },
              { title: "Water Footprint Network", descKey: "standards.wfn", icon: Globe },
              { title: "GRI 303", descKey: "standards.gri", icon: FileText },
              { title: "ESG Reporting", descKey: "standards.esg", icon: BookOpen },
            ].map((std) => (
              <div key={std.title} className="flex flex-col items-center rounded-xl border bg-card p-6 text-center shadow-card">
                <div className="rounded-lg bg-primary/10 p-3">
                  <std.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-3 font-semibold">{std.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t(std.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== CALCULATEUR ====== */}
      <section className="bg-muted/40 py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="mb-8 text-center text-3xl font-bold sm:text-4xl">{t("calc.title")}</h2>
          <WaterCalculator />
        </div>
      </section>

      {/* ====== 10. TARIFS ====== */}
      <section id="tarifs" className="py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-bold sm:text-4xl">{t("pricing.title")}</h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">{t("pricing.subtitle")}</p>
          <div className="mt-12">
            <PricingSection />
          </div>
          <div className="mt-16">
            <EstimateForm />
          </div>
        </div>
      </section>

      {/* ====== 11. CTA FINAL ====== */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="rounded-3xl gradient-water p-10 text-center sm:p-16">
            <h2 className="text-3xl font-bold text-primary-foreground sm:text-4xl">{t("cta.title")}</h2>
            <p className="mx-auto mt-4 max-w-lg text-primary-foreground/80">{t("cta.subtitle")}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button size="lg" className="gap-2 text-base bg-white text-primary hover:bg-white/90 font-semibold">
                {t("cta.demo")} <ArrowRight className="h-4 w-4" />
              </Button>
              <Link to="/dashboard">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/20 text-base font-semibold">
                  {t("cta.trial")}
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
            <p className="text-sm text-muted-foreground">{t("footer.text")}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
