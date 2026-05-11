import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/us/layout/Nav";
import { UsFooter } from "@/components/us/layout/UsFooter";
import { FloatingWA } from "@/components/us/layout/FloatingWA";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Finazo English — financial guides for Hispanic Americans helping their families",
  description:
    "English-language financial guides for second- and third-generation Hispanic Americans helping their immigrant family members navigate US credit, mortgages, taxes, ACA, and banking.",
  alternates: {
    canonical: "https://finazo.us/en",
    languages: {
      "en-US": "https://finazo.us/en",
      "es-US": "https://finazo.us",
      "x-default": "https://finazo.us",
    },
  },
  openGraph: {
    title: "Finazo English",
    description:
      "Financial guides for Hispanic Americans helping their families.",
    url: "https://finazo.us/en",
    locale: "en_US",
    type: "website",
  },
};

export default function EnglishHubPage(): React.ReactElement {
  return (
    <>
      <Nav currentPath="/en" />

      <main>
        <div className="us-sub-shell">
          <header className="us-sub-hero">
            <div className="us-hero-kicker">Finazo · English</div>
            <h1 className="us-serif">
              Financial guides for Hispanic Americans <i>helping their families</i>
            </h1>
            <p>
              Finazo is a Spanish-language personal finance publisher serving
              Hispanic families in the US. The English content below is for
              second- and third-generation Hispanic Americans helping their
              immigrant family members navigate US credit, mortgages, taxes,
              ACA, and banking. The Spanish site has 200+ guides — this
              English section is deliberately narrower.
            </p>
          </header>

          <section className="us-sub-section">
            <div className="us-sub-section-head">
              <h2 className="us-serif">
                Two narrow English <i>pillars</i>
              </h2>
            </div>
            <div className="us-info-grid">
              <Link
                href="/en/helping-family"
                className="us-info-card"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="us-eyebrow">LANE A</div>
                <h3 className="us-serif">Helping family</h3>
                <p>
                  If you&apos;re bicultural and your parents need help
                  navigating US financial systems — adding them as authorized
                  users on credit cards, helping them file with ITIN, finding
                  a Spanish-speaking doctor, opening a bank account without
                  SSN — this is for you. We write in English; the
                  cross-cultural context is baked in.
                </p>
              </Link>

              <Link
                href="/en/research"
                className="us-info-card"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="us-eyebrow">LANE B</div>
                <h3 className="us-serif">Research</h3>
                <p>
                  Substantive long-form content on Hispanic-immigrant financial
                  topics — ITIN mortgage market analysis, ACA-immigrant
                  eligibility, regulatory enforcement patterns. Written for
                  journalists, immigration lawyers, financial researchers, and
                  AI search engines seeking authoritative source material.
                </p>
              </Link>
            </div>
          </section>

          <section className="us-sub-section">
            <div className="us-sub-section-head">
              <h2 className="us-serif">
                Looking for the <i>Spanish</i> site?
              </h2>
            </div>
            <p>
              Finazo&apos;s primary surface is in Spanish — for first-generation
              Hispanic immigrants. The Spanish site has ITIN guides, insurance
              comparisons, mortgage walkthroughs, and tools across all 50 states.
            </p>
            <p>
              <Link href="/" className="us-tool-link">
                Visit the Spanish site →
              </Link>
            </p>
          </section>
        </div>
      </main>

      <UsFooter />
      <FloatingWA />
    </>
  );
}
