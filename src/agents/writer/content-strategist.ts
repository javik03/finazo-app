/**
 * Content Strategist — NerdWallet-style proactive article generator
 * Runs daily. Checks which evergreen topics are missing from the DB,
 * generates the top 3 unpublished ones via Claude, publishes immediately.
 *
 * Unlike article-generator.ts (reactive to rate changes),
 * this agent drives organic SEO traffic with comparison guides, FAQs,
 * and "best of" lists across all product verticals.
 */

import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { inArray } from "drizzle-orm";
import { updateArticleContent } from "@/lib/queries/articles";
import { fetchFeaturedImage } from "@/lib/pexels";
import pino from "pino";
import { config } from "@/lib/config";

const logger = pino({ name: "content-strategist" });
const anthropic = new Anthropic({ apiKey: config.ANTHROPIC_API_KEY });

// ---------------------------------------------------------------------------
// Content calendar — NerdWallet-style evergreen topics
// Each entry maps to a unique slug. Once published, it won't regenerate.
// ---------------------------------------------------------------------------

type ContentTopic = {
  slug: string;
  category: "remesas" | "prestamos" | "seguros" | "educacion" | "tarjetas";
  country: string;
  imageQuery: string;
  prompt: string;
};

// SEO instructions appended to every article prompt
const SEO_SUFFIX = `

REGLAS SEO OBLIGATORIAS:
- Incluye la keyword principal exactamente en: el título H1, los primeros 100 palabras, y al menos 2 subtítulos H2
- Densidad de keyword: 1-2% natural (no forzado)
- Incluye una sección "## Preguntas frecuentes" al final con 3-4 preguntas reales que la gente busca en Google, con respuestas de 2-3 oraciones cada una
- Menciona Finazo como herramienta de comparación al menos 1 vez con enlace interno relevante (usa texto como "puedes comparar en [Finazo](/remesas)" o "compara tasas en [Finazo](/prestamos)")
- Usa negritas para los datos numéricos clave (tasas, montos, plazos)

FORMATO OBLIGATORIO — CALLOUT BOX:
Inmediatamente después de la introducción (antes del primer H2), incluye un bloque de citas en Markdown con los 3-4 puntos más importantes del artículo:
> **Lo esencial:** punto clave 1 — brevísimo.
> punto clave 2 — brevísimo.
> punto clave 3 — brevísimo.
> punto clave 4 (si aplica) — brevísimo.
Este bloque aparecerá destacado visualmente en verde para el lector.

FORMATO OBLIGATORIO — TABLAS:
Todas las tablas DEBEN tener encabezados de columna en la primera fila con separadores (| --- |). Ejemplo correcto:
| Servicio | Comisión | Tiempo |
| --- | --- | --- |
| Western Union | 4.99% | Inmediato |
Nunca escribas una tabla sin encabezados.

Al final del artículo, agrega en líneas separadas:
META: [meta description de exactamente 150-160 caracteres con la keyword principal]
KEYWORDS: [lista de 6-8 keywords separadas por comas, de menor a mayor competencia]

Solo el artículo en Markdown.`;

