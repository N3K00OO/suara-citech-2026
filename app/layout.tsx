import type { Metadata } from "next";
import { headers } from "next/headers";
import { SiteMotion } from "./components/SiteMotion";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") || requestHeaders.get("host") || "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  return {
    metadataBase: new URL(origin),
    title: {
      default: "SUARA — Catatan Kebijakan Publik",
      template: "%s · SUARA",
    },
    description:
      "Ikuti pengalaman warga menjadi masukan formal, pertimbangan lembaga, dan perubahan kebijakan yang dapat diperiksa.",
    icons: {
      icon: [{ url: "/suara-icon.png", type: "image/png", sizes: "512x512" }],
      shortcut: "/suara-icon.png",
      apple: [{ url: "/suara-icon.png", sizes: "512x512", type: "image/png" }],
    },
    openGraph: {
      title: "SUARA — Ikuti satu suara sampai kebijakan berubah",
      description:
        "Prototipe konsultasi kebijakan publik yang menelusuri dampak, masukan, musyawarah, keputusan, dan revisi.",
      images: [{ url: `${origin}/og.png`, width: 1586, height: 992, alt: "SUARA dengan peta 3D Nusantara" }],
      type: "website",
      locale: "id_ID",
    },
    twitter: {
      card: "summary_large_image",
      title: "SUARA — Catatan Kebijakan Publik",
      description: "Satu kebijakan. Banyak kehidupan.",
      images: [`${origin}/og.png`],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>
        <SiteMotion />
        {children}
      </body>
    </html>
  );
}
