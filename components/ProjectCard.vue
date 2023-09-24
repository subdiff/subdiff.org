<template>
  <div class="section">
    <div class="columns is-variable is-vcentered is-mobile">
      <div v-if="prjData.logo" class="column is-one-third-mobile is-one-quarter-desktop is-one-quarter-tablet">
        <img class="logo" :src="props.prjData.logo" alt="Project Logo" />
      </div>
      <div class="column">
        <h1 class="title">{{ props.prjData.name }}</h1>
        <h2 class="subtitle">{{ props.prjData.description }}</h2>
        <p>
          <NuxtLink :href="props.prjData.url" target="_blank">Project site</NuxtLink>
          <span v-if="relatedBlogPosts?.length">
            | <NuxtLink :href="getTagPath()">Blog posts</NuxtLink>
          </span>
        </p>
      </div>
    </div>

    <ContentRenderer class="content" :value="props.prjData" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps(['prjData'])

const logoPath = props.prjData?.logo

const getTagPath = () => {
  return "/blog/tags/" + props.prjData.tag
}

const { data: relatedBlogPosts } = await useAsyncData(`blog-post-project-${props.prjData.name}`, () => queryContent('/blog')
  .where({ tags: { $in: props.prjData.tag } })
  .sort({ date: -1 })
  .find())

</script>

<style lang="sass" scoped>
.logo
  display: block
  max-height: 80px
  margin-left: auto
  margin-right: auto
  width: auto
.prjs-link
  color: hsl(0, 0%, 40%)
.prjs-link:hover
  color: grey

.center-positioner
  padding-top: 20px
  margin: 0 auto
  max-width: 720px

.box-class
  margin: 16px
</style>
