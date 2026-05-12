/**
 * Newsletter capture — V1 routes to a Substack-hosted form.
 * The actual Substack publication URL gets wired up once Javier creates it.
 */

"use client";

import { useState } from "react";

const SUBSTACK_URL = "https://finazo.substack.com"; // placeholder

export function NewsletterBand(): React.ReactElement {
  const [phone, setPhone] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    // V1: redirect to Substack with prefill query if phone provided
    const url = phone
      ? `${SUBSTACK_URL}?utm_source=finazo-us&prefill=${encodeURIComponent(phone)}`
      : SUBSTACK_URL;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="us-container">
      <div className="us-news">
        <div>
          <h2 className="us-serif">
            Finazo cada <i>lunes</i>, en tu WhatsApp.
          </h2>
          <p>
            Una guía, un comparativo y una alerta por semana. Corto, en español,
            sin spam. Ya son 50,000 Hispanos recibiéndolo.
          </p>
        </div>
        <form className="us-news-form" onSubmit={handleSubmit}>
          <div className="us-news-input-row">
            <input
              type="tel"
              className="us-news-input"
              placeholder="+1 (305) 555-1234"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              aria-label="Tu número de WhatsApp"
            />
            <button type="submit" className="us-news-submit">
              Suscribirme
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="us-news-note">
            GRATIS · CANCELA RESPONDIENDO &ldquo;BAJA&rdquo; · EN ESPAÑOL
          </div>
        </form>
      </div>
    </section>
  );
}
