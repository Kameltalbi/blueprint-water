import { createContext, useContext, useState, ReactNode } from "react";

type Lang = "fr" | "en";

interface I18nContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Lang, string>> = {
  // Navbar
  "nav.problem": { fr: "Problème", en: "Problem" },
  "nav.solution": { fr: "Solution", en: "Solution" },
  "nav.features": { fr: "Fonctionnalités", en: "Features" },
  "nav.pricing": { fr: "Tarifs", en: "Pricing" },
  "nav.login": { fr: "Connexion", en: "Login" },
  "nav.demo": { fr: "Demander une démo", en: "Request a demo" },

  // Hero
  "hero.badge": { fr: "Conforme ISO 14046", en: "ISO 14046 Compliant" },
  "hero.title1": { fr: "Mesurez l'", en: "Measure your company's " },
  "hero.titleHighlight": { fr: "empreinte eau", en: "water footprint" },
  "hero.title2": { fr: " de votre entreprise", en: "" },
  "hero.subtitle": {
    fr: "Mesurez, analysez et réduisez votre consommation d'eau grâce à une plateforme conforme aux standards internationaux.",
    en: "Measure, analyze and reduce your water consumption with a platform that complies with international standards.",
  },
  "hero.cta1": { fr: "Demander une démo", en: "Request a demo" },
  "hero.cta2": { fr: "Essayer la plateforme", en: "Try the platform" },

  // Why Section
  "why.label": { fr: "Pourquoi HydroScan", en: "Why HydroScan" },
  "why.title1": { fr: "6 raisons de mesurer\nvotre ", en: "6 reasons to measure\nyour " },
  "why.titleHighlight": { fr: "empreinte eau", en: "water footprint" },
  "why.subtitle": {
    fr: "Les entreprises qui trackent leur eau aujourd'hui survivront demain. Celles qui attendent paieront le prix fort.",
    en: "Companies tracking their water today will survive tomorrow. Those who wait will pay the price.",
  },

  "why.stat1.number": { fr: "40%", en: "40%" },
  "why.stat1.label": { fr: "d'eau gaspillée en moyenne par les entreprises", en: "of water wasted on average by companies" },
  "why.stat2.number": { fr: "×3", en: "×3" },
  "why.stat2.label": { fr: "hausse du prix de l'eau industrielle d'ici 2030", en: "increase in industrial water price by 2030" },
  "why.stat3.number": { fr: "8.5", en: "8.5" },
  "why.stat3.label": { fr: "facteur de stress hydrique en Tunisie (AWARE)", en: "water stress factor in Tunisia (AWARE)" },
  "why.stat4.number": { fr: "500k+", en: "500k+" },
  "why.stat4.label": { fr: "entreprises ciblées en Afrique francophone", en: "targeted companies in francophone Africa" },

  "why.reason1.title": { fr: "Réduire votre facture eau", en: "Reduce your water bill" },
  "why.reason1.desc": {
    fr: "Une usine moyenne consomme 5 000 m³/mois. Identifier 20% de gaspillage représente jusqu'à 36 000 TND d'économies par an — soit 12× le prix de l'abonnement.",
    en: "An average factory consumes 5,000 m³/month. Identifying 20% waste represents up to 36,000 TND in annual savings — 12× the subscription price.",
  },
  "why.reason1.highlight": { fr: "ROI moyen × 6 à × 12 dès la 1ère année", en: "Average ROI × 6 to × 12 from year 1" },

  "why.reason2.title": { fr: "Conformité réglementaire", en: "Regulatory compliance" },
  "why.reason2.desc": {
    fr: "La loi tunisienne impose aux entreprises industrielles de déclarer leur consommation à l'ANPE. Les donneurs d'ordre européens exigent un Water Footprint certifié.",
    en: "Tunisian law requires industrial companies to report consumption to ANPE. European contractors require a certified Water Footprint.",
  },
  "why.reason2.highlight": { fr: "Sans rapport = perte de contrats export", en: "No report = lost export contracts" },

