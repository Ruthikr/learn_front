import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true, // Enables PWA in development
      },
      manifest: {
        name: "Learn Python",
        short_name: "PyLearn",
        description: "Learn python interactively with code assistant and community help",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "snake-312561_1920.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/snake-312561_1920.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  logLevel: 'info', // Set log level to 'info' for build
});