<template lang="pug">
.component-panel.grid-y
  component-form(mode='create')
  .small-12.cell
    h4 Components

    ul.menu
      li
        a(@click="$modal.show('create-component-modal')") New Component

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
</style>
