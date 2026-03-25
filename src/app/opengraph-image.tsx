import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Finazo — Comparador financiero para Centroamérica";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "#F0F7F3",
          padding: "80px",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "32px",
          }}
        >
          <span
            style={{
              fontSize: "48px",
              fontWeight: "700",
              color: "#1A6635",
              letterSpacing: "-1px",
            }}
          >
            Finazo
          </span>
          <span
            style={{
              marginLeft: "16px",
              fontSize: "18px",
              color: "#2d8a50",
              background: "#dcfce7",
              padding: "4px 12px",
              borderRadius: "999px",
              fontFamily: "sans-serif",
              fontWeight: "600",
            }}
          >
            finazo.lat
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: "64px",
            fontWeight: "700",
            color: "#111",
            lineHeight: 1.1,
            maxWidth: "900px",
            marginBottom: "24px",
          }}
        >
          Tu dinero rinde más{" "}
          <span style={{ color: "#1A6635" }}>cuando comparas primero</span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "28px",
            color: "#555",
            fontFamily: "sans-serif",
            fontWeight: "400",
          }}
        >
          Remesas · Préstamos · Seguros — El Salvador, Guatemala, Honduras
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            height: "8px",
            background: "#1A6635",
          }}
        />
      </div>
    ),
    size
  );
}
