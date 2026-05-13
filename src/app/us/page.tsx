import type { Metadata } from "next";
import { getPublishedArticles } from "@/lib/queries/articles";
import { MastheadTop } from "@/components/us/layout/MastheadTop";
import { Nav } from "@/components/us/layout/Nav";
import { UsFooter } from "@/components/us/layout/UsFooter";
import { FloatingWA } from "@/components/us/layout/FloatingWA";
import { Hero } from "@/components/us/home/Hero";
import { SectionHead } from "@/components/us/home/SectionHead";
import {
  FeaturedGrid,
  type FeaturedArticle,
} from "@/components/us/home/FeaturedGrid";
import { ProductBand } from "@/components/us/home/ProductBand";
import { MoreArticles } from "@/components/us/home/MoreArticles";
import { ToolsStrip } from "@/components/us/home/ToolsStrip";
import { NewsletterBand } from "@/components/us/home/NewsletterBand";
import { ConvoProof } from "@/components/us/home/ConvoProof";
import { QuotesGrid } from "@/components/us/home/QuotesGrid";
import {
  formatLongDateEs,
  formatRelativeDate,
  readingTime,
} from "@/components/us/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Finazo — Finanzas en español, para los nuestros",
  description:
    "Publicación independiente de finanzas para Hispanos en EE.UU. Guías, comparativos y cotizaciones por WhatsApp. Cubierto para seguros, Hogares para hipotecas.",
  alternates: {
    canonical: "https://finazo.us",
    languages: {
      "es-US": "https://finazo.us",
    },
  },
  openGraph: {
    title: "Finazo — Finanzas en español, para los nuestros",
    description:
      "Publicación independiente para la comunidad Hispana en EE.UU. Seguros, hipotecas y remesas explicados sin letra chica.",
    url: "https://finazo.us",
    locale: "es_US",
    type: "website",
  },
};

type RawArticle = Awaited<ReturnType<typeof getPublishedArticles>>[number];

const CATEGORY_LABELS: Record<string, string> = {
  remesas: "Remesas",
  prestamos: "Préstamos",
  seguros: "Seguros",
  educacion: "Educación",
  tarjetas: "Crédito",
  ahorro: "Ahorro",
};

function toFeatured(article: RawArticle): FeaturedArticle {
  return {
    slug: article.slug,
    title: article.title,
    excerpt: article.metaDescription ?? "",
    category: CATEGORY_LABELS[article.category] ?? article.category,
    authorName: article.authorName,
    readingTime: readingTime(article.wordCount),
    publishedRelative: formatRelativeDate(
      article.publishedAt as Date | null | undefined,
    ),
    featuredImageUrl: article.featuredImageUrl,
  };
}

export default async function UsHomePage(): Promise<React.ReactElement> {
  const usArticles = await getPublishedArticles({
    country: "US",
    limit: 12,
  });

  const featured = usArticles.slice(0, 5).map(toFeatured);
  const moreList = usArticles.slice(5, 8).map(toFeatured);

  // Hero gets a stylized text label instead of an image (matches v2 design comp).
  const hero: FeaturedArticle | null = featured[0]
    ? { ...featured[0], imageLabel: "La letra chica\ndel seguro" }
    : null;

  const columnLeft = featured.slice(1, 3);
  const columnRight = featured.slice(3, 5);

  const today = formatLongDateEs(new Date());

  return (
    <>
      <MastheadTop date={today} />
      <Nav currentPath="/" />

      <main>
        <Hero
          kicker="Editorial · Abril 2026"
          title={
            <>
              Tus finanzas, en <i>español</i>. Sin letra chica.
            </>
          }
          deck="Finazo es una publicación independiente para Hispanos en EE.UU. Te explicamos cómo funcionan el seguro, la hipoteca y las remesas — en tu idioma, con números reales, y sin el tono del banco."
          bylineInitial="J"
          bylineName="Finazo"
          readingTime="7 min de lectura"
          updatedLabel="Actualizado hoy"
          leadParagraphs={[
            <>
              Si eres parte de los <strong>62 millones de Hispanos en Estados Unidos</strong>, probablemente hayas pagado de más en tu seguro, te hayan dicho que no a una hipoteca que sí calificabas, o enviado una remesa con $30 de comisión que no tenías que pagar.
            </>,
            <>
              No es tu culpa. El sistema financiero gringo se explica en inglés, se vende por teléfono, y se lee en letra de 8 puntos. Finazo existe para que eso deje de costarte dinero.
            </>,
          ]}
        />

        {/* Featured articles */}
        <section className="us-container">
          <SectionHead
            title={
              <>
                Lo más <i>leído</i> esta semana
              </>
            }
            href="/guias"
            hrefLabel="Ver todas las guías"
          />
          <FeaturedGrid
            hero={hero}
            columnLeft={columnLeft}
            columnRight={columnRight}
          />
        </section>

        {/* Product endorsement band */}
        <ProductBand />

        {/* More articles */}
        <section className="us-container">
          <SectionHead
            title={
              <>
                Más de <i>Finazo</i>
              </>
            }
            href="/guias"
            hrefLabel="Archivo completo"
          />
          <MoreArticles articles={moreList} />
        </section>

        {/* Tools / Calculators */}
        <ToolsStrip />

        {/* Newsletter */}
        <NewsletterBand />

        {/* WhatsApp conversation proof */}
        <ConvoProof />

        {/* Quotes / testimonials */}
        <QuotesGrid />
      </main>

      <UsFooter />
      <FloatingWA />
    </>
  );
}
