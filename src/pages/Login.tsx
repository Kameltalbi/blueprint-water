import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Droplets, Loader2 } from "lucide-react";
import { PageMeta } from "@/components/PageMeta";

export default function Login() {
  const { lang } = useI18n();
  const fr = lang === "fr";
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || "/dashboard";
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      toast({
        variant: "destructive",
        title: fr ? "Erreur de connexion" : "Login error",
        description: error.message,
      });
    } else {
      navigate(from, { replace: true });
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
            {fr ? "Connexion" : "Login"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {fr ? "Accédez à votre tableau de bord" : "Access your dashboard"}
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5 bg-card p-8 rounded-2xl border border-border shadow-sm">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="nom@entreprise.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{fr ? "Mot de passe" : "Password"}</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full gradient-water text-primary-foreground" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {fr ? "Se connecter" : "Log in"}
          </Button>
        </form>

        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            <Link to="/forgot-password" className="font-semibold text-primary hover:underline">
              {fr ? "Mot de passe oublié ?" : "Forgot password?"}
            </Link>
          </p>
          <p className="text-sm text-muted-foreground">
            {fr ? "Pas encore de compte ?" : "Don't have an account?"}{" "}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              {fr ? "Créer un compte" : "Sign up"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
