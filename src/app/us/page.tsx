import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FaqAccordion } from "@/components/home/FaqAccordion";
import { ArticlesScroll } from "@/components/home/ArticlesScroll";
import { getPublishedArticles } from "@/lib/queries/articles";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Finanzas para Hispanos en Estados Unidos | Finazo",
  description:
    "Compara préstamos personales, seguro de salud, seguro de auto y más para hispanos en EE.UU. Información en español, incluye opciones con ITIN.",
  alternates: {
    canonical: "https://finazo.lat/us",
    languages: {
      "es-US": "https://finazo.lat/us",
      "x-default": "https://finazo.lat/us",
    },
  },
  openGraph: {
    title: "Finanzas para Hispanos en EE.UU. | Finazo",
    description:
      "Préstamos, seguros y educación financiera en español para la comunidad hispana en Estados Unidos.",
    url: "https://finazo.lat/us",
    locale: "es_US",
  },
};

// ── Data ───────────────────────────────────────────────────────────────────

const PRODUCTS = [
  {
    title: "Préstamos personales",
    tag: "Con ITIN",
    tagVariant: "pop" as const,
    desc: "Compara APRs de SoFi, LightStream, Upgrade y más. Incluye opciones con ITIN sin SSN.",
    chips: ["SoFi", "LightStream", "Upgrade", "Avant"],
    href: "/us/prestamos",
    active: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22, color: "var(--green)" }}>
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    title: "Seguro de salud",
    tag: "ACA / Obamacare",
    tagVariant: "ssf" as const,
    desc: "Planes del Marketplace con subsidios federales. Opciones para familias hispanas en español.",
    chips: ["Blue Cross", "Kaiser", "Molina", "Ambetter"],
    href: "/us/seguro-de-salud",
    active: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22, color: "var(--green)" }}>
        <path d="M12 5v14M5 12h14" />
      </svg>
    ),
  },
  {
    title: "Seguro de auto",
    tag: "Por estado",
    tagVariant: "pop" as const,
    desc: "Tarifas promedio por estado. Proveedores con atención en español y licencia extranjera.",
    chips: ["State Farm", "GEICO", "Progressive", "Farmers"],
    href: "/us/seguro-de-auto",
    active: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22, color: "var(--green)" }}>
        <path d="M5 17H3v-5l2-5h14l2 5v5h-2M5 17h14M8 17v2M16 17v2" />
      </svg>
    ),
  },
  {
    title: "Seguro de vida",
    tag: "Desde $10/mes",
    tagVariant: "ssf" as const,
    desc: "Seguro de vida a término para proteger a tu familia. Sin importar tu estatus migratorio.",
    chips: ["Haven Life", "Ladder", "Bestow", "Ethos"],
    href: "/us/seguro-de-vida",
    active: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22, color: "var(--green)" }}>
        <path d="M12 3L4 7v5c0 5 3.6 9.3 8 10 4.4-.7 8-5 8-10V7L12 3z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Construir crédito",
    tag: "Próximamente",
    tagVariant: "soon" as const,
    desc: "Cómo empezar tu historial crediticio en EE.UU. siendo inmigrante hispano.",
    chips: ["Self", "Chime", "Secured cards", "Credit builder"],
    href: "/us/credito",
    active: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22, color: "var(--green)" }}>
        <path d="M3 3v18h18" />
        <path d="M18 9l-5 5-4-4-3 3" />
      </svg>
    ),
  },
];

const METRICS = [
  { value: "57M", label: "hispanos en EE.UU." },
  { value: "ITIN", label: "aceptado" },
  { value: "10", label: "estados cubiertos" },
  { value: "5", label: "categorías" },
];

