import { defineConfig } from "vite";
import path from "path";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath } from "url";

const localRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
const includesRoot = path.resolve(localRoot, "../global-includes/");

// https://vitejs.dev/config/
export default defineConfig({
  root: localRoot,
  publicDir: "public",
  resolve: {
    alias: [
      {
        find: /^includes/,
        replacement: includesRoot,
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
