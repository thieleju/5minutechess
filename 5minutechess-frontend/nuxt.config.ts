// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  css: [
    "vuetify/lib/styles/main.sass",
    "@mdi/font/css/materialdesignicons.min.css",
  ],
  plugins: [
    {
      src: "@/plugins/particles.js",
      mode: "client",
      ssr: false,
    },
  ],
  build: {
    transpile: ["vuetify", "vue3-particles", "tsparticles"],
  },
  vite: {
    define: {
      "process.env.DEBUG": false,
    },
  },
  app: {
    pageTransition: { name: "fade", mode: "out-in" },
  },
});
