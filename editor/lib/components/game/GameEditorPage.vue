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
        component-editor(v-if="activeComponent" :component="activeComponent")
        h2(v-else) No Component Selected
</template>

<script>
  import { mapState } from 'vuex'

  import GamePanel from './GamePanel.vue'
  import ComponentPanel from '../component/ComponentPanel.vue'
  import ComponentEditor from '../component/ComponentEditor.vue'

  export default {
    props: ['gameId'],
    computed: { ...mapState({ game: 'selectedGame', activeComponent: 'activeComponent' }) },
    components: {
      "game-panel":       GamePanel,
      "component-panel":  ComponentPanel,
      "component-editor": ComponentEditor
    },
    methods: { }
  }
</script>

<style>

</style>
