import Link from "next/link";

export function Footer() {
  return (
    <footer style={{ background: "#111", color: "#fff" }}>
      <div
        className="mx-auto px-6 py-14"
        style={{ maxWidth: "var(--W)" }}
      >
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="text-xl font-bold"
              style={{
                fontFamily: "var(--font-lora), Georgia, serif",
                color: "var(--green-bg)",
                textDecoration: "none",
              }}
            >
              Finazo
            </Link>
            <p className="mt-3 max-w-xs text-sm" style={{ color: "#999" }}>
              Comparador financiero independiente para Centroamérica. No somos
              un banco, aseguradora ni prestamista. Tasas de préstamos: datos
              públicos de la SSF El Salvador.
            </p>
          </div>

          {/* Comparar */}
          <div>
            <h4
              className="mb-4 text-xs font-semibold uppercase tracking-wider"
              style={{ color: "#666" }}
            >
              Comparar
            </h4>
            <ul className="space-y-2.5">
              {[
                { href: "/remesas", label: "Remesas" },
                { href: "/prestamos", label: "Préstamos" },
                { href: "/seguros", label: "Seguros" },
                { href: "/guias", label: "Guías" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: "#888" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Países */}
          <div>
            <h4
              className="mb-4 text-xs font-semibold uppercase tracking-wider"
              style={{ color: "#666" }}
            >
              Países
            </h4>
            <ul className="space-y-2.5">
              {[
                { href: "/el-salvador", label: "El Salvador" },
                { href: "/guatemala", label: "Guatemala" },
                { href: "/honduras", label: "Honduras" },
                { href: "/mexico", label: "México" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: "#888" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="mt-10 border-t pt-6 text-xs"
          style={{ borderColor: "#222", color: "#555" }}
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Finazo.lat — Todos los derechos reservados.</p>
            <p>
              Algunos enlaces son de afiliado. Si haces clic y solicitas un
              servicio podemos recibir una comisión. Esto nunca influye en
              nuestras comparaciones ni rankings.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
