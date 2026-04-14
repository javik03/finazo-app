import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getUsLoanProducts } from "@/lib/queries/us-loans";

export const metadata: Metadata = {
  title: "Préstamos Personales para Hispanos en EE.UU. — Compara APRs | Finazo",
  description:
    "Compara préstamos personales para hispanos en Estados Unidos. APRs desde 7.49%, opciones con ITIN sin SSN, sin historial crediticio previo. Actualizado semanalmente.",
  alternates: {
    canonical: "https://finazo.lat/us/prestamos",
    languages: {
      "es-US": "https://finazo.lat/us/prestamos",
      "x-default": "https://finazo.lat/us/prestamos",
    },
  },
  openGraph: {
    title: "Préstamos para Hispanos en EE.UU. | Finazo",
    description:
      "APRs desde 7.49%. Opciones con ITIN, sin SSN. Compara SoFi, LightStream, Upgrade, Avant y más.",
    url: "https://finazo.lat/us/prestamos",
    locale: "es_US",
  },
};

export const revalidate = 604800; // 1 week

const TARGET_STATES = [
  { slug: "california", name: "California" },
  { slug: "texas", name: "Texas" },
  { slug: "florida", name: "Florida" },
  { slug: "nueva-york", name: "Nueva York" },
  { slug: "illinois", name: "Illinois" },
  { slug: "arizona", name: "Arizona" },
  { slug: "nueva-jersey", name: "Nueva Jersey" },
  { slug: "colorado", name: "Colorado" },
  { slug: "nuevo-mexico", name: "Nuevo México" },
  { slug: "nevada", name: "Nevada" },
];

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://finazo.lat" },
    { "@type": "ListItem", position: 2, name: "EE.UU.", item: "https://finazo.lat/us" },
    { "@type": "ListItem", position: 3, name: "Préstamos", item: "https://finazo.lat/us/prestamos" },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Puedo obtener un préstamo personal en EE.UU. con ITIN y sin SSN?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. Upgrade, Self Financial y Accion Opportunity Fund aceptan ITIN (Individual Taxpayer Identification Number). El ITIN se solicita con el formulario W-7 del IRS. Con ITIN puedes obtener préstamos personales de $1,000 a $50,000 con APRs de 9.99% a 35.99% según tu perfil crediticio.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué credit score necesito para un préstamo personal en EE.UU.?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Depende del prestamista. LightStream y SoFi requieren mínimo 660-680. Upgrade y Avant aceptan desde 580. OppFi y algunos CDFIs no tienen mínimo de score, pero cobran APRs más altos (59%-160%). Si estás construyendo crédito, empieza con Self Financial (credit builder loan) antes de solicitar un préstamo personal.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuánto tiempo tarda en aprobarse y desembolsarse un préstamo personal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Los prestamistas digitales como LightStream y Avant pueden depositar el dinero el mismo día o al día siguiente de la aprobación. SoFi y Upgrade tardan 3-4 días hábiles. Los préstamos de cooperativas de crédito y bancos tradicionales pueden tardar 5-10 días.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuál es la diferencia entre APR y tasa de interés en un préstamo?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La tasa de interés es el costo del préstamo sin comisiones adicionales. El APR (Annual Percentage Rate) incluye la tasa de interés más todas las comisiones del préstamo, especialmente la origination fee (comisión de apertura, típicamente 1-9.99%). El APR es el número más honesto para comparar el costo real de un préstamo entre diferentes prestamistas.",
      },
    },
  ],
};

const speakableSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", ".intro-text", ".key-callout"],
  },
  url: "https://finazo.lat/us/prestamos",
};

function formatApr(val: string | null): string {
  if (!val) return "—";
  return `${parseFloat(val).toFixed(2)}%`;
}

