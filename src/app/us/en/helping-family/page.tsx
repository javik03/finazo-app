import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/us/layout/Nav";
import { UsFooter } from "@/components/us/layout/UsFooter";
import { FloatingWA } from "@/components/us/layout/FloatingWA";
import { UsBreadcrumb } from "@/components/us/article/Breadcrumb";
import { getPublishedUsArticles } from "@/lib/queries/us-articles";

export const revalidate = 3600;

const PATH = "/en/helping-family";
const CANONICAL = `https://finazo.us${PATH}`;

export const metadata: Metadata = {
  title: "Helping your immigrant family with US finances — Finazo English",
  description:
    "Guides for second- and third-generation Hispanic Americans helping their immigrant family with US credit, ITIN tax filing, ACA enrollment, mortgage cosigning, and banking without SSN.",
  alternates: {
    canonical: CANONICAL,
    languages: { "en-US": CANONICAL, "x-default": "https://finazo.us" },
  },
  openGraph: {
    title: "Helping your immigrant family with US finances",
    description:
      "Practical guides for the bicultural reader helping their immigrant parents navigate the US financial system.",
    url: CANONICAL,
    locale: "en_US",
    type: "website",
  },
};

const TOPIC_CLUSTERS = [
  {
    title: "Credit",
    body: "Adding your immigrant parents as authorized users. Cosigning with ITIN family members. Helping parents build US credit from zero.",
  },
  {
    title: "Insurance",
    body: "Adding an ITIN spouse to your auto policy. Buying insurance for elderly immigrant parents. Helping parents understand claims in English.",
  },
  {
    title: "Mortgage",
    body: "Cosigning a mortgage with an ITIN parent. Buying with mixed-status family. Helping parents refinance when English isn't their first language.",
  },
  {
    title: "Taxes",
    body: "Helping parents file with ITIN. Claiming immigrant parents as dependents. ITIN renewal help.",
  },
  {
    title: "Healthcare / ACA",
    body: "Enrolling mixed-status family in ACA. Finding Spanish-speaking doctors. Paying medical bills for undocumented parents.",
  },
  {
    title: "Banking & remittances",
    body: "Helping parents open a bank account with ITIN. Sending money home without fees. Protecting elderly parents from remittance scams.",
  },
];

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://finazo.us" },
    { "@type": "ListItem", position: 2, name: "English", item: "https://finazo.us/en" },
    { "@type": "ListItem", position: 3, name: "Helping family", item: CANONICAL },
  ],
};

export default async function HelpingFamilyPillar(): Promise<React.ReactElement> {
  const articles = await getPublishedUsArticles({ language: "en", limit: 30 }).catch(() => []);

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
              { label: "Helping family" },
            ]}
          />

          <header className="us-sub-hero">
            <div className="us-hero-kicker">English · Lane A</div>
            <h1 className="us-serif">
              Helping your immigrant family with US finances
            </h1>
            <p>
              You speak English natively. Your parents call the IRS number{" "}
              <em>el ITIN</em>, but they don&apos;t know the rules. You search
              NerdWallet, but NerdWallet doesn&apos;t address the
              &ldquo;helping my immigrant family&rdquo; context. That&apos;s
              what this section is for — bicultural, English-native, written
              from the perspective of the person doing the helping.
            </p>
          </header>

          <section className="us-sub-section">
            <div className="us-sub-section-head">
              <h2 className="us-serif">
                What we&apos;ll <i>cover</i>
              </h2>
              <p>
                Six topic clusters across the US financial system, scoped to
                the bicultural helper&apos;s point of view.
              </p>
            </div>
            <div className="us-info-grid">
              {TOPIC_CLUSTERS.map((t) => (
                <div key={t.title} className="us-info-card">
                  <h3 className="us-serif">{t.title}</h3>
                  <p>{t.body}</p>
                </div>
              ))}
            </div>
          </section>

          {articles.length > 0 ? (
            <section className="us-sub-section">
              <div className="us-sub-section-head">
                <h2 className="us-serif">
                  Latest <i>guides</i>
                </h2>
              </div>
              <ul className="us-related-list">
                {articles.map((a) => (
                  <li key={a.slug}>
                    <Link href={`/en/${a.slug}`} className="us-related-item">
                      <div>
                        <div className="us-related-item-title">{a.title}</div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : (
            <section className="us-sub-section">
              <div className="us-sub-section-head">
                <h2 className="us-serif">
                  English guides are <i>coming soon</i>
                </h2>
                <p>
                  Lane A content begins month 2 of our build. In the meantime,
                  our Spanish content covers most of these topics for the
                  immigrant audience directly —{" "}
                  <Link href="/guias">browse the Spanish guides</Link>.
                </p>
              </div>
            </section>
          )}
        </div>
      </main>

      <UsFooter />
      <FloatingWA />
    </>
  );
}
