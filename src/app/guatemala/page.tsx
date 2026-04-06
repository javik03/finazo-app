import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FaqAccordion } from "@/components/home/FaqAccordion";
import { CORRIDORS } from "@/lib/constants/corridors";

export const metadata: Metadata = {
  title: "Remesas, préstamos y seguros en Guatemala | Finazo",
  description:
    "Compara las mejores tasas de remesas de EE.UU., préstamos bancarios regulados por la SIB y seguros para Guatemala. Datos actualizados diariamente, gratis.",
  alternates: { canonical: "https://finazo.lat/guatemala" },
  robots: { index: true, follow: true },
};

const guatemalaCorridors = CORRIDORS.filter((c) => c.to === "GT");

const faqItems = [
  {
    question: "¿Cuáles son los mejores corredores de remesas hacia Guatemala?",
    answer:
      "Los principales corredores desde EE.UU. hacia Guatemala son Wise (comisión baja), Remitly (depósito bancario rápido), Western Union (efectivo en agencias) y MoneyGram. Finazo actualiza las tasas cada 6 horas para que encuentres la más barata.",
  },
  {
    question: "¿Quién regula los préstamos bancarios en Guatemala?",
    answer:
      "La Superintendencia de Bancos de Guatemala (SIB) es el regulador oficial. Las tasas que ves en Finazo provienen de reportes oficiales de la SIB. Los principales bancos son G-Bank, Banrural, Banco Industrial y Banco Azteca.",
  },
  {
    question: "¿Cuánto demora una remesa a Guatemala?",
    answer:
      "Depende del método: Wise (instantáneo si es cuenta, 1-2 días si es efectivo), Remitly (1-3 días), Western Union (10-15 minutos en agencia). Finazo muestra tiempos exactos para cada proveedor.",
  },
  {
    question: "¿Cuál es el costo promedio de una remesa de $200 a Guatemala?",
    answer:
      "El costo varía según el proveedor, pero generalmente oscila entre $8 y $18 USD para una transferencia de $200. Wise suele ser el más económico. Siempre verifica en Finazo el costo actualizado.",
  },
];

export default function GuatemalaPage() {
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
          <span className="text-slate-600">Guatemala</span>
        </div>

        {/* Hero */}
        <div className="mb-16">
          <h1 className="mb-4 text-4xl font-bold text-slate-900">
            Guatemala 🇬🇹
          </h1>
          <p className="mb-6 text-lg text-slate-700">
            Compara remesas desde EE.UU., préstamos bancarios regulados por la SIB y seguros. Datos actualizados diariamente, completamente gratis.
          </p>
          <div className="flex gap-4">
            <Link
              href="/remesas"
              className="rounded-lg px-6 py-3 font-semibold text-white transition-colors"
              style={{ background: "var(--green-bg)" }}
            >
              Comparar remesas
            </Link>
            <Link
              href="/prestamos"
              className="rounded-lg border border-slate-300 px-6 py-3 font-semibold text-slate-900 transition-colors hover:bg-slate-50"
            >
              Ver préstamos
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
              <div className="mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold" style={{ background: "var(--green-bg)", color: "white" }}>
                En vivo
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">
                Remesas
              </h3>
              <p className="mb-4 text-slate-700">
                Compara tasas de Wise, Remitly, Western Union y MoneyGram en tiempo real.
              </p>
              <Link
                href="/remesas"
                className="inline-block font-semibold"
                style={{ color: "var(--green)" }}
              >
                Ver remesas →
              </Link>
            </div>

            {/* Préstamos */}
            <div className="rounded-lg border border-slate-200 p-6">
              <div className="mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold" style={{ background: "#f59e0b", color: "white" }}>
                Datos SIB
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">
                Préstamos
              </h3>
              <p className="mb-4 text-slate-700">
                Tasas oficiales de todos los bancos regulados por la SIB. Actualizado regularmente.
              </p>
              <Link
                href="/prestamos"
                className="inline-block font-semibold"
                style={{ color: "var(--green)" }}
              >
                Ver préstamos →
              </Link>
            </div>

            {/* Seguros */}
            <div className="rounded-lg border border-slate-200 p-6">
              <div className="mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold text-slate-600" style={{ background: "#e5e7eb" }}>
                Próximamente
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">
                Seguros
              </h3>
              <p className="mb-4 text-slate-700">
                Auto, vida y salud. Proximamente en Finazo.
              </p>
              <span className="inline-block font-semibold text-slate-500">
                Próximamente →
              </span>
            </div>
          </div>
        </div>

        {/* Corridors */}
        <div className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">
            Corredores de remesas hacia Guatemala
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {guatemalaCorridors.map((corridor) => (
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
                <strong>Datos de la SIB:</strong> Las tasas de préstamos provienen directamente de la Superintendencia de Bancos de Guatemala.
              </span>
            </li>
            <li className="flex gap-3">
              <span style={{ color: "var(--green)" }}>✓</span>
              <span className="text-slate-700">
                <strong>Remesas en tiempo real:</strong> Actualizadas cada 6 horas desde APIs oficiales.
              </span>
            </li>
            <li className="flex gap-3">
              <span style={{ color: "var(--green)" }}>✓</span>
              <span className="text-slate-700">
                <strong>Independiente:</strong> No somos propiedad de ningún banco. Nuestras comparaciones no se venden.
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
                name: "Guatemala",
                item: "https://finazo.lat/guatemala",
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
