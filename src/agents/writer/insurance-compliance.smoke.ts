/**
 * Smoke tests for insurance-compliance lint additions to quality-gate.
 *
 * Run:
 *   node_modules/.bin/tsx src/agents/writer/insurance-compliance.smoke.ts
 *
 * Covers the three Lanham/FDUTPA-exposure patterns from
 * finazo-insurance-compliance.md:
 *   1. CFPB cited as a source on insurance topics → must fail
 *   2. Flat pricing claims without source/date/state → must fail
 *   3. Unsourced flat factual claims about named competitors → must fail
 *
 * Also verifies the lint is OFF when category !== "seguros".
 */

import { evaluateArticle } from "./quality-gate";

let failures = 0;
function check(name: string, condition: boolean, info?: unknown): void {
  if (condition) {
    console.log(`[OK]   ${name}`);
  } else {
    console.log(`[FAIL] ${name}`, info ?? "");
    failures += 1;
  }
}

// ─── Article 1: CFPB cited for insurance complaint data ───────────────────

const CFPB_IN_INSURANCE = `# Progressive vs GEICO: comparativo para Hispanos 2026

Esta guía compara dos aseguradoras populares.

## Servicio al cliente y reputación CFPB

Según el Consumer Financial Protection Bureau (CFPB), Progressive recibe más quejas que el promedio del sector. GEICO obtiene mejores calificaciones en consumerfinance.gov.

## Más detalles

Contenido adicional aquí.

## Preguntas frecuentes sobre Progressive vs GEICO en 2026

### ¿Cuál es más barata?

Depende del estado.

### ¿Cuál acepta ITIN?

Ambas aceptan ITIN.
`;

const cfpbCheck = evaluateArticle(CFPB_IN_INSURANCE, { category: "seguros", minWordCount: 50 });
check(
  "CFPB-as-source for insurance is detected",
  (cfpbCheck.metrics.insuranceCompliance?.cfpbMentions ?? 0) >= 3,
  { cfpb: cfpbCheck.metrics.insuranceCompliance?.cfpbMentions },
);
check(
  "CFPB-for-insurance article fails gate",
  !cfpbCheck.pass,
);
check(
  "CFPB reason mentions Dodd-Frank § 1027(f)",
  cfpbCheck.reasons.some((r) => r.includes("Dodd-Frank") || r.includes("1027")),
);

// Same content under category="prestamos" (credit, where CFPB DOES apply) should NOT trigger.
const credentialsCheck = evaluateArticle(CFPB_IN_INSURANCE, { category: "prestamos", minWordCount: 50 });
check(
  "CFPB is OK for credit/loans category (CFPB does have jurisdiction there)",
  !credentialsCheck.reasons.some((r) => r.includes("CFPB no tiene jurisdicción")),
);

// ─── Article 2: flat pricing claim without source ─────────────────────────

const FLAT_PRICING = `# Aseguranzas de auto comparadas 2026

Estas son las opciones más populares.

> **Lo esencial:** comparamos primas. Sin fuente. Sin contexto.

## Comparativa de primas anuales para Hispanos en EE.UU. en 2026

Progressive: $1,980/año (~$165/mes)
GEICO: $1,740/año (~$145/mes)
State Farm: $2,100/año (~$175/mes)

| Aseguradora | Prima |
| --- | --- |
| Progressive | $1,980 |
| GEICO | $1,740 |

## Preguntas frecuentes sobre primas en 2026

### ¿Cuánto cuesta?

Como ves arriba.

### ¿Por qué?

Es complicado.

### ¿Es real?

Sí.

### ¿Y si vivo en otro estado?

Pregunta abierta.

### ¿Cuándo cambian las primas?

Cada renovación.
`;

const pricingCheck = evaluateArticle(FLAT_PRICING, { category: "seguros", minWordCount: 50 });
check(
  "Flat pricing claims without source are detected",
  (pricingCheck.metrics.insuranceCompliance?.unsourcedPricingClaims?.length ?? 0) >= 2,
  { found: pricingCheck.metrics.insuranceCompliance?.unsourcedPricingClaims },
);
check(
  "Flat-pricing article fails gate",
  !pricingCheck.pass,
);

