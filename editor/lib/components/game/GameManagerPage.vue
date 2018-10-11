<template lang="pug">
v-container(fluid)
  v-layout(row wrap)
    v-flex(sm12)
      .headline Game Manager

      ul.menu
        li
          a Load Example
        li
          a(@click="$modal.show('Game Modal')") New Game

    v-flex(sm12)
      v-layout(row wrap)
        game-card(v-for="game in allGames" :key="game.id" :game="game")
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
