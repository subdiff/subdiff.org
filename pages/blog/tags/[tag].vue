<template>
  <div class="container default-layout">
    <h1 class="title tag-title">#{{ tagTitle }}</h1>
    <div class="columns is-multiline">
      <div class="column is-full" v-for="post of data" :key="post._id">
        <BlogPostStripe :show-tags="true" :post="post" />
      </div>
    </div>
  </div>
</template>

<script setup>

const route = useRoute()
const tagTitle = route.params.tag

useHead({
  title: "#" + tagTitle + ' | subdiff.org Blog'
})
definePageMeta({
  layout: 'post'
})

const { data } = await useAsyncData(`blog-post-tags-${tagTitle}`, () => queryContent('/blog')
  .where({ tags: { $in: tagTitle } })
  .sort({ date: -1 })
  .find())

if (!data.value || data.value.length === 0) {
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found', fatal: true })
}
</script>

<style lang="sass" scoped>
.tag-title
  text-align: center

</style>