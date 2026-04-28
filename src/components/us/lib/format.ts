/**
 * Spanish date + reading-time helpers for US site.
 */

const MS_PER_DAY = 86_400_000;
const WORDS_PER_MIN = 220; // Spanish reading speed average

export function formatRelativeDate(date: Date | null | undefined): string {
  if (!date) return "";
  const now = Date.now();
  const then = date instanceof Date ? date.getTime() : new Date(date).getTime();
  const days = Math.floor((now - then) / MS_PER_DAY);

  if (days < 1) return "Hoy";
  if (days === 1) return "Ayer";
  if (days < 7) return `Hace ${days} días`;
  if (days < 14) return "Hace 1 semana";
  if (days < 30) return `Hace ${Math.floor(days / 7)} semanas`;
  if (days < 60) return "Hace 1 mes";
  if (days < 365) return `Hace ${Math.floor(days / 30)} meses`;
  return `Hace ${Math.floor(days / 365)} año${Math.floor(days / 365) === 1 ? "" : "s"}`;
}

export function readingTime(wordCount: number | null | undefined): string {
  if (!wordCount || wordCount < 1) return "5 min";
  const mins = Math.max(1, Math.round(wordCount / WORDS_PER_MIN));
  return `${mins} min`;
}

const DAYS_ES = [
  "domingo",
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
];
const MONTHS_ES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

export function formatLongDateEs(date: Date): string {
  const day = DAYS_ES[date.getDay()];
  const dayNum = date.getDate();
  const month = MONTHS_ES[date.getMonth()];
  const year = date.getFullYear();
  return `${day.charAt(0).toUpperCase()}${day.slice(1)}, ${dayNum} de ${month} de ${year}`;
}
