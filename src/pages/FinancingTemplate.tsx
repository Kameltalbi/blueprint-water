import { useState } from "react";
import { PageMeta } from "@/components/PageMeta";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileCheck, Info, Copy, CheckCircle2, ExternalLink } from "lucide-react";

/* ── Financing instruments ── */
const INSTRUMENTS = [
  {
    id: "fodep",
    name: "FODEP",
    fullName: "Fonds de Dépollution (FODEP)",
    body: "Ministère de l'Environnement / ANPE",
    rate: "Subvention 20% + prêt BTS 3% max 8 ans",
    maxAmount: "500 000 DT",
    eligible: ["STEP interne", "Réduction rejets ONAS", "Équipements traitement eau"],
    docs: ["Rapport audit environnemental ANPE","Devis équipements (3 fournisseurs)","Rapport calcul charge polluante avant/après","Bilan eau derniers 3 ans","Extrait registre commerce"],
    url: "http://www.anpe.nat.tn",
  },
  {
    id: "berd",
    name: "BERD",
    fullName: "Banque Européenne pour la Reconstruction et le Développement",
    body: "BERD — Ligne MSME Tunisia",
    rate: "Prêt 4–6% / 10 ans via banque locale partenaire",
    maxAmount: "2 000 000 EUR",
    eligible: ["Efficacité ressources eau", "STEP + REUT industrielle", "Collecte eau pluie grande échelle", "Modernisation process hydro-intensifs"],
    docs: ["Étude faisabilité économique (ROI détaillé)","Empreinte eau actuelle certifiée ISO 14046","Plan d'investissement sur 5 ans","Comptes audités 3 derniers exercices","Lettre d'intention banque locale partenaire"],
    url: "https://www.ebrd.com/tunisia",
  },
  {
    id: "afd",
    name: "AFD",
    fullName: "Agence Française de Développement",
    body: "AFD Tunisie — Facilité SUNREF",
    rate: "Prêt bonifié 2–4% / 12 ans",
    maxAmount: "1 500 000 EUR",
    eligible: ["Investissements efficacité eau > 20% économie", "REUT industrielle", "Énergie liée eau (pompage solaire)"],
    docs: ["Diagnostic carbone + eau (double calcul)","Business plan avec projection économies","Certificat conformité ONAS / ANPE","États financiers certifiés 3 ans","Rapport empreinte eau HydroScan export PDF"],
    url: "https://www.afd.fr/fr/carte-des-projets/tunisie",
  },
  {
    id: "amen",
    name: "Amen Bank",
    fullName: "Amen Bank — Ligne Verte",
    body: "Amen Bank Tunisie",
    rate: "TMM + 1.5% — durée 7 ans",
    maxAmount: "300 000 DT",
    eligible: ["STEP compacte PME", "Citerne eau de pluie", "Recyclage eau process", "Équipements basse consommation eau"],
    docs: ["Devis équipements","Business plan simplifié","Relevés SONEDE / ONAS 12 derniers mois","Bilan N-1 certifié","Rapport HydroScan ROI simulator (export)"],
    url: "https://www.amenbank.com.tn",
  },
];

