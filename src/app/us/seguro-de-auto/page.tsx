import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/us/layout/Nav";
import { UsFooter } from "@/components/us/layout/UsFooter";
import { FloatingWA } from "@/components/us/layout/FloatingWA";

export const metadata: Metadata = {
  title: "Seguro de Auto para Hispanos en EE.UU. — Tarifas por Estado 2025 | Finazo",
  description:
    "Compara tarifas de seguro de auto en California, Texas, Florida y más estados. Proveedores con atención en español y opciones para conductores hispanos en EE.UU. 2025.",
  alternates: {
    canonical: "https://finazo.lat/us/seguro-de-auto",
    languages: {
      "es-US": "https://finazo.lat/us/seguro-de-auto",
      "x-default": "https://finazo.lat/us/seguro-de-auto",
    },
  },
  openGraph: {
    title: "Seguro de Auto para Hispanos en EE.UU. | Finazo",
    description:
      "Tarifas promedio por estado, requisitos mínimos y proveedores con atención en español. California, Texas, Florida y más.",
    url: "https://finazo.lat/us/seguro-de-auto",
    locale: "es_US",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://finazo.lat" },
    { "@type": "ListItem", position: 2, name: "EE.UU.", item: "https://finazo.lat/us" },
    { "@type": "ListItem", position: 3, name: "Seguro de auto", item: "https://finazo.lat/us/seguro-de-auto" },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Puedo obtener seguro de auto sin licencia de conducir de EE.UU.?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Algunos estados permiten conducir con licencia extranjera por un período limitado (generalmente 90 días). Para obtener seguro de auto, la mayoría de las aseguradoras requieren una licencia válida en el estado. California y Nueva York aceptan licencias de conducir para inmigrantes (incluidos indocumentados en California con AB-60). Progressive y State Farm ofrecen pólizas con licencias extranjeras en algunos estados.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuánto cuesta el seguro de auto promedio para hispanos en California, Texas y Florida?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Las tarifas promedio anuales en 2025: California ($2,190/año promedio, aunque Prop 103 limita el uso de historial crediticio), Texas ($2,640/año, entre los más altos del país), Florida ($3,240/año, el más caro del país). Las tarifas varían según ciudad, edad del conductor, tipo de vehículo e historial de manejo. Conductores nuevos en EE.UU. sin historial aquí pueden pagar entre 20-40% más hasta establecer 3+ años de historial local.",
      },
    },
    {
      "@type": "Question",
      name: "¿El historial crediticio afecta mi seguro de auto en EE.UU.?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "En la mayoría de estados, sí — las aseguradoras usan el 'insurance score' (basado en crédito) para calcular primas. Sin historial crediticio en EE.UU., pagarás tarifas más altas. California, Massachusetts y Hawaii prohíben el uso de crédito para calcular el seguro de auto. Si estás en otro estado, construir historial crediticio (con tarjeta asegurada o credit builder loan) puede reducir tu prima en 15-40% después de 1-2 años.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué cobertura mínima necesito por ley en cada estado?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Cada estado tiene requisitos distintos de responsabilidad civil mínima. California exige 15/30/5 (por persona/accidente/daños a propiedad en miles). Texas: 30/60/25. Florida es único: no requiere cobertura de lesiones corporales pero sí $10,000 de Personal Injury Protection (PIP) y $10,000 de propiedad. En todos los estados, el mínimo legal solo cubre los daños a otros — no tu propio vehículo. Expertos recomiendan mínimo 100/300/100 para protección real.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué aseguradoras tienen atención al cliente en español?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Las principales aseguradoras con servicio completo en español son: State Farm (1-800-782-8332 en español), Progressive (tiene agentes bilingües y app en español), GEICO (1-800-207-7847 español 24/7), Farmers Insurance (agentes hispanos en CA, TX, FL, AZ), y GAINSCO (especializada en conductores hispanos en TX, FL, AZ). Para conductores de alto riesgo o sin historial en EE.UU., GAINSCO y The General son opciones accesibles.",
      },
    },
  ],
};

const speakableSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", ".intro-text", ".rates-table"],
  },
  url: "https://finazo.lat/us/seguro-de-auto",
};

