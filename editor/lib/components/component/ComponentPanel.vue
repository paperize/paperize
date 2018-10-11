<template lang="pug">
v-layout(column).component-panel
  v-flex(sm12)
    .headline Components

    ul.menu
      li
        a(@click="createComponentAndShowForm") New Component

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
