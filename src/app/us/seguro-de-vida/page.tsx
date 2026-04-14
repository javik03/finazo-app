import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Seguro de Vida para Hispanos en EE.UU. — Desde $10/mes | Finazo",
  description:
    "Compara seguros de vida a término para hispanos en Estados Unidos. Planes desde $10/mes sin importar tu estatus migratorio. Guía en español 2025.",
  alternates: {
    canonical: "https://finazo.lat/us/seguro-de-vida",
    languages: {
      "es-US": "https://finazo.lat/us/seguro-de-vida",
      "x-default": "https://finazo.lat/us/seguro-de-vida",
    },
  },
  openGraph: {
    title: "Seguro de Vida para Hispanos en EE.UU. | Finazo",
    description:
      "Desde $10/mes. Sin importar tu estatus. Beneficiarios en cualquier país. Comparación en español.",
    url: "https://finazo.lat/us/seguro-de-vida",
    locale: "es_US",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://finazo.lat" },
    { "@type": "ListItem", position: 2, name: "EE.UU.", item: "https://finazo.lat/us" },
    { "@type": "ListItem", position: 3, name: "Seguro de vida", item: "https://finazo.lat/us/seguro-de-vida" },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Puedo obtener seguro de vida en EE.UU. siendo indocumentado o sin SSN?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí, varias compañías ofrecen seguros de vida a inmigrantes sin estatus legal o sin SSN. Bestow, Haven Life y State Farm aceptan ITIN (Individual Taxpayer Identification Number) en algunos casos. Se requiere generalmente: residir en EE.UU., ser mayor de 18 años y pasar el examen médico. Los beneficiarios pueden estar en cualquier país — tus familiares en México, El Salvador o Guatemala pueden recibir el beneficio.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué es el seguro de vida a término y cuánto cuesta?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "El seguro de vida a término (term life) te protege por un período fijo (10, 20 o 30 años) a cambio de una prima mensual fija. Si falleces durante ese período, tus beneficiarios reciben el monto asegurado libre de impuestos. Para un hombre hispano de 35 años en buena salud: $250,000 de cobertura por 20 años cuesta aproximadamente $18-25/mes. Para mujeres, las primas son 15-20% más bajas. Cuanto más joven y saludable, más barata la prima.",
      },
    },
    {
      "@type": "Question",
      name: "¿Mis familiares en otro país pueden ser beneficiarios del seguro de vida?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. En EE.UU. puedes designar beneficiarios en cualquier país del mundo. Tu esposa en México, tus padres en El Salvador o tus hijos en Guatemala pueden recibir el beneficio de muerte. El pago puede hacerse por transferencia bancaria internacional. Algunas compañías como State Farm y MetLife tienen experiencia específica pagando beneficios a beneficiarios en LATAM.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuánto seguro de vida necesito?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La regla general es tener 10-12 veces tu ingreso anual en cobertura. Si ganas $40,000/año, busca $400,000-$480,000 de cobertura. Factores importantes: número de dependientes, deuda pendiente (hipoteca, préstamos), gastos de funeral (~$9,000 promedio en EE.UU.), y si envías remesas — considera cuánto tiempo tu familia dependería de esas remesas si falleceras.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué diferencia hay entre seguro de vida a término y seguro de vida permanente?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "El seguro a término (term life) es temporal (10-30 años), más económico y sin valor en efectivo acumulado. El seguro permanente (whole life, universal life) dura toda la vida, acumula valor en efectivo, pero cuesta 5-15 veces más. Para la mayoría de familias hispanas de ingresos bajos a medios, el seguro a término es la mejor opción — protección máxima al menor costo durante los años de mayor responsabilidad financiera.",
      },
    },
  ],
};

const speakableSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", ".intro-text", ".rates-grid"],
  },
  url: "https://finazo.lat/us/seguro-de-vida",
};

const SAMPLE_RATES = [
  { age: 25, gender: "Hombre", health: "Excelente", coverage: "$250,000", term: "20 años", monthly: "$13" },
  { age: 35, gender: "Hombre", health: "Excelente", coverage: "$250,000", term: "20 años", monthly: "$18" },
  { age: 35, gender: "Mujer", health: "Excelente", coverage: "$250,000", term: "20 años", monthly: "$15" },
  { age: 35, gender: "Hombre", health: "Buena", coverage: "$250,000", term: "20 años", monthly: "$25" },
  { age: 40, gender: "Hombre", health: "Excelente", coverage: "$250,000", term: "20 años", monthly: "$26" },
  { age: 40, gender: "Mujer", health: "Excelente", coverage: "$250,000", term: "20 años", monthly: "$21" },
  { age: 45, gender: "Hombre", health: "Excelente", coverage: "$250,000", term: "20 años", monthly: "$41" },
  { age: 35, gender: "Hombre", health: "Excelente", coverage: "$500,000", term: "20 años", monthly: "$29" },
  { age: 35, gender: "Hombre", health: "Excelente", coverage: "$1,000,000", term: "20 años", monthly: "$50" },
];

