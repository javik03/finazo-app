import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CategoryHub } from "@/components/guias/CategoryHub";
import { getPublishedArticles } from "@/lib/queries/articles";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Guías de tarjetas de crédito en Centroamérica — Cómo elegir la mejor | Finazo",
  description:
    "Guías sobre tarjetas de crédito y débito en El Salvador, Guatemala y Honduras. Compara anualidades, cashback, millas y tasas de interés.",
  alternates: { canonical: "https://finazo.lat/guias/tarjetas" },
  openGraph: {
    title: "Guías de tarjetas de crédito en Centroamérica | Finazo",
    description:
      "Todo lo que necesitas saber para elegir la mejor tarjeta de crédito en El Salvador, Guatemala y Honduras.",
    url: "https://finazo.lat/guias/tarjetas",
    type: "website",
  },
};

const categorySchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Guías de tarjetas de crédito — Finazo",
  description:
    "Guías y comparativas sobre tarjetas de crédito y débito en Centroamérica.",
  url: "https://finazo.lat/guias/tarjetas",
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://finazo.lat" },
      { "@type": "ListItem", position: 2, name: "Guías", item: "https://finazo.lat/guias" },
      { "@type": "ListItem", position: 3, name: "Tarjetas", item: "https://finazo.lat/guias/tarjetas" },
    ],
  },
};

const intro = (
  <>
    <p className="mb-4">
      Elegir una tarjeta de crédito en Centroamérica no es sencillo: los bancos ofrecen docenas de variantes, con anualidades que van desde los $0 hasta los $200 anuales, programas de puntos y millas con reglas distintas, y tasas de interés que en algunos productos superan el 40% anual efectivo. La decisión correcta depende de cómo usas la tarjeta y qué beneficios valoras.
    </p>
    <p className="mb-4">
      En estas guías analizamos las tarjetas de crédito disponibles en <strong>El Salvador, Guatemala y Honduras</strong>: desde las tarjetas básicas de consumo hasta las tarjetas premium con acceso a salas VIP y seguro de viaje. Comparamos la <strong>tasa de interés efectiva anual</strong>, la anualidad, el programa de recompensas, el límite de crédito mínimo y los requisitos de ingreso para aplicar.
    </p>
    <p className="mb-4">
      También cubrimos los aspectos prácticos que suelen quedar fuera del marketing: qué pasa si pagas solo el mínimo, cómo funciona el cargo por avance de efectivo, qué significa el corte de estado de cuenta y la fecha límite de pago, y cómo evitar los cargos por mora que pueden disparar tu saldo.
    </p>
    <p>
      Para usuarios que buscan construir historial crediticio por primera vez, tenemos guías específicas sobre tarjetas aseguradas y programas de banca básica. Para los que ya tienen crédito establecido, cubrimos estrategias para maximizar las recompensas sin caer en deuda.
    </p>
  </>
);

export default async function TarjetasHubPage() {
  const articles = await getPublishedArticles({ category: "tarjetas", excludeCountry: "US" }).catch(() => []);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(categorySchema) }} />
      <Header activePath="/guias" />
      <CategoryHub
        category="tarjetas"
        label="Tarjetas"
        headline="Guías de tarjetas de crédito: cómo elegir la mejor en Centroamérica"
        intro={intro}
        articles={articles}
      />
      <Footer />
    </>
  );
}
