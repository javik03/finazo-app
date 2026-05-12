/**
 * Smoke test for quality-gate. Run with:
 *   node_modules/.bin/tsx src/agents/writer/quality-gate.smoke.ts
 *
 * Not a Vitest suite — runs as a script, prints pass/fail, exits non-zero
 * on the bad-article case if it slips through. Useful for CI gate testing
 * without bringing up Vitest infra.
 */

import { evaluateArticle } from "./quality-gate";

const GOOD_ARTICLE = `# Seguro de auto en Tampa para Hispanos con ITIN: tarifas reales 2026

Si manejas en Tampa con ITIN en 2026 y querés tarifa real, esta guía cubre las 4 aseguradoras que aceptan ITIN en Florida, las primas promedio según [Florida OIR rate filing 2025](https://www.floir.com/rate-filings), y el paso a paso para cotizar por WhatsApp con Cubierto en menos de 90 segundos. El [CFPB](https://www.cfpb.gov/data-research/) ha documentado este patrón en informes 2024.

> **Lo esencial:** Sí podés sacar seguro con solo ITIN en Florida.
> Las primas promedio están entre 185 y 340 dólares al mes según OIR 2025.
> Cubierto cotiza con 8+ aseguradoras y la mayoría aceptan ITIN.

![hispanic family signing insurance documents](https://example.com/img1.jpg)

## Las cuatro aseguradoras que aceptan ITIN para conductores hispanos en Tampa Florida en 2026

En Florida, cuatro aseguradoras tienen apetito por conductores con ITIN según public disclosure 2024 al [Florida OIR](https://www.floir.com/): Progressive, GEICO via su brokerage hispano, Direct General, y Bristol West. El [CFPB documenta](https://www.cfpb.gov/data-research/) que estas cuatro representan más del 60% de pólizas no-estándar emitidas a residentes con ITIN en el estado.

Progressive lidera el mercado de Tampa en 2025 con primas mensuales entre 180 y 290 dólares para conductores con 3 años de historial limpio en Hillsborough County.

| Aseguradora | Prima mensual estimada | Acepta ITIN | App en español |
| --- | --- | --- | --- |
| Progressive | 180-290 | Sí | Sí |
| GEICO | 165-260 | Sí | Limitada |
| Bristol West | 220-340 | Sí | Sí |
| Direct General | 240-380 | Sí | Sí |

## Cuánto cuesta el seguro de auto con ITIN en Tampa en 2026 según Florida OIR

Las primas promedio en Tampa para conductores con ITIN entre 25 y 50 años con historial limpio están entre 185 y 340 dólares al mes en 2026, según el [Florida OIR rate filing 2025](https://www.floir.com/rate-filings). La diferencia entre el techo y el piso depende del ZIP code, el vehículo, y el deductible que escojas.

En Hillsborough County los datos del [Florida DHSMV crash dashboard 2024](https://www.flhsmv.gov/resources/crash-and-citation-reports/) muestran 47,200 crashes reportados ese año, lo que afecta la prima base que cobran las aseguradoras de Tampa Bay.

![young hispanic woman phone WhatsApp](https://example.com/img2.jpg)

## Cómo cotizar con Cubierto siendo conductor con ITIN en Tampa Florida en 2026

Cubierto es nuestro corredor afiliado en Florida. Recibimos comisión de la aseguradora cuando te conectamos con Carmen por WhatsApp y emitís póliza — el costo a vos no cambia. El proceso toma 90 segundos y Carmen cotiza con 8+ aseguradoras en una sola conversación según el modelo descrito por el [NAIC](https://www.naic.org/) para corredores no-exclusivos.

## Preguntas frecuentes sobre seguro auto con ITIN en Tampa Florida en 2026

### ¿Necesito Social Security para sacar seguro de auto en Florida en 2026?

No necesitás SSN. Florida no exige SSN para emitir póliza de auto — solo licencia válida (la tuya local, AB-60, o tu pasaporte + matrícula) y comprobante de residencia en el estado.

### ¿Qué aseguradoras aceptan ITIN en Tampa específicamente en 2026?

Progressive, GEICO, Direct General y Bristol West son las cuatro principales según OIR 2025. Cubierto cotiza con todas ellas en una sola conversación.

### ¿Cuánto pagaré en promedio si tengo ITIN y vivo en Tampa en 2026?

Entre 185 y 340 dólares mensual según OIR 2025 para conductores 25-50 años con historial limpio. Tu prima real puede variar por ZIP.

### ¿Puedo usar mi licencia mexicana en Florida en 2026?

Florida acepta licencia extranjera por 30 días desde tu llegada. Después debés convertirla — pero podés tener seguro válido durante ese periodo de transición.

### ¿Cómo cotizo seguro de auto siendo Hispano en Tampa sin SSN?

Hablás con [Carmen de Cubierto](/herramientas/cotizador-seguro) por WhatsApp, le pasás tu información en español, y en 90 segundos tenés 3 opciones reales sin examen ni espera.
`;

const BAD_ARTICLE = `# ITIN

## Conclusión

Como mencionamos antes, esto es lo que tu aseguradora no quiere que sepas. Solo por hoy podés ahorrar 147 dólares.

## Preguntas frecuentes

### ¿Algo?

Sí.
`;

function run(
  name: string,
  content: string,
  expectPass: boolean,
  options: { minWordCount?: number } = {},
): boolean {
  const result = evaluateArticle(content, options);
  const ok = result.pass === expectPass;
  console.log(`[${ok ? "OK" : "FAIL"}] ${name} — expected pass=${expectPass}, got pass=${result.pass}`);
  if (!ok || !expectPass) {
    console.log("  reasons:", result.reasons);
    console.log("  metrics:", result.metrics);
  }
  return ok;
}

// Use minWordCount=500 for the good fixture — it's deliberately compact for
// readability but exercises every other lint. Real articles run with the
// 1200-word default.
const a = run("good article passes structural lints", GOOD_ARTICLE, true, { minWordCount: 500 });
const b = run("bad article is blocked", BAD_ARTICLE, false);

process.exit(a && b ? 0 : 1);
