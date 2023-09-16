<template>
  <div class="center-positioner">
    <div class="box-class">
      <!-- <div class="box" :style="boxEdges"> -->
      <div class="box" :style="{ 'box-shadow': boxEdgesShadow }">
        <div class="section columns is-variable is-5 is-vcentered is-mobile">
          <div class="column">
            <img class="figure" :src="logoPath" fit="contain" alt="Project Logo" />
          </div>
          <div class="column is-two-thirds">
            <h1 class="title">{{ prjData.name }}</h1>
            <h2 class="subtitle">{{ prjData.description }}</h2>
            <p>
              <NuxtLink :href="prjData.url" target="_blank">Project site</NuxtLink>
            </p>
          </div>
        </div>

        <section class="section" style="margin-top: -30px; margin-bottom: -30px">
          <h3 class="subtitle">Notable contributions</h3>
          <p v-for="contr of prjData.contributions" :key="contr.url">
            <NuxtLink :href="contr.url" target="_blank">{{ contr.text }}</NuxtLink>
          </p>
        </section>

        <section class="section">
          <h3 class="subtitle">Related Blog posts</h3>
          <p v-for="post of relatedBlogPosts" :key="post.id">
            <NuxtLink :href="post._path">{{ post.title }}</NuxtLink>
            ({{ getDate(post.date) }})
          </p>
        </section>

        <div class="level" style="margin-top: 20px; margin-bottom: 10px">
          <NuxtLink href="/projects" class="level-item subtitle is-6">&#xab Back to Projects overview</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps(['prjData'])
const route = useRoute()
const logoPath = '/projects/' + route.params.project + '-logo.png'

const { data: relatedBlogPosts } = await useAsyncData('blog-post-project', () => queryContent('/blog')
  .where({ tags: { $in: props.prjData.tag } })
  .sort({ date: -1 })
  .find())

const boxEdgesShadow = '0 0px 6px 0.5px ' + props.prjData.color
</script>

<style lang="sass" scoped>
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