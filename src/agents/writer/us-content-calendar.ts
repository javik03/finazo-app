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
};

// ─── Shared SEO + E-E-A-T suffix appended to every prompt ──────────────────

export const US_SEO_SUFFIX = `

REGLAS SEO (obligatorias):
- Titular plain-Spanish primero ("sin Social Security"); ITIN como mención técnica secundaria, no como keyword principal del título.
- Incluye la keyword principal en: H1, primer párrafo (primeras 100 palabras), y al menos 2 H2.
- Densidad de keyword 1-2% natural — nunca forzada.
- Mínimo una sección "## Preguntas frecuentes" al final (3-5 preguntas reales que la gente busca, respuestas de 2-3 oraciones).
- Mínimo una tabla comparativa con encabezados en formato Markdown:
  | Producto | Métrica 1 | Métrica 2 |
  | --- | --- | --- |
- Datos numéricos clave en negritas (APR, montos, plazos).
- Términos en inglés cuando son de uso común (APR, credit score, ITIN, FICO, SSN, ACA).

REGLAS E-E-A-T (obligatorias):
- Cita al menos 2 fuentes públicas verificables con enlace markdown — IRS.gov, CFPB.gov, HealthCare.gov, FRED, KFF, Freddie Mac PMMS, state DOI, etc.
- Incluye un enlace a la metodología de Finazo: "[según nuestra metodología](/metodologia)".
- Incluye un enlace al perfil del autor (Finazo lo insertará en el byline; tú no escribas el byline).
- Si recomiendas un producto pagado de socio (Cubierto, Hogares), incluye una línea de divulgación: "Cubierto / Hogares es parte de Kornugle. Recibimos comisión cuando te conectas con ellos — no de ti, del proveedor."

ENLACES INTERNOS — usa SOLO rutas de finazo.us:
- Préstamos → "[compara opciones de préstamo en Finazo](/us/prestamos)"
- Seguro de auto → "[compara seguros de auto](/us/seguro-de-auto)"
- Seguro de salud → "[compara planes de salud](/us/seguro-de-salud)"
- Seguro de vida → "[compara seguros de vida](/us/seguro-de-vida)"
- Hipoteca → "[pre-califica tu hipoteca](/us/hipotecas)"
- Crédito / score → "[construye tu credit score](/us/credito)"
- Remesas → "[compara apps de remesas](/us/herramientas/comparador-remesas)"
- Cotizador seguro → "[cotiza con 8+ aseguradoras](/us/herramientas/cotizador-seguro)"
- Simulador hipoteca → "[simula tu pago mensual](/us/herramientas/simulador-hipoteca)"

NUNCA enlaces a finazo.lat — esos son contenidos LATAM.

FORMATO OBLIGATORIO — CALLOUT BOX:
Inmediatamente después de la introducción (antes del primer H2), un blockquote con los 3-4 puntos clave:
> **Lo esencial:** punto 1 brevísimo.
> punto 2 brevísimo.
> punto 3 brevísimo.

CONVERSIÓN — BLOQUES CTA OBLIGATORIOS según categoría:

Si el artículo es de SEGUROS (auto/hogar/salud/vida) — incluye DOS CTAs:
1. CTA inline (en mitad del artículo, después de la tabla comparativa o sección "alternativas"):
> **Cotiza ahora con Cubierto** — Compara con 8+ aseguradoras en 90 segundos por WhatsApp. Sin llamadas, en español, gratis para ti. [Hablar con Carmen →](https://wa.me/13055551234?text=Hola%20Carmen%2C%20cotizar%20seguro)

2. CTA al final (antes de Preguntas frecuentes):
## ¿Listo para cotizar?
[Compara con 8+ aseguradoras en Cubierto](/us/herramientas/cotizador-seguro) — toma menos de 2 minutos. O escribe a Carmen directamente por WhatsApp y te cotiza con tarifas reales.

Si el artículo es de HIPOTECAS / COMPRA DE CASA — incluye DOS CTAs:
1. CTA inline (después de explicar opciones non-QM o ITIN):
> **Pre-califícate con Hogares** — Si el banco tradicional te dijo que no, Hogares te conecta con 4 wholesalers non-QM en 24 horas. ITIN, self-employed y bank-statement loans aceptados. [Hablar con Sofía →](https://wa.me/13055551234?text=Hola%20Sofia%2C%20pre-calificar%20hipoteca)

2. CTA al final:
## ¿Listo para pre-calificar?
[Pre-calificación gratis con Hogares](/us/hipotecas) — respuesta en 24 horas. O simula tu pago mensual con el [simulador de hipoteca](/us/herramientas/simulador-hipoteca).

Si el artículo es de CRÉDITO / BANKING / TAXES / EDUCACIÓN — incluye UN CTA al final:
## ¿Tienes una pregunta específica?
[Pregúntale a Finazo por WhatsApp](https://wa.me/13055551234?text=Hola%20Finazo) — el bot te responde en español, sin tener que descargar nada. O usa el [tracker de credit score](/us/herramientas/credit-tracker) para tu plan personal.

Si el artículo es de REMESAS — incluye UN CTA al final:
## ¿Cuánto te ahorras hoy?
[Compara apps de remesas en vivo](/us/herramientas/comparador-remesas) — Wise vs Remitly vs Western Union, comisiones reales actualizadas cada 6 horas para el corredor que tú eliges.

FORMATO OBLIGATORIO — DIVULGACIÓN AL PIE (cuando menciones Cubierto/Hogares/afiliados):
Al final del artículo, antes de META:
> **Divulgación:** Cubierto y Hogares son parte de Kornugle (mismo grupo que Finazo). Recibimos comisión cuando te conectamos con un agente — la paga la aseguradora o el wholesaler, no tú. Más detalles en nuestra [metodología](/metodologia).

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
    preferredAuthor: "sabrina-keough",
    homepageSeed: true,
    prompt: `Eres un experto en seguros de auto para la comunidad Hispana en EE.UU. Escribe un artículo comparativo en español optimizado para "Fred Loya alternativa".

