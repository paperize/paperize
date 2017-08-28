<template lang="pug">
.component-panel.grid-y
  component-form#new-component-form(mode='create')
  .small-12.cell
    h2 Components

    ul.menu
      li
        a(data-open="new-component-form") New Component

    .grid-x
      component-card(v-for="component in components" :key="component.id" :component="component")
</template>

<script>
  import ComponentForm from './ComponentForm.vue'
  import ComponentCard from './ComponentCard.vue'

  export default {
    props: ["components"],

    components: {
      "component-form": ComponentForm,
      "component-card": ComponentCard
    }
  }
</script>

<style>
  .component-panel {
    border-right: solid black 1px;
  }
</style>
