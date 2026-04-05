import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Code2, RefreshCw, Copy, CheckCircle2, Wifi, WifiOff } from "lucide-react";
import { toast } from "sonner";

const MOCK_KEY = "hs_live_sk_TN_b3f9a12d44e78c01f5627a8b";

const CONNECTED_METERS = [
  { id: "CTR-001", name: "Compteur principal SONEDE", status: "online", lastSync: "il y a 2 min", m3Today: 12.4 },
  { id: "CTR-002", name: "Forage puits #1", status: "online", lastSync: "il y a 5 min", m3Today: 4.1 },
  { id: "CTR-003", name: "Compteur usine B", status: "offline", lastSync: "il y a 3 h", m3Today: 0 },
];

const WEBHOOK_EVENTS = [
  { event: "consumption.recorded", desc: "Nouvelle saisie de consommation" },
  { event: "alert.threshold", desc: "Dépassement d'un seuil d'alerte" },
  { event: "report.generated", desc: "Rapport PDF généré" },
];

export default function ApiTab() {
  const [copied, setCopied] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [showKey, setShowKey] = useState(false);

  function copyKey() {
    navigator.clipboard.writeText(MOCK_KEY);
    setCopied(true);
    toast.success("Clé API copiée");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6 pt-4">
      {/* API Key */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Code2 className="h-4 w-4 text-primary" /> Clé API
          </CardTitle>
          <CardDescription>
            Utilisez cette clé pour intégrer HydroScan à vos systèmes (SCADA, ERP, IoT).
            Ne la partagez pas — elle donne accès à vos données.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              readOnly
              value={showKey ? MOCK_KEY : "hs_live_sk_TN_••••••••••••••••••••••••"}
              className="font-mono text-xs"
            />
            <Button variant="outline" size="icon" onClick={() => setShowKey((s) => !s)} title="Afficher/masquer">
              {showKey ? "🙈" : "👁"}
            </Button>
            <Button variant="outline" size="icon" onClick={copyKey} title="Copier">
              {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <Button variant="outline" size="sm" className="gap-2 text-destructive hover:text-destructive">
            <RefreshCw className="h-3.5 w-3.5" /> Régénérer la clé (révoque l'ancienne)
          </Button>
          <div className="rounded-lg bg-muted/50 p-3 text-xs space-y-1 font-mono">
            <p className="text-muted-foreground"># Exemple d'appel API</p>
            <p>curl https://api.hydroscan.io/v1/consumption \</p>
            <p className="pl-4">-H "Authorization: Bearer {showKey ? MOCK_KEY : "hs_live_sk_..."}" \</p>
            <p className="pl-4">-d '{"{"}"volume_m3": 14.5, "source": "SONEDE"{"}"}'</p>
          </div>
        </CardContent>
      </Card>

      {/* Connected meters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Wifi className="h-4 w-4 text-primary" /> Compteurs connectés
          </CardTitle>
          <CardDescription>Intégrez vos compteurs IoT pour une saisie automatique en temps réel.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {CONNECTED_METERS.map((m) => (
            <div key={m.id} className="flex items-center justify-between rounded-lg border px-3 py-2.5">
              <div className="flex items-center gap-3">
                {m.status === "online"
                  ? <Wifi className="h-4 w-4 text-emerald-500" />
                  : <WifiOff className="h-4 w-4 text-muted-foreground" />}
                <div>
                  <p className="text-sm font-medium">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.id} · Sync {m.lastSync}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant={m.status === "online" ? "outline" : "secondary"} className={`text-xs ${m.status === "online" ? "text-emerald-600 border-emerald-200" : ""}`}>
                  {m.status === "online" ? "En ligne" : "Hors ligne"}
                </Badge>
                <p className="text-xs text-muted-foreground mt-0.5">{m.m3Today} m³ aujourd'hui</p>
              </div>
            </div>
          ))}
          <Button variant="outline" size="sm" className="w-full gap-2">
            + Connecter un compteur
          </Button>
        </CardContent>
      </Card>

      {/* Webhooks */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-primary" /> Webhooks
          </CardTitle>
          <CardDescription>Recevez des notifications HTTP sur votre système lors d'événements HydroScan.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs">URL de votre endpoint</Label>
            <div className="flex gap-2">
              <Input
                placeholder="https://votre-erp.com/webhooks/hydroscan"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="text-sm"
              />
              <Button size="sm" disabled={!webhookUrl} onClick={() => toast.success("Webhook enregistré")}>
                Sauvegarder
              </Button>
            </div>
          </div>
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Événements disponibles</p>
            {WEBHOOK_EVENTS.map((e) => (
              <div key={e.event} className="flex items-center justify-between text-xs border rounded px-3 py-2">
                <span className="font-mono text-primary">{e.event}</span>
                <span className="text-muted-foreground">{e.desc}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
