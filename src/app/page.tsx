import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FaqAccordion } from "@/components/home/FaqAccordion";
import { ArticlesScroll } from "@/components/home/ArticlesScroll";
import { getPublishedArticles } from "@/lib/queries/articles";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Finazo — Compara remesas, préstamos y seguros en Centroamérica",
  description:
    "Encuentra las mejores tasas de remesas, préstamos personales y seguros en El Salvador, Guatemala y Honduras. Datos actualizados diariamente, gratis.",
  alternates: { canonical: "https://finazo.lat" },
};

// ── Data ───────────────────────────────────────────────────────────────────

const PRODUCTS = [
  {
    title: "Remesas",
    tag: "En vivo",
    tagVariant: "pop" as const,
    desc: "¿Cuánto llega después de comisiones? Compara Wise, Remitly, Western Union y MoneyGram.",
    chips: ["Wise", "Remitly", "Western Union", "MoneyGram"],
    href: "/remesas",
    active: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22, color: "var(--green)" }}>
        <path d="M4 8h13M13 5l4 3-4 3" />
        <path d="M20 16H7M11 13l-4 3 4 3" />
      </svg>
    ),
  },
  {
    title: "Préstamos",
    tag: "Datos SSF",
    tagVariant: "ssf" as const,
    desc: "Tasas oficiales de todos los bancos regulados por la SSF. El Salvador, Guatemala y Honduras.",
    chips: ["Banco Agrícola", "Davivienda", "BAC", "+5 más"],
    href: "/prestamos",
    active: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22, color: "var(--green)" }}>
        <path d="M3 21h18M5 21V10M19 21V10M9 21v-7h6v7M2 10l10-7 10 7" />
      </svg>
    ),
  },
  {
    title: "Seguros",
    tag: "Próximamente",
    tagVariant: "soon" as const,
    desc: "Cotiza seguros de auto, vida y salud de las principales aseguradoras.",
    chips: ["SISA", "Pacífico", "ASSA", "ASESUISA"],
    href: "/seguros",
    active: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22, color: "var(--green)" }}>
        <path d="M12 3L4 7v5c0 5 3.6 9.3 8 10 4.4-.7 8-5 8-10V7L12 3z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
];

const TRUST = [
  {
    title: "Datos oficiales",
    desc: "Tasas de préstamos directamente de la SSF de El Salvador, SIB de Guatemala y CNBS de Honduras.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
        <path d="M12 3L4 7v5c0 5 3.6 9.3 8 10 4.4-.7 8-5 8-10V7L12 3z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Siempre actualizado",
    desc: "Remesas actualizadas cada 6 horas automáticamente. Tasas bancarias al día con las publicaciones oficiales.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    ),
  },
  {
    title: "Independiente",
    desc: "No somos propiedad de ningún banco ni financiera. Nuestras comparaciones no se venden.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    title: "100% gratis",
    desc: "Sin registro, sin suscripción, sin costos ocultos. Comparas gratis, siempre.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
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

export default async function HomePage() {
  const recentArticles = await getPublishedArticles();
  const featuredArticles = recentArticles.slice(0, 6);
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
              <div className="flex flex-col items-center gap-3">
                <Link
                  href="/remesas"
                  className="rounded-full px-8 py-3.5 text-sm font-semibold text-white transition-colors"
                  style={{ background: "var(--green)" }}
                >
                  Comparar remesas →
                </Link>
                <Link
                  href="/prestamos"
                  className="text-sm font-medium transition-colors"
                  style={{ color: "var(--green)" }}
                >
                  Ver tasas de préstamos →
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

            {/* prod-list */}
            <div
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                overflow: "hidden",
                background: "#fff",
              }}
            >
              {PRODUCTS.map((p, i) => {
                const tagStyle =
                  p.tagVariant === "pop"
                    ? { background: "#C6ECD9", color: "var(--green)" }
                    : p.tagVariant === "ssf"
                    ? { background: "#DDEEFF", color: "#1E5AAD" }
                    : { background: "#F0F0EE", color: "#888" };

                const row = (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "52px 1fr auto",
                      alignItems: "center",
                      borderBottom: i < PRODUCTS.length - 1 ? "1px solid #e5e7eb" : "none",
                      opacity: p.active ? 1 : 0.45,
                      pointerEvents: p.active ? "auto" : "none",
                      position: "relative",
                    }}
                  >
                    {/* icon column */}
                    <div
                      style={{
                        background: "var(--green-bg)",
                        borderRight: "1px solid #e5e7eb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        alignSelf: "stretch",
                      }}
                    >
                      {p.icon}
                    </div>

                    {/* body column */}
                    <div style={{ padding: "18px 20px" }}>
                      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                        <span style={{ fontWeight: 700, fontSize: "15px", color: "#111" }}>{p.title}</span>
                        <span
                          style={{
                            ...tagStyle,
                            fontSize: "11px",
                            fontWeight: 600,
                            padding: "2px 9px",
                            borderRadius: "999px",
                          }}
                        >
                          {p.tag}
                        </span>
                      </div>
                      <p style={{ fontSize: "13px", color: "#666", marginBottom: "8px", lineHeight: 1.5 }}>{p.desc}</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {p.chips.map((chip) => (
                          <span
                            key={chip}
                            style={{
                              fontSize: "11px",
                              fontWeight: 500,
                              padding: "3px 10px",
                              borderRadius: "999px",
                              background: "#f3f4f6",
                              color: "#555",
                            }}
                          >
                            {chip}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* action column */}
                    <div style={{ padding: "18px 20px" }}>
                      {p.active ? (
                        <Link
                          href={p.href}
                          style={{
                            display: "inline-block",
                            background: "var(--green)",
                            color: "#fff",
                            fontSize: "13px",
                            fontWeight: 600,
                            padding: "9px 18px",
                            borderRadius: "6px",
                            whiteSpace: "nowrap",
                            textDecoration: "none",
                          }}
                        >
                          Comparar
                        </Link>
                      ) : (
                        <span
                          style={{
                            display: "inline-block",
                            background: "#f3f4f6",
                            color: "#999",
                            fontSize: "13px",
                            fontWeight: 600,
                            padding: "9px 18px",
                            borderRadius: "6px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Próximamente
                        </span>
                      )}
                    </div>
                  </div>
                );

                return p.active ? (
                  <div key={p.href} style={{ position: "relative", overflow: "hidden" }}>
                    {row}
                  </div>
                ) : (
                  <div key={p.href}>{row}</div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── TRUST ── */}
        <section
          className="px-6 py-14"
          style={{ background: "var(--green-bg)", borderTop: "1px solid #d1e8d9", borderBottom: "1px solid #d1e8d9" }}
        >
          <div className="mx-auto" style={{ maxWidth: "var(--W)" }}>
            <h2
              className="mb-8 text-center font-bold"
              style={{
                fontFamily: "var(--font-lora), Georgia, serif",
                fontSize: "var(--text-2xl)",
                color: "#111",
              }}
            >
              ¿Por qué confiar en Finazo?
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {TRUST.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl p-5"
                  style={{
                    background: "#fff",
                    border: "1px solid #d1e8d9",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  <div
                    className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ background: "var(--green-bg)", color: "var(--green)" }}
                  >
                    {item.icon}
                  </div>
                  <p className="mb-1 font-semibold" style={{ color: "#111" }}>
                    {item.title}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: "#666" }}>
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

        {/* ── ARTICLES ── */}
        <ArticlesScroll articles={featuredArticles} />

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
