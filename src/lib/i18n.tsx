import { createContext, useContext, useState, ReactNode } from "react";

type Lang = "fr" | "en" | "ar";

interface I18nContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Lang, string>> = {
  // Navbar
  "nav.problem": { fr: "Problème", en: "Problem", ar: "المشكلة" },
  "nav.solution": { fr: "Solution", en: "Solution", ar: "الحل" },
  "nav.features": { fr: "Fonctionnalités", en: "Features", ar: "الميزات" },
  "nav.pricing": { fr: "Tarifs", en: "Pricing", ar: "الأسعار" },
  "nav.login": { fr: "Connexion", en: "Login", ar: "تسجيل الدخول" },
  "nav.demo": { fr: "Demander une démo", en: "Request a demo", ar: "طلب عرض توضيحي" },

  // Hero
  "hero.badge": { fr: "Conforme ISO 14046", en: "ISO 14046 Compliant", ar: "متوافق مع ISO 14046" },
  "hero.title1": { fr: "Mesurez l'", en: "Measure your company's ", ar: "قِس " },
  "hero.titleHighlight": { fr: "empreinte eau", en: "water footprint", ar: "بصمة المياه" },
  "hero.title2": { fr: " de votre entreprise", en: "", ar: " لشركتك" },
  "hero.subtitle": {
    fr: "Mesurez, analysez et réduisez votre consommation d'eau grâce à une plateforme conforme aux standards internationaux.",
    en: "Measure, analyze and reduce your water consumption with a platform that complies with international standards.",
    ar: "قِس وحلّل وقلّل استهلاك المياه بمنصة متوافقة مع المعايير الدولية.",
  },
  "hero.cta1": { fr: "Demander une démo", en: "Request a demo", ar: "طلب عرض توضيحي" },
  "hero.cta2": { fr: "Essayer la plateforme", en: "Try the platform", ar: "تجربة المنصة" },

  // Why Section
  "why.label": { fr: "Pourquoi HydroScan", en: "Why HydroScan", ar: "لماذا HydroScan" },
  "why.title1": { fr: "6 raisons de mesurer\nvotre ", en: "6 reasons to measure\nyour ", ar: "6 أسباب لقياس\n" },
  "why.titleHighlight": { fr: "empreinte eau", en: "water footprint", ar: "بصمة مياهك" },
  "why.subtitle": {
    fr: "Les entreprises qui trackent leur eau aujourd'hui survivront demain. Celles qui attendent paieront le prix fort.",
    en: "Companies tracking their water today will survive tomorrow. Those who wait will pay the price.",
    ar: "الشركات التي تتتبع مياهها اليوم ستنجو غداً. من ينتظر سيدفع الثمن.",
  },

  "why.stat1.number": { fr: "40%", en: "40%", ar: "40%" },
  "why.stat1.label": { fr: "d'eau gaspillée en moyenne par les entreprises", en: "of water wasted on average by companies", ar: "من المياه مهدرة في المتوسط من الشركات" },
  "why.stat2.number": { fr: "×3", en: "×3", ar: "×3" },
  "why.stat2.label": { fr: "hausse du prix de l'eau industrielle d'ici 2030", en: "increase in industrial water price by 2030", ar: "ارتفاع سعر المياه الصناعية بحلول 2030" },
  "why.stat3.number": { fr: "8.5", en: "8.5", ar: "8.5" },
  "why.stat3.label": { fr: "facteur de stress hydrique en Tunisie (AWARE)", en: "water stress factor in Tunisia (AWARE)", ar: "معامل ضغط المياه في تونس (AWARE)" },
  "why.stat4.number": { fr: "500k+", en: "500k+", ar: "+500k" },
  "why.stat4.label": { fr: "entreprises ciblées en Afrique francophone", en: "targeted companies in francophone Africa", ar: "شركة مستهدفة في أفريقيا" },

