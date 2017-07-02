<template lang="pug">
div
  title-bar

  .row.small-up-1.medium-up-1.large-up-2
    .column
      games-list

    .column
      h2 Templates
      ul
        li Coming
        li Soon

    .column
      h2 Images
      ul
        li Coming
        li Soon

    .column
      h2 Icons
      ul
        li Coming
        li Soon

    .column
      h2 Fonts
      ul
        li Coming
        li Soon
</template>

<script>
  import TitleBar from "./TitleBar.vue"
  import GamesList from "./GamesList.vue"

  export default {
    data: () => {
      return {a: 'boogey woogeeey'}
    },
    components: {
      'title-bar': TitleBar,
      'games-list': GamesList
    }
  }
</script>

<style>

</style>
