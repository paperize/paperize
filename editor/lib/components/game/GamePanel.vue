<template lang="pug">
.game-panel.grid-x.grid-padding.x
  .small-6.cell
    h1 {{ game.title || "[No title]" }}

  .small-6.cell
    .grid-x
      .small-12.cell
        ul.menu
          li
            a.button.tiny(@click="printGame()") Print Game
          li
            a(@click="$modal.show('edit-game-modal')") Edit Game
          li
            a(@click="deleteGame(game)") Delete Game

  game-form(mode="edit" :game="game")
</template>

<script>
  import pdfRenderer from '../template/template_examples'
  import GameForm from './GameForm.vue'

  export default {
    props: ["game"],

    components: {
      'game-form': GameForm
    },

    methods: {
      deleteGame(game) {
        this.$store.dispatch("deleteGame", { game })
        this.$router.push({ name: "gameManager" })
      },

      printGame() {
        pdfRenderer.renderGameToPdf(this.game)
      }
    }
  }
</script>