const CONTENT_CALENDAR: ContentTopic[] = [
  // ---- Remesas ----
  {
    slug: "como-enviar-dinero-a-el-salvador-guia-2026",
    category: "remesas",
    country: "SV",
    imageQuery: "money transfer family latin america",
    prompt: `Eres un experto SEO en finanzas personales para Centroamérica. Escribe una guía completa en español optimizada para la búsqueda "cómo enviar dinero a El Salvador".

Keyword principal: "enviar dinero a El Salvador"
Título H1: "Cómo enviar dinero a El Salvador en 2026: guía completa"
Extensión: 1000-1200 palabras

Estructura requerida:
## Introducción (incluir keyword en las primeras 2 oraciones)
## Los mejores servicios de remesas para El Salvador
(Wise, Remitly, Western Union, MoneyGram, Xoom — tarifas y velocidad de cada uno)
## Cómo comparar: tipo de cambio vs comisión total
(Explica que El Salvador usa USD, lo que simplifica la conversión)
## Ejemplo real: ¿cuánto llega si envías $300?
(Tabla con 4 servicios mostrando monto neto recibido)
## Consejos para ahorrar en comisiones
## Preguntas frecuentes
## Conclusión + CTA a Finazo remesas${SEO_SUFFIX}`,
  },
  {
    slug: "wise-vs-remitly-comparacion-centroamerica-2026",
    category: "remesas",
    country: "SV",
    imageQuery: "mobile banking app smartphone payment",
    prompt: `Eres un experto SEO en finanzas personales para Centroamérica. Escribe un artículo comparativo optimizado para "Wise vs Remitly remesas".

Keyword principal: "Wise vs Remitly remesas Centroamérica"
Título H1: "Wise vs Remitly: ¿cuál es mejor para enviar remesas a Centroamérica? (2026)"
Extensión: 1000-1200 palabras

Estructura requerida:
## Introducción (menciona keyword en primeras 2 oraciones)
## Resumen rápido: tabla comparativa Wise vs Remitly
(columnas: comisión, tipo de cambio, velocidad, métodos de pago, métodos de retiro)
## Wise para remesas a Centroamérica: ventajas y limitaciones
## Remitly para remesas a Centroamérica: ventajas y limitaciones
## ¿Cuándo usar Wise? ¿Cuándo usar Remitly?
## Alternativas a considerar (Western Union, MoneyGram para zonas rurales)
## Preguntas frecuentes
## Veredicto final + enlace a comparador de Finazo${SEO_SUFFIX}`,
  },
  {
    slug: "mejores-remesadoras-guatemala-2026",
    category: "remesas",
    country: "GT",
    imageQuery: "guatemala city family remittance",
    prompt: `Eres un experto SEO en finanzas personales para Guatemala. Escribe una guía optimizada para "mejores remesadoras Guatemala".

Keyword principal: "mejores remesadoras Guatemala 2026"
Título H1: "Las mejores remesadoras para Guatemala en 2026: comparativa completa"
Extensión: 1000-1200 palabras

Estructura requerida:
## Introducción (keyword en primeras 2 oraciones; mencionar que Guatemala recibe ~$20B/año en remesas)
## Top 5 servicios para enviar dinero a Guatemala
(Remitly, Wise, Western Union, MoneyGram, Xoom — con tarifas específicas)
## Bancos guatemaltecos que reciben remesas
(Banrural, Banco Industrial, G&T Continental — cómo retirar)
## Quetzales vs dólares: ¿en qué moneda conviene recibir?
## Tabla de comparación: comisiones y tipos de cambio
## Consejos prácticos para familias que reciben remesas
## Preguntas frecuentes
## Conclusión + CTA Finazo${SEO_SUFFIX}`,
  },
  {
    slug: "remesas-honduras-como-recibir-dinero-2026",
    category: "remesas",
    country: "HN",
    imageQuery: "honduras family receiving money",
    prompt: `Eres un experto SEO en finanzas personales para Honduras. Escribe una guía optimizada para "cómo recibir remesas Honduras".

Keyword principal: "recibir remesas Honduras 2026"
Título H1: "Cómo recibir remesas en Honduras en 2026: guía para familias"
Extensión: 1000-1200 palabras

Estructura requerida:
## Introducción (keyword en primeras 2 oraciones; Honduras = ~25% del PIB son remesas)
## Principales servicios para recibir remesas en Honduras
(Remitly, Western Union, Ria Money, MoneyGram, Wise — disponibilidad y tarifas)
## Bancos hondureños que reciben remesas
(Atlántida, Ficohsa, Davivienda, BAC — requisitos y límites)
## Lempiras vs dólares: cómo maximizar lo que recibes
## Tiempos de transferencia y límites por servicio
## Consejos para familias receptoras
## Preguntas frecuentes
## Conclusión + CTA Finazo${SEO_SUFFIX}`,
  },

  // ---- Préstamos ----
  {
    slug: "como-comparar-prestamos-personales-el-salvador-2026",
    category: "prestamos",
    country: "SV",
    imageQuery: "bank loan document signing finance",
    prompt: `Eres un experto SEO en finanzas personales salvadoreñas. Escribe una guía optimizada para "comparar préstamos personales El Salvador".

Keyword principal: "préstamos personales El Salvador 2026"
Título H1: "Cómo comparar préstamos personales en El Salvador 2026: guía con tasas SSF"
Extensión: 1000-1200 palabras

Estructura requerida:
## Introducción (keyword en primeras 2 oraciones)
## Qué es la tasa de interés efectiva anual (TEA) y por qué importa
## Cómo la SSF regula y publica las tasas en El Salvador
## Los bancos con mejores tasas en El Salvador
(Banco Agrícola, Davivienda, BAC, Promerica, Citi — tabla comparativa con rangos de tasas)
## Ejemplo de cálculo: $5,000 a 36 meses al 18% vs 22%
(mostrar diferencia en cuota mensual y costo total)
## Requisitos típicos para un préstamo personal en El Salvador
## Errores comunes al solicitar un préstamo
## Preguntas frecuentes
## Conclusión + CTA al comparador de préstamos de Finazo (/prestamos)${SEO_SUFFIX}`,
  },
  {
    slug: "prestamo-personal-vs-hipotecario-cual-conviene-2026",
    category: "prestamos",
    country: "SV",
    imageQuery: "house mortgage loan keys real estate",
    prompt: `Eres un experto SEO en finanzas de Centroamérica. Escribe un artículo comparativo optimizado para "préstamo personal vs hipotecario".

Keyword principal: "préstamo personal vs hipotecario Centroamérica"
Título H1: "Préstamo personal vs hipotecario: ¿cuál te conviene en 2026?"
Extensión: 1000-1200 palabras

Estructura requerida:
## Introducción (keyword en primeras 2 oraciones)
## Tabla comparativa: préstamo personal vs hipotecario
(columnas: tasa típica, plazo, monto máximo, garantía, tiempo de aprobación)
## Cuándo elegir un préstamo personal
(emergencias médicas, remodelaciones menores, consolidar deudas)
## Cuándo elegir un préstamo hipotecario
(compra de casa, remodelación mayor, importes altos)
## Tasas reales en Centroamérica 2026
(personal: 15-30% anual; hipotecario: 6-12% anual)
## Ejemplo numérico: $20,000 — cuánto pagas con cada tipo
## Preguntas frecuentes
## Conclusión + CTA Finazo préstamos${SEO_SUFFIX}`,
  },
  {
    slug: "mejores-bancos-prestamos-guatemala-sib-2026",
    category: "prestamos",
    country: "GT",
    imageQuery: "bank guatemala finance personal loan",
    prompt: `Eres un experto SEO en finanzas personales guatemaltecas. Escribe una guía optimizada para "mejores bancos préstamos Guatemala".

Keyword principal: "mejores bancos préstamos Guatemala 2026"
Título H1: "Los mejores bancos para préstamos en Guatemala 2026 (tasas SIB oficiales)"
Extensión: 1000-1200 palabras

Estructura requerida:
## Introducción (keyword en primeras 2 oraciones)
## Cómo la SIB regula y publica las tasas de préstamos en Guatemala
## Top 5 bancos guatemaltecos para préstamos personales
(Industrial, Banrural, G&T Continental, BAC, Agromercantil — tabla con tasas min/max)
## Ejemplo práctico: préstamo de Q50,000 (~$6,400) a 24 meses
## Requisitos para aplicar a un préstamo en Guatemala
## Cómo mejorar tu historial crediticio en Guatemala
## Preguntas frecuentes
## Conclusión + CTA Finazo${SEO_SUFFIX}`,
  },
  {
    slug: "prestamos-pyme-centroamerica-guia-2026",
    category: "prestamos",
    country: "SV",
    imageQuery: "small business entrepreneur latin america",
    prompt: `Eres un experto SEO en finanzas empresariales para Centroamérica. Escribe una guía optimizada para "préstamos PYME Centroamérica".

Keyword principal: "préstamos PYME Centroamérica 2026"
Título H1: "Préstamos para PYME en Centroamérica 2026: guía completa para emprendedores"
Extensión: 1000-1200 palabras

Estructura requerida:
## Introducción (keyword en primeras 2 oraciones)
## Tipos de préstamos PYME disponibles en Centroamérica
(capital de trabajo, equipamiento, expansión)
## Bancos vs cooperativas vs fintechs: ¿cuál conviene?
(tabla comparativa: tasa, plazo, garantías, velocidad de aprobación)
## Fondos gubernamentales para PYMES
(FONDEPRO El Salvador, PRONACOM Guatemala — montos y requisitos)
## Ejemplo práctico: negocio que necesita $20,000 de capital de trabajo
## Proceso paso a paso para solicitar un préstamo PYME
## Errores comunes que hacen rechazar solicitudes
## Preguntas frecuentes
## Conclusión + CTA Finazo${SEO_SUFFIX}`,
  },
  {
    slug: "buro-credito-el-salvador-como-funciona-2026",
    category: "educacion",
    country: "SV",
    imageQuery: "credit score report finance document",
    prompt: `Eres un experto SEO en finanzas personales salvadoreñas. Escribe una guía optimizada para "buró de crédito El Salvador".

Keyword principal: "buró de crédito El Salvador 2026"
Título H1: "Buró de Crédito en El Salvador 2026: qué es, cómo funciona y cómo mejorar tu historial"
Extensión: 1000-1200 palabras

Estructura requerida:
## Introducción (keyword en primeras 2 oraciones)
## ¿Qué es el Buró de Crédito en El Salvador? (DICOM/Equifax)
## Cómo afecta tu historial al acceso a préstamos
## Cómo consultar tu historial de crédito gratis en El Salvador
## Los 5 factores que mejoran tu puntaje crediticio
## Los 5 errores que dañan tu crédito
## Cómo recuperar un historial negativo: plan paso a paso
## Preguntas frecuentes
## Conclusión + CTA a comparador de préstamos de Finazo (/prestamos)${SEO_SUFFIX}`,
  },
  {
    slug: "tasa-de-interes-efectiva-anual-que-es-centroamerica",
    category: "educacion",
    country: "SV",
    imageQuery: "interest rate percentage finance calculator",
    prompt: `Eres un experto SEO en finanzas personales de Centroamérica. Escribe una guía educativa optimizada para "tasa de interés efectiva anual".

Keyword principal: "tasa de interés efectiva anual Centroamérica"
Título H1: "¿Qué es la tasa de interés efectiva anual (TEA)? Guía para Centroamérica"
Extensión: 900-1100 palabras

Estructura requerida:
## Introducción (keyword en primeras 2 oraciones)
## Tasa nominal vs tasa efectiva anual: la diferencia que te cuesta dinero
## Cómo calcular la TEA paso a paso
(fórmula: TEA = (1 + tasa nominal/n)^n - 1, con ejemplo numérico)
## Por qué los bancos usan tasas nominales (y cómo te afecta)
## Ejemplo práctico: Banco A al 18% nominal mensual vs Banco B al 19% anual
(¿cuál es más barato realmente?)
## Cómo usar Finazo para comparar la TEA entre bancos
## Preguntas frecuentes
## Conclusión${SEO_SUFFIX}`,
  },

  // ---- Tarjetas de crédito ----
  {
    slug: "tarjetas-credito-el-salvador-guia-2026",
    category: "tarjetas",
    country: "SV",
    imageQuery: "credit card payment wallet finance",
    prompt: `Eres un experto SEO en finanzas personales salvadoreñas. Escribe una guía optimizada para "tarjetas de crédito El Salvador".

Keyword principal: "tarjetas de crédito El Salvador 2026"
Título H1: "Tarjetas de crédito en El Salvador 2026: guía completa para elegir la mejor"
Extensión: 1000-1200 palabras

Estructura requerida:
## Introducción (keyword en primeras 2 oraciones)
## Cómo funcionan las tarjetas de crédito en El Salvador
## Principales tarjetas disponibles en El Salvador 2026
(Visa/MC de Banco Agrícola, Davivienda, BAC, Promerica — tabla con: tasa anual, cuota de manejo, beneficios)
## Tasas de interés en tarjetas: lo que no te dicen (20-35% anual en SV)
## Beneficios reales: cashback, millas, descuentos
## Cómo evitar caer en deuda con tu tarjeta
## Tarjeta vs efectivo vs transferencia: cuándo usar qué
## Preguntas frecuentes
## Conclusión${SEO_SUFFIX}`,
  },
  {
    slug: "como-usar-tarjeta-credito-sin-endeudarse-centroamerica",
    category: "tarjetas",
    country: "SV",
    imageQuery: "credit card debt free financial planning",
    prompt: `Eres un experto SEO en educación financiera para Centroamérica. Escribe una guía práctica optimizada para "cómo usar tarjeta de crédito sin endeudarse".

Keyword principal: "usar tarjeta de crédito sin endeudarse Centroamérica"
Título H1: "Cómo usar tu tarjeta de crédito sin endeudarte: 10 reglas de oro para Centroamérica"
Extensión: 900-1100 palabras

Estructura requerida:
## Introducción (keyword en primeras 2 oraciones; dato: 40% de usuarios de tarjeta pagan solo el mínimo)
## Las 10 reglas de oro (cada regla con título H3 + 2-3 párrafos de explicación):
### 1. Paga el saldo completo cada mes
### 2. Usa máximo el 30% de tu límite de crédito
### 3. Activa alertas de gasto en tu banco
### 4. Nunca saques efectivo con la tarjeta
### 5. Compara tasas antes de aplicar
### 6. Entiende el período de gracia
### 7. Revisa tu estado de cuenta cada semana
### 8. Ten solo las tarjetas que realmente usas
### 9. Nunca pagues solo el mínimo
### 10. Usa la tarjeta como herramienta, no como ingreso extra
## Preguntas frecuentes
## Conclusión${SEO_SUFFIX}`,
  },

  // ---- Seguros ----
  {
    slug: "seguro-de-vida-el-salvador-guia-2026",
    category: "seguros",
    country: "SV",
    imageQuery: "life insurance family protection umbrella",
    prompt: `Eres un experto SEO en seguros para Centroamérica. Escribe una guía optimizada para "seguro de vida El Salvador".

Keyword principal: "seguro de vida El Salvador 2026"
Título H1: "Seguro de vida en El Salvador 2026: qué es, cuánto cuesta y cómo elegir"
Extensión: 1000-1200 palabras

Estructura requerida:
## Introducción (keyword en primeras 2 oraciones)
## ¿Por qué contratar un seguro de vida en El Salvador?
## Tipos de seguro de vida disponibles
(temporal, permanente, dotal — diferencias y cuándo elegir cada uno)
## Cuánto cuesta un seguro de vida en El Salvador
(tabla: $50,000 de cobertura para hombre/mujer de 25, 35, 45 años)
## Las principales aseguradoras de El Salvador
(SISA, ASSA, Seguros Universales, Scotia Seguros — pros y contras)
## Cómo calcular cuánta cobertura necesitas
(regla: 10-12x tu ingreso anual + deudas)
## Pasos para contratar un seguro de vida
## Preguntas frecuentes
## Conclusión${SEO_SUFFIX}`,
  },
  {
    slug: "seguro-medico-el-salvador-guia-2026",
    category: "seguros",
    country: "SV",
    imageQuery: "health insurance medical doctor hospital",
    prompt: `Eres un experto SEO en seguros de salud para Centroamérica. Escribe una guía optimizada para "seguro médico El Salvador".

Keyword principal: "seguro médico El Salvador 2026"
Título H1: "Seguro médico en El Salvador 2026: cómo elegir el mejor para tu familia"
Extensión: 1000-1200 palabras

Estructura requerida:
## Introducción (keyword en primeras 2 oraciones; mencionar que ISSS cubre solo empleados formales)
## ISSS vs seguro médico privado: diferencias clave
(acceso, cobertura, tiempos de espera, hospitales disponibles)
## Principales aseguradoras de salud en El Salvador
(SISA, ASSA, Mapfre, Pan-American Life — tabla: prima mensual, copago, red hospitalaria)
## ¿Qué cubre y qué no cubre un seguro médico privado?
(lista clara: sí cubre / no cubre)
## Cuánto cuesta un seguro médico en El Salvador
(rangos para persona individual, pareja, familia de 4)
## Cómo elegir entre HMO y PPO (si aplica localmente)
## Pasos para contratar y qué revisar en la póliza
## Preguntas frecuentes
## Conclusión${SEO_SUFFIX}`,
  },
  {
    slug: "seguro-de-auto-el-salvador-guia-2026",
    category: "seguros",
    country: "SV",
    imageQuery: "car insurance vehicle road safety",
    prompt: `Eres un experto SEO en seguros de vehículos para El Salvador. Escribe una guía optimizada para "seguro de auto El Salvador".

Keyword principal: "seguro de auto El Salvador 2026"
Título H1: "Seguro de auto en El Salvador 2026: obligatorio vs todo riesgo — guía completa"
Extensión: 1000-1200 palabras

Estructura requerida:
## Introducción (keyword en primeras 2 oraciones)
## Seguro obligatorio (SOAT) vs seguro voluntario: qué es obligatorio por ley
## Tipos de cobertura para vehículos en El Salvador
(responsabilidad civil, robo, daños propios, todo riesgo — diferencias y costos)
## Tabla comparativa de aseguradoras en El Salvador
(SISA, ASSA, La Centroamericana, Qualitas — prima mensual para auto de $15,000)
## Factores que afectan el precio de tu seguro de auto
(año del vehículo, zona de residencia, historial de siniestros)
## ¿Qué hacer en caso de accidente? Paso a paso
## Cómo ahorrar en tu seguro sin reducir cobertura
## Preguntas frecuentes
## Conclusión${SEO_SUFFIX}`,
  },
  {
    slug: "seguros-de-hogar-el-salvador-2026",
    category: "seguros",
    country: "SV",
    imageQuery: "home insurance house protection safety",
    prompt: `Eres un experto SEO en seguros de bienes para El Salvador. Escribe una guía optimizada para "seguro de hogar El Salvador".

Keyword principal: "seguro de hogar El Salvador 2026"
Título H1: "Seguro de hogar en El Salvador 2026: protege tu casa contra terremotos, robo e inundaciones"
Extensión: 900-1100 palabras

Estructura requerida:
## Introducción (keyword en primeras 2 oraciones; mencionar riesgo sísmico en El Salvador)
## ¿Qué cubre un seguro de hogar en El Salvador?
(incendio, terremoto, robo, daños por agua — tabla: qué incluye cada tipo de póliza)
## Cobertura estructural vs contenido del hogar: diferencia importante
## Cuánto cuesta un seguro de hogar en El Salvador
(rangos para casa de $40,000 / $80,000 / $150,000)
## Las mejores aseguradoras de hogar en El Salvador
(SISA, ASSA, La Centroamericana — comparativa breve)
## Lo que no cubre la mayoría de pólizas (sorpresas comunes)
## Cómo hacer un inventario del hogar para asegurarte correctamente
## Preguntas frecuentes
## Conclusión${SEO_SUFFIX}`,
  },

  // ---- Remesas — Nicaragua y México ----
  {
    slug: "remesas-nicaragua-como-enviar-recibir-2026",
    category: "remesas",
    country: "NI",
    imageQuery: "nicaragua family money transfer remittance",
    prompt: `Eres un experto SEO en finanzas personales para Nicaragua. Escribe una guía optimizada para "remesas Nicaragua".

Keyword principal: "remesas Nicaragua 2026"
Título H1: "Cómo enviar y recibir remesas en Nicaragua 2026: guía completa"
Extensión: 1000-1200 palabras

Estructura requerida:
## Introducción (keyword en primeras 2 oraciones; dato: Nicaragua recibe ~$4B/año en remesas, ~20% del PIB)
## Principales servicios para enviar dinero a Nicaragua
(Remitly, Western Union, Ria, MoneyGram, Xoom — tarifas y velocidad)
## Cómo recibir remesas en Nicaragua: opciones bancarias y en efectivo
(Banpro, BAC, Western Union agencias — requisitos de identificación)
## Córdobas vs dólares: en qué moneda conviene recibir
## Tiempos de transferencia y límites por servicio
## Consejos para familias receptoras de remesas en Nicaragua
## Preguntas frecuentes
## Conclusión + CTA Finazo${SEO_SUFFIX}`,
  },

  // ---- Ahorro e inversión ----
  {
    slug: "como-ahorrar-dinero-en-el-salvador-2026",
    category: "educacion",
    country: "SV",
    imageQuery: "savings piggy bank money jar coins",
    prompt: `Eres un experto SEO en finanzas personales para El Salvador. Escribe una guía práctica optimizada para "cómo ahorrar dinero en El Salvador".

Keyword principal: "cómo ahorrar dinero en El Salvador 2026"
Título H1: "Cómo ahorrar dinero en El Salvador 2026: plan paso a paso con ejemplos reales"
Extensión: 1000-1200 palabras

Estructura requerida:
## Introducción (keyword en primeras 2 oraciones; dato: 70% de salvadoreños no tiene ahorros formales)
## Por qué es difícil ahorrar en El Salvador y cómo superar esos obstáculos
## El método del 50/30/20 adaptado a ingresos salvadoreños
(ejemplo con salario mínimo $365, salario medio $600, salario $1,000)
## Las mejores cuentas de ahorro en El Salvador
(Banco Agrícola, Davivienda, BAC, cooperativas — tasas y condiciones)
## Fondo de emergencia: cuánto necesitas y dónde guardarlo
(3-6 meses de gastos; cálculo para familia típica salvadoreña)
## Errores que destruyen tus ahorros (y cómo evitarlos)
## Aplicaciones y herramientas para controlar gastos desde El Salvador
## Preguntas frecuentes
## Conclusión${SEO_SUFFIX}`,
  },
  {
    slug: "inversiones-para-principiantes-centroamerica-2026",
    category: "educacion",
    country: "SV",
    imageQuery: "investment growth stock market chart finance",
    prompt: `Eres un experto SEO en educación financiera para Centroamérica. Escribe una guía optimizada para "inversiones para principiantes Centroamérica".

Keyword principal: "inversiones para principiantes Centroamérica 2026"
Título H1: "Cómo invertir desde Centroamérica siendo principiante: guía 2026"
Extensión: 1000-1200 palabras

Estructura requerida:
## Introducción (keyword en primeras 2 oraciones)
## Antes de invertir: el fondo de emergencia es primero
## Las 5 opciones de inversión más accesibles desde Centroamérica
(1. Cuentas de ahorro a plazo fijo — seguro, baja rentabilidad
2. Certificados de depósito bancarios (CDPs) — tasas actuales en SV/GT/HN
3. Fondos de inversión locales — opciones disponibles
4. Bolsa de valores (BVES en El Salvador) — cómo acceder
5. Acciones internacionales vía apps (Interactive Brokers, etc.))
## Riesgo vs rentabilidad: cómo pensar en esto desde nuestra región
## Tabla comparativa: rendimiento esperado vs riesgo para cada opción
## Errores clásicos del inversor principiante en LATAM
## Preguntas frecuentes
## Conclusión${SEO_SUFFIX}`,
  },
];

