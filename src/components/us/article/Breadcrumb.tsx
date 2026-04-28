import Link from "next/link";

type Crumb = { label: string; href?: string };

export function UsBreadcrumb({
  crumbs,
}: {
  crumbs: Crumb[];
}): React.ReactElement {
  return (
    <nav className="us-breadcrumb" aria-label="Breadcrumb">
      {crumbs.map((crumb, idx) => {
        const isLast = idx === crumbs.length - 1;
        return (
          <span key={idx} style={{ display: "contents" }}>
            {idx > 0 && <span className="us-breadcrumb-sep">›</span>}
            {crumb.href && !isLast ? (
              <Link href={crumb.href}>{crumb.label}</Link>
            ) : (
              <span className={isLast ? "us-current" : undefined}>
                {crumb.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
