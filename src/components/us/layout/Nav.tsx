/**
 * Sticky nav with logo, section links (with hover-dropdown submenus
 * for cohort pillars), search, WhatsApp CTA.
 *
 * Cohort-pillar children surface every "sin Social Security",
 * "ITIN", and "licencia extranjera" landing page so they aren't
 * orphans dependent on internal-body links to be discovered.
 */

import Link from "next/link";
import { FINAZO_WA_URL } from "@/lib/wa";

type NavProps = {
  currentPath?: string;
  waUrl?: string;
};

type NavChild = { href: string; label: string };
type NavLink = { href: string; label: string; children?: NavChild[] };

const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Portada" },
  {
    href: "/seguros",
    label: "Seguros",
    children: [
      { href: "/seguro-de-auto", label: "Seguro de auto" },
      { href: "/seguro-auto-sin-social-security", label: "Auto sin Social Security" },
      { href: "/seguro-auto-licencia-extranjera", label: "Auto con licencia extranjera" },
      { href: "/seguro-de-salud", label: "Seguro de salud (ACA)" },
      { href: "/aca-elegibilidad-inmigrantes", label: "ACA: elegibilidad inmigrantes" },
      { href: "/aca-subsidios", label: "ACA: subsidios" },
      { href: "/aca-familias-mixtas", label: "ACA: familias mixtas" },
      { href: "/aca-sin-aseguranza-fqhc", label: "Sin seguro: FQHC" },
      { href: "/seguro-de-vida", label: "Seguro de vida" },
    ],
  },
  {
    href: "/hipotecas",
    label: "Hipotecas",
    children: [
      { href: "/hipotecas", label: "Hipotecas (general)" },
      { href: "/comprar-casa-sin-social-security", label: "Comprar casa sin Social Security" },
    ],
  },
  { href: "/remesas", label: "Remesas" },
  {
    href: "/credito",
    label: "Crédito",
    children: [
      { href: "/credito", label: "Crédito (general)" },
      { href: "/credito-sin-social-security", label: "Crédito sin Social Security" },
      { href: "/banco-sin-ssn", label: "Cuenta bancaria sin SSN" },
    ],
  },
  {
    href: "/fiscal",
    label: "Fiscal",
    children: [
      { href: "/fiscal", label: "Fiscal (general)" },
      { href: "/impuestos-sin-social-security", label: "Impuestos sin Social Security" },
    ],
  },
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

function isLinkActive(link: NavLink, current: string): boolean {
  if (current === link.href) return true;
  if (link.children?.some((c) => c.href === current)) return true;
  return false;
}

export function Nav({
  currentPath = "/",
  waUrl = FINAZO_WA_URL,
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
          {NAV_LINKS.map((link) => {
            const active = isLinkActive(link, current);
            const hasChildren = !!link.children?.length;
            return (
              <div
                key={link.href}
                className={
                  hasChildren
                    ? `us-nav-item us-nav-has-menu${active ? " is-current" : ""}`
                    : `us-nav-item${active ? " is-current" : ""}`
                }
              >
                <Link
                  href={link.href}
                  className={active ? "is-current" : undefined}
                >
                  {link.label}
                  {hasChildren && (
                    <svg
                      className="us-nav-caret"
                      width="10"
                      height="10"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  )}
                </Link>
                {hasChildren && (
                  <div className="us-nav-menu" role="menu">
                    {link.children!.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={
                          current === child.href
                            ? "us-nav-menu-item is-current"
                            : "us-nav-menu-item"
                        }
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
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
