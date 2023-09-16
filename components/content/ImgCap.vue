<template>
  <div class="center">
    <img :src="src" :alt="getAlt" />
    <p :style="{ 'margin-top': props.capMargin }">{{ props.cap }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ src: string, cap: string, alt?: string, capMargin?: string }>()

const getAlt = computed(() => {
  if (props.alt) {
    return props.alt
  }
  return props.cap
})

</script>

<style scoped lang="sass">
.center
  text-align: center
  font-style: italic
  margin-top: 30px
  margin-bottom: 25px
  margin-left: 30px
  margin-right: 30px
</style>
