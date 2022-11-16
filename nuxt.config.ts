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
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_TOKEN_EXPIRATION: process.env.JWT_TOKEN_EXPIRATION,
    public: {
      apiBase: "/api",
      BASE_URL: process.env.BASE_URL,
    },
  },
});
