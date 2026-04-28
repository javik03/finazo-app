import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CategoryHub } from "@/components/guias/CategoryHub";
import { getPublishedArticles } from "@/lib/queries/articles";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Guías de seguros en Centroamérica — Vida, salud y auto | Finazo",
  description:
    "Guías sobre seguros de vida, salud y automóvil en El Salvador, Guatemala y Honduras. Qué cubren, cuánto cuestan y cómo comparar pólizas.",
  alternates: { canonical: "https://finazo.lat/guias/seguros" },
  openGraph: {
    title: "Guías de seguros en Centroamérica | Finazo",
    description:
      "Aprende a comparar seguros de vida, salud y auto en Centroamérica con guías escritas en español.",
    url: "https://finazo.lat/guias/seguros",
    type: "website",
  },
};

const categorySchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Guías de seguros — Finazo",
  description:
    "Guías y comparativas sobre seguros de vida, salud y automóvil en Centroamérica.",
  url: "https://finazo.lat/guias/seguros",
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://finazo.lat" },
      { "@type": "ListItem", position: 2, name: "Guías", item: "https://finazo.lat/guias" },
      { "@type": "ListItem", position: 3, name: "Seguros", item: "https://finazo.lat/guias/seguros" },
    ],
  },
};

const intro = (
  <>
    <p className="mb-4">
      El mercado de seguros en Centroamérica ha crecido significativamente en la última década, pero la penetración sigue siendo baja comparada con el resto de América Latina. Muchas familias no tienen seguro de vida ni de salud — no porque no quieran, sino porque no saben exactamente qué están comprando ni cómo comparar las opciones disponibles.
    </p>
    <p className="mb-4">
      En esta sección cubrimos los tres tipos de seguro más relevantes para el mercado centroamericano: <strong>seguros de vida</strong> (dotales, temporales y universales), <strong>seguros de salud</strong> (individuales, familiares y los planes obligatorios del IGSS/ISSS) y <strong>seguros de automóvil</strong> (responsabilidad civil obligatoria vs. cobertura amplia). Para cada tipo explicamos qué cubre exactamente la póliza, qué exclusiones son comunes, y cómo comparar el precio real más allá de la prima mensual.
    </p>
    <p className="mb-4">
      También cubrimos los seguros obligatorios en cada país — qué te exige la ley tener, cómo cumplir con esos requisitos al menor costo, y qué hacer cuando un siniestro ocurre y necesitas activar tu cobertura.
    </p>
    <p>
      Las aseguradoras que operan en El Salvador están reguladas por la <strong>SSF</strong>; en Guatemala por la <strong>SIB</strong>; en Honduras por la <strong>CNBS</strong>. Todos nuestros artículos citan las fuentes regulatorias correspondientes para que puedas verificar la información.
    </p>
  </>
);

export default async function SegurosHubPage() {
  const articles = await getPublishedArticles({ category: "seguros", excludeCountry: "US" }).catch(() => []);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(categorySchema) }} />
      <Header activePath="/guias" />
      <CategoryHub
        category="seguros"
        label="Seguros"
        headline="Guías de seguros: vida, salud y auto en Centroamérica"
        intro={intro}
        articles={articles}
      />
      <Footer />
    </>
  );
}
