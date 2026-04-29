import Link from "next/link";

type FooterColumn = {
  heading: string;
  links: Array<{ href: string; label: string }>;
};

const COLUMNS: FooterColumn[] = [
  {
    heading: "Secciones",
    links: [
      { href: "/us/seguros", label: "Seguros" },
      { href: "/us/hipotecas", label: "Hipotecas" },
      { href: "/us/remesas", label: "Remesas" },
      { href: "/us/credito", label: "Crédito" },
      { href: "/us/fiscal", label: "Fiscal" },
    ],
  },
  {
    heading: "Herramientas",
    links: [
      { href: "/us/herramientas/cotizador-seguro", label: "Cotizador seguro" },
      { href: "/us/herramientas/simulador-hipoteca", label: "Simulador hipoteca" },
      { href: "/us/herramientas/comparador-remesas", label: "Comparador remesas" },
      { href: "/us/herramientas/credit-tracker", label: "Credit score tracker" },
    ],
  },
  {
    heading: "Servicios",
    links: [
      { href: "/us/cubierto", label: "Cubierto — Seguros" },
      { href: "/us/hogares", label: "Hogares — Hipotecas" },
      { href: "https://wa.me/13055551234", label: "WhatsApp directo" },
      { href: "/us/soporte", label: "Soporte" },
    ],
  },
  {
    heading: "Finazo",
    links: [
      { href: "/us/acerca", label: "Equipo editorial" },
      { href: "/us/metodologia", label: "Metodología" },
      { href: "/us/estandares-editoriales", label: "Estándares editoriales" },
      { href: "/us/contacto", label: "Contacto" },
    ],
  },
];

export function UsFooter(): React.ReactElement {
  const year = new Date().getFullYear();

  return (
    <footer className="us-footer">
      <div className="us-container">
        <div className="us-foot-grid">
          <div>
            <div className="us-foot-logo">
              finazo<i>.</i>
            </div>
            <p className="us-foot-tag">
              Publicación independiente de finanzas en español para la familia
              Hispana en EE.UU. Parte de Kornugle.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.heading} className="us-foot-col">
              <h4>{col.heading}</h4>
              {col.links.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="us-foot-bottom">
          <span>© {year} KORNUGLE · MAQ UNO DOS TRES S.A. DE C.V.</span>
          <p className="us-disc">
            Finazo es una marca editorial de Kornugle. Recibimos comisión cuando
            nos conectas con Cubierto (agencia de seguros, licencia FL pendiente)
            u Hogares (hipotecas), pero no te cobramos a ti. Las cotizaciones
            mostradas son estimados y no constituyen oferta de contrato. Hogares
            no es prestamista directo — coordinamos con wholesalers licenciados.
          </p>
        </div>
      </div>
    </footer>
  );
}
