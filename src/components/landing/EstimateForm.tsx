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
import { Send } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";

export function EstimateForm() {
  const { t, lang } = useI18n();
  const fr = lang === "fr";
  const [sector, setSector] = useState("");

  const handleSubmit = () => {
    toast.success(fr ? "Demande envoyée ! Nous vous recontacterons rapidement." : "Request sent! We'll get back to you shortly.");
  };

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border bg-card p-6 shadow-elevated md:p-8">
      <h3 className="text-center text-lg font-semibold">{t("pricing.estimate.title")}</h3>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label>{t("pricing.estimate.sector")}</Label>
          <Select value={sector} onValueChange={setSector}>
            <SelectTrigger>
              <SelectValue placeholder={fr ? "Choisir..." : "Choose..."} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="industrie">{fr ? "Industrie" : "Industry"}</SelectItem>
              <SelectItem value="agriculture">{fr ? "Agriculture" : "Agriculture"}</SelectItem>
              <SelectItem value="agroalimentaire">{fr ? "Agroalimentaire" : "Food Processing"}</SelectItem>
              <SelectItem value="hotellerie">{fr ? "Hôtellerie" : "Hospitality"}</SelectItem>
              <SelectItem value="services">{fr ? "Services" : "Services"}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>{t("pricing.estimate.sites")}</Label>
          <Input type="number" placeholder="ex: 3" />
        </div>
        <div className="space-y-2">
          <Label>{t("pricing.estimate.employees")}</Label>
          <Input type="number" placeholder="ex: 120" />
        </div>
      </div>
      <div className="mt-5 text-center">
        <Button className="gap-2" onClick={handleSubmit}>
          <Send className="h-4 w-4" />
          {t("pricing.estimate.cta")}
        </Button>
      </div>
    </div>
  );
}