const TRUST = [
  {
    title: "Datos verificados",
    desc: "Tasas y primas obtenidas directamente de fuentes oficiales: CFPB, CMS y NAIC.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
        <path d="M12 3L4 7v5c0 5 3.6 9.3 8 10 4.4-.7 8-5 8-10V7L12 3z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "ITIN aceptado",
    desc: "Incluimos opciones para quienes no tienen SSN. Filtramos prestamistas que aceptan ITIN.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
      </svg>
    ),
  },
  {
    title: "Independiente",
    desc: "No somos propiedad de ningún banco ni aseguradora. Nuestras comparaciones no se venden.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    title: "100% gratis",
    desc: "Sin registro, sin suscripción, sin costos ocultos. Comparas gratis, siempre.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
];

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Elige qué necesitas",
    desc: "Selecciona préstamos, seguros o guías de crédito para hispanos.",
  },
  {
    step: "2",
    title: "Compara lado a lado",
    desc: "APRs reales, primas y condiciones de todos los proveedores en una sola tabla.",
  },
  {
    step: "3",
    title: "Aplica directamente",
    desc: "Haz clic en el proveedor que más te conviene y aplica en su sitio. Sin intermediarios.",
  },
];

const TARGET_STATES = [
  { slug: "california", name: "California", abbr: "CA", desc: "15.7M hispanos — el estado con mayor población latina" },
  { slug: "texas", name: "Texas", abbr: "TX", desc: "11.5M hispanos — mercado de seguros muy competitivo" },
  { slug: "florida", name: "Florida", abbr: "FL", desc: "5.7M hispanos — gran comunidad cubana y puertorriqueña" },
  { slug: "nueva-york", name: "Nueva York", abbr: "NY", desc: "3.8M hispanos — comunidad dominicana y puertorriqueña" },
  { slug: "illinois", name: "Illinois", abbr: "IL", desc: "2.2M hispanos — Chicago concentra la mayoría" },
  { slug: "arizona", name: "Arizona", abbr: "AZ", desc: "2.3M hispanos — fronterizo con México" },
  { slug: "nueva-jersey", name: "Nueva Jersey", abbr: "NJ", desc: "1.9M hispanos — comunidad centroamericana" },
  { slug: "colorado", name: "Colorado", abbr: "CO", desc: "1.2M hispanos — crecimiento acelerado" },
  { slug: "nuevo-mexico", name: "Nuevo México", abbr: "NM", desc: "1.0M hispanos — 49% de la población total" },
  { slug: "nevada", name: "Nevada", abbr: "NV", desc: "876K hispanos — Las Vegas y Reno" },
];

// ── Structured Data ────────────────────────────────────────────────────────

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Finanzas para Hispanos en EE.UU.",
  description: "Comparador de productos financieros para la comunidad hispana en Estados Unidos",
  url: "https://finazo.lat/us",
  inLanguage: "es-US",
  audience: {
    "@type": "Audience",
    audienceType: "Hispanic Americans",
    geographicArea: { "@type": "Country", name: "United States" },
  },
};

const authorSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Javier Keough",
  sameAs: "https://sv.linkedin.com/in/javier-keough",
  jobTitle: "Editor y fundador",
  worksFor: { "@type": "Organization", name: "Finazo", url: "https://finazo.lat" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Puedo obtener un préstamo en EE.UU. con ITIN y sin SSN?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. Varias instituciones como Upgrade, Self Financial y Accion Opportunity Fund aceptan ITIN. El ITIN se obtiene con el formulario W-7 del IRS y te da acceso a préstamos, tarjetas y cuentas bancarias.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué es el seguro de salud ACA y cómo aplico siendo hispano?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "El ACA (Affordable Care Act) permite comprar seguro de salud en el Marketplace con subsidios. Puedes inscribirte en español en HealthCare.gov. Si tu ingreso es menor al 400% del nivel federal de pobreza, calificas para reducir tu prima mensual.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cómo empiezo a construir crédito en EE.UU. si soy inmigrante?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Hay tres formas efectivas: (1) abrir una tarjeta de crédito asegurada (secured credit card); (2) obtener un credit builder loan como los de Self Financial; (3) ser usuario autorizado en la tarjeta de alguien con buen historial. Los tres reportan a Equifax, Experian y TransUnion.",
      },
    },
    {
      "@type": "Question",
      name: "¿El seguro de auto es obligatorio en todos los estados de EE.UU.?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí, en prácticamente todos los estados. El mínimo requerido es la cobertura de responsabilidad civil (liability). California, Texas y Florida tienen las primas más altas para conductores en zonas urbanas.",
      },
    },
  ],
};

