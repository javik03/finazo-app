/**
 * Hero aside — 3-step funnel that ends in a WhatsApp handoff.
 * Step 1: pick interest (auto / casa / remesa / info)
 * Step 2: pick state (only for auto + casa)
 * Step 3: WhatsApp handoff with persona (Carmen for insurance, Sofía for mortgage)
 *
 * Personas are V1 placeholders — destination is the future Finazo AI bot.
 */

"use client";

import { useState } from "react";

type Step = 1 | 2 | 3;
type Intent = "auto" | "casa" | "remesa" | "info" | null;

const WA_BASE = "https://wa.me/13055551234";

type FinalState = {
  avatarLetter: string;
  title: React.ReactNode;
  subtitle: string;
  ctaLabel: string;
  href: string;
};

function buildFinalState(intent: Exclude<Intent, null>, state: string): FinalState {
  if (intent === "info") {
    return {
      avatarLetter: "F",
      title: <>Empezá por <i>acá</i>.</>,
      subtitle: "240+ guías en español. Sin jerga, sin ventas.",
      ctaLabel: "Ver las guías",
      href: "/guias",
    };
  }
  if (intent === "remesa") {
    return {
      avatarLetter: "F",
      title: <>Te mostramos dónde <i>sale más barato</i>.</>,
      subtitle: "Wise, Remitly, Western Union — comparados en vivo.",
      ctaLabel: "Ver comparador",
      href: "/herramientas/comparador-remesas",
    };
  }
  if (intent === "casa") {
    return {
      avatarLetter: "S",
      title: <><i>Sofía</i> te espera.</>,
      subtitle:
        "Pre-calificación sin Social Security (ITIN/non-QM) con 4 wholesalers. El banco dijo no — Sofía sí.",
      ctaLabel: "Abrir WhatsApp con Sofía",
      href: `${WA_BASE}?text=${encodeURIComponent(`Hola Sofia, pre-calificar en ${state}`)}`,
    };
  }
  return {
    avatarLetter: "C",
    title: <><i>Carmen</i> te espera.</>,
    subtitle: "8+ aseguradoras. Cotización por WhatsApp en 90 segundos.",
    ctaLabel: "Abrir WhatsApp con Carmen",
    href: `${WA_BASE}?text=${encodeURIComponent(`Hola Carmen, cotizar en ${state}`)}`,
  };
}

const STATE_OPTIONS: Array<{ code: string; label: string; emoji: string }> = [
  { code: "FL", label: "Florida", emoji: "🌴" },
  { code: "TX", label: "Texas", emoji: "🤠" },
  { code: "CA", label: "California", emoji: "☀️" },
  { code: "NY", label: "Nueva York", emoji: "🗽" },
  { code: "OTHER", label: "Otro estado", emoji: "🇺🇸" },
];

export function QuizAside(): React.ReactElement {
  const [step, setStep] = useState<Step>(1);
  const [intent, setIntent] = useState<Intent>(null);
  const [final, setFinal] = useState<FinalState | null>(null);

  const handleIntent = (next: Exclude<Intent, null>): void => {
    setIntent(next);
    if (next === "info" || next === "remesa") {
      setFinal(buildFinalState(next, ""));
      setStep(3);
    } else {
      setStep(2);
    }
  };

  const handleState = (state: string): void => {
    if (!intent) return;
    setFinal(buildFinalState(intent, state));
    setStep(3);
  };

  return (
    <aside className="us-hero-aside">
      <div className="us-aside-label">
        <span>En vivo · WhatsApp</span>
        <span className="us-dot" />
      </div>

      {step === 1 && (
        <>
          <h3 className="us-aside-q">
            ¿Qué te trae por <i>acá</i>?
          </h3>
          <p className="us-aside-sub">Te conectamos con un agente real en 30 seg.</p>

          <div className="us-aside-options">
            <button className="us-aside-opt" onClick={() => handleIntent("auto")}>
              <span className="us-icon">🚗</span>
              <span>Cotizar mi seguro de auto</span>
              <span className="us-ar">→</span>
            </button>
            <button className="us-aside-opt" onClick={() => handleIntent("casa")}>
              <span className="us-icon">🏡</span>
              <span>Pre-calificar para hipoteca</span>
              <span className="us-ar">→</span>
            </button>
            <button className="us-aside-opt" onClick={() => handleIntent("remesa")}>
              <span className="us-icon">💸</span>
              <span>Comparar tasas de remesa</span>
              <span className="us-ar">→</span>
            </button>
            <button className="us-aside-opt" onClick={() => handleIntent("info")}>
              <span className="us-icon">📰</span>
              <span>Solo leer por ahora</span>
              <span className="us-ar">→</span>
            </button>
          </div>

          <div className="us-aside-foot">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="4" y="11" width="16" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 018 0v4" />
            </svg>
            Gratis · sin compromiso · 100% español
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <h3 className="us-aside-q">
            ¿En qué <i>estado</i> estás?
          </h3>
          <p className="us-aside-sub">Para cotizarte con las opciones correctas.</p>
          <div className="us-aside-options">
            {STATE_OPTIONS.map((opt) => (
              <button
                key={opt.code}
                className="us-aside-opt"
                onClick={() => handleState(opt.code)}
              >
                <span className="us-icon">{opt.emoji}</span>
                <span>{opt.label}</span>
                <span className="us-ar">→</span>
              </button>
            ))}
          </div>
        </>
      )}

      {step === 3 && final && (
        <div style={{ textAlign: "center" }}>
          <div className="us-final-avatar">{final.avatarLetter}</div>
          <h3 className="us-aside-q" style={{ marginBottom: 10 }}>
            {final.title}
          </h3>
          <p className="us-aside-sub" style={{ marginBottom: 24 }}>
            {final.subtitle}
          </p>
          <a
            href={final.href}
            className="us-btn-wa"
            style={{ width: "100%", justifyContent: "center" }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.52 3.48A11.82 11.82 0 0012.04 0C5.46 0 .1 5.36.1 11.94a11.9 11.9 0 001.6 5.97L0 24l6.27-1.64a11.9 11.9 0 005.77 1.47h.01c6.58 0 11.94-5.36 11.94-11.94a11.86 11.86 0 00-3.47-8.41z" />
            </svg>
            <span>{final.ctaLabel}</span>
          </a>
          <div
            className="us-aside-foot"
            style={{ justifyContent: "center", marginTop: 16 }}
          >
            Gratis · respuesta en 30 s
          </div>
        </div>
      )}
    </aside>
  );
}
