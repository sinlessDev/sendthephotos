import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        changeOrigin: true,
        target: "http://localhost:3030",
      },
      "/files": {
        target: "http://localhost:8080",
      },
    },
  },
});
