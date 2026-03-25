"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function Header({ activePath = "" }: { activePath?: string }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    { href: "/remesas", label: "Remesas" },
    { href: "/prestamos", label: "Préstamos" },
    { href: "/seguros", label: "Seguros" },
    { href: "/guias", label: "Guías" },
  ];

  return (
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

        {/* Nav */}
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

        {/* CTA */}
        <Link
          href="/remesas"
          className="rounded-full px-5 py-2 text-sm font-semibold text-white transition-colors"
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
      </div>
    </header>
  );
}
