import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { Marquee } from "@/components/sections/marquee";
import { About } from "@/components/sections/about";
import { Experience } from "@/components/sections/experience";
import { Featured } from "@/components/sections/featured";
import { OtherProjects } from "@/components/sections/other-projects";
import { Skills } from "@/components/sections/skills";
import { Contact } from "@/components/sections/contact";
import { seo } from "@/data/seo";

export const metadata: Metadata = {
  title: "Classic — scroll version",
  description: `A traditional scrolling portfolio view of ${seo.name}'s work. Hero, experience, selected projects, and contact — laid out as a cinematic long-read.`,
  alternates: { canonical: "/classic" },
  openGraph: {
    url: `${seo.url}/classic`,
    title: `${seo.name} — ${seo.role} (Classic view)`,
  },
};

export default function ClassicHome() {
  return (
    <>
      <Hero />
      <Marquee />
      <About />
      <Experience />
      <Featured />
      <OtherProjects />
      <Skills />
      <Contact />
    </>
  );
}
