/**
 * US Content Calendar — topic registry for the strategist.
 * Headline strategy: plain Spanish first ("sin Social Security"),
 * ITIN as secondary mention. Targets US Hispanic queries.
 *
 * Each topic specifies its preferred author by primary expertise so the
 * byline rotation stays editorially coherent.
 */

export type UsAuthorSlug = "javier-keough" | "sabrina-keough";

export type UsContentTopic = {
  slug: string;
  category: "prestamos" | "seguros" | "educacion" | "remesas" | "tarjetas" | "ahorro";
  imageQuery: string;
  preferredAuthor: UsAuthorSlug;
  prompt: string;
  /** Marks this topic as a high-impact homepage seed candidate. */
  homepageSeed?: boolean;
  /**
   * Per-topic overrides for the quality gate. Glossary topics can drop the
   * comparison-table requirement and lower the word-count floor; competitor-
   * alternative pages can raise it. Defaults: minWordCount=1200, table required.
   */
  qualityGate?: {
    minWordCount?: number;
    allowMissingTable?: boolean;
    allowMissingCallout?: boolean;
  };
  /**
   * Structured geo / cohort context — persists to articles.templateVariables
   * (jsonb) on insert. Read by resolveArticleGeo() to bypass slug parsing.
   * Optional: legacy topics without this still work via slug parsing.
   */
  templateVariables?: {
    stateSlug?: string;
    city?: string;
    cohort?: string;
    intent?: string;
    competitor?: string;
  };
};

// ─── Shared SEO + E-E-A-T suffix appended to every prompt ──────────────────

