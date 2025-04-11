import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import dts from "vite-plugin-dts";
import path from "path";
import { fileURLToPath } from "url";
import flowbiteReact from "flowbite-react/plugin/vite";

// Fix for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    dts({
      insertTypesEntry: true, // Ensures "types" entry in package.json
      outputDir: "dist", // Saves .d.ts files in dist/
      copyDtsFiles: true, // Copies external .d.ts files from src
    }),
    flowbiteReact(),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.tsx"), // Entry point
      name: "AspynUIKit",
      fileName: (format) => `index.${format}.js`,
      formats: ["es", "cjs", "umd"], // Generates ES, CommonJS, and UMD builds
    },
    rollupOptions: {
      external: ["react", "react-dom"], // Avoid bundling React
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
