<template lang="pug">
.game.card.small-6.medium-4.large-3.cell(:id="`game-${ game.id }`")
  .card-divider
    h4 {{ game.title }}

  img(v-bind:src="game.coverArt")

  .card-section
    p {{ game.description }}
    dl.grid-x
      .small-4.cell
        dt Ages:
        dd {{ game.ageRange }}
      .small-4.cell
        dt Play Time:
        dd {{ game.playTime }}
      .small-4.cell
        dt Players:
        dd {{ game.playerCount }}
</template>

<script>
  export default {
    props: {
      game: {
        required: true
      }
    }
  }
</script>

<style scoped>
  dd {
    font-size: .8em;
  }
</style>
