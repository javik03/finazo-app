import Link from "next/link";

/**
 * "Por situación" list of cohort sub-pages tucked under a pillar.
 *
 * Rendered on each pillar landing page so cohort pages get on-body
 * inbound links (compounds with the nav dropdown for topical
 * authority and reaches mobile users where the nav rail collapses).
 *
 * Anchor text varies by cohort — Google rewards anchor diversity.
 * Same set of links also lives in the global nav dropdown but with
 * shorter labels.
 */

export type CohortLink = {
  href: string;
  title: string;
  blurb: string;
};

type Props = {
  heading: string;
  intro: string;
  links: CohortLink[];
};

export function CohortLinksSection({
  heading,
  intro,
  links,
}: Props): React.ReactElement | null {
  if (links.length === 0) return null;
  const headingWords = heading.split(" ");
  const prefix = headingWords.slice(0, -1).join(" ");
  const tail = headingWords[headingWords.length - 1];
  return (
    <section className="us-sub-section">
      <div className="us-sub-section-head">
        <h2 className="us-serif">
          {prefix} <i>{tail}</i>
        </h2>
        <p>{intro}</p>
      </div>
      <div className="us-info-grid us-info-grid-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="us-info-card"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <h3 className="us-serif">{link.title}</h3>
            <p>{link.blurb}</p>
            <div className="us-tool-link" style={{ marginTop: 16 }}>
              Leer la guía →
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
