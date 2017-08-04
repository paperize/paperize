<template lang="pug">
.component.card.small-12.medium-8.cell(:class="{ active: isActiveComponent() }" @click="setActive")
  component-form(:id="editFormId" mode='edit' :component="component")
  .card-divider
    p {{ component.title }}

  img(src="http://fillmurray.com/80/60")

  .card-section
    p {{ component.type }}

    ul.menu
      li
        a(:data-open="editFormId") Edit
</template>

<script>
  import { mapState } from 'vuex'
  import ComponentForm from './ComponentForm.vue'

  export default {
    props: {
      component: {
        required: true
      }
    },

    components: {
      "component-form": ComponentForm
    },

    computed: {
      ...mapState(["activeComponent"]),

      editFormId() {
        return `edit-component-form-${this.component.id}`
      }
    },

    methods: {
      setActive() {
        this.$store.commit("setActiveComponent", { component: this.component })
      },

      isActiveComponent() {
        return this.component.id === (this.activeComponent && this.activeComponent.id)
      }
    }
  }
</script>

<style scoped>
  .component .menu {
    display: none;
  }

  .component.active .menu {
    display: initial;
  }
</style>
