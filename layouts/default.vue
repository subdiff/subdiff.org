<template>
  <div>
    <NavBar />
    <div class="main-slot">
      <slot />
    </div>
    <Footer>
      <hr>
    </Footer>
  </div>
</template>

<style lang="sass">
$navbar-breakpoint: 350px

$pagination-current-background-color: #4263b9
$pagination-current-border-color: #4263b9
@import "../node_modules/bulma/bulma.sass"

.default-layout
  max-width: 900px !important
  padding: 0 20px 0 20px

.main-slot
  margin-top: 100px
</style>
