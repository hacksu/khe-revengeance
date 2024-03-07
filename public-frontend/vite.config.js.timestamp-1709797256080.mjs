// public-frontend/vite.config.js
import { defineConfig } from "file:///C:/Users/Noah/Programming/JavaScript/khe-revengeance/node_modules/vite/dist/node/index.js";
import path from "path";
import vue from "file:///C:/Users/Noah/Programming/JavaScript/khe-revengeance/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import svgLoader from "file:///C:/Users/Noah/Programming/JavaScript/khe-revengeance/node_modules/vite-svg-loader/index.js";
import { fileURLToPath } from "url";
var __vite_injected_original_dirname = "C:\\Users\\Noah\\Programming\\JavaScript\\khe-revengeance\\public-frontend";
var __vite_injected_original_import_meta_url = "file:///C:/Users/Noah/Programming/JavaScript/khe-revengeance/public-frontend/vite.config.js";
var localRoot = path.resolve(path.dirname(fileURLToPath(__vite_injected_original_import_meta_url)));
var includesRoot = path.resolve(localRoot, "../global-includes/");
var vite_config_default = defineConfig({
  root: localRoot,
  publicDir: "public",
  resolve: {
    alias: [
      {
        find: /^includes/,
        replacement: includesRoot
      },
      {
        find: "@",
        replacement: path.resolve(__vite_injected_original_dirname, "src")
      }
    ],
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"]
  },
  plugins: [vue(), svgLoader({ defaultImport: "url" })],
  build: { outDir: "dist", transpile: ["primevue"] },
  ssgOptions: {
    entry: "src/main.js",
    format: "cjs"
  },
  ssr: {
    noExternal: ["primevue"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsicHVibGljLWZyb250ZW5kL3ZpdGUuY29uZmlnLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcTm9haFxcXFxQcm9ncmFtbWluZ1xcXFxKYXZhU2NyaXB0XFxcXGtoZS1yZXZlbmdlYW5jZVxcXFxwdWJsaWMtZnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXE5vYWhcXFxcUHJvZ3JhbW1pbmdcXFxcSmF2YVNjcmlwdFxcXFxraGUtcmV2ZW5nZWFuY2VcXFxccHVibGljLWZyb250ZW5kXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9Ob2FoL1Byb2dyYW1taW5nL0phdmFTY3JpcHQva2hlLXJldmVuZ2VhbmNlL3B1YmxpYy1mcm9udGVuZC92aXRlLmNvbmZpZy5qc1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XHJcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XHJcbmltcG9ydCB2dWUgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXZ1ZVwiO1xyXG5pbXBvcnQgc3ZnTG9hZGVyIGZyb20gJ3ZpdGUtc3ZnLWxvYWRlcidcclxuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gXCJ1cmxcIjtcclxuXHJcbmNvbnN0IGxvY2FsUm9vdCA9IHBhdGgucmVzb2x2ZShwYXRoLmRpcm5hbWUoZmlsZVVSTFRvUGF0aChpbXBvcnQubWV0YS51cmwpKSk7XHJcbmNvbnN0IGluY2x1ZGVzUm9vdCA9IHBhdGgucmVzb2x2ZShsb2NhbFJvb3QsIFwiLi4vZ2xvYmFsLWluY2x1ZGVzL1wiKTtcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcm9vdDogbG9jYWxSb290LFxyXG4gIHB1YmxpY0RpcjogXCJwdWJsaWNcIixcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczogW1xyXG4gICAgICB7XHJcbiAgICAgICAgZmluZDogL15pbmNsdWRlcy8sXHJcbiAgICAgICAgcmVwbGFjZW1lbnQ6IGluY2x1ZGVzUm9vdCxcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIGZpbmQ6IFwiQFwiLFxyXG4gICAgICAgIHJlcGxhY2VtZW50OiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcInNyY1wiKSxcclxuICAgICAgfSxcclxuICAgIF0sXHJcbiAgICBleHRlbnNpb25zOiBbXCIubWpzXCIsIFwiLmpzXCIsIFwiLnRzXCIsIFwiLmpzeFwiLCBcIi50c3hcIiwgXCIuanNvblwiLCBcIi52dWVcIl0sXHJcbiAgfSxcclxuICBwbHVnaW5zOiBbdnVlKCksIHN2Z0xvYWRlcih7ZGVmYXVsdEltcG9ydDogXCJ1cmxcIn0pXSxcclxuICBidWlsZDogeyBvdXREaXI6IFwiZGlzdFwiLCB0cmFuc3BpbGU6IFtcInByaW1ldnVlXCJdIH0sXHJcbiAgc3NnT3B0aW9uczoge1xyXG4gICAgZW50cnk6IFwic3JjL21haW4uanNcIixcclxuICAgIGZvcm1hdDogXCJjanNcIlxyXG4gIH0sXHJcbiAgc3NyOiB7XHJcbiAgICBub0V4dGVybmFsOiBbXCJwcmltZXZ1ZVwiXSxcclxuICB9LFxyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE0WSxTQUFTLG9CQUFvQjtBQUN6YSxPQUFPLFVBQVU7QUFDakIsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sZUFBZTtBQUN0QixTQUFTLHFCQUFxQjtBQUo5QixJQUFNLG1DQUFtQztBQUFvTixJQUFNLDJDQUEyQztBQU05UyxJQUFNLFlBQVksS0FBSyxRQUFRLEtBQUssUUFBUSxjQUFjLHdDQUFlLENBQUMsQ0FBQztBQUMzRSxJQUFNLGVBQWUsS0FBSyxRQUFRLFdBQVcscUJBQXFCO0FBR2xFLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLE1BQU07QUFBQSxFQUNOLFdBQVc7QUFBQSxFQUNYLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMO0FBQUEsUUFDRSxNQUFNO0FBQUEsUUFDTixhQUFhO0FBQUEsTUFDZjtBQUFBLE1BQ0E7QUFBQSxRQUNFLE1BQU07QUFBQSxRQUNOLGFBQWEsS0FBSyxRQUFRLGtDQUFXLEtBQUs7QUFBQSxNQUM1QztBQUFBLElBQ0Y7QUFBQSxJQUNBLFlBQVksQ0FBQyxRQUFRLE9BQU8sT0FBTyxRQUFRLFFBQVEsU0FBUyxNQUFNO0FBQUEsRUFDcEU7QUFBQSxFQUNBLFNBQVMsQ0FBQyxJQUFJLEdBQUcsVUFBVSxFQUFDLGVBQWUsTUFBSyxDQUFDLENBQUM7QUFBQSxFQUNsRCxPQUFPLEVBQUUsUUFBUSxRQUFRLFdBQVcsQ0FBQyxVQUFVLEVBQUU7QUFBQSxFQUNqRCxZQUFZO0FBQUEsSUFDVixPQUFPO0FBQUEsSUFDUCxRQUFRO0FBQUEsRUFDVjtBQUFBLEVBQ0EsS0FBSztBQUFBLElBQ0gsWUFBWSxDQUFDLFVBQVU7QUFBQSxFQUN6QjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
