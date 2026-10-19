<template>
  <NavBar />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style lang="scss">
:root {
  --color-brand-primary: #4263b9;
  --bulma-success-invert-l: 100%;
}

.button.is-success {
  color: #fff;
}


.default-layout {
  max-width: 900px !important;
  padding: 0 20px 0 20px;
}

.main-slot {
  margin-top: 100px;
}

.pagination-link.is-current {
  background-color: var(--color-brand-primary);
  border-color: var(--color-brand-primary);
}
</style>

