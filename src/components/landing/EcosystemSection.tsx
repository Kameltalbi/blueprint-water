import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { Globe, Leaf, Building2, Droplets, Trash2, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }),
};

interface Platform {
  name: string;
  descFr: string;
  descEn: string;
  descAr: string;
  icon: React.ReactNode;
  gradient: string;
  borderColor: string;
  url: string;
  isCurrent?: boolean;
  isFeatured?: boolean;
}

const platforms: Platform[] = [
  {
    name: "DecarboTech",
    descFr: "Plateforme mère ESG — Pilotez votre stratégie environnementale complète depuis un seul hub.",
    descEn: "ESG parent platform — Manage your complete environmental strategy from a single hub.",
    descAr: "المنصة الأم ESG — أدر استراتيجيتك البيئية الكاملة من مركز واحد.",
    icon: <Globe className="h-6 w-6" />,
    gradient: "from-emerald-500 to-emerald-700",
    borderColor: "border-emerald-500",
    url: "https://decarbotech.com",
    isFeatured: true,
  },
  {
    name: "CarboScan",
    descFr: "Bilan Carbone & Analyse du Cycle de Vie — Mesurez et réduisez vos émissions GES.",
    descEn: "Carbon Footprint & Life Cycle Analysis — Measure and reduce your GHG emissions.",
    descAr: "البصمة الكربونية وتحليل دورة الحياة — قِس وقلّل انبعاثاتك.",
    icon: <Leaf className="h-5 w-5" />,
    gradient: "from-green-500 to-green-700",
    borderColor: "border-green-500",
    url: "https://carboscan.com",
  },
  {
    name: "DecarboBat",
    descFr: "ACV Bâtiment — Analyse du cycle de vie pour le secteur de la construction.",
    descEn: "Building LCA — Life cycle analysis for the construction sector.",
    descAr: "تحليل دورة حياة المباني — تحليل دورة الحياة لقطاع البناء.",
    icon: <Building2 className="h-5 w-5" />,
    gradient: "from-amber-500 to-amber-700",
    borderColor: "border-amber-500",
    url: "https://decarbobat.com",
  },
  {
    name: "HydroScan",
    descFr: "Empreinte Eau — Calculez et optimisez votre consommation d'eau.",
    descEn: "Water Footprint — Calculate and optimize your water consumption.",
    descAr: "البصمة المائية — احسب واحسّن استهلاكك للمياه.",
    icon: <Droplets className="h-5 w-5" />,
    gradient: "from-primary to-[hsl(var(--ocean))]",
    borderColor: "border-primary",
    url: "#",
    isCurrent: true,
  },
  {
    name: "WasteScan",
    descFr: "Gestion des Déchets — Suivez, triez et valorisez vos flux de déchets.",
    descEn: "Waste Management — Track, sort and recover your waste streams.",
    descAr: "إدارة النفايات — تتبّع، صنّف وثمّن تدفقات نفاياتك.",
    icon: <Trash2 className="h-5 w-5" />,
    gradient: "from-violet-500 to-violet-700",
    borderColor: "border-violet-500",
    url: "https://wastescan.com",
  },
];

export function EcosystemSection() {
  const { lang } = useI18n();
  const t3 = (fr: string, en: string, ar: string) => lang === "fr" ? fr : lang === "ar" ? ar : en;

  const featured = platforms.find((p) => p.isFeatured)!;
  const others = platforms.filter((p) => !p.isFeatured);

  return (
    <section className="py-24 px-[5%] bg-background">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="mx-auto max-w-[1100px]"
      >
        {/* Header */}
        <motion.div custom={0} variants={fadeUp} className="text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-700 mb-5">
            <Globe className="h-3.5 w-3.5" />
            {t3("Écosystème", "Ecosystem", "النظام البيئي")}
          </div>
          <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold text-foreground leading-tight mb-3">
            {t3("L'Écosystème ESG DecarboTech", "The DecarboTech ESG Ecosystem", "النظام البيئي ESG لـ DecarboTech")}
          </h2>
          <p className="text-muted-foreground text-sm max-w-[560px] mx-auto">
            {t3(
              "5 plateformes spécialisées, un seul objectif : accélérer votre transition environnementale.",
              "5 specialized platforms, one goal: accelerate your environmental transition.",
              "5 منصات متخصصة، هدف واحد: تسريع تحولك البيئي."
            )}
          </p>
        </motion.div>

        {/* Featured card — DecarboTech */}
        <motion.a
          custom={1}
          variants={fadeUp}
          href={featured.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group block mb-5 rounded-2xl border bg-card overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
        >
          <div className={`h-1.5 w-full bg-gradient-to-r ${featured.gradient}`} />
          <div className="p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className={`flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${featured.gradient} text-white shrink-0`}>
              {featured.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1.5">
                <h3 className="font-display text-xl font-bold text-foreground">{featured.name}</h3>
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-[10px]">
                  {t3("Plateforme mère", "Parent platform", "المنصة الأم")}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm">
                {t3(featured.descFr, featured.descEn, featured.descAr)}
              </p>
            </div>
            <ExternalLink className="h-5 w-5 text-muted-foreground group-hover:text-emerald-600 transition-colors shrink-0" />
          </div>
        </motion.a>

        {/* Grid of 4 platforms */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {others.map((p, i) => {
            const isHydro = p.isCurrent;
            const Wrapper = isHydro ? "div" : "a";
            const linkProps = isHydro
              ? {}
              : { href: p.url, target: "_blank" as const, rel: "noopener noreferrer" };

            return (
              <motion.div key={p.name} custom={i + 2} variants={fadeUp}>
                <Wrapper
                  {...linkProps}
                  className={`group block h-full rounded-2xl border overflow-hidden transition-all duration-300 ${
                    isHydro
                      ? "bg-muted/50 border-primary/30 cursor-default"
                      : "bg-card shadow-sm hover:shadow-lg hover:-translate-y-0.5"
                  }`}
                >
                  <div className={`h-1 w-full bg-gradient-to-r ${p.gradient} ${isHydro ? "opacity-60" : ""}`} />
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br ${p.gradient} ${isHydro ? "opacity-60" : ""} text-white`}>
                        {p.icon}
                      </div>
                      {isHydro ? (
                        <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">
                          {t3("Vous êtes ici", "You are here", "أنت هنا")}
                        </Badge>
                      ) : (
                        <ExternalLink className="h-4 w-4 text-muted-foreground/40 group-hover:text-foreground transition-colors" />
                      )}
                    </div>
                    <h3 className={`font-display text-base font-bold mb-1.5 ${isHydro ? "text-muted-foreground" : "text-foreground"}`}>
                      {p.name}
                    </h3>
                    <p className={`text-xs leading-relaxed ${isHydro ? "text-muted-foreground/70" : "text-muted-foreground"}`}>
                      {t3(p.descFr, p.descEn, p.descAr)}
                    </p>
                  </div>
                </Wrapper>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
