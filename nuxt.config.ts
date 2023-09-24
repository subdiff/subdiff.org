// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: ['@nuxt/content'],
  nitro: {
    prerender: {
      routes: ['/blog/feed.xml'],
    },
  },
  content: {
    markdown: {
      remarkPlugins: ['remark-reading-time'],
    },
  },
  plugins: ['~/plugins/click-outside.client.ts',
    '~/plugins/scroll-to.client.ts',
    '~/plugins/disqus.client.ts'
  ],
  app: {
    head: {
      link: [
        { rel: "icon", type: "image/png", href: "/logo.png" }
      ]
    }
  },
  css: [
    "primevue/resources/themes/lara-light-blue/theme.css"
  ],
  build: {
    transpile: ["primevue"]
  }
})
