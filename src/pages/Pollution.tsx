import { PageMeta } from "@/components/PageMeta";
import { useI18n } from "@/lib/i18n";
import { FlaskConical, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Pollution() {
  const { t } = useI18n();

  return (
    <>
      <PageMeta title="Sources de Pollution — HydroScan" description="Gérez vos rejets d'eaux usées pour le calcul de l'eau grise" />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t("pollution.title")}</h1>
            <p className="text-muted-foreground">{t("pollution.subtitle")}</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            {t("pollution.add")}
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>{t("pollution.greyWater")}</CardDescription>
              <CardTitle className="text-2xl">— m³</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{t("pollution.noData")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>{t("pollution.sources")}</CardDescription>
              <CardTitle className="text-2xl">0</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{t("pollution.noData")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>{t("pollution.compliance")}</CardDescription>
              <CardTitle className="text-2xl">—</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{t("pollution.noData")}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="flex flex-col items-center justify-center py-16">
          <FlaskConical className="h-12 w-12 text-muted-foreground/40 mb-4" />
          <h3 className="font-semibold text-lg mb-1">{t("pollution.emptyTitle")}</h3>
          <p className="text-muted-foreground text-sm text-center max-w-md mb-4">
            {t("pollution.emptyDesc")}
          </p>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            {t("pollution.add")}
          </Button>
        </Card>
      </div>
    </>
  );
}
