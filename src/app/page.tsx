import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FaqAccordion } from "@/components/home/FaqAccordion";

export const metadata: Metadata = {
  title: "Finazo — Compara remesas, préstamos y seguros en Centroamérica",
  description:
    "Encuentra las mejores tasas de remesas, préstamos personales y seguros en El Salvador, Guatemala y Honduras. Datos actualizados diariamente, gratis.",
  alternates: { canonical: "https://finazo.lat" },
};

// ── Data ───────────────────────────────────────────────────────────────────

const PRODUCTS = [
  {
    icon: "→",
    title: "Remesas",
    tag: "En vivo",
    tagColor: "#dcfce7",
    tagText: "#166534",
    desc: "¿Cuánto llega después de comisiones? Compara Wise, Remitly, Western Union y MoneyGram.",
    chips: ["Wise", "Remitly", "Western Union", "MoneyGram"],
    href: "/remesas",
    active: true,
  },
  {
    icon: "⬜",
    title: "Préstamos",
    tag: "Datos SSF",
    tagColor: "#dbeafe",
    tagText: "#1d4ed8",
    desc: "Tasas oficiales de todos los bancos regulados por la SSF de El Salvador.",
    chips: ["Banco Agrícola", "Davivienda", "BAC", "+5 más"],
    href: "/prestamos",
    active: true,
  },
  {
    icon: "◇",
    title: "Seguros",
    tag: "Próximamente",
    tagColor: "#f3f4f6",
    tagText: "#9ca3af",
    desc: "Cotiza seguros de auto, vida y salud de las principales aseguradoras.",
    chips: ["SISA", "Pacífico", "ASSA", "ASESUISA"],
    href: "/seguros",
    active: false,
  },
];

const TRUST = [
  {
    title: "Datos oficiales",
    desc: "Tasas de préstamos directamente de la SSF de El Salvador.",
  },
  {
    title: "Siempre actualizado",
    desc: "Remesas actualizadas cada 6 horas sin intervención manual.",
  },
  {
    title: "Independiente",
    desc: "No somos propiedad de ningún banco ni financiera.",
  },
  {
    title: "100% gratis",
    desc: "Sin registro, sin suscripción, sin costos ocultos.",
  },
];

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Elige qué comparar",
    desc: "Selecciona remesas, préstamos o seguros.",
  },
  {
    step: "2",
    title: "Ve las opciones lado a lado",
    desc: "Tasas reales, comisiones y condiciones de todos los proveedores en una sola tabla.",
  },
  {
    step: "3",
    title: "Elige el mejor y solicita",
    desc: "Haz clic en el proveedor que más te conviene y aplica directamente en su sitio.",
  },
];

const CORRIDORS = [
  {
    code: "US→SV",
    label: "EE.UU. → El Salvador",
    desc: "El corredor más usado por la diáspora salvadoreña",
    slug: "eeuu-el-salvador",
  },
  {
    code: "US→GT",
    label: "EE.UU. → Guatemala",
    desc: "Quetzales o dólares, compara el mejor precio",
    slug: "eeuu-guatemala",
  },
  {
    code: "US→HN",
    label: "EE.UU. → Honduras",
    desc: "Lempiras o dólares al mejor costo",
    slug: "eeuu-honduras",
  },
  {
    code: "ES→SV",
    label: "España → El Salvador",
    desc: "Euros a dólares al tipo de cambio real",
    slug: "espana-el-salvador",
  },
];

const METRICS = [
  { value: "5+", label: "servicios de remesas" },
  { value: "8", label: "bancos SSF" },
  { value: "4", label: "corredores activos" },
  { value: "6h", label: "actualización" },
];

// ── Structured Data ────────────────────────────────────────────────────────

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Finazo",
  url: "https://finazo.lat",
  logo: "https://finazo.lat/opengraph-image",
  description:
    "Comparador financiero independiente para Centroamérica — remesas, préstamos y seguros.",
  areaServed: ["SV", "GT", "HN"],
  knowsAbout: ["remesas", "préstamos personales", "seguros", "finanzas personales"],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Cómo se actualizan los datos de remesas?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Nuestros sistemas consultan automáticamente las tarifas de Wise, Remitly, Western Union y MoneyGram cada 6 horas. Los datos reflejan el costo real de enviar $200 USD en el corredor seleccionado.",
      },
    },
    {
      "@type": "Question",
      name: "¿De dónde vienen las tasas de préstamos?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Provienen directamente de la Superintendencia del Sistema Financiero (SSF) de El Salvador. Son las tasas máximas y mínimas que cada banco puede cobrar legalmente.",
      },
    },
    {
      "@type": "Question",
      name: "¿Finazo cobra alguna comisión a usuarios?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Finazo es completamente gratuito. Cuando haces clic en un proveedor podemos recibir una comisión de afiliado — esto nunca afecta las tasas ni el orden de resultados.",
      },
    },
  ],
};

