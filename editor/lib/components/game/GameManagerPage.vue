<template lang="pug">
v-container(fluid)
  v-layout(row wrap)
    v-flex(sm12)
      .headline Game Manager

      v-btn(small) Load Example
      v-dialog(max-width="500" lazy)
        v-btn(slot="activator" small) New Game
        game-form

    v-flex(sm12)
      v-layout(row wrap)
        game-card(v-for="game in allGames" :key="game.id" :game="game")
</template>

<script>
  import { mapState, mapGetters } from 'vuex'
  import GameCard from './GameCard.vue'
  import GameForm from './GameForm.vue'

  export default {
    components: { GameCard, GameForm },

    computed: {
      ...mapState(["user"]),
      ...mapGetters(["allGames"])
    }
  }

</script>
