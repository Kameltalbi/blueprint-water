import { useState } from "react";
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
import { Droplets, Calculator } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const sectors: Record<string, number> = {
  industrie: 1.8,
  agriculture: 2.5,
  agroalimentaire: 2.1,
  hotellerie: 1.4,
  services: 0.8,
};

export function WaterCalculator() {
  const { t } = useI18n();
  const [employees, setEmployees] = useState("");
  const [consumption, setConsumption] = useState("");
  const [sector, setSector] = useState("");
  const [result, setResult] = useState<null | {
    total: number;
    perEmployee: number;
    grade: string;
    gradeColor: string;
    savings: number;
  }>(null);

  const calculate = () => {
    const emp = parseInt(employees);
    const cons = parseInt(consumption);
    const multiplier = sectors[sector] || 1;
    if (!emp || !cons || !sector) return;

    const total = Math.round(cons * multiplier);
    const perEmp = Math.round(total / emp);
    let grade = "A";
    let gradeColor = "text-score-a";
    if (perEmp >= 350) { grade = "E"; gradeColor = "text-score-e"; }
    else if (perEmp >= 200) { grade = "D"; gradeColor = "text-score-d"; }
    else if (perEmp >= 100) { grade = "C"; gradeColor = "text-score-c"; }
    else if (perEmp >= 50) { grade = "B"; gradeColor = "text-score-b"; }

    setResult({ total, perEmployee: perEmp, grade, gradeColor, savings: Math.round(total * 0.2) });
  };

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-elevated md:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-primary/10 p-2.5">
          <Calculator className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">{t("calc.subtitle")}</h3>
          <p className="text-sm text-muted-foreground">{t("calc.label")}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label>{t("calc.employees")}</Label>
          <Input type="number" placeholder="ex: 120" value={employees} onChange={(e) => setEmployees(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>{t("calc.consumption")}</Label>
          <Input type="number" placeholder="ex: 15000" value={consumption} onChange={(e) => setConsumption(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>{t("calc.sector")}</Label>
          <Select value={sector} onValueChange={setSector}>
            <SelectTrigger>
              <SelectValue placeholder={t("calc.choose")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="industrie">{t("calc.sectorIndustrie")}</SelectItem>
              <SelectItem value="agriculture">{t("calc.sectorAgriculture")}</SelectItem>
              <SelectItem value="agroalimentaire">{t("calc.sectorAgro")}</SelectItem>
              <SelectItem value="hotellerie">{t("calc.sectorHotel")}</SelectItem>
              <SelectItem value="services">{t("calc.sectorServices")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button className="mt-5 gap-2" onClick={calculate}>
        <Droplets className="h-4 w-4" />
        {t("calc.button")}
      </Button>

      {result && (
        <div className="mt-6 grid gap-4 rounded-xl border bg-muted/30 p-5 sm:grid-cols-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">{t("calc.total")}</p>
            <p className="text-2xl font-bold">{result.total.toLocaleString("fr-FR")} m³</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">{t("calc.perEmployee")}</p>
            <p className="text-2xl font-bold">{result.perEmployee} m³</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">{t("calc.score")}</p>
            <p className={`text-3xl font-black ${result.gradeColor}`}>{result.grade}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">{t("calc.savings")}</p>
            <p className="text-2xl font-bold text-green-water">{result.savings.toLocaleString("fr-FR")} m³</p>
          </div>
        </div>
      )}
    </div>
  );
}
