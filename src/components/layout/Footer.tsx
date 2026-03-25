import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2">
            <Link href="/" className="flex items-center gap-1">
              <span className="text-lg font-extrabold tracking-tight text-slate-900">
                fin<span className="text-emerald-500">azo</span>
              </span>
              <span className="rounded bg-emerald-500 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                .lat
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-slate-500">
              Comparador financiero independiente para Centroamérica. No somos
              un banco, aseguradora ni prestamista.
            </p>
            <p className="mt-3 text-xs text-slate-400">
              Tasas de préstamos: datos públicos de la SSF El Salvador.
              Algunos enlaces son de afiliado — esto no influye en las
              comparaciones.
            </p>
          </div>

          {/* Productos */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Comparar
            </p>
            <ul className="space-y-2">
              {[
                { href: "/remesas", label: "Remesas" },
                { href: "/prestamos", label: "Préstamos" },
                { href: "/seguros", label: "Seguros" },
                { href: "/articulos", label: "Artículos" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 transition-colors hover:text-slate-900"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Legal
            </p>
            <ul className="space-y-2">
              {[
                { href: "/privacidad", label: "Privacidad" },
                { href: "/terminos", label: "Términos" },
                { href: "/metodologia", label: "Metodología" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 transition-colors hover:text-slate-900"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-100 pt-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} Finazo.lat — Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
