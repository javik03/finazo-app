import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { CORRIDORS, getCorridorBySlug } from "@/lib/constants/corridors";
import { getRemittanceRates } from "@/lib/queries/remittances";
import { RemittanceTable } from "@/components/comparison/RemittanceTable";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const revalidate = 21600;

export function generateStaticParams(): { corridor: string }[] {
  return CORRIDORS.map((c) => ({ corridor: c.slug }));
}

type Props = { params: Promise<{ corridor: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { corridor: slug } = await params;
  const corridor = getCorridorBySlug(slug);
  if (!corridor) return {};

  const title = `Comparar remesas ${corridor.label} — Comisiones 2025`;
  const description = `¿Quién cobra menos? Compara Wise, Remitly, Western Union y más para envíos de ${corridor.fromLabel} a ${corridor.toLabel}. Tasas y comisiones actualizadas automáticamente.`;
  const canonical = `https://finazo.lat/remesas/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        "es-SV": canonical,
        "es-GT": canonical,
        "es-HN": canonical,
        "x-default": canonical,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
    },
  };
}

export default async function CorridorPage({ params }: Props) {
  const { corridor: slug } = await params;
  const corridor = getCorridorBySlug(slug);
  if (!corridor) notFound();

  const rates = await getRemittanceRates(corridor.from, corridor.to);

  const schema = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: `Comparar remesas ${corridor.label}`,
    description: `Comparador de comisiones y tasas de cambio para envíos de dinero de ${corridor.fromLabel} a ${corridor.toLabel}.`,
    areaServed: [corridor.from, corridor.to],
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Inicio",
          item: "https://finazo.lat",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Remesas",
          item: "https://finazo.lat/remesas",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: corridor.label,
          item: `https://finazo.lat/remesas/${slug}`,
        },
      ],
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Header activePath="/remesas" />

      <main className="mx-auto max-w-5xl px-6 py-12">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-slate-500">
          <Link href="/" className="hover:text-slate-700">
            Inicio
          </Link>
          <span className="mx-2">›</span>
          <Link href="/remesas" className="hover:text-slate-700">
            Remesas
          </Link>
          <span className="mx-2">›</span>
          <span>{corridor.label}</span>
        </div>

        <div className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <span className="text-3xl">{corridor.fromFlag}</span>
            <span className="text-2xl text-slate-400">→</span>
            <span className="text-3xl">{corridor.toFlag}</span>
          </div>
          <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-slate-900">
            Comparar remesas {corridor.label}
          </h1>
          <p className="text-slate-600">
            ¿Cuánto llega después de comisiones? Compara los principales
            servicios de envío de {corridor.fromLabel} a {corridor.toLabel}.
            Actualizado automáticamente cada 6 horas.
          </p>
        </div>

        {/* Corridor selector */}
        <div className="mb-8 flex flex-wrap gap-2">
          {CORRIDORS.map((c) => (
            <Link
              key={c.slug}
              href={`/remesas/${c.slug}`}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                c.slug === slug
                  ? "border-emerald-600 bg-emerald-600 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {c.fromFlag} {c.toFlag} {c.toLabel}
            </Link>
          ))}
        </div>

        {/* Comparison table */}
        <div className="rounded-2xl border border-slate-100 p-6 shadow-sm">
          <RemittanceTable
            rates={rates}
            fromCountry={corridor.from}
            toCountry={corridor.to}
          />
        </div>

        {/* Info section */}
        <div className="mt-10 rounded-2xl bg-sky-50 p-6">
          <h2 className="mb-3 font-semibold text-slate-900">
            ¿Cómo comparar correctamente?
          </h2>
          <ul className="space-y-2 text-sm text-slate-700">
            <li>
              <strong>Comisión fija:</strong> Lo que cobran por cada envío, sin
              importar el monto.
            </li>
            <li>
              <strong>Tasa de cambio:</strong>{" "}
              {corridor.to === "SV"
                ? "Para El Salvador no aplica (USD → USD)."
                : "La diferencia entre la tasa de mercado y la tasa ofrecida puede costar más que la comisión fija."}
            </li>
            <li>
              <strong>Velocidad:</strong> "Inmediato" significa minutos; "1–3
              días" es transferencia bancaria tradicional.
            </li>
          </ul>
        </div>

        {/* Disclaimer */}
        <p className="mt-6 text-xs text-slate-400">
          Las tarifas mostradas son aproximadas y pueden variar según el monto
          enviado, el método de pago y la fecha. Verifica el costo exacto en el
          sitio de cada proveedor antes de enviar. Algunos enlaces son de
          afiliado — esto no afecta las tarifas comparadas.
        </p>
      </main>

      <Footer />
    </div>
  );
}