  "why.reason1.title": { fr: "Réduire votre facture eau", en: "Reduce your water bill", ar: "تقليل فاتورة المياه" },
  "why.reason1.desc": {
    fr: "Une usine moyenne consomme 5 000 m³/mois. Identifier 20% de gaspillage représente jusqu'à 36 000 TND d'économies par an — soit 12× le prix de l'abonnement.",
    en: "An average factory consumes 5,000 m³/month. Identifying 20% waste represents up to 36,000 TND in annual savings — 12× the subscription price.",
    ar: "المصنع المتوسط يستهلك 5,000 م³/شهر. تحديد 20% من الهدر يمثل توفيرًا يصل إلى 36,000 دينار سنويًا — أي 12× سعر الاشتراك.",
  },
  "why.reason1.highlight": { fr: "ROI moyen × 6 à × 12 dès la 1ère année", en: "Average ROI × 6 to × 12 from year 1", ar: "متوسط العائد على الاستثمار ×6 إلى ×12 من السنة الأولى" },

  "why.reason2.title": { fr: "Conformité réglementaire", en: "Regulatory compliance", ar: "الامتثال التنظيمي" },
  "why.reason2.desc": {
    fr: "La loi tunisienne impose aux entreprises industrielles de déclarer leur consommation à l'ANPE. Les donneurs d'ordre européens exigent un Water Footprint certifié.",
    en: "Tunisian law requires industrial companies to report consumption to ANPE. European contractors require a certified Water Footprint.",
    ar: "يلزم القانون التونسي الشركات الصناعية بالإبلاغ عن استهلاكها للـ ANPE. يطلب المتعاقدون الأوروبيون بصمة مياه معتمدة.",
  },
  "why.reason2.highlight": { fr: "Sans rapport = perte de contrats export", en: "No report = lost export contracts", ar: "بدون تقرير = خسارة عقود التصدير" },

  "why.reason3.title": { fr: "Accès aux financements verts", en: "Access to green financing", ar: "الحصول على التمويل الأخضر" },
  "why.reason3.desc": {
    fr: "Banque Mondiale, AFD, BAD, FODEP financent les entreprises africaines uniquement si elles mesurent leur impact hydrique. Sans mesure = sans financement.",
    en: "World Bank, AFD, AfDB, FODEP fund African companies only if they measure their water impact. No measurement = no funding.",
    ar: "البنك الدولي وAFD وBAD وFODEP تمول الشركات الأفريقية فقط إذا قاست أثرها المائي. بدون قياس = بدون تمويل.",
  },
  "why.reason3.highlight": { fr: "Subventions jusqu'à 40% via FODEP", en: "Subsidies up to 40% via FODEP", ar: "إعانات تصل إلى 40% عبر FODEP" },

  "why.reason4.title": { fr: "Certifications & Appels d'offres", en: "Certifications & Tenders", ar: "الشهادات والمناقصات" },
  "why.reason4.desc": {
    fr: "ISO 14001, ISO 14046, GRI 303 — toutes ces certifications exigent un bilan eau. Sans elles, vous êtes exclus des appels d'offres publics et des marchés européens.",
    en: "ISO 14001, ISO 14046, GRI 303 — all require a water assessment. Without them, you're excluded from public tenders and European markets.",
    ar: "ISO 14001 وISO 14046 وGRI 303 — كل هذه الشهادات تتطلب تقييم المياه. بدونها ستُستبعد من المناقصات العامة والأسواق الأوروبية.",
  },
  "why.reason4.highlight": { fr: "Accès aux marchés publics & européens", en: "Access to public & European markets", ar: "الوصول إلى المناقصات العامة والأسواق الأوروبية" },

  "why.reason5.title": { fr: "Anticiper le risque hydrique", en: "Anticipate water risk", ar: "توقع مخاطر المياه" },
  "why.reason5.desc": {
    fr: "Les barrages tunisiens sont à 30% de capacité. Le prix de l'eau industrielle a augmenté de 40% en 5 ans. Les restrictions arrivent. Êtes-vous prêt ?",
    en: "Tunisian dams are at 30% capacity. Industrial water prices rose 40% in 5 years. Restrictions are coming. Are you ready?",
    ar: "السدود التونسية عند 30% من طاقتها. ارتفع سعر المياه الصناعية 40% في 5 سنوات. القيود قادمة. هل أنت مستعد؟",
  },
  "why.reason5.highlight": { fr: "Stress hydrique critique en Tunisie", en: "Critical water stress in Tunisia", ar: "ضغط مائي حرج في تونس" },

