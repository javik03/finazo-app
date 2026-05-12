import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description: "Política de privacidad de Finazo. Cómo recopilamos, usamos y protegemos tus datos personales.",
  alternates: { canonical: "https://finazo.lat/privacidad" },
  robots: { index: true, follow: false },
};

const LAST_UPDATED = "6 de abril de 2026";
const COMPANY = "Finazo LLC";
const CONTACT_EMAIL = "legal@finazo.lat";

export default function PrivacidadPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <div className="mb-10">
        <Link href="/" className="text-sm text-emerald-600 hover:underline">
          ← Volver a Finazo
        </Link>
      </div>

      <h1 className="mb-2 text-3xl font-bold text-slate-900">
        Política de Privacidad
      </h1>
      <p className="mb-10 text-sm text-slate-500">
        Última actualización: {LAST_UPDATED}
      </p>

      <div className="prose prose-slate max-w-none space-y-8 text-slate-700">

        <section>
          <h2 className="text-xl font-semibold text-slate-900">1. Quiénes somos</h2>
          <p>
            Finazo es un comparador financiero independiente operado por{" "}
            <strong>{COMPANY}</strong>, sociedad constituida bajo las leyes de
            la República de El Salvador. Nuestro sitio web es{" "}
            <strong>finazo.lat</strong> y puedes contactarnos en{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-emerald-600 hover:underline">
              {CONTACT_EMAIL}
            </a>.
          </p>
          <p>
            Finazo no es un banco, institución financiera, aseguradora ni
            prestamista. Somos una plataforma de comparación que presenta
            información pública y datos de terceros para ayudar a los usuarios
            a tomar decisiones financieras informadas.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">2. Datos que recopilamos</h2>
          <p>Recopilamos únicamente los datos necesarios para operar el servicio:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Datos de uso:</strong> páginas visitadas, tiempo en el
              sitio, país de origen, tipo de dispositivo y navegador. Estos
              datos son anónimos y se procesan a través de Google Analytics 4.
            </li>
            <li>
              <strong>Comentarios en artículos:</strong> nombre, correo
              electrónico (opcional) y contenido del comentario, cuando el
              usuario decide dejar un comentario voluntariamente.
            </li>
            <li>
              <strong>Datos de navegación:</strong> dirección IP, cookies de
              sesión y preferencias de sitio. La IP se anonimiza antes de
              almacenarse.
            </li>
          </ul>
          <p>
            No recopilamos datos de identidad, documentos de identidad (DUI),
            información bancaria ni datos sensibles de ningún tipo.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">3. Cómo usamos tus datos</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Mejorar el contenido y la experiencia del sitio.</li>
            <li>Moderar y publicar comentarios de usuarios.</li>
            <li>Analizar el tráfico y el rendimiento de las páginas.</li>
            <li>Cumplir con obligaciones legales aplicables.</li>
          </ul>
          <p>
            No usamos tus datos para publicidad dirigida, perfiles de usuario
            ni toma de decisiones automatizada con efectos legales.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">4. Cookies</h2>
          <p>
            Utilizamos cookies estrictamente necesarias para el funcionamiento
            del sitio y cookies analíticas de Google Analytics 4 para medir el
            tráfico de forma agregada y anónima. No usamos cookies de
            publicidad ni rastreo de terceros.
          </p>
          <p>
            Puedes deshabilitar las cookies analíticas desde la configuración
            de tu navegador sin que esto afecte la funcionalidad del sitio.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">5. Divulgación de afiliados</h2>
          <p>
            Algunos enlaces en Finazo son enlaces de afiliado. Si haces clic en
            uno de estos enlaces y contratas o solicitas un servicio financiero,
            podemos recibir una comisión por parte del proveedor. Esta comisión
            no tiene ningún costo adicional para ti y <strong>nunca influye
            en nuestras comparaciones, rankings ni recomendaciones</strong>.
            Todos los productos se evalúan de forma independiente según sus
            tarifas, características y condiciones.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">6. Compartir datos con terceros</h2>
          <p>No vendemos ni comercializamos tus datos personales. Podemos compartir
          datos únicamente con:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Google Analytics 4:</strong> datos de uso anonimizados
              para análisis de tráfico. Consulta la{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 hover:underline"
              >
                política de privacidad de Google
              </a>.
            </li>
            <li>
              <strong>Proveedores de infraestructura:</strong> el sitio está
              alojado en servidores de Hetzner Online GmbH (Alemania), sujetos
              al RGPD europeo.
            </li>
            <li>
              <strong>Autoridades competentes:</strong> cuando sea requerido
              por ley o resolución judicial.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">7. Retención de datos</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Comentarios aprobados: conservados mientras el artículo esté publicado.</li>
            <li>Datos de Google Analytics: 14 meses (configuración predeterminada de GA4).</li>
            <li>Registros de servidor: máximo 90 días.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">8. Tus derechos</h2>
          <p>
            De conformidad con la Ley de Protección de Datos Personales de El
            Salvador y la normativa aplicable, tienes derecho a:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Acceso:</strong> saber qué datos tenemos sobre ti.</li>
            <li><strong>Rectificación:</strong> corregir datos inexactos.</li>
            <li><strong>Supresión:</strong> solicitar que eliminemos tus datos (atendido en un plazo máximo de 30 días).</li>
            <li><strong>Oposición:</strong> oponerte al tratamiento de tus datos.</li>
          </ul>
          <p>
            Para ejercer cualquiera de estos derechos, escríbenos a{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-emerald-600 hover:underline">
              {CONTACT_EMAIL}
            </a>{" "}
            indicando tu solicitud. Responderemos en un plazo máximo de 30 días hábiles.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">9. Seguridad</h2>
          <p>
            El sitio utiliza HTTPS con cifrado TLS. Los datos almacenados en
            base de datos están cifrados en reposo. Aplicamos medidas técnicas
            y organizativas razonables para proteger tus datos contra accesos
            no autorizados, pérdida o destrucción.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">10. Menores de edad</h2>
          <p>
            Finazo no está dirigido a menores de 18 años y no recopilamos
            conscientemente datos de menores. Si crees que hemos recopilado
            datos de un menor, contáctanos para eliminarlos de inmediato.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">11. Cambios a esta política</h2>
          <p>
            Podemos actualizar esta política ocasionalmente. La fecha de última
            actualización siempre aparecerá al inicio de esta página. El uso
            continuado del sitio tras una actualización implica la aceptación
            de los cambios.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">12. Contacto</h2>
          <p>
            Para cualquier consulta sobre esta política:{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-emerald-600 hover:underline">
              {CONTACT_EMAIL}
            </a>
            <br />
            {COMPANY}
            <br />
            República de El Salvador
          </p>
        </section>

      </div>
    </main>
  );
}