  "why.reason3.title": { fr: "Accès aux financements verts", en: "Access to green financing" },
  "why.reason3.desc": {
    fr: "Banque Mondiale, AFD, BAD, FODEP financent les entreprises africaines uniquement si elles mesurent leur impact hydrique. Sans mesure = sans financement.",
    en: "World Bank, AFD, AfDB, FODEP fund African companies only if they measure their water impact. No measurement = no funding.",
  },
  "why.reason3.highlight": { fr: "Subventions jusqu'à 40% via FODEP", en: "Subsidies up to 40% via FODEP" },

  "why.reason4.title": { fr: "Certifications & Appels d'offres", en: "Certifications & Tenders" },
  "why.reason4.desc": {
    fr: "ISO 14001, ISO 14046, GRI 303 — toutes ces certifications exigent un bilan eau. Sans elles, vous êtes exclus des appels d'offres publics et des marchés européens.",
    en: "ISO 14001, ISO 14046, GRI 303 — all require a water assessment. Without them, you're excluded from public tenders and European markets.",
  },
  "why.reason4.highlight": { fr: "Accès aux marchés publics & européens", en: "Access to public & European markets" },

  "why.reason5.title": { fr: "Anticiper le risque hydrique", en: "Anticipate water risk" },
  "why.reason5.desc": {
    fr: "Les barrages tunisiens sont à 30% de capacité. Le prix de l'eau industrielle a augmenté de 40% en 5 ans. Les restrictions arrivent. Êtes-vous prêt ?",
    en: "Tunisian dams are at 30% capacity. Industrial water prices rose 40% in 5 years. Restrictions are coming. Are you ready?",
  },
  "why.reason5.highlight": { fr: "Stress hydrique critique en Tunisie", en: "Critical water stress in Tunisia" },

  "why.reason6.title": { fr: "Image & compétitivité", en: "Image & competitiveness" },
  "why.reason6.desc": {
    fr: "Les grandes surfaces européennes et les investisseurs internationaux exigent une stratégie eau documentée. Sans elle, votre marque perd en crédibilité.",
    en: "European retailers and international investors require a documented water strategy. Without it, your brand loses credibility.",
  },
  "why.reason6.highlight": { fr: "Avantage concurrentiel durable", en: "Sustainable competitive advantage" },

  // ROI
  "why.roi.label": { fr: "Calculateur ROI", en: "ROI Calculator" },
  "why.roi.title": { fr: "Combien vous coûte\nvotre gaspillage eau ?", en: "How much does your\nwater waste cost?" },
  "why.roi.desc": {
    fr: "En moyenne, nos clients identifient 15 à 30% de consommation évitable dès le premier mois d'utilisation d'HydroScan.",
    en: "On average, our clients identify 15 to 30% of avoidable consumption in the first month of using HydroScan.",
  },
  "why.roi.cta": { fr: "Calculer mon ROI", en: "Calculate my ROI" },
  "why.roi.row1.label": { fr: "Consommation typique (usine moyenne)", en: "Typical consumption (average factory)" },
  "why.roi.row1.value": { fr: "5 000 m³/mois", en: "5,000 m³/month" },
  "why.roi.row2.label": { fr: "Facture eau mensuelle", en: "Monthly water bill" },
  "why.roi.row2.value": { fr: "12 500 TND", en: "12,500 TND" },
  "why.roi.row3.label": { fr: "Gaspillage identifié (20%)", en: "Identified waste (20%)" },
  "why.roi.row3.value": { fr: "2 500 TND/mois", en: "2,500 TND/month" },
  "why.roi.row4.label": { fr: "Économies annuelles", en: "Annual savings" },
  "why.roi.row4.value": { fr: "30 000 TND/an", en: "30,000 TND/year" },
  "why.roi.row5.label": { fr: "Abonnement HydroScan", en: "HydroScan subscription" },
  "why.roi.row5.value": { fr: "2 800 TND/an", en: "2,800 TND/year" },
  "why.roi.row6.label": { fr: "Retour sur investissement", en: "Return on investment" },
  "why.roi.row6.value": { fr: "× 10 🚀", en: "× 10 🚀" },

