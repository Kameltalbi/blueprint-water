import { PageMeta } from "@/components/PageMeta";
import { useI18n } from "@/lib/i18n";
import { Package, Upload, Plus, Loader2, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";

interface SupplyEntry {
  id: number;
  material: string;
  supplier: string;
  country: string;
  quantity: number;
  unit: string;
  waterFactor: number;
}

// Water footprint factors (m³/ton) for common materials
const materialFactors: Record<string, number> = {
  "Coton": 10000,
  "Cuir": 17000,
  "Blé": 1800,
  "Sucre": 1500,
  "Olives / Huile d'olive": 14500,
  "Phosphate": 400,
  "Acier": 300,
  "Papier": 2000,
  "Polyester": 500,
  "Ciment": 200,
  "Autre": 1000,
};

export default function SupplyChain() {
  const { t } = useI18n();
  const [entries, setEntries] = useState<SupplyEntry[]>([]);
  const [material, setMaterial] = useState("");
  const [supplier, setSupplier] = useState("");
  const [country, setCountry] = useState("");
  const [quantity, setQuantity] = useState("");
  const [showForm, setShowForm] = useState(false);

  const addEntry = () => {
    if (!material || !quantity) {
      toast.error("Remplissez le matériau et la quantité");
      return;
    }
    const factor = materialFactors[material] || 1000;
    const qty = parseFloat(quantity);
    setEntries([...entries, {
      id: Date.now(),
      material,
      supplier: supplier || "—",
      country: country || "—",
      quantity: qty,
      unit: "tonnes",
      waterFactor: factor,
    }]);
    setMaterial("");
    setSupplier("");
    setCountry("");
    setQuantity("");
    toast.success("Entrée ajoutée");
  };

  const removeEntry = (id: number) => {
    setEntries(entries.filter((e) => e.id !== id));
  };

  const totalVirtualWater = entries.reduce((s, e) => s + (e.quantity * e.waterFactor), 0);
  const uniqueMaterials = new Set(entries.map((e) => e.material)).size;
  const uniqueSuppliers = new Set(entries.filter((e) => e.supplier !== "—").map((e) => e.supplier)).size;

  return (
    <>
      <PageMeta title="Chaîne Logistique — HydroScan" description="Gérez l'eau virtuelle de votre chaîne d'approvisionnement" />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t("supply.title")}</h1>
            <p className="text-muted-foreground">{t("supply.subtitle")}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Upload className="h-4 w-4" />
              {t("supply.import")}
            </Button>
            <Button className="gap-2" onClick={() => setShowForm(!showForm)}>
              <Plus className="h-4 w-4" />
              {t("supply.add")}
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>{t("supply.virtualWater")}</CardDescription>
              <CardTitle className="text-2xl">
                {totalVirtualWater > 0 ? `${(totalVirtualWater / 1000).toFixed(1)}k m³` : "— m³"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {totalVirtualWater > 0 ? "Eau virtuelle totale estimée" : t("supply.noData")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>{t("supply.materials")}</CardDescription>
              <CardTitle className="text-2xl">{uniqueMaterials}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{entries.length} entrée(s)</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>{t("supply.suppliers")}</CardDescription>
              <CardTitle className="text-2xl">{uniqueSuppliers}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">fournisseurs uniques</p>
            </CardContent>
          </Card>
        </div>

        {showForm && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base">Ajouter un approvisionnement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <Label>Matériau *</Label>
                  <Select value={material} onValueChange={setMaterial}>
                    <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                    <SelectContent>
                      {Object.keys(materialFactors).map((m) => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Quantité (tonnes) *</Label>
                  <Input type="number" placeholder="ex: 50" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Fournisseur</Label>
                  <Input placeholder="ex: SARL XYZ" value={supplier} onChange={(e) => setSupplier(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Pays d'origine</Label>
                  <Input placeholder="ex: Tunisie" value={country} onChange={(e) => setCountry(e.target.value)} />
                </div>
              </div>
              {material && (
                <p className="text-xs text-muted-foreground">
                  Facteur eau virtuelle : {(materialFactors[material] || 1000).toLocaleString("fr-FR")} m³/tonne (source: Water Footprint Network)
                </p>
              )}
              <Button onClick={addEntry} className="gap-2">
                <Plus className="h-4 w-4" />
                Ajouter
              </Button>
            </CardContent>
          </Card>
        )}

        {entries.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-16">
            <Package className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <h3 className="font-semibold text-lg mb-1">{t("supply.emptyTitle")}</h3>
            <p className="text-muted-foreground text-sm text-center max-w-md mb-4">
              {t("supply.emptyDesc")}
            </p>
            <Button className="gap-2" onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4" />
              {t("supply.add")}
            </Button>
          </Card>
        ) : (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base">Approvisionnements ({entries.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Matériau</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Quantité</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Fournisseur</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Pays</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Eau virtuelle</th>
                      <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((e) => (
                      <tr key={e.id} className="border-b last:border-0">
                        <td className="px-4 py-3 font-medium">{e.material}</td>
                        <td className="px-4 py-3">{e.quantity} t</td>
                        <td className="px-4 py-3 text-muted-foreground">{e.supplier}</td>
                        <td className="px-4 py-3 text-muted-foreground">{e.country}</td>
                        <td className="px-4 py-3 font-medium text-primary">{(e.quantity * e.waterFactor).toLocaleString("fr-FR")} m³</td>
                        <td className="px-4 py-3 text-right">
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeEntry(e.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
