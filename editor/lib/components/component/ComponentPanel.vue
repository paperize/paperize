<template lang="pug">
v-layout(column).component-panel
  v-flex(sm12)
    .headline Components

    v-btn(small @click="createComponentAndShowForm") New Component
    v-dialog(v-model="showEditDialog" max-width="500")
      component-form(v-if="activeComponent" :component="activeComponent" @close-dialog="showEditDialog = false")

  component-card(v-for="component in components" :key="component.id" :component="component" @edit-me="showEditDialog = true")
</template>

<script>
  import { mapGetters } from 'vuex'
  import ComponentCard from './ComponentCard.vue'
  import ComponentForm from './ComponentForm.vue'

  export default {
    props: ["components"],

    components: {
      "component-card": ComponentCard,
      "component-form": ComponentForm
    },

    data() {
      return {
        showEditDialog: false
      }
    },

    computed: mapGetters(["activeGame", "activeComponent"]),

    methods: {
      createComponentAndShowForm() {
        this.$store.dispatch("createGameComponent", { game: this.activeGame })
        .then((componentId) => {
          this.$store.dispatch("setActiveComponent", componentId)
          this.showEditDialog = true
        })
      }
    }
  }
</script>

<style>
</style>
