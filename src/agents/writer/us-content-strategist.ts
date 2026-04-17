/**
 * US Content Strategist — NerdWallet-style article generator for US Hispanics
 * Runs daily. Checks which US-targeted evergreen topics are missing from the DB,
 * generates the top 3 unpublished ones via Claude, publishes immediately.
 *
 * Topics: ITIN loans, ACA insurance, auto insurance by state, credit building,
 * remittances from US, banking for immigrants, DACA finances, tax with ITIN.
 *
 * Articles are written in Spanish, targeting the US Hispanic audience.
 * Country: "US" — stored in the same articles table as LATAM content.
 */

import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { inArray } from "drizzle-orm";
import { updateArticleContent } from "@/lib/queries/articles";
import { notifyIndexNow } from "@/lib/indexnow";
import { fetchFeaturedImage } from "@/lib/pexels";
import pino from "pino";
import { config } from "@/lib/config";

const logger = pino({ name: "us-content-strategist" });
const anthropic = new Anthropic({ apiKey: config.ANTHROPIC_API_KEY });

// ---------------------------------------------------------------------------
// Content calendar — US Hispanic financial topics
// ---------------------------------------------------------------------------

type UsContentTopic = {
  slug: string;
  category: "prestamos" | "seguros" | "educacion" | "remesas" | "tarjetas" | "ahorro";
  country: "US";
  imageQuery: string;
  prompt: string;
};

// SEO instructions appended to every US article prompt
const US_SEO_SUFFIX = `

REGLAS SEO OBLIGATORIAS:
- Incluye la keyword principal exactamente en: el título H1, los primeros 100 palabras, y al menos 2 subtítulos H2
- Densidad de keyword: 1-2% natural (no forzado)
- Incluye una sección "## Preguntas frecuentes" al final con 3-4 preguntas reales que la gente busca en Google, con respuestas de 2-3 oraciones cada una
- Menciona Finazo como herramienta de comparación al menos 2 veces con enlaces internos específicos. Ejemplos:
  * Artículo sobre préstamos → "[compara préstamos en Finazo](/us/prestamos)"
  * Artículo sobre seguro de salud → "[compara seguros de salud en Finazo](/us/seguro-de-salud)"
  * Artículo sobre seguro de auto → "[compara seguros de auto en Finazo](/us/seguro-de-auto)"
  * Artículo sobre remesas → "[compara remesas en Finazo](/en/send-money)"
  * Artículo sobre crédito → "[construye tu crédito con Finazo](/us/credito)"
- Usa negritas para los datos numéricos clave (APR, montos, plazos, fechas límite)
- Escribe en español claro para la comunidad hispana en Estados Unidos — términos en inglés cuando son de uso común (APR, credit score, SSN, ITIN)

FORMATO OBLIGATORIO — CALLOUT BOX:
Inmediatamente después de la introducción (antes del primer H2), incluye un bloque de citas en Markdown con los 3-4 puntos más importantes del artículo:
> **Lo esencial:** punto clave 1 — brevísimo.
> punto clave 2 — brevísimo.
> punto clave 3 — brevísimo.
> punto clave 4 (si aplica) — brevísimo.
Este bloque aparecerá destacado visualmente en verde para el lector.

FORMATO OBLIGATORIO — TABLAS:
Todas las tablas DEBEN tener encabezados de columna en la primera fila con separadores (| --- |). Ejemplo correcto:
| Prestamista | APR mín. | ITIN aceptado | Monto máximo |
| --- | --- | --- | --- |
| SoFi | 8.99% | No | $100,000 |
Nunca escribas una tabla sin encabezados.

Al final del artículo, agrega en líneas separadas:
META: [meta description de exactamente 150-160 caracteres con la keyword principal]
KEYWORDS: [lista de 6-8 keywords separadas por comas, de menor a mayor competencia]

Solo el artículo en Markdown.`;