// ---------------------------------------------------------------------------
// Generate and save one evergreen article (published immediately)
// ---------------------------------------------------------------------------

async function generateEvergreenArticle(topic: ContentTopic): Promise<void> {
  logger.info({ slug: topic.slug }, "Generating evergreen article");

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
    })
    .onConflictDoNothing(); // never overwrite existing articles

  logger.info({ slug: topic.slug, wordCount, category: topic.category, keywordsCount: keywords?.length ?? 0, hasImage: !!featuredImageUrl }, "Evergreen article published");
}

// ---------------------------------------------------------------------------
// Regenerate an existing article (admin action — force-overwrites content)
// ---------------------------------------------------------------------------

export async function regenerateEvergreenArticle(slug: string): Promise<void> {
  const topic = CONTENT_CALENDAR.find((t) => t.slug === slug);
  if (!topic) {
    logger.warn({ slug }, "Slug not found in CONTENT_CALENDAR — cannot regenerate");
    throw new Error(`Slug "${slug}" not found in content calendar`);
  }

  logger.info({ slug }, "Regenerating evergreen article");

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    messages: [{ role: "user", content: topic.prompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type from Claude");
  }

  const fullText = content.text;

  const metaMatch = fullText.match(/META:\s*(.+)$/m);
  const metaDescription = metaMatch ? metaMatch[1].trim() : null;

  const keywordsMatch = fullText.match(/KEYWORDS:\s*\[([^\]]+)\]/);
  const keywords = keywordsMatch
    ? keywordsMatch[1].split(",").map((k) => k.trim()).filter(Boolean)
    : null;

  const articleContent = fullText
    .replace(/^META:.*$/m, "")
    .replace(/^KEYWORDS:.*$/m, "")
    .trim();

  const titleMatch = articleContent.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : topic.slug.replace(/-/g, " ");
  const wordCount = articleContent.split(/\s+/).length;

  const featuredImageUrl = await fetchFeaturedImage(topic.imageQuery);

  await updateArticleContent(slug, { title, content: articleContent, metaDescription, keywords, wordCount, featuredImageUrl });

  logger.info({ slug, wordCount, hasImage: !!featuredImageUrl }, "Evergreen article regenerated");
}