function formatAmount(val: string | null): string {
  if (!val) return "—";
  const n = parseFloat(val);
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

// Static fallback data for initial render before DB is seeded
const STATIC_LENDERS = [
  { provider: "LightStream", loanType: "personal", aprMin: "7.49", aprMax: "25.49", amountMin: "5000", amountMax: "100000", termMinMonths: 24, termMaxMonths: 144, minCreditScore: 660, acceptsItin: false, fundingDays: 1, originationFeePercent: "0" },
  { provider: "SoFi", loanType: "personal", aprMin: "8.99", aprMax: "29.49", amountMin: "5000", amountMax: "100000", termMinMonths: 24, termMaxMonths: 84, minCreditScore: 680, acceptsItin: false, fundingDays: 3, originationFeePercent: "0" },
  { provider: "Upgrade", loanType: "personal", aprMin: "9.99", aprMax: "35.99", amountMin: "1000", amountMax: "50000", termMinMonths: 24, termMaxMonths: 84, minCreditScore: 580, acceptsItin: true, fundingDays: 4, originationFeePercent: "9.99" },
  { provider: "Avant", loanType: "personal", aprMin: "9.95", aprMax: "35.99", amountMin: "2000", amountMax: "35000", termMinMonths: 12, termMaxMonths: 60, minCreditScore: 580, acceptsItin: false, fundingDays: 1, originationFeePercent: "9.99" },
  { provider: "OppFi", loanType: "personal", aprMin: "59.0", aprMax: "160.0", amountMin: "500", amountMax: "4000", termMinMonths: 9, termMaxMonths: 18, minCreditScore: null, acceptsItin: false, fundingDays: 1, originationFeePercent: "0" },
  { provider: "Self Financial", loanType: "credit-builder", aprMin: "15.65", aprMax: "15.97", amountMin: "600", amountMax: "1800", termMinMonths: 12, termMaxMonths: 24, minCreditScore: null, acceptsItin: true, fundingDays: null, originationFeePercent: "0" },
];

export default async function UsPrestamosPage() {
  let lenders: typeof STATIC_LENDERS = [];
  try {
    const rows = await getUsLoanProducts("personal");
    lenders = rows.length > 0 ? rows as typeof STATIC_LENDERS : STATIC_LENDERS;
  } catch {
    lenders = STATIC_LENDERS;
  }

  // Sort by APR min ascending
  const sorted = [...lenders].sort(
    (a, b) => parseFloat(a.aprMin ?? "999") - parseFloat(b.aprMin ?? "999")
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
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
      <main className="min-h-screen" style={{ background: "#fff" }}>

        {/* Hero */}
        <section style={{ background: "var(--green-bg)", borderBottom: "1px solid #d1e8d9" }}>
          <div
            className="mx-auto px-6 py-10"
            style={{ maxWidth: "var(--W)" }}
          >
            <div className="mb-4 text-sm" style={{ color: "#666" }}>
              <Link href="/" style={{ color: "var(--green)" }}>
                Inicio
              </Link>
              <span className="mx-2">›</span>
              <Link href="/us" style={{ color: "var(--green)" }}>
                EE.UU.
              </Link>
              <span className="mx-2">›</span>
              <span>Préstamos personales</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-3" style={{ color: "#111" }}>
              Préstamos personales para hispanos en Estados Unidos
            </h1>
            <p className="text-lg max-w-2xl intro-text" style={{ color: "#555" }}>
              Compara APRs, montos y requisitos de los principales prestamistas.
              Incluye opciones con <strong>ITIN sin necesidad de SSN</strong> y
              sin historial crediticio previo en EE.UU.
            </p>
          </div>
        </section>

        {/* Key callout */}
        <section className="mx-auto px-6 py-8" style={{ maxWidth: "var(--W)" }}>
          <div
            className="rounded-2xl p-6 max-w-2xl key-callout"
            style={{ background: "var(--green-bg)", border: "1px solid #d1e8d9" }}
          >
            <p className="text-sm" style={{ color: "#555" }}>
              <strong style={{ color: "#111" }}>Lo esencial:</strong> El APR incluye todos los cargos —
              es el número real para comparar. Upgrade y Self Financial aceptan
              ITIN. LightStream tiene el APR más bajo pero requiere crédito
              establecido (660+).
            </p>
          </div>
        </section>

        {/* Comparison table */}
        <section className="mx-auto px-6 py-8" style={{ maxWidth: "var(--W)" }}>
          <h2 className="text-xl font-bold mb-4" style={{ color: "#111" }}>
            Comparativa de prestamistas — 2025
          </h2>
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: "1px solid #d1e8d9" }}
          >
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--green-bg)", borderBottom: "1px solid #d1e8d9" }}>
                  <th
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--green)" }}
                  >
                    Prestamista
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--green)" }}
                  >
                    APR
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--green)" }}
                  >
                    Monto
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--green)" }}
                  >
                    Plazo
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--green)" }}
                  >
                    Score mín.
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--green)" }}
                  >
                    ITIN
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--green)" }}
                  >
                    Depósito
                  </th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((lender, i) => (
                  <tr
                    key={i}
                    className="border-b hover:bg-slate-50 transition-colors"
                    style={{
                      borderColor: "#e5e7eb",
                      background: i % 2 === 0 ? "#fff" : "#fafafa",
                    }}
                  >
                    <td className="px-4 py-3 font-medium" style={{ color: "#111" }}>
                      {lender.provider}
                    </td>
                    <td className="px-4 py-3" style={{ color: "#555" }}>
                      {formatApr(lender.aprMin)}–{formatApr(lender.aprMax)}
                    </td>
                    <td className="px-4 py-3" style={{ color: "#555" }}>
                      {formatAmount(lender.amountMin)}–{formatAmount(lender.amountMax)}
                    </td>
                    <td className="px-4 py-3" style={{ color: "#555" }}>
                      {lender.termMinMonths}–{lender.termMaxMonths} meses
                    </td>
                    <td className="px-4 py-3" style={{ color: "#555" }}>
                      {lender.minCreditScore ?? "Sin mínimo"}
                    </td>
                    <td className="px-4 py-3">
                      {lender.acceptsItin ? (
                        <span
                          className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                          style={{ background: "#dcfce7", color: "#166534" }}
                        >
                          ✓ Sí
                        </span>
                      ) : (
                        <span style={{ color: "#999", fontSize: "0.75rem" }}>No</span>
                      )}
                    </td>
                    <td className="px-4 py-3" style={{ color: "#555" }}>
                      {lender.fundingDays === 0
                        ? "N/A"
                        : lender.fundingDays === 1
                        ? "Mismo día"
                        : lender.fundingDays
                        ? `${lender.fundingDays} días`
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs" style={{ color: "#888" }}>
            APRs publicados por cada prestamista. La tasa final depende de tu historial crediticio.
            Actualizado semanalmente por Finazo.
          </p>
        </section>

        {/* Guide content */}
        <section className="mx-auto px-6 py-12" style={{ maxWidth: "var(--W)" }}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">

              <div
                className="rounded-2xl p-6"
                style={{ background: "#fff", border: "1px solid #d1e8d9" }}
              >
                <h2 className="text-lg font-semibold mb-3" style={{ color: "#111" }}>
                  ¿Qué necesitas para solicitar un préstamo personal?
                </h2>
                <ul className="space-y-2 text-sm" style={{ color: "#555" }}>
                  <li className="flex gap-2"><span style={{ color: "var(--green)", marginTop: "0.125rem" }}>✓</span><span><strong style={{ color: "#111" }}>Identificación:</strong> SSN o ITIN (según el prestamista)</span></li>
                  <li className="flex gap-2"><span style={{ color: "var(--green)", marginTop: "0.125rem" }}>✓</span><span><strong style={{ color: "#111" }}>Comprobante de ingresos:</strong> talón de pago (pay stub), cartas de empleador, o declaración de impuestos</span></li>
                  <li className="flex gap-2"><span style={{ color: "var(--green)", marginTop: "0.125rem" }}>✓</span><span><strong style={{ color: "#111" }}>Cuenta bancaria:</strong> en EE.UU. para recibir el depósito</span></li>
                  <li className="flex gap-2"><span style={{ color: "var(--green)", marginTop: "0.125rem" }}>✓</span><span><strong style={{ color: "#111" }}>Historial crediticio:</strong> algunos prestamistas aceptan score desde 580; otros no tienen mínimo</span></li>
                  <li className="flex gap-2"><span style={{ color: "var(--green)", marginTop: "0.125rem" }}>✓</span><span><strong style={{ color: "#111" }}>Dirección en EE.UU.:</strong> comprobante de domicilio (recibo de servicios, contrato de renta)</span></li>
                </ul>
              </div>

              <div
                className="rounded-2xl p-6"
                style={{ background: "#fff", border: "1px solid #d1e8d9" }}
              >
                <h2 className="text-lg font-semibold mb-3" style={{ color: "#111" }}>
                  Cómo calcular el costo real de tu préstamo
                </h2>
                <p className="text-sm mb-3" style={{ color: "#555" }}>
                  Usa el APR (no la tasa de interés nominal) para comparar. Un préstamo de{" "}
                  <strong>$10,000 a 36 meses al APR 15%</strong> cuesta aproximadamente{" "}
                  <strong>$347/mes</strong> y $2,482 en intereses totales.
                  El mismo préstamo al <strong>30% APR</strong> cuesta $420/mes y $5,120 en intereses.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr style={{ background: "var(--green-bg)", borderBottom: "1px solid #d1e8d9" }}>
                        <th className="border px-3 py-2 text-left font-semibold" style={{ borderColor: "#d1e8d9", color: "var(--green)" }}>APR</th>
                        <th className="border px-3 py-2 text-left font-semibold" style={{ borderColor: "#d1e8d9", color: "var(--green)" }}>Cuota mensual</th>
                        <th className="border px-3 py-2 text-left font-semibold" style={{ borderColor: "#d1e8d9", color: "var(--green)" }}>Intereses totales</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td className="border px-3 py-2" style={{ borderColor: "#d1e8d9", color: "#555" }}>10%</td><td className="border px-3 py-2" style={{ borderColor: "#d1e8d9", color: "#555" }}>$323</td><td className="border px-3 py-2" style={{ borderColor: "#d1e8d9", color: "#555" }}>$1,616</td></tr>
                      <tr style={{ background: "var(--green-bg)" }}><td className="border px-3 py-2" style={{ borderColor: "#d1e8d9", color: "#555" }}>15%</td><td className="border px-3 py-2" style={{ borderColor: "#d1e8d9", color: "#555" }}>$347</td><td className="border px-3 py-2" style={{ borderColor: "#d1e8d9", color: "#555" }}>$2,482</td></tr>
                      <tr><td className="border px-3 py-2" style={{ borderColor: "#d1e8d9", color: "#555" }}>20%</td><td className="border px-3 py-2" style={{ borderColor: "#d1e8d9", color: "#555" }}>$372</td><td className="border px-3 py-2" style={{ borderColor: "#d1e8d9", color: "#555" }}>$3,396</td></tr>
                      <tr style={{ background: "var(--green-bg)" }}><td className="border px-3 py-2" style={{ borderColor: "#d1e8d9", color: "#555" }}>30%</td><td className="border px-3 py-2" style={{ borderColor: "#d1e8d9", color: "#555" }}>$420</td><td className="border px-3 py-2" style={{ borderColor: "#d1e8d9", color: "#555" }}>$5,120</td></tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs mt-2" style={{ color: "#888" }}>$10,000 a 36 meses. Solo referencia.</p>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-4">
              <div
                className="rounded-2xl p-6"
                style={{ background: "var(--green-bg)", border: "1px solid #d1e8d9" }}
              >
                <h3 className="font-semibold mb-2 text-sm" style={{ color: "#111" }}>
                  ¿Sin historial crediticio?
                </h3>
                <p className="text-xs mb-3" style={{ color: "#555" }}>
                  Empieza con un préstamo para construir crédito (credit builder loan).
                  Self Financial reporta a Equifax, Experian y TransUnion.
                </p>
                <Link
                  href="/us/credito"
                  className="block text-center text-xs font-medium rounded-lg px-3 py-2 transition-colors"
                  style={{
                    background: "var(--green)",
                    color: "#fff",
                  }}
                >
                  Guía para construir crédito
                </Link>
              </div>

              <div
                className="rounded-2xl p-6"
                style={{ background: "#fff", border: "1px solid #d1e8d9" }}
              >
                <h3 className="font-semibold mb-3 text-sm" style={{ color: "#111" }}>
                  Préstamos por estado
                </h3>
                <ul className="space-y-1">
                  {TARGET_STATES.map((state) => (
                    <li key={state.slug}>
                      <Link
                        href={`/us/prestamos/${state.slug}`}
                        className="text-sm hover:underline"
                        style={{ color: "var(--green)" }}
                      >
                        {state.name} →
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto px-6 py-12" style={{ maxWidth: "var(--W)" }}>
          <h2 className="text-xl font-bold mb-6" style={{ color: "#111" }}>
            Preguntas frecuentes
          </h2>
          <div className="space-y-4">
            {faqSchema.mainEntity.map((faq, i) => (
              <div
                key={i}
                className="rounded-2xl p-6"
                style={{ background: "var(--background)", border: "1px solid #e5e7eb" }}
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
        </section>
      </main>
      <Footer />
    </>
  );
}
