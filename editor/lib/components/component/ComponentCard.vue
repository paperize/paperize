<template lang="pug">
v-flex.component(sm10 :class="{ active: isActiveComponent() }" @click="setActive")
  v-card
    v-card-title
      .headline {{ component.title || "[No title]" }} ({{ totalItems }})

    v-card-text
      p {{ component.type || "[No type]" }}

    v-card-actions
      v-btn(@click="$emit('edit-me')") Edit
      v-btn(color="red" @click.stop="confirmDeletion") Delete
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    props: {
      component: {
        required: true
      }
    },

    computed: {
      ...mapGetters(["activeGame", "activeComponent"]),

      totalItems() {
        return this.$store.getters.getItemQuantity(this.component)
      }
    },

    methods: {
      ...mapActions(["destroyGameComponent"]),

      setActive() {
        if(this.isActiveComponent()) { return }
        let gameId = this.$store.getters.activeGame.id,
          componentId = this.component.id
        this.$router.push({ name: 'componentEditor', params: { gameId, componentId } })
      },

      isActiveComponent() {
        return this.component.id === (this.activeComponent && this.activeComponent.id)
      },

      confirmDeletion() {
        this.$modal.show("dialog", {
          title: 'Are you sure you want to delete this component?',
          text: 'It will be lost forever.',
          buttons: [
            {
              title: 'No',
              default: true
            },
            {
              title: 'Yes',
              handler: () => {
                this.destroyGameComponent({ game: this.activeGame, component: this.component})
                this.$modal.hide('dialog')
              }
            }
         ]
        })
      }
    }
  }
</script>

<style scoped>

</style>
