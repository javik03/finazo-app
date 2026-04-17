import { NextRequest, NextResponse } from "next/server";

// Locales that indicate a US-based visitor wanting the US Hispanic experience
const US_LOCALES = new Set(["en-us", "es-us"]);
// Locales that indicate a LATAM visitor — always serve the default LATAM page
const LATAM_LOCALES = new Set(["es-sv", "es-gt", "es-hn", "es-ni", "es-cr", "es-pa", "es-mx", "es-do", "es-pe", "es-co"]);

function isUsVisitor(request: NextRequest): boolean {
  const acceptLanguage = request.headers.get("accept-language") ?? "";

  // Parse locales in priority order (e.g. "es-US,es;q=0.9,en-US;q=0.8")
  const locales = acceptLanguage
    .split(",")
    .map((part) => part.split(";")[0].trim().toLowerCase())
    .filter(Boolean);

  for (const locale of locales) {
    if (LATAM_LOCALES.has(locale)) return false;
    if (US_LOCALES.has(locale)) return true;
    // "en" alone (no region) maps to US by default
    if (locale === "en") return true;
  }

  return false;
}

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // ── Geo-routing: redirect homepage visitors to /us if they're US-based ──────
  // Only route the root path to avoid interfering with /us/* sub-pages
  if (pathname === "/") {
    const regionCookie = request.cookies.get("finazo_region")?.value;

    if (regionCookie === "us") {
      return NextResponse.redirect(new URL("/us", request.url));
    }

    // Cookie says LATAM explicitly — skip detection
    if (regionCookie !== "latam" && isUsVisitor(request)) {
      return NextResponse.redirect(new URL("/us", request.url));
    }
  }

  const response = NextResponse.next();

  // Prevent MIME-type sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");

  // Block iframe embedding (clickjacking protection)
  response.headers.set("X-Frame-Options", "DENY");

  // Force HTTPS for 1 year once on SSL (no-op until Nginx + certbot is live)
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );

  // Referrer — send origin only (privacy + analytics still works)
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Permissions policy — disable features we don't use
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  // Content Security Policy — adjust as third-party scripts are added
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'", // unsafe-inline needed for Next.js hydration
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
    ].join("; ")
  );

  return response;
}

export const config = {
  matcher: [
    // Run on all paths except Next.js internals and static assets
    "/((?!_next/static|_next/image|favicon.ico|icon.svg).*)",
  ],
};