  "why.reason6.title": { fr: "Image & compétitivité", en: "Image & competitiveness", ar: "الصورة والتنافسية" },
  "why.reason6.desc": {
    fr: "Les grandes surfaces européennes et les investisseurs internationaux exigent une stratégie eau documentée. Sans elle, votre marque perd en crédibilité.",
    en: "European retailers and international investors require a documented water strategy. Without it, your brand loses credibility.",
    ar: "تتطلب متاجر التجزئة الأوروبية والمستثمرون الدوليون استراتيجية مياه موثقة. بدونها تفقد علامتك مصداقيتها.",
  },
  "why.reason6.highlight": { fr: "Avantage concurrentiel durable", en: "Sustainable competitive advantage", ar: "ميزة تنافسية مستدامة" },

  // ROI
  "why.roi.label": { fr: "Calculateur ROI", en: "ROI Calculator", ar: "حاسبة العائد على الاستثمار" },
  "why.roi.title": { fr: "Combien vous coûte\nvotre gaspillage eau ?", en: "How much does your\nwater waste cost?", ar: "كم يكلفك\nهدر مياهك؟" },
  "why.roi.desc": {
    fr: "En moyenne, nos clients identifient 15 à 30% de consommation évitable dès le premier mois d'utilisation d'HydroScan.",
    en: "On average, our clients identify 15 to 30% of avoidable consumption in the first month of using HydroScan.",
    ar: "في المتوسط، يحدد عملاؤنا من 15 إلى 30% من الاستهلاك القابل للتجنب في الشهر الأول من استخدام HydroScan.",
  },
  "why.roi.cta": { fr: "Calculer mon ROI", en: "Calculate my ROI", ar: "احسب عائدي على الاستثمار" },
  "why.roi.row1.label": { fr: "Consommation typique (usine moyenne)", en: "Typical consumption (average factory)", ar: "الاستهلاك النموذجي (مصنع متوسط)" },
  "why.roi.row1.value": { fr: "5 000 m³/mois", en: "5,000 m³/month", ar: "5,000 م³/شهر" },
  "why.roi.row2.label": { fr: "Facture eau mensuelle", en: "Monthly water bill", ar: "فاتورة المياه الشهرية" },
  "why.roi.row2.value": { fr: "12 500 TND", en: "12,500 TND", ar: "12,500 دينار" },
  "why.roi.row3.label": { fr: "Gaspillage identifié (20%)", en: "Identified waste (20%)", ar: "الهدر المحدد (20%)" },
  "why.roi.row3.value": { fr: "2 500 TND/mois", en: "2,500 TND/month", ar: "2,500 دينار/شهر" },
  "why.roi.row4.label": { fr: "Économies annuelles", en: "Annual savings", ar: "التوفيرات السنوية" },
  "why.roi.row4.value": { fr: "30 000 TND/an", en: "30,000 TND/year", ar: "30,000 دينار/سنة" },
  "why.roi.row5.label": { fr: "Abonnement HydroScan", en: "HydroScan subscription", ar: "اشتراك HydroScan" },
  "why.roi.row5.value": { fr: "2 800 TND/an", en: "2,800 TND/year", ar: "2,800 دينار/سنة" },
  "why.roi.row6.label": { fr: "Retour sur investissement", en: "Return on investment", ar: "العائد على الاستثمار" },
  "why.roi.row6.value": { fr: "× 10 🚀", en: "× 10 🚀", ar: "× 10 🚀" },

  // Pitch
  "why.pitch.line1": { fr: "Votre entreprise consomme de l'eau.", en: "Your company consumes water.", ar: "شركتك تستهلك المياه." },
  "why.pitch.line2": { fr: "Cette eau vous coûte de l'argent.", en: "That water costs you money.", ar: "هذه المياه تكلفك أموالاً." },
  "why.pitch.line3": { fr: "Elle va coûter encore plus cher demain.", en: "It will cost even more tomorrow.", ar: "ستكلف أكثر غداً." },
  "why.pitch.line4": { fr: "Vos clients européens vont vous la demander.", en: "Your European clients will ask for it.", ar: "عملاؤك الأوروبيون سيطلبونها منك." },
  "why.pitch.line5": { fr: "Les banques vont l'exiger pour vous financer.", en: "Banks will require it to fund you.", ar: "البنوك ستشترطها لتمويلك." },
  "why.pitch.tag1": { fr: "Réduire votre facture eau", en: "Reduce your water bill", ar: "تقليل فاتورة المياه" },
  "why.pitch.tag2": { fr: "Certifications ISO 14001", en: "ISO 14001 Certifications", ar: "شهادات ISO 14001" },
  "why.pitch.tag3": { fr: "Financements verts", en: "Green financing", ar: "التمويل الأخضر" },
  "why.pitch.tag4": { fr: "Contrats export européens", en: "European export contracts", ar: "عقود التصدير الأوروبية" },
  "why.pitch.tag5": { fr: "Conformité réglementaire", en: "Regulatory compliance", ar: "الامتثال التنظيمي" },

