import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Tarjetas de crédito en El Salvador, Guatemala y Honduras — Finazo",
  description:
    "Compara tarjetas de crédito en Centroamérica. Tasas de interés, cuotas anuales y beneficios de todos los bancos regulados.",
  alternates: {
    canonical: "https://finazo.lat/tarjetas",
    languages: {
      "es-SV": "https://finazo.lat/tarjetas",
      "x-default": "https://finazo.lat/tarjetas",
    },
  },
  openGraph: {
    title: "Comparar Tarjetas de Crédito — Centroamérica | Finazo",
    description:
      "Tasas, cuotas y beneficios de tarjetas de crédito en El Salvador, Guatemala y Honduras.",
    url: "https://finazo.lat/tarjetas",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://finazo.lat" },
    { "@type": "ListItem", position: 2, name: "Tarjetas", item: "https://finazo.lat/tarjetas" },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Cuál es la tasa de interés promedio de tarjetas de crédito en El Salvador?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "En El Salvador, las tasas de interés de tarjetas de crédito oscilan entre el 24% y el 36% anual, según el banco y el tipo de tarjeta. La SSF publica las tasas máximas que los bancos pueden cobrar.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuándo conviene usar una tarjeta de crédito en Centroamérica?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Una tarjeta de crédito conviene cuando puedes pagar el saldo completo cada mes, evitando intereses. También sirve para emergencias y para acumular millas o cashback. Evita usarla si llevarás saldo pendiente a una tasa alta.",
      },
    },
  ],
};

const GUIDE_TOPICS = [
  {
    title: "¿Cómo elegir tu primera tarjeta de crédito?",
    description:
      "Considera la tasa de interés, la cuota anual, el límite de crédito y los beneficios antes de aplicar.",
    slug: "tarjetas-credito-el-salvador-guia-2026",
  },
  {
    title: "Cómo usar la tarjeta sin endeudarte",
    description:
      "La regla de oro: paga el total antes de la fecha de corte. Si no puedes, no gastes con tarjeta.",
    slug: "como-usar-tarjeta-credito-sin-endeudarse-centroamerica",
  },
];