  // Pitch
  "why.pitch.line1": { fr: "Votre entreprise consomme de l'eau.", en: "Your company consumes water." },
  "why.pitch.line2": { fr: "Cette eau vous coûte de l'argent.", en: "That water costs you money." },
  "why.pitch.line3": { fr: "Elle va coûter encore plus cher demain.", en: "It will cost even more tomorrow." },
  "why.pitch.line4": { fr: "Vos clients européens vont vous la demander.", en: "Your European clients will ask for it." },
  "why.pitch.line5": { fr: "Les banques vont l'exiger pour vous financer.", en: "Banks will require it to fund you." },
  "why.pitch.tag1": { fr: "Réduire votre facture eau", en: "Reduce your water bill" },
  "why.pitch.tag2": { fr: "Certifications ISO 14001", en: "ISO 14001 Certifications" },
  "why.pitch.tag3": { fr: "Financements verts", en: "Green financing" },
  "why.pitch.tag4": { fr: "Contrats export européens", en: "European export contracts" },
  "why.pitch.tag5": { fr: "Conformité réglementaire", en: "Regulatory compliance" },

  // Solution
  "solution.title1": { fr: "Une plateforme ", en: "A " },
  "solution.titleHighlight": { fr: "intelligente", en: "smart platform" },
  "solution.title2": { fr: " pour gérer votre empreinte eau", en: " to manage your water footprint" },
  "solution.subtitle": {
    fr: "HydroScan permet aux entreprises de centraliser, calculer, analyser et optimiser leur consommation d'eau selon les standards internationaux.",
    en: "HydroScan enables companies to centralize, calculate, analyze and optimize their water consumption according to international standards.",
  },
  "solution.point1": { fr: "Centraliser les données de consommation d'eau", en: "Centralize water consumption data" },
  "solution.point2": { fr: "Calculer l'empreinte eau selon les standards internationaux", en: "Calculate water footprint according to international standards" },
  "solution.point3": { fr: "Analyser les usages et détecter les inefficacités", en: "Analyze usage and detect inefficiencies" },
  "solution.point4": { fr: "Identifier les actions d'économie d'eau", en: "Identify water saving actions" },

  // Features
  "features.title": { fr: "Fonctionnalités principales", en: "Key Features" },
  "features.data.title": { fr: "Collecte de données", en: "Data Collection" },
  "features.data.p1": { fr: "Saisie simple", en: "Simple input" },
  "features.data.p2": { fr: "Import Excel / CSV", en: "Excel / CSV import" },
  "features.data.p3": { fr: "Suivi multisites", en: "Multi-site tracking" },
  "features.calc.title": { fr: "Calcul empreinte eau", en: "Water Footprint Calculation" },
  "features.calc.p1": { fr: "Eau bleue, verte, grise", en: "Blue, green, grey water" },
  "features.calc.p2": { fr: "Indicateurs par site", en: "Indicators by site" },
  "features.calc.p3": { fr: "Méthode ISO 14046", en: "ISO 14046 method" },
  "features.dashboard.title": { fr: "Tableau de bord", en: "Dashboard" },
  "features.dashboard.p1": { fr: "Graphiques interactifs", en: "Interactive charts" },
  "features.dashboard.p2": { fr: "Évolution mensuelle", en: "Monthly evolution" },
  "features.dashboard.p3": { fr: "Comparaison multisites", en: "Multi-site comparison" },
  "features.reports.title": { fr: "Rapports & conformité", en: "Reports & Compliance" },
  "features.reports.p1": { fr: "Rapport Water Footprint", en: "Water Footprint report" },
  "features.reports.p2": { fr: "Export GRI 303", en: "GRI 303 export" },
  "features.reports.p3": { fr: "Rapport ISO 14046", en: "ISO 14046 report" },