Contexto: Fred Loya es popular entre Hispanos pero tiene quejas conocidas de servicio al cliente y precios elevados. Los lectores buscan alternativas confiables.

Keyword principal: "Fred Loya alternativa"
Título H1: "Fred Loya: 5 alternativas más baratas para Hispanos en 2026"
Extensión: 1200-1400 palabras

Estructura requerida:
## Introducción (keyword en primeras 100 palabras; menciona quejas reales de CFPB si aplica)
## Por qué buscar alternativa a Fred Loya
(Tabla: Aseguradora alternativa | Prima mensual estimada | ITIN aceptado | Quejas CFPB | Estados disponibles)
## Alternativa 1: Infinity (foco en mercado Hispano, ITIN-friendly)
## Alternativa 2: Direct General (sin licencia OK en algunos estados)
## Alternativa 3: Progressive (cobertura amplia, app en español)
## Alternativa 4: GEICO (mejor precio para conductores limpios)
## Alternativa 5: Cubierto — broker que cotiza con 8+ aseguradoras
(menciona divulgación de comisión)
## Cómo cambiar de Fred Loya sin penalización
## Preguntas frecuentes
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
## 4 alternativas confiables para Hispanos en Florida
(Tabla: Aseguradora | Prima FL estimada | ITIN | Cobertura PIP | Reputación CFPB)
## Alternativa 1: Infinity (líder mercado Hispano)
## Alternativa 2: Ocean Harbor (FL específico)
## Alternativa 3: Windhaven (cobertura SR-22)
## Alternativa 4: Cubierto — cotiza con 8+ aseguradoras desde WhatsApp
(divulgación de comisión)
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
## Servicio al cliente (CFPB complaint counts)
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
    preferredAuthor: "sabrina-keough",
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
(divulgación de comisión)
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
(divulgación)
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
(divulgación)
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
    preferredAuthor: "sabrina-keough",
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
    preferredAuthor: "sabrina-keough",
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
    preferredAuthor: "sabrina-keough",
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
## Conclusión + CTA al [comparador en vivo](/us/herramientas/comparador-remesas)${US_SEO_SUFFIX}`,
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
