// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  css: [
    "vuetify/lib/styles/main.sass",
    "@mdi/font/css/materialdesignicons.min.css",
  ],
  // plugins: [{ src: "" }],
  modules: ["@pinia/nuxt"],
  build: {
    transpile: ["vuetify", "chess.js", "jsonwebtoken", "pinia"],
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
  nitro: {
    storage: {
      // TODO
      // redis: {
      //   driver: "redis",
      /* redis connector options */
      // port: 6379, // Redis port
      // host: "127.0.0.1", // Redis host
      // username: "", // needs Redis >= 6
      // password: "",
      // db: 0, // Defaults to 0
      // tls: {}, // tls/ssl
      // },
      db: {
        driver: "fs",
        base: "./data/db",
      },
    },
  },
  runtimeConfig: {
    // .env file overrides this
    JWT_SECRET: process.env.JWT_SECRET,
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    TOKEN_EXPIRATION: process.env.TOKEN_EXPIRATION,
    public: {
      apiBase: "/api",
    },
  },
});
