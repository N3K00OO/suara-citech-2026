import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") || requestHeaders.get("host") || "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  return {
    metadataBase: new URL(origin),
    title: "Tanah Air — Atlas 3D Indonesia",
    description: "Jelajahi 38 provinsi Indonesia melalui peta kepulauan 3D yang interaktif.",
    openGraph: {
      title: "Tanah Air — Atlas 3D Indonesia",
      description: "Putar, perbesar, dan jelajahi Nusantara dalam tiga dimensi.",
      images: [{ url: `${origin}/og.png`, width: 1672, height: 941, alt: "Peta relief Indonesia dengan judul Jelajahi Nusantara" }],
      type: "website",
      locale: "id_ID",
    },
    twitter: {
      card: "summary_large_image",
      title: "Tanah Air — Atlas 3D Indonesia",
      description: "Putar, perbesar, dan jelajahi Nusantara dalam tiga dimensi.",
      images: [`${origin}/og.png`],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}

