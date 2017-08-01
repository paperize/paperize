<template lang="pug">
.grid-container
  .grid-x(v-if="!authenticated")
    p
      | You are not logged in.
      a(v-on:click="login") Click here to log in now.

  .grid-x.grid-margin-x(v-else)
    .small-12.cell
      h2 Game Manager

      ul.menu
        li
          a(data-open="new-game-modal") Load Example
        li
          a(data-open="new-game-modal") New Game

    game-card(v-for="game in games" :key="game.id" :game="game")

    game-form#new-game-modal(:game="newGame" @submitted="resetNewGame")
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import Game from '../models/game'
  import GameCard from '../components/GameCard.vue'
  import GameForm from '../components/GameForm.vue'

  let gameFactory = () => Game.factory()

  export default {
    components: {
      "game-card": GameCard,
      "game-form": GameForm
    },

    data () {
      return {
        newGame: gameFactory()
      }
    },

    computed: {
      ...mapState(["authenticated", "games"])
    },

    methods: {
      ...mapActions(["login"]),

      resetNewGame () {
        this.newGame = gameFactory()
      }
    }
  }

</script>
