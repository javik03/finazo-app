import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Finazo — Compara remesas, préstamos y seguros en Centroamérica",
  description:
    "Encuentra las mejores tasas de remesas, préstamos personales y seguros en El Salvador, Guatemala y Honduras. Datos actualizados diariamente, gratis.",
  alternates: { canonical: "https://finazo.lat" },
};

// ── Icons ──────────────────────────────────────────────────────────────────

function IconSend({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function IconBank({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="3" y1="22" x2="21" y2="22" />
      <line x1="6" y1="18" x2="6" y2="11" />
      <line x1="10" y1="18" x2="10" y2="11" />
      <line x1="14" y1="18" x2="14" y2="11" />
      <line x1="18" y1="18" x2="18" y2="11" />
      <polygon points="12 2 20 7 4 7 12 2" />
    </svg>
  );
}

function IconShield({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function IconCheck({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconRefresh({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

function IconFree({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function IconIndependent({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

// ── Data ───────────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    icon: IconSend,
    iconClass: "text-sky-500",
    iconBg: "bg-sky-50",
    title: "Remesas",
    description:
      "¿Cuánto llega después de comisiones? Compara Wise, Remitly, Western Union, MoneyGram y más.",
    href: "/remesas",
    badge: "Más popular",
    badgeClass: "bg-sky-100 text-sky-700",
    ctaClass: "text-sky-600",
    borderHover: "hover:border-sky-200 hover:shadow-sky-100",
    detail: "Actualizado cada 6 horas",
  },
  {
    icon: IconBank,
    iconClass: "text-emerald-600",
    iconBg: "bg-emerald-50",
    title: "Préstamos",
    description:
      "Tasas oficiales de todos los bancos regulados por la SSF. Sin sorpresas ni letras pequeñas.",
    href: "/prestamos",
    badge: "Datos SSF",
    badgeClass: "bg-emerald-100 text-emerald-700",
    ctaClass: "text-emerald-600",
    borderHover: "hover:border-emerald-200 hover:shadow-emerald-100",
    detail: "Banco Agrícola, Davivienda, BAC y más",
  },
  {
    icon: IconShield,
    iconClass: "text-violet-500",
    iconBg: "bg-violet-50",
    title: "Seguros",
    description:
      "Cotiza seguros de auto, vida y salud de las principales aseguradoras de El Salvador.",
    href: "/seguros",
    badge: "Próximamente",
    badgeClass: "bg-slate-100 text-slate-500",
    ctaClass: "text-slate-400",
    borderHover: "",
    detail: "SISA, Pacífico, ASSA, ASESUISA",
  },
];

const TRUST = [
  {
    icon: IconCheck,
    iconClass: "text-emerald-600",
    iconBg: "bg-emerald-100",
    label: "Datos oficiales",
    desc: "Tasas de préstamos directamente de la SSF de El Salvador.",
  },
  {
    icon: IconRefresh,
    iconClass: "text-sky-600",
    iconBg: "bg-sky-100",
    label: "Actualización automática",
    desc: "Remesas actualizadas cada 6 horas sin intervención manual.",
  },
  {
    icon: IconFree,
    iconClass: "text-violet-600",
    iconBg: "bg-violet-100",
    label: "100% gratis",
    desc: "Sin registro, sin suscripción, sin costos ocultos.",
  },
  {
    icon: IconIndependent,
    iconClass: "text-amber-600",
    iconBg: "bg-amber-100",
    label: "Independiente",
    desc: "No somos propiedad de ningún banco ni financiera.",
  },
];

const CORRIDORS = [
  {
    from: "US",
    to: "SV",
    flags: "🇺🇸 → 🇸🇻",
    label: "EE.UU. → El Salvador",
    sub: "El corredor más usado",
  },
  {
    from: "US",
    to: "GT",
    flags: "🇺🇸 → 🇬🇹",
    label: "EE.UU. → Guatemala",
    sub: "Quetzales o USD",
  },
  {
    from: "US",
    to: "HN",
    flags: "🇺🇸 → 🇭🇳",
    label: "EE.UU. → Honduras",
    sub: "Lempiras o USD",
  },
  {
    from: "ES",
    to: "SV",
    flags: "🇪🇸 → 🇸🇻",
    label: "España → El Salvador",
    sub: "Euros a USD",
  },
];

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Elige qué comparar",
    desc: "Selecciona si quieres comparar remesas, préstamos o seguros.",
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

// ── Page ───────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header activePath="/" />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white px-6 py-20">
          {/* subtle background pattern */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, #0f172a 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="relative mx-auto max-w-3xl text-center">
            <span className="mb-4 inline-block rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Comparador financiero · Centroamérica
            </span>
            <h1 className="mb-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Tu dinero rinde más{" "}
              <span className="text-emerald-500">cuando comparas primero</span>
            </h1>
            <p className="mx-auto mb-8 max-w-xl text-lg text-slate-600">
              Compara remesas, préstamos y seguros en El Salvador, Guatemala y
              Honduras. Datos reales, actualizados automáticamente, gratis.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/remesas"
                className="rounded-xl bg-emerald-500 px-7 py-3.5 text-sm font-semibold text-white shadow-md shadow-emerald-100 transition-all hover:bg-emerald-600 hover:shadow-lg"
              >
                Comparar remesas →
              </Link>
              <Link
                href="/prestamos"
                className="rounded-xl border border-slate-200 bg-white px-7 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
              >
                Ver préstamos
              </Link>
            </div>
          </div>
        </section>

        {/* Stats bar */}
        <section className="border-b border-slate-100 bg-white px-6 py-4">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-6 text-center text-xs text-slate-500 sm:gap-10">
            <div>
              <span className="mr-1 font-bold text-slate-800">5+</span>
              servicios de remesas comparados
            </div>
            <div className="hidden h-3 w-px bg-slate-200 sm:block" />
            <div>
              <span className="mr-1 font-bold text-slate-800">8</span>
              bancos regulados por la SSF
            </div>
            <div className="hidden h-3 w-px bg-slate-200 sm:block" />
            <div>
              <span className="mr-1 font-bold text-slate-800">4</span>
              corredores de remesas activos
            </div>
            <div className="hidden h-3 w-px bg-slate-200 sm:block" />
            <div>
              Actualizado{" "}
              <span className="font-semibold text-emerald-600">hoy</span>
            </div>
          </div>
        </section>

        {/* Category cards */}
        <section className="px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-2 text-center text-2xl font-bold text-slate-900">
              ¿Qué quieres comparar hoy?
            </h2>
            <p className="mb-10 text-center text-sm text-slate-500">
              Datos reales de los proveedores más usados en Centroamérica.
            </p>
            <div className="grid gap-6 sm:grid-cols-3">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className={`group relative rounded-2xl border border-slate-100 bg-white p-7 shadow-sm transition-all hover:shadow-md ${cat.borderHover}`}
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${cat.iconBg}`}
                    >
                      <cat.icon className={`h-6 w-6 ${cat.iconClass}`} />
                    </div>
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
                  <p className="mb-5 text-xs text-slate-400">{cat.detail}</p>
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

        {/* How it works */}
        <section className="border-y border-slate-100 bg-slate-50 px-6 py-14">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-10 text-center text-xl font-bold text-slate-900">
              ¿Cómo funciona?
            </h2>
            <div className="grid gap-8 sm:grid-cols-3">
              {HOW_IT_WORKS.map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white">
                    {step.step}
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-slate-900">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-500">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust signals */}
        <section className="px-6 py-14">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-10 text-center text-xl font-bold text-slate-900">
              ¿Por qué confiar en Finazo?
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {TRUST.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
                >
                  <div
                    className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${item.iconBg}`}
                  >
                    <item.icon className={`h-5 w-5 ${item.iconClass}`} />
                  </div>
                  <div className="mb-1 font-semibold text-slate-900">
                    {item.label}
                  </div>
                  <div className="text-sm leading-relaxed text-slate-500">
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured corridors quick-links */}
        <section className="border-t border-slate-100 bg-slate-50 px-6 py-14">
          <div className="mx-auto max-w-6xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Corredores más buscados
                </h2>
                <p className="mt-0.5 text-sm text-slate-500">
                  Compara quién te cobra menos en cada ruta
                </p>
              </div>
              <Link
                href="/remesas"
                className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
              >
                Ver todos →
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {CORRIDORS.map((c) => (
                <Link
                  key={`${c.from}-${c.to}`}
                  href={`/remesas?desde=${c.from}&hacia=${c.to}`}
                  className="group rounded-xl border border-slate-100 bg-white px-5 py-4 shadow-sm transition-all hover:border-sky-200 hover:shadow-md"
                >
                  <div className="mb-1 text-xl">{c.flags}</div>
                  <div className="font-semibold text-slate-800 transition-colors group-hover:text-sky-700">
                    {c.label}
                  </div>
                  <div className="mt-0.5 text-xs text-slate-400">{c.sub}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ / SEO content */}
        <section className="px-6 py-14">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-xl font-bold text-slate-900">
              Preguntas frecuentes
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="mb-1 font-semibold text-slate-900">
                  ¿Cómo se actualizan los datos de remesas?
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  Nuestros sistemas consultan automáticamente las tarifas
                  publicadas por Wise, Remitly, Western Union y MoneyGram cada 6
                  horas. Los datos reflejan el costo real de enviar $200 USD en
                  el corredor seleccionado.
                </p>
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-slate-900">
                  ¿De dónde vienen las tasas de préstamos?
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  Las tasas de préstamos personales, hipotecarios y vehiculares
                  provienen directamente de la{" "}
                  <strong>
                    Superintendencia del Sistema Financiero (SSF) de El Salvador
                  </strong>
                  . Son las tasas máximas y mínimas que cada banco puede cobrar
                  legalmente.
                </p>
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-slate-900">
                  ¿Finazo cobra alguna comisión?
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  No. Finazo es gratuito para los usuarios. Cuando haces clic en
                  &quot;Solicitar&quot; o &quot;Enviar&quot; en un proveedor,
                  podemos recibir una comisión de afiliado. Esto no afecta las
                  tasas comparadas ni el ranking de resultados.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
