<template>
  <h2 class="header" :id="id">
    <a class="has-text-black-bis"
      v-if="id && generate"
      :href="`#${id}`"
    >
      <img class="header-icon" src="~/assets/link.png" alt="link" />
      <slot />
    </a>
    <slot v-else />
  </h2>
</template>

<script setup lang="ts">
import { computed, useRuntimeConfig } from '#imports'

const props = defineProps<{ id?: string }>()

const { headings } = useRuntimeConfig().public.mdc
const generate = computed(() => props.id && headings?.anchorLinks?.h2)
</script>