  // Solution
  "solution.title1": { fr: "Une plateforme ", en: "A ", ar: "منصة " },
  "solution.titleHighlight": { fr: "intelligente", en: "smart platform", ar: "ذكية" },
  "solution.title2": { fr: " pour gérer votre empreinte eau", en: " to manage your water footprint", ar: " لإدارة بصمة مياهك" },
  "solution.subtitle": {
    fr: "HydroScan permet aux entreprises de centraliser, calculer, analyser et optimiser leur consommation d'eau selon les standards internationaux.",
    en: "HydroScan enables companies to centralize, calculate, analyze and optimize their water consumption according to international standards.",
    ar: "تمكّن HydroScan الشركات من مركزة وحساب وتحليل وتحسين استهلاك المياه وفق المعايير الدولية.",
  },
  "solution.point1": { fr: "Centraliser les données de consommation d'eau", en: "Centralize water consumption data", ar: "مركزة بيانات استهلاك المياه" },
  "solution.point2": { fr: "Calculer l'empreinte eau selon les standards internationaux", en: "Calculate water footprint according to international standards", ar: "حساب بصمة المياه وفق المعايير الدولية" },
  "solution.point3": { fr: "Analyser les usages et détecter les inefficacités", en: "Analyze usage and detect inefficiencies", ar: "تحليل الاستخدام واكتشاف عدم الكفاءة" },
  "solution.point4": { fr: "Identifier les actions d'économie d'eau", en: "Identify water saving actions", ar: "تحديد إجراءات توفير المياه" },

  // Features
  "features.title": { fr: "Fonctionnalités principales", en: "Key Features", ar: "الميزات الرئيسية" },
  "features.data.title": { fr: "Collecte de données", en: "Data Collection", ar: "جمع البيانات" },
  "features.data.p1": { fr: "Saisie simple", en: "Simple input", ar: "إدخال بسيط" },
  "features.data.p2": { fr: "Import Excel / CSV", en: "Excel / CSV import", ar: "استيراد Excel / CSV" },
  "features.data.p3": { fr: "Suivi multisites", en: "Multi-site tracking", ar: "تتبع متعدد المواقع" },
  "features.calc.title": { fr: "Calcul empreinte eau", en: "Water Footprint Calculation", ar: "حساب بصمة المياه" },
  "features.calc.p1": { fr: "Eau bleue, verte, grise", en: "Blue, green, grey water", ar: "المياه الزرقاء والخضراء والرمادية" },
  "features.calc.p2": { fr: "Indicateurs par site", en: "Indicators by site", ar: "مؤشرات حسب الموقع" },
  "features.calc.p3": { fr: "Méthode ISO 14046", en: "ISO 14046 method", ar: "منهجية ISO 14046" },
  "features.dashboard.title": { fr: "Tableau de bord", en: "Dashboard", ar: "لوحة التحكم" },
  "features.dashboard.p1": { fr: "Graphiques interactifs", en: "Interactive charts", ar: "مخططات تفاعلية" },
  "features.dashboard.p2": { fr: "Évolution mensuelle", en: "Monthly evolution", ar: "التطور الشهري" },
  "features.dashboard.p3": { fr: "Comparaison multisites", en: "Multi-site comparison", ar: "مقارنة متعددة المواقع" },
  "features.reports.title": { fr: "Rapports & conformité", en: "Reports & Compliance", ar: "التقارير والامتثال" },
  "features.reports.p1": { fr: "Rapport Water Footprint", en: "Water Footprint report", ar: "تقرير بصمة المياه" },
  "features.reports.p2": { fr: "Export GRI 303", en: "GRI 303 export", ar: "تصدير GRI 303" },
  "features.reports.p3": { fr: "Rapport ISO 14046", en: "ISO 14046 report", ar: "تقرير ISO 14046" },

