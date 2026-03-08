import { Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import hydroscanLogo from "@/assets/logo_hydroscan.png";

export function LandingFooter() {
  const { lang } = useI18n();
  const fr = lang === "fr";

  return (
    <footer className="bg-foreground text-primary-foreground/50 py-12 px-[5%] flex justify-between items-center flex-wrap gap-6 text-xs">
      <Link to="/" className="flex items-center gap-2 no-underline">
        <img src={hydroscanLogo} alt="HydroScan" className="h-8 object-contain brightness-0 invert" />
      </Link>
      <div className="flex gap-6 flex-wrap">
        <a href="#" className="hover:text-primary-foreground transition-colors">{fr ? "Mentions légales" : "Legal"}</a>
        <a href="#" className="hover:text-primary-foreground transition-colors">{fr ? "Confidentialité" : "Privacy"}</a>
        <a href="#" className="hover:text-primary-foreground transition-colors">CGU</a>
        <a href="#" className="hover:text-primary-foreground transition-colors">Contact</a>
        <a href="#" className="hover:text-primary-foreground transition-colors">Blog</a>
        <a href="#" className="hover:text-primary-foreground transition-colors">API Docs</a>
      </div>
      <span>© 2026 HydroScan · ISO 14046</span>
    </footer>
  );
}
