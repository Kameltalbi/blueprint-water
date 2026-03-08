import { PageMeta } from "@/components/PageMeta";
import { useI18n } from "@/lib/i18n";
import { Package, Upload, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SupplyChain() {
  const { t } = useI18n();

  return (
    <>
      <PageMeta title="Approvisionnements — HydroScan" description="Gérez l'eau virtuelle de votre chaîne d'approvisionnement" />
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
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              {t("supply.add")}
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>{t("supply.virtualWater")}</CardDescription>
              <CardTitle className="text-2xl">— m³</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{t("supply.noData")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>{t("supply.materials")}</CardDescription>
              <CardTitle className="text-2xl">0</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{t("supply.noData")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>{t("supply.suppliers")}</CardDescription>
              <CardTitle className="text-2xl">0</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{t("supply.noData")}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="flex flex-col items-center justify-center py-16">
          <Package className="h-12 w-12 text-muted-foreground/40 mb-4" />
          <h3 className="font-semibold text-lg mb-1">{t("supply.emptyTitle")}</h3>
          <p className="text-muted-foreground text-sm text-center max-w-md mb-4">
            {t("supply.emptyDesc")}
          </p>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            {t("supply.add")}
          </Button>
        </Card>
      </div>
    </>
  );
}
