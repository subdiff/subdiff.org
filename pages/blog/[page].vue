<template>
  <BlogList :pageNumber="currentPage" />
</template>

<script setup lang="ts">
const route = useRoute()
const currentPage = parseInt(route.path.split('/').pop()!)

if (isNaN(currentPage)) {
  showError({ statusCode: 404, statusMessage: 'Page Not Found', fatal: true })
}

useHead({
  title: "Blog"
})
definePageMeta({
  layout: 'post'
})
</script>