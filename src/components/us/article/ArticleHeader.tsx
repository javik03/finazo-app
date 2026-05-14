import Link from "next/link";
import Image from "next/image";

type ArticleHeaderProps = {
  category?: string;
  title: string;
  deck?: string | null;
  authorDisplayName: string;
  authorSlug: string | null;
  authorInitial: string;
  publishedAt: Date | null;
  /** Last refresh / regeneration timestamp. Drives the visible
   *  "Última actualización" line that AI engines and Google use as
   *  a freshness signal. Falls back to publishedAt when missing. */
  updatedAt?: Date | null;
  wordCount: number | null;
  featuredImageUrl: string | null;
};

const CATEGORY_LABELS: Record<string, string> = {
  remesas: "Remesas",
  prestamos: "Préstamos",
  seguros: "Seguros",
  educacion: "Educación financiera",
  tarjetas: "Crédito",
  ahorro: "Ahorro",
};

function formatDate(date: Date | null): string {
  if (!date) return "";
  return date.toLocaleDateString("es-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function ArticleHeader({
  category,
  title,
  deck,
  authorDisplayName,
  authorSlug,
  authorInitial,
  publishedAt,
  updatedAt,
  wordCount,
  featuredImageUrl,
}: ArticleHeaderProps): React.ReactElement {
  const readingMins = wordCount ? Math.max(1, Math.round(wordCount / 220)) : 5;
  // Freshness signal: prefer updatedAt, fall back to publishedAt.
  const refreshDate = updatedAt ?? publishedAt;

  return (
    <header className="us-article-head">
      {category && (
        <span className="us-article-cat">
          {CATEGORY_LABELS[category] ?? category}
        </span>
      )}
      <h1 className="us-article-title us-serif">{title}</h1>
      {deck && <p className="us-article-deck">{deck}</p>}

      <div className="us-article-byline">
        <div className="us-author-avatar">{authorInitial}</div>
        <div>
          {authorSlug ? (
            <Link
              href={`/us/autor/${authorSlug}`}
              className="us-byline-name"
            >
              {authorDisplayName}
            </Link>
          ) : (
            <span className="us-byline-name">{authorDisplayName}</span>
          )}
          <span className="us-byline-sep">·</span>
          <span>{readingMins} min de lectura</span>
          {refreshDate && (
            <>
              <span className="us-byline-sep">·</span>
              <span>Última actualización: {formatDate(refreshDate)}</span>
            </>
          )}
        </div>
      </div>

      {featuredImageUrl && (
        <div className="us-article-image">
          <Image
            src={featuredImageUrl}
            alt={title}
            width={1200}
            height={630}
            priority
            sizes="(max-width: 760px) 100vw, 760px"
            style={{ width: "100%", height: "auto" }}
          />
        </div>
      )}
    </header>
  );
}
