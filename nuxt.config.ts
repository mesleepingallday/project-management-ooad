// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from "@primevue/themes/aura";
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: [
    "@primevue/nuxt-module",
    "@nuxtjs/tailwindcss",
    "@nuxt/image",
    "@nuxt/icon",
    "@pinia/nuxt",
  ],
  ssr: false,
  experimental: {
    crossOriginPrefetch: true,
  },
  primevue: {
    options: {
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: ".my-app-dark",
        },
      },
    },
  },
  image: {
    formats: ["webp"],
    quality: 80,
  },
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
    },
    pageTransition: {
      name: "page",
      mode: "out-in",
    },
  },
});
