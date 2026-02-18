// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  tailwindcss: { exposeConfig: true, },
  ssr: false,
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    '@vite-pwa/nuxt',
    'nuxt-toast'
  ],
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: "Discount Discovery",
      short_name: "Discounts",
      description: "Browse shop discounts conviniently",
      theme_color: "#6a5acd",
      lang: "en",
      background_color: "#ffffff",
    },
    pwaAssets: {
      image: "../public/icon.png",
    },
    workbox: {
      navigateFallback: "/",
      globPatterns: ['**/*.{js,css,html,svg,png,ico}'],

      cleanupOutdatedCaches: true,
      clientsClaim: true
    },
    devOptions: {
        enabled: true,
        navigateFallback: '/',
        type: "module"
        /* other options */
      }
  }
})