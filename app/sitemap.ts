import type { MetadataRoute } from "next";
import { CARROS, url } from "@/lib/carros";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const agora = new Date();
  return [
    { url: SITE.url, lastModified: agora, changeFrequency: "daily", priority: 1 },
    ...CARROS.map((c) => ({ url: `${SITE.url}${url(c)}`, lastModified: agora, changeFrequency: "weekly" as const, priority: 0.7 })),
  ];
}
