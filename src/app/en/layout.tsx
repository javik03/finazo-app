import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://finazo.lat"),
  alternates: {
    canonical: "https://finazo.lat/en",
    languages: {
      "en-US": "https://finazo.lat/en",
      "es-SV": "https://finazo.lat",
      "es-GT": "https://finazo.lat",
      "es-HN": "https://finazo.lat",
      "es-MX": "https://finazo.lat",
      "x-default": "https://finazo.lat/en",
    },
  },
};

export default function EnLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return <div lang="en">{children}</div>;
}
