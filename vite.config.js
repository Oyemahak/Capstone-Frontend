// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: "/",
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  server: {
    host: true,
    port: 5173,
    open: true,
    // 👇 Dev-only proxy so localhost can call your Vercel Serverless Functions
    proxy: {
      // Any request to /vercel-api/* will be proxied to https://mspixelpulse.vercel.app/api/*
      "/vercel-api": {
        target: "https://mspixelpulse.vercel.app",
        changeOrigin: true,
        secure: true,
        rewrite: (pathStr) => pathStr.replace(/^\/vercel-api/, "/api"),
      },
    },
  },
  preview: { port: 4173 },
  optimizeDeps: { include: ["three"] },
  build: {
    outDir: "dist",
    target: "es2020",
    sourcemap: mode !== "production",
    assetsInlineLimit: 0,
    rollupOptions: {
      output: { manualChunks: { three: ["three"] } },
    },
  },
  define: { "process.env": {} },
}));