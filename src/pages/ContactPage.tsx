import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { PageMeta } from "@/components/PageMeta";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ContactPage() {
  const { lang } = useI18n();
  const t3 = (fr: string, en: string, ar: string) => lang === "fr" ? fr : lang === "ar" ? ar : en;
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // Simulate submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <>
      <PageMeta
        title={t3("Contact — HydroScan", "Contact — HydroScan", "اتصل بنا — HydroScan")}
        description={t3("Contactez l'équipe HydroScan pour toute question sur l'empreinte eau.", "Contact HydroScan for any question about water footprint.", "تواصل مع HydroScan لأي سؤال حول البصمة المائية.")}
      />
      <LandingHeader activePage="contact" />

      <main className="min-h-screen bg-background pt-28 pb-20">
        {/* Hero */}
        <section className="max-w-4xl mx-auto px-6 text-center mb-16">
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-4xl md:text-5xl font-bold text-foreground mb-4"
          >
            {t3("Contactez-nous", "Contact Us", "تواصل معنا")}
          </motion.h1>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            {t3("Une question, une demande de démonstration ou un projet ? Notre équipe vous répond rapidement.", "A question, a demo request or a project? Our team will get back to you quickly.", "سؤال أو طلب عرض توضيحي أو مشروع؟ فريقنا يرد عليك سريعًا.")}
          </motion.p>
        </section>

        <section className="max-w-5xl mx-auto px-6 grid md:grid-cols-5 gap-12">
          {/* Contact Info */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="md:col-span-2 space-y-8"
          >
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-6">
                {t3("Nos coordonnées", "Our details", "معلومات الاتصال")}
              </h2>
              <div className="space-y-5">
                <a
                  href="mailto:contact@ktconsulting.info"
                  className="flex items-start gap-3 text-muted-foreground hover:text-primary transition-colors group"
                >
                  <Mail className="w-5 h-5 mt-0.5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Email</p>
                    <p className="text-sm group-hover:text-primary transition-colors">contact@ktconsulting.info</p>
                  </div>
                </a>
                <a
                  href="tel:+21655053505"
                  className="flex items-start gap-3 text-muted-foreground hover:text-primary transition-colors group"
                >
                  <Phone className="w-5 h-5 mt-0.5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{t3("Téléphone", "Phone", "هاتف")}</p>
                    <p className="text-sm group-hover:text-primary transition-colors">+216 55 053 505</p>
                  </div>
                </a>
                <div className="flex items-start gap-3 text-muted-foreground">
                  <MapPin className="w-5 h-5 mt-0.5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{t3("Localisation", "Location", "الموقع")}</p>
                    <p className="text-sm">{t3("Tunisie", "Tunisia", "تونس")}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t3("Nous répondons généralement sous 24 à 48 heures ouvrables. Pour les demandes urgentes, privilégiez le téléphone.", "We typically respond within 24–48 business hours. For urgent requests, please call us.", "نرد عادةً خلال 24 إلى 48 ساعة عمل. للطلبات العاجلة، يُفضّل الاتصال هاتفيًا.")}
              </p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="md:col-span-3"
          >
            <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {t3("Message envoyé !", "Message sent!", "تم إرسال الرسالة!")}
                  </h3>
                  <p className="text-muted-foreground text-sm max-w-sm">
                    {t3("Merci pour votre message. Notre équipe vous répondra dans les plus brefs délais.", "Thank you for your message. Our team will get back to you shortly.", "شكرًا لرسالتك. سيرد عليك فريقنا في أقرب وقت.")}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">
                        {t3("Nom complet", "Full name", "الاسم الكامل")} *
                      </label>
                      <Input required name="name" maxLength={100} placeholder={t3("Votre nom", "Your name", "اسمك")} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">
                        Email *
                      </label>
                      <Input required type="email" name="email" maxLength={255} placeholder="email@exemple.com" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                      {t3("Entreprise", "Company", "الشركة")}
                    </label>
                    <Input name="company" maxLength={100} placeholder={t3("Nom de votre entreprise", "Your company name", "اسم شركتك")} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                      {t3("Sujet", "Subject", "الموضوع")} *
                    </label>
                    <Input required name="subject" maxLength={150} placeholder={t3("L'objet de votre message", "Subject of your message", "موضوع رسالتك")} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                      Message *
                    </label>
                    <Textarea
                      required
                      name="message"
                      maxLength={2000}
                      rows={5}
                      placeholder={t3("Décrivez votre demande...", "Describe your request...", "صف طلبك...")}
                    />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full gradient-water text-primary-foreground">
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
                        {t3("Envoi...", "Sending...", "جاري الإرسال...")}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        {t3("Envoyer le message", "Send message", "إرسال الرسالة")}
                      </span>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </motion.div>
        </section>
      </main>

      <LandingFooter />
    </>
  );
}
