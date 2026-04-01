import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { wsiByCountry } from "@/lib/water-data";

/* ── Types ── */
export interface ConsumptionRecord {
  recorded_date: string;
  volume_m3: number;
  source: string;
  usage: string;
  period: string;
  site_id?: string | null;
}

export interface SiteRecord {
  id: string;
  name: string;
  location?: string;
}

export interface ReportOptions {
  orgName: string;
  consumption: ConsumptionRecord[];
  sites: SiteRecord[];
  reportType: "water-footprint" | "gri-303" | "iso-14046";
  lang?: "fr" | "en" | "ar";
}

/* ── Helpers ── */
const COLORS = {
  primary: [14, 116, 144] as [number, number, number],
  dark: [17, 24, 39] as [number, number, number],
  gray: [107, 114, 128] as [number, number, number],
  light: [243, 244, 246] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  green: [22, 163, 74] as [number, number, number],
  red: [220, 38, 38] as [number, number, number],
  amber: [217, 119, 6] as [number, number, number],
};

function matchCountryWSI(location = ""): number {
  const loc = location.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const map: Record<string, string> = {
    tunisie: "tunisie", tunisia: "tunisie",
    maroc: "maroc", morocco: "maroc",
    algerie: "algerie", algeria: "algerie",
    egypte: "egypte", egypt: "egypte",
    france: "france", espagne: "espagne",
    italie: "italie", allemagne: "allemagne",
  };
  for (const [k, v] of Object.entries(map)) {
    if (loc.includes(k)) return wsiByCountry[v]?.wsi ?? 2;
  }
  return 2;
}

function wsiLabel(wsi: number): string {
  if (wsi >= 4.5) return "Extrême";
  if (wsi >= 3.5) return "Élevé";
  if (wsi >= 2.5) return "Moyen";
  return "Faible";
}

