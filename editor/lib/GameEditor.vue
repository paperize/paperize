<template lang="pug">
div
  title-bar

  .row
    .columns.small-6
      h1 {{ game.title }}
      span {{ game.description }}

    .columns.small-6
      .row
        .columns.small-4
          dl
            dt Players
            dd {{ game.players }}
        .columns.small-4
          dl
            dt Play Time
            dd {{ game.playTime }}
        .columns.small-4
          dl
            dt Ages
            dd {{ game.ages }}

  hr

  .row
    .columns.small-3
      h2 Components

      ul
        li(v-for="component in game.components") {{ component.title }} {{ component.type }}

    .columns.small-9
      .sources
        .menu-centered
          ul.menu
            li.menu-item
              a Images
            li.menu-item
              a Icons
            li.menu-item
              a Fonts
            li.menu-item
              a Spreadsheets

      hr

      .active-component
        h2 Active Component
</template>

<script>

  import TitleBar from './TitleBar.vue'
  import GameRepo from './game.js'

  let game = {}
  let activeComponentId = null

  export default {
    props: ['gameId'],
    data: () => {
      return {
        game: { title: 'what'},
        activeComponentId
      }
    },
    components: {
      "title-bar": TitleBar
    },
    created () { // View first created (callback)
      this.refreshGame()
    },
    watch: { // Route changed
      '$route': 'refreshGame'
    },
    methods: {
      selectComponent: (component) => {
        activeComponentId = component.id
      },
      checkActiveComponent: (component) => {
        activeComponentId == component.id
      },
      refreshGame () {
        this.game = {}
        this.loading = true

        GameRepo.find(this.$route.params.gameId)

        .then((game) => {
          this.loading = false
          this.game = game
        })

        .catch((err) =>{
          this.error = err.toString()
        })
      }
    }

  }
</script>

<style>

</style>
