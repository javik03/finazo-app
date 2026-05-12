import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedArticles } from "@/lib/queries/articles";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SV_PRIMARY_CITIES, SV_AUTO_FINANCE_INTENTS } from "@/lib/constants/geos";

export const revalidate = 3600;

const CANONICAL = "https://finazo.lat/prestamos-por-tu-carro";
const CREDIMOVIL_URL =
  "https://credimovil.io?utm_source=finazo&utm_medium=editorial&utm_campaign=pillar-prestamos-carro";

export const metadata: Metadata = {
  title: "Préstamo por tu carro en El Salvador: guía honesta 2026 | Finazo",
  description:
    "Cómo funciona realmente un 'préstamo por tu carro' en El Salvador. Diferencia con empeñar tu vehículo. Comparativo CrediMóvil, casas de empeño y bancos.",
  alternates: {
    canonical: CANONICAL,
    languages: { "es-SV": CANONICAL, "x-default": CANONICAL },
  },
  openGraph: {
    title: "Préstamo por tu carro en El Salvador: guía honesta 2026",
    description:
      "El producto que la gente busca como 'préstamo por su carro' legalmente es un arrendamiento financiero. Acá la diferencia, los costos y las opciones reales.",
    url: CANONICAL,
    type: "website",
    locale: "es_SV",
  },
};

const PILLAR_FAQS = [
  {
    q: "¿Qué es realmente un 'préstamo por tu carro' en El Salvador?",
    a: "En la mayoría de los casos, lo que mucha gente conoce como 'préstamo por su carro' en El Salvador legalmente es un arrendamiento financiero (sale-leaseback): vendés tu vehículo a la compañía y al mismo tiempo firmás un contrato de arrendamiento para seguir manejándolo. CrediMóvil opera bajo este modelo regulado.",
  },
  {
    q: "¿En qué se diferencia de empeñar mi carro en una casa de empeño?",
    a: "La diferencia más grande es la posesión: en una casa de empeño entregás las llaves y el vehículo se queda en sus instalaciones. Con el modelo de arrendamiento financiero seguís manejándolo durante todo el plazo del contrato.",
  },
  {
    q: "¿Cuánto puedo obtener por mi carro?",
    a: "Depende del año, modelo, kilometraje y estado del vehículo. CrediMóvil típicamente avalúa entre 40% y 70% del valor de mercado del carro y entrega ese efectivo. La cuota mensual se calcula sobre ese monto y el plazo elegido.",
  },
  {
    q: "¿Qué documentos necesito?",
    a: "Tarjeta de circulación y título de propiedad del vehículo a tu nombre y al día, DUI vigente, NIT, y comprobante de ingresos (recibos de salario, declaraciones de IVA si sos comerciante, o estados de cuenta bancaria si trabajás por tu cuenta).",
  },
  {
    q: "¿Qué pasa si no puedo pagar las cuotas?",
    a: "El contrato de arrendamiento financiero incluye cláusulas de incumplimiento. La empresa puede recuperar el vehículo (repossession) según el plazo de mora pactado. Antes de firmar leé esa sección con cuidado y consultá con la Defensoría del Consumidor (defensoria.gob.sv) si tenés dudas.",
  },
];

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://finazo.lat" },
    { "@type": "ListItem", position: 2, name: "Préstamo por tu carro", item: CANONICAL },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: PILLAR_FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Préstamo por tu carro en El Salvador: guía honesta 2026",
  inLanguage: "es-SV",
  author: {
    "@type": "Organization",
    name: "Finazo",
    url: "https://finazo.lat",
  },
  publisher: {
    "@type": "Organization",
    name: "Finazo",
    url: "https://finazo.lat",
  },
  datePublished: "2026-05-11",
  dateModified: new Date().toISOString().slice(0, 10),
};

