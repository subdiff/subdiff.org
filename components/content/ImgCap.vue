<template>
  <div class="center">
    <p v-if="props.href">
      <NuxtLink target="_blank" :href="props.href">
        <img :class="getImageClass" :src="src" :alt="getAlt" />
      </NuxtLink>
    </p>
    <p v-if="!props.href">
      <img :class="getImageClass" :src="src" :alt="getAlt" />
    </p>
    <p>{{ props.cap }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ src: string, cap: string, alt?: string, effect?: string, href?: string }>()

const getImageClass = computed(() => {
  if (!props.effect) {
    return 'img-cap-no-effect'
  }
  if (props.effect == 'shadow') {
    return 'img-cap-shadow'
  }
})

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
.img-cap-no-effect
  max-height: 600px
.img-cap-shadow
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.2)
  max-height: 600px
</style>
