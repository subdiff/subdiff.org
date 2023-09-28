<template>
  <div class="center-positioner">
    <article class="post-box">
      <img class="figure" :src="imgPath" alt="Image" />
      <h1 class="title is-2 post-content">{{ data!.title }}</h1>
      <div class="section post-content">
        <div class="has-text-weight-medium is-size-5 is-size-6-mobile" v-html="data!.description" />
        <div class="post-meta has-text-grey is-6 is-size-7-mobile">
          <span>
            {{ getDate(data!.date) }}, by
            <NuxtLink class="author-link" to="/about">
              <img src="~/assets/about/roman-gilg-quad.jpg" fit="inside" class="author-image" alt="Author" />
              Roman Gilg
            </NuxtLink>
          </span>
          — {{ data!.readingTime.text }}.
        </div>
        <div class="tags tags-style">
          <NuxtLink class="tag is-light is-rounded" :to="tag.path" v-for="tag of getTags(data!.tags)" :key="tag.id">
            {{ tag.title }}</NuxtLink>
        </div>
      </div>
      <section class="section post-content content deep-selector is-size-5 is-size-6-mobile">
        <ContentRenderer :value="data" />
      </section>
      <section v-if="!data!.draft" class="section disqus-box">
        <ClientOnly fallback-tag="span" fallback="Loading comments...">
          <Disqus shortname="subdiff" :pageConfig="disqusPageConfig()" :key="data!.path" />
        </ClientOnly>
      </section>
      <RssIcon class="has-text-centered rss-icon" color="grey" />
    </article>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { data } = await useAsyncData(`blog-post-${route.path}`, () => queryContent(route.path).findOne())

if (!data.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found', fatal: true })
}

const imgPath = route.path + '.jpg'

useHead({
  title: data.value.title + ' | subdiff.org Blog',
  meta: [
    {
      name: "description",
      content: data.value!.description
    }
  ].concat(getSocialMeta(
    "https://subdiff.org" + route.fullPath!,
    data.value.title!,
    data.value!.description,
    {
      url: "https://subdiff.org" + imgPath,
      alt: "post header",
      type: "image/jpg",
      width: undefined,
      height: undefined
    }
  ))
})

definePageMeta({
  layout: 'post'
})

const figurePath = () => {
  return 'require(`/assets' + route.path + '.jpg`'
}

const disqusPageConfig = () => {
  return {
    identifier: data.value!.date.slice(-4) + "-" +
      route.path.split('/').pop(),
    title: data.value!.title,
    url: "https://subdiff.org" + route.path
  };
}
</script>

<style scoped lang="sass">
.figure
  margin-bottom: 48px
  width: 100%

.post-content
  padding-top: 0px
  padding-left: 30px
  padding-right: 30px

.post-box
  margin: 10px
  box-shadow: 0 2px 6px 0.2px #8A8888

.center-positioner
  margin: 0 auto
  max-width: 750px

.post-meta
  margin-top: 30px
  margin-bottom: 30px

.disqus-box
  margin-top: -50px
  margin-bottom: -10px

.author-image
  max-width: 38px
  max-height: 38px
  height: auto
  border-radius: 99px
  vertical-align: middle
  margin: 0px 6px

.author-link
  transition: filter .2s
  color: dimgrey

.author-link:hover
  filter: brightness(108%)
  color: grey

.tags-style
  margin-top: -5px
  margin-bottom: -20px

:deep(.deep-selector)
  .header-icon
    height: 16px
    width: 16px
    opacity: 0.6
    margin: 0 6px 2px 4px
  .header-icon:hover
    opacity: 0.8

.rss-icon
  padding-bottom: 15px
</style>
