<template>
  <div class="container default-layout">
    <section class="columns is-vcentered is-variable is-6" style="margin: 0 -20px 0 -20px">
      <div class="column has-text-right is-hidden-mobile">
        <img alt="Logo" src="/logo.png" width="280" />
      </div>
      <div class="column has-text-centered is-hidden-tablet" style="margin-top: -10px">
        <img alt="Logo" src="/logo.png" width="200" />
      </div>
      <div class="column" :class="{ 'is-three-fifths': !isMobile, 'has-text-centered': isMobile }">
        <h1 class="title">subdiff : software systems</h1>
        <h2 class="subtitle">co-creating essential open source graphics technology</h2>
        <nav class="level" :class="{ 'button-style': isMobile }">
          <div class="level-item">
            <NuxtLink href="/projects" class="button is-success">Find out about Projects</NuxtLink>
          </div>
        </nav>
      </div>
    </section>

    <section style="margin-top: 50px">
      <div class="columns">
        <div class="column has-text-centered">
          <div class="container">
            <h1 class="title">Architect</h1>
            <h2 class="subtitle">
              Engineer software in a
              <strong>holistic</strong> way. Build solutions that stand the test of time.
            </h2>
          </div>
        </div>
        <div class="column has-text-centered">
          <div class="container">
            <h1 class="title">Pragmatic</h1>
            <h2 class="subtitle">
              Rome wasn't built in a day. Reach for
              <strong>sensible</strong> goals under given constraints.
            </h2>
          </div>
        </div>
        <div class="column has-text-centered">
          <div class="container">
            <h1 class="title">Open Source</h1>
            <h2 class="subtitle">
              Sharing information is key to technological and social
              <strong>progress</strong>. And it's efficient.
            </h2>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'subdiff : software systems',
  meta: getSocialMeta({
    url: 'https://subdiff.org',
    title: 'subdiff : software systems',
    descr: 'co-creating essential open source graphics technology',
    img: {
      url: 'https://subdiff.org/logo.png',
      alt: "subdiff logo",
      type: "png",
      width: undefined,
      height: undefined,
    }
  }
  )
})

let windowWidth = ref(1024)
const isMobile = computed(() => windowWidth.value <= 768)
const onResize = () => {
  windowWidth.value = window.innerWidth;
}

onMounted(() => {
  windowWidth.value = window.innerWidth;
  window.addEventListener("resize", onResize)
})

onBeforeUnmount(() => {
  window.removeEventListener("resize", onResize);
})
</script>

<style lang="sass" scoped>
.button-style
  margin-top: 50px
</style>
