import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      stream: "stream-browserify",   // polyfill for Node's stream
      buffer: "buffer",              // polyfill for Node's buffer
      events: "events/",             // polyfill for Node's events
      util: "util/",                 // polyfill for Node's util
      process: "process/browser",    // 👈 make sure this points to the browser polyfill
    },
  },
  define: {
    global: "window",
    "process.env": {}, // 👈 inject an empty process.env object
  },
  optimizeDeps: {
    include: ["events", "util", "process"], // 👈 force Vite to prebundle these
  },
})
