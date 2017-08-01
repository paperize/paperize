<template lang="pug">
div(v-if="!authenticated")
  p
    | You are not logged in.
    a(v-on:click="login") Click here to log in now.

div(v-else)
  h2 Game Manager

  .card(style="width: 300px;" v-for="game in games")
    .card-divider
      h4 {{ game.title }}

    img(v-bind:src="game.coverArt")

    .card-section
      h4 This is a card.
      p It has an easy to override visual style, and is appropriately subdued.

  a(data-open="new-game-modal") New Game

  .reveal#new-game-modal(data-reveal)
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
  import { mapState, mapActions } from 'vuex'

  import Game from '../models/game'

  export default {
    mixins: [FoundationMixin],

    data () {
      return {
        game: Game.factory()
      }
    },

    computed: {
      ...mapState(["authenticated", "games"])
    },

    methods: {
      ...mapActions(["login"]),

      submitForm () {
        // Add the game to the store
        this.$store.commit("createGame", { game: this.game })
        // Close the modal
        $('#new-game-modal').foundation('close');
        // Wipe the game
        this.game = Game.factory(Game.EX_BILL)
      }
    }
  }

</script>