  // Benefits
  "benefits.title": { fr: "Pourquoi utiliser HydroScan ?", en: "Why use HydroScan?" },
  "benefits.b1": { fr: "Réduire les coûts liés à l'eau", en: "Reduce water-related costs" },
  "benefits.b2": { fr: "Améliorer la performance environnementale", en: "Improve environmental performance" },
  "benefits.b3": { fr: "Répondre aux exigences ESG", en: "Meet ESG requirements" },
  "benefits.b4": { fr: "Anticiper les risques liés à l'eau", en: "Anticipate water-related risks" },
  "benefits.b5": { fr: "Améliorer l'image de marque", en: "Improve brand image" },

  // How it works
  "how.title": { fr: "Comment ça fonctionne", en: "How it works" },
  "how.subtitle": {
    fr: "Un processus simple en 3 étapes pour maîtriser votre empreinte eau.",
    en: "A simple 3-step process to master your water footprint.",
  },
  "how.step1.title": { fr: "Collectez vos données eau", en: "Collect your water data" },
  "how.step1.desc": {
    fr: "Saisissez ou importez vos données de consommation par source et usage.",
    en: "Enter or import your consumption data by source and usage.",
  },
  "how.step2.title": { fr: "HydroScan calcule votre empreinte", en: "HydroScan calculates your footprint" },
  "how.step2.desc": {
    fr: "Notre moteur de calcul analyse vos données selon la méthode ISO 14046.",
    en: "Our calculation engine analyzes your data using the ISO 14046 method.",
  },
  "how.step3.title": { fr: "Identifiez les actions", en: "Identify actions" },
  "how.step3.desc": {
    fr: "Recevez des recommandations pour réduire votre impact et vos coûts.",
    en: "Receive recommendations to reduce your impact and costs.",
  },

  // Sectors
  "sectors.title": { fr: "Adapté à votre secteur", en: "Adapted to your industry" },
  "sectors.industry": { fr: "Industrie", en: "Industry" },
  "sectors.industry.desc": {
    fr: "Optimisez vos processus de refroidissement et de nettoyage industriel.",
    en: "Optimize your cooling and industrial cleaning processes.",
  },
  "sectors.agriculture": { fr: "Agriculture", en: "Agriculture" },
  "sectors.agriculture.desc": {
    fr: "Améliorez l'efficacité de l'irrigation et réduisez l'eau verte.",
    en: "Improve irrigation efficiency and reduce green water usage.",
  },
  "sectors.food": { fr: "Agroalimentaire", en: "Food Processing" },
  "sectors.food.desc": {
    fr: "Maîtrisez l'eau dans vos chaînes de production alimentaire.",
    en: "Control water in your food production chains.",
  },
  "sectors.hotel": { fr: "Hôtellerie", en: "Hospitality" },
  "sectors.hotel.desc": {
    fr: "Suivez la consommation eau par chambre et optimisez les sanitaires.",
    en: "Track water consumption per room and optimize sanitary facilities.",
  },

  // Standards
  "standards.title": { fr: "Méthodologie reconnue", en: "Recognized methodology" },
  "standards.subtitle": {
    fr: "HydroScan s'appuie sur les standards internationaux pour garantir la fiabilité de vos résultats.",
    en: "HydroScan relies on international standards to ensure the reliability of your results.",
  },
  "standards.iso": { fr: "Norme internationale de référence pour l'empreinte eau", en: "International reference standard for water footprint" },
  "standards.wfn": { fr: "Réseau mondial pour la comptabilité de l'eau", en: "Global network for water accounting" },
  "standards.gri": { fr: "Standard de reporting eau dans les rapports ESG", en: "Water reporting standard in ESG reports" },
  "standards.esg": { fr: "Intégration dans vos rapports de développement durable", en: "Integration into your sustainability reports" },

