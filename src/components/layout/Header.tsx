import Link from "next/link";

export function Header({ activePath = "" }: { activePath?: string }) {
  const links = [
    { href: "/remesas", label: "Remesas" },
    { href: "/prestamos", label: "Préstamos" },
    { href: "/seguros", label: "Seguros" },
    { href: "/articulos", label: "Artículos" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1">
          <span className="text-2xl font-extrabold tracking-tight text-slate-900">
            fin<span className="text-emerald-500">azo</span>
          </span>
          <span className="rounded bg-emerald-500 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
            .lat
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const isActive = activePath.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA */}
        <Link
          href="/remesas"
          className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-600"
        >
          Comparar gratis
        </Link>
      </div>
    </header>
  );
}
