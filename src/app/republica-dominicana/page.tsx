import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FaqAccordion } from "@/components/home/FaqAccordion";
import { CORRIDORS } from "@/lib/constants/corridors";

export const metadata: Metadata = {
  title: "Remesas y finanzas en República Dominicana | Finazo",
  description:
    "Compara las mejores tasas de remesas desde EE.UU. hacia República Dominicana. Wise, Remitly, Western Union y MoneyGram. Datos actualizados cada 6 horas, gratis.",
  alternates: { canonical: "https://finazo.lat/republica-dominicana" },
  robots: { index: true, follow: true },
};

const drCorridors = CORRIDORS.filter((c) => c.to === "DO");

const faqItems = [
  {
    question: "¿Cuál es el mejor servicio para enviar dinero a República Dominicana?",
    answer:
      "Wise suele ofrecer el tipo de cambio más cercano al mercado real y comisiones bajas. Remitly es una buena opción para depósitos bancarios rápidos. Western Union y MoneyGram permiten retiro en efectivo en miles de puntos. Finazo actualiza las tasas cada 6 horas para que encuentres la opción más barata hoy.",
  },
  {
    question: "¿Quién regula el sistema financiero en República Dominicana?",
    answer:
      "El Banco Central de la República Dominicana (BCRD) es la autoridad monetaria. La Superintendencia de Bancos (SB) supervisa las entidades financieras. Los bancos principales son Banreservas, BHD Léon, Banco Popular y Scotiabank RD.",
  },
  {
    question: "¿Cuánto tarda una remesa a República Dominicana?",
    answer:
      "Depende del servicio: Wise puede tardar de minutos a 1-2 días hábiles para depósito bancario. Remitly Express es casi inmediato. Western Union en agencia puede ser en menos de 10 minutos. Finazo muestra los tiempos estimados de cada opción.",
  },
  {
    question: "¿Cuántos pesos dominicanos recibo por $200 USD?",
    answer:
      "El tipo de cambio USD/DOP varía diariamente y por proveedor. Con Wise sueles recibir el tipo de cambio de mercado (alrededor de 60–62 DOP por USD en 2025). Western Union y MoneyGram aplican un diferencial de cambio que puede reducir el monto recibido. Compara en tiempo real en Finazo para ver cuántos pesos llegan realmente.",
  },
];

