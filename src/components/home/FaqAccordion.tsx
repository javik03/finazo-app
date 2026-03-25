"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "¿Cómo se actualizan los datos de remesas?",
    a: "Nuestros sistemas consultan automáticamente las tarifas de Wise, Remitly, Western Union y MoneyGram cada 6 horas. Los datos reflejan el costo real de enviar $200 USD en el corredor seleccionado.",
  },
  {
    q: "¿De dónde vienen las tasas de préstamos?",
    a: "Provienen directamente de la Superintendencia del Sistema Financiero (SSF) de El Salvador. Son las tasas máximas y mínimas que cada banco puede cobrar legalmente.",
  },
  {
    q: "¿Finazo cobra alguna comisión a usuarios?",
    a: "No. Finazo es completamente gratuito. Cuando haces clic en un proveedor podemos recibir una comisión de afiliado — esto nunca afecta las tasas ni el orden de resultados.",
  },
];

export function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div>
      {FAQS.map((faq, i) => (
        <div
          key={i}
          style={{ borderTop: "1px solid #e5e7eb" }}
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between py-5 text-left"
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            <span className="font-medium text-slate-900">{faq.q}</span>
            <span
              className="ml-4 shrink-0 text-xl font-light transition-transform"
              style={{
                color: "var(--green)",
                transform: open === i ? "rotate(45deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
              }}
            >
              +
            </span>
          </button>
          {open === i && (
            <p className="pb-5 text-sm leading-relaxed text-slate-600">
              {faq.a}
            </p>
          )}
        </div>
      ))}
      <div style={{ borderTop: "1px solid #e5e7eb" }} />
    </div>
  );
}
