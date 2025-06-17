import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src", // Adjust the base path based on your project structure
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss],
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
  },
  base: "/", // Use '/' for deployment at the root of the domain
  server: {
    host: true, // Allows access from external devices
    port: 5173, // Port for local development
    hmr: {
      protocol: "ws", // Use 'wss' if serving over HTTPS in production | 'ws' for HTTP
      // host: "dreamwedz.in",
      host: 'localhost',
    },
  },
});
