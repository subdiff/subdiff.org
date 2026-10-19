<template>
  <footer class="container has-text-centered has-text-grey-light footer-class default-layout">
    <slot />
    <p class="small-note has-text-grey-light">Roman Gilg © {{ currentYear }}</p>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<style lang="sass" scoped>
.footer-class
  margin-top: 50px
  margin-bottom: 20px
</style>
