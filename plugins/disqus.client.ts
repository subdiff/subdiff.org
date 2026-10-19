import VueDisqus from 'vue-disqus'

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(VueDisqus, {
    shortname: 'subdiff'
  })
});