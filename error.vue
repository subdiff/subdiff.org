<template>
  <div>
    <NavBar />
    <div class="main-slot">
      <h2 class="section subtitle">
        {{ props.error?.statusCode }}: {{ props.error?.statusMessage }}
      </h2>
    </div>
    <Footer>
      <hr>
    </Footer>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  error: Object
})
</script>

<style lang="sass" scoped>
h2
  text-align: center
</style>
