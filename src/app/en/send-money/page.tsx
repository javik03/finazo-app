import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { EN_CORRIDORS } from "@/lib/constants/en-corridors";
import { US_CITIES } from "@/lib/constants/us-cities";

export const metadata: Metadata = {
  title: "Send Money to Central America — Compare Fees | Finazo",
  description:
    "Compare Wise, Remitly, Western Union, and MoneyGram for sending money from the US to El Salvador, Guatemala, Honduras, Mexico, and Dominican Republic. Live fees updated every 6 hours.",
  alternates: {
    canonical: "https://finazo.lat/en/send-money",
    languages: {
      "en-US": "https://finazo.lat/en/send-money",
      "es-SV": "https://finazo.lat/remesas",
      "es-GT": "https://finazo.lat/remesas",
      "es-US": "https://finazo.lat/remesas",
      "x-default": "https://finazo.lat/en/send-money",
    },
  },
  openGraph: {
    title: "Send Money to Central America — Compare Fees | Finazo",
    description:
      "Live fee comparison for US to Central America money transfers. Wise, Remitly, Western Union, MoneyGram.",
    url: "https://finazo.lat/en/send-money",
    locale: "en_US",
  },
};

const US_CORRIDORS = EN_CORRIDORS.filter((c) => c.from === "US");

// Pick a representative sample of city routes to feature
const FEATURED_CITIES = US_CITIES.filter((c) =>
  ["los-angeles-to-el-salvador", "washington-dc-to-el-salvador", "new-york-to-guatemala",
   "houston-to-mexico", "miami-to-dominican-republic", "chicago-to-mexico"].includes(c.slug)
);

export default function SendMoneyHubPage(): React.ReactElement {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-6 py-16">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm" aria-label="Breadcrumb">
          <Link href="/en" className="text-emerald-600 hover:underline">Finazo</Link>
          <span className="mx-2 text-slate-400">/</span>
          <span className="text-slate-600">Send Money</span>
        </nav>

        <h1 className="mb-4 text-4xl font-bold text-slate-900">
          Send Money to Central America
        </h1>
        <p className="mb-10 text-lg text-slate-600">
          Compare live fees from Wise, Remitly, Western Union, and MoneyGram for
          every US → Central America corridor. Updated every 6 hours.
        </p>

        {/* By country */}
        <section className="mb-14">
          <h2 className="mb-5 text-xl font-semibold text-slate-800">By destination country</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {US_CORRIDORS.map((corridor) => (
              <Link
                key={corridor.slug}
                href={`/en/send-money/${corridor.slug}`}
                className="group flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:border-emerald-200 hover:shadow-md"
              >
                <span className="text-4xl">{corridor.toFlag}</span>
                <div>
                  <p className="font-semibold text-slate-900 group-hover:text-emerald-700">
                    Send money to {corridor.toLabel}
                  </p>
                  <p className="text-sm text-slate-500">
                    Compare all providers · Live fees
                  </p>
                </div>
                <span className="ml-auto text-slate-400 group-hover:text-emerald-600">→</span>
              </Link>
            ))}
          </div>
        </section>

        {/* By city */}
        <section className="mb-14">
          <h2 className="mb-2 text-xl font-semibold text-slate-800">By US city</h2>
          <p className="mb-5 text-sm text-slate-500">
            Same live rates — framed for your city.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURED_CITIES.map((city) => (
              <Link
                key={city.slug}
                href={`/en/send-money/from/${city.slug}`}
                className="group rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-emerald-200 hover:shadow-md"
              >
                <p className="font-medium text-slate-900 group-hover:text-emerald-700">
                  {city.city} → {city.toLabel} {city.toFlag}
                </p>
                <p className="text-xs text-slate-500">{city.city}, {city.state}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="rounded-2xl bg-slate-50 p-8">
          <h2 className="mb-4 text-xl font-semibold text-slate-800">How we compare fees</h2>
          <ol className="space-y-3 text-slate-700">
            <li className="flex gap-3">
              <span className="font-bold text-emerald-600">1.</span>
              Our scrapers check Wise, Remitly, Western Union and MoneyGram every 6 hours.
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-emerald-600">2.</span>
              We record the flat fee, percentage fee, and exchange rate for a $200 transfer.
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-emerald-600">3.</span>
              We rank them cheapest-first so you see the best deal at a glance.
            </li>
          </ol>
          <p className="mt-4 text-xs text-slate-400">
            Fees shown are estimates. Always verify on the provider&apos;s site before sending.
            Some links are affiliate links — this never affects which provider ranks first.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
