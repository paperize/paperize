<template lang="pug">
.game-panel.grid-x.grid-padding.x
  .small-6.cell
    h1 {{ game.title }}
    span {{ game.description }}

  .small-6.cell
    .grid-x
      .small-12.cell
        ul.menu
          li
            a(data-open="edit-game-modal") Edit Game
          li
            a(@click="deleteGame(game)") Delete Game
      .small-4.cell
        dl
          dt Players
          dd {{ game.playerCount }}
      .small-4.cell
        dl
          dt Play Time
          dd {{ game.playTime }}
      .small-4.cell
        dl
          dt Ages
          dd {{ game.ageRange }}
  game-form#edit-game-modal(mode="edit" :game="game")
</template>

<script>
  import GameForm from '../components/GameForm.vue'

  export default {
    props: ["game"],

    components: {
      'game-form': GameForm
    },

    methods: {
      deleteGame(game) {
        this.$store.commit("deleteGame", { game })
        this.$router.push({ name: "gameManager" })
      }
    }
  }
</script>
