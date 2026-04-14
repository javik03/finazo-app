import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Metodología | Cómo comparamos productos financieros",
  description:
    "Cómo Finazo compara préstamos, seguros y remesas para hispanos en EE.UU. y Centroamérica. Fuentes de datos, criterios de ranking e independencia editorial.",
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
        Cómo comparamos, clasificamos y actualizamos los datos en Finazo —
        tanto para hispanos en EE.UU. como para usuarios en Centroamérica.
      </p>

      <div className="prose prose-slate max-w-none space-y-10 text-slate-700">

        {/* ---------------------------------------------------------------- */}
        {/* Principios fundamentales                                          */}
        {/* ---------------------------------------------------------------- */}
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
              <strong>Independencia editorial:</strong> ningún banco, aseguradora
              ni proveedor puede pagar para aparecer primero en nuestros
              rankings. Los resultados se ordenan siempre por el criterio más
              favorable para el usuario final.
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

        {/* ---------------------------------------------------------------- */}
        {/* MERCADO EE.UU. — Préstamos personales                            */}
        {/* ---------------------------------------------------------------- */}
        <section>
          <h2 className="text-xl font-semibold text-slate-900">
            Préstamos personales en EE.UU. — cómo comparamos
          </h2>

          <h3 className="text-base font-semibold text-slate-800 mt-6 mb-2">
            Fuente de datos
          </h3>
          <p>
            Recopilamos los rangos de APR (Annual Percentage Rate) directamente
            desde los sitios oficiales de cada prestamista: SoFi, LightStream,
            Upgrade, Avant, OppFi, Self Financial y cooperativas de crédito
            seleccionadas. Complementamos con datos de la{" "}
            <strong>Consumer Financial Protection Bureau (CFPB)</strong> y
            reportes de la Federal Reserve sobre tasas de crédito al consumidor.
          </p>

          <h3 className="text-base font-semibold text-slate-800 mt-6 mb-2">
            Criterio de ranking
          </h3>
          <p>
            Clasificamos los prestamistas por{" "}
            <strong>APR mínimo publicado</strong> para el perfil de crédito más
            común entre hispanos (score 580-680). También consideramos:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Disponibilidad para ITIN (no solo SSN).</li>
            <li>Requisito mínimo de historial crediticio.</li>
            <li>Monto mínimo prestable (muchos requieren $5,000+).</li>
            <li>Rapidez de desembolso (mismo día vs. 3-5 días hábiles).</li>
          </ul>

          <h3 className="text-base font-semibold text-slate-800 mt-6 mb-2">
            Frecuencia de actualización
          </h3>
          <p>
            Los rangos de APR se actualizan <strong>semanalmente</strong>.
            La tasa final depende de tu historial crediticio individual —
            siempre verifica las condiciones actuales antes de solicitar.
          </p>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* MERCADO EE.UU. — Seguro de salud (ACA)                          */}
        {/* ---------------------------------------------------------------- */}
        <section>
          <h2 className="text-xl font-semibold text-slate-900">
            Seguro de salud en EE.UU. — cómo comparamos
          </h2>

          <h3 className="text-base font-semibold text-slate-800 mt-6 mb-2">
            Fuente de datos
          </h3>
          <p>
            Los planes del Mercado de Salud (ACA / Obamacare) provienen
            directamente de la{" "}
            <strong>API pública del Centers for Medicare &amp; Medicaid
            Services (CMS)</strong>. Esta es la misma fuente oficial que usa
            HealthCare.gov, lo que garantiza que los datos de primas,
            deducibles y redes de proveedores son los registrados
            oficialmente para cada estado y condado.
          </p>
          <p>
            Fuente directa:{" "}
            <a
              href="https://www.healthcare.gov/glossary/health-insurance-marketplace/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 hover:underline"
            >
              HealthCare.gov — Marketplace oficial
            </a>
          </p>

          <h3 className="text-base font-semibold text-slate-800 mt-6 mb-2">
            Criterio de ranking
          </h3>
          <p>
            Mostramos planes ordenados por{" "}
            <strong>prima mensual después de subsidios</strong> (basada en
            ingreso estimado), junto con:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Nivel de metal (Bronce / Plata / Oro / Platino).</li>
            <li>Deducible anual.</li>
            <li>Máximo de bolsillo anual (out-of-pocket maximum).</li>
            <li>Red de proveedores (HMO / PPO / EPO).</li>
          </ul>
          <p>
            Los planes Silver son el punto de referencia estándar porque
            califican para los subsidios de cost-sharing reduction (CSR),
            que reducen el deducible para hogares con ingresos bajos a moderados.
          </p>

          <h3 className="text-base font-semibold text-slate-800 mt-6 mb-2">
            Frecuencia de actualización
          </h3>
          <p>
            Los datos del Marketplace se actualizan anualmente al inicio de
            cada Open Enrollment Period (generalmente noviembre). Los precios
            intermedios pueden cambiar — siempre confirma en{" "}
            <a
              href="https://www.healthcare.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 hover:underline"
            >
              HealthCare.gov
            </a>{" "}
            antes de inscribirte.
          </p>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* MERCADO EE.UU. — Seguro de auto                                 */}
        {/* ---------------------------------------------------------------- */}
        <section>
          <h2 className="text-xl font-semibold text-slate-900">
            Seguro de auto en EE.UU. — cómo comparamos
          </h2>

          <h3 className="text-base font-semibold text-slate-800 mt-6 mb-2">
            Fuente de datos
          </h3>
          <p>
            Las primas promedio por estado provienen del{" "}
            <strong>National Association of Insurance Commissioners (NAIC)</strong>{" "}
            y reportes anuales de las comisiones estatales de seguros. Para
            tarifas de proveedores específicos, consultamos las tarifas
            publicadas de Progressive, GEICO, State Farm, Allstate, y
            aseguradoras con enfoque en la comunidad hispana como Dairyland
            y Nacional General.
          </p>

          <h3 className="text-base font-semibold text-slate-800 mt-6 mb-2">
            Criterio de ranking
          </h3>
          <p>
            Comparamos coberturas equivalentes para un perfil estándar:
            conductor de 30 años, auto 2019-2022, sin accidentes previos.
            Mostramos el costo anual estimado para:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Cobertura mínima requerida por el estado (liability only).</li>
            <li>Cobertura completa (comprehensive + collision).</li>
          </ul>
          <p>
            Factores como historial de manejo, código postal y modelo de
            vehículo cambian significativamente el precio final — usa nuestra
            comparación como referencia de rango, no como cotización exacta.
          </p>

          <h3 className="text-base font-semibold text-slate-800 mt-6 mb-2">
            Frecuencia de actualización
          </h3>
          <p>
            Los promedios estatales se actualizan <strong>trimestralmente</strong>.
            Las tarifas individuales varían — solicita cotizaciones directas
            para obtener el precio real.
          </p>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* MERCADO EE.UU. — Seguro de vida                                 */}
        {/* ---------------------------------------------------------------- */}
        <section>
          <h2 className="text-xl font-semibold text-slate-900">
            Seguro de vida en EE.UU. — cómo comparamos
          </h2>

          <h3 className="text-base font-semibold text-slate-800 mt-6 mb-2">
            Fuente de datos
          </h3>
          <p>
            Las tasas de seguro de vida a término (term life) provienen de
            tablas de cotización publicadas por Haven Life, Bestow, Ladder,
            Ethos y otras aseguradoras digitales. Estas empresas publican
            sus tasas de forma transparente, lo que permite comparación
            directa sin intermediarios.
          </p>

          <h3 className="text-base font-semibold text-slate-800 mt-6 mb-2">
            Criterio de ranking
          </h3>
          <p>
            Mostramos la prima mensual estimada para perfiles estándar:
            edad (25 / 35 / 45 años), no fumador, salud estándar, cobertura
            de $250,000 y $500,000 por 20 años. A menor prima por cada
            $1,000 de cobertura, mejor posición en el ranking.
          </p>

          <h3 className="text-base font-semibold text-slate-800 mt-6 mb-2">
            Frecuencia de actualización
          </h3>
          <p>
            Las tablas de tasas se actualizan <strong>mensualmente</strong>.
            La prima final depende de tu examen médico y clasificación de
            salud — los datos de Finazo son orientativos.
          </p>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* MERCADO LATAM — Remesas                                          */}
        {/* ---------------------------------------------------------------- */}
        <section>
          <h2 className="text-xl font-semibold text-slate-900">
            Remesas a Centroamérica — cómo comparamos
          </h2>

          <h3 className="text-base font-semibold text-slate-800 mt-6 mb-2">
            Fuente de datos
          </h3>
          <p>
            Los datos de remesas se obtienen mediante consultas automatizadas
            a las APIs y sitios web oficiales de cada proveedor: Remitly,
            Wise, Western Union, Xoom (PayPal), WorldRemit y MoneyGram.
            Los datos reflejan el costo real visible al usuario en el
            momento de la consulta.
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
              de cambio aplicado y el tipo de cambio interbancario de referencia
              (mid-market rate). Esta es la ganancia oculta que muchos
              proveedores no muestran de forma prominente.
            </li>
          </ul>
          <p>
            Usamos $200 USD porque es la remesa promedio más frecuente en los
            corredores centroamericanos. A menor costo total, mejor posición.
          </p>

          <h3 className="text-base font-semibold text-slate-800 mt-6 mb-2">
            Otros datos mostrados
          </h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Tiempo de entrega estimado (instantáneo / mismo día / 1-3 días).</li>
            <li>Métodos de entrega disponibles (bancario, efectivo, wallet).</li>
            <li>Monto que recibirá el beneficiario en moneda local.</li>
          </ul>

          <h3 className="text-base font-semibold text-slate-800 mt-6 mb-2">
            Frecuencia de actualización
          </h3>
          <p>
            Los datos de remesas se actualizan cada <strong>6 horas</strong>.
            Las tasas cambian constantemente — verifica siempre el costo final
            directamente en el sitio del proveedor antes de enviar.
          </p>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* MERCADO LATAM — Préstamos                                        */}
        {/* ---------------------------------------------------------------- */}
        <section>
          <h2 className="text-xl font-semibold text-slate-900">
            Préstamos en Centroamérica — cómo comparamos
          </h2>

          <h3 className="text-base font-semibold text-slate-800 mt-6 mb-2">
            Fuentes de datos por país
          </h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>El Salvador:</strong> reportes oficiales de la{" "}
              <a
                href="https://www.ssf.gob.sv"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 hover:underline"
              >
                Superintendencia del Sistema Financiero (SSF)
              </a>
              . Publica mensualmente las tasas de todos los bancos regulados.
            </li>
            <li>
              <strong>Guatemala:</strong>{" "}
              <a
                href="https://www.sib.gob.gt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 hover:underline"
              >
                Superintendencia de Bancos (SIB)
              </a>
              . Publica tasas activas y pasivas del sistema bancario.
            </li>
            <li>
              <strong>Honduras:</strong>{" "}
              <a
                href="https://www.cnbs.gob.hn"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 hover:underline"
              >
                Comisión Nacional de Bancos y Seguros (CNBS)
              </a>
              . Publica boletines mensuales de tasas de interés.
            </li>
          </ul>
          <p>
            Estas son las mismas fuentes que los reguladores usan para
            supervisar el sistema bancario — la información más confiable
            y objetiva disponible en cada país.
          </p>

          <h3 className="text-base font-semibold text-slate-800 mt-6 mb-2">
            Criterio de ranking
          </h3>
          <p>
            Clasificamos los bancos por{" "}
            <strong>Tasa Efectiva Anual (TEA)</strong>, no por la tasa nominal.
            La TEA incluye todos los cargos y comisiones asociados al crédito,
            lo que permite una comparación real del costo entre instituciones.
            A menor TEA, menor costo real del préstamo.
          </p>

          <h3 className="text-base font-semibold text-slate-800 mt-6 mb-2">
            Frecuencia de actualización
          </h3>
          <p>
            Los datos de préstamos se actualizan <strong>mensualmente</strong>,
            siguiendo el ciclo de publicación de cada regulador.
          </p>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Artículos y guías                                                */}
        {/* ---------------------------------------------------------------- */}
        <section>
          <h2 className="text-xl font-semibold text-slate-900">
            Artículos y guías
          </h2>
          <p>
            Los artículos y guías de Finazo son elaborados con base en datos
            verificados y revisados editorialmente. Cuando se utilizan datos de
            terceros, siempre se indica la fuente. Nuestros artículos tienen
            carácter <strong>informativo y educativo</strong> únicamente — no
            constituyen asesoría financiera, fiscal ni legal.
          </p>
          <p>
            El contenido se actualiza cuando cambian los datos subyacentes o
            cuando detectamos información desactualizada. La fecha de última
            actualización aparece en cada artículo.
          </p>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Limitaciones importantes                                         */}
        {/* ---------------------------------------------------------------- */}
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
              Los rangos de APR para préstamos en EE.UU. son rangos publicados
              por el prestamista. La tasa final depende de tu score crediticio,
              ingresos y otros factores individuales.
            </li>
            <li>
              Las primas de seguro de salud mostradas son estimaciones basadas
              en datos del CMS. El precio exacto puede variar según el condado,
              el plan seleccionado y tu nivel de ingreso.
            </li>
            <li>
              Las tasas de préstamos centroamericanos son tasas de referencia
              publicadas por los bancos. La tasa final puede variar según el
              perfil crediticio del solicitante.
            </li>
            <li>
              Finazo no cubre todos los productos financieros disponibles —
              nos enfocamos en los más relevantes para hispanos en EE.UU. y
              usuarios en Centroamérica.
            </li>
          </ul>
          <p>
            Siempre verifica las condiciones actuales directamente con el
            proveedor antes de tomar cualquier decisión financiera.
          </p>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Contacto y correcciones                                          */}
        {/* ---------------------------------------------------------------- */}
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