const PROVIDERS = [
  {
    name: "Haven Life",
    minCoverage: "$100,000",
    maxCoverage: "$3,000,000",
    terms: "10, 15, 20, 30 años",
    itin: true,
    highlight: "100% en línea, sin examen médico hasta $500K",
    startPrice: "$10/mes",
  },
  {
    name: "Bestow",
    minCoverage: "$50,000",
    maxCoverage: "$1,500,000",
    terms: "10, 15, 20, 25, 30 años",
    itin: true,
    highlight: "Sin examen médico, aprobación en minutos",
    startPrice: "$11/mes",
  },
  {
    name: "State Farm",
    minCoverage: "$100,000",
    maxCoverage: "$10,000,000",
    terms: "10, 20, 30 años",
    itin: false,
    highlight: "Red de agentes hispanos, servicio personalizado en español",
    startPrice: "$15/mes",
  },
  {
    name: "MetLife",
    minCoverage: "$100,000",
    maxCoverage: "$10,000,000",
    terms: "10, 15, 20 años",
    itin: false,
    highlight: "Experiencia pagando beneficios en LATAM",
    startPrice: "$16/mes",
  },
  {
    name: "Legal & General (Banner)",
    minCoverage: "$100,000",
    maxCoverage: "$10,000,000",
    terms: "10, 15, 20, 25, 30, 35, 40 años",
    itin: false,
    highlight: "Las primas más competitivas del mercado, plazo hasta 40 años",
    startPrice: "$12/mes",
  },
];

export default function UsSeguroVidaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }} />
      <Header />
      <main className="min-h-screen bg-slate-50">

        <div className="bg-white border-b border-slate-200">
          <div className="mx-auto max-w-5xl px-6 py-3 text-sm text-slate-500">
            <Link href="/" className="hover:text-emerald-600">Inicio</Link>
            {" / "}
            <Link href="/us" className="hover:text-emerald-600">EE.UU.</Link>
            {" / "}
            <span className="text-slate-800 font-medium">Seguro de vida</span>
          </div>
        </div>

        <section className="bg-white">
          <div className="mx-auto max-w-5xl px-6 py-12">
            <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 border border-emerald-200 mb-4">
              Mercado EE.UU. · Actualizado 2025
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Seguro de vida para hispanos en Estados Unidos
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl intro-text">
              Protege a tu familia — en EE.UU. o en tu país de origen — desde $10 al mes.
              Sin importar tu estatus migratorio. Los beneficiarios pueden estar en cualquier país.
            </p>
            <div className="mt-6 rounded-xl bg-emerald-50 border border-emerald-200 p-4 max-w-2xl">
              <p className="text-sm text-emerald-900">
                <strong>¿Por qué es urgente?</strong> El 60% de los trabajadores hispanos en EE.UU.
                no tiene seguro de vida. Un hombre de 35 años puede asegurar $250,000 por apenas
                $18/mes — el costo de una salida a comer. Tus familiares en LATAM pueden ser
                beneficiarios y recibir el pago.
              </p>
            </div>
          </div>
        </section>

        {/* Sample rates */}
        <section className="mx-auto max-w-5xl px-6 py-8 rates-grid">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Tarifas de ejemplo para personas hispanas en EE.UU.
          </h2>
          <p className="text-sm text-slate-600 mb-5">
            Primas mensuales estimadas para no fumadores. Las tarifas reales varían según estado,
            aseguradora e historial médico.
          </p>
          <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Edad</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Género</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Salud</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Cobertura</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Plazo</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Prima/mes</th>
                </tr>
              </thead>
              <tbody>
                {SAMPLE_RATES.map((row, i) => (
                  <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-900">{row.age} años</td>
                    <td className="px-4 py-3 text-slate-600">{row.gender}</td>
                    <td className="px-4 py-3 text-slate-600">{row.health}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">{row.coverage}</td>
                    <td className="px-4 py-3 text-slate-600">{row.term}</td>
                    <td className="px-4 py-3 font-bold text-emerald-700">{row.monthly}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Estimados basados en datos de mercado 2025. Solicita tu cotización exacta directamente con el proveedor.
          </p>
        </section>

        {/* Providers */}
        <section className="mx-auto max-w-5xl px-6 py-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Mejores proveedores para hispanos en EE.UU.
          </h2>
          <div className="space-y-4">
            {PROVIDERS.map((provider) => (
              <div key={provider.name} className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-slate-900">{provider.name}</h3>
                      {provider.itin && (
                        <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-medium">
                          Acepta ITIN
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{provider.highlight}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                      <span>Cobertura: {provider.minCoverage} – {provider.maxCoverage}</span>
                      <span>Plazos: {provider.terms}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-lg font-bold text-emerald-700">Desde {provider.startPrice}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-5xl px-6 py-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Cómo funciona: pasos para obtener tu seguro de vida
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { step: "1", title: "Define tu cobertura", desc: "Calcula cuánto necesitan tus dependientes: 10-12× tu ingreso anual es la guía estándar." },
              { step: "2", title: "Solicita en línea", desc: "Con Haven Life o Bestow, completas la solicitud en 20 minutos sin visitar una oficina. SSN o ITIN aceptado." },
              { step: "3", title: "Examen médico", desc: "Para coberturas altas (+$500K) se requiere un examen gratuito en tu domicilio. Para coberturas menores, solo preguntas de salud." },
              { step: "4", title: "Designa beneficiarios", desc: "Puedes poner a cualquier persona, en cualquier país. Tu familia en LATAM recibe el pago directamente." },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center mb-3">
                  {item.step}
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-5xl px-6 pb-16">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">
            Preguntas frecuentes sobre seguro de vida
          </h2>
          <div className="space-y-4">
            {faqSchema.mainEntity.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-5">
                <h3 className="font-medium text-slate-900 mb-2">{faq.name}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{faq.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
