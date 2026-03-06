export const mockMonthlyData = [
  { month: "Jan", blue: 1200, green: 800, grey: 400 },
  { month: "Fév", blue: 1100, green: 750, grey: 380 },
  { month: "Mar", blue: 1350, green: 900, grey: 450 },
  { month: "Avr", blue: 1500, green: 1100, grey: 500 },
  { month: "Mai", blue: 1800, green: 1400, grey: 550 },
  { month: "Jun", blue: 2100, green: 1600, grey: 600 },
  { month: "Jul", blue: 2400, green: 1800, grey: 650 },
  { month: "Aoû", blue: 2300, green: 1700, grey: 630 },
  { month: "Sep", blue: 1900, green: 1300, grey: 520 },
  { month: "Oct", blue: 1500, green: 1000, grey: 460 },
  { month: "Nov", blue: 1200, green: 850, grey: 410 },
  { month: "Déc", blue: 1100, green: 780, grey: 390 },
];

export const mockUsageBreakdown = [
  { name: "Processus industriel", value: 35, fill: "hsl(201, 96%, 32%)" },
  { name: "Irrigation", value: 28, fill: "hsl(142, 72%, 29%)" },
  { name: "Sanitaire", value: 15, fill: "hsl(220, 9%, 46%)" },
  { name: "Refroidissement", value: 12, fill: "hsl(201, 70%, 55%)" },
  { name: "Nettoyage", value: 10, fill: "hsl(48, 96%, 53%)" },
];

export const mockAlerts = [
  {
    id: 1,
    type: "warning" as const,
    message: "Consommation en hausse de 23% par rapport au mois précédent",
    date: "2024-03-15",
  },
  {
    id: 2,
    type: "critical" as const,
    message: "Fuite potentielle détectée — Site Nabeul",
    date: "2024-03-14",
  },
  {
    id: 3,
    type: "info" as const,
    message: "Rapport mensuel prêt à être généré",
    date: "2024-03-13",
  },
];

export const mockRecommendations = [
  {
    id: 1,
    title: "Recyclage des eaux de refroidissement",
    description: "Installer un système de recirculation pour les eaux de refroidissement du processus industriel.",
    savingsM3: 3200,
    savingsCost: 8500,
    priority: "high" as const,
    category: "Recyclage",
  },
  {
    id: 2,
    title: "Irrigation goutte-à-goutte",
    description: "Remplacer l'irrigation par aspersion par un système goutte-à-goutte pour réduire la consommation d'eau verte.",
    savingsM3: 2800,
    savingsCost: 6200,
    priority: "high" as const,
    category: "Irrigation",
  },
  {
    id: 3,
    title: "Détection de fuites",
    description: "Installer des capteurs IoT pour la détection précoce des fuites dans le réseau de distribution.",
    savingsM3: 1500,
    savingsCost: 4000,
    priority: "medium" as const,
    category: "Maintenance",
  },
  {
    id: 4,
    title: "Traitement des eaux grises",
    description: "Mettre en place un système de traitement des eaux grises pour réutilisation dans le nettoyage.",
    savingsM3: 900,
    savingsCost: 2400,
    priority: "medium" as const,
    category: "Recyclage",
  },
];

export function getWaterScore(totalM3: number, employees: number): { grade: string; color: string } {
  const perEmployee = totalM3 / employees;
  if (perEmployee < 50) return { grade: "A", color: "text-score-a" };
  if (perEmployee < 100) return { grade: "B", color: "text-score-b" };
  if (perEmployee < 200) return { grade: "C", color: "text-score-c" };
  if (perEmployee < 350) return { grade: "D", color: "text-score-d" };
  return { grade: "E", color: "text-score-e" };
}
