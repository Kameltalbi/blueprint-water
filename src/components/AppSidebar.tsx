import {
  LayoutDashboard,
  Droplets,
  MapPin,
  FileBarChart,
  Sprout,
  Building2,
  Settings,
  LogOut,
  FlaskConical,
  TrendingDown,
  ShieldAlert,
  Package,
  FileCheck,
} from "lucide-react";
import hydroscanLogoWhite from "@/assets/hydroscan-logo-white.png";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { useCountryMode } from "@/contexts/CountryMode";
import { useCurrency, type Currency } from "@/contexts/Currency";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
  SidebarSeparator,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { t } = useI18n();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { mode, setMode, isTunisia } = useCountryMode();
  const { currency, setCurrency } = useCurrency();

  const topItems = [
    { title: t("sidebar.dashboard"), url: "/dashboard", icon: LayoutDashboard },
  ];

  const measureItems = [
    { title: t("sidebar.dataEntry"), url: "/data-entry", icon: Droplets },
  ];

  const analysisItems = [
    { title: t("sidebar.stressMap"), url: "/stress-map", icon: MapPin },
    { title: t("sidebar.reportsExports"), url: "/reports", icon: FileBarChart },
    { title: t("sidebar.actionPlan"), url: "/action-plan", icon: Sprout },
  ];

  const tuniItems = [
    { title: "Pénalités ONAS", url: "/onas-penalties", icon: FlaskConical },
    { title: "Simulateur ROI", url: "/roi-simulator", icon: TrendingDown },
    { title: "Risques SONEDE", url: "/soned-risks", icon: ShieldAlert },
    { title: "Empreinte produit", url: "/product-footprint", icon: Package },
    { title: "Dossier financement", url: "/financing-template", icon: FileCheck },
  ];

  const settingsItems = [
    { title: t("sidebar.sitesLocation"), url: "/organization", icon: Building2 },
    { title: t("sidebar.settings"), url: "/settings", icon: Settings },
  ];

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" :
    path === "/dashboard" ? location.pathname === "/dashboard" :
    location.pathname.startsWith(path);

  const renderItems = (items: typeof topItems) => (
    <SidebarGroupContent>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.url}>
            <SidebarMenuButton asChild isActive={isActive(item.url)}>
              <NavLink to={item.url} end={item.url === "/" || item.url === "/dashboard"}>
                <item.icon className="h-4 w-4" />
                {!collapsed && <span>{item.title}</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroupContent>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-center">
          <img
            src={hydroscanLogoWhite}
            alt="HydroScan"
            className={collapsed ? "h-8 w-8 object-contain" : "h-16 w-auto object-contain"}
          />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>{renderItems(topItems)}</SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>{t("sidebar.measures")}</SidebarGroupLabel>
          {renderItems(measureItems)}
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>{t("sidebar.analyses")}</SidebarGroupLabel>
          {renderItems(analysisItems)}
        </SidebarGroup>

        <SidebarSeparator />

        {isTunisia && (
          <>
            <SidebarGroup>
              <SidebarGroupLabel>Outils Tunisie 🇹🇳</SidebarGroupLabel>
              {renderItems(tuniItems)}
            </SidebarGroup>
            <SidebarSeparator />
          </>
        )}


        <SidebarGroup>
          <SidebarGroupLabel>{t("sidebar.settingsSection")}</SidebarGroupLabel>
          {renderItems(settingsItems)}
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="space-y-2">
          {/* Country mode toggle */}
          {!collapsed && (
            <div className="flex rounded-lg border border-border overflow-hidden text-xs">
              <button
                className={`flex-1 py-1.5 flex items-center justify-center gap-1 transition-colors ${
                  mode === "tn"
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "bg-background text-muted-foreground hover:bg-muted"
                }`}
                onClick={() => setMode("tn")}
              >
                🇹🇳 Tunisie
              </button>
              <button
                className={`flex-1 py-1.5 flex items-center justify-center gap-1 transition-colors ${
                  mode === "int"
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "bg-background text-muted-foreground hover:bg-muted"
                }`}
                onClick={() => setMode("int")}
              >
                🌍 International
              </button>
            </div>
          )}
          {/* Currency selector */}
          {!collapsed && (
            <div className="flex rounded-lg border border-border overflow-hidden text-xs">
              {(["DT", "EUR", "USD"] as Currency[]).map((c) => (
                <button
                  key={c}
                  className={`flex-1 py-1.5 transition-colors ${
                    currency === c
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "bg-background text-muted-foreground hover:bg-muted"
                  }`}
                  onClick={() => setCurrency(c)}
                >
                  {c === "DT" ? "DT" : c === "EUR" ? "€ EUR" : "$ USD"}
                </button>
              ))}
            </div>
          )}
          {collapsed && (
            <button
              title={mode === "tn" ? "Mode Tunisie — cliquer pour International" : "Mode International — cliquer pour Tunisie"}
              className="w-full flex items-center justify-center text-lg py-1 rounded hover:bg-muted transition-colors"
              onClick={() => setMode(mode === "tn" ? "int" : "tn")}
            >
              {mode === "tn" ? "🇹🇳" : "🌍"}
            </button>
          )}
          <Button
            variant="ghost"
            size={collapsed ? "icon" : "default"}
            className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive"
            onClick={async () => { await signOut(); navigate("/login"); }}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && (t("sidebar.logout") || "Déconnexion")}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
