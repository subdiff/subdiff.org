<template>
  <section class="level container default-layout">
    <div class="level-item">
      <div class="columns is-centered is-vcentered is-multiline is-7 is-variable">
        <div class="column is-narrow">
          <img src="~/assets/about/roman-gilg.jpg" fit="cover" height="400" width="300" />
        </div>
        <div class="column is-narrow">
          <h1 style="padding-bottom: 20px" class="subtitle is-4">Roman Gilg</h1>
          <div class="content">
            <p>
              <i>Location:</i> &nbsp;Germany
            </p>
            <i>Education:</i>
            <ul>
              <li>M.Sc. Mathematics</li>
              <li>B.Sc. Mathematics and Philosophy</li>
              <li>B.Sc. Engineering management</li>
            </ul>
            <i>Contact:</i>
            <ul>
              <li>
                <NuxtLink href="mailto:subdiff@gmail.com">Email</NuxtLink>
              </li>
              <li>
                <NuxtLink href="https://twitter.com/subdiff" target="_blank">Twitter</NuxtLink>
              </li>
              <li>
                <NuxtLink href="https://www.linkedin.com/in/roman-gilg" target="_blank">LinkedIn</NuxtLink>
              </li>
              <li>
                <NuxtLink href="https://matrix.to/#/@romangg:matrix.org" target="_blank">Matrix</NuxtLink>
              </li>
              <li>
                on <NuxtLink href="https://libera.chat/" target="_blank">Libera.Chat</NuxtLink>: <i>romangg</i>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
useHead({
  title: "About | subdiff.org"
})
</script>

<style lang="sass" scoped>
.text-style
  text-align: center
</style>
