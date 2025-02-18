import { defineConfig } from "tsup";
import fs from "fs-extra";

export default defineConfig({
  entry: ["src/index.tsx"], // ✅ Define your main entry file here!
  format: ["esm", "cjs"],    // ✅ Build both ESM & CJS
  dts: true,                 // ✅ Generate TypeScript declaration files
  splitting: false,          // ✅ Disable code splitting (not needed for UI libraries)
  sourcemap: true,           // ✅ Generate source maps
  clean: true,                // ✅ Clean `dist/` before building
});
