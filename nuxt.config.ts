// https://nuxt.com/docs/api/configuration/nuxt-config
import { createResolver } from "@nuxt/kit";

const resolver = createResolver(import.meta.url);

export default defineNuxtConfig({
  modules: ["@nuxt/ui"],

  alias: {
    "#shared": resolver.resolve("./shared"),
  },

  css: [resolver.resolve("./app/assets/css/main.css")],

  compatibilityDate: "2025-01-15",

  $production: {
    routeRules: {
      "/": { swr: 600 },
      "/api/news": { swr: 600 },
    },
  },
});
