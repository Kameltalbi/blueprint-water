import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export function LangToggle() {
  const { lang, setLang } = useI18n();

  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-1.5 text-xs font-medium"
      onClick={() => setLang(lang === "fr" ? "en" : "fr")}
    >
      <Globe className="h-3.5 w-3.5" />
      {lang === "fr" ? "EN" : "FR"}
    </Button>
  );
}
