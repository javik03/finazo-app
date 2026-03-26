"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function Header({ activePath = "" }: { activePath?: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close mobile menu on route change / resize
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const links = [
    { href: "/remesas", label: "Remesas" },
    { href: "/prestamos", label: "Préstamos" },
    { href: "/tarjetas", label: "Tarjetas" },
    { href: "/guias", label: "Guías" },
  ];

  return (
    <>
      <header
        className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm transition-shadow"
        style={{
          height: "58px",
          boxShadow: scrolled
            ? "0 1px 12px rgba(0,0,0,0.08)"
            : "0 1px 0 #e8ede9",
        }}
      >
        <div
          className="mx-auto flex h-full items-center justify-between px-6"
          style={{ maxWidth: "var(--W)" }}
        >
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold"
            style={{
              fontFamily: "var(--font-lora), Georgia, serif",
              color: "var(--green)",
              textDecoration: "none",
            }}
          >
            Finazo
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((link) => {
              const isActive = activePath.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                  style={{
                    color: isActive ? "var(--green)" : "#444",
                    background: isActive ? "var(--green-bg)" : "transparent",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Desktop CTA */}
            <Link
              href="/remesas"
              className="hidden rounded-full px-5 py-2 text-sm font-semibold text-white transition-colors md:inline-flex"
              style={{ background: "var(--green)" }}
              onMouseOver={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "var(--green-2)")
              }
              onMouseOut={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "var(--green)")
              }
            >
              Comparar gratis
            </Link>

            {/* Mobile hamburger */}
            <button
              className="flex h-9 w-9 items-center justify-center rounded-lg md:hidden"
              style={{ color: "#333" }}
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 20, height: 20 }}>
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 20, height: 20 }}>
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ top: "58px", background: "#fff", borderTop: "1px solid #e8ede9" }}
        >
          <nav className="flex flex-col px-6 py-4">
            {links.map((link) => {
              const isActive = activePath.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-4 py-3 text-base font-medium transition-colors"
                  style={{
                    color: isActive ? "var(--green)" : "#333",
                    background: isActive ? "var(--green-bg)" : "transparent",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="mt-4 border-t pt-4" style={{ borderColor: "#e8ede9" }}>
              <Link
                href="/remesas"
                onClick={() => setMenuOpen(false)}
                className="block w-full rounded-full px-5 py-3 text-center text-sm font-semibold text-white"
                style={{ background: "var(--green)" }}
              >
                Comparar gratis
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
