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

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Finazo",
  url: "https://finazo.lat",
  description:
    "Comparador financiero para Centroamérica — remesas, préstamos y seguros.",
  inLanguage: "es",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://finazo.lat/remesas?desde={from}&hacia={to}",
    },
    "query-input": "required name=from",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Finazo",
  legalName: "Finazo LLC",
  url: "https://finazo.lat",
  logo: "https://finazo.lat/icon.svg",
  foundingLocation: {
    "@type": "Country",
    name: "El Salvador",
  },
  audience: {
    "@type": "PeopleAudience",
    name: "Central American consumers",
    geographicArea: {
      "@type": "AdministrativeArea",
      name: "Central America",
    },
  },
  contactPoint: {
    "@type": "ContactPoint",
    email: "legal@finazo.lat",
    contactType: "customer support",
    availableLanguage: "Spanish",
  },
  sameAs: ["https://www.linkedin.com/company/finazo/"],
  description:
    "Comparador financiero independiente para Centroamérica. Comparamos remesas, préstamos y seguros en El Salvador, Guatemala, Honduras y México.",
};

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
