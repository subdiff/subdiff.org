export default defineNuxtPlugin(({ $router }) => {
  $router.options.scrollBehavior = customScrollBehavior
});
