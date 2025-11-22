import process from "node:process"

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "nuxt-auth-utils", "@vueuse/nuxt"],
  css: ["~/assets/css/main.css"],
  runtimeConfig: {
    public: {
      databaseUrl:
        process.env.DATABASE_URL ??
        "postgresql://postgres:postgres@localhost:5432/db",
      nodeEnv: process.env.NODE_ENV ?? "development",
    },
  },
  nitro: {
    preset: process.env.SERVER_PRESET,
    experimental: {
      websocket: true,
    },
    rollupConfig: {
      external: ["pg-native"],
    },
  },
});
