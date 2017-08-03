<template lang="pug">
.game-panel.grid-x.grid-padding.x
  .small-6.cell
    h1 {{ game.title }}
    span {{ game.description }}

  .small-6.cell
    .grid-x
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
</template>

<script>
  export default {
    props: ["game"]
  }
</script>
