import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import React from "react";

export const metadata: Metadata = {
  title: "Finanzas para Hispanos en Estados Unidos | Finazo",
  description:
    "Compara préstamos personales, seguro de salud, seguro de auto y más para hispanos en EE.UU. Información en español, incluye opciones con ITIN.",
  alternates: {
    canonical: "https://finazo.lat/us",
    languages: {
      "es-US": "https://finazo.lat/us",
      "en-US": "https://finazo.lat/en/us",
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

const TARGET_STATES = [
  { slug: "california", name: "California", abbr: "CA" },
  { slug: "texas", name: "Texas", abbr: "TX" },
  { slug: "florida", name: "Florida", abbr: "FL" },
  { slug: "nueva-york", name: "Nueva York", abbr: "NY" },
  { slug: "illinois", name: "Illinois", abbr: "IL" },
  { slug: "arizona", name: "Arizona", abbr: "AZ" },
  { slug: "nueva-jersey", name: "Nueva Jersey", abbr: "NJ" },
  { slug: "colorado", name: "Colorado", abbr: "CO" },
  { slug: "nuevo-mexico", name: "Nuevo México", abbr: "NM" },
  { slug: "nevada", name: "Nevada", abbr: "NV" },
];

const PRODUCTS = [
  {
    href: "/us/prestamos",
    title: "Préstamos personales",
    description: "Compara APRs de SoFi, LightStream, Upgrade y más. Incluye opciones con ITIN sin SSN.",
    icon: "💵",
  },
  {
    href: "/us/seguro-de-salud",
    title: "Seguro de salud",
    description: "Planes del Marketplace ACA (Obamacare) con subsidios. Inscripción en español.",
    icon: "🏥",
  },
  {
    href: "/us/seguro-de-auto",
    title: "Seguro de auto",
    description: "Tarifas promedio por estado y proveedores con atención en español.",
    icon: "🚗",
  },
  {
    href: "/us/seguro-de-vida",
    title: "Seguro de vida",
    description: "Seguro de vida a término desde $10/mes. Protege a tu familia sin importar tu estatus.",
    icon: "🛡️",
  },
  {
    href: "/us/credito",
    title: "Construir crédito",
    description: "Cómo empezar tu historial crediticio en EE.UU. siendo inmigrante hispano.",
    icon: "📈",
  },
];

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Finanzas para Hispanos en EE.UU.",
  description: "Comparador de productos financieros para la comunidad hispana en Estados Unidos",
  url: "https://finazo.lat/us",
  inLanguage: "es-US",
  audience: {
    "@type": "Audience",
    audienceType: "Hispanic Americans",
    geographicArea: {
      "@type": "Country",
      name: "United States",
    },
  },
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
        text: "Sí. Varias instituciones como Upgrade, Self Financial y Accion Opportunity Fund aceptan ITIN (Individual Taxpayer Identification Number) en lugar de Social Security Number. El ITIN se obtiene con el formulario W-7 del IRS. Tener ITIN te permite acceder a préstamos personales, tarjetas de crédito y cuentas bancarias.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué es el seguro de salud ACA y cómo aplico siendo hispano?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "El ACA (Affordable Care Act, o Ley de Cuidado de Salud a Bajo Precio) es el programa federal que permite comprar seguro de salud en el Marketplace con subsidios según tu ingreso. Puedes inscribirte en español en HealthCare.gov o llamando al 1-800-318-2596. Si tu ingreso es menor a 400% del nivel federal de pobreza, calificas para reducir tu prima mensual.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cómo empiezo a construir crédito en EE.UU. si soy inmigrante?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Hay tres formas efectivas de empezar desde cero: (1) abrir una tarjeta de crédito asegurada (secured credit card), donde depositas $200-500 como garantía y usas la tarjeta para generar historial; (2) obtener un préstamo para construir crédito (credit builder loan) como los de Self Financial; (3) ser usuario autorizado en la tarjeta de alguien con buen historial. Los tres reportan a las tres agencias de crédito (Equifax, Experian, TransUnion) y construyen tu score en 6-12 meses.",
      },
    },
    {
      "@type": "Question",
      name: "¿El seguro de auto es obligatorio en todos los estados de EE.UU.?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí, en prácticamente todos los estados. El mínimo requerido es la cobertura de responsabilidad civil (liability), que paga los daños que causes a otros en un accidente. Los estados con los requisitos mínimos más bajos son Florida y New Hampshire. California, Texas y Florida tienen las primas más altas del país para conductores hispanos en zonas urbanas.",
      },
    },
  ],
};

const speakableSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", ".speakable-intro", ".product-cards"],
  },
  url: "https://finazo.lat/us",
};

