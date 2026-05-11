import type { Metadata } from "next";
import { Nav } from "@/components/us/layout/Nav";
import { UsFooter } from "@/components/us/layout/UsFooter";
import { FloatingWA } from "@/components/us/layout/FloatingWA";
import { UsBreadcrumb } from "@/components/us/article/Breadcrumb";

export const metadata: Metadata = {
  title: "Estándares editoriales — Finazo",
  description:
    "Las reglas que sigue Finazo: precisión, independencia, divulgación de comisiones, manejo de fuentes, política de IA y de correcciones.",
  alternates: { canonical: "https://finazo.us/estandares-editoriales" },
};

export default function EstandaresPage(): React.ReactElement {
  return (
    <>
      <Nav currentPath="/estandares-editoriales" />

      <main className="us-page-shell">
        <UsBreadcrumb
          crumbs={[
            { label: "Inicio", href: "/" },
            { label: "Estándares editoriales" },
          ]}
        />

        <header className="us-article-head">
          <span className="us-article-cat">Acerca de Finazo</span>
          <h1 className="us-article-title us-serif">
            Estándares editoriales.
          </h1>
          <p className="us-article-deck">
            Las reglas que seguimos — y por las que puedes pedirnos cuentas.
          </p>
        </header>

        <div className="us-prose">
          <h2>1. Precisión por encima de velocidad</h2>
          <p>
            Si tenemos que elegir entre publicar una guía con un dato no
            verificado o esperar 24 horas más para confirmarlo,{" "}
            <strong>esperamos</strong>. Una cifra incorrecta en una página
            financiera puede costarle dinero a un lector. Eso es inaceptable.
          </p>

          <h2>2. Toda cifra cita su fuente</h2>
          <p>
            Cualquier número, porcentaje, fecha o regulación citada en Finazo
            debe enlazar a su fuente original (sitio gubernamental, paper
            académico, dataset público). Si la fuente no es accesible
            públicamente, lo declaramos.
          </p>

          <h2>3. Independencia editorial</h2>
          <p>
            Las recomendaciones editoriales no están condicionadas por
            comisiones. Si una alternativa pagada peor es mejor para el
            lector, esa es la que recomendamos. Esto incluye casos en que
            recomendamos productos que <strong>no</strong> generan comisión
            para Finazo.
          </p>

          <h2>4. Divulgación de comisiones</h2>
          <p>
            Cada página que recomienda un producto pagado incluye una
            divulgación visible al pie:
          </p>
          <ul>
            <li>Quién paga la comisión (la aseguradora, el wholesaler, etc.)</li>
            <li>Si el lector paga algo extra (en el 99% de los casos: no)</li>
            <li>La relación corporativa con Cubierto / Hogares (parte de Kornugle)</li>
          </ul>

          <h2>5. Política de uso de IA</h2>
          <p>
            Algunas guías son redactadas inicialmente con asistencia de IA
            (Claude). Eso no significa que sean &ldquo;contenido AI sin
            revisión&rdquo;. Toda guía pasa por:
          </p>
          <ul>
            <li>Revisión editorial humana (redactor + editor)</li>
            <li>Validación de cifras contra la fuente original</li>
            <li>Edición de tono para asegurar que suene como Finazo, no como un asistente genérico</li>
            <li>Adición de datos primarios (tablas, comparativos) que ningún modelo pudo inventar</li>
          </ul>
          <p>
            Cuando un artículo es 100% redactado por humano sin asistencia de
            IA, lo indicamos al pie. Cuando es asistido por IA y editado por
            humano, también.
          </p>

          <h2>6. Política de correcciones</h2>
          <p>
            Si publicamos algo incorrecto, lo corregimos en menos de 24 horas
            de detectarlo y agregamos una nota de corrección visible al pie del
            artículo con la fecha del cambio y qué se corrigió. No reescribimos
            silenciosamente.
          </p>
          <p>
            Si el error fue material (un número equivocado en una recomendación
            financiera), notificamos a los suscriptores del boletín en la
            siguiente edición.
          </p>

          <h2>7. No engañamos al lector</h2>
          <p>Algunas reglas concretas:</p>
          <ul>
            <li>No usamos titulares clickbait que prometen lo que el artículo no entrega</li>
            <li>No ocultamos comisiones en spreads o &ldquo;tasas de cambio mejoradas&rdquo;</li>
            <li>No comparamos solo los productos que nos pagan</li>
            <li>No inventamos &ldquo;mejor banco para…&rdquo; rankings sin metodología clara</li>
            <li>No reciclamos contenido viejo con fecha actualizada falsa</li>
          </ul>

          <h2>8. Fuentes anónimas</h2>
          <p>
            Si una fuente pide anonimato (por ejemplo, un broker que comparte
            estructuras de comisión confidenciales), lo respetamos pero lo
            indicamos en el artículo: &ldquo;según un broker hipotecario de
            Florida que pidió no ser nombrado&rdquo;. Nunca atribuimos a
            &ldquo;fuentes&rdquo; sin contexto.
          </p>

          <h2>9. Conflictos de interés</h2>
          <p>
            Si un autor tiene un interés económico en un producto del que
            escribe (ej. inversión, empleo previo en una aseguradora citada),
            lo divulga al inicio del artículo. Si el conflicto es material, no
            le asignamos esa cobertura.
          </p>

          <h2>10. Respuesta a la comunidad</h2>
          <p>
            Las preguntas y comentarios de lectores se responden en menos de 48
            horas hábiles. Si la pregunta revela un vacío en una guía, la
            actualizamos. La comunidad nos hace mejor.
          </p>

          <hr />

          <p>
            <em>
              Última revisión: abril de 2026. Para reportar errores o sugerir
              cambios a estos estándares: <a href="mailto:redaccion@finazo.us">redaccion@finazo.us</a>.
            </em>
          </p>
        </div>
      </main>

      <UsFooter />
      <FloatingWA />
    </>
  );
}
