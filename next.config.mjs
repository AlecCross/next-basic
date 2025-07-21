// @ts-check
import withSerwistInit from "@serwist/next";

// You may want to use a more robust revision to cache
// files more efficiently.
// A viable option is `git rev-parse HEAD`.
const revision = crypto.randomUUID();

const withSerwist = withSerwistInit({
  cacheOnNavigation: true,
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  additionalPrecacheEntries: [
    { url: "/", revision },
    { url: "/favicon.ico", revision },
    { url: "/manifest.json", revision },
    { url: "/robots.txt", revision },
    { url: "/~offline", revision },
    { url: "/icons/icon-512x512.png", revision },
    { url: "/icons/apple-touch-icon.png", revision },
    { url: "/icons/android-chrome-192x192.png", revision },
    // Додайте інші важливі сторінки/ресурси
  ],
});

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default withSerwist(nextConfig);
