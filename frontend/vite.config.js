import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
  build: {
    // 1. Chunk size limit ko 1000kb tak badha dete hain
    chunkSizeWarningLimit: 1000,
    
    // 2. Badi libraries ko alag-alag chunks mein split karne ki settings
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('recharts')) {
              return 'recharts';
            }
            if (id.includes('framer-motion')) {
              return 'framer-motion';
            }
            return 'vendor'; // Baki saari libraries ek vendor chunk mein
          }
        },
      },
    },
  },
});