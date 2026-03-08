import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function PermissionsTab() {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Shield className="h-4 w-4" /> Permissions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Permission</th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">Administrateur</th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">Membre</th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">Lecteur</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: "Voir le tableau de bord", admin: true, member: true, viewer: true },
                { label: "Saisir des données de consommation", admin: true, member: true, viewer: false },
                { label: "Générer et exporter des rapports", admin: true, member: true, viewer: true },
                { label: "Modifier les paramètres de l'organisation", admin: true, member: false, viewer: false },
                { label: "Gérer les utilisateurs et rôles", admin: true, member: false, viewer: false },
                { label: "Gérer les sites", admin: true, member: false, viewer: false },
                { label: "Supprimer des données", admin: true, member: false, viewer: false },
              ].map((perm, i) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">{perm.label}</td>
                  <td className="px-4 py-3 text-center">{perm.admin ? "✅" : "❌"}</td>
                  <td className="px-4 py-3 text-center">{perm.member ? "✅" : "❌"}</td>
                  <td className="px-4 py-3 text-center">{perm.viewer ? "✅" : "❌"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Les permissions sont appliquées automatiquement via les politiques de sécurité (RLS) de la base de données.
        </p>
      </CardContent>
    </Card>
  );
}
