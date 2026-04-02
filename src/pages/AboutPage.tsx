import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PageMeta } from "@/components/PageMeta";
import { useI18n } from "@/lib/i18n";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Droplets, ShieldCheck, Users, FlaskConical, Gauge, Globe, Target, BookOpen, HeartHandshake } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

export default function AboutPage() {
  const { lang } = useI18n();
  const t3 = (fr: string, en: string, ar: string) => lang === "fr" ? fr : lang === "ar" ? ar : en;

  return (
    <div className="min-h-screen bg-card font-sans">
      <PageMeta
        title={t3("À propos — HydroScan", "About — HydroScan", "عن HydroScan")}
        description={t3("Mesurer l'eau avec rigueur pour mieux agir. Découvrez la mission, l'approche et les convictions de HydroScan.", "Measure water rigorously to act better. Discover HydroScan's mission, approach and convictions.", "قِس المياه بدقة لتتصرف بشكل أفضل. اكتشف مهمة HydroScan ونهجها وقناعاتها.")}
      />

      <LandingHeader activePage="apropos" />

      {/* ── Hero ── */}
      <section className="pt-32 pb-20 px-[5%] bg-card">
        <motion.div initial="hidden" animate="visible" variants={stagger} className="mx-auto max-w-[800px] text-center">
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-semibold text-primary mb-7">
            <Droplets className="h-3.5 w-3.5" />
            {t3("À propos", "About", "من نحن")}
          </motion.div>
          <motion.h1 variants={fadeUp} className="font-display text-[clamp(2.4rem,5vw,4rem)] font-extrabold leading-[1.1] text-foreground mb-6">
            {t3("Mesurer l'eau avec rigueur ", "Measure water rigorously ", "قِس المياه بدقة ")}
            <span className="text-primary">{t3("pour mieux agir", "to act better", "لتتصرف بشكل أفضل")}</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-muted-foreground max-w-[640px] mx-auto leading-relaxed">
            {t3("HydroScan est une plateforme conçue pour aider les organisations à comprendre, mesurer et gérer leur empreinte eau de manière fiable et conforme aux standards internationaux.", "HydroScan is a platform designed to help organizations understand, measure and manage their water footprint reliably and in compliance with international standards.", "HydroScan منصة مصممة لمساعدة المنظمات على فهم بصمتها المائية وقياسها وإدارتها بشكل موثوق ووفق المعايير الدولية.")}
          </motion.p>
        </motion.div>
      </section>

      {/* ── Intro ── */}
      <section className="py-16 px-[5%] bg-background">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mx-auto max-w-[800px]">
          <motion.p variants={fadeUp} className="text-sm text-muted-foreground leading-relaxed mb-4">
            {t3("Aujourd'hui, de nombreuses entreprises souhaitent intégrer la gestion de l'eau dans leur stratégie environnementale. Pourtant, elles se heurtent souvent à des obstacles importants : des outils trop complexes, des méthodes peu transparentes ou des solutions réservées aux grandes organisations.", "Today, many companies want to integrate water management into their environmental strategy. Yet they often face significant obstacles: overly complex tools, opaque methods or solutions reserved for large organizations.", "اليوم، تريد شركات كثيرة دمج إدارة المياه في استراتيجيتها البيئية. لكنها غالبًا تواجه عقبات: أدوات معقدة، مناهج غير شفافة، أو حلول مخصصة للمنظمات الكبيرة فقط.")}
          </motion.p>
          <motion.p variants={fadeUp} className="text-sm text-muted-foreground leading-relaxed">
            {t3("HydroScan a été conçu pour répondre à ce besoin : offrir une solution rigoureuse, accessible et opérationnelle permettant aux entreprises et aux experts environnementaux de mesurer leur empreinte eau avec précision.", "HydroScan was designed to meet this need: providing a rigorous, accessible and operational solution that enables companies and environmental experts to measure their water footprint with precision.", "صُمِّم HydroScan لتلبية هذه الحاجة: تقديم حل دقيق وسهل الوصول يتيح للشركات والخبراء البيئيين قياس بصمتهم المائية بدقة.")}
          </motion.p>
        </motion.div>
      </section>

      {/* ── Notre origine ── */}
      <section className="py-20 px-[5%] bg-card">
        <div className="mx-auto max-w-[900px]">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-10">
            <p className="text-xs font-bold tracking-[0.18em] uppercase text-primary mb-3">{t3("Notre origine", "Our origin", "أصولنا")}</p>
            <h2 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] font-extrabold text-foreground leading-tight">
              {t3("Un constat partagé par de nombreux professionnels", "A finding shared by many professionals", "ملاحظة يتقاسمها كثير من المهنيين")}
            </h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-4">
            <motion.p variants={fadeUp} className="text-sm text-muted-foreground leading-relaxed">
              {t3("Dans de nombreux projets liés à la performance environnementale et au reporting RSE, une difficulté revenait systématiquement : l'évaluation de l'impact lié à l'eau.", "In many projects related to environmental performance and CSR reporting, one difficulty kept coming up: assessing water-related impact.", "في مشاريع كثيرة تتعلق بالأداء البيئي وتقارير المسؤولية الاجتماعية، كانت صعوبة واحدة تتكرر باستمرار: تقييم الأثر المرتبط بالمياه.")}
            </motion.p>
            <motion.p variants={fadeUp} className="text-sm text-muted-foreground leading-relaxed">
              {t3("Dans la pratique, deux situations dominaient : certaines organisations ne mesuraient pas leur empreinte eau, d'autres tentaient de l'évaluer à l'aide de tableurs internes ou de méthodes non standardisées. Ces approches posaient un problème majeur : les résultats obtenus étaient difficiles à défendre lors d'un audit, dans un rapport RSE ou face à des parties prenantes exigeantes.", "In practice, two situations dominated: some organizations did not measure their water footprint, others tried to assess it using internal spreadsheets or non-standardized methods. These approaches posed a major problem: results were difficult to defend during an audit, in a CSR report or in front of demanding stakeholders.", "في الواقع العملي، سيطر وضعان: بعض المنظمات لا تقيس بصمتها المائية، وأخرى تحاول تقييمها بجداول بيانات أو مناهج غير موحدة. طرحت هذه المناهج مشكلة كبرى: نتائج يصعب الدفاع عنها في مراجعة أو تقرير مسؤولية اجتماعية.")}
            </motion.p>

            <motion.div variants={fadeUp} className="rounded-2xl border border-border bg-background p-6 lg:p-8 my-6">
              <p className="text-sm font-semibold text-foreground mb-4">
                {t3("Entre ces deux réalités, il manquait une solution capable d'apporter à la fois :", "Between these two realities, a solution was missing that could provide:", "بين هاتين الحقيقتين، كان ثمة حاجة لحل قادر على تقديم:")}
              </p>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-start gap-3">
                  <FlaskConical className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">{t3("Une rigueur méthodologique reconnue", "Recognized methodological rigor", "دقة منهجية معترف بها")}</p>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">{t3("Une accessibilité pour les PME et les consultants", "Accessibility for SMEs and consultants", "سهولة وصول للمؤسسات الصغيرة والمستشارين")}</p>
                </div>
                <div className="flex items-start gap-3">
                  <Gauge className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">{t3("Une rapidité d'utilisation compatible avec les contraintes opérationnelles", "Speed of use compatible with operational constraints", "سرعة استخدام تتوافق مع القيود التشغيلية")}</p>
                </div>
              </div>
            </motion.div>

            <motion.p variants={fadeUp} className="text-sm text-muted-foreground leading-relaxed">
              {t3("HydroScan a été développé pour combler cet espace. La plateforme intègre directement les principes du Water Footprint Network et de la norme ISO 14046, tout en offrant une expérience simple et structurée permettant de transformer rapidement les données collectées en résultats exploitables.", "HydroScan was developed to fill this gap. The platform directly integrates the principles of the Water Footprint Network and the ISO 14046 standard, while offering a simple and structured experience to quickly transform collected data into actionable results.", "طُوِّر HydroScan لسد هذا الفراغ. تدمج المنصة مبادئ Water Footprint Network ومعيار ISO 14046 مع تجربة بسيطة ومنظمة لتحويل البيانات بسرعة إلى نتائج قابلة للتنفيذ.")}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── Nos convictions ── */}
      <section className="py-20 px-[5%] bg-background">
        <div className="mx-auto max-w-[900px]">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-10">
            <p className="text-xs font-bold tracking-[0.18em] uppercase text-primary mb-3">{t3("Nos convictions", "Our convictions", "قناعاتنا")}</p>
            <h2 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] font-extrabold text-foreground leading-tight">
              {t3("Ce en quoi nous croyons", "What we believe in", "ما نؤمن به")}
            </h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid gap-6 md:grid-cols-3">
            <motion.div variants={fadeUp} className="rounded-2xl border border-border bg-card p-7">
              <FlaskConical className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-display text-base font-bold text-foreground mb-3">
                {t3("La rigueur scientifique est indispensable", "Scientific rigor is essential", "الدقة العلمية ضرورة لا غنى عنها")}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t3("Un calcul d'empreinte eau n'a de valeur que s'il repose sur une méthodologie reconnue et documentée. HydroScan s'appuie sur les références internationales, notamment les travaux du Water Footprint Network et les principes de la norme ISO 14046. Chaque résultat repose sur des formules, des données et des hypothèses clairement documentées.", "A water footprint calculation only has value if it relies on a recognized and documented methodology. HydroScan is based on international references, including the Water Footprint Network's work and the ISO 14046 standard. Every result is based on clearly documented formulas, data and assumptions.", "لا قيمة لحساب البصمة المائية إلا إذا استند إلى منهجية معترف بها وموثقة. يعتمد HydroScan على المراجع الدولية ومبادئ معيار ISO 14046. كل نتيجة تقوم على صيغ وبيانات وافتراضات موثقة بوضوح.")}
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="rounded-2xl border border-border bg-card p-7">
              <ShieldCheck className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-display text-base font-bold text-foreground mb-3">
                {t3("La transparence renforce la crédibilité", "Transparency strengthens credibility", "الشفافية تعزز المصداقية")}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t3("L'empreinte eau est un indicateur puissant, mais elle possède également ses limites. Elle ne remplace pas une analyse complète des risques liés à l'eau, ni une stratégie globale de gestion hydrique. HydroScan adopte une approche transparente : les rapports expliquent clairement les hypothèses utilisées, les sources de données et les limites méthodologiques.", "The water footprint is a powerful indicator, but it also has its limitations. It does not replace a complete water risk analysis, nor a comprehensive water management strategy. HydroScan adopts a transparent approach: reports clearly explain the assumptions used, data sources and methodological limitations.", "البصمة المائية مؤشر قوي لكن له حدوده. لا يحل محل تحليل شامل لمخاطر المياه. يتبع HydroScan نهجًا شفافًا: تشرح التقارير بوضوح الافتراضات المستخدمة والمصادر والحدود المنهجية.")}
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="rounded-2xl border border-border bg-card p-7">
              <Users className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-display text-base font-bold text-foreground mb-3">
                {t3("L'accessibilité est la clé du changement", "Accessibility is the key to change", "إمكانية الوصول هي مفتاح التغيير")}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                {t3("Les méthodes les plus solides ne produisent un impact réel que si elles sont utilisées à grande échelle. L'objectif de HydroScan est de rendre la mesure accessible à :", "The strongest methods only produce real impact when used at scale. HydroScan's goal is to make measurement accessible to:", "أقوى المناهج لا تُنتج أثرًا حقيقيًا إلا عند تطبيقها على نطاق واسع. هدف HydroScan هو جعل القياس متاحًا لـ:")}
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li className="flex gap-2"><span className="text-green-water font-bold">✓</span> {t3("PME industrielles", "Industrial SMEs", "المؤسسات الصناعية الصغيرة")}</li>
                <li className="flex gap-2"><span className="text-green-water font-bold">✓</span> {t3("Entreprises agricoles ou agroalimentaires", "Agricultural or food processing companies", "شركات الزراعة وصناعة الأغذية")}</li>
                <li className="flex gap-2"><span className="text-green-water font-bold">✓</span> {t3("Bureaux d'études", "Engineering firms", "مكاتب الدراسات الهندسية")}</li>
                <li className="flex gap-2"><span className="text-green-water font-bold">✓</span> {t3("Consultants en RSE et durabilité", "CSR and sustainability consultants", "مستشارو المسؤولية الاجتماعية والاستدامة")}</li>
                <li className="flex gap-2"><span className="text-green-water font-bold">✓</span> {t3("Filiales régionales de groupes internationaux", "Regional subsidiaries of international groups", "الفروع الإقليمية للمجموعات الدولية")}</li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Notre approche ── */}
      <section className="py-20 px-[5%] bg-card">
        <div className="mx-auto max-w-[900px]">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-10">
            <p className="text-xs font-bold tracking-[0.18em] uppercase text-primary mb-3">{t3("Notre approche", "Our approach", "نهجنا")}</p>
            <h2 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] font-extrabold text-foreground leading-tight">
              {t3("Comment nous travaillons", "How we work", "كيف نعمل")}
            </h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid gap-8 md:grid-cols-3">
            <motion.div variants={fadeUp} className="rounded-2xl border border-border bg-background p-6">
              <BookOpen className="h-7 w-7 text-blue-water mb-4" />
              <h3 className="font-display text-base font-bold text-foreground mb-3">
                {t3("Une base scientifique solide", "A solid scientific foundation", "أساس علمي صلب")}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                {t3("Le moteur de calcul repose sur les principes du Water Footprint Assessment Manual. Les méthodes utilisées permettent de mesurer les trois composantes : eau verte, eau bleue et eau grise.", "The calculation engine is based on the principles of the Water Footprint Assessment Manual. The methods used measure all three components: green, blue and grey water.", "يستند محرك الحساب إلى مبادئ Water Footprint Assessment Manual. تقيس المناهج المستخدمة المكونات الثلاثة: الماء الأخضر والأزرق والرمادي.")}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t3("Les données proviennent de sources reconnues au niveau international : bases hydrologiques, agricoles et climatiques utilisées dans la recherche environnementale.", "Data comes from internationally recognized sources: hydrological, agricultural and climate databases used in environmental research.", "تأتي البيانات من مصادر معترف بها دوليًا: قواعد هيدرولوجية وزراعية ومناخية تُستخدم في الأبحاث البيئية.")}
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="rounded-2xl border border-border bg-background p-6">
              <Gauge className="h-7 w-7 text-green-water mb-4" />
              <h3 className="font-display text-base font-bold text-foreground mb-3">
                {t3("Conçu pour l'opérationnel", "Designed for operations", "مصمم للعمل الميداني")}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t3("HydroScan a été pensé pour répondre aux besoins réels des organisations qui doivent produire des analyses dans des délais courts. La plateforme simplifie : collecte des données, structuration des informations, calcul de l'empreinte eau, et génération de rapports exploitables.", "HydroScan was designed to meet the real needs of organizations that must produce analyses within tight deadlines. The platform simplifies: data collection, information structuring, water footprint calculation, and generation of actionable reports.", "صُمِّم HydroScan لتلبية الاحتياجات الفعلية للمنظمات التي تنتج تحليلات في مهل قصيرة. تبسّط المنصة: جمع البيانات، هيكلة المعلومات، حساب البصمة المائية وتوليد تقارير قابلة للتنفيذ.")}
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="rounded-2xl border border-border bg-background p-6">
              <Globe className="h-7 w-7 text-primary mb-4" />
              <h3 className="font-display text-base font-bold text-foreground mb-3">
                {t3("Adapté aux réalités francophones", "Adapted to francophone realities", "مكيَّف مع الواقع الإقليمي")}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t3("Les zones méditerranéennes et de nombreuses régions d'Afrique figurent parmi les territoires les plus exposés au stress hydrique. HydroScan tient compte des réalités climatiques, économiques et réglementaires de ces régions.", "Mediterranean areas and many African regions are among the territories most exposed to water stress. HydroScan takes into account the climatic, economic and regulatory realities of these regions.", "تُعدّ المناطق المتوسطية وكثير من مناطق أفريقيا من أكثر المناطق تعرضًا للإجهاد المائي. يأخذ HydroScan في الحسبان الواقع المناخي والاقتصادي والتنظيمي لهذه المناطق.")}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Repères ── */}
      <section className="py-20 px-[5%] bg-background">
        <div className="mx-auto max-w-[900px]">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
            <h2 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] font-extrabold text-foreground leading-tight">
              {t3("HydroScan en quelques repères", "HydroScan at a glance", "HydroScan في أرقام")}
            </h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <motion.div variants={fadeUp}>
              <p className="font-display text-3xl font-extrabold text-primary leading-none mb-1">3</p>
              <p className="text-xs text-muted-foreground">
                {lang === "fr" ? <>Composantes analysées<br />(verte, bleue, grise)</> : lang === "ar" ? <>المكونات المحللة<br />(خضراء، زرقاء، رمادية)</> : <>Components analyzed<br />(green, blue, grey)</>}
              </p>
            </motion.div>
            <motion.div variants={fadeUp}>
              <p className="font-display text-3xl font-extrabold text-primary leading-none mb-1">ISO</p>
              <p className="text-xs text-muted-foreground">
                {lang === "fr" ? <>14046 / WFN<br />Standard de référence</> : lang === "ar" ? <>14046 / WFN<br />معيار مرجعي</> : <>14046 / WFN<br />Reference standard</>}
              </p>
            </motion.div>
            <motion.div variants={fadeUp}>
              <p className="font-display text-3xl font-extrabold text-primary leading-none mb-1">8+</p>
              <p className="text-xs text-muted-foreground">
                {lang === "fr" ? <>Bases de données<br />internationales intégrées</> : lang === "ar" ? <>قواعد بيانات<br />دولية مدمجة</> : <>International databases<br />integrated</>}
              </p>
            </motion.div>
            <motion.div variants={fadeUp}>
              <p className="font-display text-3xl font-extrabold text-primary leading-none mb-1">12</p>
              <p className="text-xs text-muted-foreground">
                {lang === "fr" ? <>Secteurs d'activité<br />couverts</> : lang === "ar" ? <>قطاعات نشاط<br />مغطاة</> : <>Industry sectors<br />covered</>}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Engagements ── */}
      <section className="py-20 px-[5%] bg-card">
        <div className="mx-auto max-w-[900px]">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-10">
            <p className="text-xs font-bold tracking-[0.18em] uppercase text-primary mb-3">{t3("Notre engagement", "Our commitment", "التزامنا")}</p>
            <h2 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] font-extrabold text-foreground leading-tight">
              {t3("Trois engagements fondamentaux", "Three fundamental commitments", "ثلاثة التزامات أساسية")}
            </h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid gap-6 md:grid-cols-3">
            <motion.div variants={fadeUp} className="rounded-2xl border border-border bg-background p-6">
              <Target className="h-7 w-7 text-primary mb-3" />
              <h3 className="font-display text-base font-bold text-foreground mb-2">
                {t3("Fournir des résultats fiables", "Deliver reliable results", "تقديم نتائج موثوقة")}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t3("Les analyses produites doivent pouvoir être utilisées dans des rapports environnementaux, des démarches RSE ou des audits.", "Analyses produced must be usable in environmental reports, CSR initiatives or audits.", "يجب أن تكون التحليلات المنتجة قابلة للاستخدام في التقارير البيئية ومبادرات المسؤولية الاجتماعية أو عمليات التدقيق.")}
              </p>
            </motion.div>
            <motion.div variants={fadeUp} className="rounded-2xl border border-border bg-background p-6">
              <FlaskConical className="h-7 w-7 text-primary mb-3" />
              <h3 className="font-display text-base font-bold text-foreground mb-2">
                {t3("Respecter la méthodologie scientifique", "Respect scientific methodology", "احترام المنهجية العلمية")}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t3("Les calculs ne sont pas simplifiés au point de compromettre leur validité.", "Calculations are not simplified to the point of compromising their validity.", "لا تُبسَّط الحسابات إلى حد يُخلّ بصحتها.")}
              </p>
            </motion.div>
            <motion.div variants={fadeUp} className="rounded-2xl border border-border bg-background p-6">
              <HeartHandshake className="h-7 w-7 text-primary mb-3" />
              <h3 className="font-display text-base font-bold text-foreground mb-2">
                {t3("Contribuer à la diffusion de la mesure", "Contribute to spreading measurement", "المساهمة في نشر ثقافة القياس")}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t3("La transition vers une gestion durable de l'eau nécessite des outils accessibles, des méthodes transparentes et une meilleure compréhension des impacts.", "The transition to sustainable water management requires accessible tools, transparent methods and a better understanding of impacts.", "يتطلب التحول نحو إدارة مستدامة للمياه أدوات سهلة الوصول ومناهج شفافة وفهمًا أعمق للآثار.")}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="gradient-water py-24 px-[5%] text-center text-primary-foreground">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mx-auto max-w-[640px]">
          <motion.h2 variants={fadeUp} className="font-display text-[clamp(2rem,4vw,3.2rem)] font-extrabold mb-4">
            {lang === "fr" ? <>Agir pour une meilleure<br />gestion de l'eau</> : lang === "ar" ? <>تصرف من أجل<br />إدارة أفضل للمياه</> : <>Act for better<br />water management</>}
          </motion.h2>
          <motion.p variants={fadeUp} className="opacity-85 max-w-[520px] mx-auto mb-10 text-sm">
            {t3("Mesurer les impacts constitue la première étape indispensable pour pouvoir les réduire. HydroScan a été conçu pour accompagner les organisations dans cette démarche : transformer les données en compréhension, et la compréhension en action.", "Measuring impacts is the essential first step to reducing them. HydroScan was designed to support organizations in this process: transforming data into understanding, and understanding into action.", "قياس الآثار هو الخطوة الأولى الضرورية لتخفيضها. صُمِّم HydroScan لمرافقة المنظمات في هذا المسار: تحويل البيانات إلى فهم، والفهم إلى عمل.")}
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-3">
            <Link to="/calculateur" className="inline-flex items-center gap-2 px-8 py-3.5 text-white rounded-[10px] font-bold text-sm hover:-translate-y-0.5 hover:shadow-lg transition-all" style={{ backgroundColor: '#015486' }}>
              💧 {t3("Commencer gratuitement", "Start for free", "ابدأ مجانًا")}
            </Link>
            <Link to="/fonctionnalites" className="inline-block px-8 py-3.5 border-2 border-primary-foreground/50 text-primary-foreground rounded-[10px] font-semibold text-sm hover:border-primary-foreground hover:bg-primary-foreground/10 transition-all">
              {t3("Découvrir les fonctionnalités", "Discover features", "اكتشف الميزات")}
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <LandingFooter />
    </div>
  );
}
