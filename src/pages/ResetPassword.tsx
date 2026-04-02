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
  const t3 = (fr: string, en: string, ar: string) => lang === "fr" ? fr : lang === "ar" ? ar : en;
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
        title: t3("Mot de passe mis à jour", "Password updated", "تم تحديث كلمة المرور"),
        description: t3("Vous pouvez maintenant vous connecter.", "You can now log in.", "يمكنك الآن تسجيل الدخول."),
      });
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-block mb-2">
            <img src={hydroscanLogo} alt="HydroScan" className="h-12 mx-auto object-contain" />
          </Link>
          <h1 className="mt-4 font-display text-3xl font-bold text-foreground">
            {t3("Nouveau mot de passe", "New password", "كلمة مرور جديدة")}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 bg-card p-8 rounded-2xl border border-border shadow-sm">
          <div className="space-y-2">
            <Label htmlFor="password">{t3("Nouveau mot de passe", "New password", "كلمة مرور جديدة")}</Label>
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
            {t3("Mettre à jour", "Update password", "تحديث كلمة المرور")}
          </Button>
        </form>
      </div>
    </div>
  );
}
