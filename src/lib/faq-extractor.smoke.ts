import { extractFaqEntries, buildFaqSchema } from "./faq-extractor";

const SAMPLE = `# Test article

Intro paragraph.

## Some other H2

Body content.

## Preguntas frecuentes sobre seguro auto con ITIN en Tampa Florida en 2026

### ¿Necesito Social Security para sacar seguro de auto en Florida en 2026?

No necesitás SSN. Florida no exige SSN para emitir póliza de auto.

### ¿Qué aseguradoras aceptan ITIN en Tampa en 2026?

Progressive, GEICO, Direct General y Bristol West son las cuatro principales según OIR 2025.

### ¿Cuánto pagaré en promedio si tengo ITIN en 2026?

Entre 185 y 340 dólares mensual.

## Another H2 after FAQ

This should not be included in the FAQ.
`;

const entries = extractFaqEntries(SAMPLE);
console.log("entries.length:", entries.length);
console.log("Q1:", entries[0]?.question);
console.log("A1:", entries[0]?.answer);
console.log("Q3:", entries[2]?.question);

const schema = buildFaqSchema(entries);
console.log("schema @type:", (schema as { "@type"?: string } | null)?.["@type"]);
console.log("mainEntity count:", (schema as { mainEntity?: unknown[] } | null)?.mainEntity?.length);

const ok = entries.length === 3 && entries[0].question.startsWith("¿Necesito") && schema !== null;
process.exit(ok ? 0 : 1);
