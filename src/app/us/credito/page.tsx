import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Cómo Construir Crédito en EE.UU. para Hispanos e Inmigrantes 2025 | Finazo",
  description:
    "Guía para empezar tu historial crediticio en Estados Unidos siendo inmigrante hispano. Tarjetas aseguradas, credit builder loans y estrategias para subir tu score rápido.",
  alternates: {
    canonical: "https://finazo.lat/us/credito",
    languages: {
      "es-US": "https://finazo.lat/us/credito",
      "x-default": "https://finazo.lat/us/credito",
    },
  },
  openGraph: {
    title: "Construir Crédito en EE.UU. siendo Hispano e Inmigrante | Finazo",
    description:
      "De 0 a 700+: estrategia paso a paso para hispanos e inmigrantes. Tarjetas sin SSN, credit builder loans y cómo usar tu crédito de otro país.",
    url: "https://finazo.lat/us/credito",
    locale: "es_US",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://finazo.lat" },
    { "@type": "ListItem", position: 2, name: "EE.UU.", item: "https://finazo.lat/us" },
    { "@type": "ListItem", position: 3, name: "Construir crédito", item: "https://finazo.lat/us/credito" },
  ],
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Cómo construir crédito en EE.UU. siendo inmigrante hispano",
  description: "Pasos para empezar y crecer tu historial crediticio en Estados Unidos sin historial previo.",
  totalTime: "PT12M",
  step: [
    {
      "@type": "HowToStep",
      name: "Obtén tu ITIN o SSN",
      text: "El ITIN (formulario W-7 del IRS) te permite acceder a productos financieros sin SSN. Si tienes visa de trabajo, obtén tu SSN en la oficina del Seguro Social.",
    },
    {
      "@type": "HowToStep",
      name: "Abre una tarjeta de crédito asegurada",
      text: "Deposita $200-500 como garantía en bancos como Discover it Secured, Capital One Secured o Bank of America Secured. Usa la tarjeta mensualmente para gastos pequeños.",
    },
    {
      "@type": "HowToStep",
      name: "Paga el saldo completo cada mes",
      text: "Nunca dejes un saldo pendiente. El 35% de tu score depende del historial de pagos. Configura autopago para no olvidarlo.",
    },
    {
      "@type": "HowToStep",
      name: "Mantén utilización bajo el 10%",
      text: "Si tu límite es $500, no uses más de $50 al mes. La utilización de crédito (30% del score) mejora dramáticamente bajo el 10%.",
    },
    {
      "@type": "HowToStep",
      name: "Agrega un credit builder loan",
      text: "Self Financial o Credit Strong ofrecen préstamos de construcción de crédito desde $25/mes. El dinero va a una cuenta de ahorro y tú lo recibes al final.",
    },
    {
      "@type": "HowToStep",
      name: "Hazte usuario autorizado",
      text: "Si tienes un familiar o amigo con buen crédito en EE.UU., pídele que te agregue como usuario autorizado en su tarjeta. Su historial se suma al tuyo.",
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Puedo construir crédito en EE.UU. con ITIN y sin SSN?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. El ITIN (Individual Taxpayer Identification Number) te permite abrir cuentas bancarias, obtener tarjetas de crédito aseguradas y credit builder loans. Bancos como Wells Fargo, Bank of America y Self Financial aceptan ITIN. El ITIN se solicita con el formulario W-7 del IRS y lo recibes en 7-11 semanas.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuánto tiempo tarda en subir mi score crediticio desde cero?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Con una estrategia correcta: 6 meses para tener un score inicial (600-650). 12 meses para llegar a buen crédito (670-700). 24 meses para excelente crédito (740+). La clave es: nunca fallar un pago, mantener utilización bajo 10%, y no abrir muchas cuentas al mismo tiempo. Con score 700+ puedes acceder a préstamos personales, mejor seguro de auto y eventualmente hipoteca.",
      },
    },
    {
      "@type": "Question",
      name: "¿Puedo usar mi historial crediticio de México o Centroamérica en EE.UU.?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La mayoría de los bureaus crediticios no comparten datos entre países. Sin embargo, Nova Credit ofrece un servicio llamado 'Credit Passport' que traduce historial crediticio de México, India, Filipinas y otros países. American Express y algunos bancos lo aceptan. También puedes llevar una carta de tu banco en tu país documentando tu historial como referencia para algunos prestamistas comunitarios.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué es una tarjeta de crédito asegurada y cómo funciona?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Una secured credit card requiere un depósito inicial ($200-500 típicamente) que sirve como tu límite de crédito. Usas la tarjeta normalmente para compras pequeñas y pagas el saldo completo cada mes. El banco reporta tus pagos a los tres bureaus (Equifax, Experian, TransUnion) y construyes historial. Después de 12-18 meses de buen comportamiento, muchos bancos devuelven tu depósito y te dan una tarjeta regular.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuáles son los factores que más afectan mi credit score en EE.UU.?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Los 5 factores del score FICO son: 1) Historial de pagos (35%) — el más importante, nunca te atrasas; 2) Utilización del crédito (30%) — mantén bajo el 10% de tu límite; 3) Antigüedad del crédito (15%) — no cierres tus cuentas más antiguas; 4) Mezcla de crédito (10%) — tener tarjeta + préstamo es mejor que solo uno; 5) Nuevas solicitudes (10%) — no apliques a muchas cuentas en poco tiempo.",
      },
    },
  ],
};

const speakableSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", ".intro-text", ".credit-steps"],
  },
  url: "https://finazo.lat/us/credito",
};

const CREDIT_TOOLS = [
  {
    name: "Discover it Secured",
    type: "Tarjeta asegurada",
    deposit: "$200 mín.",
    apr: "28.24%",
    fee: "Sin cuota anual",
    itin: false,
    highlight: "2% cashback en restaurantes y gasolina. Revisión automática a los 7 meses para pasar a no-secured.",
    bestFor: "Primera tarjeta en EE.UU.",
  },
  {
    name: "Capital One Secured",
    type: "Tarjeta asegurada",
    deposit: "$49-200",
    apr: "30.74%",
    fee: "Sin cuota anual",
    itin: false,
    highlight: "Depósito mínimo desde $49 según historial. Límite inicial $200. Aumento automático con 5 meses de buen uso.",
    bestFor: "Menor depósito inicial",
  },
  {
    name: "Self Financial",
    type: "Credit builder loan",
    deposit: "N/A",
    apr: "15.65%",
    fee: "$9 de apertura",
    itin: true,
    highlight: "Acepta ITIN. Depositas $25-150/mes, al final del plazo recibes el dinero. Reporta a los 3 bureaus.",
    bestFor: "Sin tarjeta, construir ahorro y crédito a la vez",
  },
  {
    name: "Credit Strong",
    type: "Credit builder loan",
    deposit: "N/A",
    apr: "~15%",
    fee: "$15 de apertura",
    itin: true,
    highlight: "Acepta ITIN. Varias opciones de monto y plazo. Muy recomendado en comunidades de inmigrantes.",
    bestFor: "Inmigrantes sin historial crediticio",
  },
  {
    name: "Nova Credit",
    type: "Transferencia de historial",
    deposit: "N/A",
    apr: "N/A",
    fee: "Sin costo",
    itin: false,
    highlight: "Traduce historial crediticio de México, India, Filipinas y 10+ países. Funciona con AmEx y algunos bancos.",
    bestFor: "Si ya tienes buen crédito en tu país de origen",
  },
];

const SCORE_RANGES = [
  { range: "300-579", label: "Muy malo", color: "bg-red-100 text-red-800 border-red-200", desc: "Sin acceso a crédito. Trabaja 12+ meses en construir historial." },
  { range: "580-669", label: "Regular", color: "bg-orange-100 text-orange-800 border-orange-200", desc: "Acceso limitado. Tarjetas aseguradas y préstamos de alto interés." },
  { range: "670-739", label: "Bueno", color: "bg-yellow-100 text-yellow-800 border-yellow-200", desc: "Acceso a la mayoría de productos. Tasas competitivas." },
  { range: "740-799", label: "Muy bueno", color: "bg-emerald-100 text-emerald-800 border-emerald-200", desc: "Mejores tasas disponibles en préstamos y tarjetas premium." },
  { range: "800-850", label: "Excelente", color: "bg-blue-100 text-blue-800 border-blue-200", desc: "Acceso a las mejores condiciones. Tasas hipotecarias más bajas." },
];

