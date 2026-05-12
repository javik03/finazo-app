type SectionHeadProps = {
  title: React.ReactNode;
  href?: string;
  hrefLabel?: string;
};

export function SectionHead({
  title,
  href,
  hrefLabel,
}: SectionHeadProps): React.ReactElement {
  return (
    <div className="us-section-head">
      <h2 className="us-serif">{title}</h2>
      {href && hrefLabel && (
        <a href={href} className="us-all">
          {hrefLabel} →
        </a>
      )}
    </div>
  );
}
