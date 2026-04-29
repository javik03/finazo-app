/**
 * Featured articles — 1 hero + 4 column. Hero gets a stylized gradient label.
 */

import Link from "next/link";

export type FeaturedArticle = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  authorName: string | null;
  readingTime: string;
  publishedRelative: string;
  imageLabel?: string; // overrides featured image with stylized text label
};

type FeaturedGridProps = {
  hero: FeaturedArticle | null;
  columnLeft: FeaturedArticle[];
  columnRight: FeaturedArticle[];
};

function ArticleMeta({ article }: { article: FeaturedArticle }): React.ReactElement {
  return (
    <div className="us-art-meta">
      {article.authorName && <span>{article.authorName}</span>}
      {article.authorName && <span className="us-sep" />}
      <span>{article.readingTime}</span>
      <span className="us-sep" />
      <span>{article.publishedRelative}</span>
    </div>
  );
}

function HeroArticle({
  article,
}: {
  article: FeaturedArticle;
}): React.ReactElement {
  return (
    <Link
      href={`/us/guias/${article.slug}`}
      className="us-art us-art-feat"
    >
      <div className="us-art-img">
        {article.imageLabel && (
          <div
            className="us-art-img-label"
            dangerouslySetInnerHTML={{
              __html: article.imageLabel.replace(/\n/g, "<br>"),
            }}
          />
        )}
      </div>
      <span className="us-art-cat">{article.category}</span>
      <h3 className="us-serif">{article.title}</h3>
      <p>{article.excerpt}</p>
      <ArticleMeta article={article} />
    </Link>
  );
}

function ColumnArticle({
  article,
}: {
  article: FeaturedArticle;
}): React.ReactElement {
  return (
    <Link
      href={`/us/guias/${article.slug}`}
      className="us-art us-art-col"
    >
      <span className="us-art-cat">{article.category}</span>
      <h3 className="us-serif">{article.title}</h3>
      <p>{article.excerpt}</p>
      <ArticleMeta article={article} />
    </Link>
  );
}

export function FeaturedGrid({
  hero,
  columnLeft,
  columnRight,
}: FeaturedGridProps): React.ReactElement {
  return (
    <div className="us-feature-grid">
      {hero && <HeroArticle article={hero} />}

      <div>
        {columnLeft.map((article) => (
          <ColumnArticle key={article.slug} article={article} />
        ))}
      </div>

      <div>
        {columnRight.map((article) => (
          <ColumnArticle key={article.slug} article={article} />
        ))}
      </div>
    </div>
  );
}
