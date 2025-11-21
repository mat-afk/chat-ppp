// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "nuxt-auth-utils", "@vueuse/nuxt"],
  css: ["~/assets/css/main.css"],
  nitro: {
    experimental: {
      websocket: true,
    },
    replace: {
      "import * as process": "import * as processUnused",
    },
    preset: "vercel",
    externals: {
      inline: ["@prisma/client", "prisma"],
    },
  },
});
