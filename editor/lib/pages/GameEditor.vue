<template lang="pug">
div
  .row
    .columns.small-6
      h1 {{ game.title }}
      span {{ game.description }}

    .columns.small-6
      .row
        .columns.small-4
          dl
            dt Players
            dd {{ game.playerCount }}
        .columns.small-4
          dl
            dt Play Time
            dd {{ game.playTime }}
        .columns.small-4
          dl
            dt Ages
            dd {{ game.ageRange }}

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

  export default {
    props: ['gameId'],
    data: () => {
      return {
        game: { title: 'what', components: [ ]}
      }
    },
    components: {
      // "title-bar": TitleBar
    },
    methods: { }

  }
</script>

<style>

</style>