// ── Page ───────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Header activePath="/" />

      <main>
        {/* ── HERO ── */}
        <section style={{ background: "var(--green-bg)", borderBottom: "1px solid #d1e8d9" }}>
          <div
            className="mx-auto px-6 py-20"
            style={{ maxWidth: "var(--W)" }}
          >
            <div className="mx-auto max-w-2xl text-center">
              {/* Kicker */}
              <div className="mb-5 inline-flex items-center gap-2">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{
                    background: "var(--green)",
                    animation: "pulse 2s infinite",
                  }}
                />
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--green)" }}
                >
                  Comparador financiero · Centroamérica
                </span>
              </div>

              <h1
                className="mb-5 font-bold leading-tight"
                style={{
                  fontFamily: "var(--font-lora), Georgia, serif",
                  fontSize: "clamp(36px, 5.5vw, 56px)",
                  color: "#111",
                }}
              >
                Tu dinero rinde más{" "}
                <span style={{ color: "var(--green)" }}>
                  cuando comparas primero
                </span>
              </h1>

              <p
                className="mx-auto mb-8 max-w-lg text-lg"
                style={{ color: "#555" }}
              >
                Compara remesas, préstamos y seguros en El Salvador, Guatemala y
                Honduras. Datos reales, actualizados automáticamente, gratis.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  href="/remesas"
                  className="rounded-full px-7 py-3 text-sm font-semibold text-white transition-colors"
                  style={{ background: "var(--green)" }}
                >
                  Comparar remesas →
                </Link>
                <Link
                  href="/prestamos"
                  className="rounded-full border px-7 py-3 text-sm font-semibold transition-colors"
                  style={{
                    borderColor: "var(--green)",
                    color: "var(--green)",
                    background: "transparent",
                  }}
                >
                  Ver préstamos
                </Link>
              </div>

              {/* Trust checkmarks */}
              <div className="mt-7 flex flex-wrap justify-center gap-4 text-xs" style={{ color: "#666" }}>
                {["Sin registro", "100% gratis", "Datos oficiales SSF"].map((t) => (
                  <span key={t} className="flex items-center gap-1.5">
                    <span style={{ color: "var(--green)" }}>✓</span>
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Live comparison card */}
            <div
              className="mx-auto mt-14 rounded-2xl p-6 shadow-md"
              style={{
                maxWidth: "520px",
                background: "#fff",
                border: "1px solid #d1e8d9",
              }}
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#999" }}>
                    Enviando $200 USD
                  </p>
                  <p className="text-sm font-semibold" style={{ color: "#111" }}>
                    EE.UU. → El Salvador
                  </p>
                </div>
                <span
                  className="rounded-full px-3 py-1 text-xs font-semibold"
                  style={{ background: "#dcfce7", color: "#166534" }}
                >
                  ● En vivo
                </span>
              </div>

              <div className="space-y-2">
                {[
                  { name: "Wise", fee: "$0.00", rate: "USD → USD", receives: "$200.00", best: true },
                  { name: "Remitly", fee: "$1.99", rate: "USD → USD", receives: "$198.01", best: false },
                  { name: "Western Union", fee: "$5.00", rate: "USD → USD", receives: "$195.00", best: false },
                ].map((row) => (
                  <div
                    key={row.name}
                    className="flex items-center justify-between rounded-xl px-4 py-3"
                    style={{
                      background: row.best ? "var(--green-bg)" : "#f9fafb",
                      border: row.best ? "1px solid #a3c9b0" : "1px solid transparent",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {row.best && (
                        <span
                          className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                          style={{ background: "var(--green)", color: "#fff" }}
                        >
                          MEJOR
                        </span>
                      )}
                      <span className="text-sm font-semibold" style={{ color: "#111" }}>
                        {row.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold" style={{ color: row.best ? "var(--green)" : "#111" }}>
                        {row.receives}
                      </p>
                      <p className="text-xs" style={{ color: "#999" }}>
                        Comisión: {row.fee}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/remesas/eeuu-el-salvador"
                className="mt-4 block text-center text-sm font-semibold transition-colors"
                style={{ color: "var(--green)" }}
              >
                Ver comparación completa →
              </Link>
            </div>
          </div>
        </section>

        {/* ── METRICS ── */}
        <section style={{ background: "#fff", borderBottom: "1px solid #e8ede9" }}>
          <div
            className="mx-auto px-6 py-5"
            style={{ maxWidth: "var(--W)" }}
          >
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 text-center">
              {METRICS.map((m) => (
                <div key={m.label}>
                  <p
                    className="text-2xl font-bold"
                    style={{
                      fontFamily: "var(--font-lora), Georgia, serif",
                      color: "var(--green)",
                    }}
                  >
                    {m.value}
                  </p>
                  <p className="text-xs" style={{ color: "#888" }}>
                    {m.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRODUCTS ── */}
        <section className="px-6 py-16" style={{ background: "var(--background)" }}>
          <div className="mx-auto" style={{ maxWidth: "var(--W)" }}>
            <h2
              className="mb-2 text-2xl font-bold"
              style={{
                fontFamily: "var(--font-lora), Georgia, serif",
                color: "#111",
              }}
            >
              ¿Qué quieres comparar?
            </h2>
            <p className="mb-10 text-sm" style={{ color: "#888" }}>
              Datos reales de los proveedores más usados en Centroamérica.
            </p>

            <div className="space-y-4">
              {PRODUCTS.map((p) => (
                <div
                  key={p.href}
                  className="rounded-2xl p-6"
                  style={{
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                    opacity: p.active ? 1 : 0.6,
                  }}
                >
                  <div className="flex items-start gap-5">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl"
                      style={{ background: "var(--green-bg)", color: "var(--green)" }}
                    >
                      {p.icon}
                    </div>
                    <div className="flex-1">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <span
                          className="text-lg font-bold"
                          style={{ color: "#111" }}
                        >
                          {p.title}
                        </span>
                        <span
                          className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                          style={{ background: p.tagColor, color: p.tagText }}
                        >
                          {p.tag}
                        </span>
                      </div>
                      <p className="mb-3 text-sm" style={{ color: "#666" }}>
                        {p.desc}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {p.chips.map((chip) => (
                          <span
                            key={chip}
                            className="rounded-full px-3 py-1 text-xs font-medium"
                            style={{ background: "#f3f4f6", color: "#555" }}
                          >
                            {chip}
                          </span>
                        ))}
                      </div>
                    </div>
                    {p.active ? (
                      <Link
                        href={p.href}
                        className="shrink-0 rounded-full px-5 py-2 text-sm font-semibold text-white transition-colors"
                        style={{ background: "var(--green)" }}
                      >
                        Comparar →
                      </Link>
                    ) : (
                      <span
                        className="shrink-0 rounded-full px-5 py-2 text-sm font-semibold"
                        style={{ background: "#f3f4f6", color: "#999" }}
                      >
                        Próximamente
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TRUST ── */}
        <section
          className="px-6 py-14"
          style={{ background: "var(--green-bg)", borderTop: "1px solid #d1e8d9", borderBottom: "1px solid #d1e8d9" }}
        >
          <div className="mx-auto" style={{ maxWidth: "var(--W)" }}>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {TRUST.map((item) => (
                <div key={item.title}>
                  <p
                    className="mb-1 font-semibold"
                    style={{ color: "var(--green)" }}
                  >
                    {item.title}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: "#555" }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="px-6 py-16" style={{ background: "#fff" }}>
          <div className="mx-auto" style={{ maxWidth: "var(--W)" }}>
            <h2
              className="mb-10 text-2xl font-bold"
              style={{
                fontFamily: "var(--font-lora), Georgia, serif",
                color: "#111",
              }}
            >
              ¿Cómo funciona?
            </h2>
            <div className="grid gap-10 sm:grid-cols-3">
              {HOW_IT_WORKS.map((step, i) => (
                <div key={i}>
                  <p
                    className="mb-3 text-4xl font-bold"
                    style={{
                      fontFamily: "var(--font-lora), Georgia, serif",
                      color: "#eef4f0",
                    }}
                  >
                    {step.step}
                  </p>
                  <h3
                    className="mb-2 font-semibold"
                    style={{ color: "#111" }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#666" }}>
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CORRIDORS ── */}
        <section
          className="px-6 py-14"
          style={{ background: "var(--background)", borderTop: "1px solid #e5e7eb" }}
        >
          <div className="mx-auto" style={{ maxWidth: "var(--W)" }}>
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2
                  className="text-2xl font-bold"
                  style={{
                    fontFamily: "var(--font-lora), Georgia, serif",
                    color: "#111",
                  }}
                >
                  Corredores más buscados
                </h2>
                <p className="mt-1 text-sm" style={{ color: "#888" }}>
                  Compara quién te cobra menos en cada ruta
                </p>
              </div>
              <Link
                href="/remesas"
                className="text-sm font-medium transition-colors"
                style={{ color: "var(--green)" }}
              >
                Ver todos →
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {CORRIDORS.map((c) => (
                <Link
                  key={c.slug}
                  href={`/remesas/${c.slug}`}
                  className="group rounded-2xl p-5 transition-shadow hover:shadow-md"
                  style={{
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                    textDecoration: "none",
                  }}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span
                      className="rounded-full px-2.5 py-1 text-xs font-bold"
                      style={{ background: "var(--green-bg)", color: "var(--green)" }}
                    >
                      {c.code}
                    </span>
                    <span
                      className="text-sm transition-transform group-hover:translate-x-1"
                      style={{ color: "var(--green)" }}
                    >
                      →
                    </span>
                  </div>
                  <p className="mb-1 font-semibold" style={{ color: "#111" }}>
                    {c.label}
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: "#888" }}>
                    {c.desc}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section
          className="px-6 py-14"
          style={{ background: "#fff", borderTop: "1px solid #e5e7eb" }}
        >
          <div className="mx-auto" style={{ maxWidth: "var(--W)" }}>
            <h2
              className="mb-8 text-2xl font-bold"
              style={{
                fontFamily: "var(--font-lora), Georgia, serif",
                color: "#111",
              }}
            >
              Preguntas frecuentes
            </h2>
            <FaqAccordion />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