  // Calculator
  "calc.title": { fr: "Estimez votre empreinte eau", en: "Estimate your water footprint" },
  "calc.subtitle": { fr: "Estimez votre empreinte eau en 2 minutes", en: "Estimate your water footprint in 2 minutes" },
  "calc.label": { fr: "Calculateur simplifié", en: "Simplified calculator" },
  "calc.employees": { fr: "Nombre d'employés", en: "Number of employees" },
  "calc.consumption": { fr: "Consommation eau annuelle (m³)", en: "Annual water consumption (m³)" },
  "calc.sector": { fr: "Secteur d'activité", en: "Industry sector" },
  "calc.button": { fr: "Estimer mon empreinte", en: "Estimate my footprint" },
  "calc.total": { fr: "Empreinte totale", en: "Total footprint" },
  "calc.perEmployee": { fr: "Par employé", en: "Per employee" },
  "calc.score": { fr: "Score", en: "Score" },
  "calc.savings": { fr: "Économies possibles", en: "Potential savings" },
  "calc.sectorIndustrie": { fr: "Industrie", en: "Industry" },
  "calc.sectorAgriculture": { fr: "Agriculture", en: "Agriculture" },
  "calc.sectorAgro": { fr: "Agroalimentaire", en: "Food Processing" },
  "calc.sectorHotel": { fr: "Hôtellerie", en: "Hospitality" },
  "calc.sectorServices": { fr: "Services", en: "Services" },
  "calc.choose": { fr: "Choisir...", en: "Choose..." },

  // Pricing
  "pricing.title": { fr: "Des solutions adaptées à chaque organisation", en: "Solutions adapted to every organization" },
  "pricing.subtitle": {
    fr: "Choisissez la formule la plus adaptée à votre structure. Nos équipes vous accompagnent pour définir la solution optimale.",
    en: "Choose the plan that best fits your structure. Our teams will help you define the optimal solution.",
  },
  "pricing.estimate.title": { fr: "Obtenez une estimation rapide", en: "Get a quick estimate" },
  "pricing.estimate.sector": { fr: "Secteur", en: "Sector" },
  "pricing.estimate.sites": { fr: "Nombre de sites", en: "Number of sites" },
  "pricing.estimate.employees": { fr: "Nombre d'employés", en: "Number of employees" },
  "pricing.estimate.cta": { fr: "Recevoir une estimation", en: "Receive an estimate" },

  // CTA Final
  "cta.title": {
    fr: "Commencez à mesurer votre empreinte eau dès aujourd'hui",
    en: "Start measuring your water footprint today",
  },
  "cta.subtitle": {
    fr: "Rejoignez les entreprises qui prennent le contrôle de leur impact hydrique en Tunisie et en Afrique.",
    en: "Join the companies taking control of their water impact in Tunisia and Africa.",
  },
  "cta.demo": { fr: "Demander une démo", en: "Request a demo" },
  "cta.trial": { fr: "Essai gratuit", en: "Free trial" },

  // Footer
  "footer.text": {
    fr: "© 2026 HydroScan. Plateforme d'empreinte hydrique pour l'Afrique.",
    en: "© 2026 HydroScan. Water footprint platform for Africa.",
  },

