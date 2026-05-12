import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CategoryHub } from "@/components/guias/CategoryHub";
import { getPublishedArticles } from "@/lib/queries/articles";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Guías de préstamos en Centroamérica — Bancos y tasas de interés | Finazo",
  description:
    "Guías sobre préstamos personales, hipotecas y crédito de consumo en El Salvador, Guatemala y Honduras. Compara tasas oficiales de la SSF, CNBS y SIB.",
  alternates: { canonical: "https://finazo.lat/guias/prestamos" },
  openGraph: {
    title: "Guías de préstamos en Centroamérica | Finazo",
    description:
      "Entiende cómo funciona el crédito bancario en Centroamérica: tasas de interés, requisitos, y cómo comparar antes de firmar.",
    url: "https://finazo.lat/guias/prestamos",
    type: "website",
  },
};

const categorySchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Guías de préstamos — Finazo",
  description:
    "Guías y comparativas sobre préstamos personales, hipotecas y crédito bancario en Centroamérica.",
  url: "https://finazo.lat/guias/prestamos",
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://finazo.lat" },
      { "@type": "ListItem", position: 2, name: "Guías", item: "https://finazo.lat/guias" },
      { "@type": "ListItem", position: 3, name: "Préstamos", item: "https://finazo.lat/guias/prestamos" },
    ],
  },
};

const intro = (
  <>
    <p className="mb-4">
      Obtener un préstamo en Centroamérica puede ser confuso: los bancos presentan tasas de formas distintas, algunos cobran comisiones de apertura que no aparecen en el titular, y el seguro de vida obligatorio puede duplicar el costo real del crédito. Estas guías están diseñadas para que puedas comparar con los mismos criterios y tomar una decisión informada.
    </p>
    <p className="mb-4">
      Cubrimos el mercado de <strong>El Salvador, Guatemala y Honduras</strong> con datos regulatorios oficiales de la <strong>SSF (Superintendencia del Sistema Financiero)</strong>, la <strong>SIB (Superintendencia de Bancos de Guatemala)</strong> y la <strong>CNBS (Comisión Nacional de Bancos y Seguros de Honduras)</strong>. Los reguladores publican mensualmente las tasas promedio del sistema — nosotros las convertimos en guías prácticas que cualquier persona puede entender.
    </p>
    <p className="mb-4">
      Encontrarás guías sobre préstamos personales, crédito de consumo, tarjetas de crédito con cuotas, préstamos hipotecarios, y crédito para pequeñas empresas. También explicamos conceptos clave como la <strong>Tasa Efectiva Anual (TEA)</strong>, el impacto del historial crediticio, y qué documentos necesitas para aplicar en cada banco.
    </p>
    <p>
      Si ya sabes lo que buscas, usa nuestro <a href="/prestamos" className="text-emerald-600 hover:underline font-medium">comparador de préstamos</a> para ver las tasas actuales de cada institución financiera ordenadas de menor a mayor costo.
    </p>
  </>
);

export default async function PrestamosHubPage() {
  const articles = await getPublishedArticles({ category: "prestamos", excludeCountry: "US" }).catch(() => []);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(categorySchema) }} />
      <Header activePath="/guias" />
      <CategoryHub
        category="prestamos"
        label="Préstamos"
        headline="Guías de préstamos: cómo comparar crédito bancario en Centroamérica"
        intro={intro}
        articles={articles}
      />
      <Footer />
    </>
  );
}
