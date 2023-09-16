<template>
  <div class="container default-layout" style="margin-bottom: 30px">
    <ProjectCard :prjData="data"></ProjectCard>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const { data } = await useAsyncData(`project-${route.params.project}`, () => queryContent(route.path).findOne())

if (!data.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found', fatal: true })
}

useHead({
  title: data.value.name +  ' | subdiff.org Project',
  meta: [
    { name: 'description', content: data.value.description }
  ],
})

// const logoPath =  "~/assets/projects/" + data.logo;
</script>

<style lang="sass" scoped>

</style>