export const US_SEO_SUFFIX = `

═══════════════════════════════════════════════════════════════════════════
COMPLIANCE EDITORIAL — APLICA A TODO ARTÍCULO QUE MENCIONE ASEGURADORAS
(reglas no-negociables; el quality gate rechaza la publicación si fallan)
═══════════════════════════════════════════════════════════════════════════

Si este artículo discute, compara o menciona aseguradoras de auto/salud/vida/hogar
(Progressive, GEICO, State Farm, Allstate, Esurance, Direct General, Infinity,
Fred Loya, Estrella, Confie, Acceptance, Bristol West, Windhaven, Ocean Harbor,
o cualquier otra), las siguientes 4 reglas son OBLIGATORIAS:

1. **CFPB NO aplica a seguros.** Por Dodd-Frank § 1027(f), el Consumer Financial
   Protection Bureau NO tiene jurisdicción sobre la industria de seguros. Las
   quejas de seguros se registran en los Departamentos de Seguros estatales
   (DOIs) y se agregan vía NAIC (National Association of Insurance
   Commissioners) en su Consumer Information Source.
   - URL correcta: https://content.naic.org/cis_consumer_information.htm
   - Para Florida: https://www.floir.com
   - Para California: https://www.insurance.ca.gov
   - NUNCA citar consumerfinance.gov ni "CFPB" como fuente de datos de quejas
     de aseguradoras. Hacerlo es factualmente incorrecto y expone a Finazo a
     reclamos Lanham Act § 43(a) y FDUTPA.
   - Encabezados como "Servicio al cliente y reputación CFPB" → reescribir a
     "Servicio al cliente y quejas registradas (NAIC complaint index)".

2. **Toda afirmación específica sobre una aseguradora nombrada** (sobre precios,
   underwriting, aceptación de ITIN/SSN, requisitos de crédito, velocidad de
   reclamos, calidad de servicio, app, proceso de citas) DEBE seguir uno de
   estos dos patrones:
   - **Patrón A (fuente)**: "Según [fuente nombrada con año], [afirmación]".
     Ej: "Según el NAIC complaint index para 2024, Progressive tuvo un índice de
     1.23, lo que indica más quejas que el promedio del sector."
   - **Patrón B (hedge)**: empezar el párrafo con uno de — "En nuestra experiencia
     ayudando a conductores hispanos...", "Según reportes de usuarios en
     [forum]...", "Anecdóticamente...", "Hemos observado que...".
   - NUNCA presentar como hecho plano: "Progressive recibe X quejas", "GEICO es
     más restrictiva con ITIN", "State Farm rechaza a conductores sin crédito",
     "Fred Loya cobra de más", etc. Esos patrones son los que crean exposición
     Lanham Act.

3. **Cifras de precios** (primas anuales o mensuales) deben incluir SIEMPRE las
   tres cosas:
   - **Fuente nombrada** con año (Bankrate, ValuePenguin, NerdWallet, The Zebra,
     Insurance Information Institute iii.org, o state DOI rate filing).
   - **Calificador geográfico** (national average, o por estado específico).
   - **Rango**, no un solo número plano.
   - Ejemplo VÁLIDO: "Según el reporte ValuePenguin 2024, las primas anuales para
     cobertura completa van desde $1,440 en Carolina del Norte hasta $3,240 en
     Florida; GEICO tiende a estar en el extremo bajo del rango en la mayoría
     de los estados."
   - Ejemplo INVÁLIDO: "GEICO: $1,740/año".
   - Si no tenés números sustentables al momento de escribir, reemplazá el número
     específico con una afirmación cualitativa ("GEICO tiende a ser más barata
     para perfiles con buen crédito; Progressive suele ser más competitiva para
     conductores nuevos") y eliminá el número.

4. **Divulgación de afiliado** — NO incluyas un callout de divulgación dentro
   del artículo. La divulgación afiliada vive en la página de Disclaimer Legal
   ([/legal](/legal)) y en el footer persistente del sitio (patrón NerdWallet).
   Mencionar a Cubierto u Hogares en el cuerpo está bien, pero NO escribas
   "> **Divulgación:**..." ni equivalentes en el artículo — eso satura al lector
   y duplica innecesariamente lo que ya está en el footer + /legal.

═══════════════════════════════════════════════════════════════════════════

REGLAS GEO / WELTER — DISCIPLINA DE ENCABEZADOS (obligatorio, bloquea publicación si falla):
Google y los motores de IA (ChatGPT, Perplexity, Claude, Gemini) indexan por chunks. Cada H2 y H3 DEBE cargar contexto semántico completo — no etiquetas perezosas.
- Cada H2: mínimo 8 palabras, debe incluir tema + geo/estado + cohorte (o año si es temporal).
- Cada H3: mínimo 6 palabras, debe responder una sub-pregunta concreta.
- PROHIBIDOS como H2/H3 sueltos: "Conclusión", "Introducción", "Preguntas frecuentes", "Cómo funciona", "Tarifas", "Resumen", "Por qué Cubierto", "Lo bueno y lo malo".
  Permitidos solo cuando se expanden: "## Preguntas frecuentes sobre hipoteca con ITIN en Houston en 2026" sí; "## Preguntas frecuentes" NO.
- Ejemplos válidos:
  - "## Tarifas promedio de Progressive, GEICO y State Farm para conductores con ITIN en Houston en 2026"
  - "## Cómo cotizar tu seguro de auto con licencia extranjera en Florida por WhatsApp"
  - "### ¿Necesitas Social Security para abrir cuenta bancaria en Chase en 2026?"

REGLAS GEO — INDEPENDENCIA DE CHUNKS (obligatorio):
Cada párrafo debe leerse fuera de contexto. Imagina que un asistente de IA cita SOLO ese párrafo — ¿sigue teniendo sentido?
- PROHIBIDOS al inicio de párrafo: "Como mencionamos antes", "Como vimos arriba", "Volviendo a", "Si recuerdas", "Más adelante", "Antes vimos", "En la sección anterior".
- Cada párrafo del cuerpo (no FAQ) debe contener al menos UN dato local específico: una cifra, una fecha, un nombre propio (aseguradora/banco/estado/condado), o una referencia a estatuto.
- Cada párrafo mínimo 40 palabras (excepto FAQ que pueden ser más cortas).

QUERY FAN-OUT — COBERTURA DE SUB-CONSULTAS (obligatorio):
Una sola búsqueda se descompone en 5+ sub-consultas. Cada artículo DEBE responder explícitamente en H3 al menos 5 sub-preguntas relacionadas con el tema. Ejemplos para "seguro auto ITIN Tampa":
  → "¿Se puede tener seguro de auto solo con ITIN en Florida?"
  → "¿Qué aseguradoras aceptan ITIN en Tampa?"
  → "¿Cuánto cuesta el seguro de auto con ITIN en 2026?"
  → "¿Necesito SSN para sacar seguro de auto en Florida?"
  → "¿Cómo cotizar siendo indocumentado sin licencia americana?"
Identifica las 5 sub-preguntas más buscadas del tema y crea un H3 para cada una. La primera oración bajo el H3 responde directo.

BLOQUE DE DATOS REALES — REAL-DATA BLOCK (obligatorio, una vez por artículo):
Una sección con datos verificables citados a fuente primaria. Sin esto el artículo no rankea contra NerdWallet/Bankrate.
Fuentes aceptadas (cita la URL en markdown, no inventes):
- Estatales: state DOI / DFS / TDI rate filings (floir.com, tdi.texas.gov, dfs.ny.gov)
- Federales: IRS.gov, CFPB.gov, HealthCare.gov, CMS.gov, FRED (St. Louis Fed), HUD.gov, Freddie Mac PMMS
- Demográficos: US Census ACS (data.census.gov con tabla específica), HRSA findahealthcenter
- Industria: KFF.org, NAIC, MBA, Brookings, Urban Institute, MPI, NILC
- Quejas: BBB profile pages, state DOI complaint indexes
Formato del bloque:
  ## [H2 con tema + geo + año]
  > **Fuente:** [Nombre de la fuente con URL]
  [Tabla o párrafo con la cifra real, año del dato, y contexto]

CITATION DENSITY (obligatorio): mínimo 2 URLs a fuentes autoritativas distintas (no contar Cubierto/Hogares/finazo.us). Idealmente 1 cita cada 250 palabras.

YEAR-STAMPING (obligatorio): todo dato numérico DEBE llevar el año del dato — "según el CFPB en 2024", "tabla del IRS 2026", "rate filing de Florida OIR de 2025". Sin año, el dato envejece sin avisar.

PATRONES PROHIBIDOS (bloquean publicación):
- Cifras de ahorro sin sustentar: "ahorra $147", "te están cobrando demasiado", "tus aseguradoras te están robando".
- Marcos conspirativos: "lo que tu aseguradora no quiere que sepas", "el secreto que los bancos esconden".
- Urgencia manipuladora: "solo por hoy", "últimos cupos", "antes que cierre el plazo".
- Promesas sin disclaimer: "definitivamente calificas", "te aprueban seguro".
- Cubierto como aseguradora ("Cubierto te asegura"); es CORREDOR — "Cubierto te conecta con aseguradoras".
- Hogares como prestamista; es BROKER — "Hogares te conecta con wholesalers".
- Cualquier "el mejor" / "el más barato" sin fuente que lo sustente con tabla comparativa.

REGLAS SEO clásicas (obligatorias, además de las GEO):

CRÍTICO — LENGUAJE PLANO EN TITULAR Y LEAD (bloquea publicación si falla):
La mayoría de Hispanos que buscan estos temas NO saben qué es ITIN. Buscan en lenguaje cotidiano: "sin Social Security", "sin SSN", "sin seguro social". Esos son los keywords reales — no "ITIN".

- TÍTULO H1: usar lenguaje plano que la gente busca. "Comprar casa sin Social Security en Houston" SÍ; "Hipoteca con ITIN en Houston" NO.
- LEAD (primer párrafo): el keyword plano aparece en las primeras 100 palabras. ITIN puede aparecer como término técnico secundario en una frase tipo "ITIN, el número del IRS que reemplaza al SSN".
- ITIN como término principal SOLO está permitido cuando el artículo es específicamente sobre qué es ITIN (slug que-es-itin, ITIN renewal, etc).
- Variantes aceptadas como keyword principal: "sin Social Security", "sin SSN", "sin seguro social", "sin número de Social Security", "comprar X sin papeles", "X para indocumentados".

Aplicación práctica:
- "Hipoteca con ITIN" → "Comprar casa sin Social Security"
- "Tarjeta de crédito ITIN" → "Tarjeta de crédito sin Social Security"
- "Seguro auto ITIN" → "Seguro de auto sin Social Security"
- "Cuenta bancaria ITIN" → "Abrir cuenta bancaria sin SSN"
- "Taxes con ITIN" → "Declarar impuestos sin Social Security"

Explicación dentro del cuerpo (sí, está permitido y de hecho útil): "ITIN (Individual Taxpayer Identification Number) es el número que emite el IRS para gente que tiene que declarar impuestos pero no califica para Social Security. Es lo que sustituye al SSN."

- Incluye la keyword principal en: H1, primer párrafo (primeras 100 palabras), y al menos 2 H2.
- Densidad de keyword 1-2% natural — nunca forzada.
- Mínimo una sección de Preguntas Frecuentes al final (5-7 preguntas reales que la gente busca, respuestas de 2-3 oraciones cada una, encabezado H2 expandido — ver regla Welter arriba).
- Mínimo una tabla comparativa con encabezados en formato Markdown:
  | Producto | Métrica 1 | Métrica 2 |
  | --- | --- | --- |
- Datos numéricos clave en negritas (APR, montos, plazos).
- Términos en inglés cuando son de uso común (APR, credit score, ITIN, FICO, SSN, ACA).

REGLAS E-E-A-T (obligatorias):
- Cita al menos 2 fuentes públicas verificables con enlace markdown — IRS.gov, CFPB.gov, HealthCare.gov, FRED, KFF, Freddie Mac PMMS, state DOI, etc.
- Incluye un enlace a la metodología de Finazo: "[según nuestra metodología](/metodologia)".
- Incluye un enlace al perfil del autor (Finazo lo insertará en el byline; tú no escribas el byline).
- Para artículos de seguros: el autor por default es Javier Keough, quien tiene licencia activa de seguros 2-20 en Florida. NO digas "licencia pendiente" — di "agente licenciado" o cita la licencia directamente. La agencia (Cubierto LLC) tiene la application en curso pero Javier individual tiene su licencia 2-20 activa.
- NO incluyas líneas de divulgación de afiliado dentro del artículo. La divulgación está en [/legal](/legal) y el footer del sitio. Mencionar a Cubierto/Hogares por nombre cuando aplique al tema es OK; agregar "Cubierto es socio afiliado..." en el cuerpo NO es OK.

ENLACES INTERNOS — usa SOLO rutas canónicas de finazo.us (sin prefijo /us — el middleware reescribe):
- Préstamos → "[compara opciones de préstamo en Finazo](/prestamos)"
- Seguro de auto → "[compara seguros de auto](/seguro-de-auto)"
- Seguro de salud → "[compara planes de salud](/seguro-de-salud)"
- Seguro de vida → "[compara seguros de vida](/seguro-de-vida)"
- Hipoteca → "[pre-califica tu hipoteca](/hipotecas)"
- Crédito / score → "[construye tu credit score](/credito)"
- Remesas → "[compara apps de remesas](/herramientas/comparador-remesas)"
- Cotizador seguro → "[cotiza con 8+ aseguradoras](/herramientas/cotizador-seguro)"
- Simulador hipoteca → "[simula tu pago mensual](/herramientas/simulador-hipoteca)"
- Hub de seguros → "[ver guía de seguros](/seguros)"
- Hub fiscal/ITIN → "[guía fiscal e ITIN](/fiscal)"

NUNCA enlaces a finazo.lat — esos son contenidos LATAM.

FORMATO OBLIGATORIO — CALLOUT BOX:
Inmediatamente después de la introducción (antes del primer H2), un blockquote con los 3-4 puntos clave:
> **Lo esencial:** punto 1 brevísimo.
> punto 2 brevísimo.
> punto 3 brevísimo.

IMÁGENES INLINE OBLIGATORIAS (2 por artículo):
Inserta exactamente DOS marcadores de imagen en el cuerpo del artículo. Finazo los reemplazará con fotos relevantes de Pexels:
1. La primera imagen va inmediatamente DESPUÉS del callout box "Lo esencial" (antes del primer H2):
   ![INLINE: descripción específica de la escena en inglés, ej: "hispanic family signing insurance documents at office"]()
2. La segunda imagen va aproximadamente a 2/3 del artículo (después de la tabla comparativa principal o de la sección de "alternativas"):
   ![INLINE: descripción específica de la escena en inglés, ej: "young hispanic woman looking at phone WhatsApp"]()
Nunca uses imágenes en otros lugares — solo estos dos marcadores. La descripción debe ser específica al tema (no genérica) en inglés porque Pexels indexa en inglés.

PRÓXIMOS PASOS CON FINAZO — sección obligatoria al final, ANTES de Preguntas frecuentes:
Toda guía debe terminar con esta sección que conecta al lector con los productos hermanos. Adapta el lenguaje al tema del artículo:

## Próximos pasos con Finazo para Hispanos en EE.UU. en 2026
Si después de leer esta guía quieres tomar acción, estas son las tres maneras de seguir adelante:
- **Cotizar tu seguro** — [habla con Cubierto](/herramientas/cotizador-seguro) — auto, hogar, salud o vida con 8+ aseguradoras en 90 segundos por WhatsApp.
- **Comprar casa con o sin Social Security** — [pre-califícate con Hogares](/hipotecas) — wholesalers non-QM, ITIN, self-employed. Respuesta en 24 horas.
- **Pregunta lo que sea** — [escríbele al bot de Finazo](https://wa.me/13055551234?text=Hola%20Finazo) — responde en español sobre crédito, taxes, ITIN, banking y más.

(Adapta la frase de cada bullet al artículo. Por ejemplo, en un artículo sobre crédito: "Ahora que sabes construir tu credit score, considera **comprar casa con Hogares** o **asegurar tu auto con Cubierto**" — pero mantén las TRES opciones siempre presentes con sus enlaces).

CONVERSIÓN — BLOQUES CTA OBLIGATORIOS según categoría:

Si el artículo es de SEGUROS (auto/hogar/salud/vida) — incluye DOS CTAs:
1. CTA inline (en mitad del artículo, después de la tabla comparativa o sección "alternativas"):
> **Cotiza ahora con Cubierto** — Compara con 8+ aseguradoras en 90 segundos por WhatsApp. Sin llamadas, en español, gratis para ti. [Hablar con Carmen →](https://wa.me/13055551234?text=Hola%20Carmen%2C%20cotizar%20seguro)

2. CTA al final (antes de Preguntas frecuentes):
## ¿Listo para cotizar tu seguro de auto con Cubierto en EE.UU. en 2026?
[Compara con 8+ aseguradoras en Cubierto](/herramientas/cotizador-seguro) — toma menos de 2 minutos. O escribe a Carmen directamente por WhatsApp y te cotiza con tarifas reales.

Si el artículo es de HIPOTECAS / COMPRA DE CASA — incluye DOS CTAs:
1. CTA inline (después de explicar opciones non-QM o ITIN):
> **Pre-califícate con Hogares** — Si el banco tradicional te dijo que no, Hogares te conecta con 4 wholesalers non-QM en 24 horas. ITIN, self-employed y bank-statement loans aceptados. [Hablar con Sofía →](https://wa.me/13055551234?text=Hola%20Sofia%2C%20pre-calificar%20hipoteca)

2. CTA al final:
## ¿Listo para pre-calificar tu hipoteca con Hogares sin Social Security?
[Pre-calificación gratis con Hogares](/hipotecas) — respuesta en 24 horas. O simula tu pago mensual con el [simulador de hipoteca](/herramientas/simulador-hipoteca).

Si el artículo es de CRÉDITO / BANKING / TAXES / EDUCACIÓN — incluye UN CTA al final:
## ¿Tienes una pregunta específica sobre crédito o taxes en EE.UU. en 2026?
[Pregúntale a Finazo por WhatsApp](https://wa.me/13055551234?text=Hola%20Finazo) — el bot te responde en español, sin tener que descargar nada. O usa el [tracker de credit score](/herramientas/credit-tracker) para tu plan personal.

Si el artículo es de REMESAS — incluye UN CTA al final:
## ¿Cuánto te ahorras enviando dinero a tu familia hoy en 2026?
[Compara apps de remesas en vivo](/herramientas/comparador-remesas) — Wise vs Remitly vs Western Union, comisiones reales actualizadas cada 6 horas para el corredor que tú eliges.

NO incluyas un bloque de divulgación de afiliado dentro del artículo —
ni al inicio, ni al pie, ni en formato callout. La divulgación vive en
[/legal](/legal) y en el footer del sitio, persistente en todas las páginas.
Mencionar a Cubierto u Hogares por nombre en el cuerpo del artículo es OK;
agregar un "> **Divulgación:**..." dentro del Markdown NO es OK.

Al final del artículo, en líneas separadas:
META: [meta description de 150-160 caracteres con la keyword principal]
KEYWORDS: [6-8 keywords separadas por comas, de menor a mayor competencia]

Solo el artículo en Markdown — sin meta-comentarios sobre el proceso.`;