// Sourced pricing should PASS the pricing rule (other gate rules may still fail).
const SOURCED_PRICING = `# Aseguranzas de auto 2026

Comparamos opciones para Hispanos.

> **Lo esencial:** las primas varían mucho por estado.

## Comparativa con datos públicos para conductores hispanos en 2026

Según el reporte ValuePenguin 2024 para conductores con buen historial, las primas anuales para cobertura completa varían así por estado: Progressive típicamente cae entre $1,440 (Carolina del Norte) y $2,890 (Florida) según las cifras 2024 de Insurance Information Institute (iii.org).

En nuestra experiencia ayudando a conductores hispanos en Tampa, GEICO tiende a ser más barata para perfiles con buen crédito, mientras Progressive suele ser más competitiva para conductores nuevos o con infracciones.

| Aseguradora | Rango anual (ValuePenguin 2024) |
| --- | --- |
| Progressive | $1,440-$2,890 |
| GEICO | $1,200-$2,640 |

![INLINE: hispanic family insurance](https://example.com/img.jpg)
![INLINE: phone whatsapp](https://example.com/img2.jpg)

## Preguntas frecuentes sobre primas para Hispanos en 2026

### ¿Cuánto cuesta seguro de auto para Hispanos sin SSN en 2026?

Según ValuePenguin 2024, varía entre $1,440 y $2,890 anuales.

### ¿Qué hace que mi prima sea más alta?

ZIP code, historial, vehículo, crédito.

### ¿GEICO es siempre la más barata?

No. En nuestra experiencia depende del perfil.

### ¿Florida es caro?

Sí, según las cifras 2024 de iii.org.

### ¿Cómo cotizo?

Por WhatsApp con Cubierto. Más en [IRS.gov](https://www.irs.gov) y [Healthcare.gov](https://www.healthcare.gov).
`;

const sourcedCheck = evaluateArticle(SOURCED_PRICING, { category: "seguros", minWordCount: 100 });
check(
  "Sourced + hedged pricing does NOT trigger insurance-compliance failures",
  (sourcedCheck.metrics.insuranceCompliance?.cfpbMentions ?? 0) === 0
    && (sourcedCheck.metrics.insuranceCompliance?.unsourcedPricingClaims?.length ?? 0) === 0
    && (sourcedCheck.metrics.insuranceCompliance?.unsourcedCompetitorClaims?.length ?? 0) === 0,
  sourcedCheck.metrics.insuranceCompliance,
);

// ─── Article 3: unsourced competitor flat claims ──────────────────────────

const FLAT_COMPETITOR = `# Comparativa Fred Loya vs Infinity para Hispanos 2026

Esta guía explica diferencias.

> **Lo esencial:** análisis honesto.

## Quejas de servicio de carriers populares en 2026

Fred Loya recibe muchas quejas de clientes hispanos. Progressive es más restrictiva con conductores ITIN. GEICO requiere SSN para cotizar en línea. State Farm cobra de más por perfiles sin historial crediticio.

| Carrier | Quejas |
| --- | --- |
| Fred Loya | Alto |
| Progressive | Medio |

![INLINE: insurance compare](https://example.com/img.jpg)
![INLINE: hispanic driver](https://example.com/img2.jpg)

## Preguntas frecuentes sobre carriers para Hispanos en 2026

### ¿Cuál acepta ITIN sin restricciones?

Varía por carrier.

### ¿Cuál es la más barata?

Depende del estado.

### ¿Vale la pena cambiar de Fred Loya?

Para muchos sí.

### ¿Cuándo es buen momento?

Antes de renovación.

### ¿Y si tengo SR-22?

Algunas carriers especializan en SR-22.

Visitá [NAIC](https://content.naic.org) y [IRS.gov](https://www.irs.gov).
`;

const competitorCheck = evaluateArticle(FLAT_COMPETITOR, { category: "seguros", minWordCount: 50 });
check(
  "Unsourced competitor claims are detected",
  (competitorCheck.metrics.insuranceCompliance?.unsourcedCompetitorClaims?.length ?? 0) >= 1,
  { found: competitorCheck.metrics.insuranceCompliance?.unsourcedCompetitorClaims?.slice(0, 2) },
);
check(
  "Unsourced-competitor-claim article fails gate",
  !competitorCheck.pass,
);

// ─── Negative: non-insurance articles bypass insurance lints ──────────────

const NON_INSURANCE = `# Tarjetas aseguradas para construir credit sin Social Security

Estas son las cinco opciones más comunes.

Discover Secured: $200/año. Capital One Platinum: $49/año.

Progressive es buena pero esto es sobre crédito, no seguros.

Según el CFPB en 2024, las tarjetas aseguradas son la forma más rápida de empezar.
`;

const nonInsCheck = evaluateArticle(NON_INSURANCE, { category: "tarjetas", minWordCount: 20 });
check(
  "Insurance lints OFF when category is not 'seguros'",
  nonInsCheck.metrics.insuranceCompliance === undefined,
);

console.log(failures === 0 ? "\nALL SMOKE TESTS PASSED" : `\n${failures} SMOKE TESTS FAILED`);
process.exit(failures === 0 ? 0 : 1);
