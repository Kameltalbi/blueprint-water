import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { Link } from "react-router-dom";
import { LayoutDashboard, Map, FileBarChart, Target, TrendingDown, ArrowRight } from "lucide-react";

const features = [
  {
    icon: LayoutDashboard,
    labelFr: "Tableau de bord", labelEn: "Dashboard", labelAr: "لوحة القيادة",
    descFr: "KPIs, tendances N vs N-1, alertes intelligentes",
    descEn: "KPIs, N vs N-1 trends, smart alerts",
    descAr: "مؤشرات الأداء، اتجاهات N مقابل N-1، تنبيهات ذكية",
    color: "text-primary bg-primary/10",
  },
  {
    icon: Map,
    labelFr: "Carte de stress hydrique", labelEn: "Water Stress Map", labelAr: "خريطة ضغط المياه",
    descFr: "WSI mondial, couches AWARE & rareté bleue",
    descEn: "Global WSI, AWARE & blue scarcity layers",
    descAr: "WSI عالمي، طبقات AWARE وشح المياه الزرقاء",
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    icon: Target,
    labelFr: "Objectifs & cibles", labelEn: "Targets & goals", labelAr: "الأهداف والغايات",
    descFr: "Suivi de réduction vs baseline en temps réel",
    descEn: "Real-time reduction tracking vs baseline",
    descAr: "تتبع فوري للتخفيض مقارنةً بالخط القاعدي",
    color: "text-amber-600 bg-amber-50",
  },
  {
    icon: FileBarChart,
    labelFr: "Rapports PDF", labelEn: "PDF Reports", labelAr: "تقارير PDF",
    descFr: "ISO 14046, GRI 303, export CSV inclus",
    descEn: "ISO 14046, GRI 303, CSV export included",
    descAr: "ISO 14046، GRI 303، تصدير CSV مدرج",
    color: "text-purple-600 bg-purple-50",
  },
  {
    icon: TrendingDown,
    labelFr: "Plan d'action", labelEn: "Action Plan", labelAr: "خطة العمل",
    descFr: "Recommandations WFN priorisées par potentiel",
    descEn: "WFN recommendations prioritized by potential",
    descAr: "توصيات WFN مرتبة حسب الإمكانية",
    color: "text-rose-600 bg-rose-50",
  },
];