  // Benefits
  "benefits.title": { fr: "Pourquoi utiliser HydroScan ?", en: "Why use HydroScan?", ar: "لماذا تستخدم HydroScan؟" },
  "benefits.b1": { fr: "Réduire les coûts liés à l'eau", en: "Reduce water-related costs", ar: "تقليل التكاليف المرتبطة بالمياه" },
  "benefits.b2": { fr: "Améliorer la performance environnementale", en: "Improve environmental performance", ar: "تحسين الأداء البيئي" },
  "benefits.b3": { fr: "Répondre aux exigences ESG", en: "Meet ESG requirements", ar: "تلبية متطلبات ESG" },
  "benefits.b4": { fr: "Anticiper les risques liés à l'eau", en: "Anticipate water-related risks", ar: "توقع المخاطر المرتبطة بالمياه" },
  "benefits.b5": { fr: "Améliorer l'image de marque", en: "Improve brand image", ar: "تحسين صورة العلامة التجارية" },

  // How it works
  "how.title": { fr: "Comment ça fonctionne", en: "How it works", ar: "كيف يعمل" },
  "how.subtitle": {
    fr: "Un processus simple en 3 étapes pour maîtriser votre empreinte eau.",
    en: "A simple 3-step process to master your water footprint.",
    ar: "عملية بسيطة من 3 خطوات لإتقان بصمة مياهك.",
  },
  "how.step1.title": { fr: "Collectez vos données eau", en: "Collect your water data", ar: "اجمع بيانات مياهك" },
  "how.step1.desc": {
    fr: "Saisissez ou importez vos données de consommation par source et usage.",
    en: "Enter or import your consumption data by source and usage.",
    ar: "أدخل أو استورد بيانات الاستهلاك حسب المصدر والاستخدام.",
  },
  "how.step2.title": { fr: "HydroScan calcule votre empreinte", en: "HydroScan calculates your footprint", ar: "HydroScan يحسب بصمتك" },
  "how.step2.desc": {
    fr: "Notre moteur de calcul analyse vos données selon la méthode ISO 14046.",
    en: "Our calculation engine analyzes your data using the ISO 14046 method.",
    ar: "يحلل محرك الحساب لدينا بياناتك باستخدام منهجية ISO 14046.",
  },
  "how.step3.title": { fr: "Identifiez les actions", en: "Identify actions", ar: "حدد الإجراءات" },
  "how.step3.desc": {
    fr: "Recevez des recommandations pour réduire votre impact et vos coûts.",
    en: "Receive recommendations to reduce your impact and costs.",
    ar: "احصل على توصيات لتقليل أثرك وتكاليفك.",
  },

  // Sectors
  "sectors.title": { fr: "Adapté à votre secteur", en: "Adapted to your industry", ar: "مناسب لقطاعك" },
  "sectors.industry": { fr: "Industrie", en: "Industry", ar: "الصناعة" },
  "sectors.industry.desc": {
    fr: "Optimisez vos processus de refroidissement et de nettoyage industriel.",
    en: "Optimize your cooling and industrial cleaning processes.",
    ar: "حسّن عمليات التبريد والتنظيف الصناعي.",
  },
  "sectors.agriculture": { fr: "Agriculture", en: "Agriculture", ar: "الزراعة" },
  "sectors.agriculture.desc": {
    fr: "Améliorez l'efficacité de l'irrigation et réduisez l'eau verte.",
    en: "Improve irrigation efficiency and reduce green water usage.",
    ar: "حسّن كفاءة الري وقلّل استخدام المياه الخضراء.",
  },
  "sectors.food": { fr: "Agroalimentaire", en: "Food Processing", ar: "الصناعات الغذائية" },
  "sectors.food.desc": {
    fr: "Maîtrisez l'eau dans vos chaînes de production alimentaire.",
    en: "Control water in your food production chains.",
    ar: "تحكم في المياه في سلاسل الإنتاج الغذائي.",
  },
  "sectors.hotel": { fr: "Hôtellerie", en: "Hospitality", ar: "الضيافة" },
  "sectors.hotel.desc": {
    fr: "Suivez la consommation eau par chambre et optimisez les sanitaires.",
    en: "Track water consumption per room and optimize sanitary facilities.",
    ar: "تتبع استهلاك المياه لكل غرفة وحسّن المرافق الصحية.",
  },

