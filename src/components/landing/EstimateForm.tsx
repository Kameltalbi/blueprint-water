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
  const t3 = (fr: string, en: string, ar: string) => lang === "fr" ? fr : lang === "ar" ? ar : en;
  const [sector, setSector] = useState("");

  const handleSubmit = () => {
    toast.success(t3("Demande envoyée ! Nous vous recontacterons rapidement.", "Request sent! We'll get back to you shortly.", "تم إرسال طلبك! سنتواصل معك قريبًا."));
  };

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border bg-card p-6 shadow-elevated md:p-8">
      <h3 className="text-center text-lg font-semibold">{t("pricing.estimate.title")}</h3>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label>{t("pricing.estimate.sector")}</Label>
          <Select value={sector} onValueChange={setSector}>
            <SelectTrigger>
              <SelectValue placeholder={t3("Choisir...", "Choose...", "اختر...")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="industrie">{t3("Industrie", "Industry", "صناعة")}</SelectItem>
              <SelectItem value="agriculture">{t3("Agriculture", "Agriculture", "زراعة")}</SelectItem>
              <SelectItem value="agroalimentaire">{t3("Agroalimentaire", "Food Processing", "صناعة غذائية")}</SelectItem>
              <SelectItem value="hotellerie">{t3("Hôtellerie", "Hospitality", "ضيافة")}</SelectItem>
              <SelectItem value="services">{t3("Services", "Services", "خدمات")}</SelectItem>
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
