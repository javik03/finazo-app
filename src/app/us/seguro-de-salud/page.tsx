import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Seguro de Salud para Hispanos en EE.UU. — Guía ACA 2025 | Finazo",
  description:
    "Guía completa del seguro de salud ACA (Obamacare) para hispanos en Estados Unidos. Planes por estado, subsidios, inscripción en español. Actualizado 2025.",
  alternates: {
    canonical: "https://finazo.lat/us/seguro-de-salud",
    languages: {
      "es-US": "https://finazo.lat/us/seguro-de-salud",
      "x-default": "https://finazo.lat/us/seguro-de-salud",
    },
  },
  openGraph: {
    title: "Seguro de Salud para Hispanos en EE.UU. | Finazo",
    description:
      "Planes ACA, subsidios según ingreso y guía de inscripción en español. California, Texas, Florida y más estados.",
    url: "https://finazo.lat/us/seguro-de-salud",
    locale: "es_US",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://finazo.lat" },
    { "@type": "ListItem", position: 2, name: "EE.UU.", item: "https://finazo.lat/us" },
    { "@type": "ListItem", position: 3, name: "Seguro de salud", item: "https://finazo.lat/us/seguro-de-salud" },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Puedo obtener seguro de salud ACA siendo indocumentado o sin estatus legal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Los inmigrantes sin estatus legal NO califican para el Marketplace ACA federal ni para Medicaid en la mayoría de los estados. Sin embargo, California tiene Medi-Cal para adultos sin importar estatus migratorio. Los niños y mujeres embarazadas tienen cobertura de emergencia en casi todos los estados. Si tienes visa, green card, DACA o TPS, generalmente sí calificas para el Marketplace ACA.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué son los subsidios del ACA y cómo sé si califico?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Los subsidios ACA (Premium Tax Credits) reducen tu prima mensual según tu ingreso. Si ganas entre 100% y 400% del nivel federal de pobreza (en 2025: $15,060 a $60,240 para una persona), recibes subsidio. Una familia de 4 con ingreso hasta $124,800 puede recibir ayuda. En 2025, los subsidios mejorados del plan Rescue Act siguen disponibles, y muchas personas de ingresos bajos pagan $0 o muy poco al mes.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué diferencia hay entre un plan Bronze, Silver, Gold y Platinum?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Los niveles de metal determinan cómo se divide el costo entre tú y el seguro: Bronce (seguro paga 60%, tú 40%), Plata (70/30), Oro (80/20), Platino (90/10). Los planes Bronze tienen la prima más baja pero el deducible más alto. Los planes Silver son los más recomendados para personas con ingresos bajos a medios porque califican para Cost Sharing Reductions (CSR) que reducen el deducible, copagos y máximo anual.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuándo puedo inscribirme al seguro de salud ACA?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "El período de inscripción abierta (Open Enrollment) es generalmente del 1 de noviembre al 15 de enero. Fuera de ese período, solo puedes inscribirte si tienes un evento de vida calificado: perder otro seguro, casarte, tener un bebé, mudarte a otro estado, o cambios de ingreso. Comunidades con NAVIGATORs y agentes certificados ofrecen asistencia gratuita en español.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuánto cuesta el seguro de salud para hispanos en California, Texas y Florida?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "En California (Covered California), una persona de 40 años con ingreso de $35,000 paga aproximadamente $0-80/mes con subsidio en un plan Silver. En Texas (HealthCare.gov), la misma persona paga $50-120/mes. En Florida, $60-150/mes. Sin subsidio, las primas son $400-700/mes para adultos de 40 años. Usa el estimador de subsidios en HealthCare.gov para calcular tu costo exacto.",
      },
    },
  ],
};

const speakableSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", ".intro-text", ".metal-levels"],
  },
  url: "https://finazo.lat/us/seguro-de-salud",
};

const METAL_LEVELS = [
  {
    level: "Bronce",
    color: "bg-amber-700",
    textColor: "text-amber-800",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    insurerPays: "60%",
    youPay: "40%",
    premium: "Más baja",
    deductible: "Más alto (~$7,000+)",
    bestFor: "Personas sanas sin gastos médicos frecuentes que quieren protección contra catástrofes.",
  },
  {
    level: "Plata",
    color: "bg-slate-400",
    textColor: "text-slate-800",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-300",
    insurerPays: "70%",
    youPay: "30%",
    premium: "Media",
    deductible: "Medio (~$3,500)",
    bestFor: "La mejor opción si tienes ingresos bajos a medios — califica para subsidios adicionales (CSR).",
    recommended: true,
  },
  {
    level: "Oro",
    color: "bg-yellow-500",
    textColor: "text-yellow-800",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    insurerPays: "80%",
    youPay: "20%",
    premium: "Alta",
    deductible: "Bajo (~$1,500)",
    bestFor: "Si visitas médicos frecuentemente o tomas medicamentos de marca.",
  },
  {
    level: "Platino",
    color: "bg-slate-600",
    textColor: "text-slate-900",
    bgColor: "bg-slate-100",
    borderColor: "border-slate-400",
    insurerPays: "90%",
    youPay: "10%",
    premium: "Más alta",
    deductible: "Muy bajo (~$0-500)",
    bestFor: "Si tienes condiciones crónicas y altos gastos médicos regulares.",
  },
];

