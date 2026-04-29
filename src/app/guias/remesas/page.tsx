import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CategoryHub } from "@/components/guias/CategoryHub";
import { getPublishedArticles } from "@/lib/queries/articles";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Guías de remesas — Envíos de dinero a Centroamérica | Finazo",
  description:
    "Guías prácticas sobre cómo enviar dinero a El Salvador, Guatemala, Honduras y México. Comparamos tarifas de Wise, Remitly, Western Union y más.",
  alternates: { canonical: "https://finazo.lat/guias/remesas" },
  openGraph: {
    title: "Guías de remesas — Envíos de dinero a Centroamérica | Finazo",
    description:
      "Aprende a enviar dinero al menor costo posible con guías actualizadas sobre los mejores servicios de remesas.",
    url: "https://finazo.lat/guias/remesas",
    type: "website",
  },
};

const categorySchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Guías de remesas — Finazo",
  description:
    "Guías y comparativas sobre envíos de dinero internacionales hacia Centroamérica y México.",
  url: "https://finazo.lat/guias/remesas",
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://finazo.lat" },
      { "@type": "ListItem", position: 2, name: "Guías", item: "https://finazo.lat/guias" },
      { "@type": "ListItem", position: 3, name: "Remesas", item: "https://finazo.lat/guias/remesas" },
    ],
  },
};

const intro = (
  <>
    <p className="mb-4">
      Las remesas mueven más de <strong>24 mil millones de dólares</strong> al año hacia Centroamérica y México. Para millones de familias en El Salvador, Guatemala, Honduras y más allá, ese dinero es el ingreso principal del hogar. Sin embargo, las tarifas de envío pueden comerse entre el 2% y el 8% de cada transferencia — dinero que debería llegar a tu familia, no quedarse en la comisión del proveedor.
    </p>
    <p className="mb-4">
      En esta sección encontrarás guías que te explican, sin letra pequeña, cómo funcionan los principales servicios de envío: <strong>Wise, Remitly, Western Union, Xoom, MoneyGram</strong> y las opciones de los bancos locales. Comparamos el tipo de cambio real, la tarifa de envío, la velocidad de entrega y los métodos de pago disponibles para cada corredor — desde EE.UU. hacia El Salvador, desde España hacia Honduras, desde Canadá hacia Guatemala.
    </p>
    <p className="mb-4">
      También cubrimos los temas prácticos que nadie explica: qué pasa si el destinatario no tiene cuenta bancaria, cómo funciona el retiro en efectivo, cuándo usar una billetera móvil como Nequi o Tigo Money, y cómo evitar los cargos ocultos de tipo de cambio que aplican algunos servicios.
    </p>
    <p>
      Todas nuestras guías se actualizan cuando cambian las tarifas de mercado. Usamos datos oficiales de los proveedores y los contrastamos con la fuente regulatoria de cada país. Si quieres comparar tarifas en tiempo real para tu corredor específico, usa nuestro <a href="/remesas" className="text-emerald-600 hover:underline font-medium">comparador de remesas</a>.
    </p>
  </>
);

export default async function RemesasHubPage() {
  const articles = await getPublishedArticles({ category: "remesas", excludeCountry: "US" }).catch(() => []);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(categorySchema) }} />
      <Header activePath="/guias" />
      <CategoryHub
        category="remesas"
        label="Remesas"
        headline="Guías de remesas: cómo enviar dinero a Centroamérica al menor costo"
        intro={intro}
        articles={articles}
      />
      <Footer />
    </>
  );
}