  // Standards
  "standards.title": { fr: "Méthodologie reconnue", en: "Recognized methodology", ar: "منهجية معترف بها" },
  "standards.subtitle": {
    fr: "HydroScan s'appuie sur les standards internationaux pour garantir la fiabilité de vos résultats.",
    en: "HydroScan relies on international standards to ensure the reliability of your results.",
    ar: "تعتمد HydroScan على المعايير الدولية لضمان موثوقية نتائجك.",
  },
  "standards.iso": { fr: "Norme internationale de référence pour l'empreinte eau", en: "International reference standard for water footprint", ar: "المعيار الدولي المرجعي لبصمة المياه" },
  "standards.wfn": { fr: "Réseau mondial pour la comptabilité de l'eau", en: "Global network for water accounting", ar: "الشبكة العالمية لمحاسبة المياه" },
  "standards.gri": { fr: "Standard de reporting eau dans les rapports ESG", en: "Water reporting standard in ESG reports", ar: "معيار الإبلاغ عن المياه في تقارير ESG" },
  "standards.esg": { fr: "Intégration dans vos rapports de développement durable", en: "Integration into your sustainability reports", ar: "التكامل في تقارير التنمية المستدامة" },

  // Calculator
  "calc.title": { fr: "Estimez votre empreinte eau", en: "Estimate your water footprint", ar: "قدّر بصمتك المائية" },
  "calc.subtitle": { fr: "Estimez votre empreinte eau en 2 minutes", en: "Estimate your water footprint in 2 minutes", ar: "قدّر بصمتك المائية في دقيقتين" },
  "calc.label": { fr: "Calculateur simplifié", en: "Simplified calculator", ar: "حاسبة مبسطة" },
  "calc.employees": { fr: "Nombre d'employés", en: "Number of employees", ar: "عدد الموظفين" },
  "calc.consumption": { fr: "Consommation eau annuelle (m³)", en: "Annual water consumption (m³)", ar: "استهلاك المياه السنوي (م³)" },
  "calc.sector": { fr: "Secteur d'activité", en: "Industry sector", ar: "قطاع النشاط" },
  "calc.button": { fr: "Estimer mon empreinte", en: "Estimate my footprint", ar: "قدّر بصمتي" },
  "calc.total": { fr: "Empreinte totale", en: "Total footprint", ar: "البصمة الإجمالية" },
  "calc.perEmployee": { fr: "Par employé", en: "Per employee", ar: "لكل موظف" },
  "calc.score": { fr: "Score", en: "Score", ar: "النتيجة" },
  "calc.savings": { fr: "Économies possibles", en: "Potential savings", ar: "التوفيرات الممكنة" },
  "calc.sectorIndustrie": { fr: "Industrie", en: "Industry", ar: "الصناعة" },
  "calc.sectorAgriculture": { fr: "Agriculture", en: "Agriculture", ar: "الزراعة" },
  "calc.sectorAgro": { fr: "Agroalimentaire", en: "Food Processing", ar: "الصناعات الغذائية" },
  "calc.sectorHotel": { fr: "Hôtellerie", en: "Hospitality", ar: "الضيافة" },
  "calc.sectorServices": { fr: "Services", en: "Services", ar: "الخدمات" },
  "calc.choose": { fr: "Choisir...", en: "Choose...", ar: "اختر..." },

