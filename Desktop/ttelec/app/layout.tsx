import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import UrgenceBar from "@/components/UrgenceBar";
import FloatingButtons from "@/components/FloatingButtons";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const dmSans = DM_Sans({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const dmMono = DM_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-dm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Électricien Agréé Bruxelles | Installation, Dépannage 24/7 — TT Elec",
  description:
    "TT Elec, électricien agréé RGIE à Bruxelles et alentours. Installation électrique, caméras de sécurité, tableau électrique, domotique. Devis gratuit sous 24h. Urgences 24h/7j.",
  keywords: [
    "électricien bruxelles",
    "électricien agréé bruxelles",
    "installation électrique bruxelles",
    "tableau électrique bruxelles",
    "caméra sécurité bruxelles",
    "électricien urgence bruxelles",
    "dépannage électrique bruxelles",
    "RGIE bruxelles",
  ],
  openGraph: {
    title: "Électricien Agréé Bruxelles | TT Elec",
    description:
      "TT Elec, électricien agréé RGIE à Bruxelles. Installation, dépannage 24/7, caméras, domotique. Devis gratuit sous 24h.",
    locale: "fr_BE",
    type: "website",
  },
};

const schemaOrg = {
  "@context": "https://schema.org",
  "@type": "ElectricalContractor",
  name: "TT Elec",
  telephone: "+32465904372",
  areaServed: "Bruxelles",
  priceRange: "€€",
  openingHours: "Mo-Su 00:00-24:00",
  hasCredential: "RGIE",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bruxelles",
    addressCountry: "BE",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      className={`${bebasNeue.variable} ${dmSans.variable} ${dmMono.variable}`}
    >
      <body>
        <Header />
        <main>{children}</main>
        <UrgenceBar />
        <FloatingButtons />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
      </body>
    </html>
  );
}
