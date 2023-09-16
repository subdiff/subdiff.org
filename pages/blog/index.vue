<template>
  <BlogList :pageNumber="1" />
</template>

<script setup lang="ts">
useHead({
  title: 'Blog'  + ' | subdiff.org'
})
definePageMeta({
  layout: 'post'
})
</script>