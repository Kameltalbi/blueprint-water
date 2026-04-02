import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import hydroscanLogo from "@/assets/logo_hydroscan.png";

export default function Register() {
  const { lang } = useI18n();
  const t3 = (fr: string, en: string, ar: string) => lang === "fr" ? fr : lang === "ar" ? ar : en;
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
        title: t3("Champs requis", "Required fields", "حقول مطلوبة"),
        description: t3("Veuillez remplir tous les champs de l'organisation.", "Please fill in all organization fields.", "يرجى ملء جميع حقول المؤسسة."),
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
        title: t3("Erreur d'inscription", "Signup error", "خطأ في التسجيل"),
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
      title: t3("Compte créé !", "Account created!", "تم إنشاء الحساب!"),
      description: t3("Vérifiez votre email pour confirmer votre compte.", "Check your email to confirm your account.", "تحقق من بريدك الإلكتروني لتأكيد حسابك."),
    });
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center">
          <Link to="/" className="inline-block mb-4">
            <img src={hydroscanLogo} alt="HydroScan" className="h-12 mx-auto object-contain" />
          </Link>
          <h1 className="font-display text-3xl font-bold text-foreground">
            {t3("Créer un compte", "Create account", "إنشاء حساب")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t3("Commencez à piloter votre empreinte eau", "Start managing your water footprint", "ابدأ في إدارة بصمتك المائية")}
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6 bg-card p-8 rounded-2xl border border-border shadow-sm">
          {/* Informations personnelles */}
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
              {t3("Informations personnelles", "Personal information", "المعلومات الشخصية")}
            </h2>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="fullName">{t3("Nom complet", "Full name", "الاسم الكامل")} *</Label>
                <Input
                  id="fullName"
                  placeholder={t3("Jean Dupont", "John Doe", "محمد السالم")}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t3("Email personnel", "Personal email", "البريد الشخصي")} *</Label>
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
                <Label htmlFor="password">{t3("Mot de passe", "Password", "كلمة المرور")} *</Label>
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
              {t3("Organisation", "Organization", "المؤسسة")}
            </h2>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="orgName">{t3("Nom de l'organisation", "Organization name", "اسم المؤسسة")} *</Label>
                <Input
                  id="orgName"
                  placeholder={t3("ex: SARL AquaTech", "e.g. AquaTech Ltd", "مثال: AquaTech SARL")}
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  required
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="orgAddress">{t3("Adresse", "Address", "العنوان")} *</Label>
                <Input
                  id="orgAddress"
                  placeholder={t3("ex: Zone industrielle, Sfax", "e.g. Industrial zone, Sfax", "مثال: المنطقة الصناعية، صفاقس")}
                  value={orgAddress}
                  onChange={(e) => setOrgAddress(e.target.value)}
                  required
                  maxLength={255}
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="orgEmail">{t3("Email organisation", "Organization email", "بريد المؤسسة")} *</Label>
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
                  <Label htmlFor="orgPhone">{t3("Téléphone", "Phone", "الهاتف")} *</Label>
                  <Input
                    id="orgPhone"
                    type="tel"
                    placeholder={t3("ex: +216 71 000 000", "e.g. +216 71 000 000", "مثال: +216 71 000 000")}
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
            {t3("Créer mon compte", "Create account", "إنشاء حسابي")}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {t3("Déjà un compte ?", "Already have an account?", "لديك حساب بالفعل؟")}{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            {t3("Se connecter", "Log in", "تسجيل الدخول")}
          </Link>
        </p>
        <p className="text-center text-sm text-muted-foreground">
          <Link to="/" className="font-semibold text-primary hover:underline">
            {t3("← Retour à l'accueil", "← Back to home", "العودة إلى الرئيسية →")}
          </Link>
        </p>
      </div>
    </div>
  );
}
