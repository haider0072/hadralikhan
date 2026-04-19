import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono, Caveat } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Haider Ali Khan — Product Designer, PM & Developer",
  description:
    "Karachi-based multidisciplinary maker. Designing, managing, and shipping software end-to-end.",
  metadataBase: new URL("https://hadralikhan.com"),
  openGraph: {
    title: "Haider Ali Khan — Product Designer, PM & Developer",
    description:
      "Karachi-based multidisciplinary maker. Designing, managing, and shipping software end-to-end.",
    type: "website",
  },
};

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
      </body>
    </html>
  );
}
