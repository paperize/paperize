<template lang="pug">
v-layout(column).component-panel
  v-flex(sm12)
    .headline Components

    v-dialog(v-model="showNewDialog" max-width="500" lazy)
      v-btn(small slot="activator") New Component
      new-component-form(@close-dialog="showNewDialog = false")

    v-dialog(v-model="showEditDialog" max-width="500" lazy)
      edit-component-form(:component="editComponent" @close-dialog="showEditDialog = false")

  component-card(v-for="component in components" :key="component.id" :component="component" @edit-me="editComponent = component; showEditDialog = true")
</template>

<script>
  import { mapGetters } from 'vuex'
  import ComponentCard from './ComponentCard.vue'
  import NewComponentForm from './NewComponentForm.vue'
  import EditComponentForm from './EditComponentForm.vue'

  export default {
    props: ["components"],

    components: { ComponentCard, NewComponentForm, EditComponentForm },

    data() {
      return {
        showNewDialog: false,
        showEditDialog: false,
        editComponent: null
      }
    },
  }
</script>
