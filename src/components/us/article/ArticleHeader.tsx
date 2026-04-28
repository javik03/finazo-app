import Link from "next/link";

type ArticleHeaderProps = {
  category?: string;
  title: string;
  deck?: string | null;
  authorDisplayName: string;
  authorSlug: string | null;
  authorInitial: string;
  publishedAt: Date | null;
  wordCount: number | null;
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
  wordCount,
}: ArticleHeaderProps): React.ReactElement {
  const readingMins = wordCount ? Math.max(1, Math.round(wordCount / 220)) : 5;

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
          {publishedAt && (
            <>
              <span className="us-byline-sep">·</span>
              <span>Actualizado {formatDate(publishedAt)}</span>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