export default function TarjetasPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Header activePath="/tarjetas" />

      <main>
        {/* Page header */}
        <section style={{ background: "var(--green-bg)", borderBottom: "1px solid #d1e8d9" }}>
          <div className="mx-auto px-6 py-12" style={{ maxWidth: "var(--W)" }}>
            {/* Breadcrumb */}
            <div className="mb-5 text-sm" style={{ color: "var(--text-muted)" }}>
              <Link href="/" style={{ color: "var(--text-muted)" }} className="hover:underline">
                Inicio
              </Link>
              <span className="mx-2">›</span>
              <span>Tarjetas</span>
            </div>

            <h1
              className="mb-3 font-bold"
              style={{
                fontFamily: "var(--font-lora), Georgia, serif",
                fontSize: "clamp(28px, 4vw, 40px)",
                color: "#111",
              }}
            >
              Comparar tarjetas de crédito
            </h1>
            <p className="text-lg" style={{ color: "#555" }}>
              Tasas, cuotas y beneficios en El Salvador, Guatemala y Honduras.
            </p>
          </div>
        </section>

        <div className="mx-auto px-6 py-12" style={{ maxWidth: "var(--W)" }}>
          {/* Coming soon banner */}
          <div
            className="mb-10 rounded-2xl p-6"
            style={{ background: "var(--green-bg)", border: "1px solid #d1e8d9" }}
          >
            <div className="flex items-start gap-4">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg"
                style={{ background: "#fff" }}
              >
                📋
              </span>
              <div>
                <h2 className="mb-1 font-semibold" style={{ color: "#111" }}>
                  Comparador de tarjetas próximamente
                </h2>
                <p className="text-sm" style={{ color: "#555" }}>
                  Estamos recopilando datos oficiales de las tasas de tarjetas de crédito de todos
                  los bancos regulados de la región. Mientras tanto, puedes leer nuestras guías
                  para tomar la mejor decisión.
                </p>
              </div>
            </div>
          </div>

          {/* Guide cards */}
          <div className="mb-12">
            <h2
              className="mb-4 font-bold"
              style={{ fontSize: "var(--text-lg)", color: "#111" }}
            >
              Guías sobre tarjetas de crédito
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {GUIDE_TOPICS.map((g) => (
                <Link
                  key={g.slug}
                  href={`/guias/${g.slug}`}
                  className="group rounded-2xl p-5 transition-shadow hover:shadow-md"
                  style={{
                    background: "#fff",
                    border: "1px solid var(--border)",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  <span
                    className="mb-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold"
                    style={{ background: "var(--green-bg)", color: "var(--green)" }}
                  >
                    Tarjetas
                  </span>
                  <h3
                    className="mb-1 font-semibold transition-colors group-hover:underline"
                    style={{ color: "#111" }}
                  >
                    {g.title}
                  </h3>
                  <p className="text-sm" style={{ color: "#555" }}>
                    {g.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Educational content */}
          <div className="space-y-6">
            <div className="rounded-2xl p-6" style={{ background: "#f8faf9", border: "1px solid var(--border)" }}>
              <h2 className="mb-3 font-semibold" style={{ color: "#111" }}>
                ¿Qué debo saber antes de solicitar una tarjeta de crédito?
              </h2>
              <ul className="space-y-2 text-sm" style={{ color: "#444" }}>
                <li>
                  <strong>Tasa de interés (TIE):</strong> Es el costo anual de financiamiento si
                  llevas saldo. En Centroamérica puede ser del 24% al 36% anual. Pagar el saldo
                  completo te evita este costo.
                </li>
                <li>
                  <strong>Cuota anual:</strong> Algunos bancos cobran una tarifa fija por tener la
                  tarjeta. Compara si los beneficios justifican este costo.
                </li>
                <li>
                  <strong>Límite de crédito:</strong> Empieza con un límite bajo y auméntalo
                  conforme construyes tu historial crediticio.
                </li>
                <li>
                  <strong>Fecha de corte y fecha de pago:</strong> Paga antes de la fecha de pago
                  para evitar intereses moratorios.
                </li>
                <li>
                  <strong>Beneficios adicionales:</strong> Millas, cashback, acceso a salas VIP.
                  Evalúa si realmente los vas a usar.
                </li>
              </ul>
            </div>

            <div className="rounded-2xl p-6" style={{ background: "#f8faf9", border: "1px solid var(--border)" }}>
              <h2 className="mb-3 font-semibold" style={{ color: "#111" }}>
                Preguntas frecuentes
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="mb-1 text-sm font-semibold" style={{ color: "#111" }}>
                    ¿Cuál es la tasa de interés promedio en El Salvador?
                  </h3>
                  <p className="text-sm" style={{ color: "#555" }}>
                    Entre el 24% y 36% anual. La SSF publica las tasas máximas que los bancos pueden
                    cobrar. Finazo publicará este comparador pronto.
                  </p>
                </div>
                <div>
                  <h3 className="mb-1 text-sm font-semibold" style={{ color: "#111" }}>
                    ¿Es mejor una tarjeta Visa o Mastercard en Centroamérica?
                  </h3>
                  <p className="text-sm" style={{ color: "#555" }}>
                    Ambas tienen amplia aceptación en la región. La diferencia real está en los
                    beneficios que cada banco ofrece con cada marca, no en la marca en sí.
                  </p>
                </div>
                <div>
                  <h3 className="mb-1 text-sm font-semibold" style={{ color: "#111" }}>
                    ¿Puedo tener tarjeta de crédito sin historial crediticio?
                  </h3>
                  <p className="text-sm" style={{ color: "#555" }}>
                    Sí. Algunos bancos ofrecen tarjetas aseguradas (garantizadas con un depósito)
                    para quienes inician su historial. Es una buena forma de empezar.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA to other tools */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <Link
              href="/prestamos"
              className="rounded-2xl p-5 transition-shadow hover:shadow-md"
              style={{
                background: "var(--green-bg)",
                border: "1px solid #d1e8d9",
              }}
            >
              <h3 className="mb-1 font-semibold" style={{ color: "#111" }}>
                Compara préstamos personales →
              </h3>
              <p className="text-sm" style={{ color: "#555" }}>
                Tasas oficiales SSF, SIB y CNBS de todos los bancos regulados.
              </p>
            </Link>
            <Link
              href="/remesas"
              className="rounded-2xl p-5 transition-shadow hover:shadow-md"
              style={{
                background: "var(--green-bg)",
                border: "1px solid #d1e8d9",
              }}
            >
              <h3 className="mb-1 font-semibold" style={{ color: "#111" }}>
                Compara remesas →
              </h3>
              <p className="text-sm" style={{ color: "#555" }}>
                Encuentra la mejor tasa para enviar dinero a Centroamérica.
              </p>
            </Link>
          </div>

          <p className="mt-8 text-xs" style={{ color: "#999" }}>
            La información sobre tarjetas de crédito es de carácter educativo. Las tasas y
            condiciones son determinadas por cada entidad financiera. Algunos enlaces pueden ser
            de afiliado.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
