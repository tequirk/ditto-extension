import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import { copyManifest } from "./plugins/copyManifest";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [vue(), copyManifest(), tailwindcss()],
}));
