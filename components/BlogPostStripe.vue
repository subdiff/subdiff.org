<template>
  <NuxtLink :href="post._path">
    <div class="box box-trans">
      <div class="columns is-vcentered is-variable is-3">
        <div class="column is-3">
          <img class="cropped" :src="post._path + '.jpg'" alt="Image">
        </div>
        <div class="column">
          <h2 class="title is-3">{{ post.title }}</h2>
          <div class="subtitle is-7 has-text-grey">{{ getDate(post.date) }}</div>
          <div class="tags">
            <object>
              <NuxtLink v-for="tag of getTags(post.tags)" :href="tag.path" :key="tag.id" class="tag is-light is-rounded">
                {{ tag.title }}</NuxtLink>
            </object>
          </div>
          <p class="content" v-html="post.description"></p>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup>
const showTags = true
const props = defineProps(['post'])
</script>

<style lang="sass" scoped>
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