// ─── Calendar ──────────────────────────────────────────────────────────────

export const US_CONTENT_CALENDAR: UsContentTopic[] = [
  // ════════════════════════════════════════════════════════════════════════
  // SECCIÓN A — Carrier Alternativa (alta intent, baja competencia en español)
  // ════════════════════════════════════════════════════════════════════════
  {
    slug: "fred-loya-alternativa-mejores-aseguradoras-hispanos",
    category: "seguros",
    imageQuery: "auto insurance hispanic family car keys",
    preferredAuthor: "javier-keough",
    homepageSeed: true,
    prompt: `Eres un experto en seguros de auto para la comunidad Hispana en EE.UU. Escribe un artículo comparativo en español optimizado para "Fred Loya alternativa".

Contexto: Fred Loya es popular entre Hispanos pero tiene quejas conocidas de servicio al cliente y precios elevados. Los lectores buscan alternativas confiables.

Keyword principal: "Fred Loya alternativa"
Título H1: "Fred Loya: 5 alternativas más baratas para Hispanos en 2026"
Extensión: 1200-1400 palabras

REGLA CRÍTICA PARA ESTE ARTÍCULO ESPECÍFICAMENTE:
Este artículo describe 5 aseguradoras alternativas. CADA descripción de carrier (Infinity, Direct General, Progressive, GEICO, Cubierto) DEBE empezar con una de estas dos frases — sin excepción:
  - "En nuestra experiencia ayudando a conductores hispanos, [carrier]..." (Pattern B hedge)
  - "Según [fuente pública con año], [carrier]..." (Pattern A source — solo si tenés fuente real)
NUNCA describir un carrier con una afirmación factual plana como "Infinity es...", "Direct General opera en...", "Progressive ofrece..." — eso crea exposición Lanham Act. SIEMPRE el hedge.

NUNCA incluyas primas mensuales o anuales específicas para los carriers alternativos (ni rangos plana de $X-$Y). Si querés indicar precio, usá afirmaciones cualitativas: "tiende a ser más barata para...", "suele estar en el rango bajo del mercado para...". Las cifras planas tipo "$160/mes" están PROHIBIDAS en este artículo.

Estructura requerida:
## Introducción (keyword en primeras 100 palabras; cualquier mención de volumen de quejas DEBE citar NAIC complaint index — NUNCA CFPB, que no tiene jurisdicción sobre seguros per Dodd-Frank § 1027(f))
## Por qué buscar alternativa a Fred Loya según patrones de quejas públicas (cualquier afirmación específica sobre Fred Loya debe estar precedida por "Según [fuente nombrada con año]" o por hedge "En nuestra experiencia...")
(Tabla: Aseguradora alternativa | Características cualitativas de precio | Acepta ITIN según política publicada | NAIC complaint index año más reciente | Estados disponibles. NO incluir cifras de dólar específicas en esta tabla)
## Infinity como alternativa a Fred Loya para Hispanos en EE.UU. en 2026
(empezar el primer párrafo con "En nuestra experiencia ayudando a conductores hispanos, Infinity..." o equivalente con "Según [fuente]")
## Direct General como alternativa a Fred Loya en el sureste de EE.UU. en 2026
(mismo patrón obligatorio)
## Progressive como alternativa a Fred Loya con cobertura amplia en 2026
(mismo patrón obligatorio)
## GEICO como alternativa a Fred Loya para conductores con historial limpio en 2026
(mismo patrón obligatorio)
## Cubierto — nuestro corredor afiliado que cotiza con 8+ aseguradoras en 2026
(Cubierto es CORREDOR, no aseguradora; empezar con "En nuestra experiencia operando Cubierto, te conectamos con 8+ aseguradoras...". NO incluyas un callout de divulgación de comisión en esta sección — la divulgación está en /legal y en el footer del sitio.)
## Cómo cambiar de Fred Loya sin penalización en EE.UU. en 2026
## Preguntas frecuentes sobre alternativas a Fred Loya para Hispanos en 2026
## Conclusión + CTA${US_SEO_SUFFIX}`,
  },
  {
    slug: "estrella-insurance-alternativa-mejor-seguro-hispanos-florida",
    category: "seguros",
    imageQuery: "auto insurance florida hispanic agent",
    preferredAuthor: "javier-keough",
    homepageSeed: true,
    prompt: `Eres un experto en seguros de auto en Florida para la comunidad Hispana. Escribe un comparativo en español optimizado para "Estrella Insurance alternativa".

Contexto: Estrella es muy presente en FL pero tuvo brecha de datos en 2025. Lectores buscan migrar.

Keyword principal: "Estrella Insurance alternativa"
Título H1: "Estrella Insurance: 4 alternativas más seguras para Hispanos en Florida (2026)"
Extensión: 1100-1300 palabras

Estructura requerida:
## Introducción (menciona la brecha de datos de 16,379 expedientes en 2025; keyword en primeras 100 palabras)
## Qué pasó con Estrella en 2025 (cita: comunicado oficial de la empresa o noticia)
## Cómo saber si tus datos fueron expuestos
## 4 alternativas confiables para Hispanos en Florida (cualquier comparativa específica entre carriers DEBE citarse a una fuente con año, NUNCA presentarse como hecho plano sin fuente)
(Tabla: Aseguradora | Prima FL con rango y fuente citada | Acepta ITIN según política publicada | Cobertura PIP | NAIC complaint index año más reciente — NUNCA CFPB para datos de seguros)
## Alternativa 1: Infinity (líder mercado Hispano)
## Alternativa 2: Ocean Harbor (FL específico)
## Alternativa 3: Windhaven (cobertura SR-22)
## Alternativa 4: Cubierto — cotiza con 8+ aseguradoras desde WhatsApp
(NO incluyas callout de divulgación — vive en /legal y footer)
## Cómo migrar de Estrella sin perder cobertura
## Preguntas frecuentes
## Conclusión${US_SEO_SUFFIX}`,
  },
  {
    slug: "direct-general-vs-fred-loya-comparativo-hispanos",
    category: "seguros",
    imageQuery: "compare car insurance two options",
    preferredAuthor: "javier-keough",
    prompt: `Eres un experto en seguros de auto para Hispanos en EE.UU. Escribe un comparativo head-to-head en español.

Keyword principal: "Direct General vs Fred Loya"
Título H1: "Direct General vs Fred Loya: comparativo para Hispanos (2026)"
Extensión: 1000-1200 palabras

Estructura:
## Introducción (keyword en primeras 100 palabras)
## Resumen rápido — quién gana en qué
(Tabla: Categoría | Direct General | Fred Loya | Ganador)
## Precio mensual promedio (datos por estado: TX, FL, CA)
## Aceptan ITIN / matrícula consular
## Cobertura mínima vs cobertura full
## Servicio al cliente y quejas registradas (NAIC complaint index; los datos de quejas de seguros se registran en state DOIs y se agregan vía NAIC — CFPB no tiene jurisdicción sobre seguros per Dodd-Frank § 1027(f))
## App móvil y experiencia digital
## Cuándo elegir cada uno
## Mejor alternativa que ambos
## Preguntas frecuentes
## Conclusión${US_SEO_SUFFIX}`,
  },

  // ════════════════════════════════════════════════════════════════════════
  // SECCIÓN B — Legal-requirement awareness (volumen alto, competencia baja)
  // ════════════════════════════════════════════════════════════════════════
  {
    slug: "es-obligatorio-seguro-auto-texas-hispanos",
    category: "seguros",
    imageQuery: "texas highway driving car",
    preferredAuthor: "javier-keough",
    homepageSeed: true,
    prompt: `Eres un experto en seguros de auto en Texas. Escribe una guía en español sobre la ley.

Keyword principal: "es obligatorio el seguro de auto en Texas"
Título H1: "¿Es obligatorio el seguro de auto en Texas? Guía 2026 para Hispanos"
Extensión: 900-1100 palabras

Estructura:
## Introducción (sí, es obligatorio — citar la ley TX Transportation Code §601 con enlace)
## Cobertura mínima requerida en Texas (30/60/25)
(Tabla: Tipo cobertura | Mínimo legal | Recomendado por expertos)
## Multas por manejar sin seguro en Texas
(citar Texas DPS oficial si posible)
## Qué pasa si tienes accidente sin seguro
## Cómo cumplir la ley si tienes ITIN o no tienes licencia
## Aseguradoras más baratas que cumplen el mínimo TX
## Preguntas frecuentes
## Conclusión${US_SEO_SUFFIX}`,
  },
  {
    slug: "multas-manejar-sin-seguro-florida-2026",
    category: "seguros",
    imageQuery: "florida traffic stop police",
    preferredAuthor: "javier-keough",
    prompt: `Eres un experto en seguros de auto en Florida. Escribe una guía en español sobre las multas.

Keyword principal: "multas por manejar sin seguro en Florida"
Título H1: "Multas por manejar sin seguro en Florida: lo que pagas en 2026"
Extensión: 900-1100 palabras

Estructura:
## Introducción (FL es no-fault — todos deben tener PIP/PDL; keyword en primeras 100 palabras)
## Cobertura PIP y PDL: qué exige la ley FL
## Multas concretas por no tener seguro en Florida
(Tabla: Infracción | Multa primera vez | Multa repetida | Suspensión licencia)
## Qué pasa si te paran sin seguro
## Cómo restablecer la licencia después de suspensión
## Cómo conseguir SR-22 si lo necesitas
## Aseguradoras que dan SR-22 a precios razonables
## Preguntas frecuentes
## Conclusión${US_SEO_SUFFIX}`,
  },
  {
    slug: "cobertura-minima-seguro-auto-california-hispanos",
    category: "seguros",
    imageQuery: "california highway car driving",
    preferredAuthor: "javier-keough",
    prompt: `Eres un experto en seguros de auto en California. Escribe una guía en español.

Keyword principal: "cobertura mínima de seguro de auto en California"
Título H1: "Cobertura mínima de seguro de auto en California: 2026 explicado"
Extensión: 900-1100 palabras

Estructura:
## Introducción (15/30/5 — cita CA Vehicle Code §16056 con enlace; keyword primeras 100 palabras)
## Qué significa 15/30/5
(Tabla: Cobertura | Mínimo CA | Mínimo recomendado)
## Programa de bajo ingreso CLCA — para quien aplica
## Multas por manejar sin seguro en CA
## Aseguradoras más baratas que cumplen el mínimo
## Cuándo el mínimo NO te alcanza
## Preguntas frecuentes
## Conclusión${US_SEO_SUFFIX}`,
  },

  // ════════════════════════════════════════════════════════════════════════
  // SECCIÓN C — Hipoteca (Hogares angle, sin Social Security)
  // ════════════════════════════════════════════════════════════════════════
  {
    slug: "hipoteca-sin-social-security-itin-2026",
    category: "prestamos",
    imageQuery: "hispanic family new home mortgage",
    preferredAuthor: "javier-keough",
    homepageSeed: true,
    prompt: `Eres un experto en hipotecas para Hispanos en EE.UU. Escribe una guía en español optimizada para hipoteca sin Social Security.

Keyword principal: "hipoteca sin Social Security" (con "ITIN" como mención secundaria)
Título H1: "Hipoteca sin Social Security en 2026: cómo comprar casa con ITIN"
Extensión: 1300-1500 palabras

Estructura:
## Introducción (keyword en primeras 100 palabras — explica que ITIN es la opción técnica)
## ¿Se puede comprar casa sin SSN? (sí — hipoteca ITIN / non-QM)
## Wholesalers que prestan a clientes ITIN
(Tabla: Wholesaler | Tasa típica | Down payment mínimo | LTV máximo | Estados)
Incluir: ACC Mortgage, Arc Home, NE1st Bank, NFM
## Cómo se ven las tasas hoy
(citar Freddie Mac PMMS con enlace; explicar que ITIN paga prima sobre la rate sheet)
## Qué documentos necesitas con ITIN
## Cuánto down payment necesitas (10-25% típico)
## Programa de Hogares: pre-calificación por WhatsApp en 24h
(NO incluyas callout de divulgación — vive en /legal y footer)
## Errores que rechazan tu hipoteca sin SSN
## Preguntas frecuentes
## Conclusión${US_SEO_SUFFIX}`,
  },
  {
    slug: "comprar-casa-sin-social-security-hispanos-paso-a-paso",
    category: "prestamos",
    imageQuery: "hispanic couple home purchase keys",
    preferredAuthor: "javier-keough",
    prompt: `Eres un experto en compra de vivienda para Hispanos en EE.UU. Escribe una guía paso-a-paso.

Keyword principal: "comprar casa sin Social Security"
Título H1: "Cómo comprar casa sin Social Security en EE.UU.: guía paso a paso (2026)"
Extensión: 1200-1400 palabras

Estructura:
## Introducción (keyword primeras 100 palabras)
## Paso 1: ITIN si no lo tienes (enlace a guía W-7)
## Paso 2: Construir credit score con ITIN
## Paso 3: Ahorrar el down payment (10-20% típico para non-QM)
## Paso 4: Pre-calificación con un broker non-QM
(Tabla: Programa | Down payment | Tasa típica | Para quién)
## Paso 5: Encontrar la casa y hacer la oferta
## Paso 6: Cierre y costos
## Programas de asistencia para first-time buyers Hispanos
## Hogares — Pre-calificación por WhatsApp si el banco te dijo que no
(NO incluyas callout de divulgación — vive en /legal y footer)
## Preguntas frecuentes
## Conclusión${US_SEO_SUFFIX}`,
  },
  {
    slug: "non-qm-lenders-hispanos-self-employed",
    category: "prestamos",
    imageQuery: "self employed hispanic business owner",
    preferredAuthor: "javier-keough",
    prompt: `Eres un experto en hipotecas non-QM para Hispanos self-employed. Escribe una guía en español.

Keyword principal: "hipoteca self-employed sin W2"
Título H1: "Hipoteca para self-employed sin W-2: opciones non-QM en 2026"
Extensión: 1100-1300 palabras

Estructura:
## Introducción (keyword primeras 100 palabras; explica que el banco tradicional rechaza self-employed sin 2 años de W-2)
## Qué es non-QM y por qué existe
## Documentación alternativa: bank statement loans
(Tabla: Tipo loan | Documentos requeridos | Down payment | Tasa típica)
## Los 4 wholesalers principales: ACC, Arc Home, NE1st, NFM
## Profit & Loss loans para freelancers
## Asset-based loans para inversionistas
## Hogares — broker que te conecta con todos
(NO incluyas callout de divulgación — vive en /legal y footer)
## Errores que rechazan a self-employed
## Preguntas frecuentes
## Conclusión${US_SEO_SUFFIX}`,
  },

  // ════════════════════════════════════════════════════════════════════════
  // SECCIÓN D — Seguro de salud / ACA (Cubierto roadmap)
  // ════════════════════════════════════════════════════════════════════════
  {
    slug: "seguro-salud-sin-social-security-aca-2026",
    category: "seguros",
    imageQuery: "doctor consultation hispanic patient",
    preferredAuthor: "javier-keough",
    homepageSeed: true,
    prompt: `Eres un experto en seguros de salud para Hispanos en EE.UU. Escribe una guía en español.

Keyword principal: "seguro de salud sin Social Security"
Título H1: "Seguro de salud sin Social Security: opciones reales en 2026"
Extensión: 1200-1400 palabras

Estructura:
## Introducción (keyword primeras 100 palabras)
## ACA Marketplace: qué califica para Hispanos sin SSN
(citar HealthCare.gov reglas oficiales con enlace)
## Medicaid según estado (qué estados cubren a indocumentados)
(Tabla: Estado | Medicaid expansion | Cobertura para indocumentados | Edad cubierta)
Incluir: CA, NY, IL, WA — los más permisivos
## Plan estatal: Covered California, NY State of Health, Illinois Health Insurance Marketplace
## Subsidios ACA y cómo calculan el ingreso
## Cobertura de emergencia (EMTALA) — derecho universal
## Programas de salud comunitaria (FQHC) — escala según ingreso
## Preguntas frecuentes
## Conclusión${US_SEO_SUFFIX}`,
  },
  {
    slug: "medicaid-hispanos-elegibilidad-por-estado-2026",
    category: "seguros",
    imageQuery: "medicaid healthcare hispanic family",
    preferredAuthor: "javier-keough",
    prompt: `Eres un experto en programas de salud pública para Hispanos. Escribe una guía en español.

Keyword principal: "Medicaid para Hispanos elegibilidad"
Título H1: "Medicaid para Hispanos: elegibilidad estado por estado (2026)"
Extensión: 1100-1300 palabras

Estructura:
## Introducción (keyword primeras 100 palabras)
## Medicaid expansion — qué significa
(citar Kaiser Family Foundation con enlace)
## Tabla de elegibilidad por estado
(Tabla completa: Estado | Expansion sí/no | Límite de ingresos | Cubre indocumentados)
## Estados más permisivos: CA, NY, IL, MN, WA
## Estados que requieren ciudadanía o residencia legal
## Cómo aplicar paso a paso
## Diferencia entre Medicaid y CHIP (niños)
## Qué hacer si te niegan Medicaid
## Preguntas frecuentes
## Conclusión${US_SEO_SUFFIX}`,
  },
  {
    slug: "inscripcion-aca-open-enrollment-hispanos-2026",
    category: "seguros",
    imageQuery: "online health enrollment laptop",
    preferredAuthor: "javier-keough",
    prompt: `Eres un experto en inscripción ACA para Hispanos. Escribe una guía paso-a-paso en español.

Keyword principal: "inscripción ACA en español"
Título H1: "Inscripción ACA en español: guía paso a paso (Open Enrollment 2026-2027)"
Extensión: 1100-1300 palabras

Estructura:
## Introducción (keyword primeras 100 palabras)
## Fechas Open Enrollment 2026-2027
(citar HealthCare.gov fechas oficiales)
## Documentos que necesitas
## Crear cuenta en HealthCare.gov en español
## Calcular tu subsidio (APTC + CSR)
(Tabla: Ingreso anual | % FPL | Subsidio típico | Plan recomendado)
## Comparar planes Bronze, Silver, Gold, Platinum
## Errores comunes al inscribirse (sub-reportar ingreso = surprise tax bill)
## Special Enrollment Period (SEP) — cuándo aplica fuera de fecha
## Asistencia gratis: navigators y certified application counselors
## Preguntas frecuentes
## Conclusión${US_SEO_SUFFIX}`,
  },

  // ════════════════════════════════════════════════════════════════════════
  // SECCIÓN E — Seguro de vida (Cubierto futuro)
  // ════════════════════════════════════════════════════════════════════════
  {
    slug: "seguro-vida-sin-examen-medico-hispanos-2026",
    category: "seguros",
    imageQuery: "life insurance family protection home",
    preferredAuthor: "javier-keough",
    prompt: `Eres un experto en seguros de vida para Hispanos. Escribe una guía en español.

Keyword principal: "seguro de vida sin examen médico"
Título H1: "Seguro de vida sin examen médico: opciones para Hispanos en EE.UU. (2026)"
Extensión: 1000-1200 palabras

Estructura:
## Introducción (keyword primeras 100 palabras)
## ¿Qué es seguro de vida sin examen?
## Tipos: simplified issue vs guaranteed issue
(Tabla: Tipo | Cobertura máx | Costo mensual | Para quién)
## Las mejores aseguradoras sin examen para Hispanos
(Ethos, Haven Life, Bestow, Fabric, Lemonade Life)
## Cuánto cuesta sin examen vs con examen
## Cuándo conviene aceptar el examen
## Preguntas frecuentes
## Conclusión${US_SEO_SUFFIX}`,
  },
  {
    slug: "seguro-vida-mandar-familia-mexico-centroamerica",
    category: "seguros",
    imageQuery: "family video call abroad sending support",
    preferredAuthor: "javier-keough",
    prompt: `Eres un experto en seguros de vida para inmigrantes Hispanos que mandan dinero a casa. Escribe una guía en español.

Keyword principal: "seguro de vida para mandar a la familia"
Título H1: "Seguro de vida para que tu familia en {México|Centroamérica} reciba apoyo (2026)"
Extensión: 1000-1200 palabras

Estructura:
## Introducción (keyword primeras 100 palabras — calcular: mandar $400/mes × 30 años = $144K mínimo)
## Cuánta cobertura necesitas — fórmula simple (10x ingreso anual)
## Beneficiario en otro país: ¿se puede?
(citar reglas reales de aseguradoras grandes)
## Cómo mandar la indemnización a México / GT / SV / HN sin perder en cambios
(mencionar Wise, Remitly como vías de pago)
## Aseguradoras que aceptan beneficiarios extranjeros
(Tabla: Aseguradora | Beneficiario internacional | Cobertura máx | Sin examen)
## ITIN holders y seguro de vida
## Preguntas frecuentes
## Conclusión${US_SEO_SUFFIX}`,
  },

  // ════════════════════════════════════════════════════════════════════════
  // SECCIÓN F — Crédito (sin SSN primary)
  // ════════════════════════════════════════════════════════════════════════
  {
    slug: "construir-credit-score-sin-social-security-itin",
    category: "educacion",
    imageQuery: "credit score chart growing finances",
    preferredAuthor: "javier-keough",
    homepageSeed: true,
    prompt: `Eres un experto en construir credit score para Hispanos en EE.UU. Escribe una guía en español.

Keyword principal: "construir credit score sin Social Security"
Título H1: "Cómo construir credit score sin Social Security: guía 2026 (con ITIN o sin ID)"
Extensión: 1300-1500 palabras

Estructura:
## Introducción (keyword primeras 100 palabras)
## ¿Se puede tener credit score sin SSN? (sí, con ITIN)
(citar CFPB con enlace)
## Cómo se construye un FICO desde cero
(Tabla: Factor | Peso | Cómo afectarlo)
## Paso 1: ITIN o consular ID — qué bancos aceptan cada uno
## Paso 2: Tarjeta asegurada que reporta a las 3 bureaus
(Tabla: Tarjeta | Depósito | APR | Reporta a Experian/Equifax/TransUnion)
Incluir: Self, OpenSky, Capital One Secured, Discover Secured, Petal 1
## Paso 3: Credit-builder loan (Self, Kikoff)
## Paso 4: Convertirte en authorized user de un familiar
## Paso 5: Mantener utilization < 30%
## Cronograma realista: 0 → 650 en 9-12 meses
## Errores que destruyen el progreso
## Preguntas frecuentes
## Conclusión${US_SEO_SUFFIX}`,
  },
  {
    slug: "mejores-secured-cards-hispanos-2026",
    category: "tarjetas",
    imageQuery: "credit cards on wood table",
    preferredAuthor: "javier-keough",
    prompt: `Eres un experto en tarjetas aseguradas para Hispanos en EE.UU. Escribe un comparativo en español.

Keyword principal: "mejor tarjeta de crédito asegurada"
Título H1: "Mejores tarjetas de crédito aseguradas para Hispanos en 2026"
Extensión: 1100-1300 palabras

Estructura:
## Introducción (keyword primeras 100 palabras)
## Qué hace buena a una tarjeta asegurada
## Comparativo de las 6 mejores en 2026
(Tabla detallada: Tarjeta | Depósito mínimo | APR | Cuota anual | Reporta 3 bureaus | Acepta ITIN)
Incluir: Discover it Secured, Capital One Platinum Secured, OpenSky Plus, Self Visa, Chime Credit Builder, Petal 1
## Análisis 1: Discover it Secured (mejor cashback)
## Análisis 2: Capital One Platinum Secured (mejor para upgrade)
## Análisis 3: OpenSky Plus (sin checking account requerido)
## Análisis 4: Self Visa (combina con credit-builder loan)
## Análisis 5: Chime Credit Builder (sin depósito tradicional)
## Análisis 6: Petal 1 (alternativa sin score histórico)
## Cómo usar la tarjeta para subir score rápido
## Preguntas frecuentes
## Conclusión${US_SEO_SUFFIX}`,
  },

  // ════════════════════════════════════════════════════════════════════════
  // SECCIÓN G — Banking sin SSN
  // ════════════════════════════════════════════════════════════════════════
  {
    slug: "abrir-cuenta-bancaria-sin-social-security-2026",
    category: "educacion",
    imageQuery: "bank account opening hispanic customer service",
    preferredAuthor: "javier-keough",
    homepageSeed: true,
    prompt: `Eres un experto en banca para Hispanos sin SSN. Escribe una guía en español.

Keyword principal: "abrir cuenta bancaria sin Social Security"
Título H1: "Cómo abrir cuenta bancaria sin Social Security en EE.UU. (2026)"
Extensión: 1100-1300 palabras

Estructura:
## Introducción (keyword primeras 100 palabras)
## ¿Por qué los bancos aceptan ITIN / matrícula consular?
(citar regulación FinCEN con enlace)
## Documentos aceptados según el banco
(Tabla: Documento | Bank of America | Wells Fargo | Chase | Citibank | Chime | Majority)
## Los mejores 6 bancos para abrir cuenta sin SSN
(Análisis individual de cada uno con pros/contras)
## Bank of America — programa SafeBalance, atención en español
## Wells Fargo — historia con comunidad Hispana
## Citibank — Access Account sin overdraft
## Chime — 100% online, ITIN OK
## Majority — diseñado para inmigrantes
## Current — tarjeta para crédito + ahorro
## Cómo abrir tu cuenta paso a paso
## Errores comunes que rechazan la cuenta
## Preguntas frecuentes
## Conclusión${US_SEO_SUFFIX}`,
  },
  {
    slug: "majority-app-banco-inmigrantes-resena-2026",
    category: "educacion",
    imageQuery: "smartphone banking app immigrants",
    preferredAuthor: "javier-keough",
    prompt: `Eres un experto en apps bancarias para inmigrantes Hispanos. Escribe una reseña en español.

Keyword principal: "Majority app reseña"
Título H1: "Majority: la app bancaria diseñada para inmigrantes (reseña honesta 2026)"
Extensión: 1000-1200 palabras

Estructura:
## Introducción (keyword primeras 100 palabras)
## Qué es Majority y por qué la diseñaron para inmigrantes
## Servicios incluidos en la membresía mensual ($5.99)
(Tabla: Servicio | Incluido | Costo extra)
## Pros: lo que sí hace bien (atención en español, llamadas internacionales)
## Contras: lo que no hace bien (limitaciones de cobertura)
## Comparado con Chime, Current, BoA
## ¿Quién debería usar Majority?
## Preguntas frecuentes
## Conclusión${US_SEO_SUFFIX}`,
  },

  // ════════════════════════════════════════════════════════════════════════
  // SECCIÓN H — Remesas (corredor)
  // ════════════════════════════════════════════════════════════════════════
  {
    slug: "enviar-dinero-mexico-mejor-app-2026",
    category: "remesas",
    imageQuery: "mexico money transfer family",
    preferredAuthor: "javier-keough",
    homepageSeed: true,
    prompt: `Eres un experto en remesas a México. Escribe una guía completa en español.

Keyword principal: "mejor app para enviar dinero a México"
Título H1: "Mejor app para enviar dinero a México en 2026: comparativo real"
Extensión: 1100-1300 palabras

Estructura:
## Introducción (México recibe $63B en remesas; keyword primeras 100 palabras)
## Comparativo de las 8 apps principales
(Tabla detallada: App | Comisión $300 | Tipo cambio | Tipo cambio vs OANDA mid | Velocidad | Métodos pago)
Incluir: Wise, Remitly, Western Union, MoneyGram, Xoom, Ria, World Remit, Felix Pago
## Wise vs Remitly: el comparativo cara-a-cara
## SPEI: por qué importa para receptores con cuenta
## Apps móviles del receptor: BBVA, Banorte, Santander
## OXXO Pay y CoDi para receptores sin cuenta bancaria
## Western Union para zonas rurales sin internet
## Truco: cómo verificar el tipo de cambio real (mid-market en xe.com)
## Preguntas frecuentes
## Conclusión + CTA al [comparador en vivo](/herramientas/comparador-remesas)${US_SEO_SUFFIX}`,
  },
  {
    slug: "wise-vs-remitly-comparativo-2026",
    category: "remesas",
    imageQuery: "phone money transfer apps",
    preferredAuthor: "javier-keough",
    prompt: `Eres un experto en remesas. Escribe un comparativo head-to-head en español.

Keyword principal: "Wise vs Remitly"
Título H1: "Wise vs Remitly en 2026: cuál es mejor según tu país"
Extensión: 1100-1300 palabras

Estructura:
## Introducción (keyword primeras 100 palabras)
## Resumen ejecutivo: quién gana en qué
(Tabla: País destino | Ganador en comisión | Ganador en velocidad)
## México: comisión y tipo de cambio comparados
## El Salvador: comparado (recordando que SV usa USD)
## Guatemala: comparado
## Honduras: comparado
## Wise — cómo funciona el "real exchange rate"
## Remitly — Express vs Economy
## Cuándo usar Wise (transferencias grandes, control)
## Cuándo usar Remitly (envíos rápidos, opciones de retiro efectivo)
## Preguntas frecuentes
## Conclusión + CTA${US_SEO_SUFFIX}`,
  },

  // ════════════════════════════════════════════════════════════════════════
  // SECCIÓN I — ITIN / Fiscal
  // ════════════════════════════════════════════════════════════════════════
  {
    slug: "como-sacar-itin-w7-paso-a-paso-2026",
    category: "educacion",
    imageQuery: "irs form tax document filling",
    preferredAuthor: "javier-keough",
    homepageSeed: true,
    prompt: `Eres un experto en trámites fiscales para Hispanos sin SSN. Escribe una guía paso-a-paso.

Keyword principal: "cómo sacar ITIN paso a paso"
Título H1: "Cómo sacar tu ITIN en EE.UU. paso a paso: formulario W-7 explicado (2026)"
Extensión: 1200-1400 palabras

Estructura:
## Introducción (keyword primeras 100 palabras)
## ¿Qué es el ITIN y para qué te sirve?
(citar IRS.gov con enlace oficial)
## ¿Quién puede aplicar? (no requiere estatus migratorio legal)
## Documentos necesarios
(Tabla: Documento | Necesario para identidad | Necesario para "foreign status" | Original o certificado)
## Formulario W-7: cómo llenarlo correctamente
(captura screenshot del formato si posible)
## 3 maneras de presentar la solicitud
1. Por correo al IRS Austin TX
2. Acceptance Agent (AA) certificado
3. Centro de Asistencia del IRS (TAC)
## Cuánto tarda: 7-11 semanas típico
## Por qué se rechazan los W-7 (errores comunes)
## Qué hacer una vez que tienes ITIN (abrir cuenta, sacar tarjeta, etc)
## Renovación de ITIN — cuándo y cómo
## Preguntas frecuentes
## Conclusión${US_SEO_SUFFIX}`,
  },
  {
    slug: "declarar-impuestos-itin-deducciones-hispanos-2026",
    category: "educacion",
    imageQuery: "tax filing computer documents calculator",
    preferredAuthor: "javier-keough",
    prompt: `Eres un experto en impuestos para Hispanos con ITIN. Escribe una guía en español.

Keyword principal: "declarar impuestos con ITIN deducciones"
Título H1: "Declarar impuestos con ITIN: deducciones que sí puedes reclamar (2026)"
Extensión: 1100-1300 palabras

Estructura:
## Introducción (keyword primeras 100 palabras — declarar es obligatorio si trabajaste, aún sin papeles)
## Por qué declarar aunque tengas ITIN (build immigration record, evita problemas)
## Formularios y deadlines
(Tabla: Formulario | Para qué | Deadline)
## Deducciones que SÍ puedes reclamar con ITIN
- Standard deduction
- Itemized deductions (mortgage interest, state tax, donations)
- Self-employed deductions
- Child Tax Credit (¡importante!)
- American Opportunity Credit (educación)
## Créditos que NO puedes con ITIN (EITC)
## VITA: ayuda gratis para declarar
(citar IRS.gov directorio VITA con enlace)
## TurboTax / H&R Block: ¿valen la pena?
## Errores comunes
## Preguntas frecuentes
## Conclusión${US_SEO_SUFFIX}`,
  },
];
