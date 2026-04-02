import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

/* ── Pricing engine ──────────────────────────────────────────────────────── */
const PRO_BASE_M   = 250;   // DT / mois
const ENT_BASE_M   = 399;   // DT / mois
const PRO_ANNUAL   = 2500;  // DT / an  (2 mois offerts)
const ENT_ANNUAL   = 3990;  // DT / an  (2 mois offerts)

function calcPro(sites: number, products: number, users: number) {
  let m = PRO_BASE_M;
  if (sites > 1)     m += (sites - 1) * 45;
  if (products > 20) m += Math.ceil((products - 20) / 10) * 12;
  if (users > 5)     m += (users - 5) * 8;
  return { monthly: m, annualTotal: m * 10 };
}

function calcEnt(sites: number, products: number, users: number) {
  let m = ENT_BASE_M;
  if (sites > 3)  m += (sites - 3) * 32;
  if (users > 20) m += (users - 20) * 6;
  return { monthly: m, annualTotal: m * 10 };
}

function getRecommended(sites: number, products: number, users: number): "free" | "pro" | "enterprise" {
  if (sites >= 4 || products >= 40 || users >= 20) return "enterprise";
  if (sites >= 2 || products >= 5  || users >= 3)  return "pro";
  return "free";
}

/* ── Slider ──────────────────────────────────────────────────────────────── */
function Slider({
  label, value, min, max, onChange, marks,
}: {
  label: string; value: number; min: number; max: number;
  onChange: (n: number) => void;
  marks: { label: string; color: string }[];
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-foreground">{label}</span>
        <span className="font-display text-xl font-bold text-primary">{value}</span>
      </div>
      <div className="relative h-6 flex items-center">
        <div className="w-full h-2 rounded-full bg-border">
          <div className="h-full rounded-full gradient-water transition-all duration-150" style={{ width: `${pct}%` }} />
        </div>
        <input
          type="range" min={min} max={max} value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
        />
      </div>
      <div className="flex gap-2 flex-wrap">
        {marks.map((m, i) => (
          <span key={i} className={`text-[0.65rem] font-medium px-2 py-0.5 rounded-full border ${m.color}`}>{m.label}</span>
        ))}
      </div>
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────────────────── */
export function PricingSection() {
  const { lang } = useI18n();
  const t3 = (fr: string, en: string, ar: string) => lang === "fr" ? fr : lang === "ar" ? ar : en;
  const fmt = (n: number) => n.toLocaleString("fr-FR");

  const [sites, setSites]       = useState(1);
  const [products, setProducts] = useState(5);
  const [users, setUsers]       = useState(3);
  const [annual, setAnnual]     = useState(false);

  const rec = useMemo(() => getRecommended(sites, products, users), [sites, products, users]);
  const pro = useMemo(() => calcPro(sites, products, users), [sites, products, users]);
  const ent = useMemo(() => calcEnt(sites, products, users), [sites, products, users]);

  const recLabel = rec === "free"
    ? t3("Calculateur gratuit", "Free Calculator", "الحاسبة المجانية")
    : rec === "pro" ? "Pro"
    : t3("Entreprise", "Enterprise", "مؤسسة");

  const plans = [
    {
      id: "free",
      name: t3("Calculateur", "Calculator", "حاسبة مجانية"),
      priceDisplay: "0",
      unit: "",
      subNote: t3("Sans inscription — toujours gratuit", "No signup — always free", "بدون تسجيل — مجاني دائمًا"),
      desc: t3(
        "Calculez votre empreinte eau complète en 5 minutes, sans créer de compte.",
        "Calculate your full water footprint in 5 minutes, no account needed.",
        "احسب بصمتك المائية الكاملة في 5 دقائق بدون حساب."
      ),
      popular: false,
      highlight: rec === "free",
      cta: t3("Calculer maintenant →", "Calculate now →", "احسب الآن ←"),
      features: [
        t3("Calcul EV + EB + EG (3 composantes)", "GW + BW + GW calculation (3 components)", "حساب EV + EB + EG (3 مكونات)"),
        t3("12 secteurs · 500+ matières WFN", "12 sectors · 500+ WFN materials", "12 قطاع · +500 مادة WFN"),
        t3("Pondération WSI locale (17 pays)", "Local WSI weighting (17 countries)", "ترجيح WSI المحلي (17 دولة)"),
        t3("Score de performance A→D", "Performance score A→D", "تقييم الأداء A→D"),
        t3("Recommandations automatiques", "Automatic recommendations", "توصيات تلقائية"),
      ],
      missing: [
        t3("Rapport PDF/Word certifié ISO 14046", "ISO 14046 certified PDF/Word report", "تقرير PDF معتمد ISO 14046"),
        t3("Sauvegarde & historique", "Save & history", "حفظ وسجل"),
        t3("Plan d'action IA", "AI action plan", "خطة عمل ذكاء اصطناعي"),
        t3("Benchmarks sectoriels", "Sector benchmarks", "معايير قطاعية"),
      ],
    },
    {
      id: "pro",
      name: "Pro",
      priceDisplay: annual ? fmt(Math.round(pro.annualTotal / 12)) : fmt(pro.monthly),
      unit: t3("DT / mois", "DT / month", "دت / شهر"),
      subNote: annual
        ? t3(`Facturé ${fmt(pro.annualTotal)} DT / an`, `Billed ${fmt(pro.annualTotal)} DT / year`, `يُفوتر ${fmt(pro.annualTotal)} دت / سنة`)
        : t3(`ou ${fmt(pro.annualTotal)} DT / an — 2 mois offerts`, `or ${fmt(pro.annualTotal)} DT / year — 2 months free`, `أو ${fmt(pro.annualTotal)} دت / سنة — شهران مجانًا`),
      desc: t3(
        "Pour les PME industrielles. Rapports certifiés, suivi conformité et plan d'action IA pour réduire vos coûts eau.",
        "For industrial SMEs. Certified reports, compliance tracking and AI action plan to cut water costs.",
        "للمؤسسات الصغيرة والمتوسطة. تقارير معتمدة، تتبع الامتثال وخطة عمل ذكية لتخفيض تكاليف المياه."
      ),
      popular: true,
      highlight: rec === "pro",
      cta: t3("Essai gratuit 14 jours", "14-day free trial", "تجربة مجانية 14 يومًا"),
      features: [
        t3("Tout du plan Calculateur", "Everything in Calculator", "كل ميزات الحاسبة"),
        t3("1 site inclus · +45 DT/site suppl.", "1 site incl. · +45 DT/extra site", "موقع واحد · +45 دت/موقع إضافي"),
        t3("20 produits / entités inclus · +12 DT/10 suppl.", "20 products incl. · +12 DT/10 extra", "20 منتجًا · +12 دت/10 إضافية"),
        t3("5 utilisateurs inclus · +8 DT/utilisateur", "5 users incl. · +8 DT/user", "5 مستخدمين · +8 دت/مستخدم"),
        t3("Rapports PDF & Word certifiés ISO 14046", "ISO 14046 certified PDF & Word reports", "تقارير PDF وWord معتمدة ISO 14046"),
        t3("Benchmarks sectoriels complets", "Complete sector benchmarks", "معايير قطاعية كاملة"),
        t3("Plan d'action IA personnalisé", "Personalized AI action plan", "خطة عمل ذكاء اصطناعي مخصصة"),
        t3("Historique & suivi sur 3 ans", "3-year history & tracking", "سجل وتتبع على 3 سنوات"),
        t3("Suivi conformité réglementaire", "Regulatory compliance tracking", "تتبع الامتثال التنظيمي"),
        t3("Support email prioritaire", "Priority email support", "دعم بريد إلكتروني ذو أولوية"),
      ],
      missing: [
        t3("Dashboard multi-sites consolidé", "Consolidated multi-site dashboard", "لوحة موحدة متعددة المواقع"),
        t3("Intégration ERP (SAP, Odoo)", "ERP integration (SAP, Odoo)", "تكامل ERP (SAP، Odoo)"),
        t3("API REST documentée", "Documented REST API", "API REST موثقة"),
        t3("Account manager dédié", "Dedicated account manager", "مدير حساب مخصص"),
      ],
    },
    {
      id: "enterprise",
      name: t3("Entreprise", "Enterprise", "مؤسسة"),
      priceDisplay: annual ? fmt(Math.round(ent.annualTotal / 12)) : fmt(ent.monthly),
      unit: t3("DT / mois", "DT / month", "دت / شهر"),
      subNote: annual
        ? t3(`Facturé ${fmt(ent.annualTotal)} DT / an`, `Billed ${fmt(ent.annualTotal)} DT / year`, `يُفوتر ${fmt(ent.annualTotal)} دت / سنة`)
        : t3(`ou ${fmt(ent.annualTotal)} DT / an — 2 mois offerts`, `or ${fmt(ent.annualTotal)} DT / year — 2 months free`, `أو ${fmt(ent.annualTotal)} دت / سنة — شهران مجانًا`),
      desc: t3(
        "Pour les grandes entreprises multi-sites. Intégration ERP, API, et accompagnement certification ISO 14046.",
        "For large multi-site enterprises. ERP integration, API, and ISO 14046 certification support.",
        "للشركات الكبيرة متعددة المواقع. تكامل ERP، API، ودعم شهادة ISO 14046."
      ),
      popular: false,
      highlight: rec === "enterprise",
      cta: t3("Demander une démo", "Request a demo", "طلب عرض توضيحي"),
      features: [
        t3("Tout du plan Pro", "Everything in Pro", "كل ميزات Pro"),
        t3("3 sites inclus · +32 DT/site suppl.", "3 sites incl. · +32 DT/extra site", "3 مواقع · +32 دت/موقع إضافي"),
        t3("Produits / entités illimités", "Unlimited products / entities", "منتجات وكيانات غير محدودة"),
        t3("20 utilisateurs inclus · +6 DT/utilisateur", "20 users incl. · +6 DT/user", "20 مستخدمًا · +6 دت/مستخدم"),
        t3("Dashboard multi-sites consolidé", "Consolidated multi-site dashboard", "لوحة موحدة متعددة المواقع"),
        t3("Intégration ERP (SAP, Odoo, Oracle)", "ERP integration (SAP, Odoo, Oracle)", "تكامل ERP (SAP، Odoo، Oracle)"),
        t3("API REST documentée + webhooks", "Documented REST API + webhooks", "API REST موثقة + webhooks"),
        t3("Accompagnement certification ISO 14046", "ISO 14046 certification support", "دعم شهادة ISO 14046"),
        t3("Account manager dédié", "Dedicated account manager", "مدير حساب مخصص"),
        t3("Support téléphonique 5j/7", "Phone support 5d/7", "دعم هاتفي 5 أيام/أسبوع"),
      ],
      missing: [],
    },
  ];

  return (
    <section id="tarifs" className="py-24 px-[5%] bg-card">
      <div className="mx-auto max-w-[1160px]">

        {/* ── Header ── */}
        <p className="text-xs font-bold tracking-[0.18em] uppercase text-primary mb-3">
          {t3("Tarifs", "Pricing", "الأسعار")}
        </p>
        <h2 className="font-display text-[clamp(1.9rem,3.5vw,2.8rem)] font-extrabold text-foreground leading-tight mb-3">
          {t3("Simple, transparent,", "Simple, transparent,", "بسيط، شفاف،")}
          <br />{t3("sans surprise", "no surprises", "بدون مفاجآت")}
        </h2>
        <p className="text-muted-foreground max-w-[540px] mb-8">
          {t3(
            "Le calculateur est 100% gratuit. Les plans Pro et Entreprise s'adaptent à la taille de votre organisation.",
            "The calculator is 100% free. Pro and Enterprise plans scale with your organization size.",
            "الحاسبة مجانية 100%. تتكيف خطط Pro والمؤسسة مع حجم مؤسستك."
          )}
        </p>

        {/* ── Annual / Monthly toggle ── */}
        <div className="flex items-center gap-3 mb-10">
          <span className={`text-sm font-medium ${!annual ? "text-foreground" : "text-muted-foreground"}`}>
            {t3("Mensuel", "Monthly", "شهري")}
          </span>
          <button
            onClick={() => setAnnual(a => !a)}
            className={`relative w-11 h-6 rounded-full transition-colors ${annual ? "bg-primary" : "bg-muted"}`}
            aria-label="Toggle annual billing"
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${annual ? "translate-x-5" : ""}`} />
          </button>
          <span className={`text-sm font-medium ${annual ? "text-foreground" : "text-muted-foreground"}`}>
            {t3("Annuel", "Annual", "سنوي")}
          </span>
          {annual && (
            <span className="text-xs font-bold text-green-water bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              🎁 {t3("2 mois offerts", "2 months free", "شهران مجانًا")}
            </span>
          )}
        </div>

        {/* ── Pricing estimator ── */}
        <div className="bg-background border border-border rounded-2xl p-6 mb-12 shadow-sm">
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-lg">🔧</span>
            <h3 className="font-display text-base font-bold text-foreground">
              {t3("Estimez votre tarif en temps réel", "Estimate your price in real time", "قدّر سعرك في الوقت الفعلي")}
            </h3>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              — {t3("ajustez selon votre organisation", "adjust to your organization", "اضبط وفق مؤسستك")}
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-6">
            <Slider
              label={t3("Sites de production", "Production sites", "مواقع الإنتاج")}
              value={sites} min={1} max={15} onChange={setSites}
              marks={[
                {
                  label: t3(`Pro : ${Math.min(sites, 1)} inclus${sites > 1 ? ` · +${sites - 1} facturé(s)` : ""}`,
                            `Pro: ${Math.min(sites, 1)} incl.${sites > 1 ? ` · +${sites - 1} billed` : ""}`,
                            `Pro: ${Math.min(sites, 1)} مشمول${sites > 1 ? ` · +${sites - 1} مدفوع` : ""}`),
                  color: sites <= 1 ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-amber-50 border-amber-200 text-amber-700",
                },
                {
                  label: t3(`Ent : ${Math.min(sites, 3)} inclus${sites > 3 ? ` · +${sites - 3} facturé(s)` : ""}`,
                            `Ent: ${Math.min(sites, 3)} incl.${sites > 3 ? ` · +${sites - 3} billed` : ""}`,
                            `Ent: ${Math.min(sites, 3)} مشمول${sites > 3 ? ` · +${sites - 3} مدفوع` : ""}`),
                  color: sites <= 3 ? "bg-sky-50 border-sky-200 text-primary" : "bg-amber-50 border-amber-200 text-amber-700",
                },
              ]}
            />
            <Slider
              label={t3("Produits / entités analysés", "Products / entities analyzed", "المنتجات / الكيانات")}
              value={products} min={1} max={100} onChange={setProducts}
              marks={[
                {
                  label: t3(`Pro : ${Math.min(products, 20)} inclus${products > 20 ? ` · +${products - 20} extra` : ""}`,
                            `Pro: ${Math.min(products, 20)} incl.${products > 20 ? ` · +${products - 20} extra` : ""}`,
                            `Pro: ${Math.min(products, 20)} مشمول${products > 20 ? ` · +${products - 20} إضافي` : ""}`),
                  color: products <= 20 ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-amber-50 border-amber-200 text-amber-700",
                },
                {
                  label: t3("Ent : illimité", "Ent: unlimited", "Ent: غير محدود"),
                  color: "bg-sky-50 border-sky-200 text-primary",
                },
              ]}
            />
            <Slider
              label={t3("Utilisateurs / équipe", "Users / team", "المستخدمون / الفريق")}
              value={users} min={1} max={50} onChange={setUsers}
              marks={[
                {
                  label: t3(`Pro : ${Math.min(users, 5)} inclus${users > 5 ? ` · +${users - 5} extra` : ""}`,
                            `Pro: ${Math.min(users, 5)} incl.${users > 5 ? ` · +${users - 5} extra` : ""}`,
                            `Pro: ${Math.min(users, 5)} مشمول${users > 5 ? ` · +${users - 5} إضافي` : ""}`),
                  color: users <= 5 ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-amber-50 border-amber-200 text-amber-700",
                },
                {
                  label: t3(`Ent : ${Math.min(users, 20)} inclus${users > 20 ? ` · +${users - 20} extra` : ""}`,
                            `Ent: ${Math.min(users, 20)} incl.${users > 20 ? ` · +${users - 20} extra` : ""}`,
                            `Ent: ${Math.min(users, 20)} مشمول${users > 20 ? ` · +${users - 20} إضافي` : ""}`),
                  color: users <= 20 ? "bg-sky-50 border-sky-200 text-primary" : "bg-amber-50 border-amber-200 text-amber-700",
                },
              ]}
            />
          </div>

          {/* Recommendation result */}
          <div className={`rounded-xl px-5 py-4 flex flex-wrap items-center justify-between gap-4 border ${
            rec === "free"
              ? "bg-emerald-50 border-emerald-200"
              : rec === "pro"
              ? "bg-primary/5 border-primary/20"
              : "bg-amber-50 border-amber-200"
          }`}>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">
                {t3("Plan recommandé pour votre configuration", "Recommended plan for your setup", "الخطة الموصى بها لإعدادك")}
              </p>
              <p className="font-display font-bold text-lg">
                ⭐ {recLabel}
                {rec !== "free" && (
                  <span className="font-sans text-sm font-normal text-muted-foreground ml-2">
                    — {rec === "pro" ? fmt(pro.monthly) : fmt(ent.monthly)} DT/{t3("mois", "month", "شهر")}
                    {annual && <span className="text-xs ml-1">({t3("facturé annuellement", "billed annually", "يُفوتر سنويًا")})</span>}
                  </span>
                )}
              </p>
            </div>
            <div className="flex gap-5 text-xs">
              <div className="text-center">
                <p className="text-muted-foreground mb-0.5">Pro</p>
                <p className="font-display font-bold text-base text-primary">{fmt(pro.monthly)} DT/{t3("mois", "mo", "شهر")}</p>
                {annual && <p className="text-muted-foreground">{fmt(pro.annualTotal)} DT/{t3("an", "yr", "سنة")}</p>}
              </div>
              <div className="w-px bg-border" />
              <div className="text-center">
                <p className="text-muted-foreground mb-0.5">{t3("Entreprise", "Enterprise", "مؤسسة")}</p>
                <p className="font-display font-bold text-base text-primary">{fmt(ent.monthly)} DT/{t3("mois", "mo", "شهر")}</p>
                {annual && <p className="text-muted-foreground">{fmt(ent.annualTotal)} DT/{t3("an", "yr", "سنة")}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* ── Plan cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className={`landing-price-card relative ${plan.popular ? "popular" : ""} ${plan.highlight && !plan.popular ? "ring-2 ring-primary ring-offset-2" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 gradient-water text-primary-foreground text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                  ⭐ {t3("Le plus populaire", "Most popular", "الأكثر شيوعًا")}
                </div>
              )}
              {plan.highlight && !plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                  ✦ {t3("Recommandé", "Recommended", "موصى به")}
                </div>
              )}
              <p className="font-bold text-foreground mb-1">{plan.name}</p>
              <div className="my-2">
                <span className="font-display text-4xl font-extrabold text-primary leading-none">
                  {plan.priceDisplay}
                </span>
                {plan.unit && (
                  <span className="font-sans text-sm text-muted-foreground font-normal ml-1">{plan.unit}</span>
                )}
                <p className="text-[0.65rem] text-muted-foreground mt-1 min-h-[1rem]">{plan.subNote}</p>
              </div>
              <p className="text-xs text-muted-foreground pb-5 mb-5 border-b border-border leading-relaxed">{plan.desc}</p>
              <ul className="flex flex-col gap-2 mb-7">
                {plan.features.map((f) => (
                  <li key={f} className="text-xs flex gap-2 text-muted-foreground">
                    <span className="flex-shrink-0 font-bold text-green-water mt-px">✓</span>
                    {f}
                  </li>
                ))}
                {plan.missing.map((f) => (
                  <li key={f} className="text-xs flex gap-2 text-muted-foreground/35">
                    <span className="flex-shrink-0 font-bold mt-px">×</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-3 rounded-lg font-semibold text-sm transition-all ${
                plan.popular || plan.highlight
                  ? "gradient-water text-primary-foreground hover:opacity-90"
                  : "border border-border text-muted-foreground hover:border-primary hover:text-primary"
              }`}>
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>

        {/* ── Footnote ── */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          {t3(
            "Tous les prix sont en Dinars Tunisiens (DT) HT · TVA applicable selon la réglementation en vigueur · Les extras sont calculés automatiquement selon votre configuration.",
            "All prices in Tunisian Dinar (DT) excl. VAT · VAT applicable per current regulations · Extras calculated automatically based on your setup.",
            "جميع الأسعار بالدينار التونسي (دت) دون TVA · يتم احتساب الإضافات تلقائيًا وفق إعدادك."
          )}
        </p>
      </div>
    </section>
  );
}
