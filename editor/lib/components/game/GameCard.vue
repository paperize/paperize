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
        a.small.button.alert(@click="confirmDeletion()") Delete
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    props: {
      game: {
        required: true
      }
    },

    methods: {
      ...mapActions(["destroyGame"]),
      confirmDeletion() {
        this.$modal.show('dialog', {
          title: 'Are you sure you want to delete this game?',
          text: 'It has X components and will be lost forever.',
          buttons: [
            {
              title: 'No',
              default: true
            },
            {
              title: 'Yes',
              handler: () => {
                this.destroyGame(this.game)
                this.$modal.hide('dialog')
              }
            }
         ]
        })
      }
    }
  }
</script>

<style scoped>
  dd {
    font-size: .8em;
  }
</style>
