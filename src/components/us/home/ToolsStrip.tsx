import Link from "next/link";

type Tool = {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
};

const TOOLS: Tool[] = [
  {
    href: "/us/herramientas/cotizador-seguro",
    title: "Cotizador de seguro",
    description: "Compara 8+ aseguradoras ingresando solo 5 datos.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 10h18M3 6h18v12H3zM7 15h2M11 15h6" />
      </svg>
    ),
  },
  {
    href: "/us/herramientas/simulador-hipoteca",
    title: "Simulador de hipoteca",
    description: "Cuota mensual, down payment y closing costs reales.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 21l9-18 9 18H3zM12 9v5M12 17v.01" />
      </svg>
    ),
  },
  {
    href: "/us/herramientas/comparador-remesas",
    title: "Comparador remesas",
    description: "Envía $X a México, GT, SV, HN — ve dónde sale más.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 9V7a5 5 0 00-10 0v2M5 9h14v11H5z" />
      </svg>
    ),
  },
  {
    href: "/us/herramientas/credit-tracker",
    title: "Credit score tracker",
    description: "Plan de 12 meses para subir de 0 a 700+ sin SSN.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 12l3-9 3 6 3-3 3 6 3-3 3 9" />
      </svg>
    ),
  },
];

export function ToolsStrip(): React.ReactElement {
  return (
    <section className="us-tools">
      <div className="us-tools-inner">
        <div className="us-tools-head">
          <h2 className="us-serif">
            Herramientas <i>gratis</i>.
          </h2>
          <p>
            Calcula tus números antes de firmar. Si el resultado te genera
            preguntas, te conectamos con un agente real por WhatsApp.
          </p>
        </div>

        <div className="us-tools-grid">
          {TOOLS.map((tool) => (
            <Link key={tool.href} href={tool.href} className="us-tool">
              <div className="us-tool-icon">{tool.icon}</div>
              <h3 className="us-serif">{tool.title}</h3>
              <p>{tool.description}</p>
              <span className="us-tool-link">Abrir →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
