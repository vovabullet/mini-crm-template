import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const API = process.env.VITE_API_PROXY ?? "http://127.0.0.1:8000"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  server: {
    host: true, // доступно с телефона в той же Wi-Fi сети
    port: 5173,
    proxy: { "/api": API, "/media": API },
  },
})
