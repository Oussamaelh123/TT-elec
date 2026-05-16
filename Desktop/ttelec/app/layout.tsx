import type { Metadata } from "next";
import { Fraunces, Syne, DM_Sans } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Électricien Agréé Bruxelles | Installation, Dépannage 24/7 — TT Elec",
  description:
    "TT Elec, électricien agréé RGIE à Bruxelles et alentours. Installation électrique, tableau, éclairage, domotique, caméras. Devis gratuit 24h. Urgences 24h/7j.",
  keywords: [
    "électricien bruxelles",
    "électricien agréé bruxelles",
    "installation électrique bruxelles",
    "tableau électrique bruxelles",
    "caméra sécurité bruxelles",
    "électricien urgence bruxelles 24h",
    "domotique bruxelles",
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
  url: "https://tt-elec.be",
  sameAs: ["https://www.tiktok.com/@tt.elec"],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bruxelles",
    addressCountry: "BE",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${syne.variable} ${dmSans.variable}`}>
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
      </body>
    </html>
  );
}