  // Pricing
  "pricing.title": { fr: "Des solutions adaptées à chaque organisation", en: "Solutions adapted to every organization", ar: "حلول مناسبة لكل منظمة" },
  "pricing.subtitle": {
    fr: "Choisissez la formule la plus adaptée à votre structure. Nos équipes vous accompagnent pour définir la solution optimale.",
    en: "Choose the plan that best fits your structure. Our teams will help you define the optimal solution.",
    ar: "اختر الخطة الأنسب لهيكلك. فرقنا ستساعدك لتحديد الحل الأمثل.",
  },
  "pricing.estimate.title": { fr: "Obtenez une estimation rapide", en: "Get a quick estimate", ar: "احصل على تقدير سريع" },
  "pricing.estimate.sector": { fr: "Secteur", en: "Sector", ar: "القطاع" },
  "pricing.estimate.sites": { fr: "Nombre de sites", en: "Number of sites", ar: "عدد المواقع" },
  "pricing.estimate.employees": { fr: "Nombre d'employés", en: "Number of employees", ar: "عدد الموظفين" },
  "pricing.estimate.cta": { fr: "Recevoir une estimation", en: "Receive an estimate", ar: "الحصول على تقدير" },

  // CTA Final
  "cta.title": {
    fr: "Commencez à mesurer votre empreinte eau dès aujourd'hui",
    en: "Start measuring your water footprint today",
    ar: "ابدأ قياس بصمتك المائية اليوم",
  },
  "cta.subtitle": {
    fr: "Rejoignez les entreprises qui prennent le contrôle de leur impact hydrique en Tunisie et en Afrique.",
    en: "Join the companies taking control of their water impact in Tunisia and Africa.",
    ar: "انضم إلى الشركات التي تتحكم في أثرها المائي في تونس وأفريقيا.",
  },
  "cta.demo": { fr: "Demander une démo", en: "Request a demo", ar: "طلب عرض توضيحي" },
  "cta.trial": { fr: "Essai gratuit", en: "Free trial", ar: "تجربة مجانية" },

  // Footer
  "footer.text": {
    fr: "© 2026 HydroScan. Plateforme d'empreinte hydrique pour l'Afrique.",
    en: "© 2026 HydroScan. Water footprint platform for Africa.",
    ar: "© 2026 HydroScan. منصة البصمة المائية لأفريقيا.",
  },

  // Sidebar & App
  "sidebar.home": { fr: "Accueil", en: "Home", ar: "الرئيسية" },
  "sidebar.dashboard": { fr: "Tableau de Bord", en: "Dashboard", ar: "لوحة التحكم" },
  "sidebar.measures": { fr: "MESURES", en: "MEASURES", ar: "القياسات" },
  "sidebar.dataEntry": { fr: "Saisie des données", en: "Data Entry", ar: "إدخال البيانات" },
  "sidebar.directConsumption": { fr: "Consommation Directe", en: "Direct Consumption", ar: "الاستهلاك المباشر" },
  "sidebar.supplyChain": { fr: "Chaîne Logistique", en: "Supply Chain", ar: "سلسلة التوريد" },
  "sidebar.discharges": { fr: "Rejets & Qualité", en: "Discharges & Quality", ar: "المصارف والجودة" },
  "sidebar.analyses": { fr: "ANALYSES", en: "ANALYSES", ar: "التحليلات" },
  "sidebar.stressMap": { fr: "Carte de Stress", en: "Stress Map", ar: "خريطة الضغط" },
  "sidebar.reportsExports": { fr: "Rapports & Exports", en: "Reports & Exports", ar: "التقارير والتصدير" },
  "sidebar.actionPlan": { fr: "Plan d'Action", en: "Action Plan", ar: "خطة العمل" },
  "sidebar.settingsSection": { fr: "PARAMÈTRES", en: "SETTINGS", ar: "الإعدادات" },
  "sidebar.sitesLocation": { fr: "Sites & Localisation", en: "Sites & Location", ar: "المواقع والموقع" },
  "sidebar.settings": { fr: "Configuration", en: "Configuration", ar: "التكوين" },
  "sidebar.plan": { fr: "Plan Starter", en: "Starter Plan", ar: "خطة البداية" },
  "sidebar.planDesc": { fr: "1 site · 1 utilisateur", en: "1 site · 1 user", ar: "موقع 1 · مستخدم 1" },
  "sidebar.logout": { fr: "Déconnexion", en: "Log out", ar: "تسجيل الخروج" },

