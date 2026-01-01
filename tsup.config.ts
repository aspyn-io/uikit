import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./src/index.tsx"], // ✅ Define your main entry file here!
  format: ["esm", "cjs"], // ✅ Build both ESM & CJS
  outExtension: ({ format }) => ({
    js: format === "esm" ? ".es.js" : ".cjs.js", // ✅ Ensure correct file extensions
  }),
  dts: true, // ✅ Generate TypeScript declaration files
  splitting: false, // ✅ Disable code splitting (not needed for UI libraries)
  sourcemap: true, // ✅ Generate source maps
  clean: true, // ✅ Clean `dist/` before building
  esbuildOptions(options) {
    // Alias libphonenumber-js to use /min version for smaller bundle
    options.alias = {
      ...options.alias,
      "libphonenumber-js": "libphonenumber-js/min",
    };
  },
});
