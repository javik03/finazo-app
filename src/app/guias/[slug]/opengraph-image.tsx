import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Finazo — Guía financiera";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: Promise<{ slug: string }> };

export default async function ArticleOGImage({ params }: Props) {
  const { slug } = await params;

  let title = "Guías financieras para Centroamérica";
  let category = "Finanzas Personales";
  let description = "Finazo — Compara remesas, préstamos y seguros";

  try {
    const { getArticleBySlug } = await import("@/lib/queries/articles");
    const article = await getArticleBySlug(slug);
    if (article) {
      title = article.title;
      description = article.metaDescription ?? description;
      if (article.category) {
        category = article.category.charAt(0).toUpperCase() + article.category.slice(1).replace(/-/g, " ");
      }
    }
  } catch {
    // fallback values used
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: "#ffffff",
          padding: "60px",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Green accent bar */}
        <div
          style={{
            width: "80px",
            height: "6px",
            backgroundColor: "#059669",
            borderRadius: "3px",
            marginBottom: "32px",
          }}
        />

        {/* Category badge */}
        <div
          style={{
            display: "flex",
            backgroundColor: "#d1fae5",
            color: "#065f46",
            fontSize: "14px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            padding: "6px 16px",
            borderRadius: "999px",
            width: "fit-content",
            marginBottom: "24px",
          }}
        >
          {category}
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: title.length > 60 ? "38px" : "48px",
            fontWeight: 800,
            color: "#0f172a",
            lineHeight: 1.2,
            marginBottom: "24px",
            flex: 1,
          }}
        >
          {title}
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: "20px",
            color: "#475569",
            lineHeight: 1.5,
            marginBottom: "40px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            overflow: "hidden",
          }}
        >
          {description}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #e2e8f0",
            paddingTop: "24px",
          }}
        >
          <div
            style={{
              fontSize: "28px",
              fontWeight: 800,
              color: "#059669",
            }}
          >
            Finazo
          </div>
          <div
            style={{
              fontSize: "16px",
              color: "#94a3b8",
            }}
          >
            finazo.lat
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