  // Supply Chain page
  "supply.title": { fr: "Approvisionnements", en: "Supply Chain", ar: "الإمدادات" },
  "supply.subtitle": { fr: "Eau virtuelle importée via vos matières premières", en: "Virtual water imported through raw materials", ar: "المياه الافتراضية المستوردة عبر موادك الخام" },
  "supply.import": { fr: "Importer CSV", en: "Import CSV", ar: "استيراد CSV" },
  "supply.add": { fr: "Ajouter un achat", en: "Add purchase", ar: "إضافة مشتريات" },
  "supply.virtualWater": { fr: "Eau virtuelle totale", en: "Total virtual water", ar: "إجمالي المياه الافتراضية" },
  "supply.materials": { fr: "Matières saisies", en: "Materials entered", ar: "المواد المدخلة" },
  "supply.suppliers": { fr: "Fournisseurs", en: "Suppliers", ar: "الموردون" },
  "supply.noData": { fr: "Aucune donnée saisie", en: "No data entered", ar: "لا توجد بيانات مدخلة" },
  "supply.emptyTitle": { fr: "Aucun approvisionnement saisi", en: "No supply data yet", ar: "لا توجد إمدادات مدخلة" },
  "supply.emptyDesc": { fr: "Ajoutez vos achats de matières premières pour calculer l'eau virtuelle (indirecte) de votre chaîne d'approvisionnement.", en: "Add your raw material purchases to calculate the virtual (indirect) water of your supply chain.", ar: "أضف مشترياتك من المواد الخام لحساب المياه الافتراضية لسلسلة التوريد." },

  // Pollution page
  "pollution.title": { fr: "Sources de Pollution", en: "Pollution Sources", ar: "مصادر التلوث" },
  "pollution.subtitle": { fr: "Rejets d'eaux usées pour le calcul de l'Eau Grise", en: "Wastewater discharges for Grey Water calculation", ar: "مصارف مياه الصرف لحساب المياه الرمادية" },
  "pollution.add": { fr: "Ajouter un rejet", en: "Add discharge", ar: "إضافة مصرف" },
  "pollution.greyWater": { fr: "Eau grise totale", en: "Total grey water", ar: "إجمالي المياه الرمادية" },
  "pollution.sources": { fr: "Sources de rejet", en: "Discharge sources", ar: "مصادر المصارف" },
  "pollution.compliance": { fr: "Conformité ANPE", en: "ANPE Compliance", ar: "الامتثال لـ ANPE" },
  "pollution.noData": { fr: "Aucune donnée saisie", en: "No data entered", ar: "لا توجد بيانات مدخلة" },
  "pollution.emptyTitle": { fr: "Aucun rejet saisi", en: "No discharge data yet", ar: "لا توجد مصارف مدخلة" },
  "pollution.emptyDesc": { fr: "Enregistrez vos rejets d'eaux usées pour calculer votre empreinte Eau Grise et vérifier la conformité réglementaire.", en: "Record your wastewater discharges to calculate your Grey Water footprint and check regulatory compliance.", ar: "سجّل مصارف مياه الصرف لحساب بصمة مياهك الرمادية والتحقق من الامتثال التنظيمي." },

  // Stress Map page
  "stressMap.title": { fr: "Carte d'Impact Hydrique", en: "Water Impact Map", ar: "خريطة الأثر المائي" },
  "stressMap.subtitle": { fr: "Visualisez l'impact pondéré selon la rareté locale de l'eau (WSI)", en: "Visualize impact weighted by local water scarcity (WSI)", ar: "تصوير الأثر المرجح بندرة المياه المحلية (WSI)" },

  // Action Plan page
  "actionPlan.title": { fr: "Plan d'Action", en: "Action Plan", ar: "خطة العمل" },
  "actionPlan.subtitle": { fr: "Actions concrètes pour réduire votre empreinte eau et optimiser vos coûts", en: "Concrete actions to reduce your water footprint and optimize costs", ar: "إجراءات ملموسة لتقليل بصمتك المائية وتحسين تكاليفك" },
  "actionPlan.actions": { fr: "Actions recommandées", en: "Recommended actions", ar: "الإجراءات الموصى بها" },
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("fr");

  const t = (key: string): string => {
    return translations[key]?.[lang] ?? key;
  };

  // Apply RTL direction for Arabic
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      <div dir={dir} className={lang === "ar" ? "font-arabic" : ""}>
        {children}
      </div>
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used within I18nProvider");
  return context;
}
