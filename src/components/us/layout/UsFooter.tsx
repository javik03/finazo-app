import Link from "next/link";
import { FINAZO_WA_URL } from "@/lib/wa";

type FooterColumn = {
  heading: string;
  links: Array<{ href: string; label: string }>;
};

const COLUMNS: FooterColumn[] = [
  {
    heading: "Secciones",
    links: [
      { href: "/seguros", label: "Seguros" },
      { href: "/hipotecas", label: "Hipotecas" },
      { href: "/remesas", label: "Remesas" },
      { href: "/credito", label: "Crédito" },
      { href: "/fiscal", label: "Fiscal" },
    ],
  },
  {
    heading: "Herramientas",
    links: [
      { href: "/herramientas/cotizador-seguro", label: "Cotizador seguro" },
      { href: "/herramientas/simulador-hipoteca", label: "Simulador hipoteca" },
      { href: "/herramientas/comparador-remesas", label: "Comparador remesas" },
      { href: "/herramientas/credit-tracker", label: "Credit score tracker" },
    ],
  },
  {
    heading: "Servicios",
    links: [
      { href: "/acerca", label: "Sobre Finazo" },
      { href: `${FINAZO_WA_URL}?text=Hola%20Carmen%2C%20cotizar%20seguro`, label: "Cubierto — Seguros" },
      { href: `${FINAZO_WA_URL}?text=Hola%20Sof%C3%ADa%2C%20pre-calificar%20hipoteca`, label: "Hogares — Hipotecas" },
      { href: FINAZO_WA_URL, label: "WhatsApp directo" },
    ],
  },
  {
    heading: "Finazo",
    links: [
      { href: "/acerca", label: "Equipo editorial" },
      { href: "/metodologia", label: "Metodología" },
      { href: "/estandares-editoriales", label: "Estándares editoriales" },
      { href: "/autor/javier-keough", label: "Javier Keough" },
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
              Hispana en EE.UU.
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
          <span>© {year} Finazo LLC</span>
          <p className="us-disc">
            Finazo es una publicación independiente de finanzas personales.
            Cubierto (agencia de seguros) y Hogares (broker hipotecario) son
            <strong> socios afiliados</strong> — recibimos comisión cuando te
            conectas con ellos, pero no te cobramos a ti: la paga la
            aseguradora o wholesaler. Las cotizaciones mostradas son estimados
            y no constituyen oferta de contrato. Esta página es solo para fines
            informativos y no es asesoría legal, fiscal ni financiera — verifica
            con un profesional licenciado para tu situación específica.
          </p>
          <p className="us-disc">
            <Link href="/privacidad">Privacidad</Link>
            {" · "}
            <Link href="/terminos">Términos</Link>
            {" · "}
            <Link href="/legal">Disclaimer legal</Link>
            {" · "}
            <Link href="/metodologia">Metodología</Link>
            {" · "}
            <Link href="/estandares-editoriales">Estándares editoriales</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
