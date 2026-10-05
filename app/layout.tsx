import type { Metadata, Viewport } from "next";
import { DM_Sans, Barlow_Semi_Condensed } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const barlow = Barlow_Semi_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["900"],
  style: ["italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Marés Seminovos · Carros com procedência, laudo e garantia",
    template: "%s · Marés Seminovos",
  },
  description:
    "Seminovos com procedência, laudo cautelar e garantia de 3 meses. Simule a parcela, avalie seu carro na troca e fale com um vendedor pelo WhatsApp.",
  applicationName: "Marés Seminovos",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Marés Seminovos",
    images: [{ url: "/fotos/kicks-principal.jpg", width: 1600, height: 1194 }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#3468e2",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoDealer",
  name: "Marés Seminovos",
  url: SITE.url,
  telephone: "+55-13-4000-2026",
  description: "Projeto fictício para o desafio de Product Designer da AutoForce.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Av. Ana Costa, 1200",
    addressLocality: "Santos",
    addressRegion: "SP",
    addressCountry: "BR",
  },
  openingHours: "Mo-Sa 09:00-19:00",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${dmSans.variable} ${barlow.variable} antialiased`}>
      <body className="min-h-dvh flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
