import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path";
import { fileURLToPath } from "url";

// Fix for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react(), svgr()],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.tsx"), // Ensures correct entry point
      name: "AspynUIKit",
      fileName: (format) => `index.${format}.js`,
      formats: ["es", "cjs", "umd"], // Builds in multiple formats
    },
    rollupOptions: {
      external: ["react", "react-dom"], // Excludes React from bundle
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
