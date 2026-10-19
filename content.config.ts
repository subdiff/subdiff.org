import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: 'blog/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.string().or(z.date()),
        tags: z.array(z.string()).default([]),
        authors: z.array(z.string()).optional(),
        canonical_url: z.union([z.string(), z.boolean()]).optional(),
        cover_image: z.string().optional(),
        disable_comments: z.boolean().default(false),
        draft: z.boolean().default(false),
        published: z.boolean().optional(),
        series: z.union([z.string(), z.boolean()]).optional(),
        readingTime: z.object({
          text: z.string(),
        }).optional(),
      }),
    }),
    projects: defineCollection({
      type: 'page',
      source: 'projects/*.md',
      schema: z.object({
        name: z.string(),
        weight: z.number().default(0),
        logo: z.string().optional(),
        description: z.string(),
        url: z.string(),
        tag: z.string().optional(),
      }),
    }),
  },
})
