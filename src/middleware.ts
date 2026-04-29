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
    // Verification files that must serve from root without rewrite:
    //  - IndexNow keys: /[32-hex].txt → finazo.us/{key}.txt for Bing IndexNow
    //  - GSC HTML: /google*.html → not used (DNS verification preferred)
    //  - Image assets at root (icons, favicons)
    // /llms.txt and /sitemap.xml are NOT in this list — they need rewriting
    // to /us/* so the finazo.us-specific versions render.
    const isRootStaticFile =
      /^\/[a-f0-9]{32}\.txt$/.test(pathname) ||
      /^\/google[a-z0-9]+\.html$/.test(pathname) ||
      /^\/[a-zA-Z0-9_-]+\.(ico|svg|png|jpg|jpeg|webp|webmanifest)$/.test(pathname);

    // /sitemap.xml is intentionally NOT excluded — on finazo.us it rewrites
    // to /us/sitemap.xml. /llms.txt and /robots.txt are excluded because
    // they're served by host-aware route handlers at the root level.
    const isExcluded =
      pathname.startsWith("/api") ||
      pathname.startsWith("/admin") ||
      pathname.startsWith("/_next") ||
      pathname === "/robots.txt" ||
      pathname === "/llms.txt" ||
      pathname === "/llms-full.txt" ||
      isRootStaticFile;

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

  // ── finazo.lat host (or unknown host) — purely LATAM ──────────────────────
  // 1. Any /us/* path → cross-domain 301 to finazo.us (strip the /us prefix)
  //    so SEO equity transfers and finazo.lat stays purely LATAM.
  if (pathname === "/us" || pathname.startsWith("/us/")) {
    const stripped = pathname === "/us" ? "/" : pathname.slice(3); // "/us/x" → "/x"
    const url = new URL(stripped + request.nextUrl.search, "https://finazo.us");
    return NextResponse.redirect(url, 301);
  }

  // 2. Geo-route US visitors landing on finazo.lat/ → cross-domain to finazo.us
  if (pathname === "/") {
    const regionCookie = request.cookies.get("finazo_region")?.value;

    if (regionCookie === "us") {
      return NextResponse.redirect(new URL("/", "https://finazo.us"));
    }
    if (regionCookie !== "latam" && isUsVisitor(request)) {
      return NextResponse.redirect(new URL("/", "https://finazo.us"));
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
