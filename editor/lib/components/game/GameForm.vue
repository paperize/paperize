<template lang="pug">
modal.game-form(name="Game Modal" height="auto" :pivotY="0.25" :scrollable="true")
  form(method="post" v-on:submit.prevent="submitGame")
    .grid-x.grid-padding-x
      .small-12.cell
        h2 Game

      .small-4.cell
        label(for="game-title") Title:
      .small-8.cell
        input(type="text" id="game-title" name="title" v-model="gameTitle")
      .small-4.cell
        //- button.button.small.alert(type="button" @click="closeModal") Cancel
      .small-8.cell
        button.button.small.success(type="submit") Start Editing


    button.close-button(aria-label="Close modal" type="button" @click="closeModal")
      span(aria-hidden="true") &times;
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    props: {
      game: {
        default() { return {} }
      }
    },

    data() {
      return {
        gameTitle: this.game.title
      }
    },

    methods: {
      ...mapActions(["createGame", "updateGame"]),

      submitGame() {
        if(this.game.id) {
          this.updateGame({ ...this.game, title: this.gameTitle })
        } else {
          this.createGame({ title: this.gameTitle })
        }

        this.closeModal()
      },

      closeModal() {
        this.$modal.hide("Game Modal")
      }
    }
  }
</script>

<style scoped>
  h2 {
    text-decoration: underline;
  }

  label {
    font-size: 1.25em;
    text-align: right;
  }
</style>
