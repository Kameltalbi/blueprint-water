import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ChevronRight, ChevronLeft, User, Building2, Target } from "lucide-react";
import hydroscanLogo from "@/assets/logo_hydroscan.png";
import { saveOrgProfile, SECTORS, GOVERNORATES_TN } from "@/lib/org-profile";
import { countryOptions } from "@/lib/water-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCountryMode } from "@/contexts/CountryMode";

const FUNCTIONAL_UNIT_EXAMPLES = [
  "1 tonne de produit fini",
  "1 000 litres d'huile d'olive",
  "1 000 pièces textiles",
  "1 tonne de briques / ciment",
  "1 tonne de phosphate",
  "1 000 conserves / boîtes",
  "1 000 m² de surface nettoyée",
  "1 chambre-nuit (hôtel)",
  "Autre unité",
];

const STEPS = [
  { id: 1, label: "Compte", icon: User },
  { id: 2, label: "Entreprise", icon: Building2 },
  { id: 3, label: "Production", icon: Target },
];

export default function Register() {
  const { lang } = useI18n();
  const t3 = (fr: string, en: string, ar: string) => lang === "fr" ? fr : lang === "ar" ? ar : en;
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isTunisia } = useCountryMode();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1 — Personal
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Step 2 — Organization
  const [orgName, setOrgName] = useState("");
  const [orgAddress, setOrgAddress] = useState("");
  const [orgEmail, setOrgEmail] = useState("");
  const [orgPhone, setOrgPhone] = useState("");
  const [sector, setSector] = useState("");
  const [governorate, setGovernorate] = useState("");
  const [country, setCountry] = useState("Tunisie");

  // Step 3 — Functional unit
  const [functionalUnit, setFunctionalUnit] = useState("");
  const [functionalUnitQty, setFunctionalUnitQty] = useState("");

  const canNext1 = fullName.trim() && email.trim() && password.length >= 6;
  const canNext2 = orgName.trim() && sector && (isTunisia ? governorate : country);

  function nextStep() { setStep((s) => Math.min(s + 1, 3)); }
  function prevStep() { setStep((s) => Math.max(s - 1, 1)); }

  const handleRegister = async () => {
    setLoading(true);

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
      toast({ variant: "destructive", title: t3("Erreur d'inscription", "Signup error", "خطأ في التسجيل"), description: signUpError.message });
      return;
    }

    const userId = signUpData.user?.id;

    if (userId) {
      const { error: orgError } = await supabase.rpc("create_organization_with_admin", {
        _user_id: userId,
        _org_name: orgName.trim(),
        _org_address: `${orgAddress.trim()} — ${isTunisia ? governorate : country}`,
        _org_email: orgEmail.trim() || email,
        _org_phone: orgPhone.trim() || "—",
      });
      if (orgError) console.error("Org creation error:", orgError);
    }

    saveOrgProfile({ sector, governorate: isTunisia ? governorate : "", country, functionalUnit, functionalUnitQty });
    localStorage.setItem("hs_show_tutorial", "1");

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
        {/* Logo */}
        <div className="text-center">
          <Link to="/" className="inline-block mb-4">
            <img src={hydroscanLogo} alt="HydroScan" className="h-12 mx-auto object-contain" />
          </Link>
          <h1 className="font-display text-2xl font-bold text-foreground">
            {t3("Créer votre compte HydroScan", "Create your HydroScan account", "إنشاء حساب HydroScan")}
          </h1>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-0">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div className={`flex flex-col items-center gap-1 ${step >= s.id ? "text-primary" : "text-muted-foreground"}`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-colors ${step > s.id ? "bg-primary border-primary text-primary-foreground" : step === s.id ? "border-primary bg-primary/10" : "border-muted"}`}>
                  <s.icon className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-medium">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-16 h-0.5 mx-1 mb-5 transition-colors ${step > s.id ? "bg-primary" : "bg-muted"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Steps */}
        <div className="bg-card p-8 rounded-2xl border border-border shadow-sm space-y-5">

          {/* ── Step 1: Personal ── */}
          {step === 1 && (
            <>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {t3("Étape 1 — Vos informations", "Step 1 — Your info", "الخطوة 1 — معلوماتك")}
              </h2>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>{t3("Nom complet", "Full name", "الاسم الكامل")} *</Label>
                  <Input placeholder={t3("Ahmed Ben Salah", "John Doe", "أحمد بن صالح")} value={fullName} onChange={(e) => setFullName(e.target.value)} maxLength={100} />
                </div>
                <div className="space-y-2">
                  <Label>{t3("Email", "Email", "البريد الإلكتروني")} *</Label>
                  <Input type="email" placeholder="nom@entreprise.com" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} />
                </div>
                <div className="space-y-2">
                  <Label>{t3("Mot de passe", "Password", "كلمة المرور")} * <span className="text-xs text-muted-foreground">(6 car. min.)</span></Label>
                  <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} />
                </div>
              </div>
              <Button className="w-full gradient-water text-primary-foreground gap-2" disabled={!canNext1} onClick={nextStep}>
                {t3("Suivant", "Next", "التالي")} <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* ── Step 2: Company ── */}
          {step === 2 && (
            <>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {t3("Étape 2 — Votre entreprise", "Step 2 — Your company", "الخطوة 2 — مؤسستك")}
              </h2>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>{t3("Nom de l'entreprise", "Company name", "اسم الشركة")} *</Label>
                  <Input placeholder={t3("ex: SARL AquaTech Sfax", "e.g. AquaTech Ltd", "مثال: AquaTech")} value={orgName} onChange={(e) => setOrgName(e.target.value)} maxLength={100} />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>{t3("Secteur d'activité", "Sector", "قطاع النشاط")} *</Label>
                    <Select value={sector} onValueChange={setSector}>
                      <SelectTrigger><SelectValue placeholder={t3("Choisir…", "Choose…", "اختر…")} /></SelectTrigger>
                      <SelectContent>{SECTORS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  {isTunisia ? (
                    <div className="space-y-2">
                      <Label>{t3("Gouvernorat", "Governorate", "الولاية")} *</Label>
                      <Select value={governorate} onValueChange={setGovernorate}>
                        <SelectTrigger><SelectValue placeholder={t3("Choisir…", "Choose…", "اختر…")} /></SelectTrigger>
                        <SelectContent>{GOVERNORATES_TN.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label>{t3("Pays", "Country", "الدولة")} *</Label>
                      <Select value={country} onValueChange={setCountry}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{countryOptions.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>{t3("Adresse site principal", "Main site address", "عنوان الموقع الرئيسي")}</Label>
                  <Input placeholder={t3("ex: Zone industrielle, Sfax", "e.g. Industrial zone", "المنطقة الصناعية")} value={orgAddress} onChange={(e) => setOrgAddress(e.target.value)} maxLength={255} />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>{t3("Email entreprise", "Company email", "بريد الشركة")}</Label>
                    <Input type="email" placeholder="contact@entreprise.com" value={orgEmail} onChange={(e) => setOrgEmail(e.target.value)} maxLength={255} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t3("Téléphone", "Phone", "الهاتف")}</Label>
                    <Input type="tel" placeholder="+216 71 000 000" value={orgPhone} onChange={(e) => setOrgPhone(e.target.value)} maxLength={20} />
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="gap-2" onClick={prevStep}><ChevronLeft className="h-4 w-4" />{t3("Retour", "Back", "رجوع")}</Button>
                <Button className="flex-1 gradient-water text-primary-foreground gap-2" disabled={!canNext2} onClick={nextStep}>
                  {t3("Suivant", "Next", "التالي")} <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}

          {/* ── Step 3: Functional unit ── */}
          {step === 3 && (
            <>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {t3("Étape 3 — Unité de production", "Step 3 — Production unit", "الخطوة 3 — وحدة الإنتاج")}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t3(
                  "L'unité fonctionnelle permet à HydroScan de calculer votre empreinte eau par unité produite (ISO 14046). Vous pourrez la modifier plus tard.",
                  "The functional unit allows HydroScan to calculate your water footprint per unit produced (ISO 14046). You can change it later.",
                  "تسمح الوحدة الوظيفية لـ HydroScan بحساب بصمتك المائية لكل وحدة منتجة (ISO 14046). يمكنك تعديلها لاحقاً."
                )}
              </p>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>{t3("Que produisez-vous ?", "What do you produce?", "ماذا تنتج؟")} <span className="text-xs text-muted-foreground">(optionnel)</span></Label>
                  <Select value={functionalUnit} onValueChange={setFunctionalUnit}>
                    <SelectTrigger><SelectValue placeholder={t3("Choisir une unité…", "Choose a unit…", "اختر وحدة…")} /></SelectTrigger>
                    <SelectContent>{FUNCTIONAL_UNIT_EXAMPLES.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                {functionalUnit === "Autre unité" && (
                  <div className="space-y-2">
                    <Label>{t3("Précisez votre unité", "Specify your unit", "حدد وحدتك")}</Label>
                    <Input placeholder={t3("ex: 1 000 m² de sol poli", "e.g. 1,000 m² polished floor", "مثال: 1000 متر مربع أرضية")} value={functionalUnitQty} onChange={(e) => setFunctionalUnitQty(e.target.value)} />
                  </div>
                )}
              </div>

              <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 text-sm space-y-1">
                <p className="font-semibold text-primary">{t3("Résumé de votre profil", "Your profile summary", "ملخص ملفك الشخصي")}</p>
                <p>🏭 {orgName} · {sector}</p>
                <p>📍 {isTunisia ? governorate : country}</p>
                {functionalUnit && <p>🎯 {functionalUnit}</p>}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="gap-2" onClick={prevStep}><ChevronLeft className="h-4 w-4" />{t3("Retour", "Back", "رجوع")}</Button>
                <Button className="flex-1 gradient-water text-primary-foreground gap-2" onClick={handleRegister} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {t3("Créer mon compte", "Create account", "إنشاء حسابي")}
                </Button>
              </div>
            </>
          )}
        </div>

        <p className="text-center text-sm text-muted-foreground">
          {t3("Déjà un compte ?", "Already have an account?", "لديك حساب بالفعل؟")}{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            {t3("Se connecter", "Log in", "تسجيل الدخول")}
          </Link>
        </p>
      </div>
    </div>
  );
}
