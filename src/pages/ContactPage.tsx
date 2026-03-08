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
  const fr = lang === "fr";
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
        title={fr ? "Contact — HydroScan" : "Contact — HydroScan"}
        description={fr ? "Contactez l'équipe HydroScan pour toute question sur l'empreinte eau." : "Contact HydroScan for any question about water footprint."}
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
            {fr ? "Contactez-nous" : "Contact Us"}
          </motion.h1>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            {fr
              ? "Une question, une demande de démonstration ou un projet ? Notre équipe vous répond rapidement."
              : "A question, a demo request or a project? Our team will get back to you quickly."}
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
                {fr ? "Nos coordonnées" : "Our details"}
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
                    <p className="text-sm font-medium text-foreground">{fr ? "Téléphone" : "Phone"}</p>
                    <p className="text-sm group-hover:text-primary transition-colors">+216 55 053 505</p>
                  </div>
                </a>
                <div className="flex items-start gap-3 text-muted-foreground">
                  <MapPin className="w-5 h-5 mt-0.5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{fr ? "Localisation" : "Location"}</p>
                    <p className="text-sm">{fr ? "Tunisie" : "Tunisia"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {fr
                  ? "Nous répondons généralement sous 24 à 48 heures ouvrées. Pour les demandes urgentes, privilégiez le téléphone."
                  : "We typically respond within 24–48 business hours. For urgent requests, please call us."}
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
                    {fr ? "Message envoyé !" : "Message sent!"}
                  </h3>
                  <p className="text-muted-foreground text-sm max-w-sm">
                    {fr
                      ? "Merci pour votre message. Notre équipe vous répondra dans les plus brefs délais."
                      : "Thank you for your message. Our team will get back to you shortly."}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">
                        {fr ? "Nom complet" : "Full name"} *
                      </label>
                      <Input required name="name" maxLength={100} placeholder={fr ? "Votre nom" : "Your name"} />
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
                      {fr ? "Entreprise" : "Company"}
                    </label>
                    <Input name="company" maxLength={100} placeholder={fr ? "Nom de votre entreprise" : "Your company name"} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                      {fr ? "Sujet" : "Subject"} *
                    </label>
                    <Input required name="subject" maxLength={150} placeholder={fr ? "L'objet de votre message" : "Subject of your message"} />
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
                      placeholder={fr ? "Décrivez votre demande..." : "Describe your request..."}
                    />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full gradient-water text-primary-foreground">
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
                        {fr ? "Envoi..." : "Sending..."}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        {fr ? "Envoyer le message" : "Send message"}
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
