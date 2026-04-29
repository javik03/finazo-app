/**
 * "This is what it looks like" section — left column copy, right column
 * fake WhatsApp phone mockup with sample conversation.
 */

const WA_SVG = (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.52 3.48A11.82 11.82 0 0012.04 0C5.46 0 .1 5.36.1 11.94a11.9 11.9 0 001.6 5.97L0 24l6.27-1.64a11.9 11.9 0 005.77 1.47h.01c6.58 0 11.94-5.36 11.94-11.94a11.86 11.86 0 00-3.47-8.41z" />
  </svg>
);

export function ConvoProof(): React.ReactElement {
  return (
    <section className="us-convo us-container">
      <div className="us-convo-grid">
        <div className="us-convo-copy">
          <div className="us-hero-kicker">Así se ve · así funciona</div>
          <h2 className="us-serif">
            No descargas nada. Es solo <i>una conversación</i>.
          </h2>
          <p>
            Abres WhatsApp — el que ya tienes. Mandas mensaje. Carmen (o Sofía)
            responde en 30 segundos. Como le pediste a tu primo que te ayudara —
            pero con 8 aseguradoras compitiendo por ti.
          </p>

          <div className="us-convo-list">
            <div className="us-convo-item">
              <div className="us-convo-num">1</div>
              <div className="us-convo-item-text">
                <b>Abre WhatsApp</b> y escribe &ldquo;hola&rdquo;. No descargas
                app, no creas cuenta.
              </div>
            </div>
            <div className="us-convo-item">
              <div className="us-convo-num">2</div>
              <div className="us-convo-item-text">
                <b>Carmen responde</b> en español. Puedes mandar texto o nota de
                voz — ella entiende ambos.
              </div>
            </div>
            <div className="us-convo-item">
              <div className="us-convo-num">3</div>
              <div className="us-convo-item-text">
                <b>Te cotiza en 90 segundos</b> con 8+ aseguradoras. Si necesitas
                un humano licenciado, te pasa con uno real.
              </div>
            </div>
          </div>

          <a href="https://wa.me/13055551234" className="us-btn-wa">
            {WA_SVG}
            Empezar conversación
          </a>
        </div>

        <div>
          <div className="us-phone">
            <div className="us-phone-screen">
              <div className="us-wa-header">
                <div className="us-wa-av">C</div>
                <div className="us-wa-name-wrap">
                  <div className="us-wa-name">
                    Carmen · Finazo <span className="us-wa-verified">✓</span>
                  </div>
                  <div className="us-wa-status">en línea · responde en 30 s</div>
                </div>
              </div>
              <div className="us-wa-body">
                <div className="us-wa-msg us-out">
                  Hola, busco seguro para mi Toyota Camry 2018, vivo en Hialeah
                  <div className="us-t">3:42 PM ✓✓</div>
                </div>
                <div className="us-wa-msg us-in">
                  ¡Hola! Soy Carmen de Finazo 👋 En un minuto te saco cotización
                  con 8 aseguradoras. ¿Me mandas foto de tu licencia? O si
                  prefieres nota de voz, también vale.
                  <div className="us-t">3:42 PM</div>
                </div>
                <div className="us-wa-msg us-out">
                  👍<div className="us-t">3:43 PM ✓✓</div>
                </div>
                <div className="us-wa-msg us-out">
                  [Licencia FL.jpg]<div className="us-t">3:43 PM ✓✓</div>
                </div>
                <div className="us-wa-msg us-in">
                  Perfecto. Buscando mejores tarifas con full coverage…
                  <br />
                  <br />
                  🥇 <b>Infinity</b> — $73/mes
                  <br />
                  🥈 <b>Progressive</b> — $81/mes
                  <br />
                  🥉 <b>Ocean Harbor</b> — $88/mes
                  <br />
                  <br />
                  La de Infinity te da cobertura completa + PIP. ¿Procedemos?
                  <div className="us-t">3:44 PM</div>
                </div>
                <div className="us-wa-typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
