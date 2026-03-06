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

  // Problem
  "problem.title": { fr: "Pourquoi mesurer son empreinte eau ?", en: "Why measure your water footprint?" },
  "problem.subtitle": {
    fr: "La pression sur les ressources en eau s'intensifie. Les entreprises consomment souvent sans visibilité réelle.",
    en: "Pressure on water resources is intensifying. Companies often consume without real visibility.",
  },
  "problem.card1.title": { fr: "Ressources sous pression", en: "Resources under pressure" },
  "problem.card1.desc": {
    fr: "Le stress hydrique touche 40% de la population mondiale et s'aggrave chaque année.",
    en: "Water stress affects 40% of the world's population and is worsening every year.",
  },
  "problem.card2.title": { fr: "Aucune visibilité", en: "No visibility" },
  "problem.card2.desc": {
    fr: "La plupart des entreprises n'ont pas de suivi structuré de leur consommation d'eau.",
    en: "Most companies lack structured monitoring of their water consumption.",
  },
  "problem.card3.title": { fr: "Normes ESG", en: "ESG Standards" },
  "problem.card3.desc": {
    fr: "Les réglementations exigent des indicateurs de performance environnementale.",
    en: "Regulations require environmental performance indicators.",
  },
  "problem.card4.title": { fr: "Coûts croissants", en: "Rising costs" },
  "problem.card4.desc": {
    fr: "Le prix de l'eau augmente. Optimiser, c'est aussi réduire ses charges.",
    en: "Water prices are rising. Optimizing also means reducing costs.",
  },
  "problem.stat1": { fr: "de l'eau mondiale consommée par l'industrie", en: "of global water consumed by industry" },
  "problem.stat2": { fr: "de l'eau douce utilisée par l'agriculture", en: "of freshwater used by agriculture" },

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
    fr: "© 2024 HydroScan. Plateforme d'empreinte hydrique pour l'Afrique.",
    en: "© 2024 HydroScan. Water footprint platform for Africa.",
  },

  // Sidebar & App
  "sidebar.dashboard": { fr: "Tableau de bord", en: "Dashboard" },
  "sidebar.data": { fr: "Collecte de données", en: "Data Collection" },
  "sidebar.footprint": { fr: "Empreinte hydrique", en: "Water Footprint" },
  "sidebar.reports": { fr: "Rapports", en: "Reports" },
  "sidebar.recommendations": { fr: "Recommandations", en: "Recommendations" },
  "sidebar.organization": { fr: "Organisation", en: "Organization" },
  "sidebar.settings": { fr: "Paramètres", en: "Settings" },
  "sidebar.main": { fr: "Principal", en: "Main" },
  "sidebar.config": { fr: "Configuration", en: "Configuration" },
  "sidebar.plan": { fr: "Plan Starter", en: "Starter Plan" },
  "sidebar.planDesc": { fr: "1 site · 1 utilisateur", en: "1 site · 1 user" },
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
