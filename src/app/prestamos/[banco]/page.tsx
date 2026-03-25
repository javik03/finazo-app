import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getLoanProductsByProvider,
  getLoanProviderBySlug,
  getAllLoanProviderSlugs,
} from "@/lib/queries/loans";
import { LoanTable } from "@/components/comparison/LoanTable";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const revalidate = 86400;

export async function generateStaticParams(): Promise<{ banco: string }[]> {
  try {
    const slugs = await getAllLoanProviderSlugs();
    return slugs.map((r) => ({ banco: r.slug }));
  } catch {
    // DB not available at build time — pages will be generated on first request
    return [];
  }
}

type Props = { params: Promise<{ banco: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { banco: slug } = await params;
  const provider = await getLoanProviderBySlug(slug);
  if (!provider) return {};

  const title = `Préstamos ${provider.name} — Tasas y condiciones 2025`;
  const description = `Tasas oficiales SSF de ${provider.name}: préstamos personales, hipotecarios y vehiculares. Compara antes de aplicar.`;
  const canonical = `https://finazo.lat/prestamos/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        "es-SV": canonical,
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

export default async function BancoPage({ params }: Props) {
  const { banco: slug } = await params;

  const [provider, products] = await Promise.all([
    getLoanProviderBySlug(slug),
    getLoanProductsByProvider(slug),
  ]);

  if (!provider) notFound();

  const schema = {
    "@context": "https://schema.org",
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
        name: "Préstamos",
        item: "https://finazo.lat/prestamos",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: provider.name,
        item: `https://finazo.lat/prestamos/${slug}`,
      },
    ],
  };

  const loanTypeLabels: Record<string, string> = {
    personal: "Personal",
    hipotecario: "Hipotecario",
    vehiculo: "Vehículo",
    pyme: "PYME",
  };

  const loanTypes = [...new Set(products.map((p) => p.loanType))];

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Header activePath="/prestamos" />

      <main className="mx-auto max-w-5xl px-6 py-12">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-slate-500">
          <Link href="/" className="hover:text-slate-700">
            Inicio
          </Link>
          <span className="mx-2">›</span>
          <Link href="/prestamos" className="hover:text-slate-700">
            Préstamos
          </Link>
          <span className="mx-2">›</span>
          <span>{provider.name}</span>
        </div>

        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-slate-900">
              Préstamos {provider.name}
            </h1>
            <p className="text-slate-600">
              Tasas oficiales publicadas por la Superintendencia del Sistema
              Financiero (SSF). Actualizadas diariamente.
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            Datos SSF
          </span>
        </div>

        {/* Loan type badges */}
        {loanTypes.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {loanTypes.map((type) => (
              <span
                key={type}
                className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700"
              >
                {loanTypeLabels[type] ?? type}
              </span>
            ))}
          </div>
        )}

        {/* Comparison table */}
        <div className="rounded-2xl border border-slate-100 p-6 shadow-sm">
          <LoanTable products={products} />
        </div>

        {/* Compare CTA */}
        <div className="mt-10 rounded-2xl border border-slate-100 bg-slate-50 p-6">
          <h2 className="mb-2 font-semibold text-slate-900">
            Compara con otros bancos
          </h2>
          <p className="mb-4 text-sm text-slate-600">
            Ver las tasas de todos los bancos regulados por la SSF en un solo
            lugar.
          </p>
          <Link
            href="/prestamos"
            className="inline-flex items-center gap-1 text-sm font-medium text-emerald-700 hover:underline"
          >
            Ver comparativa completa →
          </Link>
        </div>

        {/* Disclaimer */}
        <p className="mt-6 text-xs text-slate-400">
          Las tasas mostradas son los rangos publicados por la SSF y pueden
          variar según tu perfil crediticio, ingresos y plazo solicitado. La
          tasa final la determina cada entidad financiera. Algunos enlaces son
          de afiliado.
        </p>
      </main>

      <Footer />
    </div>
  );
}
