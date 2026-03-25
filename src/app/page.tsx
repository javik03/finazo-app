import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Finazo — Compara remesas, préstamos y seguros en Centroamérica",
  description:
    "Encuentra las mejores tasas de remesas, préstamos personales y seguros en El Salvador, Guatemala y Honduras. Datos actualizados diariamente.",
};

const CATEGORIES = [
  {
    title: "Remesas",
    description:
      "¿Cuánto llega después de comisiones? Compara Wise, Remitly, Western Union, MoneyGram y más.",
    href: "/remesas",
    badge: "Más popular",
    badgeClass: "bg-sky-100 text-sky-700",
    ctaClass: "text-sky-600 group-hover:text-sky-700",
    borderClass: "hover:border-sky-200",
    detail: "Actualizado cada 6 horas",
  },
  {
    title: "Préstamos",
    description:
      "Tasas oficiales de todos los bancos regulados por la SSF. Sin sorpresas ni letras pequeñas.",
    href: "/prestamos",
    badge: "Datos SSF",
    badgeClass: "bg-emerald-100 text-emerald-700",
    ctaClass: "text-emerald-600 group-hover:text-emerald-700",
    borderClass: "hover:border-emerald-200",
    detail: "Banco Agrícola, Davivienda, BAC y más",
  },
  {
    title: "Seguros",
    description:
      "Cotiza seguros de auto, vida y salud de las principales aseguradoras de El Salvador.",
    href: "/seguros",
    badge: "Próximamente",
    badgeClass: "bg-slate-100 text-slate-500",
    ctaClass: "text-slate-400",
    borderClass: "",
    detail: "SISA, Pacífico, ASSA, ASESUISA",
  },
];

const TRUST = [
  {
    label: "Datos oficiales",
    desc: "Tasas de préstamos directamente de la SSF de El Salvador.",
  },
  {
    label: "Actualización automática",
    desc: "Remesas actualizadas cada 6 horas sin intervención manual.",
  },
  {
    label: "100% gratis",
    desc: "Sin registro, sin suscripción, sin costos ocultos.",
  },
  {
    label: "Independiente",
    desc: "No somos propiedad de ningún banco ni financiera.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header activePath="/" />

      <main>
        {/* Hero */}
        <section className="border-b border-slate-100 bg-slate-50 px-6 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-emerald-600">
              Comparador financiero para Centroamérica
            </p>
            <h1 className="mb-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Tu dinero rinde más cuando{" "}
              <span className="text-emerald-500">comparas primero</span>
            </h1>
            <p className="mx-auto mb-8 max-w-xl text-lg text-slate-600">
              Compara remesas, préstamos y seguros en El Salvador, Guatemala y
              Honduras. Datos actualizados automáticamente, en español.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/remesas"
                className="rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-600"
              >
                Comparar remesas
              </Link>
              <Link
                href="/prestamos"
                className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50"
              >
                Ver préstamos
              </Link>
            </div>
          </div>
        </section>

        {/* Category cards */}
        <section className="px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-8 text-center text-2xl font-bold text-slate-900">
              ¿Qué quieres comparar hoy?
            </h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className={`group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md ${cat.borderClass}`}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${cat.badgeClass}`}
                    >
                      {cat.badge}
                    </span>
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-slate-900">
                    {cat.title}
                  </h3>
                  <p className="mb-4 text-sm leading-relaxed text-slate-600">
                    {cat.description}
                  </p>
                  <p className="mb-4 text-xs text-slate-400">{cat.detail}</p>
                  <span
                    className={`text-sm font-semibold transition-colors ${cat.ctaClass}`}
                  >
                    Comparar ahora →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Trust signals */}
        <section className="border-y border-slate-100 bg-slate-50 px-6 py-14">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-10 text-center text-xl font-bold text-slate-900">
              ¿Por qué confiar en Finazo?
            </h2>
            <div className="grid gap-6 sm:grid-cols-4">
              {TRUST.map((item) => (
                <div key={item.label} className="text-center">
                  <div className="mb-1 font-semibold text-slate-900">
                    {item.label}
                  </div>
                  <div className="text-sm text-slate-500">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured corridors quick-links */}
        <section className="px-6 py-14">
          <div className="mx-auto max-w-6xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                Corredores más buscados
              </h2>
              <Link
                href="/remesas"
                className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
              >
                Ver todos →
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { from: "US", to: "SV", label: "EE.UU. → El Salvador" },
                { from: "US", to: "GT", label: "EE.UU. → Guatemala" },
                { from: "US", to: "HN", label: "EE.UU. → Honduras" },
                { from: "ES", to: "SV", label: "España → El Salvador" },
              ].map((c) => (
                <Link
                  key={`${c.from}-${c.to}`}
                  href={`/remesas?desde=${c.from}&hacia=${c.to}`}
                  className="rounded-xl border border-slate-100 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-slate-200 hover:shadow-md"
                >
                  {c.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Articles teaser */}
        <section className="border-t border-slate-100 px-6 py-14">
          <div className="mx-auto max-w-6xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                Aprende sobre finanzas
              </h2>
              <Link
                href="/articulos"
                className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
              >
                Ver todos →
              </Link>
            </div>
            <p className="text-sm text-slate-500">
              Guías y comparaciones escritas en español para Centroamérica.
              Próximamente.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
