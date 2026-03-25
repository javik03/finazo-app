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
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  description:
    "Compara remesas, préstamos y seguros en El Salvador, Guatemala y Honduras. Datos actualizados diariamente. Gratis, en español.",
  keywords: [
    "comparar remesas El Salvador",
    "préstamos personales El Salvador",
    "tasas bancarias SSF",
    "enviar dinero El Salvador",
    "Wise Remitly Western Union comparar",
    "comparador financiero centroamerica",
    "mejores remesas Guatemala Honduras",
  ],
  openGraph: {
    type: "website",
    locale: "es_SV",
    url: "https://finazo.lat",
    siteName: "Finazo",
    title: "Finazo — Comparador financiero para Centroamérica",
    description:
      "Compara remesas, préstamos y seguros en El Salvador, Guatemala y Honduras. Datos actualizados diariamente.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Finazo — Comparador financiero para Centroamérica",
    description:
      "Compara remesas, préstamos y seguros en El Salvador, Guatemala y Honduras.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${lora.variable} ${dmSans.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
