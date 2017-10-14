<template lang="pug">
.game-panel.grid-x.grid-padding.x
  .small-6.cell
    h1 {{ game.title || "[No title]" }}
    span {{ game.description || "[No description]"  }}

  .small-6.cell
    .grid-x
      .small-12.cell
        ul.menu
          li
            a(@click="$modal.show('edit-game-modal')") Edit Game
          li
            a(@click="deleteGame(game)") Delete Game
      .small-4.cell
        dl
          dt Players
          dd {{ game.playerCount || "[Not set]"  }}
      .small-4.cell
        dl
          dt Play Time
          dd {{ game.playTime || "[Not set]"  }}
      .small-4.cell
        dl
          dt Ages
          dd {{ game.ageRange || "[Not set]"  }}
  game-form(mode="edit" :game="game")
</template>

<script>
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
      }
    }
  }
</script>