// ── Page ───────────────────────────────────────────────────────────────────

export default async function UsHubPage() {
  const recentArticles = await getPublishedArticles({ country: "US" });
  const featuredArticles = recentArticles.slice(0, 6);

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(authorSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Header />

      <main>
        {/* ── HERO ── */}
        <section style={{ background: "var(--green-bg)", borderBottom: "1px solid #d1e8d9" }}>
          <div className="mx-auto px-6 py-20" style={{ maxWidth: "var(--W)" }}>
            <div className="mx-auto max-w-2xl text-center">
              {/* Kicker */}
              <div className="mb-5 inline-flex items-center gap-2">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ background: "var(--green)", animation: "pulse 2s infinite" }}
                />
                <span className="text-sm font-medium" style={{ color: "var(--green)" }}>
                  Para hispanos en EE.UU.
                </span>
              </div>

              <h1
                className="mb-5 font-bold leading-tight"
                style={{
                  fontFamily: "var(--font-lora), Georgia, serif",
                  fontSize: "clamp(36px, 5.5vw, 56px)",
                  color: "#111",
                }}
              >
                Tu dinero rinde más{" "}
                <span style={{ color: "var(--green)" }}>cuando comparas primero</span>
              </h1>

              <p className="mx-auto mb-8 max-w-lg text-lg" style={{ color: "#555" }}>
                Compara préstamos, seguros y productos financieros para hispanos en EE.UU.
                En español, con opciones disponibles con ITIN.
              </p>

              {/* CTAs */}
              <div className="flex flex-col items-center gap-3">
                <Link
                  href="/us/prestamos"
                  className="rounded-full px-8 py-3.5 text-sm font-semibold text-white transition-colors"
                  style={{ background: "var(--green)" }}
                >
                  Comparar préstamos →
                </Link>
                <Link
                  href="/us/seguro-de-salud"
                  className="text-sm font-medium transition-colors"
                  style={{ color: "var(--green)" }}
                >
                  Ver seguros de salud →
                </Link>
              </div>

              {/* Trust checkmarks */}
              <div className="mt-7 flex flex-wrap justify-center gap-4 text-xs" style={{ color: "#666" }}>
                {["ITIN aceptado", "Sin historial previo", "En español"].map((t) => (
                  <span key={t} className="flex items-center gap-1.5">
                    <span style={{ color: "var(--green)" }}>✓</span>
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Live loan comparison card */}
            <div
              className="mx-auto mt-14 rounded-2xl p-6 shadow-md"
              style={{ maxWidth: "520px", background: "#fff", border: "1px solid #d1e8d9" }}
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#999" }}>
                    Préstamo personal $10,000
                  </p>
                  <p className="text-sm font-semibold" style={{ color: "#111" }}>
                    Hispanos en EE.UU.
                  </p>
                </div>
                <span
                  className="rounded-full px-3 py-1 text-xs font-semibold"
                  style={{ background: "#dcfce7", color: "#166534" }}
                >
                  ● En vivo
                </span>
              </div>

              <div className="space-y-2">
                {[
                  { name: "SoFi", apr: "8.99%", monthly: "$207/mo", itin: false, best: true },
                  { name: "LightStream", apr: "9.49%", monthly: "$210/mo", itin: false, best: false },
                  { name: "Upgrade", apr: "9.99%", monthly: "$213/mo", itin: true, best: false },
                ].map((row) => (
                  <div
                    key={row.name}
                    className="flex items-center justify-between rounded-xl px-4 py-3"
                    style={{
                      background: row.best ? "var(--green-bg)" : "#f9fafb",
                      border: row.best ? "1px solid #a3c9b0" : "1px solid transparent",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {row.best && (
                        <span
                          className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                          style={{ background: "var(--green)", color: "#fff" }}
                        >
                          MEJOR
                        </span>
                      )}
                      <div>
                        <span className="text-sm font-semibold" style={{ color: "#111" }}>
                          {row.name}
                        </span>
                        {row.itin && (
                          <span
                            className="ml-2 rounded-full px-1.5 py-0.5 text-[10px] font-semibold"
                            style={{ background: "#DDEEFF", color: "#1E5AAD" }}
                          >
                            ITIN ✓
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold" style={{ color: row.best ? "var(--green)" : "#111" }}>
                        APR {row.apr}
                      </p>
                      <p className="text-xs" style={{ color: "#999" }}>
                        {row.monthly}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/us/prestamos/california"
                className="mt-4 block text-center text-sm font-semibold transition-colors"
                style={{ color: "var(--green)" }}
              >
                Ver comparación completa →
              </Link>
            </div>
          </div>
        </section>

        {/* ── METRICS ── */}
        <section style={{ background: "#fff", borderBottom: "1px solid #e8ede9" }}>
          <div className="mx-auto px-6 py-5" style={{ maxWidth: "var(--W)" }}>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 text-center">
              {METRICS.map((m) => (
                <div key={m.label}>
                  <p
                    className="text-2xl font-bold"
                    style={{ fontFamily: "var(--font-lora), Georgia, serif", color: "var(--green)" }}
                  >
                    {m.value}
                  </p>
                  <p className="text-xs" style={{ color: "#888" }}>
                    {m.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRODUCTS ── */}
        <section className="px-6 py-16" style={{ background: "var(--background)" }}>
          <div className="mx-auto" style={{ maxWidth: "var(--W)" }}>
            <h2
              className="mb-2 text-2xl font-bold"
              style={{ fontFamily: "var(--font-lora), Georgia, serif", color: "#111" }}
            >
              ¿Qué quieres comparar?
            </h2>
            <p className="mb-10 text-sm" style={{ color: "#888" }}>
              Datos reales de los proveedores más usados por hispanos en EE.UU.
            </p>

            <div
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                overflow: "hidden",
                background: "#fff",
              }}
            >
              {PRODUCTS.map((p, i) => {
                const tagStyle =
                  p.tagVariant === "pop"
                    ? { background: "#C6ECD9", color: "var(--green)" }
                    : p.tagVariant === "ssf"
                    ? { background: "#DDEEFF", color: "#1E5AAD" }
                    : { background: "#F0F0EE", color: "#888" };

                const row = (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "52px 1fr auto",
                      alignItems: "center",
                      borderBottom: i < PRODUCTS.length - 1 ? "1px solid #e5e7eb" : "none",
                      opacity: p.active ? 1 : 0.45,
                      pointerEvents: p.active ? "auto" : "none",
                    }}
                  >
                    {/* icon column */}
                    <div
                      style={{
                        background: "var(--green-bg)",
                        borderRight: "1px solid #e5e7eb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        alignSelf: "stretch",
                      }}
                    >
                      {p.icon}
                    </div>

                    {/* body column */}
                    <div style={{ padding: "18px 20px" }}>
                      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                        <span style={{ fontWeight: 700, fontSize: "15px", color: "#111" }}>{p.title}</span>
                        <span
                          style={{
                            ...tagStyle,
                            fontSize: "11px",
                            fontWeight: 600,
                            padding: "2px 9px",
                            borderRadius: "999px",
                          }}
                        >
                          {p.tag}
                        </span>
                      </div>
                      <p style={{ fontSize: "13px", color: "#666", marginBottom: "8px", lineHeight: 1.5 }}>
                        {p.desc}
                      </p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {p.chips.map((chip) => (
                          <span
                            key={chip}
                            style={{
                              fontSize: "11px",
                              fontWeight: 500,
                              padding: "3px 10px",
                              borderRadius: "999px",
                              background: "#f3f4f6",
                              color: "#555",
                            }}
                          >
                            {chip}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* action column */}
                    <div style={{ padding: "18px 20px" }}>
                      {p.active ? (
                        <Link
                          href={p.href}
                          style={{
                            display: "inline-block",
                            background: "var(--green)",
                            color: "#fff",
                            fontSize: "13px",
                            fontWeight: 600,
                            padding: "9px 18px",
                            borderRadius: "6px",
                            whiteSpace: "nowrap",
                            textDecoration: "none",
                          }}
                        >
                          Comparar
                        </Link>
                      ) : (
                        <span
                          style={{
                            display: "inline-block",
                            background: "#f3f4f6",
                            color: "#999",
                            fontSize: "13px",
                            fontWeight: 600,
                            padding: "9px 18px",
                            borderRadius: "6px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Próximamente
                        </span>
                      )}
                    </div>
                  </div>
                );

                return p.active ? (
                  <div key={p.href} style={{ overflow: "hidden" }}>
                    {row}
                  </div>
                ) : (
                  <div key={p.href}>{row}</div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── TRUST ── */}
        <section
          className="px-6 py-14"
          style={{ background: "var(--green-bg)", borderTop: "1px solid #d1e8d9", borderBottom: "1px solid #d1e8d9" }}
        >
          <div className="mx-auto" style={{ maxWidth: "var(--W)" }}>
            <h2
              className="mb-8 text-center font-bold"
              style={{ fontFamily: "var(--font-lora), Georgia, serif", fontSize: "var(--text-2xl)", color: "#111" }}
            >
              ¿Por qué confiar en Finazo?
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {TRUST.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl p-5"
                  style={{ background: "#fff", border: "1px solid #d1e8d9", boxShadow: "var(--shadow-sm)" }}
                >
                  <div
                    className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ background: "var(--green-bg)", color: "var(--green)" }}
                  >
                    {item.icon}
                  </div>
                  <p className="mb-1 font-semibold" style={{ color: "#111" }}>
                    {item.title}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: "#666" }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="px-6 py-16" style={{ background: "#fff" }}>
          <div className="mx-auto" style={{ maxWidth: "var(--W)" }}>
            <h2
              className="mb-10 text-2xl font-bold"
              style={{ fontFamily: "var(--font-lora), Georgia, serif", color: "#111" }}
            >
              ¿Cómo funciona?
            </h2>
            <div className="grid gap-10 sm:grid-cols-3">
              {HOW_IT_WORKS.map((step, i) => (
                <div key={i}>
                  <p
                    className="mb-3 text-4xl font-bold"
                    style={{ fontFamily: "var(--font-lora), Georgia, serif", color: "#eef4f0" }}
                  >
                    {step.step}
                  </p>
                  <h3 className="mb-2 font-semibold" style={{ color: "#111" }}>
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#666" }}>
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── STATES ── */}
        <section
          className="px-6 py-14"
          style={{ background: "var(--background)", borderTop: "1px solid #e5e7eb" }}
        >
          <div className="mx-auto" style={{ maxWidth: "var(--W)" }}>
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2
                  className="text-2xl font-bold"
                  style={{ fontFamily: "var(--font-lora), Georgia, serif", color: "#111" }}
                >
                  Opciones por estado
                </h2>
                <p className="mt-1 text-sm" style={{ color: "#888" }}>
                  Compara préstamos y seguros disponibles en tu área
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {TARGET_STATES.map((s) => (
                <Link
                  key={s.slug}
                  href={`/us/prestamos/${s.slug}`}
                  className="group rounded-2xl p-5 transition-shadow hover:shadow-md"
                  style={{ background: "#fff", border: "1px solid #e5e7eb", textDecoration: "none" }}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span
                      className="rounded-full px-2.5 py-1 text-xs font-bold"
                      style={{ background: "var(--green-bg)", color: "var(--green)" }}
                    >
                      {s.abbr}
                    </span>
                    <span
                      className="text-sm transition-transform group-hover:translate-x-1"
                      style={{ color: "var(--green)" }}
                    >
                      →
                    </span>
                  </div>
                  <p className="mb-1 font-semibold" style={{ color: "#111" }}>
                    {s.name}
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: "#888" }}>
                    {s.desc}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── ARTICLES ── */}
        <ArticlesScroll articles={featuredArticles} />

        {/* ── FAQ ── */}
        <section
          className="px-6 py-14"
          style={{ background: "#fff", borderTop: "1px solid #e5e7eb" }}
        >
          <div className="mx-auto" style={{ maxWidth: "var(--W)" }}>
            <h2
              className="mb-8 text-2xl font-bold"
              style={{ fontFamily: "var(--font-lora), Georgia, serif", color: "#111" }}
            >
              Preguntas frecuentes
            </h2>
            <FaqAccordion />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
