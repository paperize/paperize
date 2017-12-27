<template lang="pug">
.game-panel.grid-x.grid-padding.x
  .small-6.cell
    h1 {{ game.title || "[No title]" }}

  .small-6.cell
    .grid-x
      .small-12.cell
        ul.menu
          li
            a.button(@click="printGame()")
              i.fa.fa-file-pdf-o
              |  Print Game
          li
            a(@click="$modal.show('edit-game-modal')") Edit Game
          li
            a(@click="confirmDeletion") Delete Game

  game-form(mode="edit" :game="game")
</template>

<script>
  import { mapActions } from 'vuex'
  import pdfRenderer from '../template/template_examples'
  import GameForm from './GameForm.vue'

  export default {
    props: ["game"],

    components: {
      'game-form': GameForm
    },

    methods: {
      ...mapActions(["deleteGame"]),
      confirmDeletion() {
        this.$modal.show('dialog', {
          title: `Are you sure you want to delete the Game "${this.game.title}"?`,
          text: `It has X Components and was last printed Y.`,
          buttons: [
            {
              title: 'No',
              default: true
            },
            {
              title: 'Yes',
              handler: () => {
                this.deleteGame({ game: this.game })
                this.$modal.hide('dialog')
              }
            }
         ]
        })
      },

      printGame() {
        pdfRenderer.renderGameToPdf(this.game)
      }
    }
  }
</script>
