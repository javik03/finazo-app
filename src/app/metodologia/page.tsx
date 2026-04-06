import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Metodología",
  description:
    "Cómo Finazo compara y clasifica remesas, préstamos y seguros en Centroamérica. Fuentes de datos, criterios de ranking e independencia editorial.",
  alternates: { canonical: "https://finazo.lat/metodologia" },
  robots: { index: true, follow: true },
};

export default function MetodologiaPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <div className="mb-10">
        <Link href="/" className="text-sm text-emerald-600 hover:underline">
          ← Volver a Finazo
        </Link>
      </div>

      <h1 className="mb-2 text-3xl font-bold text-slate-900">
        Nuestra Metodología
      </h1>
      <p className="mb-10 text-sm text-slate-500">
        Cómo comparamos, clasificamos y actualizamos los datos en Finazo.
      </p>

      <div className="prose prose-slate max-w-none space-y-10 text-slate-700">

        <section>
          <h2 className="text-xl font-semibold text-slate-900">
            Principios fundamentales
          </h2>
          <p>
            Finazo es un comparador financiero independiente. Nuestro único
            objetivo es ayudarte a tomar la mejor decisión financiera posible.
            Por eso seguimos tres principios no negociables:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Independencia editorial:</strong> ningún banco, operadora
              de remesas ni aseguradora puede pagar para aparecer primero en
              nuestros rankings. Los resultados se ordenan siempre por el
              criterio más favorable para el usuario final.
            </li>
            <li>
              <strong>Transparencia de afiliados:</strong> Finazo puede recibir
              una comisión cuando haces clic en un enlace y contratas un
              servicio. Esto nunca afecta el orden ni la evaluación de los
              productos. Los enlaces de afiliado no generan ningún costo
              adicional para ti.
            </li>
            <li>
              <strong>Datos verificables:</strong> siempre indicamos la fuente
              de cada dato. Si no podemos verificar un dato de forma
              independiente, no lo publicamos.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">
            Remesas — cómo comparamos
          </h2>

          <h3 className="text-base font-semibold text-slate-800 mt-6 mb-2">
            Fuente de datos
          </h3>
          <p>
            Los datos de remesas se obtienen mediante consultas automatizadas
            diarias a las APIs y sitios web oficiales de cada proveedor:
            Remitly, Wise, Western Union, Xoom (PayPal), WorldRemit y
            MoneyGram. Los datos reflejan el costo real visible al usuario en
            el momento de la consulta.
          </p>

          <h3 className="text-base font-semibold text-slate-800 mt-6 mb-2">
            Criterio de ranking
          </h3>
          <p>
            Clasificamos los proveedores por{" "}
            <strong>costo total para una transferencia estándar de $200 USD</strong>.
            El costo total incluye:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Comisión de envío:</strong> tarifa fija o porcentual
              cobrada por el proveedor.
            </li>
            <li>
              <strong>Diferencial cambiario:</strong> diferencia entre el tipo
              de cambio aplicado y el tipo de cambio interbancario de
              referencia (mid-market rate). Esta es la ganancia oculta que
              muchos proveedores no muestran de forma prominente.

            </li>
          </ul>
          <p>
            Usamos $200 USD como monto estándar porque es la remesa promedio
            más frecuente en los corredores centroamericanos. A menor costo
            total, mejor posición en el ranking.
          </p>

          <h3 className="text-base font-semibold text-slate-800 mt-6 mb-2">
            Otros datos mostrados
          </h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Tiempo de entrega estimado (instantáneo / mismo día / 1-3 días).</li>
            <li>Métodos de entrega disponibles (depósito bancario, efectivo, wallet).</li>
            <li>Monto que recibirá el beneficiario en moneda local.</li>
          </ul>

          <h3 className="text-base font-semibold text-slate-800 mt-6 mb-2">
            Frecuencia de actualización
          </h3>
          <p>
            Los datos de remesas se actualizan <strong>diariamente</strong>.
            Las tasas cambian constantemente — te recomendamos verificar
            siempre el costo final directamente en el sitio del proveedor
            antes de realizar el envío.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">
            Préstamos — cómo comparamos
          </h2>

          <h3 className="text-base font-semibold text-slate-800 mt-6 mb-2">
            Fuente de datos
          </h3>
          <p>
            Las tasas de préstamos personales en El Salvador provienen de los{" "}
            <strong>reportes oficiales de la Superintendencia del Sistema
            Financiero (SSF)</strong>. La SSF publica mensualmente las tasas
            de interés de todos los bancos regulados. Esta es la fuente más
            confiable y objetiva disponible, ya que es la misma información
            que el regulador usa para supervisar el sistema bancario.
          </p>
          <p>
            Fuente directa:{" "}
            <a
              href="https://www.ssf.gob.sv"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 hover:underline"
            >
              www.ssf.gob.sv
            </a>
          </p>

          <h3 className="text-base font-semibold text-slate-800 mt-6 mb-2">
            Criterio de ranking
          </h3>
          <p>
            Clasificamos los bancos por{" "}
            <strong>Tasa Efectiva Anual (TEA)</strong>, no por la tasa nominal.
            La TEA incluye todos los cargos y comisiones asociadas al crédito,
            lo que permite una comparación real del costo del dinero entre
            diferentes instituciones. A menor TEA, menor costo real del
            préstamo.
          </p>

          <h3 className="text-base font-semibold text-slate-800 mt-6 mb-2">
            Otros datos mostrados
          </h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Tasa nominal anual.</li>
            <li>Monto máximo y mínimo del préstamo.</li>
            <li>Plazo mínimo y máximo en meses.</li>
            <li>Enlace directo a la página del banco para solicitar.</li>
          </ul>

          <h3 className="text-base font-semibold text-slate-800 mt-6 mb-2">
            Frecuencia de actualización
          </h3>
          <p>
            Los datos de préstamos se actualizan <strong>mensualmente</strong>,
            siguiendo el ciclo de publicación de la SSF.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">
            Artículos y guías
          </h2>
          <p>
            Los artículos y guías de Finazo son elaborados con base en datos
            verificados y revisados editorialmente. Cuando se utilizan datos de
            terceros, siempre se indica la fuente. Nuestros artículos tienen
            carácter <strong>informativo y educativo</strong> únicamente — no
            constituyen asesoría financiera.
          </p>
          <p>
            El contenido se actualiza cuando cambian los datos subyacentes o
            cuando detectamos información desactualizada. La fecha de última
            actualización aparece en cada artículo.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">
            Limitaciones importantes
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Las tasas de remesas varían en tiempo real. Los datos de Finazo
              reflejan el momento de la última actualización, no necesariamente
              el costo exacto en el momento de tu transferencia.
            </li>
            <li>
              Las tasas de préstamos son tasas de referencia publicadas por los
              bancos. La tasa final que ofrece un banco puede variar según el
              perfil crediticio del solicitante.
            </li>
            <li>
              Finazo no cubre todos los productos financieros disponibles en el
              mercado — nos enfocamos en los más relevantes para los usuarios
              centroamericanos.
            </li>
          </ul>
          <p>
            Siempre verifica las condiciones actuales directamente con el
            proveedor antes de tomar cualquier decisión financiera.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">
            Contacto y correcciones
          </h2>
          <p>
            Si encuentras un dato incorrecto o tienes dudas sobre nuestra
            metodología, escríbenos a{" "}
            <a
              href="mailto:legal@finazo.lat"
              className="text-emerald-600 hover:underline"
            >
              legal@finazo.lat
            </a>
            . Investigamos y corregimos errores en un plazo máximo de 5 días
            hábiles.
          </p>
        </section>

      </div>
    </main>
  );
}
