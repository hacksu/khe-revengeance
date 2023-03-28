import { defineConfig } from "vite";
import path from "path";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath } from "url";

// https://vitejs.dev/config/
export default defineConfig({
  root: path.resolve(path.dirname(fileURLToPath(import.meta.url))),
  publicDir: "public",
  resolve: {
    alias: [
      {
        find: /^~/,
        replacement: "",
      },
      {
        find: "@",
        replacement: path.resolve(__dirname, "src"),
      },
    ],
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
  },
  plugins: [vue()],
  build: { outDir: "dist" },
  ssgOptions: {
    entry: "src/main.js",
  },
});
