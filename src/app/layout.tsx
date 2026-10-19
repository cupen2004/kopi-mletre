import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kopi Mletre — Ngopi Santai, Rasa Istimewa",
  description:
    "Kedai kopi modern dengan cita rasa autentik nusantara. Nikmati racikan kopi terbaik dari biji pilihan di setiap cangkir.",
  keywords: [
    "kopi",
    "mletre",
    "kedai kopi",
    "coffee shop",
    "kopi nusantara",
    "specialty coffee",
  ],
  openGraph: {
    title: "Kopi Mletre — Ngopi Santai, Rasa Istimewa",
    description:
      "Kedai kopi modern dengan cita rasa autentik nusantara. Nikmati racikan kopi terbaik dari biji pilihan di setiap cangkir.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#1a1614",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Poppins:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
