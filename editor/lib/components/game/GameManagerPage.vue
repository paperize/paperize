<template lang="pug">
.grid-container
  .grid-x(v-if="!user.authenticated")
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
          a(@click="$modal.show('create-game-modal')") New Game

    .small-12.cell
      .grid-x.grid-margin-x
        game-card(v-for="game in games" :key="game.id" :game="game")

    game-form(mode="create")
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
      ...mapState(["user"]),
      ...mapGetters(["games"])
    },

    methods: {
      ...mapActions(["login"])
    }
  }

</script>
