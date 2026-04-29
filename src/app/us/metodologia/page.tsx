import type { Metadata } from "next";
import { Nav } from "@/components/us/layout/Nav";
import { UsFooter } from "@/components/us/layout/UsFooter";
import { FloatingWA } from "@/components/us/layout/FloatingWA";
import { UsBreadcrumb } from "@/components/us/article/Breadcrumb";

export const metadata: Metadata = {
  title: "Metodología — cómo investigamos y comparamos",
  description:
    "Cómo Finazo investiga, evalúa y recomienda productos financieros para Hispanos en EE.UU. Fuentes, criterios y proceso editorial.",
  alternates: { canonical: "https://finazo.us/metodologia" },
};

export default function MetodologiaPage(): React.ReactElement {
  return (
    <>
      <Nav currentPath="/us/metodologia" />

      <main className="us-page-shell">
        <UsBreadcrumb
          crumbs={[
            { label: "Inicio", href: "/us" },
            { label: "Metodología" },
          ]}
        />

        <header className="us-article-head">
          <span className="us-article-cat">Acerca de Finazo</span>
          <h1 className="us-article-title us-serif">
            Cómo investigamos y comparamos.
          </h1>
          <p className="us-article-deck">
            Si vamos a recomendarte un producto financiero, queremos que sepas
            exactamente cómo llegamos a esa recomendación. Acá está el proceso.
          </p>
        </header>

        <div className="us-prose">
          <h2>Quién escribe en Finazo</h2>
          <p>
            Cada artículo tiene un autor real con nombre, foto y LinkedIn. No
            usamos pseudónimos ni autores ficticios. Nuestro equipo editorial
            está formado por personas que viven o han vivido en EE.UU. y han
            navegado el sistema financiero gringo en español. La firma siempre
            está al inicio del artículo y enlaza al perfil del autor.
          </p>

          <h2>Cómo elegimos los temas</h2>
          <p>
            Priorizamos preguntas reales que la comunidad Hispana hace en
            búsquedas, en grupos de Facebook, en Reddit y en las consultas que
            recibimos por WhatsApp. No escribimos sobre temas que solo
            interesan a los algoritmos — escribimos sobre lo que la gente
            necesita resolver.
          </p>

          <h2>Las fuentes que usamos</h2>
          <p>
            Las cifras y datos en cada artículo provienen de fuentes públicas
            verificables. Cuando citamos un dato lo enlazamos a su fuente
            original:
          </p>
          <ul>
            <li>
              <strong>Tasas de seguro de auto:</strong> filings de los
              Departamentos de Seguros estatales (DOI) — California DOI, Texas
              TDI, Florida OIR, etc.
            </li>
            <li>
              <strong>Tasas de hipoteca:</strong> Freddie Mac PMMS, FRED
              (Federal Reserve Economic Data) y publicaciones de wholesalers.
            </li>
            <li>
              <strong>Quejas de consumidor:</strong> base de datos de la
              Consumer Financial Protection Bureau (CFPB).
            </li>
            <li>
              <strong>Cobertura ACA / Medicaid:</strong> CMS.gov, HealthCare.gov
              y Kaiser Family Foundation.
            </li>
            <li>
              <strong>Datos fiscales (ITIN, W-7, deducciones):</strong> IRS.gov
              directamente.
            </li>
            <li>
              <strong>Tasas de cambio y comisiones de remesas:</strong>{" "}
              comparativas en vivo de Wise, Remitly, Western Union, MoneyGram y
              World Remit, actualizadas cada 6 horas.
            </li>
          </ul>

          <h2>Cómo recomendamos productos</h2>
          <p>
            Solo recomendamos productos que nuestro equipo ha probado o
            verificado directamente. Cuando decimos &ldquo;Cubierto te conecta
            con 8 aseguradoras&rdquo;, es porque hemos confirmado esa lista. Si
            no podemos verificar un dato, no lo publicamos.
          </p>
          <p>
            Cuando un producto no califica para nuestra recomendación —{" "}
            <em>aunque pague mejor comisión</em> — lo decimos. Eso incluye
            aseguradoras con altas tasas de queja, brokers con ofertas opacas,
            o apps de remesas con comisiones escondidas en el spread.
          </p>

          <h2>Cómo divulgamos comisiones</h2>
          <p>
            Finazo gana dinero cuando te conectamos con uno de nuestros socios
            (Cubierto para seguros, Hogares para hipotecas, o partners de
            remesas como Wise/Remitly). La aseguradora o el wholesaler nos paga
            una comisión de referido — <strong>nunca te cobramos a ti</strong>.
          </p>
          <p>
            Esa comisión se divulga en cada página donde recomendamos un
            producto. Si el producto que recomendamos no nos genera comisión
            (porque creemos que es la mejor opción para ti aunque no nos
            pague), también lo decimos.
          </p>

          <h2>Cómo manejamos los errores</h2>
          <p>
            Cuando un artículo tiene un error de datos, lo corregimos
            inmediatamente y agregamos una nota de corrección al pie. No
            silenciamos errores. Si encuentras uno, escríbenos a{" "}
            <a href="mailto:redaccion@finazo.us">redaccion@finazo.us</a>.
          </p>

          <h2>Frecuencia de actualización</h2>
          <p>
            Las guías evergreen (ITIN, W-7, cómo abrir cuenta, etc.) se revisan
            cada 6 meses. Las que dependen de tasas o regulación que cambia
            (hipoteca, seguros, ACA, remesas) se actualizan mensualmente o cada
            vez que la fuente subyacente cambia. La fecha de última
            actualización siempre está visible en el artículo.
          </p>

          <h2>Independencia editorial</h2>
          <p>
            Finazo es parte de Kornugle, el grupo que también opera Cubierto
            (agencia de seguros) y Hogares (broker de hipotecas). Nuestra
            política editorial garantiza que <strong>los artículos no se
            modifican para favorecer a los productos hermanos</strong>. Si
            Cubierto u Hogares no son la mejor opción para tu caso, lo decimos
            — y te explicamos cuál sí lo es.
          </p>

          <h2>Cómo verificamos al equipo editorial</h2>
          <p>
            Cada autor en Finazo tiene una página propia con su biografía,
            áreas de cobertura y enlace a su LinkedIn público. Puedes
            verificar credenciales y trayectoria directamente. Si publicamos
            algo sobre un tema que está fuera del área de un autor, lo
            indicamos al inicio del artículo.
          </p>

          <hr />

          <p>
            <em>
              Última revisión: abril de 2026. Si tienes preguntas sobre cómo
              cubrimos algo, escríbenos.
            </em>
          </p>
        </div>
      </main>

      <UsFooter />
      <FloatingWA />
    </>
  );
}
