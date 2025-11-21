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
  },
  runtimeConfig: {
    public: {
      nodeEnv: process.env.NUXT_NODE_ENV ?? "dev",
    },
  },
});