const STATES_MARKETPLACES = [
  { state: "California", url: "https://www.coveredca.com", platform: "Covered California", note: "Acepta residentes sin importar estatus migratorio para Medi-Cal" },
  { state: "Texas", url: "https://www.healthcare.gov", platform: "HealthCare.gov", note: null },
  { state: "Florida", url: "https://www.healthcare.gov", platform: "HealthCare.gov", note: null },
  { state: "Nueva York", url: "https://nystateofhealth.ny.gov", platform: "NY State of Health", note: "Opciones para inmigrantes DACA y sin documentos" },
  { state: "Illinois", url: "https://getcoveredillinois.gov", platform: "GetCoveredIllinois", note: null },
  { state: "Arizona", url: "https://www.healthcare.gov", platform: "HealthCare.gov", note: null },
  { state: "Colorado", url: "https://connectforhealthco.com", platform: "Connect for Health CO", note: null },
  { state: "Nevada", url: "https://www.nevadahealthlink.com", platform: "Nevada Health Link", note: null },
];

export default function UsSeguroSaludPage() {
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
            <span className="text-slate-800 font-medium">Seguro de salud</span>
          </div>
        </div>

        <section className="bg-white">
          <div className="mx-auto max-w-5xl px-6 py-12">
            <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 border border-emerald-200 mb-4">
              Mercado EE.UU. · ACA 2025
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Seguro de salud para hispanos en Estados Unidos
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl intro-text">
              Guía completa del Marketplace ACA (Obamacare) en español: cómo
              funciona, cuánto cuesta con subsidios y cómo inscribirte en tu
              estado.
            </p>
            <div className="mt-6 rounded-xl bg-amber-50 border border-amber-200 p-4 max-w-2xl">
              <p className="text-sm text-amber-900">
                <strong>Lo esencial:</strong> Con ingreso de $35,000/año, una
                persona puede pagar $0-80/mes con subsidio en un plan Silver.
                El período de inscripción abierta es del 1 nov al 15 enero.
                California acepta residentes sin importar estatus migratorio.
              </p>
            </div>
          </div>
        </section>

        {/* Metal levels */}
        <section className="mx-auto max-w-5xl px-6 py-8 metal-levels">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Los 4 niveles de planes ACA: ¿cuál elegir?
          </h2>
          <p className="text-sm text-slate-600 mb-5">
            Todos los planes ACA cubren los 10 servicios esenciales: consultas médicas,
            emergencias, hospitalización, medicamentos, salud mental, maternidad y más.
            La diferencia es cómo se divide el costo.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {METAL_LEVELS.map((level) => (
              <div
                key={level.level}
                className={`rounded-xl border ${level.borderColor} ${level.bgColor} p-5 relative`}
              >
                {level.recommended && (
                  <span className="absolute -top-2 left-4 rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-bold text-white">
                    Recomendado
                  </span>
                )}
                <div className={`inline-block rounded-full ${level.color} px-3 py-1 text-xs font-bold text-white mb-3`}>
                  {level.level}
                </div>
                <div className="space-y-1.5 text-xs">
                  <div><span className="text-slate-500">El seguro paga:</span> <strong>{level.insurerPays}</strong></div>
                  <div><span className="text-slate-500">Tú pagas:</span> <strong>{level.youPay}</strong></div>
                  <div><span className="text-slate-500">Prima:</span> {level.premium}</div>
                  <div><span className="text-slate-500">Deducible:</span> {level.deductible}</div>
                </div>
                <p className={`mt-3 text-xs ${level.textColor} leading-relaxed`}>
                  {level.bestFor}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Marketplaces by state */}
        <section className="mx-auto max-w-5xl px-6 py-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Dónde inscribirte según tu estado
          </h2>
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Estado</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Plataforma</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Notas importantes</th>
                </tr>
              </thead>
              <tbody>
                {STATES_MARKETPLACES.map((row, i) => (
                  <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{row.state}</td>
                    <td className="px-4 py-3">
                      <a href={row.url} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                        {row.platform}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{row.note ?? "HealthCare.gov estándar"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Para asistencia gratuita en español llama al{" "}
            <strong>1-800-318-2596</strong> (TTY: 1-855-889-4325). Disponible 24/7.
          </p>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-5xl px-6 pb-16">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">
            Preguntas frecuentes sobre seguro de salud
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
