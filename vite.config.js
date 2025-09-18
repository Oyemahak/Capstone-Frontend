import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: "/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },
  server: {
    host: true,     // allows LAN / mobile testing
    port: 5173,
    open: true
  },
  preview: {
    port: 4173
  },
  optimizeDeps: {
    // Ensure Three is pre-bundled to avoid slow dev startup / missing deps
    include: ["three"]
  },
  build: {
    outDir: "dist",
    target: "es2020",
    sourcemap: mode !== "production",
    assetsInlineLimit: 0, // keep assets as files, helpful for debugging and caching
    rollupOptions: {
      output: {
        // Small manual chunk to keep Three separated (nice for caching on Vercel CDN)
        manualChunks: {
          three: ["three"]
        }
      }
    }
  },
  define: {
    // Some libs expect process.env to exist. Keeps things quiet in browser.
    "process.env": {}
  }
}));