<template lang="pug">
.reveal(data-reveal)
  h1 {{ mode === 'edit' ? 'Edit' : 'Create a New' }} Game
  hr

  form(method="post" v-on:submit.prevent="submitForm")
    .grid-x.grid-margin-x
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


    button.button.alert(type="button" @click="closeModal") Cancel
    button.button.success(type="submit") {{ mode === 'edit' ? 'Edit' : 'Create' }} Game


  button.close-button(aria-label="Close modal" type="button" @click="closeModal")
    span(aria-hidden="true") &times;
</template>

<script>
  import FoundationMixin from '../mixins/foundation'
  import Game from '../models/game'

  export default {
    mixins: [FoundationMixin],

    // The way Foundation's Reveal works, it moves the dom element up to be a
    // direct child of <body>, removing Vue's ability to remove it cleanly upon
    // destroy. Add a little extra love here to see that the job is really done!
    destroyed() {
      $(this.$el).remove()
    },

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
        gameClone: { ...this.game }
      }
    },

    methods: {
      submitForm () {
        // Add or update the game in the store
        if(this.mode === 'edit') {
          this.$store.commit("updateGame", { game: this.gameClone })
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
        $(this.$el).foundation('close')
      }
    }
  }
</script>

<style scoped>
  label {
    font-size: 1.25em;
    text-align: right;
  }
</style>
