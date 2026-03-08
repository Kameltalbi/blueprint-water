import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import hydroscanLogoWhite from "@/assets/hydroscan-logo-white.png";

export default function Register() {
  const { lang } = useI18n();
  const fr = lang === "fr";
  const navigate = useNavigate();
  const { toast } = useToast();

  // User fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Organization fields
  const [orgName, setOrgName] = useState("");
  const [orgAddress, setOrgAddress] = useState("");
  const [orgEmail, setOrgEmail] = useState("");
  const [orgPhone, setOrgPhone] = useState("");

  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!orgName.trim() || !orgAddress.trim() || !orgEmail.trim() || !orgPhone.trim()) {
      toast({
        variant: "destructive",
        title: fr ? "Champs requis" : "Required fields",
        description: fr
          ? "Veuillez remplir tous les champs de l'organisation."
          : "Please fill in all organization fields.",
      });
      return;
    }

    setLoading(true);

    // 1. Create the auth user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: window.location.origin,
      },
    });

    if (signUpError) {
      setLoading(false);
      toast({
        variant: "destructive",
        title: fr ? "Erreur d'inscription" : "Signup error",
        description: signUpError.message,
      });
      return;
    }

    const userId = signUpData.user?.id;

    if (userId) {
      // 2. Create org + admin role via security definer function
      const { error: orgError } = await supabase.rpc("create_organization_with_admin", {
        _user_id: userId,
        _org_name: orgName.trim(),
        _org_address: orgAddress.trim(),
        _org_email: orgEmail.trim(),
        _org_phone: orgPhone.trim(),
      });

      if (orgError) {
        console.error("Org creation error:", orgError);
        // Don't block signup, user can be linked later
      }
    }

    setLoading(false);
    toast({
      title: fr ? "Compte créé !" : "Account created!",
      description: fr
        ? "Vérifiez votre email pour confirmer votre compte."
        : "Check your email to confirm your account.",
    });
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center">
          <Link to="/" className="inline-block mb-4">
            <img src={hydroscanLogoWhite} alt="HydroScan" className="h-14 mx-auto dark:invert-0 invert" />
          </Link>
          <h1 className="font-display text-3xl font-bold text-foreground">
            {fr ? "Créer un compte" : "Create account"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {fr ? "Commencez à piloter votre empreinte eau" : "Start managing your water footprint"}
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6 bg-card p-8 rounded-2xl border border-border shadow-sm">
          {/* Informations personnelles */}
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
              {fr ? "Informations personnelles" : "Personal information"}
            </h2>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="fullName">{fr ? "Nom complet" : "Full name"} *</Label>
                <Input
                  id="fullName"
                  placeholder={fr ? "Jean Dupont" : "John Doe"}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{fr ? "Email personnel" : "Personal email"} *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nom@entreprise.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  maxLength={255}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{fr ? "Mot de passe" : "Password"} *</Label>
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
            </div>
          </div>

          {/* Organisation */}
          <div className="border-t border-border pt-5">
            <h2 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
              {fr ? "Organisation" : "Organization"}
            </h2>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="orgName">{fr ? "Nom de l'organisation" : "Organization name"} *</Label>
                <Input
                  id="orgName"
                  placeholder={fr ? "ex: SARL AquaTech" : "e.g. AquaTech Ltd"}
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  required
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="orgAddress">{fr ? "Adresse" : "Address"} *</Label>
                <Input
                  id="orgAddress"
                  placeholder={fr ? "ex: Zone industrielle, Sfax" : "e.g. Industrial zone, Sfax"}
                  value={orgAddress}
                  onChange={(e) => setOrgAddress(e.target.value)}
                  required
                  maxLength={255}
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="orgEmail">{fr ? "Email organisation" : "Organization email"} *</Label>
                  <Input
                    id="orgEmail"
                    type="email"
                    placeholder="contact@entreprise.com"
                    value={orgEmail}
                    onChange={(e) => setOrgEmail(e.target.value)}
                    required
                    maxLength={255}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orgPhone">{fr ? "Téléphone" : "Phone"} *</Label>
                  <Input
                    id="orgPhone"
                    type="tel"
                    placeholder={fr ? "ex: +216 71 000 000" : "e.g. +216 71 000 000"}
                    value={orgPhone}
                    onChange={(e) => setOrgPhone(e.target.value)}
                    required
                    maxLength={20}
                  />
                </div>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full gradient-water text-primary-foreground" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
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
