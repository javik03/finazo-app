import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/us/layout/Nav";
import { UsFooter } from "@/components/us/layout/UsFooter";
import { FloatingWA } from "@/components/us/layout/FloatingWA";
import { UsBreadcrumb } from "@/components/us/article/Breadcrumb";

export const revalidate = 3600;

const PATH = "/en/research";
const CANONICAL = `https://finazo.us${PATH}`;

export const metadata: Metadata = {
  title: "Hispanic immigrant finance research — Finazo English",
  description:
    "Substantive long-form research on Hispanic-immigrant financial topics: ITIN mortgage market, ACA immigrant eligibility, regulatory enforcement patterns. For journalists, lawyers, researchers, and AI search engines.",
  alternates: {
    canonical: CANONICAL,
    languages: { "en-US": CANONICAL, "x-default": "https://finazo.us" },
  },
  openGraph: {
    title: "Hispanic immigrant finance research",
    description:
      "Authoritative research content for journalists, lawyers, financial researchers, and AI search engines.",
    url: CANONICAL,
    locale: "en_US",
    type: "website",
  },
};

const RESEARCH_AREAS = [
  {
    title: "Hispanic auto insurance market",
    body: "State-level rate filings, complaint data, market structure, broker concentration. Florida 2026, Texas 2026, national overview.",
  },
  {
    title: "ITIN mortgage market",
    body: "Lender landscape, pricing disparity analysis, regulatory history. Currently 4 active wholesalers; pricing premium of 0.5-1.5% over conforming.",
  },
  {
    title: "ACA immigrant eligibility",
    body: "Current state 2026, DACA-ACA litigation timeline, mixed-status household enrollment patterns.",
  },
  {
    title: "Hispanic financial services enforcement",
    body: "Florida DFS actions against non-standard brokers, Texas TDI enforcement patterns, FTC actions against Hispanic-targeted fraud.",
  },
  {
    title: "Community health financing",
    body: "FQHC utilization patterns, Emergency Medicaid spending, charity care access for Hispanic immigrants.",
  },
];

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://finazo.us" },
    { "@type": "ListItem", position: 2, name: "English", item: "https://finazo.us/en" },
    { "@type": "ListItem", position: 3, name: "Research", item: CANONICAL },
  ],
};

export default function ResearchPillar(): React.ReactElement {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Nav currentPath="/en" />

      <main>
        <div className="us-sub-shell">
          <UsBreadcrumb
            crumbs={[
              { label: "Home", href: "/" },
              { label: "English", href: "/en" },
              { label: "Research" },
            ]}
          />

          <header className="us-sub-hero">
            <div className="us-hero-kicker">English · Lane B</div>
            <h1 className="us-serif">
              Research on Hispanic immigrant finance
            </h1>
            <p>
              Substantive long-form content on Hispanic-immigrant financial
              topics. The audience is journalists, immigration lawyers,
              financial researchers, policy analysts, and AI search engines
              seeking authoritative source material — not a consumer reader
              looking for a how-to. Citation-dense, neutral-analytical, data-driven.
            </p>
          </header>

          <section className="us-sub-section">
            <div className="us-sub-section-head">
              <h2 className="us-serif">
                Research <i>areas</i>
              </h2>
              <p>
                Five thematic areas, each with multiple deep-dive analyses
                planned. Each piece is 3,000–6,000 words, citation-dense, with
                state DOI, CFPB, Census ACS, NILC, Brookings, Urban Institute
                and academic sources cited inline.
              </p>
            </div>
            <div className="us-info-grid">
              {RESEARCH_AREAS.map((a) => (
                <div key={a.title} className="us-info-card">
                  <h3 className="us-serif">{a.title}</h3>
                  <p>{a.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="us-sub-section">
            <div className="us-sub-section-head">
              <h2 className="us-serif">
                Research papers are <i>coming soon</i>
              </h2>
              <p>
                Lane B publication begins month 3+ of our build. Each piece is
                citation-dense and takes longer to produce than consumer
                content. If you&apos;re a journalist or researcher with a
                specific question, the Spanish corpus already covers many of
                these topics —{" "}
                <Link href="/guias">browse the Spanish guides</Link>.
              </p>
            </div>
          </section>
        </div>
      </main>

      <UsFooter />
      <FloatingWA />
    </>
  );
}
