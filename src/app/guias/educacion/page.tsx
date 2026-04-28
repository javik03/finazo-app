import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CategoryHub } from "@/components/guias/CategoryHub";
import { getPublishedArticles } from "@/lib/queries/articles";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Educación financiera para Centroamérica — Ahorro, inversión y presupuesto | Finazo",
  description:
    "Guías de educación financiera en español para El Salvador, Guatemala y Honduras. Aprende a ahorrar, presupuestar, invertir y manejar tus deudas.",
  alternates: { canonical: "https://finazo.lat/guias/educacion" },
  openGraph: {
    title: "Educación financiera para Centroamérica | Finazo",
    description:
      "Guías prácticas de finanzas personales para familias en El Salvador, Guatemala y Honduras.",
    url: "https://finazo.lat/guias/educacion",
    type: "website",
  },
};

const categorySchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Educación financiera — Finazo",
  description:
    "Guías de educación financiera personal para mercados de Centroamérica.",
  url: "https://finazo.lat/guias/educacion",
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://finazo.lat" },
      { "@type": "ListItem", position: 2, name: "Guías", item: "https://finazo.lat/guias" },
      { "@type": "ListItem", position: 3, name: "Educación financiera", item: "https://finazo.lat/guias/educacion" },
    ],
  },
};

const intro = (
  <>
    <p className="mb-4">
      La educación financiera sigue siendo una de las grandes brechas en Centroamérica. Según datos del Banco Mundial, menos del 30% de los adultos en la región tienen acceso a servicios financieros formales, y una proporción aún menor tiene conocimientos básicos sobre ahorro, interés compuesto o planificación presupuestaria. El resultado: millones de familias que trabajan duro pero avanzan poco porque el dinero no trabaja para ellos.
    </p>
    <p className="mb-4">
      Esta sección está diseñada para cambiar eso. Cubrimos los conceptos fundamentales de las finanzas personales adaptados a la realidad centroamericana: <strong>cómo construir un presupuesto familiar</strong> cuando los ingresos son variables, <strong>cómo ahorrar</strong> en contextos de alta inflación, <strong>cómo salir de deudas</strong> de manera sistemática, y <strong>cómo empezar a invertir</strong> con montos accesibles desde El Salvador, Guatemala u Honduras.
    </p>
    <p className="mb-4">
      También abordamos temas específicos del contexto regional: cómo manejar las remesas recibidas para que no se gasten todas en consumo, qué opciones de ahorro formal existen en cada país, cómo funcionan los fondos de pensiones (AFP/INPEP en El Salvador, AFP en Honduras), y cómo proteger el patrimonio familiar.
    </p>
    <p>
      Nuestras guías no venden productos financieros — explican cómo funcionan para que tomes decisiones informadas. Si después de leer quieres comparar opciones concretas, usa nuestros comparadores de <a href="/remesas" className="text-emerald-600 hover:underline font-medium">remesas</a> y <a href="/prestamos" className="text-emerald-600 hover:underline font-medium">préstamos</a>.
    </p>
  </>
);

export default async function EducacionHubPage() {
  const articles = await getPublishedArticles({ category: "educacion", excludeCountry: "US" }).catch(() => []);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(categorySchema) }} />
      <Header activePath="/guias" />
      <CategoryHub
        category="educacion"
        label="Educación financiera"
        headline="Educación financiera para Centroamérica: ahorro, inversión y presupuesto"
        intro={intro}
        articles={articles}
      />
      <Footer />
    </>
  );
}
