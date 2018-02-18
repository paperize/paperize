<template lang="pug">
.component-panel.grid-y
  .small-12.cell
    h4 Components

    ul.menu
      li
        a(@click="createComponentAndShowForm") New Component

    .grid-x
      component-card(v-for="component in components" :key="component.id" :component="component")
</template>

<script>
  import { mapGetters } from 'vuex'
  import ComponentCard from './ComponentCard.vue'

  export default {
    props: ["components"],

    components: {
      "component-card": ComponentCard
    },

    computed: mapGetters(["activeGame"]),

    methods: {
      createComponentAndShowForm() {
        this.$store.dispatch("createGameComponent", { game: this.activeGame })
        .then((componentId) => {
          this.$nextTick(() => {
            this.$modal.show(`edit-component-modal-${componentId}`)
          })
        })
      }
    }
  }
</script>

<style>
</style>
