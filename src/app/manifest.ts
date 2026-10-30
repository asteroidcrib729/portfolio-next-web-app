import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/siteConfig";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.siteName,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#070b12",
    theme_color: "#0369a1",
    icons: [{ src: "/signature-logo.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
