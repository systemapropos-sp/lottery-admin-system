import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from "plugin-inspect-react-code"
import { VitePWA } from "vite-plugin-pwa"

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    inspectAttr(),
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: null,
      manifest: {
        name: "NMV Lottery Admin",
        short_name: "NMV Admin",
        description: "Sistema de Administración NMV Lottery",
        theme_color: "#1e293b",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        start_url: "/admin/",
        scope: "/admin/",
        icons: [
          {
            src: "/admin/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/admin/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        navigateFallback: "/admin/index.html",
        navigateFallbackDenylist: [/^\/(?!admin)/],
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024, // 4 MiB
      },
    }),
  ],
  build: {
    rollupOptions: {
      external: [],
    },
    // Ensure template literals get properly minified to avoid multi-line issues
    minify: 'esbuild',
  },
  esbuild: {
    legalComments: 'none',
    minifyWhitespace: true,
    minifySyntax: true,
    minifyIdentifiers: false,
  },
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