const STATE_RATES = [
  { state: "Florida", abbr: "FL", annualAvg: "$3,240", minReq: "PIP $10K + Prop $10K", creditUsed: false, note: "El más caro — sin req. de lesiones corporales" },
  { state: "Michigan", abbr: "MI", annualAvg: "$2,890", minReq: "50/100/10 + PIP ilimitado", creditUsed: true, note: "Históricamente el más caro; reformas 2019 redujeron PIP" },
  { state: "Texas", abbr: "TX", annualAvg: "$2,640", minReq: "30/60/25", creditUsed: true, note: "Primas altas en Houston, DFW y San Antonio" },
  { state: "Nueva York", abbr: "NY", annualAvg: "$2,470", minReq: "25/50/10 + PIP $50K", creditUsed: true, note: "NYC tiene primas 2x el promedio estatal" },
  { state: "Nevada", abbr: "NV", annualAvg: "$2,150", minReq: "25/50/20", creditUsed: true, note: "Las Vegas incrementa el promedio significativamente" },
  { state: "California", abbr: "CA", annualAvg: "$2,190", minReq: "15/30/5", creditUsed: false, note: "Prohíbe uso de crédito — licencia AB-60 para inmigrantes" },
  { state: "Colorado", abbr: "CO", annualAvg: "$1,940", minReq: "25/50/15", creditUsed: true, note: "Denver es el mercado más grande y costoso" },
  { state: "Illinois", abbr: "IL", annualAvg: "$1,710", minReq: "25/50/20", creditUsed: true, note: "Chicago tiene primas 40% más altas que el resto del estado" },
  { state: "Arizona", abbr: "AZ", annualAvg: "$1,680", minReq: "25/50/15", creditUsed: true, note: "Phoenix y Tucson concentran la mayoría de conductores hispanos" },
  { state: "Nuevo México", abbr: "NM", annualAvg: "$1,490", minReq: "25/50/10", creditUsed: true, note: "Mayor % de hispanos del país (47%) — opciones locales accesibles" },
];

const PROVIDERS = [
  { name: "State Farm", languages: "Español 24/7", specialty: "Mayor red de agentes bilingües", rating: "A++", phone: "1-800-782-8332" },
  { name: "GEICO", languages: "Español 24/7", specialty: "App y web completa en español", rating: "A++", phone: "1-800-207-7847" },
  { name: "Progressive", languages: "Español disponible", specialty: "Snapshot para buenos conductores", rating: "A+", phone: "1-800-776-4737" },
  { name: "GAINSCO", languages: "Bilingüe", specialty: "Especialista en conductores hispanos, alto riesgo", rating: "A-", phone: "1-866-GAINSCO" },
  { name: "Farmers", languages: "Español disponible", specialty: "Fuerte en CA, TX, AZ con agentes hispanos", rating: "A", phone: "1-800-435-7764" },
];

