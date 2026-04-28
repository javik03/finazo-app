import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./us-globals.css";

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
      {children}
    </div>
  );
}
