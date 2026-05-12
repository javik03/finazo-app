import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/us/layout/Nav";
import { UsFooter } from "@/components/us/layout/UsFooter";
import { FloatingWA } from "@/components/us/layout/FloatingWA";
import { UsBreadcrumb } from "@/components/us/article/Breadcrumb";

export const metadata: Metadata = {
  title: "Términos de uso",
  description:
    "Términos de uso de Finazo.us. Reglas de propiedad intelectual, relación con socios afiliados, limitación de responsabilidad.",
  alternates: { canonical: "https://finazo.us/terminos" },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "12 de mayo de 2026";
const COMPANY = "Finazo LLC";
const CONTACT_EMAIL = "legal@finazo.us";

export default function TerminosPage(): React.ReactElement {
  return (
    <>
      <Nav currentPath="/terminos" />

      <main>
        <div className="us-sub-shell">
          <UsBreadcrumb
            crumbs={[{ label: "Inicio", href: "/" }, { label: "Términos" }]}
          />

          <header className="us-sub-hero">
            <div className="us-hero-kicker">Legal · Términos de uso</div>
            <h1 className="us-serif">Términos de uso de Finazo.us</h1>
            <p>
              Última actualización: {LAST_UPDATED}. Al usar finazo.us aceptás
              estos términos. Si no estás de acuerdo, no uses el sitio.
            </p>
          </header>

          <section className="us-sub-section">
            <div className="us-sub-section-head">
              <h2 className="us-serif">
                Quién opera <i>Finazo y bajo qué entidad</i>
              </h2>
            </div>
            <p>
              Finazo.us es operada por <strong>{COMPANY}</strong>, una entidad
              legal independiente. Cubierto y Hogares son{" "}
              <strong>socios afiliados</strong> con sus propias entidades
              legales y licencias — no son subsidiarias de Finazo ni Finazo es
              subsidiaria de ellas.
            </p>
          </section>

          <section className="us-sub-section">
            <div className="us-sub-section-head">
              <h2 className="us-serif">
                Naturaleza del <i>contenido — solo informativo</i>
              </h2>
            </div>
            <p>
              Todo el contenido publicado en Finazo es para fines informativos
              y educativos. Finazo NO presta asesoría financiera, de seguros,
              legal ni fiscal personalizada. Las afirmaciones y comparativas
              representan opinión editorial basada en datos públicos
              disponibles al momento de publicación.
            </p>
            <p>
              Las decisiones financieras que tomes después de leer Finazo son
              tuyas y bajo tu propia responsabilidad. Antes de actuar consultá
              con un profesional licenciado — agente de seguros con licencia
              estatal, broker hipotecario NMLS-registrado, CPA, Enrolled Agent,
              o abogado según la materia. Más detalles en el{" "}
              <Link href="/legal">disclaimer legal completo</Link>.
            </p>
          </section>

          <section className="us-sub-section">
            <div className="us-sub-section-head">
              <h2 className="us-serif">
                Propiedad intelectual y <i>uso permitido</i>
              </h2>
            </div>
            <p>
              El contenido editorial publicado en Finazo (artículos, guías,
              calculadoras, gráficos, layout) es propiedad de {COMPANY}. Podés
              compartir enlaces a artículos en redes sociales o referencias en
              tu propio sitio con atribución apropiada (&ldquo;según Finazo,
              finazo.us&rdquo;). NO podés republicar el contenido completo o
              sustancial sin permiso escrito previo. Las marcas &ldquo;Finazo&rdquo;,
              &ldquo;Cubierto&rdquo; y &ldquo;Hogares&rdquo; son propiedad de sus titulares
              respectivos.
            </p>
            <p>
              Las marcas de terceros mencionadas (Progressive, GEICO, State
              Farm, IRS, CFPB, NAIC, etc.) son propiedad de sus dueños. Su
              mención en Finazo es bajo fair-use editorial y no implica
              endoso, asociación ni patrocinio.
            </p>
          </section>

          <section className="us-sub-section">
            <div className="us-sub-section-head">
              <h2 className="us-serif">
                Relación con <i>socios afiliados</i>
              </h2>
            </div>
            <p>
              Finazo recibe comisiones de referido de Cubierto, Hogares, Wise,
              Remitly, Discover, Capital One, Chime, Self, Kikoff y otros
              partners listados en la{" "}
              <Link href="/legal">página de disclaimer legal</Link>. Esta
              divulgación cumple con el{" "}
              <strong>FTC 16 CFR § 255 (Endorsement Guides)</strong>.
            </p>
            <p>
              <strong>Vos no nos pagás nada</strong>. La comisión la paga el
              socio cuando contratás. La política editorial es independiente
              — el equipo de redacción no tiene cuotas ni comisiones por
              artículo. Si recomendamos al socio, es porque editorialmente
              creemos que es la mejor opción para el caso descrito; si no es
              la mejor para tu caso particular, lo decimos explícitamente.
            </p>
            <p>
              Cualquier disputa contractual con un socio (calidad de servicio,
              términos del producto, ejecución del trámite) es entre vos y el
              socio. Finazo no es parte del contrato. Para reclamos contra
              Cubierto contactá a la Florida Department of Financial Services;
              contra Hogares (post-MLO) al NMLS Consumer Access.
            </p>
          </section>

          <section className="us-sub-section">
            <div className="us-sub-section-head">
              <h2 className="us-serif">
                Limitación de <i>responsabilidad</i>
              </h2>
            </div>
            <p>
              El contenido se proporciona &ldquo;tal cual&rdquo; sin garantías de ningún
              tipo. En la máxima medida permitida por la ley aplicable,
              {" "}{COMPANY} no es responsable de daños directos, indirectos,
              incidentales, especiales, consecuentes ni punitivos derivados de
              tu uso del sitio o de decisiones tomadas basadas en el contenido,
              incluyendo (sin limitación) pérdidas financieras, costos legales,
              tiempo perdido, o daño reputacional.
            </p>
            <p>
              No garantizamos disponibilidad continua ni libre de errores del
              sitio. Podemos modificar, suspender o discontinuar cualquier
              sección sin aviso.
            </p>
          </section>

          <section className="us-sub-section">
            <div className="us-sub-section-head">
              <h2 className="us-serif">
                Conducta <i>prohibida</i>
              </h2>
            </div>
            <p>Al usar Finazo aceptás no:</p>
            <ul>
              <li>Hacer scraping automatizado masivo del contenido sin permiso</li>
              <li>Republicar artículos completos en otro sitio sin permiso</li>
              <li>Suplantar la identidad de Finazo o de cualquier socio afiliado</li>
              <li>
                Usar el sitio para violar leyes aplicables (incluyendo fraude
                financiero, lavado de dinero, evasión fiscal, etc.)
              </li>
              <li>Distribuir malware o intentar comprometer la seguridad del sitio</li>
            </ul>
          </section>

          <section className="us-sub-section">
            <div className="us-sub-section-head">
              <h2 className="us-serif">
                Ley aplicable y <i>jurisdicción</i>
              </h2>
            </div>
            <p>
              Estos términos se rigen por las leyes federales de EE.UU. y las
              leyes del estado donde {COMPANY} esté registrada al momento de
              cualquier disputa. Cualquier acción legal se resuelve en los
              tribunales competentes de esa jurisdicción.
            </p>
          </section>

          <section className="us-sub-section">
            <div className="us-sub-section-head">
              <h2 className="us-serif">
                Cambios a estos <i>términos</i>
              </h2>
            </div>
            <p>
              Podemos modificar estos términos. La fecha de &ldquo;Última
              actualización&rdquo; arriba refleja el cambio. Cambios sustanciales se
              anuncian en el footer del sitio durante 30 días. Si seguís usando
              el sitio después de la actualización, aceptás los términos
              nuevos.
            </p>
            <p>
              Contacto:{" "}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </p>
          </section>
        </div>
      </main>

      <UsFooter />
      <FloatingWA />
    </>
  );
}
