<template lang="pug">
v-flex.game(sm6 md4 lg3 :id="`game-${ game.id }`")
  v-card
    v-card-title
      .headline {{ game.title || "[No title]" }}

    v-responsive
      img(:src="game.coverArt")

    v-card-actions
      v-btn
        router-link.small.button(:to="{ name: 'gameEditor', params: { gameId: game.id } }") Edit
      v-btn(@click="confirmDeletion()") Delete
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
