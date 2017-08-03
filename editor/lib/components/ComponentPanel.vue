<template lang="pug">
.component-panel.grid-y
  .small-12.cell
    h2 Components

    ul.menu
      li
        a New

    .grid-x
      .small-12.medium-8
        .card.component-card(v-for="component in components" @click="setActive(component)")
          .card-divider
            p {{ component.title }}

          img(src="http://fillmurray.com/80/60")

          .card-section
            p 98 Cards
</template>

<script>
  export default {
    props: ["components"],

    methods: {
      setActive(component) {
        this.$store.commit("setActiveComponent", { component })
      }
    }
  }
</script>

<style>
  .component-panel {
    border-right: solid black 1px;
  }
</style>
