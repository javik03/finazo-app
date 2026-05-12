import Link from "next/link";
import { Nav } from "@/components/us/layout/Nav";
import { UsFooter } from "@/components/us/layout/UsFooter";
import { FloatingWA } from "@/components/us/layout/FloatingWA";
import { UsBreadcrumb } from "@/components/us/article/Breadcrumb";
import { StateAwareCTA } from "@/components/us/article/StateAwareCTA";
import { getPublishedArticles } from "@/lib/queries/articles";
import {
  formatRelativeDate,
  readingTime,
} from "@/components/us/lib/format";

/**
 * Generic cohort-cluster landing page used by /seguro-auto-sin-social-security,
 * /comprar-casa-sin-social-security, /credito-sin-social-security,
 * /impuestos-sin-social-security, /banco-sin-ssn,
 * /seguro-auto-licencia-extranjera.
 *
 * Each cluster aggregates existing articles whose slug or keywords match
 * `articleSlugIncludes` — so the page stays fresh as the strategist
 * publishes new leafs.
 */

export type ClusterCopy = {
  /** URL path the page is mounted at (used in canonical + breadcrumb). */
  path: string;
  /** Breadcrumb label + H1 prefix. */
  shortName: string;
  /** Full H1. */
  h1: string;
  /** Title meta tag. */
  metaTitle: string;
  /** Meta description. */
  metaDescription: string;
  /** Hero kicker (eyebrow text above H1). */
  kicker: string;
  /** Lead paragraphs displayed under the H1. */
  lead: string[];
  /** Article slug-fragment filters — any slug containing one of these is
   *  surfaced in the "related articles" grid. */
  articleSlugIncludes: string[];
  /** Real-data block with cited URL. */
  realDataBlock: {
    title: string;
    body: string;
    sourceLabel: string;
    sourceUrl: string;
  };
  /** Three info-grid cards under "qué necesitas saber". */
  keyPoints: Array<{
    eyebrow: string;
    title: string;
    body: string;
  }>;
  /** 5+ FAQ entries. */
  faqs: Array<{ q: string; a: string }>;
  /** Which product the CTA funnels to. Cluster has no state context. */
  ctaProduct: "auto" | "mortgage";
  /** Optional slot rendered immediately under the breadcrumb (e.g. ACA
   *  "no es asesoría legal" disclaimer). */
  topNotice?: React.ReactNode;
  /** Optional slot rendered at the bottom (mirror of topNotice). */
  bottomNotice?: React.ReactNode;
  /** Optional extra sections inserted between the realDataBlock and the CTA
   *  (e.g. ACA eligibility framework). */
  extraSections?: React.ReactNode;
};

const CATEGORY_LABELS: Record<string, string> = {
  remesas: "Remesas",
  prestamos: "Préstamos",
  seguros: "Seguros",
  educacion: "Educación",
  tarjetas: "Crédito",
  ahorro: "Ahorro",
};

export async function ClusterLanding({
  copy,
}: {
  copy: ClusterCopy;
}): Promise<React.ReactElement> {
  // Pull a broad pool, then filter client-side on slug fragments. This is
  // cheap (limit 50, runs every revalidate) and keeps the data layer dumb.
  const allUs = await getPublishedArticles({ country: "US", limit: 80 }).catch(
    () => [],
  );
  const matched = allUs.filter((a) =>
    copy.articleSlugIncludes.some((frag) => a.slug.includes(frag)),
  );

  const canonical = `https://finazo.us${copy.path}`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://finazo.us" },
      { "@type": "ListItem", position: 2, name: copy.shortName, item: canonical },
    ],
  };

  const faqSchema =
    copy.faqs.length >= 2
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: copy.faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: copy.h1,
    description: copy.metaDescription,
    inLanguage: "es-US",
    author: {
      "@type": "Organization",
      name: "Finazo",
      url: "https://finazo.us",
    },
    publisher: {
      "@type": "Organization",
      name: "Finazo",
      url: "https://finazo.us",
    },
    dateModified: new Date().toISOString().slice(0, 10),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <Nav currentPath={copy.path} />

      <main>
        <div className="us-sub-shell">
          <UsBreadcrumb
            crumbs={[{ label: "Inicio", href: "/" }, { label: copy.shortName }]}
          />

          {copy.topNotice}

          <header className="us-sub-hero">
            <div className="us-hero-kicker">{copy.kicker}</div>
            <h1 className="us-serif">{copy.h1}</h1>
            {copy.lead.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </header>

          <section className="us-sub-section">
            <div className="us-sub-section-head">
              <h2 className="us-serif">
                Lo que <i>necesitás saber</i>
              </h2>
            </div>
            <div className="us-info-grid us-info-grid-3">
              {copy.keyPoints.map((p) => (
                <div key={p.title} className="us-info-card">
                  <div className="us-eyebrow">{p.eyebrow}</div>
                  <h3 className="us-serif">{p.title}</h3>
                  <p>{p.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="us-sub-section">
            <div className="us-sub-section-head">
              <h2 className="us-serif">{copy.realDataBlock.title}</h2>
              <p>{copy.realDataBlock.body}</p>
            </div>
            <div className="us-data-source">
              FUENTE:{" "}
              <a
                href={copy.realDataBlock.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {copy.realDataBlock.sourceLabel}
              </a>
            </div>
          </section>

          {copy.extraSections}

          <StateAwareCTA state={null} product={copy.ctaProduct} />

          {matched.length > 0 && (
            <section className="us-sub-section">
              <div className="us-sub-section-head">
                <h2 className="us-serif">
                  Guías <i>relacionadas</i>
                </h2>
                <p>
                  Las guías más recientes de Finazo sobre {copy.shortName.toLowerCase()}.
                </p>
              </div>
              <div className="us-hub-grid">
                {matched.slice(0, 12).map((a) => (
                  <Link
                    key={a.slug}
                    href={`/guias/${a.slug}`}
                    className="us-list-art"
                  >
                    <span className="us-art-cat">
                      {CATEGORY_LABELS[a.category] ?? a.category}
                    </span>
                    <h3 className="us-serif">{a.title}</h3>
                    {a.metaDescription && <p>{a.metaDescription}</p>}
                    <div className="us-art-meta">
                      {a.authorName && <span>{a.authorName}</span>}
                      {a.authorName && <span className="us-sep" />}
                      <span>{readingTime(a.wordCount)}</span>
                      <span className="us-sep" />
                      <span>
                        {formatRelativeDate(a.publishedAt as Date | null)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="us-sub-section">
            <div className="us-sub-section-head">
              <h2 className="us-serif">
                Preguntas <i>frecuentes</i>
              </h2>
            </div>
            <div className="us-faq-list">
              {copy.faqs.map((faq) => (
                <div key={faq.q} className="us-faq-item">
                  <h3>{faq.q}</h3>
                  <p>{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          {copy.bottomNotice}
        </div>
      </main>

      <UsFooter />
      <FloatingWA />
    </>
  );
}
