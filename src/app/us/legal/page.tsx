import type { Metadata } from "next";
import { Nav } from "@/components/us/layout/Nav";
import { UsFooter } from "@/components/us/layout/UsFooter";
import { FloatingWA } from "@/components/us/layout/FloatingWA";
import { UsBreadcrumb } from "@/components/us/article/Breadcrumb";

export const metadata: Metadata = {
  title: "Disclaimer legal — información, no asesoría",
  description:
    "Finazo publica contenido informativo sobre finanzas personales. No somos asesores legales, fiscales ni financieros. Lee el disclaimer completo antes de tomar decisiones financieras.",
  alternates: { canonical: "https://finazo.us/legal" },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "12 de mayo de 2026";

export default function LegalPage(): React.ReactElement {
  return (
    <>
      <Nav currentPath="/legal" />

      <main>
        <div className="us-sub-shell">
          <UsBreadcrumb
            crumbs={[{ label: "Inicio", href: "/" }, { label: "Disclaimer legal" }]}
          />

          <header className="us-sub-hero">
            <div className="us-hero-kicker">Legal · Información, no asesoría</div>
            <h1 className="us-serif">
              Disclaimer legal de Finazo
            </h1>
            <p>
              Última actualización: {LAST_UPDATED}. Esta página explica los
              límites de lo que Finazo es y lo que Finazo no es, qué
              jurisdicciones regulan el contenido que publicamos, y qué hacer
              cuando necesités asesoría licenciada en vez de información
              editorial.
            </p>
          </header>

          <section className="us-sub-section">
            <div className="us-sub-section-head">
              <h2 className="us-serif">
                Solo <i>para fines informativos</i>
              </h2>
            </div>
            <p>
              Todo el contenido publicado por Finazo en finazo.us — incluyendo
              artículos, guías, comparativos, calculadoras, herramientas y
              cualquier material descargable — es exclusivamente para fines
              informativos y educativos. Finazo es una <strong>publicación
              independiente de finanzas personales</strong>, no una firma de
              asesoría financiera, ni de seguros, ni legal, ni fiscal.
            </p>
            <p>
              <strong>Nada de lo que leas en este sitio constituye asesoría
              personalizada</strong>. Las recomendaciones generales que hacemos
              (por ejemplo, &ldquo;Discover it Secured suele ser una buena tarjeta
              para construir crédito desde cero&rdquo;) son afirmaciones editoriales
              basadas en datos públicos disponibles al momento de la
              publicación, no consejos financieros adaptados a tu situación.
            </p>
            <p>
              Antes de tomar cualquier decisión financiera —contratar un
              seguro, aplicar a una hipoteca, abrir una cuenta de crédito,
              declarar impuestos, mandar remesas, etc.—{" "}
              <strong>consultá con un profesional licenciado en tu estado</strong>
              {" "}que pueda evaluar tu situación específica y darte una
              recomendación personalizada.
            </p>
          </section>

          <section className="us-sub-section">
            <div className="us-sub-section-head">
              <h2 className="us-serif">
                No somos <i>asesores financieros, legales ni fiscales</i>
              </h2>
            </div>
            <p>Específicamente:</p>
            <ul>
              <li>
                <strong>Finazo no es un asesor de inversiones registrado</strong>{" "}
                ante la SEC ni ante reguladores estatales bajo el Investment
                Advisers Act of 1940. No damos consejos sobre acciones, bonos,
                fondos mutuos, criptomonedas, planes de retiro ni cualquier
                otro vehículo de inversión.
              </li>
              <li>
                <strong>Finazo no es un broker o agente de seguros licenciado</strong>{" "}
                directamente. Cubierto (cubierto.ai), nuestro socio afiliado,
                opera con licencias propias. Finazo solamente refiere lectores
                a brokers licenciados; la cotización, emisión y servicio de
                pólizas corresponde al broker.
              </li>
              <li>
                <strong>Finazo no es un originador hipotecario licenciado</strong>.
                Hogares (cuando esté operativo) será un broker hipotecario con
                NMLS propio. Finazo refiere lectores; el préstamo es emitido
                por el wholesaler con todas las protecciones TILA / RESPA / NMLS
                aplicables.
              </li>
              <li>
                <strong>Finazo no es un preparador de impuestos licenciado</strong>.
                El contenido sobre ITIN, Form W-7, créditos fiscales, Child Tax
                Credit, etc. es educativo. Para preparación de impuestos usá un
                CPA, Enrolled Agent del IRS, o un Acceptance Agent autorizado.
              </li>
              <li>
                <strong>Finazo no es un abogado de inmigración</strong>. Aunque
                publicamos contenido sobre elegibilidad ACA por estatus
                migratorio, FAFSA con ITIN, mixed-status households, etc., eso
                no constituye asesoría legal. Para situaciones migratorias
                consultá con un abogado de inmigración o un representante
                acreditado por el BIA (Board of Immigration Appeals).
              </li>
            </ul>
          </section>

          <section className="us-sub-section">
            <div className="us-sub-section-head">
              <h2 className="us-serif">
                Datos, fuentes y <i>exactitud al momento de publicación</i>
              </h2>
            </div>
            <p>
              Citamos fuentes públicas autoritativas en cada artículo cuando
              hacemos afirmaciones factuales: IRS.gov para impuestos, CFPB.gov
              para crédito y remesas, Healthcare.gov y CMS.gov para ACA, NAIC
              y los departamentos estatales de seguros (Florida OIR, California
              DOI, Texas TDI) para datos de seguros, FRED y Freddie Mac PMMS
              para tasas de mortgage. Las tasas, primas, umbrales fiscales y
              elegibilidades cambian constantemente —{" "}
              <strong>el dato que ves en un artículo refleja la realidad al
              momento de publicación o de la última actualización</strong>{" "}
              (visible en el encabezado de cada guía).
            </p>
            <p>
              Si encontrás una cifra desactualizada o un error factual,
              avisanos a redaccion@finazo.us y publicamos una corrección.
              Aplicamos las correcciones de manera transparente — no
              modificamos el contenido en silencio.
            </p>
          </section>

          <section className="us-sub-section">
            <div className="us-sub-section-head">
              <h2 className="us-serif">
                Relaciones de afiliado y <i>cómo nos financiamos</i>
              </h2>
            </div>
            <p>
              Finazo gana comisiones de referido cuando conectamos lectores con
              socios afiliados:
            </p>
            <ul>
              <li>
                <strong>Cubierto</strong> (cubierto.ai) — agencia de seguros
                licenciada, socio afiliado independiente. Cuando un lector
                cotiza con Cubierto y contrata, la aseguradora paga comisión a
                Cubierto; Cubierto comparte una porción con Finazo por el
                referido.
              </li>
              <li>
                <strong>Hogares</strong> — broker hipotecario, socio afiliado
                independiente (próximamente operativo). Mismo modelo de
                referido cuando cierra un préstamo.
              </li>
              <li>
                <strong>Wise, Remitly, Western Union, MoneyGram, Xoom</strong>{" "}
                y otros — afiliados de remesas, todos con divulgación pública.
              </li>
              <li>
                <strong>Discover, Capital One, Chime, Self, Kikoff, OpenSky</strong>{" "}
                — afiliados de tarjetas de crédito y credit-builder.
              </li>
              <li>
                <strong>The Zebra, Insurify</strong> — comparadores nacionales
                de seguros, usados como fallback cuando Cubierto no opera en el
                estado del lector.
              </li>
            </ul>
            <p>
              <strong>Nunca te cobramos a vos</strong>. La comisión la paga el
              socio. Esta divulgación está hecha conforme al{" "}
              <strong>FTC 16 CFR § 255 (Endorsement Guides)</strong>: cada
              recomendación incluye divulgación clara y prominente cerca del
              endorsement. La política editorial está separada de la operación
              comercial — los autores no tienen cuotas de venta ni comisiones
              por artículo.
            </p>
          </section>

          <section className="us-sub-section">
            <div className="us-sub-section-head">
              <h2 className="us-serif">
                Estructura corporativa de <i>Finazo y socios afiliados</i>
              </h2>
            </div>
            <p>
              Finazo es operada por <strong>Finazo LLC</strong>, una entidad
              legal independiente. <strong>Cubierto y Hogares son socios
              afiliados</strong> con sus propias entidades legales, licencias
              regulatorias y responsabilidades — <em>no son subsidiarias ni
              parte del mismo grupo corporativo que Finazo</em>. La relación es
              estrictamente afiliada: Finazo refiere lectores, los socios pagan
              comisión por contrataciones cerradas.
            </p>
            <p>
              Cualquier reclamación derivada del producto de un socio
              (calidad del servicio de Cubierto, términos de un préstamo
              emitido vía Hogares, ejecución de una transacción de remesa
              vía Wise, etc.) debe dirigirse a la entidad correspondiente, no
              a Finazo. Finazo es responsable únicamente del contenido
              editorial y de la transparencia de la divulgación afiliada.
            </p>
          </section>

          <section className="us-sub-section">
            <div className="us-sub-section-head">
              <h2 className="us-serif">
                Limitación de responsabilidad y <i>uso bajo tu propio riesgo</i>
              </h2>
            </div>
            <p>
              El contenido de Finazo se publica &ldquo;tal cual&rdquo; (<em>as is</em>) y
              sin garantías de ningún tipo, expresas o implícitas, incluyendo
              pero no limitado a garantías de exactitud, integridad, idoneidad
              para un propósito particular, o no infracción. En la mayor
              medida permitida por la ley aplicable,{" "}
              <strong>Finazo LLC no es responsable</strong> de daños directos,
              indirectos, incidentales, especiales, consecuentes o punitivos
              resultantes de tu uso del sitio o del contenido — incluyendo
              decisiones financieras tomadas basadas en la información
              publicada.
            </p>
          </section>

          <section className="us-sub-section">
            <div className="us-sub-section-head">
              <h2 className="us-serif">
                Contacto y <i>jurisdicción</i>
              </h2>
            </div>
            <p>
              Preguntas legales: <a href="mailto:legal@finazo.us">legal@finazo.us</a>
              <br />
              Correcciones editoriales:{" "}
              <a href="mailto:redaccion@finazo.us">redaccion@finazo.us</a>
            </p>
            <p>
              Cualquier disputa relacionada con este sitio se resuelve bajo las
              leyes de los Estados Unidos y del estado donde Finazo LLC esté
              registrada al momento de la disputa. Para reportar contenido
              factualmente incorrecto sobre carriers de seguros, contactar al{" "}
              <a
                href="https://content.naic.org/cis_consumer_information.htm"
                target="_blank"
                rel="noopener noreferrer"
              >
                NAIC Consumer Information Source
              </a>{" "}
              o al departamento de seguros de tu estado.
            </p>
          </section>
        </div>
      </main>

      <UsFooter />
      <FloatingWA />
    </>
  );
}
