import { defineConfig } from "vite";
import type { ProxyOptions } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

/**
 * Yahoo Finance doesn't allow requests straight from a browser (CORS), so the app asks its own
 * server at /api/yahoo/... and Vite forwards that to Yahoo and hands back the answer.
 * This works for `npm run dev` and `npm run preview`. A deployed site needs a real proxy; until
 * there is one, the IHSG chart falls back to the TradingView widget (see IhsgView.tsx).
 */
const yahooProxy: Record<string, ProxyOptions> = {
  "/api/yahoo": {
    target: "https://query1.finance.yahoo.com",
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api\/yahoo/, ""),
    configure: (proxy) => {
      proxy.on("proxyReq", (proxyReq) => {
        // Don't tell Yahoo the request came from localhost.
        proxyReq.removeHeader("origin");
        proxyReq.removeHeader("referer");
      });
    },
  },
};

// https://vite.dev/config/
// GitHub Pages serves a project site from /<repo>/. Override with VITE_BASE=/ for a custom domain.
export default defineConfig({
  base: process.env.VITE_BASE ?? "/updated-portfolio/",
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  server: { proxy: yahooProxy },
  preview: { proxy: yahooProxy },
});