export default async function PrestamoPorTuCarroPillarPage(): Promise<React.ReactElement> {
  // Articles already published in the CrediMóvil cluster — surfaced in the
  // "guías por ciudad e intención" section so users can find their local
  // variant. Empty array is fine on first deploy.
  const credimovilArticles = await getPublishedArticles({
    country: "SV",
    category: "prestamos",
    limit: 30,
  }).catch(() => []);

  // Match articles whose slug starts with one of the intent slugs from
  // SV_AUTO_FINANCE_INTENTS — those are the city × intent leafs from the
  // credimovil-templates module.
  const intentPrefixes = SV_AUTO_FINANCE_INTENTS.map((i) => i.slug);
  const clusterArticles = credimovilArticles.filter((a) =>
    intentPrefixes.some((prefix) => a.slug.startsWith(prefix)),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <Header />

      <main className="max-w-3xl mx-auto px-4 py-10 prose prose-emerald prose-lg">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-4">
          <Link href="/">Inicio</Link> · <span>Préstamo por tu carro</span>
        </nav>

        <h1>Préstamo por tu carro en El Salvador: guía honesta 2026</h1>

        <blockquote className="border-l-4 border-emerald-600 bg-emerald-50 p-4 not-italic">
          <strong>Lo esencial:</strong>
          <ul className="my-2">
            <li>
              Lo que en la calle se llama &ldquo;préstamo por tu carro&rdquo; legalmente es un{" "}
              <strong>arrendamiento financiero</strong> (sale-leaseback).
            </li>
            <li>
              A diferencia de empeñar el carro, con este modelo{" "}
              <strong>seguís manejando tu vehículo</strong> mientras pagás las cuotas.
            </li>
            <li>
              CrediMóvil es la empresa salvadoreña que opera este producto bajo
              normativa regulada.
            </li>
            <li>
              Aprobación típica 24-48 horas con título y tarjeta de circulación al día.
            </li>
          </ul>
        </blockquote>

        <h2>Cómo funciona realmente un &ldquo;préstamo por tu carro&rdquo; en El Salvador en 2026</h2>

        <p>
          En El Salvador hay un mercado real de salvadoreños que necesitan
          efectivo rápido y tienen un vehículo a su nombre como activo. Las
          búsquedas como &ldquo;préstamo por tu carro&rdquo;, &ldquo;empeñar
          carro El Salvador&rdquo; o &ldquo;dinero rápido con mi carro&rdquo;
          son altas porque el producto resuelve un problema concreto: sacar el
          valor del vehículo sin venderlo.
        </p>

        <p>
          Lo importante saber antes de firmar: <strong>el producto que la
          mayoría de empresas formales ofrecen en El Salvador NO es un préstamo
          bancario con prenda — es un arrendamiento financiero o sale-leaseback.</strong>{" "}
          Es decir, vos vendés legalmente el vehículo a la empresa y al mismo
          tiempo firmás un contrato para seguir manejándolo, con la opción de
          recomprarlo al terminar de pagar.
        </p>

        <h2>Diferencia operacional con empeñar tu carro en una casa de empeño tradicional</h2>

        <p>
          La diferencia principal es la <strong>posesión del vehículo durante
          el plazo</strong>. En una casa de empeño tradicional entregás las
          llaves y el carro se queda guardado hasta que recuperés el préstamo.
          En el modelo de arrendamiento financiero seguís usándolo
          normalmente — para trabajar, llevar a los niños, lo que sea.
        </p>

        <table>
          <thead>
            <tr>
              <th>Criterio</th>
              <th>Empeño tradicional</th>
              <th>Arrendamiento financiero (CrediMóvil)</th>
              <th>Préstamo bancario con prenda</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Posesión del vehículo</td>
              <td>Entregás el carro</td>
              <td>Seguís manejándolo</td>
              <td>Seguís manejándolo</td>
            </tr>
            <tr>
              <td>Tiempo de aprobación</td>
              <td>Mismo día</td>
              <td>24-48 horas</td>
              <td>1-4 semanas</td>
            </tr>
            <tr>
              <td>Documentos</td>
              <td>DUI + tarjeta circulación</td>
              <td>DUI + título + circulación + ingresos</td>
              <td>DUI + título + circulación + ingresos + buró</td>
            </tr>
            <tr>
              <td>Plazo típico</td>
              <td>30-90 días renovables</td>
              <td>6-36 meses</td>
              <td>12-60 meses</td>
            </tr>
            <tr>
              <td>Regulación principal</td>
              <td>Régimen casas de empeño</td>
              <td>Marco arrendamiento financiero salvadoreño</td>
              <td>SSF (Superintendencia del Sistema Financiero)</td>
            </tr>
          </tbody>
        </table>

        <h2>CrediMóvil: el operador formal del modelo sale-leaseback vehicular en El Salvador</h2>

        <p>
          CrediMóvil es la empresa salvadoreña que opera el modelo de
          arrendamiento financiero sobre vehículos usados a escala formal. El
          producto está pensado para salvadoreños con un vehículo a su nombre
          que necesitan entre $500 y $10,000 de efectivo y prefieren no perder
          posesión del carro.
        </p>

        <div className="my-6 rounded-lg border border-emerald-600 bg-emerald-50 p-5">
          <p className="my-0">
            <strong>Cotizá con CrediMóvil →</strong> Aprobación en 24-48 horas
            con tu título y tarjeta de circulación al día.
          </p>
          <p className="my-2">
            <a
              href={CREDIMOVIL_URL}
              className="inline-block rounded bg-emerald-700 px-4 py-2 text-white no-underline hover:bg-emerald-800"
            >
              Ir a CrediMóvil
            </a>
          </p>
          <p className="my-0 text-sm text-gray-700">
            <strong>Divulgación:</strong> CrediMóvil es un{" "}
            <strong>socio afiliado</strong> de Finazo. Cuando te conectamos
            con ellos recibimos comisión — la paga la compañía, no vos.
            Finazo es una publicación independiente; CrediMóvil opera bajo
            su propia entidad legal con responsabilidad propia sobre su
            producto financiero.
          </p>
        </div>

        <h2>Guías de préstamo por tu carro por ciudad e intención de búsqueda</h2>

        <p>
          Tenemos guías específicas para las búsquedas más comunes en las
          principales ciudades del país. Si querés ver tu ciudad puntual con la
          variante exacta que buscás:
        </p>

        {clusterArticles.length > 0 ? (
          <ul>
            {clusterArticles.map((a) => (
              <li key={a.slug}>
                <Link href={`/guias/${a.slug}`}>{a.title}</Link>
                {a.metaDescription ? ` — ${a.metaDescription}` : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">
            Las guías por ciudad están en proceso de publicación. Mientras
            tanto, podés{" "}
            <a href={CREDIMOVIL_URL}>cotizar directamente con CrediMóvil</a>{" "}
            o explorar las{" "}
            <Link href="/guias">guías de Finazo</Link>.
          </p>
        )}

        <h3>Ciudades que cubrimos en el cluster</h3>
        <ul>
          {SV_PRIMARY_CITIES.filter((c) => c.tier === 1).map((c) => (
            <li key={c.slug}>
              <strong>{c.nameEs}</strong> ({c.department}) — {c.marketNote}
            </li>
          ))}
        </ul>

        <h3>Variantes de búsqueda que cubrimos</h3>
        <ul>
          {SV_AUTO_FINANCE_INTENTS.map((i) => (
            <li key={i.slug}>
              <strong>{i.searchIntent}</strong> — {i.productReality}
            </li>
          ))}
        </ul>

        <h2>Preguntas frecuentes sobre préstamo por tu carro en El Salvador en 2026</h2>

        {PILLAR_FAQS.map((faq) => (
          <div key={faq.q}>
            <h3>{faq.q}</h3>
            <p>{faq.a}</p>
          </div>
        ))}

        <h2>Recursos relacionados</h2>
        <ul>
          <li>
            <Link href="/prestamos">
              Comparador de préstamos bancarios formales en El Salvador
            </Link>
          </li>
          <li>
            <Link href="/guias">Más guías financieras de Finazo</Link>
          </li>
          <li>
            <a
              href="https://www.defensoria.gob.sv"
              target="_blank"
              rel="noopener noreferrer"
            >
              Defensoría del Consumidor de El Salvador (defensoria.gob.sv)
            </a>{" "}
            — para denuncias y orientación gratuita
          </li>
          <li>
            <a
              href="https://ssf.gob.sv"
              target="_blank"
              rel="noopener noreferrer"
            >
              Superintendencia del Sistema Financiero (SSF)
            </a>{" "}
            — marco regulatorio del sistema financiero salvadoreño
          </li>
        </ul>
      </main>

      <Footer />
    </>
  );
}
