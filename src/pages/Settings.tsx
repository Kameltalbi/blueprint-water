import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageMeta } from "@/components/PageMeta";
import { User, Building2, Users, Shield, CreditCard, Code2 } from "lucide-react";
import ProfileTab from "@/components/settings/ProfileTab";
import OrganizationTab from "@/components/settings/OrganizationTab";
import MembersTab from "@/components/settings/MembersTab";
import PermissionsTab from "@/components/settings/PermissionsTab";
import BillingTab from "@/components/settings/BillingTab";
import ApiTab from "@/components/settings/ApiTab";

export default function Settings() {
  return (
    <div className="space-y-6">
      <PageMeta title="Paramètres — HydroScan" description="Gérez votre profil, votre organisation et les accès de votre équipe." />
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground">Gérez votre profil, votre organisation et vos préférences</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="w-full justify-start flex-wrap">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" /> Profil
          </TabsTrigger>
          <TabsTrigger value="organization" className="gap-2">
            <Building2 className="h-4 w-4" /> Organisation
          </TabsTrigger>
          <TabsTrigger value="members" className="gap-2">
            <Users className="h-4 w-4" /> Équipe
          </TabsTrigger>
          <TabsTrigger value="permissions" className="gap-2">
            <Shield className="h-4 w-4" /> Permissions
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-2">
            <CreditCard className="h-4 w-4" /> Abonnement
          </TabsTrigger>
          <TabsTrigger value="api" className="gap-2">
            <Code2 className="h-4 w-4" /> API & Compteurs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileTab />
        </TabsContent>
        <TabsContent value="organization">
          <OrganizationTab />
        </TabsContent>
        <TabsContent value="members">
          <MembersTab />
        </TabsContent>
        <TabsContent value="permissions">
          <PermissionsTab />
        </TabsContent>
        <TabsContent value="billing">
          <BillingTab />
        </TabsContent>
        <TabsContent value="api">
          <ApiTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
