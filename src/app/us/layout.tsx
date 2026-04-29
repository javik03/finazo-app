import type { Metadata } from "next";
import Script from "next/script";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./us-globals.css";

const GA4_MEASUREMENT_ID = "G-TKWPYCDJVH";

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Finazo",
  url: "https://finazo.us",
  description:
    "Publicación independiente de finanzas para Hispanos en EE.UU. Guías y comparativos sobre seguros, hipotecas, crédito y remesas.",
  inLanguage: ["es-US", "en-US"],
  publisher: { "@type": "Organization", name: "Finazo", url: "https://finazo.us" },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://finazo.us/#organization",
  name: "Finazo",
  legalName: "MAQ UNO DOS TRES S.A. de C.V.",
  alternateName: "Finazo US",
  url: "https://finazo.us",
  logo: {
    "@type": "ImageObject",
    url: "https://finazo.us/icon.svg",
    width: 512,
    height: 512,
  },
  description:
    "Publicación independiente de finanzas para Hispanos en EE.UU. — guías, comparativos y conexiones con Cubierto (seguros) y Hogares (hipotecas).",
  parentOrganization: { "@type": "Organization", name: "Kornugle" },
  knowsLanguage: ["es", "en"],
  areaServed: {
    "@type": "Country",
    name: "United States",
  },
  audience: {
    "@type": "PeopleAudience",
    name: "Hispanic United States residents",
  },
  sameAs: ["https://www.linkedin.com/company/finazo/"],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "legal@finazo.us",
    availableLanguage: ["Spanish", "English"],
  },
};

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://finazo.us"),
  title: {
    default: "Finazo — Finanzas en español, para los nuestros",
    template: "%s · Finazo",
  },
  description:
    "Publicación independiente de finanzas para Hispanos en EE.UU. Guías, comparativos y cotizaciones por WhatsApp.",
  alternates: {
    canonical: "https://finazo.us",
    languages: {
      "es-US": "https://finazo.us",
      "en-US": "https://finazo.us/en",
    },
  },
  openGraph: {
    title: "Finazo — Finanzas en español, para los nuestros",
    description:
      "Publicación independiente de finanzas para Hispanos en EE.UU.",
    url: "https://finazo.us",
    locale: "es_US",
    siteName: "Finazo",
    type: "website",
  },
};

export default function UsLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div
      className={`finazo-us ${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-finazo-us" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA4_MEASUREMENT_ID}');`}
      </Script>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      {children}
    </div>
  );
}
