import { definePreset } from '@primevue/themes'
import Lara from '@primevue/themes/lara'

const LaraLightBlue = definePreset(Lara, {
  semantic: {
    primary: {
      50: '{blue.50}',
      100: '{blue.100}',
      200: '{blue.200}',
      300: '{blue.300}',
      400: '{blue.400}',
      500: '{blue.500}',
      600: '{blue.600}',
      700: '{blue.700}',
      800: '{blue.800}',
      900: '{blue.900}',
      950: '{blue.950}',
    },
  },
})

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  compatibilityDate: '2026-10-19',
  experimental: {
    appManifest: false,
  },
  modules: [
    '@nuxt/content',
    '@primevue/nuxt-module',
  ],
  primevue: {
    options: {
      ripple: true,
      theme: {
        preset: LaraLightBlue,
        options: {
          darkModeSelector: false,
        },
      },
    },
  },
  nitro: {
    prerender: {
      routes: ['/blog/feed.xml'],
    },
  },
  content: {
    markdown: {
      remarkPlugins: ['remark-reading-time'],
    },
    highlight: {
      theme: 'github-light',
      preload: [
        'c',
        'cpp',
        'yaml',
      ],
    },
  },
  plugins: ['~/plugins/click-outside.client.ts',
    '~/plugins/scroll-to.client.ts',
    '~/plugins/disqus.client.ts'
  ],
  app: {
    head: {
      htmlAttrs: {
        'data-theme': 'light'
      },
      link: [
        { rel: "icon", type: "image/png", href: "/logo.png" }
      ]
    }
  },
  css: [
    "bulma/css/versions/bulma-no-dark-mode.min.css"
  ]
})