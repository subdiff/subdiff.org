// stub - block nuxt getSSRProps error
export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.directive('click-outside', {});
});