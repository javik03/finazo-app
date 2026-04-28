import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/us/layout/Nav";
import { UsFooter } from "@/components/us/layout/UsFooter";
import { FloatingWA } from "@/components/us/layout/FloatingWA";
import { UsBreadcrumb } from "@/components/us/article/Breadcrumb";
import { getAllUsAuthors } from "@/lib/queries/us-articles";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Acerca de Finazo — el equipo editorial",
  description:
    "Quiénes están detrás de Finazo, qué publicamos y por qué — la publicación de finanzas independiente para Hispanos en EE.UU.",
  alternates: { canonical: "https://finazo.us/acerca" },
};

export default async function AcercaPage(): Promise<React.ReactElement> {
  const authors = await getAllUsAuthors().catch(() => []);

  return (
    <>
      <Nav currentPath="/us/acerca" />

      <main className="us-page-shell">
        <UsBreadcrumb
          crumbs={[{ label: "Inicio", href: "/us" }, { label: "Acerca" }]}
        />

        <header className="us-article-head">
          <span className="us-article-cat">Acerca de Finazo</span>
          <h1 className="us-article-title us-serif">
            La publicación que faltaba.
          </h1>
          <p className="us-article-deck">
            Finazo es una publicación independiente de finanzas en español para
            la comunidad Hispana en EE.UU. Nos lee gente que paga seguro, manda
            remesas, abre cuentas con ITIN, califica para hipotecas non-QM, y
            todo lo demás que el banco de la esquina explica en inglés y en
            letra de 8 puntos.
          </p>
        </header>

        <div className="us-prose">
          <h2>Por qué existimos</h2>
          <p>
            Hay 62 millones de Hispanos en Estados Unidos. La mayoría usa
            productos financieros — seguro de auto, transferencias a casa,
            tarjetas de crédito, hipotecas — pero la información disponible
            está casi toda en inglés, escrita para un público que ya conoce el
            sistema, y sesgada por quién pagó la página.
          </p>
          <p>
            Finazo cubre esa brecha. Explicamos cómo funcionan los productos en
            español claro, comparamos opciones con datos públicos verificables,
            y cuando recomendamos un servicio, lo hacemos con divulgación
            completa de cómo nos paga.
          </p>

          <h2>Qué publicamos</h2>
          <ul>
            <li>
              <strong>Guías evergreen</strong> sobre seguros, hipotecas,
              remesas, crédito, taxes y banca para Hispanos en EE.UU.
            </li>
            <li>
              <strong>Comparativos</strong> entre productos con números
              actualizados — Wise vs Remitly, qué aseguradoras aceptan ITIN,
              cuál wholesaler tiene mejor non-QM, etc.
            </li>
            <li>
              <strong>Alertas</strong> cuando hay noticias regulatorias que
              afectan a la comunidad (cambios en ACA, brechas de datos en
              aseguradoras, nuevos programas estatales).
            </li>
            <li>
              <strong>Boletín semanal</strong> en WhatsApp y email los lunes
              con un resumen de la semana.
            </li>
          </ul>

          <h2>Cómo nos financiamos</h2>
          <p>
            Finazo gana dinero a través de comisiones de referido cuando
            conectamos lectores con socios verificados:
          </p>
          <ul>
            <li>
              <strong>Cubierto</strong> — agencia de seguros (parte de
              Kornugle, licencia FL pendiente). Cuando un lector cotiza con
              Cubierto, la aseguradora paga comisión a Cubierto.
            </li>
            <li>
              <strong>Hogares</strong> — broker hipotecario (parte de Kornugle,
              NMLS pendiente). Cuando cierra un préstamo, el wholesaler paga
              comisión.
            </li>
            <li>
              <strong>Wise, Remitly, Western Union</strong> y otros partners de
              remesas — afiliados con divulgación pública.
            </li>
          </ul>
          <p>
            <strong>Nunca cobramos al lector.</strong> Y nuestra política
            editorial está separada de la financiera — los artículos no se
            modifican para favorecer a los socios pagados. Si el banco gringo
            tradicional es mejor que nuestros socios para tu caso, lo decimos.
          </p>

          <h2>El equipo editorial</h2>
          {authors.length === 0 && (
            <p>
              <em>
                Cargando el equipo… Si esto persiste, escríbenos a
                redaccion@finazo.us.
              </em>
            </p>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "24px",
              margin: "24px 0 32px",
            }}
          >
            {authors.map((author) => (
              <Link
                key={author.slug}
                href={`/us/autor/${author.slug}`}
                className="us-related-item"
                style={{ alignItems: "flex-start", textDecoration: "none" }}
              >
                <div
                  className="us-author-avatar"
                  style={{ width: 56, height: 56, fontSize: 22 }}
                >
                  {author.displayName.charAt(0)}
                </div>
                <div>
                  <div
                    className="us-related-item-title"
                    style={{ fontSize: 17, fontWeight: 600 }}
                  >
                    {author.displayName}
                  </div>
                  {author.bioShort && (
                    <p
                      style={{
                        fontSize: 13,
                        color: "var(--us-ink-2)",
                        marginTop: 6,
                        marginBottom: 0,
                        lineHeight: 1.5,
                      }}
                    >
                      {author.bioShort}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>

          <h2>Estructura corporativa</h2>
          <p>
            Finazo es una marca editorial de <strong>Kornugle</strong> (entidad
            legal: <em>MAQ UNO DOS TRES S.A. DE C.V.</em>), el grupo que opera
            las marcas hermanas Cubierto y Hogares. La política editorial es
            independiente de la operación comercial — el equipo de redacción no
            tiene cuotas de venta ni comisiones por artículo publicado.
          </p>

          <h2>Cómo contactarnos</h2>
          <ul>
            <li>
              <strong>Redacción / errores en artículos:</strong>{" "}
              <a href="mailto:redaccion@finazo.us">redaccion@finazo.us</a>
            </li>
            <li>
              <strong>Soporte para Cubierto / Hogares:</strong> WhatsApp{" "}
              <a href="https://wa.me/13055551234">+1 (305) 555-1234</a>
            </li>
            <li>
              <strong>Prensa y partnerships:</strong>{" "}
              <a href="mailto:press@finazo.us">press@finazo.us</a>
            </li>
          </ul>

          <hr />

          <p>
            <em>
              Esta página se actualiza cuando cambian el equipo, la estructura
              corporativa o la política editorial. Última revisión: abril de
              2026.
            </em>
          </p>
        </div>
      </main>

      <UsFooter />
      <FloatingWA />
    </>
  );
}
