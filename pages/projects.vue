<template>
  <section class="container default-layout">
    <Accordion v-model:value="selectedProject">
      <AccordionPanel v-for="project in data" :key="project.name" :value="getProjectSlug(project)">
        <AccordionHeader>{{ project.name }}</AccordionHeader>
        <AccordionContent>
          <ProjectCard :prjData="project" />
        </AccordionContent>
      </AccordionPanel>
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

const route = useRoute()
const router = useRouter()

const getProjectSlug = (project: any) => {
  const path = project._path || ''
  return path.slice(path.lastIndexOf('/') + 1)
}

const initialSlug = () => {
  if (route.query.project) {
    const found = data.value?.find(p => getProjectSlug(p) === route.query.project)
    if (found) return getProjectSlug(found)
  }
  return data.value?.length ? getProjectSlug(data.value[0]) : ''
}

const selectedProject = ref(initialSlug())

watch(selectedProject, (newVal) => {
  if (newVal && newVal !== route.query.project) {
    router.push({
      path: '/projects',
      query: { project: newVal },
    })
  }
})

watch(() => route.query.project, (newProject) => {
  if (newProject && newProject !== selectedProject.value) {
    selectedProject.value = newProject as string
  }
})
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
