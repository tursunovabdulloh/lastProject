import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import viteCompression from "vite-plugin-compression";

export default defineConfig({
  base: "/Stakepool-Frontend/", // Saytning asosiy yo‘li

  plugins: [
    react(), // React pluginini o‘rnatish
    viteCompression(), // Siqish plaginini qo‘shish
  ],

  resolve: {
    alias: {
      "~": path.resolve(__dirname, "node_modules"), // Node modullar uchun alias
      "@": path.resolve(__dirname, "src"), // Source fayllar uchun alias
    },
  },

  build: {
    chunkSizeWarningLimit: 1600, // Katta chunk fayllar uchun ogohlantirish chegarasini 1600 kB qilib belgilash

    rollupOptions: {
      output: {
        // Manual chunks sozlamalari
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
          }
        },
      },
    },

    // Media resurslar uchun inline limit
    assetsInlineLimit: 4096, // 4kB dan kichik resurslarni inline qilish
  },
});
