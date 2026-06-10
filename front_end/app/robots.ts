import { MetadataRoute } from "next";

export default function robot(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "",
      },
    ],
    sitemap: `https://social-media-app-psi-ecru.vercel.app/sitemap.xml`,
  };
}
