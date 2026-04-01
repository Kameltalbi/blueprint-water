import { Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import hydroscanLogo from "@/assets/logo_hydroscan.png";

export function LandingFooter() {
  const { lang } = useI18n();
  const t3 = (fr: string, en: string, ar: string) => lang === "fr" ? fr : lang === "ar" ? ar : en;

  return (
    <footer className="bg-foreground text-primary-foreground/50 py-12 px-[5%] flex justify-between items-center flex-wrap gap-6 text-xs">
      <Link to="/" className="flex items-center gap-2 no-underline">
        <img src={hydroscanLogo} alt="HydroScan" className="h-8 object-contain brightness-0 invert" />
      </Link>
      <div className="flex gap-6 flex-wrap">
        <a href="#" className="hover:text-primary-foreground transition-colors">{t3("Mentions légales", "Legal", "معلومات قانونية")}</a>
        <a href="#" className="hover:text-primary-foreground transition-colors">{t3("Confidentialité", "Privacy", "الخصوصية")}</a>
        <a href="#" className="hover:text-primary-foreground transition-colors">{t3("CGU", "Terms", "شروط الاستخدام")}</a>
        <Link to="/contact" className="hover:text-primary-foreground transition-colors">{t3("Contact", "Contact", "اتصل بنا")}</Link>
        <a href="#" className="hover:text-primary-foreground transition-colors">Blog</a>
        <a href="#" className="hover:text-primary-foreground transition-colors">API Docs</a>
      </div>
      <span>© 2026 HydroScan · ISO 14046</span>
    </footer>
  );
}
