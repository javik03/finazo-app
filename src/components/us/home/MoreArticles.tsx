import Link from "next/link";

type ListArticle = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readingTime: string;
  publishedRelative: string;
};

type MoreArticlesProps = {
  articles: ListArticle[];
};

export function MoreArticles({
  articles,
}: MoreArticlesProps): React.ReactElement {
  return (
    <div className="us-list-grid">
      {articles.map((article) => (
        <Link
          key={article.slug}
          href={`/us/guias/${article.slug}`}
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
