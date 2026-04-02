import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PageMeta } from "@/components/PageMeta";
import { useI18n } from "@/lib/i18n";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import {
  Droplets,
  Zap,
  BarChart3,
  FileText,
  Map,
  TrendingUp,
  FlaskConical,
  Globe,
  AlertTriangle,
  ShieldAlert,
  TrendingDown,
  Gauge,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

export default function FeaturesPage() {
  const { lang } = useI18n();
  const fr = lang === "fr";
  const t3 = (fr: string, en: string, ar: string) => lang === "fr" ? fr : lang === "ar" ? ar : en;

  const tunisiaFeatures = [
    {
      icon: <Droplets className="h-7 w-7" />,
      badge: "🇹🇳",
      title: t3("Saisie multi-sources tunisienne : SONEDE, forage, REUT, eau de pluie", "Tunisian multi-source input: SONEDE, borehole, REUT, rainwater", "إدخال متعدد المصادر التونسية: سونيد، آبار، REUT، مياه الأمطار"),
      hook: t3("La seule plateforme conçue pour les factures SONEDE et les puits privés tunisiens.", "The only platform designed for SONEDE invoices and Tunisian private wells.", "المنصة الوحيدة المصممة لفواتير سونيد والآبار الخاصة التونسية."),
      body: t3("Oubliez les sources génériques 'réseau municipal'. HydroScan reconnaît nativement SONEDE, les forages / puits privés, l'eau de pluie récupérée, les camions-citernes et le REUT. Chaque saisie peut référencer un numéro de facture ou de compteur SONEDE pour une traçabilité complète.", "Forget generic 'municipal network' sources. HydroScan natively recognizes SONEDE, boreholes / private wells, recovered rainwater, tanker trucks and REUT. Each entry can reference a SONEDE invoice or meter number for full traceability.", "انسَ مصادر 'الشبكة البلدية' العامة. يتعرف HydroScan أصلًا على سونيد والآبار والمياه المطرية وصهاريج المياه وإعادة استخدام المياه المعالجة."),
      points: lang === "fr"
        ? ["Sources : SONEDE, Forage/Puits, Eau de pluie, REUT, Camion-citerne, Source/Oued","Référence facture / compteur SONEDE optionnelle par saisie","Périodes mensuelles granulaires : Janvier 2025… Décembre 2026","Usages process détaillés : Refroidissement, Rinçage, Chaudière/Vapeur, Lavage…"]
        : lang === "ar"
        ? ["المصادر: سونيد، حفر/بئر، مياه مطرية، REUT، صهريج","مرجع فاتورة / عداد سونيد اختياري لكل إدخال","فترات شهرية دقيقة: يناير 2025... ديسمبر 2026","استخدامات العمليات: تبريد، شطف، مرجل/بخار، غسيل..."]
        : ["Sources: SONEDE, Borehole/Well, Rainwater, REUT, Tanker truck, Spring/Oued","Optional SONEDE invoice/meter reference per entry","Granular monthly periods: January 2025… December 2026","Detailed process usages: Cooling, Rinsing, Boiler/Steam, Washing…"],
      why: t3("Les PME tunisiennes s'approvisionnent rarement depuis une seule source. Une comptabilité eau exacte commence par des catégories adaptées à la réalité du terrain tunisien.", "Tunisian SMEs rarely source from a single supply. Accurate water accounting starts with categories adapted to Tunisian ground reality.", "نادرًا ما تعتمد المؤسسات الصغيرة والمتوسطة التونسية على مصدر واحد. المحاسبة المائية الدقيقة تبدأ بتصنيفات تتوافق مع الواقع التونسي."),
      color: "text-blue-water",
    },
    {
      icon: <FlaskConical className="h-7 w-7" />,
      badge: "⚗️",
      title: t3("Simulateur pénalités ONAS — norme NT 106.002", "ONAS penalties simulator — NT 106.002 standard", "محاكي غرامات ONAS — معيار NT 106.002"),
      hook: t3("Calculez vos pénalités ONAS avant que l'inspecteur ne le fasse.", "Calculate your ONAS penalties before the inspector does.", "احسب غرامات ONAS قبل أن يفعل المفتش ذلك."),
      body: t3("HydroScan intègre la norme tunisienne NT 106.002 (INNORPI) pour DBO₅, DCO, MES, Azote, Phosphore, Chrome et Détergents. Saisissez vos concentrations mesurées, le simulateur calcule la charge polluante excédentaire, l'estimation de pénalité annuelle en dinars tunisiens, et les actions correctives prioritaires.", "HydroScan integrates the Tunisian NT 106.002 standard (INNORPI) for BOD₅, COD, TSS, Nitrogen, Phosphorus, Chromium and Detergents. Enter your measured concentrations, and the simulator calculates excess pollutant load, annual penalty estimates in Tunisian dinars, and priority corrective actions.", "يدمج HydroScan معيار NT 106.002 التونسي لـ BOD5 وCOD والمواد العالقة والنيتروجين والفوسفور والكروم والمنظفات."),
      points: lang === "fr"
        ? ["8 polluants : DBO₅, DCO, MES, Azote, Phosphore, Huiles, Chrome, Détergents","Calcul charge excédentaire en kg/an × tarif ONAS DT/kg","Estimation pénalité annuelle en dinars tunisiens","Top 3 des leviers correctives avec économies potentielles chiffrées"]
        : lang === "ar"
        ? ["8 ملوثات: BOD5، COD، TSS، نيتروجين، فوسفور، زيوت، كروم، منظفات","حساب الحمل الزائد بكغ/سنة × تعرفة ONAS بالدينار التونسي","تقدير الغرامة السنوية بالدينار التونسي","أفضل 3 إجراءات تصحيحية مع توفيرات محتملة مُحسوبة"]
        : ["8 pollutants: BOD₅, COD, TSS, Nitrogen, Phosphorus, Oils, Chrome, Detergents","Excess load calculation in kg/yr × ONAS tariff DT/kg","Annual penalty estimate in Tunisian dinars","Top 3 corrective levers with quantified potential savings"],
      why: t3("Les pénalités ONAS non anticipées peuvent peser plusieurs dizaines de milliers de dinars par an. HydroScan transforme cet imprévu en coût maîtrisable et en levier d'investissement.", "Unanticipated ONAS penalties can reach tens of thousands of dinars per year. HydroScan turns this unpredictable cost into a manageable one and an investment lever.", "قد تصل غرامات ONAS غير المتوقعة إلى عشرات الآلاف من الدنانير سنويًا. يحوّل HydroScan هذه التكلفة إلى تكلفة قابلة للإدارة."),
      color: "text-primary",
    },
    {
      icon: <TrendingDown className="h-7 w-7" />,
      badge: "💰",
      title: t3("Simulateur ROI : STEP interne, REUT et collecte eau de pluie", "ROI Simulator: internal STEP, REUT and rainwater collection", "محاكي العائد على الاستثمار: محطة معالجة داخلية، REUT، تجميع مياه الأمطار"),
      hook: t3("Répondez à votre direction en 5 minutes : ce projet vaut-il l'investissement ?", "Answer your management in 5 minutes: is this project worth the investment?", "أجب على إدارتك في 5 دقائق: هل يستحق هذا المشروع الاستثمار؟"),
      body: t3("Le simulateur ROI de HydroScan calcule le retour sur investissement de trois types de projets clés pour les PME tunisiennes : Station d'épuration interne (STEP), Réutilisation des eaux traitées (REUT), et collecte d'eau de pluie. Il prend en compte les tarifs SONEDE actuels, les économies ONAS, les coûts d'exploitation, et fournit la VAN sur 10 ans.", "HydroScan's ROI simulator calculates the return on investment for three key project types for Tunisian SMEs: internal wastewater treatment plant (STEP), treated water reuse (REUT), and rainwater collection. It accounts for current SONEDE tariffs, ONAS savings, operating costs, and provides 10-year NPV.", "يحسب محاكي ROI الخاص بـ HydroScan عائد الاستثمار لثلاثة أنواع من المشاريع الرئيسية للمؤسسات الصغيرة والمتوسطة التونسية."),
      points: lang === "fr"
        ? ["STEP interne : payback, VAN 10 ans, détail économies ONAS + REUT","REUT : économie eau SONEDE substituée, taux d'efficacité par usage","Eau de pluie : 9 villes tunisiennes (Bizerte → Gafsa), surface, coefficient ruissellement","Prêt pour vos dossiers BERD, AFD, FODEP, Amen Bank ligne verte"]
        : lang === "ar"
        ? ["STEP داخلي: فترة استرداد، صافي القيمة الحالية 10 سنوات، تفاصيل توفير ONAS + REUT","REUT: توفير مياه سونيد المستبدلة، معدل الكفاءة حسب الاستخدام","مياه الأمطار: 9 مدن تونسية (بنزرت → قفصة)، مساحة، معامل الجريان","جاهز لملفات BERD وAFD وFODEP وخط أمان الأخضر"]
        : ["Internal STEP: payback, 10-year NPV, detailed ONAS + REUT savings","REUT: substituted SONEDE water savings, efficiency rate by usage","Rainwater: 9 Tunisian cities (Bizerte → Gafsa), surface, runoff coefficient","Ready for BERD, AFD, FODEP, Amen Bank green line applications"],
      why: t3("Les directeurs généraux tunisiens demandent un ROI avant tout investissement eau. HydroScan produit ce business case en 5 minutes, avec les données de coûts réels du marché tunisien.", "Tunisian CEOs require an ROI before any water investment. HydroScan produces this business case in 5 minutes, using real Tunisian market cost data.", "يطلب المديرون العامون التونسيون حساب العائد على الاستثمار قبل أي استثمار في المياه. ينتج HydroScan هذا الملف في 5 دقائق."),
      color: "text-green-water",
    },
    {
      icon: <ShieldAlert className="h-7 w-7" />,
      badge: "⚠️",
      title: t3("Gestion des risques SONEDE : quotas, restrictions et plan de continuité", "SONEDE risk management: quotas, restrictions and continuity plan", "إدارة مخاطر سونيد: حصص، قيود، وخطة استمرارية"),
      hook: t3("Juillet-Août en Tunisie : êtes-vous préparé à une coupure de 72h ?", "July-August in Tunisia: are you prepared for a 72-hour water cut?", "يوليو-أغسطس في تونس: هل أنت مستعد لقطع مياه 72 ساعة؟"),
      body: t3("HydroScan intègre le calendrier historique des restrictions SONEDE industrielles (2019–2024) par mois et par bassin versant, et calcule votre autonomie de stockage face à vos besoins journaliers. Le module affiche une alerte de risque temps réel et des recommandations adaptées à votre situation.", "HydroScan integrates the historical calendar of SONEDE industrial restrictions (2019–2024) by month and watershed, and calculates your storage autonomy against your daily needs. The module displays a real-time risk alert and recommendations tailored to your situation.", "يدمج HydroScan التقويم التاريخي لقيود سونيد الصناعية (2019–2024) حسب الشهر والحوض المائي."),
      points: lang === "fr"
        ? ["Calendrier 12 mois : niveau de risque par mois (faible → extrême)","Calcul d'autonomie : m³ stockés / besoins journaliers","Alerte quota : % consommé sur quota annuel SONEDE","9 bassins versants tunisiens avec mois de restriction référencés"]
        : lang === "ar"
        ? ["تقويم 12 شهرًا: مستوى المخاطرة شهريًا (منخفض → متطرف)","حساب الاستقلالية: م³ مخزّن / الاحتياجات اليومية","تنبيه الحصة: % مستهلك من الحصة السنوية لسونيد","9 أحواض مائية تونسية مع أشهر القيود المرجعية"]
        : ["12-month calendar: risk level per month (low → extreme)","Autonomy calculation: m³ stored / daily needs","Quota alert: % consumed of annual SONEDE quota","9 Tunisian watersheds with referenced restriction months"],
      why: t3("Une coupure non anticipée coûte bien plus qu'un investissement en stockage. HydroScan transforme l'aléa SONEDE en risque gérable.", "An unanticipated outage costs far more than a storage investment. HydroScan transforms SONEDE's unpredictability into a manageable risk.", "الانقطاع غير المتوقع يكلف أكثر بكثير من الاستثمار في التخزين. يحول HydroScan عدم قدرة سونيد على التنبؤ إلى مخاطرة قابلة للإدارة."),
      color: "text-primary",
    },
  ];

  const features = [
    {
      icon: <Droplets className="h-7 w-7" />,
      badge: "🎯",
      title: t3("Calcul conforme à la norme internationale ISO 14046", "ISO 14046 compliant calculation", "حساب متوافق مع معيار ISO 14046 الدولي"),
      hook: t3("La seule méthode reconnue mondialement, intégrée nativement.", "The only globally recognized method, natively integrated.", "الطريقة الوحيدة المعترف بها عالميًا، مدمجة أصلًا."),
      body: t3("HydroScan applique strictement la méthodologie du Water Footprint Network (Hoekstra et al., 2011), référence mondiale adoptée par l'ISO 14046. Vos trois composantes — Eau Verte, Bleue et Grise — sont calculées séparément, avec précision géographique et temporelle.", "HydroScan strictly applies the Water Footprint Network methodology (Hoekstra et al., 2011), the global reference adopted by ISO 14046. Your three components — Green, Blue and Grey Water — are calculated separately, with geographic and temporal precision.", "يطبق HydroScan منهجية Water Footprint Network (Hoekstra et al., 2011). تُحسب مكوناتك الثلاث — الماء الأخضر والأزرق والرمادي — بدقة جغرافية وزمنية."),
      points: lang === "fr"
        ? ["Eau Verte : eau de pluie consommée par évapotranspiration","Eau Bleue : eau de surface et souterraine consommée","Eau Grise : volume nécessaire pour diluer vos polluants jusqu'aux normes ambiantes","Résultats exprimés en m³/unité, m³/an ou m³/tonne selon votre besoin"]
        : lang === "ar"
        ? ["الماء الأخضر: ماء الأمطار المستهلك بالتبخر-النتح","الماء الأزرق: المياه السطحية والجوفية المستهلكة","الماء الرمادي: الحجم اللازم لتخفيف الملوثات حتى معايير الجودة","النتائج بـ م³/وحدة أو م³/سنة حسب الحاجة"]
        : ["Green Water: rainwater consumed through evapotranspiration","Blue Water: surface and groundwater consumed","Grey Water: volume needed to dilute pollutants to ambient standards","Results in m³/unit, m³/year or m³/ton as needed"],
      why: t3("Un calcul non conforme n'a aucune valeur auprès de vos auditeurs, clients ou partenaires. Avec HydroScan, votre empreinte est défendable — techniquement et réglementairement.", "A non-compliant calculation has no value for your auditors, clients or partners. With HydroScan, your footprint is defensible — technically and regulatorily.", "الحساب غير المتوافق لا قيمة له لدى المراجعين والشركاء. مع HydroScan، بصمتك قابلة للدفاع."),
      color: "text-blue-water",
    },
    {
      icon: <Zap className="h-7 w-7" />,
      badge: "⚡",
      title: t3("De la saisie au résultat en moins de 5 minutes", "From input to result in under 5 minutes", "من الإدخال إلى النتيجة في أقل من 5 دقائق"),
      hook: t3("Fini les semaines de traitement manuel. Votre empreinte, maintenant.", "No more weeks of manual processing. Your footprint, now.", "انتهى عصر أسابيع المعالجة اليدوية. بصمتك، الآن."),
      body: t3("HydroScan automatise l'intégralité du parcours de calcul : saisie guidée, sélection des données de référence, application des formules, génération des résultats. Aucune expertise en modélisation requise — le moteur de calcul travaille pour vous.", "HydroScan automates the entire calculation process: guided input, reference data selection, formula application, results generation. No modeling expertise required — the calculation engine works for you.", "يؤتمت HydroScan عملية الحساب بأكملها: إدخال موجّه، اختيار بيانات مرجعية، تطبيق صيغ، توليد نتائج. لا تحتاج خبرة في النمذجة."),
      points: lang === "fr"
        ? ["Interface de saisie guidée, étape par étape","Sélection automatique des données climatiques (CLIMWAT/CROPWAT FAO)","Calcul en temps réel dès la dernière saisie","Résultats disponibles immédiatement, sans file d'attente"]
        : lang === "ar"
        ? ["واجهة إدخال موجَّهة خطوة بخطوة","اختيار تلقائي للبيانات المناخية (CLIMWAT/CROPWAT FAO)","حساب فوري عند آخر إدخال","نتائج متاحة فورًا، دون انتظار"]
        : ["Step-by-step guided input interface","Automatic climate data selection (CLIMWAT/CROPWAT FAO)","Real-time calculation from last input","Results available immediately, no queue"],
      why: t3("Le temps de vos équipes est précieux. HydroScan supprime la friction entre la décision de mesurer et l'obtention d'un résultat fiable.", "Your teams' time is valuable. HydroScan removes friction between the decision to measure and getting a reliable result.", "وقت فريقك ثمين. HydroScan يزيل العقبة بين قرار القياس والحصول على نتيجة موثوقة."),
      color: "text-primary",
    },
    {
      icon: <BarChart3 className="h-7 w-7" />,
      badge: "📊",
      title: fr ? "Savoir où vous en êtes par rapport à votre secteur" : "Know where you stand compared to your sector",
      hook: fr ? "Un chiffre seul ne veut rien dire. Contextualisez votre performance." : "A number alone means nothing. Contextualize your performance.",
      body: fr
        ? "HydroScan intègre une base de données de référence anonymisée, construite par secteur d'activité et par région géographique. Dès l'obtention de vos résultats, vous savez si votre empreinte vous place dans le tiers inférieur, médian ou supérieur de votre secteur — et dans quelle composante vous avez le plus à gagner."
        : "HydroScan integrates an anonymized reference database, built by industry sector and geographic region. As soon as you get your results, you know whether your footprint places you in the lower, median or upper third of your sector — and which component has the most room for improvement.",
      points: fr
        ? [
            "Benchmarks pour : agriculture, agroalimentaire, industrie, textile, énergie",
            "Comparaison par composante : verte, bleue, grise",
            "Données régionalisées (Europe, Maghreb, MENA, Afrique subsaharienne)",
            "Mise à jour continue à partir des données agrégées anonymisées",
          ]
        : [
            "Benchmarks for: agriculture, food processing, industry, textile, energy",
            "Comparison by component: green, blue, grey",
            "Regionalized data (Europe, Maghreb, MENA, Sub-Saharan Africa)",
            "Continuous updates from anonymized aggregated data",
          ],
      why: fr
        ? "Vos clients, investisseurs et auditeurs ne regardent pas votre chiffre absolu — ils le comparent. HydroScan vous donne cette perspective dès le premier résultat."
        : "Your clients, investors and auditors don't look at your absolute number — they compare it. HydroScan gives you that perspective from your very first result.",
      color: "text-green-water",
    },
    {
      icon: <FileText className="h-7 w-7" />,
      badge: "📄",
      title: fr ? "Des rapports prêts à soumettre, en un clic" : "Reports ready to submit, in one click",
      hook: fr ? "Word, PDF, mise en page soignée — il ne reste plus qu'à envoyer." : "Word, PDF, polished layout — just send it.",
      body: fr
        ? "HydroScan génère automatiquement des rapports complets et structurés, formatés selon les standards attendus par vos clients, partenaires et auditeurs. Chaque rapport intègre la méthodologie appliquée, les données sources utilisées, les résultats détaillés par composante, et les recommandations de réduction."
        : "HydroScan automatically generates complete, structured reports formatted to the standards expected by your clients, partners and auditors. Each report includes the applied methodology, source data used, detailed results by component, and reduction recommendations.",
      points: fr
        ? [
            "Export Word (.docx) et PDF en un clic",
            "Structure conforme aux attentes des auditeurs ISO 14046",
            "Personnalisable : logo, en-tête, nom du projet, période d'analyse",
            "Annexes techniques incluses : formules, sources, hypothèses",
            "Prêt pour soumission client, appel d'offres ou démarche RSE",
          ]
        : [
            "One-click Word (.docx) and PDF export",
            "Structure compliant with ISO 14046 auditor expectations",
            "Customizable: logo, header, project name, analysis period",
            "Technical annexes included: formulas, sources, assumptions",
            "Ready for client submission, tenders or CSR initiatives",
          ],
      why: fr
        ? "La mise en forme d'un rapport technique est chronophage et source d'erreurs. HydroScan vous délivre un document professionnel, cohérent et complet — sans effort de mise en page."
        : "Formatting a technical report is time-consuming and error-prone. HydroScan delivers a professional, consistent and complete document — with zero layout effort.",
      color: "text-primary",
    },
    {
      icon: <Map className="h-7 w-7" />,
      badge: "🗺️",
      title: fr ? "Des recommandations personnalisées, priorisées par impact réel" : "Personalized recommendations, prioritized by real impact",
      hook: fr ? "Savoir quoi faire, dans quel ordre, avec quel budget." : "Know what to do, in what order, with what budget.",
      body: fr
        ? "Une fois votre empreinte calculée, HydroScan active son moteur de recommandations. En croisant vos résultats avec les données de votre secteur, votre localisation géographique et les seuils de durabilité locaux, l'IA identifie les leviers d'action les plus efficaces pour votre situation spécifique — et les priorise selon trois critères : impact sur l'empreinte, coût de mise en œuvre, et délai d'obtention des résultats."
        : "Once your footprint is calculated, HydroScan activates its recommendation engine. By cross-referencing your results with sector data, geographic location and local sustainability thresholds, the AI identifies the most effective action levers for your specific situation — prioritized by three criteria: footprint impact, implementation cost, and time to results.",
      points: fr
        ? [
            "Recommandations adaptées : agriculteur, industriel, services, collectivité",
            "Priorisation tri-critère : impact / coût / délai",
            "Actions classées par composante ciblée : bleu, gris, vert",
            "Bibliothèque de 80+ actions concrètes (Water Footprint Network)",
            "Simulation : visualisez l'effet attendu avant de vous engager",
          ]
        : [
            "Adapted recommendations: farmer, manufacturer, services, public sector",
            "Tri-criteria prioritization: impact / cost / timeline",
            "Actions classified by targeted component: blue, grey, green",
            "Library of 80+ concrete actions (Water Footprint Network)",
            "Simulation: visualize expected effect before committing",
          ],
      why: fr
        ? "Sans priorisation, les entreprises agissent souvent là où c'est le plus visible — pas là où c'est le plus efficace. HydroScan vous indique les 20% d'actions qui produiront 80% de la réduction."
        : "Without prioritization, companies often act where it's most visible — not where it's most effective. HydroScan shows you the 20% of actions that will produce 80% of the reduction.",
      color: "text-blue-water",
    },
    {
      icon: <TrendingUp className="h-7 w-7" />,
      badge: "📈",
      title: fr ? "Suivez votre progression et prouvez vos efforts" : "Track your progress and prove your efforts",
      hook: fr ? "Ce qui ne se mesure pas ne s'améliore pas. Ce qui ne se documente pas n'existe pas." : "What isn't measured can't improve. What isn't documented doesn't exist.",
      body: fr
        ? "HydroScan conserve l'historique complet de vos calculs et génère automatiquement des indicateurs de progression. Comparez vos empreintes d'une période à l'autre, mesurez l'impact de vos actions, et produisez des preuves documentées de vos progrès pour vos rapports RSE, vos clients ou vos parties prenantes."
        : "HydroScan keeps a complete history of your calculations and automatically generates progress indicators. Compare your footprints from one period to another, measure the impact of your actions, and produce documented proof of your progress for CSR reports, clients or stakeholders.",
      points: fr
        ? [
            "Tableau de bord centralisé : toutes vos mesures, tous vos projets",
            "Évolution temporelle : mensuelle, trimestrielle, annuelle",
            "Indicateurs de progression par composante et par site",
            "Export des données brutes (CSV) pour vos propres analyses",
            "Alertes automatiques si une composante dépasse un seuil défini",
          ]
        : [
            "Centralized dashboard: all your measurements, all your projects",
            "Temporal evolution: monthly, quarterly, annual",
            "Progress indicators by component and by site",
            "Raw data export (CSV) for your own analyses",
            "Automatic alerts if a component exceeds a defined threshold",
          ],
      why: fr
        ? "La réduction de l'empreinte eau est un processus continu, pas un événement ponctuel. HydroScan transforme chaque calcul en point de données d'un parcours de progrès mesurable et communicable."
        : "Water footprint reduction is a continuous process, not a one-time event. HydroScan transforms each calculation into a data point in a measurable, communicable progress journey.",
      color: "text-green-water",
    },
  ];

  const pillars = [
    {
      icon: <FlaskConical className="h-8 w-8 text-primary" />,
      badge: "🔬",
      title: fr ? "Standard mondial" : "Global standard",
      text: fr
        ? "Toute la méthodologie de HydroScan est basée sur The Water Footprint Assessment Manual (Hoekstra, Chapagain, Aldaya, Mekonnen — Water Footprint Network, 2011) et la norme ISO 14046. Aucune formule maison, aucun raccourci."
        : "HydroScan's entire methodology is based on The Water Footprint Assessment Manual (Hoekstra, Chapagain, Aldaya, Mekonnen — Water Footprint Network, 2011) and the ISO 14046 standard. No homemade formulas, no shortcuts.",
    },
    {
      icon: <Globe className="h-8 w-8 text-primary" />,
      badge: "🌍",
      title: t3("Données de référence internationales + CRDA Tunisie", "International reference data + CRDA Tunisia", "البيانات المرجعية الدولية + CRDA تونس"),
      text: t3(
        "HydroScan intègre les bases de données officielles : CROPWAT 8.0, CLIMWAT 2.0, FAOSTAT, AQUASTAT, et les 12 bassins versants tunisiens avec facteurs AWARE (Ministère Agriculture / CRDA). Les normes NT 106.002 (INNORPI) sont nativement intégrées pour les calculs eau grise.",
        "HydroScan integrates official databases: CROPWAT 8.0, CLIMWAT 2.0, FAOSTAT, AQUASTAT, and the 12 Tunisian watersheds with AWARE factors (Ministry of Agriculture / CRDA). NT 106.002 standards (INNORPI) are natively integrated for grey water calculations.",
        "يدمج HydroScan قواعد البيانات الرسمية: CROPWAT 8.0 وCLIMWAT 2.0 وFAOSTAT وAQUASTAT والأحواض المائية التونسية الـ12 مع معاملات AWARE."
      ),
    },
    {
      icon: <AlertTriangle className="h-8 w-8 text-primary" />,
      badge: "⚠️",
      title: fr ? "Transparence des limites" : "Transparency of limitations",
      text: fr
        ? "HydroScan ne prétend pas tout couvrir. L'empreinte eau ne traite pas des inondations, de l'accès à l'eau potable, ni des autres impacts environnementaux. Chaque rapport inclut une section explicite sur les limites et les hypothèses retenues — parce qu'un outil crédible est un outil honnête."
        : "HydroScan doesn't claim to cover everything. The water footprint doesn't address flooding, access to drinking water, or other environmental impacts. Each report includes an explicit section on limitations and assumptions — because a credible tool is an honest tool.",
    },
  ];

  return (
    <div className="min-h-screen bg-card font-sans">
      <PageMeta
        title={fr ? "Fonctionnalités — HydroScan" : "Features — HydroScan"}
        description={fr ? "Découvrez les fonctionnalités de HydroScan : calcul ISO 14046, résultats instantanés, benchmarks, rapports, plan d'action IA et suivi." : "Discover HydroScan features: ISO 14046 calculation, instant results, benchmarks, reports, AI action plan and tracking."}
      />

      <LandingHeader activePage="fonctionnalites" />

      {/* ── Hero ── */}
      <section className="pt-32 pb-20 px-[5%] text-center bg-card">
        <motion.div initial="hidden" animate="visible" variants={stagger} className="mx-auto max-w-[800px]">
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary mb-7">
            <span>🇹🇳</span>
            {t3("Conçu pour les PME tunisiennes — SONEDE · ONAS · NT 106.002", "Built for Tunisian SMEs — SONEDE · ONAS · NT 106.002", "مصمم للمؤسسات الصغيرة والمتوسطة التونسية — سونيد · ONAS · NT 106.002")}
          </motion.div>

          <motion.h1 variants={fadeUp} className="font-display text-[clamp(2.4rem,5vw,4rem)] font-extrabold leading-[1.1] text-foreground mb-5">
            {lang === "fr" ? <>La plateforme empreinte eau<br /><span className="text-primary">Tunisia-first</span></> : lang === "ar" ? <>منصة البصمة المائية<br /><span className="text-primary">Tunisia-first</span></> : <>The water footprint platform<br /><span className="text-primary">Tunisia-first</span></>}
          </motion.h1>

          <motion.p variants={fadeUp} className="text-lg text-muted-foreground max-w-[620px] mx-auto mb-10">
            {t3(
              "Pénalités ONAS, facteurs AWARE par bassin versant, simulateur ROI STEP/REUT, saisie SONEDE native — les fonctionnalités dont les PME tunisiennes ont réellement besoin.",
              "ONAS penalties, AWARE factors by watershed, STEP/REUT ROI simulator, native SONEDE input — the features Tunisian SMEs actually need.",
              "غرامات ONAS، عوامل AWARE حسب الحوض المائي، محاكي ROI STEP/REUT، إدخال سونيد الأصلي — الميزات التي تحتاجها المؤسسات التونسية فعلًا."
            )}
          </motion.p>

          <motion.div variants={fadeUp} className="flex gap-4 flex-wrap justify-center">
            <Link to="/calculateur" className="inline-flex items-center gap-2 rounded-[10px] px-8 py-3.5 font-semibold text-primary-foreground gradient-water shadow-[0_4px_20px_hsl(var(--ocean)/0.25)] hover:-translate-y-0.5 hover:shadow-lg transition-all">
              {fr ? "Essayer gratuitement →" : "Try for free →"}
            </Link>
            <Link to="/tarifs" className="inline-flex items-center rounded-[10px] px-8 py-3.5 font-medium text-white hover:opacity-90 transition-all" style={{ backgroundColor: '#015486' }}>
              {fr ? "Voir une démo" : "See a demo"}
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Introduction ── */}
      <section className="py-12 px-[5%] bg-background">
        <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mx-auto max-w-[720px] text-center text-muted-foreground text-base leading-relaxed">
          {t3(
            "La Tunisie est l'un des pays les plus stressés en eau au monde (WSI 4.8/5). HydroScan est la seule plateforme SaaS intégrant nativement les spécificités tunisiennes : sources SONEDE, norme ONAS NT 106.002, facteurs AWARE par bassin versant (Sfax × 8500, Gafsa × 9200), et simulateur ROI pour les investissements eau clés.",
            "Tunisia is one of the most water-stressed countries in the world (WSI 4.8/5). HydroScan is the only SaaS platform natively integrating Tunisian specificities: SONEDE sources, ONAS NT 106.002 standard, AWARE factors by watershed (Sfax ×8500, Gafsa ×9200), and an ROI simulator for key water investments.",
            "تونس من أكثر دول العالم ضغطًا على المياه (WSI 4.8/5). HydroScan هي المنصة الوحيدة التي تدمج أصلًا الخصوصيات التونسية: مصادر سونيد، معيار ONAS NT 106.002، عوامل AWARE حسب الحوض المائي، ومحاكي ROI."
          )}
        </motion.p>
      </section>

      {/* ── Features ── */}
      <section className="py-24 px-[5%] bg-card">
        <div className="mx-auto max-w-[1100px]">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <p className="text-xs font-bold tracking-[0.18em] uppercase text-primary mb-3">
              {t3("Conçu pour la Tunisie", "Built for Tunisia", "مصمم لتونس")}
            </p>
            <h2 className="font-display text-[clamp(1.8rem,3.5vw,2.8rem)] font-extrabold text-foreground leading-tight">
              {lang === "fr" ? <><span className="text-primary">4 modules Tunisia-first</span><br />+ les fondamentaux ISO 14046</> : lang === "ar" ? <><span className="text-primary">4 وحدات Tunisia-first</span><br />+ أساسيات ISO 14046</> : <><span className="text-primary">4 Tunisia-first modules</span><br />+ ISO 14046 fundamentals</>}
            </h2>
          </motion.div>

          {/* ── Tunisia-specific features ── */}
          <div className="flex flex-col gap-20 mb-24">
            {tunisiaFeatures.map((f, idx) => (
              <motion.div
                key={`tuni-${idx}`}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={stagger}
                className={`grid gap-10 lg:gap-16 items-start ${idx % 2 === 1 ? "lg:grid-cols-[1.1fr_1fr]" : "lg:grid-cols-[1fr_1.1fr]"}`}
              >
                <motion.div variants={fadeUp} className={idx % 2 === 1 ? "lg:order-2" : ""}>
                  <div className={`inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-bold mb-4 ${f.color}`}>
                    <span>{f.badge}</span>
                    {t3("Module Tunisie", "Tunisia Module", "وحدة تونس")}
                  </div>
                  <h3 className="font-display text-2xl font-extrabold text-foreground mb-2 leading-snug">{f.title}</h3>
                  <p className="text-primary font-semibold text-sm mb-4">{f.hook}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-5">{f.body}</p>
                  <ul className="flex flex-col gap-2 mb-5">
                    {f.points.map((p, i) => (
                      <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                        <span className="text-green-water font-bold flex-shrink-0">✓</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </motion.div>
                <motion.div variants={fadeUp} className={idx % 2 === 1 ? "lg:order-1" : ""}>
                  <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 lg:p-8">
                    <p className="text-xs font-bold tracking-wider uppercase text-primary mb-3">
                      {t3("Pourquoi c'est critique pour la Tunisie", "Why it's critical for Tunisia", "لماذا هو حاسم لتونس")}
                    </p>
                    <p className="text-muted-foreground text-sm leading-relaxed">{f.why}</p>
                    <div className={`mt-6 flex items-center gap-3 ${f.color}`}>
                      {f.icon}
                      <span className="font-display text-lg font-bold text-foreground">
                        {idx === 0 ? "SONEDE" : idx === 1 ? "NT 106.002" : idx === 2 ? "ROI" : "CRDA"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {idx === 0 ? t3("Sources nativement reconnues", "Natively recognized sources", "مصادر معترف بها أصلًا")
                          : idx === 1 ? t3("Norme INNORPI Tunisie", "INNORPI Tunisia standard", "معيار INNORPI تونس")
                          : idx === 2 ? t3("Calcul en 5 min", "Calculated in 5 min", "يُحسب في 5 دقائق")
                          : t3("Bassins versants", "Watersheds", "أحواض مائية")}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-[0.18em] uppercase text-muted-foreground mb-3">
              {t3("Fonctionnalités universelles", "Universal features", "ميزات عالمية")}
            </p>
            <h3 className="font-display text-[clamp(1.4rem,3vw,2rem)] font-extrabold text-foreground">
              {t3("Les fondamentaux ISO 14046 inclus dans tous les plans", "ISO 14046 fundamentals included in all plans", "أساسيات ISO 14046 مضمّنة في جميع الخطط")}
            </h3>
          </div>

          <div className="flex flex-col gap-20">
            {features.map((f, idx) => (
              <motion.div
                key={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={stagger}
                className={`grid gap-10 lg:gap-16 items-start ${idx % 2 === 1 ? "lg:grid-cols-[1.1fr_1fr]" : "lg:grid-cols-[1fr_1.1fr]"}`}
              >
                <motion.div variants={fadeUp} className={idx % 2 === 1 ? "lg:order-2" : ""}>
                  <div className={`inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-bold mb-4 ${f.color}`}>
                    <span>{f.badge}</span>
                    {fr ? "Fonctionnalité" : "Feature"}
                  </div>
                  <h3 className="font-display text-2xl font-extrabold text-foreground mb-2 leading-snug">{f.title}</h3>
                  <p className="text-primary font-semibold text-sm mb-4">{f.hook}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-5">{f.body}</p>
                  <ul className="flex flex-col gap-2 mb-5">
                    {f.points.map((p, i) => (
                      <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                        <span className="text-green-water font-bold flex-shrink-0">✓</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div variants={fadeUp} className={idx % 2 === 1 ? "lg:order-1" : ""}>
                  <div className="rounded-2xl border border-border bg-background p-6 lg:p-8">
                    <p className="text-xs font-bold tracking-wider uppercase text-primary mb-3">
                      {fr ? "Pourquoi c'est important" : "Why it matters"}
                    </p>
                    <p className="text-muted-foreground text-sm leading-relaxed">{f.why}</p>
                    <div className={`mt-6 flex items-center gap-3 ${f.color}`}>
                      {f.icon}
                      <span className="font-display text-lg font-bold text-foreground">
                        {idx === 0 ? "ISO 14046" : idx === 1 ? "< 5 min" : idx === 2 ? "12+" : idx === 3 ? "1 clic" : idx === 4 ? "80+" : "24/7"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {idx === 0 ? (fr ? "Norme certifiée" : "Certified standard")
                          : idx === 1 ? (fr ? "Temps de calcul" : "Calculation time")
                          : idx === 2 ? (fr ? "Secteurs couverts" : "Sectors covered")
                          : idx === 3 ? (fr ? "Export rapport" : "Report export")
                          : idx === 4 ? (fr ? "Actions concrètes" : "Concrete actions")
                          : (fr ? "Suivi continu" : "Continuous tracking")}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Reassurance ── */}
      <section className="py-24 px-[5%] bg-background">
        <div className="mx-auto max-w-[1100px]">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-14">
            <h2 className="font-display text-[clamp(1.8rem,3.5vw,2.6rem)] font-extrabold text-foreground leading-tight">
              {fr ? "Une plateforme construite sur la science, pas sur des approximations" : "A platform built on science, not approximations"}
            </h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid gap-6 md:grid-cols-3">
            {pillars.map((p, i) => (
              <motion.div key={i} variants={fadeUp} className="rounded-2xl border border-border bg-card p-7">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{p.badge}</span>
                  {p.icon}
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-3">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="gradient-water py-24 px-[5%] text-center text-primary-foreground">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mx-auto max-w-[640px]">
          <motion.h2 variants={fadeUp} className="font-display text-[clamp(2rem,4vw,3.2rem)] font-extrabold mb-4">
            {fr ? (<>Prêt à connaître votre<br />empreinte eau réelle ?</>) : (<>Ready to know your<br />real water footprint?</>)}
          </motion.h2>
          <motion.p variants={fadeUp} className="opacity-85 max-w-[480px] mx-auto mb-10 text-sm">
            {fr ? "Rejoignez les entreprises qui mesurent, comparent et agissent — avec les bons outils." : "Join the companies that measure, compare and act — with the right tools."}
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-3">
            <Link to="/calculateur" className="inline-flex items-center gap-2 px-8 py-3.5 text-white rounded-[10px] font-bold text-sm hover:-translate-y-0.5 hover:shadow-lg transition-all" style={{ backgroundColor: '#015486' }}>
              💧 {fr ? "Commencer gratuitement" : "Start for free"}
            </Link>
            <Link to="/tarifs" className="inline-block px-8 py-3.5 border-2 border-primary-foreground/50 text-primary-foreground rounded-[10px] font-semibold text-sm hover:border-primary-foreground hover:bg-primary-foreground/10 transition-all">
              {fr ? "Demander une démo" : "Request a demo"}
            </Link>
          </motion.div>
          <motion.p variants={fadeUp} className="mt-4 text-xs opacity-70">
            {fr ? "Résultats en 5 minutes, sans carte bancaire" : "Results in 5 minutes, no credit card required"}
          </motion.p>
        </motion.div>
      </section>

      <LandingFooter />
    </div>
  );
}
