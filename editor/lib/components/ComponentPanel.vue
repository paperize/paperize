<template lang="pug">
.component-panel.grid-y
  .small-12.cell
    h2 Components

    ul.menu
      li
        a New

    .grid-x
      .small-12.medium-6
        .card
          .card-divider
            p Artifact Deck

          img(src="http://loremflickr.com/80/60/card,game/all")

          .card-section
            p 98 Cards

    ul
      li(v-for="component in components") {{ component.title }} {{ component.type }}
</template>

<script>
  export default {
    props: ["components"]
  }
</script>

<style>
  .component-panel {
    border-right: solid black 1px;
  }
</style>
