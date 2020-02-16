<template lang="pug">
v-container(fluid)
  v-layout(row wrap)
    v-flex(sm12)
      .headline Game Manager

      v-tooltip(bottom)
        v-btn(slot="activator" small disabled) Load Example
        span Coming Soon!

      v-dialog(v-model="showGameForm" max-width="500" lazy)
        v-btn.new-game-button(slot="activator" small) New Game
        game-form(@close-dialog="showGameForm = false")

    v-flex(sm12)
      v-container(grid-list-md fluid)
        v-layout(row wrap)
          game-card(v-for="game in allGames" :key="game.id" :game="game")
</template>

<script>
  import GameCard from './GameCard.vue'
  import GameForm from './GameForm.vue'

  export default {
    components: { GameCard, GameForm },

    data() {
      return {
        showGameForm: false
      }
    },

    computed: mapGetters(["allGames"])
  }

</script>
