<template lang="pug">
.grid-container
  title-bar
  .grid-x
    .small-12.cell
      h2 Welcome to New Paperize!

      p We're in beta right now, just starting to put the basic pieces together, but we can still have some fun.
      p
        em Sign in above and we'll get started playing with games and their components.
</template>

<script>

  import TitleBar from './TitleBar.vue'

  export default {
    components: {
      "title-bar": TitleBar
    }
  }

</script>

<style>

</style>
