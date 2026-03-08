import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function Register() {
  const { lang } = useI18n();
  const fr = lang === "fr";
  const navigate = useNavigate();
  const { toast } = useToast();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: window.location.origin,
      },
    });
    setLoading(false);

    if (error) {
      toast({
        variant: "destructive",
        title: fr ? "Erreur d'inscription" : "Signup error",
        description: error.message,
      });
    } else {
      toast({
        title: fr ? "Compte créé !" : "Account created!",
        description: fr
          ? "Vérifiez votre email pour confirmer votre compte."
          : "Check your email to confirm your account.",
      });
      navigate("/login");
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
            {fr ? "Créer un compte" : "Create account"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {fr ? "Commencez à piloter votre empreinte eau" : "Start managing your water footprint"}
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5 bg-card p-8 rounded-2xl border border-border shadow-sm">
          <div className="space-y-2">
            <Label htmlFor="fullName">{fr ? "Nom complet" : "Full name"}</Label>
            <Input
              id="fullName"
              placeholder={fr ? "Jean Dupont" : "John Doe"}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
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
              minLength={6}
            />
          </div>
          <Button type="submit" className="w-full gradient-water text-primary-foreground" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {fr ? "Créer mon compte" : "Create account"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {fr ? "Déjà un compte ?" : "Already have an account?"}{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            {fr ? "Se connecter" : "Log in"}
          </Link>
        </p>
      </div>
    </div>
  );
}
