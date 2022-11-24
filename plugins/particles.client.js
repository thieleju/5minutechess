import particles from "vue3-particles";

export default defineNuxtPlugin((nuxtApp, inject) => {
  nuxtApp.vueApp.use(particles);
});