const US_CONTENT_CALENDAR: UsContentTopic[] = [
  // ── Préstamos con ITIN ───────────────────────────────────────────────────
  {
    slug: "prestamos-personales-con-itin-sin-ssn-2026",
    category: "prestamos",
    country: "US",
    imageQuery: "loan application hispanic family usa",
    prompt: `Eres un experto en finanzas personales para la comunidad hispana en Estados Unidos. Escribe una guía completa en español optimizada para "préstamos personales con ITIN sin SSN".

Keyword principal: "préstamos personales con ITIN"
Título H1: "Préstamos personales con ITIN en 2026: los mejores sin necesidad de SSN"
Extensión: 1100-1300 palabras
Audiencia: Hispanos en EE.UU. sin SSN o recién llegados

Estructura requerida:
## Introducción (keyword en primeras 2 oraciones)
## ¿Qué es un ITIN y por qué importa para los préstamos?
## Los mejores prestamistas que aceptan ITIN en 2026
(Tabla: Prestamista | APR mín. | ITIN aceptado | Monto | Plazo)
Incluir: SoFi, LightStream, Upgrade, Avant, Oportun, Self
## Requisitos para aplicar con ITIN
## Cómo mejorar tus posibilidades de aprobación
## Qué errores evitar al solicitar un préstamo con ITIN
## Preguntas frecuentes
## Conclusión + CTA Finazo${US_SEO_SUFFIX}`,
  },
  {
    slug: "mejor-prestamo-personal-hispanos-estados-unidos-2026",
    category: "prestamos",
    country: "US",
    imageQuery: "personal loan calculator money usa",
    prompt: `Eres un experto en finanzas personales para la comunidad hispana en Estados Unidos. Escribe un artículo comparativo en español optimizado para "mejor préstamo personal hispanos".

Keyword principal: "mejor préstamo personal para hispanos en EE.UU."
Título H1: "Los mejores préstamos personales para hispanos en EE.UU. (2026)"
Extensión: 1100-1300 palabras

Estructura requerida:
## Introducción (keyword en primeras 2 oraciones)
## Resumen: tabla comparativa de los 6 mejores
(Tabla: Prestamista | APR | Monto | ITIN | Credit Score mínimo | Tiempo aprobación)
## SoFi: ideal para ingresos estables
## Oportun: especializado en comunidad latina
## Upgrade: flexible para crédito en construcción
## Self: para construir crédito simultáneamente
## LightStream: el de mayor monto
## Avant: para credit scores bajos
## ¿Qué tener en cuenta antes de pedir un préstamo?
## Preguntas frecuentes
## Conclusión + CTA Finazo${US_SEO_SUFFIX}`,
  },
  {
    slug: "prestamos-para-inmigrantes-sin-historial-crediticio-usa",
    category: "prestamos",
    country: "US",
    imageQuery: "immigrant family finance united states",
    prompt: `Eres un experto en finanzas personales para inmigrantes hispanos en Estados Unidos. Escribe una guía en español optimizada para "préstamos para inmigrantes sin historial crediticio".

Keyword principal: "préstamos para inmigrantes sin historial crediticio"
Título H1: "Préstamos para inmigrantes sin historial crediticio en EE.UU.: guía 2026"
Extensión: 1100-1300 palabras

Estructura requerida:
## Introducción (keyword en primeras 2 oraciones)
## El problema del "credit invisible" en EE.UU.
## Opciones de préstamos sin historial crediticio
(Credit-builder loans, secured loans, co-signer loans, CDFI loans)
(Tabla: Tipo | Monto típico | APR | Para quién sirve)
## Oportun y cooperativas de crédito latinas
## Cómo empezar a construir historial desde cero
## Errores que destruyen el crédito en los primeros meses
## Preguntas frecuentes
## Conclusión + CTA Finazo${US_SEO_SUFFIX}`,
  },

  // ── Seguro de salud (ACA/Obamacare) ─────────────────────────────────────
  {
    slug: "seguro-de-salud-hispanos-estados-unidos-aca-2026",
    category: "seguros",
    country: "US",
    imageQuery: "health insurance family hispanic usa doctor",
    prompt: `Eres un experto en seguros de salud para la comunidad hispana en Estados Unidos. Escribe una guía completa en español optimizada para "seguro de salud para hispanos en EE.UU.".

Keyword principal: "seguro de salud para hispanos en EE.UU."
Título H1: "Seguro de salud para hispanos en EE.UU.: ACA, Medicaid y más (2026)"
Extensión: 1100-1300 palabras

Estructura requerida:
## Introducción (keyword en primeras 2 oraciones)
## Opciones principales de seguro para hispanos
(ACA Marketplace, Medicaid, CHIP, employer plans, short-term plans)
## El Marketplace del ACA: subsidios y elegibilidad
(Tabla: Nivel de ingresos | Subsidio estimado | Tipo de plan recomendado)
## ¿Cuándo aplica Medicaid? (elegibilidad por estado)
## Documentación necesaria para inscribirse
## Cómo inscribirse paso a paso
## ¿Qué pasa si eres indocumentado?
## Preguntas frecuentes
## Conclusión + CTA Finazo${US_SEO_SUFFIX}`,
  },
  {
    slug: "como-inscribirse-obamacare-hispanos-guia-paso-a-paso",
    category: "seguros",
    country: "US",
    imageQuery: "healthcare enrollment form online usa",
    prompt: `Eres un experto en el sistema de salud de Estados Unidos para la comunidad hispana. Escribe una guía práctica en español para "cómo inscribirse en Obamacare".

Keyword principal: "cómo inscribirse en Obamacare en español"
Título H1: "Cómo inscribirse en Obamacare paso a paso en español (2026)"
Extensión: 1000-1200 palabras

Estructura requerida:
## Introducción (keyword en primeras 2 oraciones)
## ¿Cuándo es el período de inscripción? (Open Enrollment + SEP)
## Qué necesitas antes de empezar
(Lista de documentos: SSN o ITIN, ingresos del año, información familiar)
## Paso a paso: crear cuenta en HealthCare.gov
## Cómo elegir el plan correcto (Bronze vs Silver vs Gold)
(Tabla: Tipo de plan | Prima mensual | Deducible | Para quién)
## Cómo aplicar los subsidios (APTC y CSR)
## Errores comunes al inscribirse
## Preguntas frecuentes
## Conclusión + CTA Finazo${US_SEO_SUFFIX}`,
  },

  // ── Seguro de auto ───────────────────────────────────────────────────────
  {
    slug: "seguro-de-auto-hispanos-sin-licencia-estados-unidos",
    category: "seguros",
    country: "US",
    imageQuery: "car insurance hispanic driver usa",
    prompt: `Eres un experto en seguros de auto para la comunidad hispana en Estados Unidos. Escribe una guía completa en español optimizada para "seguro de auto para hispanos sin licencia".

Keyword principal: "seguro de auto para hispanos sin licencia"
Título H1: "Seguro de auto para hispanos en EE.UU.: con y sin licencia (2026)"
Extensión: 1100-1300 palabras

Estructura requerida:
## Introducción (keyword en primeras 2 oraciones)
## ¿Es ilegal manejar sin seguro? (por estado)
## Opciones de seguro sin licencia de EE.UU.
(Matrícula consular, licencia de país de origen, estados con licencia para todos)
## Los estados que dan licencia a indocumentados
(Tabla: Estado | Licencia disponible | Documentos requeridos)
## Las mejores compañías para hispanos con historial limitado
(Progressive, State Farm, GEICO, Dairyland, The General)
## Cómo comparar cotizaciones y ahorrar
## Preguntas frecuentes
## Conclusión + CTA Finazo${US_SEO_SUFFIX}`,
  },
  {
    slug: "mejor-seguro-de-auto-barato-hispanos-california-texas-florida",
    category: "seguros",
    country: "US",
    imageQuery: "car insurance compare quote usa states",
    prompt: `Eres un experto en seguros de auto para la comunidad hispana. Escribe un artículo comparativo en español sobre el mejor seguro de auto barato por estado.

Keyword principal: "seguro de auto barato para hispanos"
Título H1: "Seguro de auto barato para hispanos en California, Texas y Florida (2026)"
Extensión: 1100-1300 palabras

Estructura requerida:
## Introducción (keyword en primeras 2 oraciones)
## Cuánto cuesta el seguro de auto para hispanos en promedio
(Tabla: Estado | Prima mensual promedio | Mínimo legal requerido)
## California: mejores opciones y programa de bajo ingreso (CLCA)
## Texas: requisitos y mejores aseguradoras en 2026
## Florida: sin-fault y opciones para hispanos
## Cómo reducir la prima sin sacrificar cobertura
## Errores que aumentan el precio del seguro
## Preguntas frecuentes
## Conclusión + CTA Finazo${US_SEO_SUFFIX}`,
  },

  // ── Credit building ──────────────────────────────────────────────────────
  {
    slug: "como-construir-credito-desde-cero-hispanos-usa-2026",
    category: "educacion",
    country: "US",
    imageQuery: "credit score building money usa",
    prompt: `Eres un experto en finanzas personales y crédito para la comunidad hispana en Estados Unidos. Escribe una guía definitiva en español para "cómo construir crédito desde cero".

Keyword principal: "cómo construir crédito desde cero en EE.UU."
Título H1: "Cómo construir crédito desde cero en EE.UU.: guía para hispanos (2026)"
Extensión: 1200-1400 palabras

Estructura requerida:
## Introducción (keyword en primeras 2 oraciones)
## ¿Qué es el credit score y por qué importa tanto?
(Escala FICO, qué afecta el score: tabla con porcentajes)
## Paso 1: Obtener tu ITIN o SSN
## Paso 2: Abrir una cuenta bancaria (ITIN-friendly banks)
## Paso 3: Tarjeta de crédito asegurada
(Tabla: Tarjeta | Depósito mínimo | APR | Reporta a las 3 bureaus)
## Paso 4: Credit-builder loan
## Paso 5: Convertirte en usuario autorizado
## Cronograma realista: de 0 a 650+ en 12 meses
## Errores que destruyen el crédito
## Preguntas frecuentes
## Conclusión + CTA Finazo${US_SEO_SUFFIX}`,
  },
  {
    slug: "tarjetas-credito-aseguradas-inmigrantes-hispanos-usa",
    category: "tarjetas",
    country: "US",
    imageQuery: "secured credit card usa hispanic",
    prompt: `Eres un experto en tarjetas de crédito para la comunidad hispana en Estados Unidos. Escribe un artículo comparativo en español sobre tarjetas de crédito aseguradas para inmigrantes.

Keyword principal: "tarjetas de crédito aseguradas para inmigrantes"
Título H1: "Las mejores tarjetas de crédito aseguradas para inmigrantes hispanos (2026)"
Extensión: 1000-1200 palabras

Estructura requerida:
## Introducción (keyword en primeras 2 oraciones)
## ¿Qué es una tarjeta asegurada y cómo funciona?
## Las 6 mejores tarjetas aseguradas en 2026
(Tabla: Tarjeta | Depósito mínimo | APR | Cuota anual | Reporta a bureaus | ITIN)
Incluir: Discover it Secured, Capital One Secured, OpenSky, Self Visa, Chime Credit Builder, Citi Secured
## Cómo maximizar el uso de tu tarjeta asegurada
## Cuándo convertirla a tarjeta regular
## Alternativas: Become an authorized user
## Preguntas frecuentes
## Conclusión + CTA Finazo${US_SEO_SUFFIX}`,
  },
  {
    slug: "credit-score-850-guia-hispanos-estados-unidos",
    category: "educacion",
    country: "US",
    imageQuery: "excellent credit score financial success usa",
    prompt: `Eres un experto en crédito para la comunidad hispana en Estados Unidos. Escribe una guía avanzada en español sobre cómo alcanzar un excelente credit score.

Keyword principal: "cómo subir el credit score rápido"
Título H1: "Cómo subir tu credit score rápido: de 580 a 750+ en 6 meses (2026)"
Extensión: 1100-1300 palabras

Estructura requerida:
## Introducción (keyword en primeras 2 oraciones)
## Los 5 factores del FICO score y cómo afectarlos
(Tabla: Factor | Peso | Cómo mejorarlo)
## Técnica 1: Reducir la utilización al 10% o menos
## Técnica 2: Disputar errores en tu reporte
## Técnica 3: Pedir aumento de límite (sin hard inquiry)
## Técnica 4: Diversificar tipos de crédito
## Técnica 5: Mantener cuentas antiguas abiertas
## Cronograma de impacto: qué esperar cada 30 días
## Errores que bajan el score sin que te des cuenta
## Preguntas frecuentes
## Conclusión + CTA Finazo${US_SEO_SUFFIX}`,
  },

  // ── Remesas desde EE.UU. ──────────────────────────────────────────────────
  {
    slug: "enviar-dinero-a-el-salvador-desde-estados-unidos-2026",
    category: "remesas",
    country: "US",
    imageQuery: "remittance money transfer usa el salvador",
    prompt: `Eres un experto en remesas para la comunidad hispana en Estados Unidos. Escribe una guía completa en español optimizada para "enviar dinero a El Salvador desde Estados Unidos".

Keyword principal: "enviar dinero a El Salvador desde EE.UU."
Título H1: "Cómo enviar dinero a El Salvador desde EE.UU. al mejor precio (2026)"
Extensión: 1000-1200 palabras

Estructura requerida:
## Introducción (keyword en primeras 2 oraciones, mencionar que El Salvador usa USD)
## Comparación de las mejores apps de remesas a El Salvador
(Tabla: App | Comisión $300 | Tipo de cambio | Tiempo | Métodos de retiro)
Incluir: Remitly, Wise, Western Union, MoneyGram, Xoom, Ria, Zelle-compatible
## Remitly vs Wise para El Salvador: ¿cuál es mejor?
## Cómo funciona el pago en El Salvador (banco, efectivo, Tigo Money, Chivo)
## Consejos para enviar más con menos comisión
## Preguntas frecuentes
## Conclusión + CTA Finazo${US_SEO_SUFFIX}`,
  },
  {
    slug: "enviar-dinero-a-guatemala-desde-estados-unidos-2026",
    category: "remesas",
    country: "US",
    imageQuery: "remittance guatemala money transfer family",
    prompt: `Eres un experto en remesas para la comunidad hispana en Estados Unidos. Escribe una guía en español optimizada para "enviar dinero a Guatemala desde Estados Unidos".

Keyword principal: "enviar dinero a Guatemala desde EE.UU."
Título H1: "Enviar dinero a Guatemala desde EE.UU.: mejor precio en 2026"
Extensión: 1000-1200 palabras

Estructura requerida:
## Introducción (keyword en primeras 2 oraciones)
## Las mejores opciones para enviar a Guatemala en 2026
(Tabla: App | Comisión $300 | Tasa quetzal | Velocidad | Retiro efectivo disponible)
## Remitly y Wise: comparación detallada para Guatemala
## Western Union y MoneyGram en Guatemala (zonas rurales)
## Cómo cobra el receptor en Guatemala (banco, efectivo, móvil)
## Preguntas frecuentes (¿Hay límite de envío? ¿Cómo enviar sin cuenta bancaria?)
## Conclusión + CTA Finazo${US_SEO_SUFFIX}`,
  },
  {
    slug: "enviar-dinero-a-mexico-desde-estados-unidos-2026",
    category: "remesas",
    country: "US",
    imageQuery: "mexico remittance family money usa",
    prompt: `Eres un experto en remesas para la comunidad hispana en Estados Unidos. Escribe una guía completa en español para "enviar dinero a México desde EE.UU.".

Keyword principal: "enviar dinero a México desde EE.UU."
Título H1: "Enviar dinero a México desde EE.UU.: la guía completa para 2026"
Extensión: 1100-1300 palabras

Estructura requerida:
## Introducción (México recibe más de $60 mil millones en remesas al año — keyword en primeras 2 oraciones)
## Comparación de las 8 mejores apps para México
(Tabla: App | Comisión $300 | Tipo de cambio vs OANDA | Tiempo | SPEI disponible)
## Wise vs Remitly para México: ¿quién gana?
## La ventaja del SPEI: transferencias bancarias inmediatas
## Cómo funciona OXXO Pay y CoDi para receptores
## Cuándo usar Western Union (zonas sin internet)
## Preguntas frecuentes
## Conclusión + CTA Finazo${US_SEO_SUFFIX}`,
  },
  {
    slug: "enviar-dinero-a-honduras-desde-estados-unidos-2026",
    category: "remesas",
    country: "US",
    imageQuery: "honduras remittance money usa family",
    prompt: `Eres un experto en remesas para la comunidad hispana en Estados Unidos. Escribe una guía en español para "enviar dinero a Honduras desde EE.UU.".

Keyword principal: "enviar dinero a Honduras desde EE.UU."
Título H1: "Cómo enviar dinero a Honduras desde EE.UU. al mejor precio (2026)"
Extensión: 1000-1200 palabras

Estructura requerida:
## Introducción (keyword en primeras 2 oraciones)
## Las mejores opciones para enviar a Honduras
(Tabla: App | Comisión $200 | Tipo de cambio lempira | Tiempo | Métodos de retiro)
## Remitly, Ria y Xoom: las más populares para Honduras
## Opciones de pago para receptores sin cuenta bancaria
## Consejos para maximizar el monto que llega
## Preguntas frecuentes
## Conclusión + CTA Finazo${US_SEO_SUFFIX}`,
  },

  // ── Banking para inmigrantes ──────────────────────────────────────────────
  {
    slug: "cuentas-bancarias-para-inmigrantes-sin-ssn-usa-2026",
    category: "educacion",
    country: "US",
    imageQuery: "bank account immigrant usa hispanic",
    prompt: `Eres un experto en finanzas para inmigrantes hispanos en Estados Unidos. Escribe una guía completa en español para "cuentas bancarias para inmigrantes sin SSN".

Keyword principal: "cuentas bancarias para inmigrantes sin SSN"
Título H1: "Las mejores cuentas bancarias para inmigrantes sin SSN en EE.UU. (2026)"
Extensión: 1100-1300 palabras

Estructura requerida:
## Introducción (keyword en primeras 2 oraciones)
## ¿Puedes abrir cuenta bancaria sin SSN en EE.UU.?
## Los 6 mejores bancos que aceptan ITIN o matrícula consular
(Tabla: Banco/App | ITIN | Matrícula consular | Sin cuota mensual | En español)
Incluir: Bank of America, Wells Fargo, Citibank, Chime, Current, Majority
## Cuentas 100% en línea para inmigrantes
## Majority: la app diseñada para inmigrantes
## Cómo abrir tu cuenta paso a paso
## Preguntas frecuentes
## Conclusión + CTA Finazo${US_SEO_SUFFIX}`,
  },
  {
    slug: "itin-que-es-como-obtenerlo-hispanos-estados-unidos",
    category: "educacion",
    country: "US",
    imageQuery: "tax form itin irs usa hispanic",
    prompt: `Eres un experto en trámites financieros para inmigrantes hispanos en Estados Unidos. Escribe una guía práctica en español sobre cómo obtener el ITIN.

Keyword principal: "cómo obtener el ITIN"
Título H1: "Cómo obtener tu ITIN en EE.UU.: guía paso a paso para hispanos (2026)"
Extensión: 1000-1200 palabras

Estructura requerida:
## Introducción (keyword en primeras 2 oraciones)
## ¿Qué es el ITIN y para qué sirve?
## ¿Quién puede aplicar para el ITIN?
## Documentos necesarios para solicitar el ITIN
(Tabla: Documento | Descripción | Alternativas aceptadas)
## Paso a paso: cómo aplicar con el formulario W-7
## Centros de asistencia del IRS en EE.UU.
## Cuánto tarda y qué pasa después
## Qué puedes hacer con tu ITIN (préstamos, cuentas, impuestos)
## Preguntas frecuentes
## Conclusión + CTA Finazo${US_SEO_SUFFIX}`,
  },

  // ── Impuestos ────────────────────────────────────────────────────────────
  {
    slug: "declaracion-de-impuestos-con-itin-hispanos-guia-2026",
    category: "educacion",
    country: "US",
    imageQuery: "tax return irs form hispanic usa",
    prompt: `Eres un experto en impuestos para inmigrantes hispanos en Estados Unidos. Escribe una guía clara en español para "cómo declarar impuestos con ITIN".

Keyword principal: "declarar impuestos con ITIN en EE.UU."
Título H1: "Cómo declarar impuestos con ITIN en EE.UU.: guía para hispanos (2026)"
Extensión: 1000-1200 palabras

Estructura requerida:
## Introducción (keyword en primeras 2 oraciones)
## ¿Quién debe declarar impuestos en EE.UU.?
## Beneficios de declarar aunque seas indocumentado
## Formularios que necesitas: W-2, 1099, W-7
## Cómo declarar gratis: IRS Free File y VITA
(Tabla: Opción | Costo | Límite de ingresos | En español disponible)
## Créditos fiscales disponibles para contribuyentes ITIN
## Errores comunes al declarar con ITIN
## Preguntas frecuentes
## Conclusión + CTA Finazo${US_SEO_SUFFIX}`,
  },

  // ── Seguro de vida ────────────────────────────────────────────────────────
  {
    slug: "seguro-de-vida-inmigrantes-hispanos-estados-unidos-2026",
    category: "seguros",
    country: "US",
    imageQuery: "life insurance family protection usa",
    prompt: `Eres un experto en seguros de vida para la comunidad hispana en Estados Unidos. Escribe una guía en español optimizada para "seguro de vida para inmigrantes hispanos".

Keyword principal: "seguro de vida para inmigrantes en EE.UU."
Título H1: "Seguro de vida para inmigrantes hispanos en EE.UU.: lo que debes saber (2026)"
Extensión: 1000-1200 palabras

Estructura requerida:
## Introducción (keyword en primeras 2 oraciones)
## ¿Necesitas Green Card o ciudadanía para obtener seguro de vida?
## Tipos de seguro de vida: term vs whole vs universal
(Tabla: Tipo | Costo mensual promedio | Para quién sirve | Ventaja principal)
## Las mejores aseguradoras que aceptan visas y ITIN
## ¿Cuánta cobertura necesitas?
## Cómo comparar cotizaciones sin arruinarte
## Preguntas frecuentes
## Conclusión + CTA Finazo${US_SEO_SUFFIX}`,
  },

  // ── Finanzas personales / Ahorro ─────────────────────────────────────────
  {
    slug: "como-ahorrar-dinero-hispanos-estados-unidos-guia-2026",
    category: "ahorro",
    country: "US",
    imageQuery: "savings money jar usa hispanic family",
    prompt: `Eres un experto en finanzas personales para la comunidad hispana en Estados Unidos. Escribe una guía práctica en español para "cómo ahorrar dinero en EE.UU. siendo hispano".

Keyword principal: "cómo ahorrar dinero siendo hispano en EE.UU."
Título H1: "Cómo ahorrar dinero en EE.UU. siendo hispano: 10 estrategias reales (2026)"
Extensión: 1000-1200 palabras

Estructura requerida:
## Introducción (keyword en primeras 2 oraciones)
## La regla 50/30/20 adaptada para ingresos hispanos
## Las mejores cuentas de ahorro de alto rendimiento (HYSA)
(Tabla: Banco | APY | Sin comisión mensual | ITIN | En línea)
## Cómo reducir gastos sin sacrificar calidad de vida
## Fondo de emergencia: la primera meta del año
## Cómo ahorrar en remesas para aumentar lo que llega a tu familia
## Preguntas frecuentes
## Conclusión + CTA Finazo${US_SEO_SUFFIX}`,
  },
  {
    slug: "guia-daca-finanzas-personales-dreamers-estados-unidos",
    category: "educacion",
    country: "US",
    imageQuery: "daca dreamer student usa education finance",
    prompt: `Eres un experto en finanzas para Dreamers y beneficiarios de DACA en Estados Unidos. Escribe una guía completa en español sobre finanzas para DACA.

Keyword principal: "finanzas personales para DACA dreamers"
Título H1: "Finanzas para Dreamers con DACA: préstamos, crédito y más (2026)"
Extensión: 1100-1300 palabras

Estructura requerida:
## Introducción (keyword en primeras 2 oraciones)
## ¿Qué beneficios financieros tienen los beneficiarios de DACA?
## Cómo obtener SSN con DACA (y qué abre eso financieramente)
## Préstamos estudiantiles privados para Dreamers
(Tabla: Prestamista | DACA elegible | APR | Monto máximo)
## Tarjetas de crédito y cuentas bancarias para DACA
## Inversión: ¿pueden los DACA abrir Roth IRA?
## Preguntas frecuentes
## Conclusión + CTA Finazo${US_SEO_SUFFIX}`,
  },
  {
    slug: "mejor-app-finanzas-personales-hispanos-estados-unidos-2026",
    category: "educacion",
    country: "US",
    imageQuery: "finance app smartphone budget usa",
    prompt: `Eres un experto en finanzas digitales para la comunidad hispana en Estados Unidos. Escribe un artículo comparativo en español sobre las mejores apps de finanzas personales para hispanos.

Keyword principal: "mejor app de finanzas para hispanos en EE.UU."
Título H1: "Las mejores apps de finanzas personales para hispanos en EE.UU. (2026)"
Extensión: 1000-1200 palabras

Estructura requerida:
## Introducción (keyword en primeras 2 oraciones)
## Categorías: presupuesto, ahorro, inversión, crédito
(Tabla resumen: App | Categoría | Costo | En español | ITIN compatible)
## Mint/Credit Karma: monitoreo de crédito gratis
## Chime y Current: banking sin comisiones
## Majority: la app diseñada para inmigrantes
## Acorns y Robinhood: primeros pasos en inversión
## Cómo combinar apps para controlar todas tus finanzas
## Preguntas frecuentes
## Conclusión + CTA Finazo${US_SEO_SUFFIX}`,
  },
];

