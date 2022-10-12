<template lang="pug">
v-container(fluid)
  v-layout(wrap)
    v-flex(sm12)
      .headline Game Manager

      v-tooltip(bottom)
        template(v-slot:activator="{ on }")
          v-btn(v-on="on" small disabled) Load Example
        span Coming Soon!

      v-dialog(v-model="showGameForm" max-width="500")
        template(v-slot:activator="{ on }")
          v-btn.new-game-button(v-on="on" small) New Game
        new-game-form(@close-dialog="showGameForm = false")

    v-flex(sm12)
      v-container(grid-list-md fluid)
        v-layout(wrap)
          game-card(v-for="game in allGames" :key="game.id" :game="game")
</template>

<script>
import { mapGetters } from 'vuex'
import GameCard from './GameCard.vue'
import NewGameForm from './NewGameForm.vue'

export default {
  components: { GameCard, NewGameForm },

  data() {
    return {
      showGameForm: false
    }
  },

  computed: mapGetters(["allGames"])
}

</script>
