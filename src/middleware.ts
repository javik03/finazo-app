import { NextRequest, NextResponse } from "next/server";

// ─── Host-routing constants ────────────────────────────────────────────────
// finazo.us hosts → US Hispanic site (rewrites root to /us)
// finazo.lat hosts → LATAM site (existing behavior)
const US_HOSTS = new Set([
  "finazo.us",
  "www.finazo.us",
]);

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
  // User-facing canonical URLs never include the /us prefix.
  if (onUsHost) {
    // Verification files that must serve from root without rewrite:
    //  - IndexNow keys: /[32-hex].txt
    //  - GSC HTML verification: /google*.html
    //  - Image assets at root (icons, favicons)
    const isRootStaticFile =
      /^\/[a-f0-9]{32}\.txt$/.test(pathname) ||
      /^\/google[a-z0-9]+\.html$/.test(pathname) ||
      /^\/[a-zA-Z0-9_-]+\.(ico|svg|png|jpg|jpeg|webp|webmanifest)$/.test(pathname);

    const isExcluded =
      pathname.startsWith("/api") ||
      pathname.startsWith("/admin") ||
      pathname.startsWith("/_next") ||
      pathname === "/robots.txt" ||
      pathname === "/llms.txt" ||
      pathname === "/llms-full.txt" ||
      isRootStaticFile;

    if (!isExcluded) {
      // /en, /en/* — Lane A (helping-family) + Lane B (research) English
      // content per spec §1.4.1.b. Rewritten to /us/en tree like everything
      // else; not redirected.
      // /us, /us/* — legacy URLs from before the host split. 301 to the
      // stripped form so SEO equity transfers and GSC stops reporting 404s.
      if (pathname === "/us" || pathname.startsWith("/us/")) {
        const url = request.nextUrl.clone();
        url.pathname = pathname === "/us" ? "/" : pathname.slice(3);
        return NextResponse.redirect(url, 301);
      }

      const url = request.nextUrl.clone();
      url.pathname = pathname === "/" ? "/us" : `/us${pathname}`;
      const response = NextResponse.rewrite(url);
      addSecurityHeaders(response);
      return response;
    }

    const response = NextResponse.next();
    addSecurityHeaders(response);
    return response;
  }

  // ── finazo.lat host (or unknown host) — purely LATAM, standalone ──────────
  // Any /us/* path → cross-domain 301 to finazo.us (strip the /us prefix) so
  // legacy SEO equity transfers. Otherwise pass through — no geo-routing.
  if (pathname === "/us" || pathname.startsWith("/us/")) {
    const stripped = pathname === "/us" ? "/" : pathname.slice(3);
    const url = new URL(stripped + request.nextUrl.search, "https://finazo.us");
    return NextResponse.redirect(url, 301);
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
