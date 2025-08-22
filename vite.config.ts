import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    ViteImageOptimizer({
      jpg: { quality: 75 },
      jpeg: { quality: 75 },
      png: { quality: 75 },
      webp: { quality: 75 },
      avif: { quality: 50 },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
