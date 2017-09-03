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
          a Load Example
        li
          a(data-open="new-game-modal") New Game

    .small-12.cell
      .grid-x.grid-margin-x
        game-card(v-for="game in games" :key="game.id" :game="game")

    game-form#new-game-modal(mode='create')
</template>

<script>
  import { mapState, mapGetters, mapActions } from 'vuex'
  import GameCard from './GameCard.vue'
  import GameForm from './GameForm.vue'

  export default {
    components: {
      "game-card": GameCard,
      "game-form": GameForm
    },

    computed: {
      ...mapState(["authenticated"]),
      ...mapGetters(["games"])
    },

    methods: {
      ...mapActions(["login"])
    }
  }

</script>
