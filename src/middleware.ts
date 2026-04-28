import { NextRequest, NextResponse } from "next/server";

// ─── Host-routing constants ────────────────────────────────────────────────
// finazo.us hosts → US Hispanic site (rewrites root to /us)
// finazo.lat hosts → LATAM site (existing behavior)
const US_HOSTS = new Set([
  "finazo.us",
  "www.finazo.us",
]);

// ─── Locale detection (used only on finazo.lat for LATAM-vs-US fallback) ───
const US_LOCALES = new Set(["en-us", "es-us"]);
const LATAM_LOCALES = new Set([
  "es-sv", "es-gt", "es-hn", "es-ni", "es-cr",
  "es-pa", "es-mx", "es-do", "es-pe", "es-co",
]);

function isUsVisitor(request: NextRequest): boolean {
  const acceptLanguage = request.headers.get("accept-language") ?? "";
  const locales = acceptLanguage
    .split(",")
    .map((part) => part.split(";")[0].trim().toLowerCase())
    .filter(Boolean);

  for (const locale of locales) {
    if (LATAM_LOCALES.has(locale)) return false;
    if (US_LOCALES.has(locale)) return true;
    if (locale === "en") return true;
  }
  return false;
}

function getHost(request: NextRequest): string {
  // Prefer X-Forwarded-Host (set by nginx) then Host header
  const forwarded = request.headers.get("x-forwarded-host");
  const host = (forwarded ?? request.headers.get("host") ?? "").toLowerCase();
  return host.split(":")[0]; // strip port
}

function isUsHost(host: string): boolean {
  return US_HOSTS.has(host);
}

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const host = getHost(request);
  const onUsHost = isUsHost(host);

  // ── finazo.us host routing ────────────────────────────────────────────────
  // The /us tree IS the site on this host. Root → /us, /seguros → /us/seguros, etc.
  // Subpaths /admin and /api are excluded from the rewrite.
  if (onUsHost) {
    const isExcluded =
      pathname.startsWith("/api") ||
      pathname.startsWith("/admin") ||
      pathname.startsWith("/_next") ||
      pathname === "/sitemap.xml" ||
      pathname === "/sitemap-us.xml" ||
      pathname === "/sitemap-us-en.xml" ||
      pathname === "/robots.txt" ||
      pathname === "/llms.txt" ||
      pathname === "/llms-full.txt";

    // Only rewrite paths that don't already start with /us — otherwise we'd loop.
    // Visitors typing /us/seguros directly on finazo.us still resolve correctly.
    if (!isExcluded && !pathname.startsWith("/us")) {
      const rewritten = pathname === "/" ? "/us" : `/us${pathname}`;
      const url = request.nextUrl.clone();
      url.pathname = rewritten;
      const response = NextResponse.rewrite(url);
      addSecurityHeaders(response);
      return response;
    }

    // Already on /us tree — pass through with security headers
    const response = NextResponse.next();
    addSecurityHeaders(response);
    return response;
  }

  // ── finazo.lat host (or unknown host) — original behavior ─────────────────
  // Geo-route the homepage to /us if Accept-Language suggests US visitor.
  if (pathname === "/") {
    const regionCookie = request.cookies.get("finazo_region")?.value;

    if (regionCookie === "us") {
      return NextResponse.redirect(new URL("/us", request.url));
    }
    if (regionCookie !== "latam" && isUsVisitor(request)) {
      return NextResponse.redirect(new URL("/us", request.url));
    }
  }

  const response = NextResponse.next();
  addSecurityHeaders(response);
  return response;
}

function addSecurityHeaders(response: NextResponse): void {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
    ].join("; ")
  );
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg).*)",
  ],
};
