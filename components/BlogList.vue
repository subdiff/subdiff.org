<template>
  <div class="container default-layout">
    <section>
      <div class="post-entry" v-for="article of data" :key="article.id">
        <BlogPostStripe :post="article" />
      </div>
    </section>

    <section class="post-entry">
      <nav v-if="totalPages > 1" class="pagination is-centered" role="navigation" aria-label="pagination">
        <NuxtLink :style="{ visibility: isFirstPage ? 'hidden' : 'visible' }" :href="isFirstPage ? '/' : prevPageLink()"
          class="pagination-previous">Newer</NuxtLink>
        <ul v-if="totalPages <= 5" class="pagination-list">
          <li>
            <NuxtLink :class="{ 'is-current': props.pageNumber === 1 }" href="/blog" class="pagination-link"
              aria-label="Goto page 1">1</NuxtLink>
          </li>
          <li v-for="index in (totalPages - 1)" :key="index">
            <NuxtLink :class="{ 'is-current': props.pageNumber === index + 1 }" :href="'/blog/' + (index + 1)"
              class="pagination-link" aria-label="Goto page index">{{ index + 1 }}
            </NuxtLink>
          </li>
        </ul>

        <ul v-else class="pagination-list">
          <li v-if="!isFirstPage">
            <NuxtLink href="/blog" class="pagination-link" aria-label="Goto page 1">1</NuxtLink>
          </li>
          <li v-if="props.pageNumber > 4">
            <span class="pagination-ellipsis">&hellip;</span>
          </li>
          <li v-if="props.pageNumber === 4">
            <NuxtLink :href="(2).toString()" class="pagination-link" aria-label="Goto page 2">2</NuxtLink>
          </li>
          <li>
            <NuxtLink :href="prevPageLink()" v-if="props.pageNumber > 2" class="pagination-link"
              :aria-label="'Goto page ' + (props.pageNumber - 1)">
              {{ props.pageNumber - 1 }}</NuxtLink>
          </li>
          <li>
            <NuxtLink class="pagination-link is-current" aria-label="currentPage" aria-current="page">{{
              props.pageNumber }}</NuxtLink>
          </li>
          <li v-if="props.pageNumber < totalPages - 1">
            <NuxtLink :href="nextPageLink()" class="pagination-link" :aria-label="'Goto page ' + (props.pageNumber + 1)">
              {{ props.pageNumber + 1 }}</NuxtLink>
          </li>
          <li v-if="props.pageNumber < totalPages - 3">
            <span class="pagination-ellipsis">&hellip;</span>
          </li>
          <li v-if="props.pageNumber === totalPages - 3">
            <NuxtLink :href="(totalPages - 1).toString()" class="pagination-link"
              :aria-label="'Goto page' + (totalPages - 1)">
              {{ totalPages - 1 }}</NuxtLink>
          </li>
          <li v-if="!isLastPage">
            <NuxtLink :href="totalPages.toString()" class="pagination-link" :aria-label="'Goto page ' + totalPages">
              {{ totalPages }}
            </NuxtLink>
          </li>
        </ul>
        <NuxtLink :style="{ visibility: isLastPage ? 'hidden' : 'visible' }" :href="isLastPage ? '/' : nextPageLink()"
          class="pagination-next">Older</NuxtLink>
      </nav>
    </section>
    <section class="has-text-centered rss-icon">
      <RssIcon color="orange" />
    </section>
  </div>
</template>

<script setup lang="ts">
const props = defineProps(['pageNumber'])
const postsPerPage = 10

const allPostsCountResponse = await useAsyncData('blog-posts-all',
  () => queryContent('/blog').count())

const allPostsCount = allPostsCountResponse.data.value!
const totalPages = Math.ceil(allPostsCount / postsPerPage)

if (props.pageNumber < 1 || props.pageNumber > totalPages) {
  showError({ statusCode: 404, statusMessage: 'Page Not Found', fatal: true })
}

const isFirstPage = props.pageNumber === 1
const isLastPage = props.pageNumber === totalPages

const { data } = await useAsyncData(`blog-posts-list-${props.pageNumber}`, () =>
  queryContent('/blog')
    .sort({ date: -1 })
    .skip((props.pageNumber - 1) * postsPerPage)
    .limit(postsPerPage)
    .find()
)

let hasNextPage = false
if (data.value) {
  hasNextPage = (props.pageNumber - 1) * postsPerPage + data.value!.length !== allPostsCount
}

const prevPageLink = () => {
  const prevPage = props.pageNumber - 1;
  if (prevPage === 1) { return "/blog"; }
  return "/blog/" + prevPage.toString();
}

const nextPageLink = () => {
  var nextPage = props.pageNumber + 1;
  return "/blog/" + nextPage.toString();
}
</script>

<style lang="sass" scoped>
.post-entry
  margin-bottom: 22px

.rss-icon
  margin-top: 40px
  margin-bottom: -25px
</style>
