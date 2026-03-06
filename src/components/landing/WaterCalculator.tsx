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

const sectors: Record<string, number> = {
  industrie: 1.8,
  agriculture: 2.5,
  agroalimentaire: 2.1,
  hotellerie: 1.4,
  services: 0.8,
};

export function WaterCalculator() {
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

    setResult({
      total,
      perEmployee: perEmp,
      grade,
      gradeColor,
      savings: Math.round(total * 0.2),
    });
  };

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-elevated md:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-primary/10 p-2.5">
          <Calculator className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">Estimez votre empreinte eau en 2 minutes</h3>
          <p className="text-sm text-muted-foreground">Calculateur simplifié</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label>Nombre d'employés</Label>
          <Input
            type="number"
            placeholder="ex: 120"
            value={employees}
            onChange={(e) => setEmployees(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Consommation eau annuelle (m³)</Label>
          <Input
            type="number"
            placeholder="ex: 15000"
            value={consumption}
            onChange={(e) => setConsumption(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Secteur d'activité</Label>
          <Select value={sector} onValueChange={setSector}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="industrie">Industrie</SelectItem>
              <SelectItem value="agriculture">Agriculture</SelectItem>
              <SelectItem value="agroalimentaire">Agroalimentaire</SelectItem>
              <SelectItem value="hotellerie">Hôtellerie</SelectItem>
              <SelectItem value="services">Services</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button className="mt-5 gap-2" onClick={calculate}>
        <Droplets className="h-4 w-4" />
        Estimer mon empreinte
      </Button>

      {result && (
        <div className="mt-6 grid gap-4 rounded-xl border bg-muted/30 p-5 sm:grid-cols-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Empreinte totale</p>
            <p className="text-2xl font-bold">{result.total.toLocaleString("fr-FR")} m³</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Par employé</p>
            <p className="text-2xl font-bold">{result.perEmployee} m³</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Score</p>
            <p className={`text-3xl font-black ${result.gradeColor}`}>{result.grade}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Économies possibles</p>
            <p className="text-2xl font-bold text-green-water">{result.savings.toLocaleString("fr-FR")} m³</p>
          </div>
        </div>
      )}
    </div>
  );
}
