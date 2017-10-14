<template lang="pug">
.game.card.small-6.medium-4.large-3.cell(:id="`game-${ game.id }`")
  .card-divider
    h4 {{ game.title || "[No title]" }}

  img(v-bind:src="game.coverArt")

  .card-section
    p {{ game.description || "[No description set.]" }}
    dl.grid-x
      .small-4.cell
        dt Ages:
        dd {{ game.ageRange || "[Not set.]" }}
      .small-4.cell
        dt Play Time:
        dd {{ game.playTime || "[Not set.]" }}
      .small-4.cell
        dt Players:
        dd {{ game.playerCount || "[Not set.]" }}

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
