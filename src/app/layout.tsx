import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, JetBrains_Mono, Caveat } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { seo } from "@/data/seo";
import { site } from "@/data/site";
import { projects } from "@/data/projects";
import { experience } from "@/data/experience";

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
    default: `${seo.name} · ${seo.role}`,
    template: `%s · ${seo.name}`,
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
    title: `${seo.name} · ${seo.role}`,
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
    title: `${seo.name} · ${seo.role}`,
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
};

function JsonLd() {
  const personId = `${seo.url}/#person`;

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": personId,
    name: seo.name,
    alternateName: ["hadralikhan", "Haider", "Haider Khan"],
    givenName: "Haider Ali",
    familyName: "Khan",
    url: seo.url,
    image: `${seo.url}/opengraph-image`,
    jobTitle: seo.role,
    description: seo.description,
    email: `mailto:${site.email}`,
    nationality: { "@type": "Country", name: "Pakistan" },
    address: {
      "@type": "PostalAddress",
      addressLocality: seo.location.city,
      addressCountry: seo.location.countryCode,
      addressRegion: "Sindh",
    },
    homeLocation: {
      "@type": "Place",
      name: `${seo.location.city}, ${seo.location.country}`,
    },
    knowsAbout: seo.skills,
    knowsLanguage: ["English", "Urdu"],
    hasOccupation: [
      {
        "@type": "Occupation",
        name: "Product Designer",
        skills: "Figma, Framer, design systems, prototyping, art direction",
      },
      {
        "@type": "Occupation",
        name: "Product Manager",
        skills: "roadmap, discovery, prioritization",
      },
      {
        "@type": "Occupation",
        name: "Full-Stack Developer",
        skills:
          "React, Next.js, Vue, Nuxt, TypeScript, Flutter, NestJS, Kotlin, Python, Go, AWS CDK",
      },
      {
        "@type": "Occupation",
        name: "AI Product Engineer",
        skills: "LLM agents, MCP, LangChain, prompt engineering, RAG",
      },
    ],
    worksFor: {
      "@type": "Organization",
      name: "DigitalHire",
      url: "https://digitalhire.com",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Bahria University",
      url: "https://www.bahria.edu.pk",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Hiring & inquiries",
      email: site.email,
      availableLanguage: ["English", "Urdu"],
      areaServed: [
        "Worldwide",
        "United States",
        "United Kingdom",
        "European Union",
        "Canada",
        "Australia",
        "Singapore",
        "United Arab Emirates",
      ],
    },
    workLocation: {
      "@type": "Place",
      name: "Remote, worldwide",
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
    "@id": `${seo.url}/#website`,
    name: seo.name,
    alternateName: `${seo.name} portfolio`,
    url: seo.url,
    author: { "@id": personId },
    publisher: { "@id": personId },
    inLanguage: "en",
    description: seo.description,
  };

  const profilePage = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${seo.url}/#profile`,
    url: seo.url,
    name: `${seo.name} · Portfolio`,
    headline: `${seo.name} · ${seo.role}`,
    description: seo.description,
    inLanguage: "en",
    mainEntity: { "@id": personId },
    isPartOf: { "@id": `${seo.url}/#website` },
    primaryImageOfPage: `${seo.url}/opengraph-image`,
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Portfolio", item: seo.url },
    ],
  };

  const portfolioCollection = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${seo.url}/#portfolio`,
    url: seo.url,
    name: `${seo.name} — selected work`,
    inLanguage: "en",
    isPartOf: { "@id": `${seo.url}/#website` },
    about: { "@id": personId },
    hasPart: projects.map((p) => ({
      "@type": "CreativeWork",
      name: p.title,
      headline: p.tagline,
      url: `${seo.url}/work/${p.slug}`,
      dateCreated: `${p.year}-01-01`,
      author: { "@id": personId },
      keywords: p.stack.join(", "),
    })),
  };

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${seo.name} — projects`,
    itemListOrder: "Unordered",
    numberOfItems: projects.length,
    itemListElement: projects.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${seo.url}/work/${p.slug}`,
      name: p.title,
    })),
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Who is Haider Ali Khan?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Haider Ali Khan is a senior, multidisciplinary Product Designer, Product Manager, and Full-Stack Developer working remotely with companies worldwide. He designs products end-to-end and ships the systems underneath: product UX, AI agents, web, mobile, backend, and infrastructure.`,
        },
      },
      {
        "@type": "Question",
        name: "Is Haider Ali Khan available for hire internationally?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes. Haider works fully remote and is open to engagements with companies in the US, UK, Europe, Canada, Australia, Singapore, the UAE, and elsewhere. Available full-time, contract, or consulting. Reach him at ${site.email}.`,
        },
      },
      {
        "@type": "Question",
        name: "What time zones does he work across?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `He has comfortable real-time overlap with US East-Coast mornings, all of Europe and the UK, and most of APAC and the Middle East. His baseline is UTC+05.`,
        },
      },
      {
        "@type": "Question",
        name: "What kind of roles is he a fit for?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Founding / first-design hires at AI and SaaS startups; senior or staff product designer roles where engineering fluency is a plus; design-engineer roles; AI product engineer / agent engineer roles; full-stack engineer with strong product taste.`,
        },
      },
      {
        "@type": "Question",
        name: "What does he specialize in?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `End-to-end product work for AI-native and SaaS companies: design systems, prototyping, LLM agents, MCP, RAG, React/Next.js, Vue/Nuxt, TypeScript, Flutter, NestJS, Kotlin, Python, Go, and AWS CDK infrastructure.`,
        },
      },
      {
        "@type": "Question",
        name: "What is Haider's stack?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Design: Figma, Framer, Blender, Rive. Frontend: React, Next.js, Vue/Nuxt, TypeScript, Three.js, GSAP, Tailwind, shadcn/ui. Mobile: Flutter, Dart. Backend: NestJS, Kotlin/Ktor, FastAPI, Go, Node.js, Postgres. AI/ML: Python, LangChain, LLM agents, MCP, RAG. Infra: AWS CDK, Docker, Kafka.`,
        },
      },
      {
        "@type": "Question",
        name: "What projects has Haider built?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `${projects
            .slice(0, 7)
            .map((p) => `${p.title} (${p.tagline})`)
            .join("; ")}.`,
        },
      },
    ],
  };

  const employment = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": personId,
    workExperience: experience.map((e) => ({
      "@type": "OrganizationRole",
      roleName: e.role,
      startDate: e.period,
      worksFor: { "@type": "Organization", name: e.company },
      description: e.body,
      location: e.location,
    })),
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePage) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(portfolioCollection) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(employment) }}
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
      <head>
        <link rel="me" href={site.socials.github} />
        <link rel="me" href={site.socials.linkedin} />
        <link rel="me" href={site.socials.twitter} />
        <link rel="me" href={site.socials.email} />
        <link rel="author" href={seo.url} />
      </head>
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
        <SpeedInsights />
      </body>
    </html>
  );
}
