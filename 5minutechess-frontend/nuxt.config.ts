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
    head: {
      charset: "utf-16",
      viewport: "width=device-width, initial-scale=1",
      title: "5 Minute Chess",
      meta: [
        // <meta name="description" content="My amazing site">
        { name: "5 Minute Chess", content: "Play a move every 5 Minutes!" },
      ],
    },
  },
});