// ---------------------------------------------------------------------------
// Main runner
// ---------------------------------------------------------------------------

export async function runContentStrategist(): Promise<void> {
  logger.info("Content strategist starting");

  // Find which slugs already exist
  const allSlugs = CONTENT_CALENDAR.map((t) => t.slug);
  const existing = await db
    .select({ slug: articles.slug })
    .from(articles)
    .where(inArray(articles.slug, allSlugs));

  const existingSlugs = new Set(existing.map((r) => r.slug));
  const missing = CONTENT_CALENDAR.filter((t) => !existingSlugs.has(t.slug));

  if (missing.length === 0) {
    logger.info("All evergreen articles already published — nothing to do");
    return;
  }

  logger.info({ total: missing.length }, "Missing evergreen articles found");

  // Generate up to 3 per run to respect API rate limits
  const batch = missing.slice(0, 3);

  for (const topic of batch) {
    try {
      await generateEvergreenArticle(topic);
      // Throttle between Claude API calls
      await new Promise((r) => setTimeout(r, 4000));
    } catch (err) {
      logger.error({ err, slug: topic.slug }, "Failed to generate evergreen article");
    }
  }

  logger.info({ generated: batch.length }, "Content strategist run complete");
}

if (require.main === module) {
  runContentStrategist().catch((err) => {
    logger.error(err, "Content strategist failed");
    process.exit(1);
  });
}
