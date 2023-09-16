<template>
  <section class="container default-layout">
    <div class="tile is-ancestor">
      <div class="tile is-8">
        <div class="tile is-vertical">
          <div class="tile">
            <NuxtLink href="/projects/plasma" class="tile is-parent is-vertical tile-trans">
              <div class="tile is-child notification is-info">
                <h1 class="title">KDE Plasma</h1>
                <h2 class="subtitle">The KDE desktop shell and its utilities</h2>
              </div>
            </NuxtLink>
            <NuxtLink href="/projects/kwin" class="tile is-parent tile-trans">
              <div class="tile is-child notification is-warning">
                <div>
                  <h1 class="title">KWin</h1>
                  <h2 class="subtitle">The KDE desktop window manager</h2>
                </div>
                <div class="content-spacer is-hidden-mobile"></div>
              </div>
            </NuxtLink>
          </div>

          <NuxtLink href="/projects/wayland" class="tile is-parent tile-trans">
            <div class="tile is-child notification is-success">
              <h1 class="title">Wayland</h1>
              <h2 class="subtitle">The Unix windowing system of the future</h2>
            </div>
          </NuxtLink>
        </div>
      </div>

      <div class="tile">
        <div class="tile is-vertical">
          <NuxtLink href="/projects/xwayland" class="tile is-parent tile-trans">
            <div class="tile is-child notification is-primary">
              <h1 class="title">XWayland</h1>
              <h2 class="subtitle">Legacy support for X clients on Wayland</h2>
            </div>
          </NuxtLink>

          <NuxtLink href="/projects/x11" class="tile is-parent tile-trans">
            <div class="tile is-child notification is-danger">
              <div>
                <h1 class="title">X11</h1>
                <h2 class="subtitle">The Unix windowing system of the last 30 years</h2>
              </div>
              <div class="content-spacer is-hidden-mobile"></div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
useHead({
  title: 'Projects'  + ' | subdiff.org'
})
definePageMeta({
  layout: 'post'
})
</script>

<style lang="sass" scoped>
.heading-main-projects
  text-align: center
  margin-top: 30px

.tile-trans
  transition: transform .5s

.tile-trans:hover
  transform: translateY(-2.5px)

.content-spacer
  min-height: 200px

</style>
