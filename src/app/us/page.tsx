import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

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
      <main className="min-h-screen bg-slate-50">
        {/* Hero */}
        <section className="bg-white border-b border-slate-200">
          <div className="mx-auto max-w-5xl px-6 py-16">
            <div className="mb-3">
              <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 border border-emerald-200">
                Para hispanos en EE.UU.
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 speakable-intro">
              Tu dinero, en español —<br className="hidden sm:block" /> finanzas para hispanos en Estados Unidos
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl speakable-intro">
              Compara préstamos, seguros y productos financieros diseñados para
              la comunidad hispana. Información clara en español, con opciones
              disponibles con ITIN y sin historial crediticio previo.
            </p>
          </div>
        </section>

        {/* Product cards */}
        <section className="mx-auto max-w-5xl px-6 py-12 product-cards">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">
            ¿Qué estás buscando?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRODUCTS.map((product) => (
              <Link
                key={product.href}
                href={product.href}
                className="bg-white rounded-xl border border-slate-200 p-6 hover:border-emerald-400 hover:shadow-sm transition-all group"
              >
                <div className="text-3xl mb-3">{product.icon}</div>
                <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-emerald-700">
                  {product.title}
                </h3>
                <p className="text-sm text-slate-500">{product.description}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* State selector */}
        <section className="mx-auto max-w-5xl px-6 pb-12">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-1">
              Encuentra opciones en tu estado
            </h2>
            <p className="text-sm text-slate-500 mb-5">
              Selecciona tu estado para ver préstamos y seguros disponibles en tu área.
            </p>
            <div className="flex flex-wrap gap-2">
              {TARGET_STATES.map((state) => (
                <Link
                  key={state.slug}
                  href={`/us/prestamos/${state.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-emerald-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                >
                  <span className="text-xs text-slate-400">{state.abbr}</span>
                  {state.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Trust signals */}
        <section className="mx-auto max-w-5xl px-6 pb-12">
          <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-6">
            <h2 className="font-semibold text-emerald-900 mb-3">
              ¿Por qué confiar en Finazo?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-emerald-800">
              <div>
                <strong>Independiente</strong> — no recibimos pagos para posicionar productos. Los resultados se ordenan por lo que es mejor para ti.
              </div>
              <div>
                <strong>Datos verificados</strong> — tasas y primas obtenidas directamente de fuentes oficiales (CMS, CFPB, NAIC).
              </div>
              <div>
                <strong>En español</strong> — toda la información disponible en tu idioma, sin letras pequeñas.
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-5xl px-6 pb-16">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">
            Preguntas frecuentes
          </h2>
          <div className="space-y-4">
            {faqSchema.mainEntity.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-5">
                <h3 className="font-medium text-slate-900 mb-2">{faq.name}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {faq.acceptedAnswer.text}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
