/**
 * Sticky nav with logo, section links, search, WhatsApp CTA.
 * The CTA funnels into the Finazo personal-finance AI bot (placeholder for V1).
 */

import Link from "next/link";

type NavProps = {
  currentPath?: string;
  waUrl?: string;
};

const NAV_LINKS: Array<{ href: string; label: string }> = [
  { href: "/", label: "Portada" },
  { href: "/seguros", label: "Seguros" },
  { href: "/hipotecas", label: "Hipotecas" },
  { href: "/remesas", label: "Remesas" },
  { href: "/credito", label: "Crédito" },
  { href: "/guias", label: "Guías" },
  { href: "/herramientas", label: "Calculadoras" },
];

// Normalize legacy /us-prefixed currentPath values so highlighting still works
// during the transition. `/us/seguros` and `/seguros` both highlight Seguros.
function normalize(path: string): string {
  if (path === "/us") return "/";
  if (path.startsWith("/us/")) return path.slice(3);
  return path;
}

export function Nav({
  currentPath = "/",
  waUrl = "https://wa.me/13055551234",
}: NavProps): React.ReactElement {
  const current = normalize(currentPath);
  return (
    <nav className="us-nav">
      <div className="us-container us-nav-inner">
        <Link href="/" className="us-logo">
          finazo
          <span className="us-logo-mark">.</span>
        </Link>

        <div className="us-nav-links">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={current === link.href ? "is-current" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="us-nav-right">
          <Link href="/guias" className="us-nav-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            <span>Buscar guías…</span>
          </Link>
          <a href={waUrl} className="us-nav-cta">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.52 3.48A11.82 11.82 0 0012.04 0C5.46 0 .1 5.36.1 11.94a11.9 11.9 0 001.6 5.97L0 24l6.27-1.64a11.9 11.9 0 005.77 1.47h.01c6.58 0 11.94-5.36 11.94-11.94a11.86 11.86 0 00-3.47-8.41z" />
            </svg>
            Pregúntale a Finazo
          </a>
        </div>
      </div>
    </nav>
  );
}
