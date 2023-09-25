<template>
  <section class="container default-layout">
    <Accordion :activeIndex="0">
      <AccordionTab v-for="project in data" :key="project.name" :header="project.name">
        <ProjectCard :prjData="project" />
      </AccordionTab>
    </Accordion>
  </section>
</template>

<script setup lang="ts">
useHead({
  title: 'Projects' + ' | subdiff.org'
})
definePageMeta({
  layout: 'post'
})

const { data } = await useAsyncData(`projects`, () =>
  queryContent('/projects')
    .where({ weight: { $gt: 0 } })
    .sort({ weight: 1 })
    .find()
)

if (!data.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found', fatal: true })
}

</script>

<style lang="sass" scoped>
.heading-main-projects
  text-align: center
  margin-top: 30px

.tile-trans
  transition: transform .5s

.tile-trans:hover
  transform: translateY(-2.5px)

.content-spacer
  min-height: 200px

</style>
