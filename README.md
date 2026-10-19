# subdiff.org Website Source

Source code for the [subdiff.org](https://subdiff.org) website, built with [Nuxt 3](https://nuxt.com/) and [Nuxt Content](https://content.nuxt.com/).

## Prerequisites

- [mise](https://mise.jdx.dev/) (recommended tool manager)
- Node.js 24+
- [pnpm](https://pnpm.io/) 10+

## Development Workflow

If using **mise**, runtime tools and dependencies are managed automatically:

```bash
# Install dependencies
pnpm install

# Start dev server at http://localhost:3000
mise run dev

# Prerender static site to .output/public
mise run generate

# Build standalone Node production server
mise run build

# Preview production build
mise run preview
```

Or using **pnpm** directly:

```bash
pnpm install
pnpm dev
pnpm generate
pnpm build
pnpm preview
```
