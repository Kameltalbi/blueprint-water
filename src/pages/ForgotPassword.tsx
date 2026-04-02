import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  const { lang } = useI18n();
  const t3 = (fr: string, en: string, ar: string) => lang === "fr" ? fr : lang === "ar" ? ar : en;
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);

    if (error) {
      toast({ variant: "destructive", title: "Erreur", description: error.message });
    } else {
      setSent(true);
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
            {t3("Mot de passe oublié", "Forgot password", "نسيت كلمة المرور")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t3("Entrez votre email pour recevoir un lien de réinitialisation", "Enter your email to receive a reset link", "أدخل بريدك الإلكتروني لاستقبال رابط إعادة التعيين")}
          </p>
        </div>

        {sent ? (
          <div className="bg-card p-8 rounded-2xl border border-border shadow-sm text-center space-y-4">
            <p className="text-foreground font-medium">
              {t3("Email envoyé !", "Email sent!", "تم إرسال البريد الإلكتروني!")}
            </p>
            <p className="text-sm text-muted-foreground">
              {t3("Vérifiez votre boîte de réception et cliquez sur le lien.", "Check your inbox and click the link.", "تحقق من صندوق الوارد وانقر على الرابط.")}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 bg-card p-8 rounded-2xl border border-border shadow-sm">
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
            <Button type="submit" className="w-full gradient-water text-primary-foreground" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {t3("Envoyer le lien", "Send reset link", "إرسال الرابط")}
            </Button>
          </form>
        )}

        <p className="text-center text-sm text-muted-foreground">
          <Link to="/login" className="inline-flex items-center gap-1 font-semibold text-primary hover:underline">
            <ArrowLeft className="h-3 w-3" />
            {t3("Retour à la connexion", "Back to login", "العودة إلى تسجيل الدخول")}
          </Link>
        </p>
      </div>
    </div>
  );
}