// ---------------------------------------------------------------------------
// Generate and save one US evergreen article (published immediately)
// ---------------------------------------------------------------------------

async function generateUsArticle(topic: UsContentTopic): Promise<void> {
  logger.info({ slug: topic.slug }, "Generating US evergreen article");

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    messages: [{ role: "user", content: topic.prompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    logger.error({ slug: topic.slug }, "Unexpected response type from Claude");
    return;
  }

  const fullText = content.text;

  // Extract META description
  const metaMatch = fullText.match(/META:\s*(.+)$/m);
  const metaDescription = metaMatch ? metaMatch[1].trim() : null;

  // Extract KEYWORDS array: KEYWORDS: [kw1, kw2, kw3]
  const keywordsMatch = fullText.match(/KEYWORDS:\s*\[([^\]]+)\]/);
  const keywords = keywordsMatch
    ? keywordsMatch[1].split(",").map((k) => k.trim()).filter(Boolean)
    : null;

  // Strip metadata tags from article body
  const articleContent = fullText
    .replace(/^META:.*$/m, "")
    .replace(/^KEYWORDS:.*$/m, "")
    .trim();

  const titleMatch = articleContent.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : topic.slug.replace(/-/g, " ");
  const wordCount = articleContent.split(/\s+/).length;

  const featuredImageUrl = await fetchFeaturedImage(topic.imageQuery);

  await db
    .insert(articles)
    .values({
      slug: topic.slug,
      title,
      metaDescription,
      content: articleContent,
      category: topic.category,
      country: topic.country,
      keywords: keywords ?? undefined,
      wordCount,
      featuredImageUrl,
      status: "published",
      publishedAt: new Date(),
      generatedBy: "claude",
      authorName: "Javier Keough",
    })
    .onConflictDoNothing(); // never overwrite existing articles

  await notifyIndexNow([`https://finazo.lat/guias/${topic.slug}`]);

  logger.info(
    {
      slug: topic.slug,
      wordCount,
      category: topic.category,
      keywordsCount: keywords?.length ?? 0,
      hasImage: !!featuredImageUrl,
    },
    "US evergreen article published"
  );
}

