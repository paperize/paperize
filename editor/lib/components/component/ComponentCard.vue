<template lang="pug">
.component.card.small-10.small-offset-1.cell(:class="{ active: isActiveComponent() }" @click="setActive")
  component-form(mode='edit' :component="component")
  .card-divider
    p.title {{ component.title || "[No title]" }} ({{ totalItems }})

  .card-section
    p {{ component.type || "[No type]" }}

    ul.menu
      li
        a.button.small(@click="showEditModal") Edit
      li
        a.button.small.alert(@click.stop="deleteComponent") Delete
</template>

<script>
  import { mapGetters } from 'vuex'
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
      ...mapGetters(["activeComponent"]),
      totalItems() {
        return this.$store.getters.getComponentItems(this.component).length
      }
    },

    methods: {
      showEditModal() {
        this.$modal.show(`edit-component-modal-${this.component.id}`)
      },

      setActive() {
        if(this.isActiveComponent()) { return }
        let gameId = this.$store.getters.activeGame.id,
            componentId = this.component.id
        this.$router.push({ name: 'componentEditor', params: { gameId, componentId } })
      },

      isActiveComponent() {
        return this.component.id === (this.activeComponent && this.activeComponent.id)
      },

      deleteComponent() {
        this.$store.dispatch("deleteComponent", { component: this.component })
      }
    }
  }
</script>

<style scoped>
  .component {
    cursor: pointer;
  }

    /* Animate in drop shadow on selection */
  .component {
    box-shadow: 0; /* 1px 2px rgba(0,0,0,0.15); */
    transition: all .3s ease-out ;
    opacity: .75;
  }

  /* Pre-render the bigger shadow, but hide it */
  .component::after {
    box-shadow: 0 5px 15px rgba(0,0,0,0.5);
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
  }

  /* Transition to showing the bigger shadow on hover */
  .component:hover, .component.active {
    box-shadow: 0 5px 15px rgba(0,0,0,0.5);
    opacity: 1;
  }

  /*.component:hover, .component.active {
    box-shadow: 5px 5px 5px gray;
  }*/

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
