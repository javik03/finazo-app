/**
 * Site-wide Open Graph defaults for finazo.us pages that don't have
 * a per-page custom hero image. The article page (/guias/[slug])
 * uses each article's featured_image_url; everything else (cluster
 * hubs, tools, landing pages, legal pages) falls back to this.
 *
 * Replace FINAZO_DEFAULT_OG_IMAGE with a branded 1200×630 PNG at
 * /public/og-default.jpg once the design pass produces one. For now,
 * a finance-themed Pexels image gives social-share previews a
 * thumbnail instead of nothing.
 */

export const FINAZO_DEFAULT_OG_IMAGE =
  "https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200";

export const FINAZO_DEFAULT_OG_WIDTH = 1200;
export const FINAZO_DEFAULT_OG_HEIGHT = 630;

/**
 * Build an Open Graph metadata block. Pass per-page values when they
 * exist; omitted fields fall back to sensible defaults. Always emits
 * an `images` entry so social shares get a thumbnail.
 */
export function buildOpenGraph(opts: {
  title: string;
  description: string;
  url: string;
  type?: "website" | "article";
  imageUrl?: string | null;
  locale?: string;
}) {
  return {
    title: opts.title,
    description: opts.description,
    url: opts.url,
    type: opts.type ?? "website",
    locale: opts.locale ?? "es_US",
    siteName: "Finazo",
    images: [
      {
        url: opts.imageUrl ?? FINAZO_DEFAULT_OG_IMAGE,
        width: FINAZO_DEFAULT_OG_WIDTH,
        height: FINAZO_DEFAULT_OG_HEIGHT,
      },
    ],
  };
}