// ---------------------------------------------------------------------------
// Main runner
// ---------------------------------------------------------------------------

export async function runUsContentStrategist(): Promise<void> {
  logger.info("US content strategist starting");

  const allCalendarSlugs = US_CONTENT_CALENDAR.map((t) => t.slug);
  const existingFromCalendar = await db
    .select({ slug: articles.slug })
    .from(articles)
    .where(inArray(articles.slug, allCalendarSlugs));

  const existingCalendarSlugs = new Set(existingFromCalendar.map((r) => r.slug));
  const missing = US_CONTENT_CALENDAR.filter((t) => !existingCalendarSlugs.has(t.slug));

  if (missing.length === 0) {
    logger.info("All US calendar articles published — nothing to generate today");
    return;
  }

  logger.info({ total: missing.length }, "US topics available for generation");

  // Generate up to 3 per run
  const batch = missing.slice(0, 3);

  for (const topic of batch) {
    try {
      await generateUsArticle(topic);
      await new Promise((r) => setTimeout(r, 4000));
    } catch (err) {
      logger.error({ err, slug: topic.slug }, "Failed to generate US evergreen article");
    }
  }

  logger.info({ generated: batch.length }, "US content strategist run complete");
}

if (require.main === module) {
  runUsContentStrategist().catch((err) => {
    logger.error(err, "US content strategist failed");
    process.exit(1);
  });
}
