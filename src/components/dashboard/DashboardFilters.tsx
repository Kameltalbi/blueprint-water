import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download, Filter } from "lucide-react";
import { mockSites } from "@/lib/mock-data";

interface DashboardFiltersProps {
  site: string;
  setSite: (v: string) => void;
  period: string;
  setPeriod: (v: string) => void;
}

const periods = [
  { value: "2024", label: "2024" },
  { value: "2023", label: "2023" },
  { value: "q4-2024", label: "T4 2024" },
  { value: "q3-2024", label: "T3 2024" },
];

export function DashboardFilters({ site, setSite, period, setPeriod }: DashboardFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={site} onValueChange={setSite}>
          <SelectTrigger className="h-9 w-[160px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {mockSites.map((s) => (
              <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Select value={period} onValueChange={setPeriod}>
        <SelectTrigger className="h-9 w-[120px] text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {periods.map((p) => (
            <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button variant="outline" size="sm" className="ml-auto h-9 text-xs gap-1.5">
        <Download className="h-3.5 w-3.5" />
        Export PDF
      </Button>
    </div>
  );
}
