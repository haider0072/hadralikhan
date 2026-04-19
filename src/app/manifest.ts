import type { MetadataRoute } from "next";
import { seo } from "@/data/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${seo.name} — ${seo.role}`,
    short_name: seo.shortName,
    description: seo.description,
    start_url: "/",
    display: "standalone",
    background_color: "#f4ece0",
    theme_color: "#f4ece0",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