/* ── Template text generator ── */
function generateTemplate(form: Record<string, string>, instrument: typeof INSTRUMENTS[0]): string {
  const today = new Date().toLocaleDateString("fr-FR");
  return `DOSSIER DE DEMANDE DE FINANCEMENT
Instrument : ${instrument.fullName}
Date : ${today}

═══════════════════════════════════════════
1. IDENTIFICATION DE L'ENTREPRISE
═══════════════════════════════════════════
Raison sociale       : ${form.company || "_______________"}
Secteur d'activité   : ${form.sector || "_______________"}
Gouvernorat          : ${form.governorate || "_______________"}
Effectif             : ${form.employees || "___"} employés
Chiffre d'affaires   : ${form.revenue || "_______________"} DT/an
Contact              : ${form.contact || "_______________"}

═══════════════════════════════════════════
2. DESCRIPTION DU PROJET EAU
═══════════════════════════════════════════
Intitulé du projet   : ${form.projectName || "_______________"}
Type d'investissement: ${form.investType || "_______________"}
Montant total prévu  : ${form.investAmount || "_______________"} DT
Durée de mise en œuvre : ${form.duration || "___"} mois

═══════════════════════════════════════════
3. SITUATION HYDRIQUE ACTUELLE
═══════════════════════════════════════════
Consommation annuelle SONEDE   : ${form.sonede || "___"} m³/an
Consommation forage/puits      : ${form.forage || "___"} m³/an
Volume eaux usées rejetées     : ${form.wastewater || "___"} m³/an
Coût eau annuel total          : ${form.waterCost || "___"} DT/an
Pénalités ONAS annuelles       : ${form.onasPenalties || "___"} DT/an

Bassin versant                 : ${form.basin || "_______________"}
Facteur de stress hydrique WSI : ${form.wsi || "___"}/5

═══════════════════════════════════════════
4. OBJECTIFS ET BÉNÉFICES ATTENDUS
═══════════════════════════════════════════
Réduction consommation eau     : ${form.waterReduction || "___"} %
Volume eau recyclé / réutilisé : ${form.reutVolume || "___"} m³/an
Économies SONEDE annuelles     : ${form.sonoeSavings || "___"} DT/an
Réduction pénalités ONAS       : ${form.onasSavings || "___"} DT/an
Retour sur investissement      : ${form.payback || "___"} ans
VAN à 10 ans (taux 5%)         : ${form.npv || "___"} DT

═══════════════════════════════════════════
5. CONFORMITÉ RÉGLEMENTAIRE
═══════════════════════════════════════════
Norme applicable               : NT 106.002 (INNORPI)
Statut conformité ONAS         : ${form.onasStatus || "En cours de mise en conformité"}
Audit ANPE réalisé             : ${form.anpeAudit || "Oui / Non / En cours"}
Méthodologie empreinte eau     : ISO 14046 (WFN) — calculée via HydroScan

═══════════════════════════════════════════
6. PIÈCES JOINTES
═══════════════════════════════════════════
${instrument.docs.map((d, i) => `☐ [${i + 1}] ${d}`).join("\n")}

═══════════════════════════════════════════
7. DÉCLARATION
═══════════════════════════════════════════
Je soussigné(e), ${form.contact || "_______________"}, représentant légal de
${form.company || "_______________"}, certifie l'exactitude des informations
fournies dans ce dossier et m'engage à fournir tout document complémentaire
à la demande de ${instrument.body}.

Signature et cachet : ___________________________
Date : ${today}

─────────────────────────────────────────
Généré par HydroScan · hydroscan.io
Calcul empreinte eau ISO 14046 — Tunisie
─────────────────────────────────────────`;
}

