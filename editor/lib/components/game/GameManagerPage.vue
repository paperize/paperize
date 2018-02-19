<template lang="pug">
.grid-container
  .grid-x.grid-margin-x
    .small-12.cell
      h2 Game Manager

      ul.menu
        li
          a Load Example
        li
          a(@click="$modal.show('Game Modal')") New Game

    .small-12.cell
      .grid-x.grid-margin-x
        game-card(v-for="game in allGames" :key="game.id" :game="game")

    game-form
</template>

<script>
  import { mapState, mapGetters } from 'vuex'
  import GameCard from './GameCard.vue'
  import GameForm from './GameForm.vue'

  export default {
    components: {
      "game-card": GameCard,
      "game-form": GameForm
    },

    computed: {
      ...mapState(["user"]),
      ...mapGetters(["allGames"])
    }
  }

</script>
