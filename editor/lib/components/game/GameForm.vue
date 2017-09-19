<template lang="pug">
modal.game-form(:name="modalName" height="auto" :pivotY="0.25" :scrollable="true")
  form(method="post" v-on:submit.prevent="submitForm")
    .grid-x.grid-padding-x
      .small-12.cell
        h2 {{ mode === 'edit' ? 'Edit' : 'Create a New' }} Game

      .small-4.cell
        label(for="game-title") Title:
      .small-8.cell
        input(type="text" id="game-title" name="title" v-model="gameClone.title")

      .small-4.cell
        label(for="game-description") Description:
      .small-8.cell
        textarea(id="game-description" name="description" v-model="gameClone.description")

      .small-4.cell
        label(for="game-player-count") Player Count:
      .small-8.cell
        input(type="text" id="game-player-count" name="player-count" v-model="gameClone.playerCount")

      .small-4.cell
        label(for="game-age-range") Age Range:
      .small-8.cell
        input(type="text" id="game-age-range" name="age-range" v-model="gameClone.ageRange")

      .small-4.cell
        label(for="game-play-time") Play Time:
      .small-8.cell
        input(type="text" id="game-play-time" name="play-time" v-model="gameClone.playTime")

      .small-4.cell
        button.button.small.alert(type="button" @click="closeModal") Cancel
      .small-8.cell
        button.button.small.success(type="submit") {{ mode === 'edit' ? 'Edit' : 'Create' }} Game


    button.close-button(aria-label="Close modal" type="button" @click="closeModal")
      span(aria-hidden="true") &times;
</template>

<script>
  import Game from '../../models/game'

  export default {
    props: {
      mode: {
        default: 'edit',
        type: String,
        validator: (mode) => mode == 'edit' || mode == 'create'
      },
      game: {
        default: Game.factory
      }
    },

    data() {
      return {
        gameClone: { ...this.game },
        modalName: `${this.mode}-game-modal`
      }
    },

    methods: {
      submitForm () {
        // Add or update the game in the store
        if(this.mode === 'edit') {
          this.$store.dispatch("updateGame", { game: this.gameClone })
        } else if(this.mode === 'create') {
          this.$store.commit("createGame", { game: this.gameClone })
          this.$router.push({ name: "gameEditor", params: { gameId: this.gameClone.id }})
        }
        // Close the modal
        this.closeModal()
        // Alert our parents we've submitted
        this.$emit("submitted")
        // Reset the model
        this.gameClone = { ...this.game }
      },

      closeModal () {
        this.$modal.hide(this.modalName)
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
