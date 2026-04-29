/**
 * Reusable 4-up "Why Cubierto/Hogares > going direct" grid.
 * Replaces the "phone numbers to State Farm/GEICO" anti-pattern.
 */

type Reason = {
  num: string;
  title: string;
  body: string;
};

type WhyBetterGridProps = {
  title: React.ReactNode;
  subtitle?: string;
  reasons: Reason[];
};

export function WhyBetterGrid({
  title,
  subtitle,
  reasons,
}: WhyBetterGridProps): React.ReactElement {
  return (
    <section className="us-sub-section">
      <div className="us-sub-section-head">
        <h2 className="us-serif">{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className="us-why-grid">
        {reasons.map((reason) => (
          <div key={reason.num} className="us-why-card">
            <span className="us-why-num">{reason.num}</span>
            <h3 className="us-serif">{reason.title}</h3>
            <p>{reason.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
