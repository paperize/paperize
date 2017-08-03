<template lang="pug">
div(v-if="!game")
  p no game selected
.grid-container(v-else)
  game-panel(:game="game")

  hr

  .grid-x.grid-padding.x
    .small-3.cell
      component-panel(:components="game.components")

    .small-9.cell
      .active-component
        h2 Active Component
</template>

<script>
  import { mapState } from 'vuex'

  import GamePanel from '../components/GamePanel.vue'
  import ComponentPanel from '../components/ComponentPanel.vue'

  export default {
    props: ['gameId'],
    computed: { ...mapState({ game: 'selectedGame' }) },
    components: {
      "game-panel":      GamePanel,
      "component-panel": ComponentPanel
    },
    methods: { }

  }
</script>

<style>

</style>
