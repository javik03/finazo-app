import type { Metadata } from "next";
import { Lora, DM_Sans } from "next/font/google";
import "./globals.css";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://finazo.lat"),
  title: {
    default: "Finazo — Comparador financiero para Centroamérica",
    template: "%s | Finazo",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  description:
    "Compara remesas, préstamos y seguros en El Salvador, Guatemala, Honduras, México y República Dominicana. Datos actualizados diariamente. Gratis, en español.",
  keywords: [
    "comparar remesas El Salvador",
    "enviar dinero República Dominicana",
    "préstamos personales El Salvador",
    "tasas bancarias SSF",
    "enviar dinero El Salvador",
    "Wise Remitly Western Union comparar",
    "comparador financiero centroamerica",
    "mejores remesas Guatemala Honduras Mexico",
  ],
  openGraph: {
    type: "website",
    locale: "es_SV",
    url: "https://finazo.lat",
    siteName: "Finazo",
    title: "Finazo — Comparador financiero para Centroamérica y el Caribe",
    description:
      "Compara remesas, préstamos y seguros en El Salvador, Guatemala, Honduras, México y República Dominicana. Datos actualizados diariamente.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Finazo — Comparador financiero para Centroamérica y el Caribe",
    description:
      "Compara remesas, préstamos y seguros en El Salvador, Guatemala, Honduras, México y República Dominicana.",
  },
  alternates: {
    canonical: "https://finazo.lat",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    other: {
      "msvalidate.01": "841BB7A4B2109CDCDB28CA6654A32456",
    },
  },
};

// LATAM-flavored Organization + WebSite JSON-LD removed from the shared
// root layout on 2026-05-13 because it was bleeding onto finazo.us pages
// and competing with the US-specific schemas emitted by src/app/us/layout.tsx.
// Re-add inside a (lat) route group when the LATAM lane is reactivated.

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The LATAM gtag self-disables on finazo.us at runtime (client-side host
  // check) so we keep this layout fully static — calling headers() here
  // breaks ISR for every revalidate-cached page in the tree.
  return (
    <html
      lang="es"
      className={`${lora.variable} ${dmSans.variable} h-full antialiased`}
    >
      <head>
        {/* Impact.com site verification */}
        <meta name="impact-site-verification" content="76fde1c7-852b-427f-b3fd-1fef795e1cf4" />
        {/* Google Analytics 4 — finazo.lat property; self-disables on finazo.us */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var h=location.hostname.toLowerCase();if(h==='finazo.us'||h==='www.finazo.us')return;var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=G-TYLWGLRMZ0';document.head.appendChild(s);window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-TYLWGLRMZ0');})();`,
          }}
        />
        {/* Organization + WebSite JSON-LD moved out of the shared root
            layout to stop bleeding LATAM-flavored entities onto finazo.us
            pages. US schemas live in src/app/us/layout.tsx. LATAM equivalents
            should be re-added inside a (lat) route group once that lane is
            reactivated — for now LATAM publishes without Org/WebSite JSON-LD
            (lower priority per the 2026-04-17 US strategic pivot). */}
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
