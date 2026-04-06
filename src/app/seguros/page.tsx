import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Seguros | Finazo",
  description:
    "Compara seguros de auto, vida, hogar y salud en Centroamérica y México. Próximamente disponibles en Finazo.",
  alternates: { canonical: "https://finazo.lat/seguros" },
  robots: { index: true, follow: true },
};

const COUNTRIES = [
  {
    code: "SV",
    name: "El Salvador",
    flag: "🇸🇻",
    href: "/el-salvador",
  },
  {
    code: "GT",
    name: "Guatemala",
    flag: "🇬🇹",
    href: "/guatemala",
  },
  {
    code: "HN",
    name: "Honduras",
    flag: "🇭🇳",
    href: "/honduras",
  },
  {
    code: "MX",
    name: "México",
    flag: "🇲🇽",
    href: "/mexico",
  },
];

const INSURANCE_TYPES = [
  {
    title: "Auto",
    description: "Responsabilidad civil, robo, daño total",
    icon: "🚗",
  },
  {
    title: "Vida",
    description: "Protección para tu familia",
    icon: "❤️",
  },
  {
    title: "Salud",
    description: "Cobertura médica y hospitalaria",
    icon: "🏥",
  },
  {
    title: "Hogar",
    description: "Protección de bienes y responsabilidad",
    icon: "🏠",
  },
];

export default function SegurosPage() {
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
          <span className="text-slate-600">Seguros</span>
        </div>

        {/* Hero */}
        <div className="mb-16">
          <h1 className="mb-4 text-4xl font-bold text-slate-900">
            Seguros en Centroamérica y México
          </h1>
          <p className="mb-6 text-lg text-slate-700">
            Compara cotizaciones de seguros de auto, vida, salud y hogar de las principales aseguradoras de la región. Disponible próximamente.
          </p>
        </div>

        {/* Info Section */}
        <div className="mb-16 rounded-lg border border-slate-200 p-8" style={{ background: "#f9fafb" }}>
          <h2 className="mb-4 text-xl font-bold text-slate-900">
            ¿Qué está próximamente?
          </h2>
          <p className="mb-4 text-slate-700">
            Estamos trabajando en agregar seguros a Finazo. Podrás comparar cotizaciones de:
          </p>
          <ul className="space-y-2 text-slate-700">
            <li>✓ Seguros de auto en todos los países</li>
            <li>✓ Seguros de vida y salud</li>
            <li>✓ Seguros de hogar y responsabilidad civil</li>
            <li>✓ Cobertura en El Salvador, Guatemala, Honduras y México</li>
          </ul>
        </div>

        {/* Country & Type Grid */}
        <div className="mb-16">
          <h2 className="mb-8 text-2xl font-bold text-slate-900">
            Seguros por país y tipo (próximamente)
          </h2>
          <div className="space-y-8">
            {COUNTRIES.map((country) => (
              <div key={country.code}>
                <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-slate-900">
                  <span className="text-3xl">{country.flag}</span>
                  {country.name}
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                  {INSURANCE_TYPES.map((type) => (
                    <div
                      key={`${country.code}-${type.title}`}
                      className="rounded-lg border border-slate-200 p-6 text-center opacity-60"
                    >
                      <div className="mb-3 text-3xl">{type.icon}</div>
                      <h4 className="mb-1 font-semibold text-slate-900">
                        {type.title}
                      </h4>
                      <p className="mb-4 text-sm text-slate-600">
                        {type.description}
                      </p>
                      <div className="text-xs font-semibold text-slate-500">
                        Próximamente
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why Finazo Section */}
        <div className="mb-16">
          <h2 className="mb-8 text-2xl font-bold text-slate-900">
            ¿Por qué esperar a Finazo para seguros?
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex gap-4">
              <div className="shrink-0 text-2xl">📊</div>
              <div>
                <h3 className="mb-2 font-semibold text-slate-900">
                  Comparación transparente
                </h3>
                <p className="text-slate-700">
                  Cotizas desde el mismo lugar, sin dejar tu datos en 10 sitios diferentes.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 text-2xl">✓</div>
              <div>
                <h3 className="mb-2 font-semibold text-slate-900">
                  Datos oficiales
                </h3>
                <p className="text-slate-700">
                  Cotizaciones verificadas directamente de aseguradoras reguladas.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 text-2xl">⚡</div>
              <div>
                <h3 className="mb-2 font-semibold text-slate-900">
                  Rápido y fácil
                </h3>
                <p className="text-slate-700">
                  Completas un formulario una vez y obtienes múltiples cotizaciones.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 text-2xl">🔐</div>
              <div>
                <h3 className="mb-2 font-semibold text-slate-900">
                  100% gratis
                </h3>
                <p className="text-slate-700">
                  Sin costo, sin obligación, sin sorpresas.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="rounded-lg border border-emerald-200 p-8" style={{ background: "rgba(16, 185, 129, 0.05)" }}>
          <h2 className="mb-4 text-xl font-bold text-slate-900">
            ¿Necesitas seguros ahora?
          </h2>
          <p className="mb-6 text-slate-700">
            Mientras esperas que Finazo agregue seguros, puedes visitar directamente a las aseguradoras principales:
          </p>
          <ul className="mb-6 space-y-2 text-slate-700">
            <li>El Salvador: SISA, Pacífico, ASSA, ASESUISA</li>
            <li>Guatemala: Seguros Monterrey New York Life, AXA, Mapfre</li>
            <li>Honduras: SEDEMI, Seguros ASSA, BAC Seguros</li>
            <li>México: AXA México, Zurich, GNP</li>
          </ul>
          <div className="flex gap-4">
            <Link
              href="/"
              className="rounded-lg px-6 py-3 font-semibold text-white transition-colors"
              style={{ background: "var(--green-bg)" }}
            >
              Volver a Finazo
            </Link>
            <Link
              href="/remesas"
              className="rounded-lg border border-slate-300 px-6 py-3 font-semibold text-slate-900 transition-colors hover:bg-slate-50"
            >
              Comparar remesas
            </Link>
          </div>
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
                name: "Seguros",
                item: "https://finazo.lat/seguros",
              },
            ],
          }),
        }}
      />
    </>
  );
}
