import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { EN_CORRIDORS, getEnCorridorBySlug } from "@/lib/constants/en-corridors";
import { getRemittanceRates } from "@/lib/queries/remittances";
import { RemittanceTable } from "@/components/comparison/RemittanceTable";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const revalidate = 21600;

export function generateStaticParams(): { corridor: string }[] {
  return [];
}

type Props = { params: Promise<{ corridor: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { corridor: slug } = await params;
  const corridor = getEnCorridorBySlug(slug);
  if (!corridor) return {};

  const canonical = `https://finazo.lat/en/send-money/${slug}`;
  const esCanonical = `https://finazo.lat/remesas/${corridor.esSlug}`;
  const title = `Best Way to Send Money from US to ${corridor.toLabel} — Compare Fees`;
  const description = `Compare Wise, Remitly, Western Union, and MoneyGram for sending money from the United States to ${corridor.toLabel}. Live fees and exchange rates updated every 6 hours.`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        "en-US": canonical,
        "es-SV": esCanonical,
        "es-GT": esCanonical,
        "es-HN": esCanonical,
        "es-US": esCanonical,
        "x-default": canonical,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      locale: "en_US",
    },
  };
}

export default async function EnCorridorPage({ params }: Props): Promise<React.ReactElement> {
  const { corridor: slug } = await params;
  const corridor = getEnCorridorBySlug(slug);
  if (!corridor) notFound();

  const rates = await getRemittanceRates(corridor.from, corridor.to);

  const schema = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: `Send money from ${corridor.fromLabel} to ${corridor.toLabel}`,
    description: `Compare fees and exchange rates for money transfers from ${corridor.fromLabel} to ${corridor.toLabel}.`,
    areaServed: [corridor.from, corridor.to],
    url: `https://finazo.lat/en/send-money/${slug}`,
    provider: {
      "@type": "Organization",
      name: "Finazo",
      url: "https://finazo.lat",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Finazo", item: "https://finazo.lat/en" },
      { "@type": "ListItem", position: 2, name: "Send Money", item: "https://finazo.lat/en/send-money" },
      { "@type": "ListItem", position: 3, name: `US to ${corridor.toLabel}`, item: `https://finazo.lat/en/send-money/${slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Header />
      <main className="mx-auto max-w-4xl px-6 py-10">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm" aria-label="Breadcrumb">
          <Link href="/en" className="text-emerald-600 hover:underline">Finazo</Link>
          <span className="mx-2 text-slate-400">/</span>
          <Link href="/en/send-money" className="text-emerald-600 hover:underline">Send Money</Link>
          <span className="mx-2 text-slate-400">/</span>
          <span className="text-slate-600">US to {corridor.toLabel}</span>
        </nav>

        {/* Corridor picker */}
        <div className="mb-6 flex flex-wrap gap-2">
          {EN_CORRIDORS.filter((c) => c.from === "US").map((c) => (
            <Link
              key={c.slug}
              href={`/en/send-money/${c.slug}`}
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

        {/* Hero */}
        <div className="mb-8">
          <h1 className="mb-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            {corridor.fromFlag} → {corridor.toFlag} Send Money from US to {corridor.toLabel}
          </h1>
          <p className="text-slate-600">
            Live fee comparison — updated every 6 hours. We check Wise, Remitly,
            Western Union, and MoneyGram so you don&apos;t have to.
          </p>
        </div>

        {/* Comparison table */}
        <div className="rounded-2xl border border-slate-100 p-6 shadow-sm">
          <RemittanceTable
            rates={rates}
            fromCountry={corridor.from}
            toCountry={corridor.to}
            lang="en"
          />
        </div>

        {/* Tips */}
        <div className="mt-10 rounded-2xl bg-sky-50 p-6">
          <h2 className="mb-3 font-semibold text-slate-900">How to read this table</h2>
          <ul className="space-y-2 text-sm text-slate-700">
            <li>
              <strong>Fee:</strong> The flat fee charged per transfer regardless of amount.
            </li>
            <li>
              <strong>Exchange rate:</strong>{" "}
              {corridor.to === "SV"
                ? "El Salvador uses USD — no exchange rate applies."
                : "The gap between the mid-market rate and the offered rate can cost more than the flat fee. Always check both."}
            </li>
            <li>
              <strong>Speed:</strong> &quot;Instant&quot; means minutes; &quot;1–3 days&quot; is a standard bank transfer.
            </li>
          </ul>
        </div>

        {/* Hreflang notice */}
        <div className="mt-6 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm">
          <strong>¿Prefieres verlo en español?</strong>{" "}
          <Link href={`/remesas/${corridor.esSlug}`} className="font-medium text-emerald-700 hover:underline">
            Ver en español →
          </Link>
        </div>

        {/* Disclaimer */}
        <p className="mt-6 text-xs text-slate-400">
          Fees shown are estimates and may vary by amount, payment method, and date.
          Always verify the exact cost on the provider&apos;s site before sending.
          Some links are affiliate links — this does not affect the fees shown or the ranking.
        </p>
      </main>
      <Footer />
    </>
  );
}
