<template lang="pug">
.component.card.small-12.cell(:class="{ active: isActiveComponent() }" @click="setActive")
  component-form(:id="editFormId" mode='edit' :component="component")
  .card-divider
    p.title {{ component.title }}

  img(src="http://fillmurray.com/80/60")

  .card-section
    p {{ component.type }}

    ul.menu
      li
        a(:data-open="editFormId") Edit
      li
        a(@click.stop="deleteComponent") Delete
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
        if(this.isActiveComponent()) {
          return
        }
        this.$store.commit("setActiveComponent", { component: this.component })
      },

      isActiveComponent() {
        return this.component.id === (this.activeComponent && this.activeComponent.id)
      },

      deleteComponent() {
        this.$store.commit("deleteComponent", { component: this.component })
      }
    }
  }
</script>

<style scoped>
  .component {
    cursor: pointer;
  }

  .component:hover, .component.active {
    box-shadow: 5px 5px 5px gray;
  }

  .component.active {
    cursor: initial;
  }

  .component .menu {
    display: none;
  }

  .component.active .menu {
    display: initial;
  }

  .component.active.card .title {
    font-weight: bold;
  }
</style>
