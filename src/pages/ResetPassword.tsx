import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import hydroscanLogo from "@/assets/logo_hydroscan.png";

export default function ResetPassword() {
  const { lang } = useI18n();
  const fr = lang === "fr";
  const navigate = useNavigate();
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      toast({ variant: "destructive", title: "Erreur", description: error.message });
    } else {
      toast({
        title: fr ? "Mot de passe mis à jour" : "Password updated",
        description: fr ? "Vous pouvez maintenant vous connecter." : "You can now log in.",
      });
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 font-display text-2xl font-extrabold text-foreground mb-2">
            <div className="w-10 h-10 rounded-xl gradient-water flex items-center justify-center text-lg">💧</div>
            Hydro<em className="not-italic text-primary">Scan</em>
          </Link>
          <h1 className="mt-4 font-display text-3xl font-bold text-foreground">
            {fr ? "Nouveau mot de passe" : "New password"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 bg-card p-8 rounded-2xl border border-border shadow-sm">
          <div className="space-y-2">
            <Label htmlFor="password">{fr ? "Nouveau mot de passe" : "New password"}</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <Button type="submit" className="w-full gradient-water text-primary-foreground" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {fr ? "Mettre à jour" : "Update password"}
          </Button>
        </form>
      </div>
    </div>
  );
}