export default function UsCreditoPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }} />
      <Header />
      <main className="min-h-screen" style={{ background: "var(--background)" }}>

        <div style={{ background: "white", borderBottom: "1px solid #d1e8d9" }}>
          <div className="mx-auto max-w-5xl px-6 py-3 text-sm" style={{ color: "#666" }}>
            <Link href="/" style={{ color: "var(--green)" }}>Inicio</Link>
            {" › "}
            <Link href="/us" style={{ color: "var(--green)" }}>EE.UU.</Link>
            {" › "}
            <span style={{ color: "#333", fontWeight: 500 }}>Construir crédito</span>
          </div>
        </div>

        <section style={{ background: "var(--green-bg)", borderBottom: "1px solid #d1e8d9" }}>
          <div className="mx-auto max-w-5xl px-6 py-12">
            <span className="inline-block rounded-full px-3 py-1 text-xs font-medium mb-4" style={{ background: "white", color: "var(--green)", border: "1px solid #d1e8d9" }}>
              Guía para inmigrantes hispanos · EE.UU.
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: "#1a1a1a" }}>
              Cómo construir crédito en EE.UU. siendo hispano o inmigrante
            </h1>
            <p className="text-lg max-w-2xl intro-text" style={{ color: "#666" }}>
              Sin historial crediticio en EE.UU. pagas más por todo: seguro de auto,
              préstamos y hasta apartamentos. Esta guía te muestra cómo llegar a 700+
              en 12-24 meses, con o sin SSN.
            </p>
            <div className="mt-6 rounded-xl p-4 max-w-2xl" style={{ background: "#dcfce7", border: "1px solid #86efac" }}>
              <p className="text-sm" style={{ color: "#166534" }}>
                <strong>La estrategia ganadora:</strong> Tarjeta asegurada ($200 depósito) +
                credit builder loan ($25/mes) + pago puntual = 650+ en 6 meses,
                700+ en 12 meses. Funciona con ITIN, sin SSN.
              </p>
            </div>
          </div>
        </section>

        {/* Score ranges */}
        <section className="mx-auto max-w-5xl px-6 py-8">
          <h2 className="text-xl font-semibold mb-4" style={{ color: "#1a1a1a" }}>
            ¿Qué significa tu credit score?
          </h2>
          <div className="space-y-2">
            {SCORE_RANGES.map((range) => {
              const colorMap: { [key: string]: { bg: string; text: string; border: string } } = {
                "bg-red-100 text-red-800 border-red-200": { bg: "#fee2e2", text: "#991b1b", border: "#fecaca" },
                "bg-orange-100 text-orange-800 border-orange-200": { bg: "#fed7aa", text: "#92400e", border: "#fdba74" },
                "bg-yellow-100 text-yellow-800 border-yellow-200": { bg: "#fef3c7", text: "#78350f", border: "#fcd34d" },
                "bg-emerald-100 text-emerald-800 border-emerald-200": { bg: "#dcfce7", text: "#065f46", border: "#a7f3d0" },
                "bg-blue-100 text-blue-800 border-blue-200": { bg: "#dbeafe", text: "#1e3a8a", border: "#93c5fd" },
              };
              const colors = colorMap[range.color] || { bg: "#f5f5f5", text: "#666", border: "#ddd" };
              return (
                <div key={range.range} className="rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-3" style={{ background: colors.bg, border: `1px solid ${colors.border}` }}>
                  <div className="shrink-0">
                    <span className="font-mono font-bold text-lg" style={{ color: colors.text }}>{range.range}</span>
                    <span className="ml-3 font-medium" style={{ color: colors.text }}>{range.label}</span>
                  </div>
                  <p className="text-sm" style={{ color: colors.text }}>{range.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Step by step */}
        <section className="mx-auto max-w-5xl px-6 py-8 credit-steps">
          <h2 className="text-xl font-semibold mb-2" style={{ color: "#1a1a1a" }}>
            De 0 a 700+: tu plan de 12 meses
          </h2>
          <p className="text-sm mb-6" style={{ color: "#666" }}>
            Sigue estos pasos en orden. No necesitas SSN para empezar — con ITIN es suficiente.
          </p>
          <div className="space-y-4">
            {howToSchema.step.map((step, i) => (
              <div key={i} className="rounded-2xl p-5 flex gap-4" style={{ background: "white", border: "1px solid #d1e8d9" }}>
                <div className="shrink-0 w-8 h-8 rounded-full text-white font-bold text-sm flex items-center justify-center" style={{ background: "var(--green)" }}>
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: "#1a1a1a" }}>{step.name}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#666" }}>{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tools comparison */}
        <section className="mx-auto max-w-5xl px-6 py-8">
          <h2 className="text-xl font-semibold mb-4" style={{ color: "#1a1a1a" }}>
            Herramientas para construir crédito
          </h2>
          <div className="space-y-4">
            {CREDIT_TOOLS.map((tool) => (
              <div key={tool.name} className="rounded-2xl p-5" style={{ background: "white", border: "1px solid #d1e8d9" }}>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold" style={{ color: "#1a1a1a" }}>{tool.name}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#f5f5f5", color: "#666" }}>{tool.type}</span>
                      {tool.itin && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "var(--green-bg)", color: "var(--green)" }}>Acepta ITIN</span>
                      )}
                    </div>
                    <p className="text-sm" style={{ color: "#666" }}>{tool.highlight}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 text-xs" style={{ color: "#999", borderTop: "1px solid #eee", paddingTop: "12px" }}>
                  {tool.deposit !== "N/A" && <span>Depósito: <strong style={{ color: "#1a1a1a" }}>{tool.deposit}</strong></span>}
                  {tool.apr !== "N/A" && <span>APR: <strong style={{ color: "#1a1a1a" }}>{tool.apr}</strong></span>}
                  <span>Costo: <strong style={{ color: "#1a1a1a" }}>{tool.fee}</strong></span>
                  <span style={{ color: "var(--green)", fontWeight: 500 }}>Mejor para: {tool.bestFor}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Score factors */}
        <section className="mx-auto max-w-5xl px-6 py-8">
          <h2 className="text-xl font-semibold mb-4" style={{ color: "#1a1a1a" }}>
            Los 5 factores que determinan tu score FICO
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {[
              { pct: "35%", factor: "Historial de pagos", tip: "Nunca falles un pago — ni uno." },
              { pct: "30%", factor: "Utilización del crédito", tip: "Usa menos del 10% de tu límite." },
              { pct: "15%", factor: "Antigüedad del crédito", tip: "No cierres cuentas antiguas." },
              { pct: "10%", factor: "Mezcla de productos", tip: "Tarjeta + préstamo es mejor." },
              { pct: "10%", factor: "Solicitudes nuevas", tip: "No apliques a muchas a la vez." },
            ].map((item) => (
              <div key={item.factor} className="rounded-2xl p-4 text-center" style={{ background: "white", border: "1px solid #d1e8d9" }}>
                <div className="text-2xl font-bold mb-1" style={{ color: "var(--green)" }}>{item.pct}</div>
                <div className="text-sm font-medium mb-2" style={{ color: "#1a1a1a" }}>{item.factor}</div>
                <p className="text-xs leading-relaxed" style={{ color: "#999" }}>{item.tip}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-5xl px-6 pb-16">
          <h2 className="text-xl font-semibold mb-6" style={{ color: "#1a1a1a" }}>
            Preguntas frecuentes sobre crédito para hispanos en EE.UU.
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
      <Footer />
    </>
  );
}
