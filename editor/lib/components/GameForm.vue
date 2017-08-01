<template lang="pug">
.reveal(data-reveal)
  h1 Create a New Game
  hr

  form(method="post" v-on:submit.prevent="submitForm")
    label(for="game-title") Title
    input(id="game-title" name="title" v-model="game.title")

    label(for="game-description") Description
    textarea(id="game-description" name="description" v-model="game.description")

    label(for="game-player-count") Player Count
    input(id="game-player-count" name="player-count" v-model="game.playerCount")

    label(for="game-age-range") Age Range
    input(id="game-age-range" name="age-range" v-model="game.ageRange")

    label(for="game-play-time") Play Time
    input(id="game-play-time" name="play-time" v-model="game.playTime")

    input(type="submit" value="Create Game")

  button.close-button(aria-label="Close modal" type="button" data-close)
    span(aria-hidden="true") &times;
</template>

<script>
  import FoundationMixin from '../mixins/foundation'

  export default {
    mixins: [FoundationMixin],

    props: {
      game: {
        required: true
      }
    },

    methods: {
      submitForm () {
        // Add the game to the store
        this.$store.commit("createGame", { game: this.game })
        // Close the modal
        $(this.$el).foundation('close');
        // Alert our parents we've submitted
        this.$emit("submitted")
      }
    }
  }
</script>