export default function UsHubPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }}
      />
      <Header />
      <main className="min-h-screen" style={{ background: "var(--background)" }}>
        {/* Hero */}
        <section style={{ background: "var(--green-bg)", borderBottom: "1px solid #d1e8d9" }}>
          <div
            className="mx-auto px-6 py-16"
            style={{ maxWidth: "var(--W)" }}
          >
            <div className="mb-4">
              <span
                className="inline-flex items-center gap-2 text-sm font-medium"
                style={{ color: "var(--green)" }}
              >
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{
                    background: "var(--green)",
                    animation: "pulse 2s infinite",
                  }}
                />
                Para hispanos en EE.UU.
              </span>
            </div>
            <h1
              className="mb-4 font-bold leading-tight speakable-intro"
              style={{
                fontFamily: "var(--font-lora), Georgia, serif",
                fontSize: "clamp(32px, 4.5vw, 48px)",
                color: "#111",
              }}
            >
              Tu dinero, en español —{" "}
              <span style={{ color: "var(--green)" }}>
                finanzas para hispanos en Estados Unidos
              </span>
            </h1>
            <p
              className="text-lg max-w-2xl mb-6 speakable-intro"
              style={{ color: "#555" }}
            >
              Compara préstamos, seguros y productos financieros diseñados para
              la comunidad hispana. Información clara en español, con opciones
              disponibles con ITIN y sin historial crediticio previo.
            </p>
            <div
              className="flex flex-wrap gap-4 text-xs"
              style={{ color: "#666" }}
            >
              {[
                "ITIN aceptado",
                "Sin historial previo",
                "Información en español",
              ].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <span style={{ color: "var(--green)" }}>✓</span> {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Product cards */}
        <section className="px-6 py-16" style={{ background: "#fff" }}>
          <div className="mx-auto" style={{ maxWidth: "var(--W)" }}>
            <h2
              className="mb-8 text-xl font-bold"
              style={{ color: "#111" }}
            >
              ¿Qué estás buscando?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 product-cards">
              {PRODUCTS.map((product) => {
                const iconSvgMap: Record<string, React.ReactNode> = {
                  "💵": (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        width: 20,
                        height: 20,
                        color: "var(--green)",
                      }}
                    >
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  ),
                  "🏥": (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        width: 20,
                        height: 20,
                        color: "var(--green)",
                      }}
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  ),
                  "🚗": (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        width: 20,
                        height: 20,
                        color: "var(--green)",
                      }}
                    >
                      <path d="M5 17H3v-5l2-5h14l2 5v5h-2M5 17h14M8 17v2M16 17v2M3 12h18" />
                    </svg>
                  ),
                  "🛡️": (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        width: 20,
                        height: 20,
                        color: "var(--green)",
                      }}
                    >
                      <path d="M12 3L4 7v5c0 5 3.6 9.3 8 10 4.4-.7 8-5 8-10V7L12 3z" />
                    </svg>
                  ),
                  "📈": (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        width: 20,
                        height: 20,
                        color: "var(--green)",
                      }}
                    >
                      <path d="M3 3v18h18" />
                      <path d="M18 9l-5 5-4-4-3 3" />
                    </svg>
                  ),
                };

                return (
                  <Link
                    key={product.href}
                    href={product.href}
                    className="group block rounded-2xl p-6 transition-shadow hover:shadow-md"
                    style={{
                      background: "#fff",
                      border: "1px solid #d1e8d9",
                    }}
                  >
                    <div
                      className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{ background: "var(--green-bg)" }}
                    >
                      {iconSvgMap[product.icon]}
                    </div>
                    <h3
                      className="font-semibold mb-1 group-hover:text-emerald-700 transition-colors"
                      style={{ color: "#111" }}
                    >
                      {product.title}
                    </h3>
                    <p className="text-sm" style={{ color: "#666" }}>
                      {product.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* State selector */}
        <section
          className="px-6 py-14"
          style={{
            background: "var(--background)",
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <div className="mx-auto" style={{ maxWidth: "var(--W)" }}>
            <div
              className="rounded-2xl p-6"
              style={{ background: "#fff", border: "1px solid #d1e8d9" }}
            >
              <h2 className="text-lg font-semibold mb-1" style={{ color: "#111" }}>
                Encuentra opciones en tu estado
              </h2>
              <p className="text-sm mb-5" style={{ color: "#666" }}>
                Selecciona tu estado para ver préstamos y seguros disponibles en tu área.
              </p>
              <div className="flex flex-wrap gap-2">
                {TARGET_STATES.map((state) => (
                  <Link
                    key={state.slug}
                    href={`/us/prestamos/${state.slug}`}
                    className="rounded-full border px-4 py-1.5 text-sm font-medium transition-colors border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                  >
                    {state.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Trust signals */}
        <section
          className="px-6 py-14"
          style={{
            background: "var(--green-bg)",
            borderTop: "1px solid #d1e8d9",
            borderBottom: "1px solid #d1e8d9",
          }}
        >
          <div className="mx-auto" style={{ maxWidth: "var(--W)" }}>
            <h2
              className="mb-8 text-center font-bold"
              style={{
                fontFamily: "var(--font-lora), Georgia, serif",
                fontSize: "var(--text-2xl)",
                color: "#111",
              }}
            >
              ¿Por qué confiar en Finazo?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  title: "Independiente",
                  desc: "No recibimos pagos para posicionar productos. Los resultados se ordenan por lo que es mejor para ti.",
                },
                {
                  title: "Datos verificados",
                  desc: "Tasas y primas obtenidas directamente de fuentes oficiales (CMS, CFPB, NAIC).",
                },
                {
                  title: "En español",
                  desc: "Toda la información disponible en tu idioma, sin letras pequeñas.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl p-6"
                  style={{
                    background: "#fff",
                    border: "1px solid #d1e8d9",
                  }}
                >
                  <p className="font-semibold mb-2" style={{ color: "#111" }}>
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

        {/* FAQ */}
        <section className="px-6 py-14" style={{ background: "#fff" }}>
          <div className="mx-auto" style={{ maxWidth: "var(--W)" }}>
            <h2
              className="mb-8 text-xl font-bold"
              style={{ color: "#111" }}
            >
              Preguntas frecuentes
            </h2>
            <div className="space-y-4">
              {faqSchema.mainEntity.map((faq, i) => (
                <div
                  key={i}
                  className="rounded-2xl p-6"
                  style={{
                    background: "var(--background)",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <h3 className="font-semibold mb-2" style={{ color: "#111" }}>
                    {faq.name}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#666" }}>
                    {faq.acceptedAnswer.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
