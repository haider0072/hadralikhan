import { Hero } from "@/components/sections/hero";
import { Marquee } from "@/components/sections/marquee";
import { About } from "@/components/sections/about";
import { Experience } from "@/components/sections/experience";
import { Featured } from "@/components/sections/featured";
import { OtherProjects } from "@/components/sections/other-projects";
import { Skills } from "@/components/sections/skills";
import { Contact } from "@/components/sections/contact";

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