export function ProductPreviewSection() {
  const { lang } = useI18n();
  const t3 = (fr: string, en: string, ar: string) => lang === "fr" ? fr : lang === "ar" ? ar : en;

  return (
    <section className="py-24 px-[5%] bg-[hsl(var(--pale))]">
      <div className="mx-auto max-w-[1200px]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary mb-5">
            <LayoutDashboard className="h-3.5 w-3.5" />
            {t3("La plateforme complète", "The complete platform", "المنصة الكاملة")}
          </div>
          <h2 className="font-display text-[clamp(1.8rem,3.5vw,2.8rem)] font-extrabold text-foreground">
            {t3("Tout ce dont vous avez besoin", "Everything you need", "كل ما تحتاجه")}
            <br />
            <span className="bg-gradient-to-r from-primary to-[hsl(var(--sky))] bg-clip-text text-transparent">
              {t3("dans une seule interface", "in one interface", "في واجهة واحدة")}
            </span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-[520px] mx-auto text-sm">
            {t3(
              "De la saisie des données à la génération du rapport, en passant par la carte de stress hydrique mondiale — HydroScan couvre tout le cycle de l'empreinte eau.",
              "From data entry to report generation, including the global water stress map — HydroScan covers the entire water footprint cycle.",
              "من إدخال البيانات إلى إنشاء التقرير، مرورًا بخريطة ضغط المياه العالمية — يغطي HydroScan دورة البصمة المائية بالكامل."
            )}
          </p>
        </motion.div>

        {/* Feature cards grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-12"
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
              className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300"
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${f.color}`}>
                <f.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-sm">{t3(f.labelFr, f.labelEn, f.labelAr)}</p>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{t3(f.descFr, f.descEn, f.descAr)}</p>
              </div>
            </motion.div>
          ))}

          {/* CTA card */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-5 text-center"
          >
            <p className="text-sm font-semibold text-primary mb-1">
              {t3("Et bien plus...", "And much more...", "والمزيد...")}
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              {t3("Saisie multi-sites, chaîne d'approvisionnement, rejets", "Multi-site entry, supply chain, effluents", "إدخال متعدد المواقع، سلسلة التوريد، المخلفات")}
            </p>
            <Link
              to="/fonctionnalites"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              {t3("Voir toutes les fonctionnalités", "See all features", "عرض جميع الميزات")}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>
        </motion.div>

        {/* App mockup — styled UI preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="relative rounded-2xl border border-border bg-card shadow-xl overflow-hidden"
        >
          {/* Browser chrome */}
          <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-2.5">
            <div className="h-3 w-3 rounded-full bg-red-400" />
            <div className="h-3 w-3 rounded-full bg-amber-400" />
            <div className="h-3 w-3 rounded-full bg-emerald-400" />
            <div className="ml-4 flex-1 max-w-[280px] rounded-md bg-background border border-border px-3 py-1 text-[11px] text-muted-foreground">
              app.hydroscan.io/dashboard
            </div>
          </div>

          {/* Mock dashboard content */}
          <div className="grid grid-cols-4 min-h-[340px]">
            {/* Sidebar */}
            <div className="col-span-1 border-r border-border bg-muted/20 p-4 space-y-2 hidden sm:block">
              {["Tableau de bord", "Consommation", "Carte stress", "Rapports", "Plan d'action"].map((item, i) => (
                <div
                  key={item}
                  className={`rounded-lg px-3 py-2 text-xs font-medium ${i === 0 ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
                >
                  {item}
                </div>
              ))}
            </div>

            {/* Main content */}
            <div className="col-span-4 sm:col-span-3 p-5 space-y-4">
              {/* KPI row */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Volume total", value: "28 500 m³", color: "text-primary" },
                  { label: "Score complétude", value: "87%", color: "text-emerald-600" },
                  { label: "vs N-1", value: "−12.3%", color: "text-emerald-600" },
                ].map((kpi) => (
                  <div key={kpi.label} className="rounded-xl border border-border bg-background p-3">
                    <p className="text-[10px] text-muted-foreground">{kpi.label}</p>
                    <p className={`text-base font-black mt-0.5 ${kpi.color}`}>{kpi.value}</p>
                  </div>
                ))}
              </div>

              {/* Chart placeholder */}
              <div className="rounded-xl border border-border bg-background p-4">
                <p className="text-xs font-semibold mb-3">{t3("Évolution mensuelle — 2026 vs 2025", "Monthly trend — 2026 vs 2025", "التطور الشهري — 2026 مقابل 2025")}</p>
                <div className="flex items-end gap-1.5 h-16">
                  {[40, 55, 45, 70, 60, 80, 65, 90, 75, 85, 70, 60].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col gap-0.5 items-center">
                      <div className="w-full rounded-sm bg-primary/20" style={{ height: `${h * 0.5}%` }} />
                      <div className="w-full rounded-sm bg-primary/60" style={{ height: `${h * 0.4}%` }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border bg-background p-3">
                  <p className="text-[10px] text-muted-foreground mb-2">{t3("Objectif réduction", "Reduction target", "هدف التخفيض")}</p>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full w-[62%] rounded-full bg-amber-400" />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">62% / 15% cible</p>
                </div>
                <div className="rounded-xl border border-border bg-background p-3">
                  <p className="text-[10px] text-muted-foreground mb-1">{t3("Alerte active", "Active alert", "تنبيه نشط")}</p>
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                    <p className="text-[10px] text-foreground">{t3("Mois en cours non renseigné", "Current month missing", "الشهر الحالي غير مسجّل")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-10 text-center"
        >
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-xl px-8 py-3.5 font-bold text-sm text-primary-foreground gradient-water shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            {t3("Essayer gratuitement", "Try for free", "جرب مجانًا")}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-3 text-xs text-muted-foreground">
            {t3("Aucune carte bancaire requise · Accès immédiat", "No credit card required · Instant access", "لا يلزم بطاقة بنكية · وصول فوري")}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
