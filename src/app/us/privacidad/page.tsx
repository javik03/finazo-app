import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/us/layout/Nav";
import { UsFooter } from "@/components/us/layout/UsFooter";
import { FloatingWA } from "@/components/us/layout/FloatingWA";
import { UsBreadcrumb } from "@/components/us/article/Breadcrumb";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Cómo Finazo LLC recopila, usa y protege tus datos personales. Cobertura de privacy laws estatales (CCPA / CPRA / VCDPA / TDPSA y otras).",
  alternates: { canonical: "https://finazo.us/privacidad" },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "12 de mayo de 2026";
const COMPANY = "Finazo LLC";
const CONTACT_EMAIL = "legal@finazo.us";

export default function PrivacidadPage(): React.ReactElement {
  return (
    <>
      <Nav currentPath="/privacidad" />

      <main>
        <div className="us-sub-shell">
          <UsBreadcrumb
            crumbs={[{ label: "Inicio", href: "/" }, { label: "Privacidad" }]}
          />

          <header className="us-sub-hero">
            <div className="us-hero-kicker">Legal · Privacidad</div>
            <h1 className="us-serif">Política de privacidad</h1>
            <p>
              Última actualización: {LAST_UPDATED}. Esta política explica qué
              datos recopila {COMPANY} cuando visitás finazo.us, cómo los
              usamos, con quién los compartimos, y qué derechos tenés bajo las
              leyes estatales de privacidad de EE.UU. (CCPA / CPRA en
              California, VCDPA en Virginia, CPA en Colorado, TDPSA en Texas,
              UCPA en Utah, CTDPA en Connecticut, y otras leyes estatales
              vigentes en 2026).
            </p>
          </header>

          <section className="us-sub-section">
            <div className="us-sub-section-head">
              <h2 className="us-serif">
                Quiénes somos y <i>qué somos legalmente</i>
              </h2>
            </div>
            <p>
              Finazo es una publicación independiente de finanzas personales
              operada por <strong>{COMPANY}</strong>. No somos un banco, una
              aseguradora, un broker hipotecario, ni un asesor financiero
              licenciado. Somos editores. Para más detalles, leé el{" "}
              <Link href="/legal">disclaimer legal completo</Link>.
            </p>
          </section>

          <section className="us-sub-section">
            <div className="us-sub-section-head">
              <h2 className="us-serif">
                Qué información <i>recopilamos</i>
              </h2>
            </div>
            <h3>Datos que vos nos das directamente</h3>
            <ul>
              <li>
                <strong>Email</strong> cuando te suscribís al newsletter, hacés
                una pregunta por contacto, o pedís corrección de un artículo.
              </li>
              <li>
                <strong>Mensajes por WhatsApp</strong> cuando hacés clic en un
                CTA y abrís un hilo con Carmen (Cubierto) o Sofía (Hogares).
                Los mensajes se manejan en la app de WhatsApp; Finazo no los
                guarda en su DB.
              </li>
              <li>
                <strong>Información que compartas con socios afiliados</strong>{" "}
                (Cubierto, Hogares, Wise, etc.) cuando hagas clic a través de
                un enlace de Finazo. Esa data está sujeta a la política de
                privacidad del socio, no a la de Finazo.
              </li>
            </ul>

            <h3>Datos recopilados automáticamente</h3>
            <ul>
              <li>
                <strong>Logs de servidor</strong> — dirección IP, tipo de
                browser, OS, URLs visitadas, referrer, timestamps. Retenidos
                90 días para análisis de seguridad y debugging.
              </li>
              <li>
                <strong>Cookies y similares</strong> — usamos cookies de sesión
                para preferencias (idioma, región) y cookies analíticas
                first-party para entender qué artículos son útiles. No usamos
                cookies de tracking publicitario.
              </li>
              <li>
                <strong>Pixel de Meta</strong> cuando aplique (campañas
                específicas) — para medir conversiones de tráfico pagado.
                Podés bloquearlo con tu configuración de privacidad de Meta o
                con un ad-blocker.
              </li>
            </ul>
          </section>

          <section className="us-sub-section">
            <div className="us-sub-section-head">
              <h2 className="us-serif">
                Cómo <i>usamos tus datos</i>
              </h2>
            </div>
            <ul>
              <li>Para operar finazo.us (servir páginas, prevenir abuso, hacer debugging)</li>
              <li>Para responder a tus mensajes y correcciones</li>
              <li>Para enviar el newsletter si te suscribiste (con opt-out en cada email)</li>
              <li>Para medir tráfico y mejorar el contenido editorial</li>
              <li>Para conectarte con socios afiliados cuando vos lo iniciás (haciendo clic en un CTA)</li>
            </ul>
            <p>
              <strong>NO vendemos tus datos personales</strong>. NO compartimos
              tus datos con terceros para que ellos te hagan marketing.
              Compartimos solamente cuando vos iniciás la conexión (ej.
              hablás con Cubierto vía nuestro link).
            </p>
          </section>

          <section className="us-sub-section">
            <div className="us-sub-section-head">
              <h2 className="us-serif">
                Servicios de terceros que usamos para <i>operar el sitio</i>
              </h2>
            </div>
            <ul>
              <li>
                <strong>Hosting</strong> — servidor en Hetzner Cloud (Alemania
                con instancias en EE.UU.). Los logs se procesan en EE.UU.
              </li>
              <li>
                <strong>Anthropic Claude API</strong> — para generación de
                contenido editorial. NO le mandamos tus datos personales al
                modelo; solo briefs editoriales.
              </li>
              <li>
                <strong>Pexels</strong> — imágenes stock para artículos. No
                comparte data personal contigo.
              </li>
              <li>
                <strong>WhatsApp (Meta)</strong> — los CTAs abren WhatsApp con
                un mensaje pre-llenado. Tu conversación está sujeta a la
                política de WhatsApp/Meta. Finazo no recibe copia del hilo.
              </li>
              <li>
                <strong>Google Search Console + Bing Webmaster + IndexNow</strong>
                {" "}— para verificar indexación. No comparten datos
                personales identificables sobre vos como visitante.
              </li>
            </ul>
          </section>

          <section className="us-sub-section">
            <div className="us-sub-section-head">
              <h2 className="us-serif">
                Tus <i>derechos según ley estatal</i>
              </h2>
            </div>
            <p>
              Si sos residente de California, Virginia, Colorado, Connecticut,
              Utah, Texas, Oregon, Montana, Tennessee, o cualquier otro estado
              con ley de privacidad vigente en 2026, tenés los siguientes
              derechos:
            </p>
            <ul>
              <li>
                <strong>Derecho a saber</strong> — pedirnos qué información
                personal tenemos sobre vos.
              </li>
              <li>
                <strong>Derecho a corregir</strong> — pedirnos corregir
                información incorrecta.
              </li>
              <li>
                <strong>Derecho a eliminar</strong> — pedirnos borrar tu
                información personal (con excepciones razonables como logs de
                seguridad).
              </li>
              <li>
                <strong>Derecho a no-discriminación</strong> — no te negamos
                servicio por ejercer tus derechos de privacidad.
              </li>
              <li>
                <strong>Derecho a portabilidad</strong> — recibir copia de tu
                información en formato legible por máquina.
              </li>
              <li>
                <strong>Derecho a opt-out del &ldquo;sale or sharing&rdquo;</strong> — no
                vendemos ni compartimos para marketing dirigido, pero podés
                confirmarlo escribiéndonos.
              </li>
            </ul>
            <p>
              Para ejercer cualquiera de estos derechos, escribí a{" "}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> con el
              asunto &ldquo;Solicitud de privacidad&rdquo;. Respondemos en menos de 45
              días según lo exigen las leyes estatales aplicables.
            </p>
          </section>

          <section className="us-sub-section">
            <div className="us-sub-section-head">
              <h2 className="us-serif">
                Retención y <i>seguridad de datos</i>
              </h2>
            </div>
            <p>
              Mantenemos los datos personales solo el tiempo que sea necesario
              para los propósitos descritos arriba. Logs de servidor: 90 días.
              Emails de newsletter: hasta que te des de baja. Información de
              correcciones editoriales: hasta que la corrección se aplique +
              30 días.
            </p>
            <p>
              Usamos cifrado TLS/HTTPS para todas las transmisiones, y los
              datos en reposo están en servidores con acceso restringido por
              SSH key. Nunca pedimos información altamente sensible (SSN,
              ITIN, número de tarjeta) en formularios de Finazo.
            </p>
          </section>

          <section className="us-sub-section">
            <div className="us-sub-section-head">
              <h2 className="us-serif">
                Cambios a esta <i>política</i>
              </h2>
            </div>
            <p>
              Si modificamos esta política sustancialmente, actualizamos la
              fecha de &ldquo;Última actualización&rdquo; arriba y avisamos en el footer
              del sitio durante 30 días. La versión vigente siempre es la
              publicada acá.
            </p>
            <p>
              Preguntas:{" "}
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
