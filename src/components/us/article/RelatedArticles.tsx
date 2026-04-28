import Link from "next/link";

type RelatedArticle = {
  slug: string;
  title: string;
  publishedAt: Date | null;
};

type RelatedArticlesProps = {
  articles: RelatedArticle[];
  category?: string;
  categoryLabel?: string;
  categoryHref?: string;
};

const ARROW = (
  <svg
    className="us-arrow"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);

function formatDate(date: Date | null): string {
  if (!date) return "";
  return date.toLocaleDateString("es-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function RelatedArticles({
  articles,
  categoryLabel,
  categoryHref,
}: RelatedArticlesProps): React.ReactElement | null {
  if (articles.length === 0) return null;

  return (
    <aside className="us-related">
      <h2>
        {categoryLabel ? `Más guías de ${categoryLabel}` : "Guías relacionadas"}
      </h2>
      <ul className="us-related-list">
        {articles.map((article) => (
          <li key={article.slug}>
            <Link
              href={`/us/guias/${article.slug}`}
              className="us-related-item"
            >
              {ARROW}
              <div>
                <div className="us-related-item-title">{article.title}</div>
                {article.publishedAt && (
                  <div className="us-related-item-meta">
                    {formatDate(article.publishedAt)}
                  </div>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
      {categoryLabel && categoryHref && (
        <Link href={categoryHref} className="us-related-all">
          Ver todas las guías de {categoryLabel} →
        </Link>
      )}
    </aside>
  );
}
