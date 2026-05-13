import Link from "next/link";

type ListArticle = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readingTime: string;
  publishedRelative: string;
  /** Optional thumbnail. When present, renders a magazine-style
   *  thumbnail-left list row; otherwise falls back to text-only card. */
  featuredImageUrl?: string | null;
};

type MoreArticlesProps = {
  articles: ListArticle[];
  /** Layout variant. "grid" = original 3-col text cards (homepage).
   *  "list" = thumb-left magazine row (used on /guias + cluster hubs). */
  variant?: "grid" | "list";
};

export function MoreArticles({
  articles,
  variant = "grid",
}: MoreArticlesProps): React.ReactElement {
  if (variant === "list") {
    return (
      <div className="us-thumb-list">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/guias/${article.slug}`}
            className="us-thumb-row"
          >
            {article.featuredImageUrl && (
              <div className="us-thumb-img">
                <img
                  src={article.featuredImageUrl}
                  alt={article.title}
                  loading="lazy"
                />
              </div>
            )}
            <div className="us-thumb-body">
              <span className="us-art-cat">{article.category}</span>
              <h3 className="us-serif">{article.title}</h3>
              <p>{article.excerpt}</p>
              <div className="us-art-meta">
                <span>{article.readingTime}</span>
                <span className="us-sep" />
                <span>{article.publishedRelative}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="us-list-grid">
      {articles.map((article) => (
        <Link
          key={article.slug}
          href={`/guias/${article.slug}`}
          className="us-list-art"
        >
          <span className="us-art-cat">{article.category}</span>
          <h3 className="us-serif">{article.title}</h3>
          <p>{article.excerpt}</p>
          <div className="us-art-meta">
            <span>{article.readingTime}</span>
            <span className="us-sep" />
            <span>{article.publishedRelative}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
