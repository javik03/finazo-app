import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Términos de Uso",
  description: "Términos y condiciones de uso de Finazo, comparador financiero para Centroamérica.",
  alternates: { canonical: "https://finazo.lat/terminos" },
  robots: { index: true, follow: false },
};

const LAST_UPDATED = "6 de abril de 2026";
const COMPANY = "MAQ UNO DOS TRES S.A. de C.V.";
const CONTACT_EMAIL = "legal@finazo.lat";

export default function TerminosPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <div className="mb-10">
        <Link href="/" className="text-sm text-emerald-600 hover:underline">
          ← Volver a Finazo
        </Link>
      </div>

      <h1 className="mb-2 text-3xl font-bold text-slate-900">
        Términos de Uso
      </h1>
      <p className="mb-10 text-sm text-slate-500">
        Última actualización: {LAST_UPDATED}
      </p>

      <div className="prose prose-slate max-w-none space-y-8 text-slate-700">

        <section>
          <h2 className="text-xl font-semibold text-slate-900">1. Aceptación de los términos</h2>
          <p>
            Al acceder y usar el sitio web <strong>finazo.lat</strong> (el
            &ldquo;Sitio&rdquo;), aceptas quedar vinculado por estos Términos de Uso. Si no
            estás de acuerdo con alguno de estos términos, te pedimos que no
            uses el Sitio. El Sitio es operado por{" "}
            <strong>{COMPANY}</strong>, sociedad constituida bajo las leyes de
            la República de El Salvador (&ldquo;Finazo&rdquo;, &ldquo;nosotros&rdquo; o &ldquo;nuestro&rdquo;).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">2. Naturaleza del servicio</h2>
          <p>
            Finazo es un <strong>comparador financiero independiente</strong>.
            El Sitio proporciona información comparativa sobre productos
            financieros como remesas, préstamos y seguros disponibles en
            Centroamérica.
          </p>
          <p>
            <strong>Finazo no es:</strong> un banco, institución financiera,
            aseguradora, prestamista, corredor de seguros ni asesor financiero
            regulado. No ofrecemos, intermediamos ni ejecutamos ningún producto
            financiero directamente.
          </p>
          <p>
            La información publicada en el Sitio tiene carácter{" "}
            <strong>informativo y referencial</strong>. Las tasas, comisiones y
            condiciones de los productos pueden cambiar sin previo aviso. Debes
            verificar siempre las condiciones actuales directamente con el
            proveedor del servicio antes de tomar cualquier decisión financiera.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">3. No es asesoría financiera</h2>
          <p>
            El contenido del Sitio, incluyendo artículos, guías, comparaciones
            y rankings, es de carácter <strong>educativo e informativo</strong>{" "}
            únicamente. Nada en este Sitio constituye asesoría financiera,
            legal, tributaria o de inversión.
          </p>
          <p>
            Antes de tomar decisiones financieras, te recomendamos consultar
            con un profesional calificado. Finazo no se hace responsable de
            las decisiones financieras que tomes con base en la información
            publicada en el Sitio.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">4. Exactitud de la información</h2>
          <p>
            Nos esforzamos por mantener la información actualizada y precisa.
            Las tasas de préstamos se obtienen de datos públicos de la
            Superintendencia del Sistema Financiero (SSF) de El Salvador. Las
            tasas de remesas se actualizan periódicamente mediante consultas
            automatizadas a los proveedores.
          </p>
          <p>
            Sin embargo, no garantizamos que la información sea completa,
            precisa o actualizada en todo momento. El Sitio se ofrece &ldquo;tal
            como está&rdquo; sin garantías de ningún tipo.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">5. Relaciones de afiliado</h2>
          <p>
            Finazo mantiene relaciones comerciales de afiliado con algunos de
            los proveedores de servicios financieros listados en el Sitio.
            Cuando haces clic en ciertos enlaces y contratas o solicitas un
            servicio, podemos recibir una compensación económica del proveedor.
          </p>
          <p>
            Esta compensación <strong>no influye en nuestras comparaciones,
            rankings ni evaluaciones</strong>. Todos los productos se evalúan
            objetivamente según sus características, tarifas y condiciones.
            Los enlaces de afiliado no generan ningún costo adicional para ti.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">6. Uso permitido</h2>
          <p>Puedes usar el Sitio para:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Consultar y comparar productos financieros para uso personal.</li>
            <li>Leer artículos y guías financieras.</li>
            <li>Dejar comentarios en artículos respetando las normas de convivencia.</li>
          </ul>
          <p>Queda prohibido:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Reproducir, copiar o distribuir el contenido del Sitio sin autorización escrita.</li>
            <li>Usar el Sitio para fines ilegales o fraudulentos.</li>
            <li>Realizar scraping automatizado del Sitio sin autorización previa.</li>
            <li>Publicar comentarios con contenido falso, difamatorio, ilegal o spam.</li>
            <li>Intentar acceder a áreas restringidas del Sitio.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">7. Comentarios de usuarios</h2>
          <p>
            Al publicar un comentario en el Sitio, confirmas que el contenido
            es verídico, no viola derechos de terceros y cumple con estos
            términos. Finazo se reserva el derecho de rechazar, moderar o
            eliminar cualquier comentario sin previo aviso.
          </p>
          <p>
            Los comentarios son revisados antes de publicarse. No publicamos
            comentarios con contenido ofensivo, spam, datos personales de
            terceros ni información falsa sobre productos financieros.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">8. Propiedad intelectual</h2>
          <p>
            Todo el contenido del Sitio — textos, artículos, guías, gráficos,
            logotipos y código — es propiedad de {COMPANY} o sus licenciantes
            y está protegido por las leyes de propiedad intelectual aplicables.
            Queda prohibida su reproducción total o parcial sin autorización
            escrita previa.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">9. Limitación de responsabilidad</h2>
          <p>
            En la máxima medida permitida por la ley aplicable, Finazo y{" "}
            {COMPANY} no serán responsables por:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Pérdidas financieras derivadas del uso de la información del Sitio.</li>
            <li>Inexactitudes o desactualizaciones en las tasas o condiciones publicadas.</li>
            <li>Interrupciones, errores o indisponibilidad del Sitio.</li>
            <li>Contenido de sitios web de terceros enlazados desde el Sitio.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">10. Enlaces a terceros</h2>
          <p>
            El Sitio contiene enlaces a sitios web de terceros (proveedores de
            remesas, bancos, aseguradoras). Estos enlaces se proporcionan por
            conveniencia y no implican que Finazo respalde o sea responsable
            del contenido, políticas o prácticas de esos sitios. Accedes a
            sitios de terceros bajo tu propio riesgo.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">11. Ley aplicable y jurisdicción</h2>
          <p>
            Estos términos se rigen por las leyes de la República de El
            Salvador. Cualquier controversia derivada del uso del Sitio se
            someterá a la jurisdicción de los tribunales competentes de San
            Salvador, El Salvador, renunciando expresamente a cualquier otro
            fuero que pudiera corresponder.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">12. Modificaciones</h2>
          <p>
            Finazo se reserva el derecho de modificar estos Términos en
            cualquier momento. Las modificaciones entrarán en vigor al momento
            de su publicación en el Sitio. El uso continuado del Sitio tras la
            publicación de cambios implica la aceptación de los mismos.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">13. Contacto</h2>
          <p>
            Para consultas sobre estos Términos de Uso:{" "}
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
