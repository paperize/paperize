<template lang="pug">
v-layout(column).component-panel
  v-flex(sm12)
    .headline Components

    v-dialog(v-model="showEditDialog" max-width="500" lazy)
      v-btn(small slot="activator" @click="editComponent = {}") New Component
      component-form(@close-dialog="showEditDialog = false" :component="editComponent")

  component-card(v-for="component in components" :key="component.id" :component="component" @edit-me="showEditDialog = true; editComponent = component")
</template>

<script>
  import { mapGetters } from 'vuex'
  import ComponentCard from './ComponentCard.vue'
  import ComponentForm from './ComponentForm.vue'

  export default {
    props: ["components"],

    components: { ComponentCard, ComponentForm },

    data() {
      return {
        editComponent: {},
        showEditDialog: false
      }
    },
  }
</script>
