import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css";

const dark_theme = {
  dark: true,
  colors: {
    primary: "#38A3A5",
    // secondary: "#22577A",
    secondary: "#0A1013",
    // background: "#181A1B",
    background: "#161618",
    background2: "#2D2D2D",
    accent: "#80ED99",
    error: "#FF5252",
    info: "#2196F3",
    success: "#4CAF50",
    warning: "#FFC107",
  },
};

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true,
    components,
    directives,
    theme: {
      defaultTheme: "dark_theme",
      themes: {
        dark_theme,
      },
      options: { customProperties: true },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