function addPageNumber(doc: jsPDF) {
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.gray);
    doc.text(
      `Page ${i} / ${pages}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 8,
      { align: "center" }
    );
    doc.text(
      "HydroScan — Rapport Empreinte Hydrique — Confidentiel",
      14,
      doc.internal.pageSize.height - 8
    );
  }
}

/* ── Main generator ── */
export function generateWaterReport(opts: ReportOptions): void {
  const { orgName, consumption, sites, reportType } = opts;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.width;
  const today = new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });

  const titleMap = {
    "water-footprint": "Rapport Empreinte Hydrique",
    "gri-303": "Rapport GRI 303 — Eau",
    "iso-14046": "Rapport ISO 14046 — Empreinte Eau",
  };
  const title = titleMap[reportType];

  /* ── Summary calculations ── */
  const totalVolume = consumption.reduce((s, r) => s + Number(r.volume_m3), 0);

  const siteMap = Object.fromEntries(sites.map((s) => [s.id, s]));

  const siteVolumes: Record<string, { name: string; location: string; volume: number; wsi: number }> = {};
  for (const r of consumption) {
    const site = r.site_id ? siteMap[r.site_id] : null;
    const key = site?.id ?? "__none__";
    if (!siteVolumes[key]) {
      siteVolumes[key] = {
        name: site?.name ?? "Site non précisé",
        location: site?.location ?? "",
        volume: 0,
        wsi: matchCountryWSI(site?.location ?? ""),
      };
    }
    siteVolumes[key].volume += Number(r.volume_m3);
  }

  const weightedFootprint = Object.values(siteVolumes).reduce(
    (s, sv) => s + sv.volume * (sv.wsi / 2),
    0
  );

  const sourceBreakdown: Record<string, number> = {};
  const usageBreakdown: Record<string, number> = {};
  for (const r of consumption) {
    sourceBreakdown[r.source] = (sourceBreakdown[r.source] || 0) + Number(r.volume_m3);
    usageBreakdown[r.usage] = (usageBreakdown[r.usage] || 0) + Number(r.volume_m3);
  }

  /* ════════════════════════════════════
     PAGE 1 — COVER
  ════════════════════════════════════ */
  // Header band
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, W, 60, "F");

  doc.setTextColor(...COLORS.white);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("HydroScan", 14, 22);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Plateforme d'empreinte hydrique", 14, 30);

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(title, 14, 50);

  // Organisation block
  doc.setTextColor(...COLORS.dark);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text(orgName, 14, 78);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.gray);
  doc.text(`Généré le ${today}`, 14, 86);
  doc.text(`Période : ${consumption.length ? consumption[consumption.length - 1].recorded_date + " → " + consumption[0].recorded_date : "N/A"}`, 14, 92);

  // Standard badge
  const badgeMap = {
    "water-footprint": "ISO 14046 | GRI 303 | WFN",
    "gri-303": "GRI 303 — Water and Effluents",
    "iso-14046": "ISO 14046:2014 — Water Footprint",
  };
  doc.setFillColor(...COLORS.light);
  doc.roundedRect(14, 100, W - 28, 14, 3, 3, "F");
  doc.setTextColor(...COLORS.primary);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(badgeMap[reportType], W / 2, 109, { align: "center" });

  // KPI boxes
  const kpis = [
    { label: "Eau bleue totale", value: `${totalVolume.toLocaleString("fr-FR")} m³`, sub: "Consommation directe" },
    { label: "Empreinte pondérée", value: `${Math.round(weightedFootprint).toLocaleString("fr-FR")} m³eq`, sub: "Volume × WSI" },
    { label: "Saisies", value: `${consumption.length}`, sub: "Entrées enregistrées" },
    { label: "Sites analysés", value: `${Object.keys(siteVolumes).length}`, sub: "Sites couverts" },
  ];

  const boxW = (W - 28 - 9) / 4;
  kpis.forEach((kpi, i) => {
    const x = 14 + i * (boxW + 3);
    doc.setFillColor(...COLORS.light);
    doc.roundedRect(x, 122, boxW, 28, 3, 3, "F");
    doc.setTextColor(...COLORS.primary);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text(kpi.value, x + boxW / 2, 133, { align: "center" });
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...COLORS.dark);
    doc.text(kpi.label, x + boxW / 2, 140, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.gray);
    doc.text(kpi.sub, x + boxW / 2, 145, { align: "center" });
  });

  // Disclaimer
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.gray);
  doc.setFont("helvetica", "italic");
  const disclaimer =
    "Ce rapport a été généré automatiquement par HydroScan sur la base des données saisies par l'organisation. " +
    "Les calculs s'appuient sur les facteurs WFN, Ecoinvent et les indices WSI Aqueduct/WRI.";
  const lines = doc.splitTextToSize(disclaimer, W - 28);
  doc.text(lines, 14, 165);

  /* ════════════════════════════════════
     PAGE 2 — RÉSUMÉ EXÉCUTIF
  ════════════════════════════════════ */
  doc.addPage();

  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, W, 12, "F");
  doc.setTextColor(...COLORS.white);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("RÉSUMÉ EXÉCUTIF", 14, 8.5);

  doc.setTextColor(...COLORS.dark);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Vue d'ensemble — Empreinte eau de l'organisation", 14, 24);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.gray);
  doc.text(
    "Ce résumé présente les indicateurs clés de performance hydrique calculés selon la méthodologie ISO 14046.",
    14, 31
  );

  // Summary table
  autoTable(doc, {
    startY: 38,
    head: [["Indicateur", "Valeur", "Unité", "Remarque"]],
    body: [
      ["Consommation eau bleue totale", totalVolume.toLocaleString("fr-FR"), "m³", "Toutes sources confondues"],
      ["Empreinte pondérée (WSI)", Math.round(weightedFootprint).toLocaleString("fr-FR"), "m³eq", "Volume × (WSI / 2)"],
      ["Nombre de saisies", consumption.length.toString(), "entrées", "Consommation directe"],
      ["Sites couverts", Object.keys(siteVolumes).length.toString(), "sites", ""],
      ["Principale source", Object.entries(sourceBreakdown).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—", "—", "Par volume"],
      ["Principal usage", Object.entries(usageBreakdown).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—", "—", "Par volume"],
    ],
    headStyles: { fillColor: COLORS.primary, textColor: COLORS.white, fontSize: 9, fontStyle: "bold" },
    bodyStyles: { fontSize: 9, textColor: COLORS.dark },
    alternateRowStyles: { fillColor: COLORS.light },
    margin: { left: 14, right: 14 },
  });

  // Source breakdown
  const afterSummary = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.dark);
  doc.text("Répartition par source d'eau", 14, afterSummary);

  autoTable(doc, {
    startY: afterSummary + 5,
    head: [["Source", "Volume (m³)", "Part (%)"]],
    body: Object.entries(sourceBreakdown)
      .sort((a, b) => b[1] - a[1])
      .map(([src, vol]) => [
        src,
        (vol as number).toLocaleString("fr-FR"),
        totalVolume > 0 ? `${((vol as number / totalVolume) * 100).toFixed(1)} %` : "—",
      ]),
    headStyles: { fillColor: COLORS.primary, textColor: COLORS.white, fontSize: 9 },
    bodyStyles: { fontSize: 9 },
    alternateRowStyles: { fillColor: COLORS.light },
    margin: { left: 14, right: 14 },
  });

  /* ════════════════════════════════════
     PAGE 3 — ANALYSE PAR SITE & WSI
  ════════════════════════════════════ */
  doc.addPage();

  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, W, 12, "F");
  doc.setTextColor(...COLORS.white);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("ANALYSE PAR SITE — STRESS HYDRIQUE", 14, 8.5);

  doc.setTextColor(...COLORS.dark);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Impact pondéré par le stress hydrique local", 14, 24);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.gray);
  doc.text(
    "L'indice WSI (Water Stress Index) pondère le volume consommé selon la rareté de l'eau dans chaque région (source : Aqueduct/WRI).",
    14, 31
  );

  const siteRows = Object.values(siteVolumes)
    .sort((a, b) => b.volume * b.wsi - a.volume * a.wsi)
    .map((sv) => [
      sv.name,
      sv.location || "—",
      sv.volume.toLocaleString("fr-FR"),
      sv.wsi.toString(),
      wsiLabel(sv.wsi),
      Math.round(sv.volume * (sv.wsi / 2)).toLocaleString("fr-FR"),
    ]);

  autoTable(doc, {
    startY: 38,
    head: [["Site", "Localisation", "Volume (m³)", "WSI", "Niveau", "Impact (m³eq)"]],
    body: siteRows.length ? siteRows : [["—", "—", "—", "—", "—", "—"]],
    headStyles: { fillColor: COLORS.primary, textColor: COLORS.white, fontSize: 9 },
    bodyStyles: { fontSize: 9, textColor: COLORS.dark },
    alternateRowStyles: { fillColor: COLORS.light },
    didParseCell: (data) => {
      if (data.column.index === 4 && data.section === "body") {
        const val = data.cell.text[0];
        if (val === "Extrême") data.cell.styles.textColor = COLORS.red;
        else if (val === "Élevé") data.cell.styles.textColor = COLORS.amber;
        else if (val === "Moyen") data.cell.styles.textColor = COLORS.amber;
        else data.cell.styles.textColor = COLORS.green;
      }
    },
    margin: { left: 14, right: 14 },
  });

  // WSI scale legend
  const afterSite = (doc as any).lastAutoTable.finalY + 8;
  doc.setFillColor(...COLORS.light);
  doc.roundedRect(14, afterSite, W - 28, 18, 2, 2, "F");
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.dark);
  doc.text("Échelle WSI :", 18, afterSite + 7);
  const legend = [
    { label: "< 1.5 Faible", color: COLORS.green },
    { label: "1.5–2.5 Modéré", color: COLORS.green },
    { label: "2.5–3.5 Moyen", color: COLORS.amber },
    { label: "3.5–4.5 Élevé", color: COLORS.amber },
    { label: "> 4.5 Extrême", color: COLORS.red },
  ];
  legend.forEach((l, i) => {
    doc.setTextColor(...l.color);
    doc.text(l.label, 52 + i * 32, afterSite + 7);
  });
  doc.setFontSize(7);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(...COLORS.gray);
  doc.text("Source : Aqueduct / WRI", 18, afterSite + 14);

  /* ════════════════════════════════════
     PAGE 4 — DÉTAIL DES SAISIES
  ════════════════════════════════════ */
  doc.addPage();

  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, W, 12, "F");
  doc.setTextColor(...COLORS.white);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("DÉTAIL DES SAISIES — CONSOMMATION DIRECTE", 14, 8.5);

  doc.setTextColor(...COLORS.dark);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Registre complet des consommations enregistrées", 14, 24);

  const detailRows = consumption.slice(0, 100).map((r) => {
    const site = r.site_id ? siteMap[r.site_id]?.name ?? "—" : "—";
    return [r.recorded_date, Number(r.volume_m3).toLocaleString("fr-FR"), r.source, r.usage, r.period, site];
  });

  autoTable(doc, {
    startY: 30,
    head: [["Date", "Volume (m³)", "Source", "Usage", "Période", "Site"]],
    body: detailRows.length ? detailRows : [["Aucune donnée", "", "", "", "", ""]],
    headStyles: { fillColor: COLORS.primary, textColor: COLORS.white, fontSize: 8 },
    bodyStyles: { fontSize: 8, textColor: COLORS.dark },
    alternateRowStyles: { fillColor: COLORS.light },
    margin: { left: 14, right: 14 },
    didDrawPage: () => {
      doc.setFillColor(...COLORS.primary);
      doc.rect(0, 0, W, 12, "F");
      doc.setTextColor(...COLORS.white);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("DÉTAIL DES SAISIES — CONSOMMATION DIRECTE", 14, 8.5);
    },
  });

  /* ════════════════════════════════════
     PAGE FINALE — MÉTHODOLOGIE
  ════════════════════════════════════ */
  doc.addPage();

  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, W, 12, "F");
  doc.setTextColor(...COLORS.white);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("MÉTHODOLOGIE & CONFORMITÉ", 14, 8.5);

  const sections = [
    {
      title: "Périmètre de l'évaluation",
      body: "Ce rapport couvre la consommation directe d'eau (eau bleue) de l'organisation, " +
        "conformément à la norme ISO 14046:2014. Le périmètre opérationnel inclut tous les sites " +
        "enregistrés dans HydroScan sur la période de référence.",
    },
    {
      title: "Calcul de l'empreinte eau bleue",
      body: "L'empreinte eau bleue est calculée par sommation directe des volumes consommés " +
        "(m³) déclarés par source et par usage. Chaque entrée est horodatée et associée à un site.",
    },
    {
      title: "Pondération par le stress hydrique (WSI)",
      body: "L'empreinte pondérée est obtenue en multipliant le volume de chaque site par son indice " +
        "de stress hydrique WSI (Water Stress Index) issu de la base de données Aqueduct du WRI. " +
        "Formule : Impact (m³eq) = Volume (m³) × (WSI / 2).",
    },
    {
      title: "Références normatives",
      body: "• ISO 14046:2014 — Empreinte eau : principes, exigences et lignes directrices\n" +
        "• GRI 303:2018 — Eau et effluents\n" +
        "• Water Footprint Network (WFN) — Facteurs par matière\n" +
        "• Aqueduct / WRI — Indices de stress hydrique par pays et région",
    },
    {
      title: "Limites et avertissements",
      body: "Ce rapport est généré automatiquement à partir des données saisies par l'utilisateur. " +
        "La fiabilité des résultats dépend de la qualité et de l'exhaustivité des données renseignées. " +
        "Il ne constitue pas une certification ISO ou GRI. Pour une certification officielle, " +
        "un audit tiers indépendant est requis.",
    },
  ];

  let y = 22;
  sections.forEach((sec) => {
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...COLORS.primary);
    doc.text(sec.title, 14, y);
    y += 5;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.dark);
    const wrapped = doc.splitTextToSize(sec.body, W - 28);
    doc.text(wrapped, 14, y);
    y += wrapped.length * 5 + 8;
  });

  // Footer band
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, doc.internal.pageSize.height - 18, W, 18, "F");
  doc.setTextColor(...COLORS.white);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("HydroScan — Plateforme d'empreinte hydrique pour l'Afrique — hydroscan.app", W / 2, doc.internal.pageSize.height - 10, { align: "center" });
  doc.text(`Rapport généré le ${today} pour ${orgName}`, W / 2, doc.internal.pageSize.height - 5, { align: "center" });

  /* ── Page numbers ── */
  addPageNumber(doc);

  /* ── Save ── */
  const filename = `HydroScan_${reportType}_${orgName.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}
