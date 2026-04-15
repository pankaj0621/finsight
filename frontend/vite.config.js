import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react({
      // PERF: babel transforms only what's needed
      babel: { plugins: [] },
    }),
  ],

  server: {
    port: 5173,
    proxy: {
      "/api": { target: "http://localhost:8000", changeOrigin: true },
    },
  },

  build: {
    // PERF: smaller chunks = faster parse time
    chunkSizeWarningLimit: 600,
    
    // PERF: target modern browsers only — smaller, faster output
    target: "es2020",

    // PERF: minify + compress
    minify: "esbuild",
    
    rollupOptions: {
      output: {
        // PERF: split vendor code so browser caches them separately
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("recharts") || id.includes("d3-")) return "recharts";
            if (id.includes("react-dom"))                        return "react-dom";
            if (id.includes("react"))                           return "react";
            return "vendor";
          }
        },
      },
    },
  },

  // PERF: pre-bundle dependencies for instant dev startup
  optimizeDeps: {
    include: ["react", "react-dom", "recharts"],
  },
});