  // Sidebar & App
  "sidebar.home": { fr: "Accueil", en: "Home" },
  "sidebar.dashboard": { fr: "Tableau de Bord", en: "Dashboard" },
  "sidebar.measures": { fr: "MESURES", en: "MEASURES" },
  "sidebar.dataEntry": { fr: "Saisie des données", en: "Data Entry" },
  "sidebar.directConsumption": { fr: "Consommation Directe", en: "Direct Consumption" },
  "sidebar.supplyChain": { fr: "Chaîne Logistique", en: "Supply Chain" },
  "sidebar.discharges": { fr: "Rejets & Qualité", en: "Discharges & Quality" },
  "sidebar.analyses": { fr: "ANALYSES", en: "ANALYSES" },
  "sidebar.stressMap": { fr: "Carte de Stress", en: "Stress Map" },
  "sidebar.reportsExports": { fr: "Rapports & Exports", en: "Reports & Exports" },
  "sidebar.actionPlan": { fr: "Plan d'Action", en: "Action Plan" },
  "sidebar.settingsSection": { fr: "PARAMÈTRES", en: "SETTINGS" },
  "sidebar.sitesLocation": { fr: "Sites & Localisation", en: "Sites & Location" },
  "sidebar.settings": { fr: "Configuration", en: "Configuration" },
  "sidebar.plan": { fr: "Plan Starter", en: "Starter Plan" },
  "sidebar.planDesc": { fr: "1 site · 1 utilisateur", en: "1 site · 1 user" },
  "sidebar.logout": { fr: "Déconnexion", en: "Log out" },

  // Supply Chain page
  "supply.title": { fr: "Approvisionnements", en: "Supply Chain" },
  "supply.subtitle": { fr: "Eau virtuelle importée via vos matières premières", en: "Virtual water imported through raw materials" },
  "supply.import": { fr: "Importer CSV", en: "Import CSV" },
  "supply.add": { fr: "Ajouter un achat", en: "Add purchase" },
  "supply.virtualWater": { fr: "Eau virtuelle totale", en: "Total virtual water" },
  "supply.materials": { fr: "Matières saisies", en: "Materials entered" },
  "supply.suppliers": { fr: "Fournisseurs", en: "Suppliers" },
  "supply.noData": { fr: "Aucune donnée saisie", en: "No data entered" },
  "supply.emptyTitle": { fr: "Aucun approvisionnement saisi", en: "No supply data yet" },
  "supply.emptyDesc": { fr: "Ajoutez vos achats de matières premières pour calculer l'eau virtuelle (indirecte) de votre chaîne d'approvisionnement.", en: "Add your raw material purchases to calculate the virtual (indirect) water of your supply chain." },

  // Pollution page
  "pollution.title": { fr: "Sources de Pollution", en: "Pollution Sources" },
  "pollution.subtitle": { fr: "Rejets d'eaux usées pour le calcul de l'Eau Grise", en: "Wastewater discharges for Grey Water calculation" },
  "pollution.add": { fr: "Ajouter un rejet", en: "Add discharge" },
  "pollution.greyWater": { fr: "Eau grise totale", en: "Total grey water" },
  "pollution.sources": { fr: "Sources de rejet", en: "Discharge sources" },
  "pollution.compliance": { fr: "Conformité ANPE", en: "ANPE Compliance" },
  "pollution.noData": { fr: "Aucune donnée saisie", en: "No data entered" },
  "pollution.emptyTitle": { fr: "Aucun rejet saisi", en: "No discharge data yet" },
  "pollution.emptyDesc": { fr: "Enregistrez vos rejets d'eaux usées pour calculer votre empreinte Eau Grise et vérifier la conformité réglementaire.", en: "Record your wastewater discharges to calculate your Grey Water footprint and check regulatory compliance." },

  // Stress Map page
  "stressMap.title": { fr: "Carte d'Impact Hydrique", en: "Water Impact Map" },
  "stressMap.subtitle": { fr: "Visualisez l'impact pondéré selon la rareté locale de l'eau (WSI)", en: "Visualize impact weighted by local water scarcity (WSI)" },

  // Action Plan page
  "actionPlan.title": { fr: "Plan d'Action", en: "Action Plan" },
  "actionPlan.subtitle": { fr: "Actions concrètes pour réduire votre empreinte eau et optimiser vos coûts", en: "Concrete actions to reduce your water footprint and optimize costs" },
  "actionPlan.actions": { fr: "Actions recommandées", en: "Recommended actions" },
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("fr");

  const t = (key: string): string => {
    return translations[key]?.[lang] ?? key;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used within I18nProvider");
  return context;
}