export default function RepublicaDominicanaPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-6 py-16">
        {/* Breadcrumb */}
        <div className="mb-8 text-sm">
          <Link href="/" className="text-emerald-600 hover:underline">
            Finazo
          </Link>
          <span className="mx-2 text-slate-400">/</span>
          <span className="text-slate-600">República Dominicana</span>
        </div>

        {/* Hero */}
        <div className="mb-16">
          <h1 className="mb-4 text-4xl font-bold text-slate-900">
            República Dominicana 🇩🇴
          </h1>
          <p className="mb-6 text-lg text-slate-700">
            Compara remesas desde EE.UU. hacia República Dominicana. Encuentra quién te ofrece más pesos dominicanos por tu dólar. Datos actualizados cada 6 horas, completamente gratis.
          </p>
          <div className="flex gap-4">
            <Link
              href="/remesas?desde=US&hacia=DO"
              className="rounded-lg px-6 py-3 font-semibold text-white transition-colors"
              style={{ background: "var(--green-bg)" }}
            >
              Comparar remesas
            </Link>
            <Link
              href="/remesas/eeuu-republica-dominicana"
              className="rounded-lg border border-slate-300 px-6 py-3 font-semibold text-slate-900 transition-colors hover:bg-slate-50"
            >
              Ver tarifas detalladas
            </Link>
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-16">
          <h2 className="mb-8 text-2xl font-bold text-slate-900">
            Qué puedes comparar en Finazo
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {/* Remesas */}
            <div className="rounded-lg border border-slate-200 p-6">
              <div
                className="mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold"
                style={{ background: "var(--green-bg)", color: "white" }}
              >
                En vivo
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">
                Remesas
              </h3>
              <p className="mb-4 text-slate-700">
                Compara tasas de Wise, Remitly, Western Union y MoneyGram para envíos a RD en tiempo real.
              </p>
              <Link
                href="/remesas?desde=US&hacia=DO"
                className="inline-block font-semibold"
                style={{ color: "var(--green)" }}
              >
                Ver remesas →
              </Link>
            </div>

            {/* Préstamos */}
            <div className="rounded-lg border border-slate-200 p-6">
              <div
                className="mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold text-slate-600"
                style={{ background: "#e5e7eb" }}
              >
                Próximamente
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">
                Préstamos
              </h3>
              <p className="mb-4 text-slate-700">
                Tasas de bancos regulados por la Superintendencia de Bancos de RD. Próximamente en Finazo.
              </p>
              <span className="inline-block font-semibold text-slate-500">
                Próximamente →
              </span>
            </div>

            {/* Seguros */}
            <div className="rounded-lg border border-slate-200 p-6">
              <div
                className="mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold text-slate-600"
                style={{ background: "#e5e7eb" }}
              >
                Próximamente
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">
                Seguros
              </h3>
              <p className="mb-4 text-slate-700">
                Auto, vida y salud en República Dominicana. Próximamente en Finazo.
              </p>
              <span className="inline-block font-semibold text-slate-500">
                Próximamente →
              </span>
            </div>
          </div>
        </div>

        {/* Corridors */}
        {drCorridors.length > 0 && (
          <div className="mb-16">
            <h2 className="mb-6 text-2xl font-bold text-slate-900">
              Corredores de remesas hacia República Dominicana
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {drCorridors.map((corridor) => (
                <Link
                  key={corridor.slug}
                  href={`/remesas/${corridor.slug}`}
                  className="rounded-lg border border-slate-200 p-6 transition-all hover:border-emerald-300 hover:shadow-lg"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <span className="text-2xl">{corridor.fromFlag}</span>
                    <span className="text-slate-500">→</span>
                    <span className="text-2xl">{corridor.toFlag}</span>
                  </div>
                  <h3 className="mb-2 font-semibold text-slate-900">
                    {corridor.label}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {corridor.fromLabel} a {corridor.toLabel}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* FAQ */}
        <div className="mb-16">
          <h2 className="mb-8 text-2xl font-bold text-slate-900">
            Preguntas frecuentes
          </h2>
          <FaqAccordion items={faqItems} />
        </div>

        {/* Trust Signals */}
        <div className="rounded-lg border border-slate-200 p-8" style={{ background: "#f9fafb" }}>
          <h2 className="mb-6 text-xl font-bold text-slate-900">
            ¿Por qué confiar en Finazo?
          </h2>
          <ul className="space-y-4">
            <li className="flex gap-3">
              <span style={{ color: "var(--green)" }}>✓</span>
              <span className="text-slate-700">
                <strong>Datos en tiempo real:</strong> Las tasas de remesas se actualizan cada 6 horas desde APIs oficiales de los proveedores.
              </span>
            </li>
            <li className="flex gap-3">
              <span style={{ color: "var(--green)" }}>✓</span>
              <span className="text-slate-700">
                <strong>Comparación honesta:</strong> Mostramos la comisión real y los pesos dominicanos que recibirás, no solo el tipo de cambio.
              </span>
            </li>
            <li className="flex gap-3">
              <span style={{ color: "var(--green)" }}>✓</span>
              <span className="text-slate-700">
                <strong>Independiente:</strong> No somos propiedad de ningún banco ni remesadora. Nuestras comparaciones no se venden.
              </span>
            </li>
            <li className="flex gap-3">
              <span style={{ color: "var(--green)" }}>✓</span>
              <span className="text-slate-700">
                <strong>100% gratis:</strong> Sin registro, sin suscripción, sin costos ocultos.
              </span>
            </li>
          </ul>
        </div>
      </main>
      <Footer />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Finazo",
                item: "https://finazo.lat",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "República Dominicana",
                item: "https://finazo.lat/republica-dominicana",
              },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqItems.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
              },
            })),
          }),
        }}
      />
    </>
  );
}
