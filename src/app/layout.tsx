import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, JetBrains_Mono, Caveat } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { seo } from "@/data/seo";
import { site } from "@/data/site";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "opsz"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4ece0" },
    { media: "(prefers-color-scheme: dark)", color: "#2a1f17" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "light",
};

export const metadata: Metadata = {
  metadataBase: new URL(seo.url),
  title: {
    default: `${seo.name} — ${seo.role}`,
    template: `%s — ${seo.name}`,
  },
  description: seo.description,
  keywords: seo.keywords,
  authors: [{ name: seo.name, url: seo.url }],
  creator: seo.name,
  publisher: seo.name,
  applicationName: seo.name,
  category: "portfolio",
  classification: "Portfolio",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "profile",
    locale: seo.locale,
    url: seo.url,
    siteName: seo.name,
    title: `${seo.name} — ${seo.role}`,
    description: seo.description,
    firstName: "Haider",
    lastName: "Ali Khan",
    username: "hadralikhan",
    gender: "male",
  },
  twitter: {
    card: "summary_large_image",
    site: seo.twitterHandle,
    creator: seo.twitterHandle,
    title: `${seo.name} — ${seo.role}`,
    description: seo.description,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.webmanifest",
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  other: {
    "google-site-verification": "",
  },
};

function JsonLd() {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: seo.name,
    alternateName: "hadralikhan",
    url: seo.url,
    image: `${seo.url}/opengraph-image`,
    jobTitle: seo.role,
    description: seo.description,
    email: `mailto:${site.email}`,
    nationality: "Pakistani",
    address: {
      "@type": "PostalAddress",
      addressLocality: seo.location.city,
      addressCountry: seo.location.countryCode,
    },
    knowsAbout: seo.skills,
    knowsLanguage: ["English", "Urdu"],
    worksFor: {
      "@type": "Organization",
      name: "DigitalHire",
      url: "https://digitalhire.com",
    },
    sameAs: [
      site.socials.github,
      site.socials.linkedin,
      site.socials.twitter,
    ],
    seeks: {
      "@type": "Demand",
      name: "Remote product design and engineering opportunities, worldwide",
    },
  };
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: seo.name,
    url: seo.url,
    author: { "@type": "Person", name: seo.name },
    inLanguage: "en",
    description: seo.description,
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Portfolio",
        item: seo.url,
      },
    ],
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${jetbrains.variable} ${caveat.variable}`}
    >
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-ink focus:text-cream focus:px-3 focus:py-2 focus:rounded"
        >
          Skip to content
        </a>
        <div className="grain" aria-hidden />
        <main id="main">{children}</main>
        <JsonLd />
        <Analytics />
      </body>
    </html>
  );
}
