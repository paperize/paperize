<template lang="pug">
.grid-container
  .grid-x
    .small-12.medium-5.large-5.cell
      h2 Welcome to Paperize!
      hr

      p
        em Sign in above to get started playing with games and their components.

    .large-2.cell

    .small-12.medium-6.large-5.cell
      h2 Roadmap:

      vue-embed(id="gist" :options="{ emoji: true }")
       p.gist https://gist.github.com/lorennorman/9d0f3d7df597756a3bc14de4288e7c45.js
</template>

<script>
  import VueEmbed from '../components/VueEmbed.vue'

  export default {
    components: {
      "vue-embed": VueEmbed
    }
  }
</script>

<style>
  .gist {
    display: none;
  }
</style>
