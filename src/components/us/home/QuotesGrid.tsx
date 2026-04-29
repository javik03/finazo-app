type Quote = {
  initial: string;
  text: string;
  name: string;
  location: string;
};

const QUOTES: Quote[] = [
  {
    initial: "D",
    text: "Carmen me sacó seguro full en 3 minutos por WhatsApp. Estrella me cobraba $210, ahora pago $94. Ya pasé el link a mi cuñada y a mi mamá.",
    name: "Daniela R.",
    location: "🇸🇻 HIALEAH, FL",
  },
  {
    initial: "M",
    text: "Tres bancos me dijeron que no a la hipoteca porque soy self-employed. Sofía me pre-calificó el mismo día. Cerramos en 34 días sin Social. Nunca pensé que iba a comprar casa en Houston.",
    name: "Marco T.",
    location: "🇲🇽 HOUSTON, TX",
  },
  {
    initial: "J",
    text: "Leo el boletín de Finazo cada lunes. Aprendí de credit score más en 6 meses que en 10 años viviendo acá. Sin jerga, sin vendedores.",
    name: "Joselito V.",
    location: "🇬🇹 KISSIMMEE, FL",
  },
];

export function QuotesGrid(): React.ReactElement {
  return (
    <section className="us-quotes us-container">
      <div className="us-quotes-head">
        <div
          className="us-hero-kicker"
          style={{ justifyContent: "center", display: "flex" }}
        >
          Lectores · clientes · familia
        </div>
        <h2 className="us-serif">
          Lo que dice la <i>gente</i> que ya usa Finazo.
        </h2>
      </div>

      <div className="us-quote-grid">
        {QUOTES.map((quote, idx) => (
          <div key={idx} className="us-quote">
            <div className="us-quote-mark">&ldquo;</div>
            <p className="us-quote-text">{quote.text}</p>
            <div className="us-quote-who">
              <div className="us-quote-av">{quote.initial}</div>
              <div>
                <div className="us-quote-name">{quote.name}</div>
                <div className="us-quote-loc">{quote.location}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
