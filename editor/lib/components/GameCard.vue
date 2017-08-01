<template lang="pug">
.card.small-6.medium-4.large-3.cell
  .card-divider
    h4 {{ this.game.title }}

  img(v-bind:src="game.coverArt")

  .card-section
    h4 This is a card.
    p It has an easy to override visual style, and is appropriately subdued.
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
