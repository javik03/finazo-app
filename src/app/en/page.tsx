import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { EN_CORRIDORS } from "@/lib/constants/en-corridors";

export const metadata: Metadata = {
  title: "Finazo — Best Way to Send Money to Central America",
  description:
    "Compare Wise, Remitly, Western Union and more for sending money to El Salvador, Guatemala, Honduras and Mexico. Live fees. No ads. In English for the US Hispanic community.",
  alternates: {
    canonical: "https://finazo.lat/en",
    languages: {
      "en-US": "https://finazo.lat/en",
      "es-SV": "https://finazo.lat",
      "es-GT": "https://finazo.lat",
      "es-HN": "https://finazo.lat",
      "es-US": "https://finazo.lat",
      "x-default": "https://finazo.lat/en",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://finazo.lat/en",
    siteName: "Finazo",
    title: "Finazo — Best Way to Send Money to Central America",
    description:
      "Compare live fees from Wise, Remitly, Western Union, and MoneyGram for US to Central America remittances.",
  },
};

const US_CORRIDORS = EN_CORRIDORS.filter((c) => c.from === "US");

export default function EnHomePage(): React.ReactElement {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-6 py-16">
        {/* Hero */}
        <div className="mb-14 text-center">
          <h1 className="mb-4 text-4xl font-bold text-slate-900 sm:text-5xl">
            Send money to Central America —<br />
            <span className="text-emerald-600">compare live fees</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            We compare Wise, Remitly, Western Union, and more so you always
            send money the cheapest way. Updated every 6 hours. Free. No sign-up.
          </p>
        </div>

        {/* Corridor cards */}
        <section className="mb-16">
          <h2 className="mb-6 text-xl font-semibold text-slate-800">
            Compare by destination
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {US_CORRIDORS.map((corridor) => (
              <Link
                key={corridor.slug}
                href={`/en/send-money/${corridor.slug}`}
                className="group flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:border-emerald-200 hover:shadow-md"
              >
                <span className="text-3xl">
                  {corridor.fromFlag} → {corridor.toFlag}
                </span>
                <div>
                  <p className="font-semibold text-slate-900 group-hover:text-emerald-700">
                    US to {corridor.toLabel}
                  </p>
                  <p className="text-xs text-slate-500">Live fees</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Why Finazo */}
        <section className="mb-16 rounded-2xl bg-slate-50 p-8">
          <h2 className="mb-4 text-xl font-semibold text-slate-800">
            Why use Finazo?
          </h2>
          <ul className="space-y-3 text-slate-700">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 text-emerald-600">✓</span>
              <span>
                <strong>Real-time data</strong> — we scrape fees directly from
                Wise, Remitly, and Western Union every 6 hours.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 text-emerald-600">✓</span>
              <span>
                <strong>No hidden costs</strong> — we show the full fee
                including exchange rate spread, not just the transfer fee.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 text-emerald-600">✓</span>
              <span>
                <strong>Built for the US Hispanic community</strong> — focused
                on US → Central America and Caribbean corridors.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 text-emerald-600">✓</span>
              <span>
                <strong>Free</strong> — we earn a small referral fee when you
                click through. It never affects the fees shown.
              </span>
            </li>
          </ul>
        </section>

        {/* Spanish version notice */}
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-5 text-sm text-slate-700">
          <strong>¿Prefieres español?</strong>{" "}
          <Link href="/" className="font-medium text-emerald-700 hover:underline">
            Ver Finazo en español →
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