export default function FinancingTemplate() {
  const [activeTab, setActiveTab] = useState("fodep");
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({
    company: "", sector: "", governorate: "", employees: "", revenue: "",
    contact: "", projectName: "", investType: "", investAmount: "", duration: "",
    sonede: "", forage: "", wastewater: "", waterCost: "", onasPenalties: "",
    basin: "", wsi: "", waterReduction: "", reutVolume: "", sonoeSavings: "",
    onasSavings: "", payback: "", npv: "", onasStatus: "", anpeAudit: "",
  });

  const instrument = INSTRUMENTS.find((i) => i.id === activeTab) ?? INSTRUMENTS[0];
  const text = generateTemplate(form, instrument);

  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function set(key: string) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  return (
    <>
      <PageMeta
        title="Dossier financement eau — HydroScan"
        description="Générez votre dossier de demande de financement (FODEP, BERD, AFD, Amen Bank) pour vos investissements eau en Tunisie."
      />
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">Dossier de financement eau</h1>
            <p className="text-muted-foreground text-sm">
              Générez votre dossier pour FODEP, BERD, AFD ou Amen Bank Ligne Verte
            </p>
          </div>
          <Badge variant="outline" className="self-start gap-1.5 text-xs border-primary/40 text-primary">
            <FileCheck className="h-3 w-3" /> Adapté aux bailleurs tunisiens
          </Badge>
        </div>

        <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary flex items-start gap-2">
          <Info className="h-4 w-4 shrink-0 mt-0.5" />
          <span>
            Ce générateur produit une trame de dossier. Complétez les données ci-dessous, copiez le texte, puis adaptez-le
            à votre situation avant soumission. Joignez votre rapport HydroScan exporté en PDF comme pièce justificative.
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* ── Left: form ── */}
          <div className="lg:col-span-2 space-y-5">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 h-8">
                {INSTRUMENTS.map((i) => (
                  <TabsTrigger key={i.id} value={i.id} className="text-xs">{i.name}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {/* Instrument info */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{instrument.fullName}</CardTitle>
                <CardDescription className="text-xs">{instrument.body}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-muted-foreground">Taux / durée</span><span className="font-medium text-right max-w-[180px]">{instrument.rate}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Montant max</span><span className="font-bold text-primary">{instrument.maxAmount}</span></div>
                <div className="pt-1">
                  <p className="text-muted-foreground mb-1">Projets éligibles :</p>
                  <ul className="space-y-0.5">
                    {instrument.eligible.map((e) => (
                      <li key={e} className="flex gap-1.5"><span className="text-green-600">✓</span>{e}</li>
                    ))}
                  </ul>
                </div>
                <a href={instrument.url} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline pt-1">
                  <ExternalLink className="h-3 w-3" /> Site officiel
                </a>
              </CardContent>
            </Card>

            {/* Form fields */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Données de votre entreprise</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-2 sm:grid-cols-2">
                  {[
                    { key: "company", label: "Raison sociale" },
                    { key: "sector", label: "Secteur d'activité" },
                    { key: "governorate", label: "Gouvernorat" },
                    { key: "employees", label: "Effectif (pers.)" },
                    { key: "revenue", label: "CA annuel (DT)" },
                    { key: "contact", label: "Représentant légal" },
                  ].map(({ key, label }) => (
                    <div key={key} className="space-y-1">
                      <Label className="text-xs">{label}</Label>
                      <Input className="h-8 text-xs" value={form[key]} onChange={set(key)} placeholder={label} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Projet & données eau</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-2 sm:grid-cols-2">
                  {[
                    { key: "projectName", label: "Intitulé projet" },
                    { key: "investType", label: "Type (STEP / REUT / Pluie)" },
                    { key: "investAmount", label: "Montant (DT)" },
                    { key: "duration", label: "Durée mise en œuvre (mois)" },
                    { key: "sonede", label: "Conso. SONEDE (m³/an)" },
                    { key: "forage", label: "Conso. forage (m³/an)" },
                    { key: "wastewater", label: "Eaux usées rejetées (m³/an)" },
                    { key: "waterCost", label: "Coût eau total (DT/an)" },
                    { key: "onasPenalties", label: "Pénalités ONAS (DT/an)" },
                    { key: "basin", label: "Bassin versant" },
                    { key: "wsi", label: "WSI (/5)" },
                    { key: "waterReduction", label: "Réduction eau visée (%)" },
                    { key: "reutVolume", label: "Volume REUT (m³/an)" },
                    { key: "sonoeSavings", label: "Éco. SONEDE (DT/an)" },
                    { key: "onasSavings", label: "Éco. ONAS (DT/an)" },
                    { key: "payback", label: "Retour invest. (ans)" },
                    { key: "npv", label: "VAN 10 ans (DT)" },
                  ].map(({ key, label }) => (
                    <div key={key} className="space-y-1">
                      <Label className="text-xs">{label}</Label>
                      <Input className="h-8 text-xs" value={form[key]} onChange={set(key)} placeholder={label} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ── Right: preview ── */}
          <div className="lg:col-span-3 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Aperçu du dossier — {instrument.name}</h2>
              <Button size="sm" variant="outline" className="gap-1.5 h-8 text-xs" onClick={handleCopy}>
                {copied ? <><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Copié !</> : <><Copy className="h-3.5 w-3.5" /> Copier</>}
              </Button>
            </div>

            <div className="rounded-lg border border-border bg-muted/30 p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap overflow-auto max-h-[75vh]">
              {text}
            </div>

            <Card className="border-muted">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Pièces à joindre — {instrument.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-1.5">
                  {instrument.docs.map((doc, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">{i + 1}</span>
                      <span className="text-muted-foreground">{doc}</span>
                    </li>
                  ))}
                </ol>
                <p className="text-xs text-muted-foreground mt-3 pt-2 border-t">
                  💡 Le rapport HydroScan (export PDF depuis <strong>Rapports</strong>) peut servir de justificatif pour les points
                  {" "}<em>empreinte eau certifiée</em> et <em>calcul ROI</em>.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
