<template lang="pug">
.game.card.small-6.medium-4.large-3.cell(:id="`game-${ game.id }`")
  .card-divider
    h4 {{ game.title || "[No title]" }}

  img(v-bind:src="game.coverArt")

  .card-section
    ul.menu
      li
        router-link.small.button(:to="{ name: 'gameEditor', params: { gameId: game.id } }") Edit
      li
        a.small.button.alert(@click="deleteGame({ game })") Delete
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    props: {
      game: {
        required: true
      }
    },

    methods: mapActions(["deleteGame"])
  }
</script>

<style scoped>
  dd {
    font-size: .8em;
  }
</style>
