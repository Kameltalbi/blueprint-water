import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

const CYCLE: Record<string, "fr" | "en" | "ar"> = { fr: "en", en: "ar", ar: "fr" };
const LABEL: Record<string, string> = { fr: "EN", en: "AR", ar: "FR" };

export function LangToggle() {
  const { lang, setLang } = useI18n();

  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-1.5 text-xs font-medium"
      onClick={() => setLang(CYCLE[lang])}
    >
      <Globe className="h-3.5 w-3.5" />
      {LABEL[lang]}
    </Button>
  );
}
