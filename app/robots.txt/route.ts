import { getSeoSettings, getSiteUrl } from "@/lib/seo";

// Rebuilt at most every minute. Without this, Next.js builds the file once at deploy time
// and keeps that copy for good (even when the backend wasn't reachable during the build).
export const revalidate = 60;

// /robots.txt: the text from Admin > SEO Settings (or the built-in default),
// always pointing Google to the sitemap
export async function GET() {
  const settings = await getSeoSettings();
  const siteUrl = await getSiteUrl();
  let body = (settings.robotsTxt || settings.defaultRobotsTxt).replace(/\r\n/g, "\n").trim();
  if (!/^\s*sitemap\s*:/im.test(body)) {
    body += `\n\nSitemap: ${siteUrl}/sitemap.xml`;
  }
  return new Response(`${body}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=60, s-maxage=60",
    },
  });
}
