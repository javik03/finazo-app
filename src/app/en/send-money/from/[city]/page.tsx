import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { US_CITIES, getUsCityBySlug } from "@/lib/constants/us-cities";
import { getRemittanceRates } from "@/lib/queries/remittances";
import { RemittanceTable } from "@/components/comparison/RemittanceTable";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const revalidate = 21600;

export function generateStaticParams(): { city: string }[] {
  return [];
}

type Props = { params: Promise<{ city: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: slug } = await params;
  const cityRoute = getUsCityBySlug(slug);
  if (!cityRoute) return {};

  const canonical = `https://finazo.lat/en/send-money/from/${slug}`;
  const esCanonical = `https://finazo.lat/remesas/${cityRoute.esCorridorSlug}`;
  const title = `Best Way to Send Money from ${cityRoute.city} to ${cityRoute.toLabel} — Live Fees`;
  const description = `Cheapest way to send money from ${cityRoute.city}, ${cityRoute.state} to ${cityRoute.toLabel}. Compare Wise, Remitly, Western Union, and MoneyGram fees in real time.`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        "en-US": canonical,
        "es-SV": esCanonical,
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

export default async function CityPage({ params }: Props): Promise<React.ReactElement> {
  const { city: slug } = await params;
  const cityRoute = getUsCityBySlug(slug);
  if (!cityRoute) notFound();

  const rates = await getRemittanceRates("US", cityRoute.to);

  // Other cities sending to the same destination
  const relatedCities = US_CITIES.filter(
    (c) => c.to === cityRoute.to && c.slug !== slug
  ).slice(0, 4);

  const schema = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: `Send money from ${cityRoute.city} to ${cityRoute.toLabel}`,
    description: `Compare fees for sending money from ${cityRoute.city}, ${cityRoute.state} to ${cityRoute.toLabel}.`,
    areaServed: ["US", cityRoute.to],
    url: `https://finazo.lat/en/send-money/from/${slug}`,
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
      {
        "@type": "ListItem",
        position: 3,
        name: `${cityRoute.city} to ${cityRoute.toLabel}`,
        item: `https://finazo.lat/en/send-money/from/${slug}`,
      },
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
          <span className="text-slate-600">{cityRoute.city} → {cityRoute.toLabel}</span>
        </nav>

        {/* Hero */}
        <div className="mb-8">
          <h1 className="mb-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            🇺🇸 → {cityRoute.toFlag} Send Money from {cityRoute.city} to {cityRoute.toLabel}
          </h1>
          <p className="text-slate-600">
            Whether you bank with Chase, Bank of America, or send from a debit card —
            here are the cheapest options from {cityRoute.city}, {cityRoute.state} right now.
            Updated every 6 hours.
          </p>
        </div>

        {/* Comparison table */}
        <div className="rounded-2xl border border-slate-100 p-6 shadow-sm">
          <RemittanceTable
            rates={rates}
            fromCountry="US"
            toCountry={cityRoute.to}
            lang="en"
          />
        </div>

        {/* Tips */}
        <div className="mt-10 rounded-2xl bg-sky-50 p-6">
          <h2 className="mb-3 font-semibold text-slate-900">
            Sending from {cityRoute.city}? What to know
          </h2>
          <ul className="space-y-2 text-sm text-slate-700">
            <li>
              <strong>Bank transfer vs debit card:</strong> Bank transfers are usually cheaper
              (lower fees) but slower. Debit card is instant but may cost $1–3 more.
            </li>
            <li>
              <strong>First transfer bonus:</strong> Wise and Remitly often have a
              fee-free first transfer for new users. Worth checking before you send.
            </li>
            <li>
              <strong>Recipient options:</strong> Bank deposit is fastest in most of{" "}
              {cityRoute.toLabel}. Cash pickup (Western Union, MoneyGram) is available if
              your family doesn&apos;t have a bank account.
            </li>
          </ul>
        </div>

        {/* Related cities */}
        {relatedCities.length > 0 && (
          <div className="mt-10">
            <h2 className="mb-4 text-lg font-semibold text-slate-800">
              Other US cities → {cityRoute.toLabel}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {relatedCities.map((c) => (
                <Link
                  key={c.slug}
                  href={`/en/send-money/from/${c.slug}`}
                  className="rounded-lg border border-slate-100 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm hover:border-emerald-200 hover:text-emerald-700"
                >
                  {c.city}, {c.state} → {c.toLabel} {c.toFlag}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Spanish version link */}
        <div className="mt-6 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm">
          <strong>¿Prefieres verlo en español?</strong>{" "}
          <Link href={`/remesas/${cityRoute.esCorridorSlug}`} className="font-medium text-emerald-700 hover:underline">
            Ver en español →
          </Link>
        </div>

        <p className="mt-6 text-xs text-slate-400">
          Fees shown are estimates and may vary by amount, payment method, and date.
          Verify the exact cost on the provider&apos;s site before sending.
          Some links are affiliate links — this never affects the ranking.
        </p>
      </main>
      <Footer />
    </>
  );
}
