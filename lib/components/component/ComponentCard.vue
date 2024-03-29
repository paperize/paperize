<template lang="pug">
v-flex.component(sm10 :elevation-10="isActiveComponent()" :class="{ active: isActiveComponent() }" @click="setActive")
  v-card
    v-card-title
      .headline {{ component.title || "[No title]" }} {{ quantityLabel }}

    v-card-actions
      v-btn(small @click="$emit('edit-me')") Edit
      v-btn(small color="red" @click.stop="showDeleteDialog = true") Delete
  v-dialog(v-model="showDeleteDialog" max-width="500")
    v-card.delete-component
      v-card-title
        .headline Are you sure you want to delete this component?
      v-card-text It will be lost forever.
      v-card-actions
        v-btn(@click="showDeleteDialog = false") No
        v-btn(@click="deleteComponent") Yes
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    props: {
      component: {
        required: true
      }
    },

    mounted() {
      if(this.component.spreadsheetId) {
        this.ensureSheetIndexed(this.component.spreadsheetId)
      }
    },

    data() {
      return {
        showDeleteDialog: false
      }
    },

    computed: {
      ...mapGetters([
        "activeGame",
        "activeComponent",
        "getItemQuantity"
      ]),

      quantityLabel() {
        const quantity = this.getItemQuantity(this.component)
        return quantity > 0 ? `(${quantity})` : ""
      }
    },

    methods: {
      ...mapActions(["destroyGameComponent", "ensureSheetIndexed"]),

      setActive() {
        if(this.isActiveComponent()) { return }
        let gameId = this.activeGame.id,
          componentId = this.component.id
        this.$router.push({ name: 'componentEditor', params: { gameId, componentId } })
      },

      isActiveComponent() {
        return this.component.id === (this.activeComponent && this.activeComponent.id)
      },

      deleteComponent() {
        this.destroyGameComponent({ game: this.activeGame, component: this.component})
        this.showDeleteDialog = false
      }
    }
  }
</script>

<style scoped>
  .component {
    cursor: pointer;
  }

  .component.active {
    cursor: default;
  }
</style>
