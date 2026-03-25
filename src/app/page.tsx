import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Finazo — Compara remesas, préstamos y seguros en Centroamérica",
  description:
    "Encuentra las mejores tasas de remesas, préstamos personales y seguros en El Salvador, Guatemala y Honduras. Datos actualizados diariamente.",
};

const SECTIONS = [
  {
    title: "Remesas",
    description: "¿Cuánto llega después de comisiones? Compara Wise, Remitly, Western Union y más.",
    href: "/remesas",
    icon: "💸",
    badge: "Más popular",
    color: "bg-blue-50 border-blue-200",
    badgeColor: "bg-blue-600",
  },
  {
    title: "Préstamos",
    description: "Tasas oficiales de todos los bancos según la SSF. Sin sorpresas.",
    href: "/prestamos",
    icon: "🏦",
    badge: "Datos SSF",
    color: "bg-emerald-50 border-emerald-200",
    badgeColor: "bg-emerald-600",
  },
  {
    title: "Seguros",
    description: "Cotiza seguros de auto, vida y salud de las principales aseguradoras.",
    href: "/seguros",
    icon: "🛡️",
    badge: "Próximamente",
    color: "bg-purple-50 border-purple-200",
    badgeColor: "bg-purple-600",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">
            finazo<span className="text-blue-600">.lat</span>
          </Link>
          <nav className="hidden gap-6 text-sm text-gray-600 sm:flex">
            <Link href="/remesas" className="hover:text-gray-900">Remesas</Link>
            <Link href="/prestamos" className="hover:text-gray-900">Préstamos</Link>
            <Link href="/seguros" className="hover:text-gray-900">Seguros</Link>
            <Link href="/articulos" className="hover:text-gray-900">Artículos</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-16">
        {/* Hero */}
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Tu dinero, más lejos en Centroamérica
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Comparamos remesas, préstamos y seguros para que tomes mejores decisiones financieras.
            Datos actualizados diariamente, en español.
          </p>
        </div>

        {/* Comparison sections */}
        <div className="grid gap-6 sm:grid-cols-3">
          {SECTIONS.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className={`group relative rounded-2xl border p-6 transition-shadow hover:shadow-md ${section.color}`}
            >
              <span
                className={`mb-4 inline-block rounded-full px-2 py-0.5 text-xs font-semibold text-white ${section.badgeColor}`}
              >
                {section.badge}
              </span>
              <div className="mb-2 text-3xl">{section.icon}</div>
              <h2 className="mb-2 text-xl font-bold text-gray-900">{section.title}</h2>
              <p className="text-sm text-gray-600">{section.description}</p>
              <div className="mt-4 text-sm font-semibold text-blue-600 group-hover:underline">
                Comparar ahora →
              </div>
            </Link>
          ))}
        </div>

        {/* Trust signals */}
        <div className="mt-16 rounded-2xl bg-gray-50 p-8 text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
            ¿Por qué confiar en Finazo?
          </p>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { icon: "📊", title: "Datos oficiales", desc: "Tasas de préstamos directamente de la SSF" },
              { icon: "🔄", title: "Actualización diaria", desc: "Remesas actualizadas cada 6 horas automáticamente" },
              { icon: "🆓", title: "Gratis, siempre", desc: "Sin registro. Sin costo. Sin letra pequeña." },
            ].map((item) => (
              <div key={item.title}>
                <div className="mb-2 text-2xl">{item.icon}</div>
                <div className="font-semibold text-gray-900">{item.title}</div>
                <div className="text-sm text-gray-600">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest articles preview */}
        <div className="mt-16">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Aprende sobre finanzas</h2>
            <Link href="/articulos" className="text-sm text-blue-600 hover:underline">
              Ver todos →
            </Link>
          </div>
          <p className="text-gray-600">
            Guías y comparaciones escritas en español para Centroamérica.
          </p>
        </div>
      </main>

      <footer className="mt-16 border-t border-gray-100 px-6 py-8">
        <div className="mx-auto max-w-5xl text-center text-sm text-gray-500">
          <p>
            Finazo.lat — Comparador financiero para Centroamérica. No somos un banco ni aseguradora.
          </p>
          <p className="mt-1">
            Las tasas de préstamos son datos públicos de la{" "}
            <a
              href="https://www.ssf.gob.sv"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              SSF de El Salvador
            </a>
            . Algunos enlaces son de afiliado.
          </p>
        </div>
      </footer>
    </div>
  );
}
