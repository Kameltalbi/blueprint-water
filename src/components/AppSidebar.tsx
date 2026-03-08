import {
  LayoutDashboard,
  Droplets,
  Package,
  FlaskConical,
  MapPin,
  FileBarChart,
  Sprout,
  Building2,
  Settings,
  LogOut,
  Home,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { LangToggle } from "@/components/LangToggle";
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

  const topItems = [
    { title: t("sidebar.home"), url: "/", icon: Home },
    { title: t("sidebar.dashboard"), url: "/dashboard", icon: LayoutDashboard },
  ];

  const measureItems = [
    { title: t("sidebar.directConsumption"), url: "/data-entry", icon: Droplets },
    { title: t("sidebar.supplyChain"), url: "/supply-chain", icon: Package },
    { title: t("sidebar.discharges"), url: "/pollution", icon: FlaskConical },
  ];

  const analysisItems = [
    { title: t("sidebar.stressMap"), url: "/stress-map", icon: MapPin },
    { title: t("sidebar.reportsExports"), url: "/reports", icon: FileBarChart },
    { title: t("sidebar.actionPlan"), url: "/action-plan", icon: Sprout },
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
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg gradient-water">
            <Droplets className="h-4 w-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold tracking-tight text-sidebar-primary-foreground">
              HydroScan
            </span>
          )}
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

        <SidebarGroup>
          <SidebarGroupLabel>{t("sidebar.settingsSection")}</SidebarGroupLabel>
          {renderItems(settingsItems)}
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="space-y-2">
          {!collapsed && (
            <>
              <div className="rounded-lg bg-sidebar-accent p-3">
                <p className="text-xs text-sidebar-foreground/70">{t("sidebar.plan")}</p>
                <p className="text-sm font-medium text-sidebar-accent-foreground">{t("sidebar.planDesc")}</p>
              </div>
              <LangToggle />
            </>
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
