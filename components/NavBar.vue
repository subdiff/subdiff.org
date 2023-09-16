<template>
  <div v-click-outside="hideDropDownMenu" class="header-style"
    :class="{ 'header-shadow': scrolledDown || dropDownActive }">
    <nav class="default-layout container">
      <div class="columns is-gapless is-variable is-multiline is-vcentered bar-style is-mobile">
        <div class="column">
          <div class="columns is-gapless is-mobile is-vcentered">
            <Transition name="fade" @after-leave="titleCleanedUp = true" @before-enter="titleCleanedUp = false">
              <div v-if="(!scrolledDown || dropDownActive) && upButtonCleanedUp" class="column">
                <div style="display: inline-block">
                  <NuxtLink class="nav-link" href="/">
                    <div v-show="allMounted && !scrolledDownAtStart" class="subtitle is-6 nav-item">subdiff.org</div>
                  </NuxtLink>
                </div>
              </div>
            </Transition>

            <Transition :name="dropDownMenuCleanedUp && !scrolledDownAtStart ? 'fade-jump' : 'fade'"
              @after-leave="upButtonCleanedUp = true; scrolledDownAtStart = false;"
              @before-enter="upButtonCleanedUp = false">
              <div v-if="scrolledDown && !dropDownActive && titleCleanedUp" class="column">
                <NuxtLink style="margin-left: 14px">
                  <img v-scroll-to="{ element: 'body' }" src="/logo.png" width="35" />
                </NuxtLink>
              </div>
            </Transition>

            <Transition name="fade" @after-leave="dropDownCleanedUp = true" @before-enter="dropDownCleanedUp = false">
              <div v-if="dropDownAvail" class="column is-narrow" role="button" @click="dropDownActive = !dropDownActive"
                aria-label="menu" :aria-expanded="dropDownActive" style="margin-right: 14px">
                <HamburgerAnimated :opened="dropDownActive" />
              </div>
            </Transition>
          </div>
        </div>

        <template v-if="dropDownCleanedUp">
          <div class="column is-narrow">
            <NuxtLink class="nav-link" href="/projects">
              <div class="subtitle is-6 nav-item">Projects</div>
            </NuxtLink>
          </div>
          <div class="column is-narrow">
            <NuxtLink class="nav-link" href="/blog">
              <div class="subtitle is-6 nav-item">Blog</div>
            </NuxtLink>
          </div>
          <div class="column is-narrow">
            <NuxtLink class="nav-link" href="/about">
              <div class="subtitle is-6 nav-item">About</div>
            </NuxtLink>
          </div>
        </template>
      </div>

      <Transition name="slide" class="menu-style" @after-leave="dropDownMenuCleanedUp = true"
        @before-enter="dropDownMenuCleanedUp = false">
        <div v-if="dropDownAvail && dropDownActive">
          <div style="margin-top: -20px">
            <div class>
              <NuxtLink class="nav-link" href="/projects">
                <div class="subtitle is-6 nav-item">Projects</div>
              </NuxtLink>
            </div>
            <div class>
              <NuxtLink class="nav-link" href="/blog">
                <div class="subtitle is-6 nav-item">Blog</div>
              </NuxtLink>
            </div>
            <div class>
              <NuxtLink class="nav-link" href="/about">
                <div class="subtitle is-6 nav-item">About</div>
              </NuxtLink>
            </div>
          </div>
        </div>
      </Transition>
    </nav>
  </div>
</template>

<script setup lang="ts">
let windowWidth = 1024
let scrolledDown = ref(false)
let scrolledDownAtStart = ref(false)
let allMounted = false
let dropDownActive = ref(false)

let titleCleanedUp = ref(false)
let upButtonCleanedUp = ref(true)
let dropDownCleanedUp = ref(true)
let dropDownMenuCleanedUp = ref(true)

const dropDownAvail = computed(() => {
  return windowWidth < 380 || scrolledDown.value
})

const onScroll = () => {
  hideDropDownMenu();
  scrolledDown.value = isScrolledDown();
}
const onResize = () => {
  // alternative: document.documentElement.scrollTop
  windowWidth = window.innerWidth;
}
const isScrolledDown = () => {
  return window.scrollY > 10;
}
const hideDropDownMenu = () => {
  dropDownActive.value = false;
}

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", onResize);
})

onMounted(() => {
  window.addEventListener("scroll", onScroll)
  window.addEventListener("resize", onResize)

  nextTick(() => {
    // executed when all children have been mounted as well
    scrolledDownAtStart.value = isScrolledDown();
    scrolledDown.value = scrolledDownAtStart.value;
    allMounted = true;
  })
})

</script>

<style lang="sass" scoped>
.header-style
  background-color: white
  position: fixed
  top: 0
  width: 100%
  transition: .5s
  z-index: 1

.header-shadow
  box-shadow: 0 0 8px rgba(0, 0, 0, .5)

.bar-style
  height: 60px
  padding: 5px 0 5px 0
  background-color: white
  overflow: auto
  position: relative
  z-index: 2

.menu-style
  position: relative
  z-index: 0

.nav-item
  outline: none
  height: 40px
  line-height: 40px
  padding: 0 15px 0 15px

.nav-item:hover
  transition: .2s
  color: hsl(0, 0%, 5%)

.nav-link
  outline: none

.burger-line
  width: 22px
  height: 3px
  background-color: hsl(0, 0%, 40%)
  margin: 4px 14px

#burger:hover .burger-line
  background-color: hsl(0, 0%, 0%)

.drop-down-menu:hover
  color: hsl(0, 0%, 90%)

.drop-down-active
  transition: .7s
  background-color: hsl(0, 0%, 99%)

.fade-jump-enter-active
  transition: opacity .6s
  animation: bounce-in .6s

@keyframes bounce-in
  0%
    transform: translateY(0px)
  30%
    transform: translateY(-4px)
  50%
    transform: translateY(0px)
  80%
    transform: translateY(-2px)
  100%
    transform: translateY(0px)

.fade-enter-active
  transition: opacity .6s

.fade-leave-active
  transition: opacity .1s

.fade-enter-from,
.fade-jump-enter-from,
.fade-leave-to
  opacity: 0

.fade-enter-to,
.fade-jump-enter-to,
.fade-leave
  opacity: 1

.slide-enter-active,
.slide-leave-active
  transition: all .5s

.slide-enter-from,
.slide-leave-to
  opacity: 0
  margin-top: -145px // that's hacky

.slide-enter-to,
.slide-leave
  opacity: 1
  margin-top: 0px

</style>
