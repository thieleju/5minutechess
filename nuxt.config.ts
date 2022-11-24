// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  css: [
    "vuetify/lib/styles/main.sass",
    "@mdi/font/css/materialdesignicons.min.css",
    "@/assets/main.scss",
  ],
  // plugins: [{ src: "" }],
  // modules: ["@nuxtjs/robots"],
  build: {
    transpile: ["vuetify", "chess.js", "jsonwebtoken"],
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
      redis: {
        driver: "redis",
        port: process.env.DB_REDIS_PORT,
        host: process.env.DB_REDIS_HOST,
        db: 0,
      },
      dev: {
        driver: "fs",
        base: "./data/db",
      },
    },
  },
  runtimeConfig: {
    // .env file overrides this
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
    LICHESS_CLIENT_ID: process.env.LICHESS_CLIENT_ID,
    LICHESS_CLIENT_SECRET: process.env.LICHESS_CLIENT_SECRET,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_TOKEN_EXPIRATION: process.env.JWT_TOKEN_EXPIRATION,
    public: {
      apiBase: "/api",
      BASE_URL: process.env.BASE_URL,
    },
  },
});
