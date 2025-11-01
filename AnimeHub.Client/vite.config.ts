import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // All requests starting with '/api' will be forwarded to your backend URL
      "/api": {
        target: "http://localhost:44393", // **<- REPLACE with your actual ASP.NET Core API URL/port**
        changeOrigin: true,
        secure: false, // Set to true if your API uses HTTPS
        // rewrite: (path) => path.replace(/^\/api/, '') // Optional: remove '/api' if not needed by backend
      },
    },
  },
});
