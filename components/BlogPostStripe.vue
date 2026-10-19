<template>
  <div class="box box-trans post-stripe-box" @click="onCardClick">
    <div class="columns is-vcentered is-variable is-3">
      <div class="column is-3">
        <NuxtLink :href="postPath" tabindex="-1" aria-hidden="true">
          <img class="cropped" :src="postPath + '.jpg'" alt="Image">
        </NuxtLink>
      </div>
      <div class="column">
        <h2 class="title is-3">
          <NuxtLink :href="postPath" class="post-title-link">
            {{ post.title }}
          </NuxtLink>
        </h2>
        <div class="subtitle is-7 has-text-grey">{{ getDate(post.date) }}</div>
        <div class="tags">
          <NuxtLink v-for="tag of getTags(post.tags)" :href="tag.path" :key="tag.id" class="tag is-light is-rounded">
            {{ tag.title }}
          </NuxtLink>
        </div>
        <p class="content" v-html="post.description"></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  post: Record<string, any>
}>()

const postPath = computed(() => props.post.path || props.post._path)
const router = useRouter()

const onCardClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (target.closest('a')) {
    return
  }
  if (e.metaKey || e.ctrlKey || e.button === 1) {
    window.open(postPath.value, '_blank')
  } else {
    router.push(postPath.value)
  }
}
</script>

<style lang="sass" scoped>
.post-stripe-box
  cursor: pointer

.post-title-link
  color: inherit

.cropped
  object-fit: cover
  width: 100%
  height: 30ex

.box-trans
  transition: transform .4s, box-shadow .7s

.box-trans:hover
  transform: translateY(-3px)
  box-shadow: 0 2px 6px 0.2px #8A8888
</style>