export default function UsSeguroAutoPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }} />
      <Nav currentPath="/us/seguros" />
      <main className="min-h-screen" style={{ background: "var(--background)" }}>

        <div style={{ background: "white", borderBottom: "1px solid #d1e8d9" }}>
          <div className="mx-auto max-w-5xl px-6 py-3 text-sm" style={{ color: "#666" }}>
            <Link href="/" style={{ color: "var(--green)" }}>Inicio</Link>
            {" › "}
            <Link href="/us" style={{ color: "var(--green)" }}>EE.UU.</Link>
            {" › "}
            <span style={{ color: "#333", fontWeight: 500 }}>Seguro de auto</span>
          </div>
        </div>

        <section style={{ background: "var(--green-bg)", borderBottom: "1px solid #d1e8d9" }}>
          <div className="mx-auto max-w-5xl px-6 py-12">
            <span className="inline-block rounded-full px-3 py-1 text-xs font-medium mb-4" style={{ background: "white", color: "var(--green)", border: "1px solid #d1e8d9" }}>
              Mercado EE.UU. · Datos 2025
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: "#1a1a1a" }}>
              Seguro de auto para hispanos en Estados Unidos
            </h1>
            <p className="text-lg max-w-2xl intro-text" style={{ color: "#666" }}>
              Tarifas promedio por estado, requisitos mínimos legales y proveedores
              con atención en español. Incluye opciones para conductores sin historial
              crediticio en EE.UU.
            </p>
            <div className="mt-6 rounded-xl p-4 max-w-2xl" style={{ background: "#fff3cd", border: "1px solid #ffc107" }}>
              <p className="text-sm" style={{ color: "#664d00" }}>
                <strong>Lo esencial:</strong> Florida es el estado más caro ($3,240/año).
                California prohíbe usar tu crédito para calcular tu prima y acepta
                licencia AB-60 para inmigrantes. Sin historial crediticio en EE.UU.,
                tu prima puede ser 20-40% más alta.
              </p>
            </div>
          </div>
        </section>

        {/* Rates by state */}
        <section className="mx-auto max-w-5xl px-6 py-8 rates-table">
          <h2 className="text-xl font-semibold mb-2" style={{ color: "#1a1a1a" }}>
            Tarifas promedio por estado (2025)
          </h2>
          <p className="text-sm mb-5" style={{ color: "#666" }}>
            Prima anual promedio para conductor de 35 años con historial limpio y vehículo sedán 2020.
            Fuente: NAIC y datos de mercado 2025.
          </p>
          <div className="rounded-2xl overflow-x-auto" style={{ background: "white", border: "1px solid #d1e8d9" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--green-bg)", borderBottom: "1px solid #d1e8d9" }}>
                  <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider" style={{ color: "var(--green)" }}>Estado</th>
                  <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider" style={{ color: "var(--green)" }}>Prima promedio/año</th>
                  <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider" style={{ color: "var(--green)" }}>Mínimo legal</th>
                  <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider" style={{ color: "var(--green)" }}>¿Usa crédito?</th>
                  <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider" style={{ color: "var(--green)" }}>Notas para hispanos</th>
                </tr>
              </thead>
              <tbody>
                {STATE_RATES.map((row, i) => (
                  <tr key={row.abbr} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa", borderBottom: "1px solid #f0f0f0" }}>
                    <td className="px-4 py-3">
                      <span style={{ color: "#1a1a1a", fontWeight: 500 }}>{row.state}</span>
                      <span className="ml-2 text-xs" style={{ color: "#999" }}>{row.abbr}</span>
                    </td>
                    <td className="px-4 py-3" style={{ color: "var(--green)", fontWeight: 600 }}>{row.annualAvg}</td>
                    <td className="px-4 py-3 text-xs font-mono" style={{ color: "#666" }}>{row.minReq}</td>
                    <td className="px-4 py-3">
                      {row.creditUsed ? (
                        <span className="text-xs font-medium" style={{ color: "#d97706" }}>Sí</span>
                      ) : (
                        <span className="text-xs font-medium" style={{ color: "var(--green)" }}>No ✓</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: "#666" }}>{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs" style={{ color: "#999" }}>
            Nota: Mínimo legal en formato Lesiones/Accidente/Propiedad (miles de dólares).
          </p>
        </section>

        {/* What affects your rate */}
        <section className="mx-auto max-w-5xl px-6 py-8">
          <h2 className="text-xl font-semibold mb-4" style={{ color: "#1a1a1a" }}>
            Qué afecta tu prima como conductor hispano en EE.UU.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl p-5" style={{ background: "white", border: "1px solid #d1e8d9" }}>
              <h3 className="font-semibold mb-2" style={{ color: "#1a1a1a" }}>Factores que suben tu prima</h3>
              <ul className="space-y-2 text-sm" style={{ color: "#666" }}>
                <li className="flex gap-2"><span style={{ color: "#dc2626", marginTop: "2px" }}>↑</span> Sin historial de conducir en EE.UU. (0-3 años)</li>
                <li className="flex gap-2"><span style={{ color: "#dc2626", marginTop: "2px" }}>↑</span> Sin historial crediticio local (en la mayoría de estados)</li>
                <li className="flex gap-2"><span style={{ color: "#dc2626", marginTop: "2px" }}>↑</span> Vivir en código postal urbano de alto riesgo</li>
                <li className="flex gap-2"><span style={{ color: "#dc2626", marginTop: "2px" }}>↑</span> Conductor menor de 25 años</li>
                <li className="flex gap-2"><span style={{ color: "#dc2626", marginTop: "2px" }}>↑</span> Vehículo con año reciente o valor alto</li>
              </ul>
            </div>
            <div className="rounded-2xl p-5" style={{ background: "white", border: "1px solid #d1e8d9" }}>
              <h3 className="font-semibold mb-2" style={{ color: "#1a1a1a" }}>Cómo reducir tu prima</h3>
              <ul className="space-y-2 text-sm" style={{ color: "#666" }}>
                <li className="flex gap-2"><span style={{ color: "var(--green)", marginTop: "2px" }}>↓</span> Pedir historial de manejo de país de origen (carta de tu aseguradora)</li>
                <li className="flex gap-2"><span style={{ color: "var(--green)", marginTop: "2px" }}>↓</span> Construir crédito (secured card + 12 meses = descuento en 43 estados)</li>
                <li className="flex gap-2"><span style={{ color: "var(--green)", marginTop: "2px" }}>↓</span> Tomar curso de manejo defensivo (descuento 5-15%)</li>
                <li className="flex gap-2"><span style={{ color: "var(--green)", marginTop: "2px" }}>↓</span> Agrupar seguro de auto + renter/homeowner con la misma compañía (10-25%)</li>
                <li className="flex gap-2"><span style={{ color: "var(--green)", marginTop: "2px" }}>↓</span> Comparar al menos 3 aseguradoras cada año</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Providers with Spanish service */}
        <section className="mx-auto max-w-5xl px-6 py-8">
          <h2 className="text-xl font-semibold mb-4" style={{ color: "#1a1a1a" }}>
            Aseguradoras con atención en español
          </h2>
          <div className="space-y-3">
            {PROVIDERS.map((provider) => (
              <div key={provider.name} className="rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3" style={{ background: "white", border: "1px solid #d1e8d9" }}>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold" style={{ color: "#1a1a1a" }}>{provider.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--green-bg)", color: "var(--green)" }}>Rating AM Best: {provider.rating}</span>
                  </div>
                  <p className="text-sm" style={{ color: "#666" }}>{provider.specialty}</p>
                  <p className="text-xs mt-1" style={{ color: "var(--green)" }}>🌐 {provider.languages}</p>
                </div>
                <a
                  href={`tel:${provider.phone.replace(/[^0-9+]/g, "")}`}
                  className="shrink-0 text-sm font-medium hover:underline"
                  style={{ color: "var(--green)" }}
                >
                  {provider.phone}
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Coverage types explained */}
        <section className="mx-auto max-w-5xl px-6 py-8">
          <h2 className="text-xl font-semibold mb-4" style={{ color: "#1a1a1a" }}>
            Tipos de cobertura: ¿cuál necesitas?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl p-5" style={{ background: "white", border: "1px solid #d1e8d9" }}>
              <div className="text-2xl mb-2">🛡️</div>
              <h3 className="font-semibold mb-2" style={{ color: "#1a1a1a" }}>Responsabilidad civil</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#666" }}>
                Obligatoria en todos los estados. Cubre los daños que causes a otras personas
                y su propiedad. <strong>No cubre tu vehículo.</strong> Si tienes un auto de bajo
                valor, puede ser suficiente.
              </p>
              <p className="text-xs mt-3" style={{ color: "#999" }}>~$400-800/año para mínimo legal</p>
            </div>
            <div className="rounded-2xl p-5" style={{ background: "white", border: "1px solid #d1e8d9" }}>
              <div className="text-2xl mb-2">🔧</div>
              <h3 className="font-semibold mb-2" style={{ color: "#1a1a1a" }}>Cobertura completa (Full Coverage)</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#666" }}>
                Responsabilidad + colisión + comprensivo. Cubre tu vehículo en accidentes,
                robo, fenómenos naturales y vandalismo. <strong>Requerida si tu auto tiene
                préstamo o lease.</strong>
              </p>
              <p className="text-xs mt-3" style={{ color: "#999" }}>~$1,400-3,000/año promedio</p>
            </div>
            <div className="rounded-2xl p-5" style={{ background: "white", border: "1px solid #d1e8d9" }}>
              <div className="text-2xl mb-2">🏥</div>
              <h3 className="font-semibold mb-2" style={{ color: "#1a1a1a" }}>PIP / MedPay</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#666" }}>
                Personal Injury Protection cubre tus gastos médicos y de pasajeros independientemente
                de quién tuvo la culpa. Obligatorio en Florida y otros estados no-fault.
                <strong> Muy recomendado para familias.</strong>
              </p>
              <p className="text-xs mt-3" style={{ color: "#999" }}>~$100-400/año adicional</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-5xl px-6 pb-16">
          <h2 className="text-xl font-semibold mb-6" style={{ color: "#1a1a1a" }}>
            Preguntas frecuentes sobre seguro de auto
          </h2>
          <div className="space-y-4">
            {faqSchema.mainEntity.map((faq, i) => (
              <div key={i} className="rounded-2xl p-5" style={{ background: "var(--background)", border: "1px solid #d1e8d9" }}>
                <h3 className="font-medium mb-2" style={{ color: "#1a1a1a" }}>{faq.name}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#666" }}>{faq.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <UsFooter />
      <FloatingWA />
    </>
  );
}
