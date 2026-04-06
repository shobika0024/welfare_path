import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    // Avoid bundling multiple React copies (can cause Context errors like "render2 is not a function")
    dedupe: ["react", "react-dom", "react-leaflet", "@react-leaflet/core"],
  },
}));
